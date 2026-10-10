/**
 * Supabase AuthProvider.
 *
 * Supabase Auth owns credentials, sessions (cookies via @supabase/ssr) and the
 * transactional emails it sends itself (verification, magic link, recovery).
 * Our `profiles` table mirrors auth.users by id and is created on first sight
 * of a user from their metadata.
 *
 * Flow mapping:
 * - Sign-up / magic link / OAuth / recovery all redirect to
 *   <siteUrl>/auth/callback?next=… which must call `completeOAuth({ code })`
 *   (or `completeMagicLink({ token: code })`) to exchange the PKCE code.
 * - "Remember me" is not configurable per session in Supabase; sessions are
 *   persisted with the project's refresh-token lifetime. We report
 *   `remember: true`.
 * - ensureAccount creates a confirmed user via the admin API and emails a
 *   recovery (set-password) action link through our EmailProvider.
 *
 * Schema assumptions: `profiles.id = auth.users.id`; columns as in
 * src/lib/types.ts.
 */
import { createElement, type ReactElement } from "react";
import type { User } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { site } from "@/lib/config/site";
import type { Profile, Role } from "@/lib/types";
import { isValidEmail, normalizeEmail, nowIso } from "@/lib/utils";
import { validatePassword } from "@/lib/auth/password";
import type { AuthProvider, AuthResult, DataStore, EmailProvider, Session } from "@/services/types";
import { createAdminSupabase, createServerSupabase } from "./client";

const MESSAGES = {
  invalidEmail: "Please enter a valid email address.",
  invalidCredentials: "That email and password don't match. Please try again.",
  emailTaken: "An account with that email already exists. Try signing in instead.",
  rateLimited: "Too many attempts. Please wait a few minutes and try again.",
  unverified: "Please verify your email first — we've sent you a link.",
  invalidLink: "That link is no longer valid. Please request a new one.",
  unknownUser: "We couldn't find that account.",
  generic: "Something went wrong on our side. Please try again.",
} as const;

function appUrl(pathAndQuery: string): string {
  return `${env.siteUrl.replace(/\/$/, "")}${pathAndQuery}`;
}

function callbackUrl(next?: string): string {
  const target = next && next.startsWith("/") ? next : "/learn";
  return appUrl(`/auth/callback?next=${encodeURIComponent(target)}`);
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ") || "Friend";
}

function metaString(meta: Record<string, unknown> | undefined, keys: string[]): string | null {
  if (!meta) return null;
  for (const key of keys) {
    const v = meta[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

type AuthErrorCode = NonNullable<Extract<AuthResult, { ok: false }>["code"]>;

function mapAuthError(error: { message: string; code?: string; status?: number }): { error: string; code: AuthErrorCode } {
  const code = (error.code ?? "").toLowerCase();
  const msg = error.message.toLowerCase();
  if (code === "user_already_exists" || code === "email_exists" || msg.includes("already registered") || msg.includes("already exists")) {
    return { error: MESSAGES.emailTaken, code: "email_taken" };
  }
  if (code === "email_not_confirmed" || msg.includes("not confirmed")) {
    return { error: MESSAGES.unverified, code: "unverified" };
  }
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || error.status === 429 || msg.includes("rate limit")) {
    return { error: MESSAGES.rateLimited, code: "rate_limited" };
  }
  if (code === "weak_password" || msg.includes("password should")) {
    return { error: error.message, code: "weak_password" };
  }
  if (code === "invalid_credentials" || msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return { error: MESSAGES.invalidCredentials, code: "invalid_credentials" };
  }
  return { error: error.message || MESSAGES.generic, code: "unknown" };
}

function linkEmail(input: { heading: string; intro: string; cta: string; url: string; outro?: string }): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "sans-serif", lineHeight: 1.6, color: "#2e2a27" } },
    createElement("h1", { style: { fontSize: "20px", color: "#9a4f56" } }, input.heading),
    createElement("p", null, input.intro),
    createElement("p", null, createElement("a", { href: input.url, style: { color: "#9a4f56", fontWeight: 600 } }, input.cta)),
    createElement("p", { style: { fontSize: "13px", color: "#6f6660" } }, "Or paste this link into your browser: ", input.url),
    createElement(
      "p",
      { style: { fontSize: "13px", color: "#6f6660" } },
      input.outro ?? "If you didn't request this, you can safely ignore this email.",
    ),
  );
}

export async function createSupabaseAuth(db: DataStore, email: EmailProvider): Promise<AuthProvider> {
  const profiles = () => db.from("profiles");

  // ---- profiles ---------------------------------------------------------

  /** Loads the profile for a Supabase user, creating it from metadata when missing. */
  async function ensureProfile(user: User, overrides: { name?: string; role?: Role } = {}): Promise<Profile | null> {
    const existing = await profiles().get(user.id);
    if (existing) {
      if (existing.deleted_at) return null;
      return existing;
    }
    const emailAddress = normalizeEmail(user.email ?? "");
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const now = nowIso();
    const profile: Profile = {
      id: user.id,
      email: emailAddress,
      name: overrides.name ?? metaString(meta, ["name", "full_name"]) ?? nameFromEmail(emailAddress),
      avatar_url: metaString(meta, ["avatar_url", "picture"]),
      role: overrides.role ?? "learner",
      email_preferences: { progress_nudges: true, drip_unlocks: true, newsletter: true, community: true },
      disclaimer_accepted_at: null,
      stripe_customer_id: null,
      timezone: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };
    // upsert: a DB trigger may have inserted a skeleton row already.
    return profiles().upsert(profile);
  }

  function toSession(profile: Profile): Session {
    return { user_id: profile.id, email: profile.email, role: profile.role, provider: "supabase", remember: true };
  }

  async function resultFor(user: User | null | undefined, overrides: { name?: string; role?: Role } = {}, extra: { needs_verification?: boolean } = {}): Promise<AuthResult> {
    if (!user) return { ok: false, error: MESSAGES.generic, code: "unknown" };
    const profile = await ensureProfile(user, overrides);
    if (!profile) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
    return { ok: true, session: toSession(profile), profile, ...extra };
  }

  /** Exchanges a PKCE code (or, as a fallback, verifies a token hash). */
  async function exchange(token: string, type: "magiclink" | "signup" | "recovery" | "email"): Promise<AuthResult> {
    if (!token) return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
    const supabase = await createServerSupabase();
    const exchanged = await supabase.auth.exchangeCodeForSession(token);
    if (!exchanged.error && exchanged.data.user) return resultFor(exchanged.data.user);
    const verified = await supabase.auth.verifyOtp({ token_hash: token, type });
    if (verified.error || !verified.data.user) {
      return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
    }
    return resultFor(verified.data.user);
  }

  // ---- AuthProvider -----------------------------------------------------

  const provider: AuthProvider = {
    kind: "supabase",

    async getSession() {
      let user: User | null = null;
      try {
        const supabase = await createServerSupabase();
        const { data } = await supabase.auth.getUser();
        user = data.user;
      } catch {
        return null;
      }
      if (!user) return null;
      const profile = await ensureProfile(user);
      return profile ? toSession(profile) : null;
    },

    async signUpWithPassword(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail, code: "unknown" };
      const weak = validatePassword(input.password);
      if (weak) return { ok: false, error: weak, code: "weak_password" };
      const name = (input.name ?? "").trim() || nameFromEmail(emailAddress);
      const role: Role = input.role ?? "learner";

      if (await profiles().findOne({ email: emailAddress })) {
        return { ok: false, error: MESSAGES.emailTaken, code: "email_taken" };
      }

      const supabase = await createServerSupabase();
      if (input.autoVerify) {
        const admin = createAdminSupabase();
        const created = await admin.auth.admin.createUser({
          email: emailAddress,
          password: input.password,
          email_confirm: true,
          user_metadata: { name },
        });
        if (created.error) return { ok: false, ...mapAuthError(created.error) };
        const signedIn = await supabase.auth.signInWithPassword({ email: emailAddress, password: input.password });
        if (signedIn.error) return { ok: false, ...mapAuthError(signedIn.error) };
        return resultFor(signedIn.data.user, { name, role });
      }

      const { data, error } = await supabase.auth.signUp({
        email: emailAddress,
        password: input.password,
        options: { data: { name }, emailRedirectTo: callbackUrl("/learn") },
      });
      if (error) return { ok: false, ...mapAuthError(error) };
      if (!data.user) return { ok: false, error: MESSAGES.generic, code: "unknown" };
      // Supabase returns a user with no identities when the email is already registered.
      if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        return { ok: false, error: MESSAGES.emailTaken, code: "email_taken" };
      }
      const needsVerification = !data.session;
      return resultFor(data.user, { name, role }, needsVerification ? { needs_verification: true } : {});
    },

    async signInWithPassword(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress) || typeof input.password !== "string") {
        return { ok: false, error: MESSAGES.invalidCredentials, code: "invalid_credentials" };
      }
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailAddress, password: input.password });
      if (error) return { ok: false, ...mapAuthError(error) };
      return resultFor(data.user);
    },

    async signOut() {
      try {
        const supabase = await createServerSupabase();
        await supabase.auth.signOut();
      } catch (err) {
        console.warn(`[supabase-auth] signOut: ${(err as Error).message}`);
      }
    },

    async sendMagicLink(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail };
      const supabase = await createServerSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email: emailAddress,
        options: { emailRedirectTo: callbackUrl(input.redirectTo), shouldCreateUser: true },
      });
      if (error) return { ok: false, error: mapAuthError(error).error };
      return { ok: true };
    },

    async completeMagicLink(input) {
      return exchange(input.token, "magiclink");
    },

    async sendVerificationEmail(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail };
      const supabase = await createServerSupabase();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailAddress,
        options: { emailRedirectTo: callbackUrl("/learn") },
      });
      // No enumeration: treat "already confirmed"/unknown as success.
      if (error && mapAuthError(error).code === "rate_limited") return { ok: false, error: MESSAGES.rateLimited };
      return { ok: true };
    },

    async verifyEmail(input) {
      return exchange(input.token, "signup");
    },

    async requestPasswordReset(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: true };
      try {
        const supabase = await createServerSupabase();
        await supabase.auth.resetPasswordForEmail(emailAddress, { redirectTo: callbackUrl("/reset-password") });
      } catch (err) {
        console.warn(`[supabase-auth] requestPasswordReset: ${(err as Error).message}`);
      }
      return { ok: true };
    },

    async resetPassword(input) {
      const weak = validatePassword(input.password);
      if (weak) return { ok: false, error: weak, code: "weak_password" };
      const supabase = await createServerSupabase();
      // The callback usually exchanged the code already; a token here means it did not.
      if (input.token) {
        const exchanged = await exchange(input.token, "recovery");
        if (!exchanged.ok) return exchanged;
      }
      const { data, error } = await supabase.auth.updateUser({ password: input.password });
      if (error) return { ok: false, ...mapAuthError(error) };
      return resultFor(data.user);
    },

    async changePassword(input) {
      const weak = validatePassword(input.newPassword);
      if (weak) return { ok: false, error: weak };
      const profile = await profiles().get(input.userId);
      if (!profile) return { ok: false, error: MESSAGES.unknownUser };
      const supabase = await createServerSupabase();
      const reauth = await supabase.auth.signInWithPassword({ email: profile.email, password: input.currentPassword ?? "" });
      if (reauth.error) return { ok: false, error: "Your current password doesn't match. Please try again." };
      const { error } = await supabase.auth.updateUser({ password: input.newPassword });
      if (error) return { ok: false, error: mapAuthError(error).error };
      return { ok: true };
    },

    async oauthStartUrl(input) {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: input.provider,
        options: { redirectTo: callbackUrl(input.redirectTo), skipBrowserRedirect: true },
      });
      if (error || !data.url) throw new Error(`[supabase-auth] could not start ${input.provider} sign-in: ${error?.message ?? "no url"}`);
      return data.url;
    },

    async completeOAuth(input) {
      if (!input.code) return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.auth.exchangeCodeForSession(input.code);
      if (error) return { ok: false, ...mapAuthError(error) };
      return resultFor(data.user);
    },

    async ensureAccount(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) throw new Error(MESSAGES.invalidEmail);
      const existing = await profiles().findOne({ email: emailAddress });
      if (existing) return { profile: existing, created: false };

      const admin = createAdminSupabase();
      const name = (input.name ?? "").trim() || nameFromEmail(emailAddress);
      let user: User | null = null;
      const created = await admin.auth.admin.createUser({ email: emailAddress, email_confirm: true, user_metadata: { name } });
      if (created.error) {
        // The auth user may exist without a profile (e.g. created in the dashboard).
        const link = await admin.auth.admin.generateLink({ type: "magiclink", email: emailAddress });
        if (link.error || !link.data.user) {
          throw new Error(`[supabase-auth] ensureAccount(${emailAddress}): ${created.error.message}`);
        }
        user = link.data.user;
      } else {
        user = created.data.user;
      }
      const profile = await ensureProfile(user, { name });
      if (!profile) throw new Error(`[supabase-auth] ensureAccount(${emailAddress}): profile is deleted`);

      if (input.sendSetPassword) {
        const link = await admin.auth.admin.generateLink({
          type: "recovery",
          email: emailAddress,
          options: { redirectTo: appUrl("/reset-password?welcome=1") },
        });
        if (link.error) {
          console.warn(`[supabase-auth] set-password link for ${emailAddress}: ${link.error.message}`);
        } else {
          const url = link.data.properties.action_link;
          await email.send({
            to: emailAddress,
            subject: `Welcome to ${site.name} — set your password`,
            template: "set-password",
            react: linkEmail({
              heading: `Welcome to ${site.name}`,
              intro: "Your account is ready. Choose a password to sign in whenever you like.",
              cta: "Set my password",
              url,
              outro: "If you weren't expecting this, you can ignore it — nothing else will happen.",
            }),
            text: `Welcome to ${site.name}. Set your password with this link: ${url}`,
            payload: { url, kind: "set_password" },
          });
        }
      }
      return { profile, created: true };
    },

    async deleteUser(userId) {
      const { error } = await createAdminSupabase().auth.admin.deleteUser(userId);
      if (error && !/not found/i.test(error.message)) {
        throw new Error(`[supabase-auth] deleteUser(${userId}): ${error.message}`);
      }
    },

    async adminSetPassword(input) {
      const weak = validatePassword(input.password);
      if (weak) throw new Error(weak);
      const { error } = await createAdminSupabase().auth.admin.updateUserById(input.userId, {
        password: input.password,
        email_confirm: true,
      });
      if (error) throw new Error(`[supabase-auth] adminSetPassword(${input.userId}): ${error.message}`);
    },
  };

  return provider;
}
