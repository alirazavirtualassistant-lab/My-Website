/**
 * Mock AuthProvider for demo mode.
 *
 * - Users live in `auth_users` (credentials) + `profiles` (same id).
 * - Passwords are bcrypt hashes (cost 10).
 * - Sessions are HS256 JWTs (jose) in the httpOnly `cyc_session` cookie.
 *   "Remember me" = 30-day cookie + token; otherwise a browser-session cookie
 *   whose token expires after 1 day.
 * - Email links (verify / magic link / reset / set-password) are single-use
 *   tokens in `auth_tokens`; only the sha256 hash is stored.
 *
 * Links emitted (all relative to env.siteUrl):
 *   /verify-email?token=…        kind verify_email   (24h)
 *   /auth/magic?token=…          kind magic_link     (15m)
 *   /reset-password?token=…      kind password_reset (1h)
 *   /reset-password?token=…&welcome=1   kind set_password (7d)
 *
 * Email template names used: verify-email, magic-link, password-reset,
 * set-password. Each message carries `payload.url` so the demo mailbox can
 * surface the link.
 */
import { createElement, type ReactElement } from "react";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { site } from "@/lib/config/site";
import type { AuthToken, AuthUser, Profile, Role } from "@/lib/types";
import { isValidEmail, newId, normalizeEmail, nowIso, randomToken, sha256Hex } from "@/lib/utils";
import { validatePassword } from "@/lib/auth/password";
import {
  SESSION_COOKIE_NAME,
  SESSION_DEFAULT_TTL_SEC,
  SESSION_JWT_ISSUER,
  SESSION_REMEMBER_MAX_AGE_SEC,
  clearedSessionCookieOptions,
  sessionCookieOptions,
} from "@/lib/auth/cookies";
import type { AuthProvider, AuthResult, DataStore, EmailProvider, Session } from "@/services/types";

const BCRYPT_COST = 10;

const TOKEN_TTL_MS: Record<AuthToken["kind"], number> = {
  verify_email: 24 * 60 * 60 * 1000,
  magic_link: 15 * 60 * 1000,
  password_reset: 60 * 60 * 1000,
  set_password: 7 * 24 * 60 * 60 * 1000,
};

const RATE_LIMIT_MAX_FAILURES = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

// ---------------------------------------------------------------------------
// Rate limiter (per process; good enough for demo mode)
// ---------------------------------------------------------------------------

interface RateEntry {
  failures: number;
  windowStartedAt: number;
}

declare global {
  var __cycMockAuthRateLimit: Map<string, RateEntry> | undefined;
}

function rateMap(): Map<string, RateEntry> {
  if (!globalThis.__cycMockAuthRateLimit) globalThis.__cycMockAuthRateLimit = new Map();
  return globalThis.__cycMockAuthRateLimit;
}

function isRateLimited(key: string, now = Date.now()): boolean {
  const entry = rateMap().get(key);
  if (!entry) return false;
  if (now - entry.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    rateMap().delete(key);
    return false;
  }
  return entry.failures >= RATE_LIMIT_MAX_FAILURES;
}

function recordFailure(key: string, now = Date.now()): void {
  const entry = rateMap().get(key);
  if (!entry || now - entry.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    rateMap().set(key, { failures: 1, windowStartedAt: now });
  } else {
    entry.failures += 1;
  }
}

function clearFailures(key: string): void {
  rateMap().delete(key);
}

/** Test helper: forget all failed sign-in attempts. */
export function resetMockAuthRateLimiter(): void {
  rateMap().clear();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MESSAGES = {
  invalidEmail: "Please enter a valid email address.",
  invalidCredentials: "That email and password don't match. Please try again.",
  emailTaken: "An account with that email already exists. Try signing in instead.",
  rateLimited: "Too many attempts. Please wait 15 minutes and try again.",
  invalidLink: "That link is no longer valid. Please request a new one.",
  unknownUser: "We couldn't find that account.",
  noPassword: "This account doesn't have a password yet. Use \"Forgot password\" to set one.",
} as const;

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ") || "Friend";
}

function buildProfile(input: { id: string; email: string; name: string; role: Role }): Profile {
  const now = nowIso();
  return {
    id: input.id,
    email: input.email,
    name: input.name,
    avatar_url: null,
    role: input.role,
    email_preferences: { progress_nudges: true, drip_unlocks: true, newsletter: true, community: true },
    disclaimer_accepted_at: null,
    stripe_customer_id: null,
    timezone: null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };
}

function buildAuthUser(input: {
  id: string;
  email: string;
  password_hash: string | null;
  verified: boolean;
  providers: AuthUser["providers"];
}): AuthUser {
  const now = nowIso();
  return {
    id: input.id,
    email: input.email,
    password_hash: input.password_hash,
    email_verified_at: input.verified ? now : null,
    providers: input.providers,
    created_at: now,
  };
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.authSecret);
}

function appUrl(pathAndQuery: string): string {
  return `${env.siteUrl.replace(/\/$/, "")}${pathAndQuery}`;
}

/** Minimal inline email body (src/emails may not exist yet). */
function linkEmail(input: { heading: string; intro: string; cta: string; url: string; outro?: string }): ReactElement {
  return createElement(
    "div",
    { style: { fontFamily: "sans-serif", lineHeight: 1.6, color: "#2e2a27" } },
    createElement("h1", { style: { fontSize: "20px", color: "#9a4f56" } }, input.heading),
    createElement("p", null, input.intro),
    createElement(
      "p",
      null,
      createElement("a", { href: input.url, style: { color: "#9a4f56", fontWeight: 600 } }, input.cta),
    ),
    createElement("p", { style: { fontSize: "13px", color: "#6f6660" } }, "Or paste this link into your browser: ", input.url),
    createElement(
      "p",
      { style: { fontSize: "13px", color: "#6f6660" } },
      input.outro ?? "If you didn't request this, you can safely ignore this email.",
    ),
  );
}

function hasProvider(user: AuthUser, provider: AuthUser["providers"][number]): boolean {
  return user.providers.includes(provider);
}

function withProvider(user: AuthUser, provider: AuthUser["providers"][number]): AuthUser["providers"] {
  return hasProvider(user, provider) ? user.providers : [...user.providers, provider];
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export async function createMockAuth(db: DataStore, email: EmailProvider): Promise<AuthProvider> {
  const users = () => db.from("auth_users");
  const profiles = () => db.from("profiles");
  const tokens = () => db.from("auth_tokens");

  /** A real bcrypt hash compared against when the email is unknown (constant-ish timing). */
  let dummyHashPromise: Promise<string> | null = null;
  const dummyHash = () => (dummyHashPromise ??= bcrypt.hash(randomToken(16), BCRYPT_COST));

  // ---- sessions ---------------------------------------------------------

  async function signSession(input: { userId: string; email: string; remember: boolean }): Promise<string> {
    const ttl = input.remember ? SESSION_REMEMBER_MAX_AGE_SEC : SESSION_DEFAULT_TTL_SEC;
    const now = Math.floor(Date.now() / 1000);
    return new SignJWT({ email: input.email, remember: input.remember, provider: "mock" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(input.userId)
      .setIssuer(SESSION_JWT_ISSUER)
      .setIssuedAt(now)
      .setExpirationTime(now + ttl)
      .sign(secretKey());
  }

  async function setSessionCookie(input: { userId: string; email: string; remember: boolean }): Promise<void> {
    const token = await signSession(input);
    const jar = await cookies();
    jar.set(SESSION_COOKIE_NAME, token, sessionCookieOptions({ remember: input.remember, secure: env.isProduction }));
  }

  async function clearSessionCookie(): Promise<void> {
    const jar = await cookies();
    jar.set(SESSION_COOKIE_NAME, "", clearedSessionCookieOptions(env.isProduction));
  }

  async function readSessionCookie(): Promise<{ userId: string; remember: boolean } | null> {
    let value: string | undefined;
    try {
      value = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Outside a request scope (scripts, tests without a mock) => no session.
      return null;
    }
    if (!value) return null;
    try {
      const { payload } = await jwtVerify(value, secretKey(), { issuer: SESSION_JWT_ISSUER, algorithms: ["HS256"] });
      if (!payload.sub) return null;
      return { userId: payload.sub, remember: payload.remember === true };
    } catch {
      return null;
    }
  }

  async function sessionFor(profile: Profile, remember: boolean): Promise<Session> {
    await setSessionCookie({ userId: profile.id, email: profile.email, remember });
    return { user_id: profile.id, email: profile.email, role: profile.role, provider: "mock", remember };
  }

  async function activeProfile(userId: string): Promise<Profile | null> {
    const profile = await profiles().get(userId);
    if (!profile || profile.deleted_at) return null;
    return profile;
  }

  async function signedIn(profile: Profile, remember: boolean, extra: { needs_verification?: boolean } = {}): Promise<AuthResult> {
    const session = await sessionFor(profile, remember);
    return { ok: true, session, profile, ...extra };
  }

  // ---- tokens -----------------------------------------------------------

  async function createToken(input: { kind: AuthToken["kind"]; email: string; userId: string | null }): Promise<string> {
    const token = randomToken();
    const row: AuthToken = {
      id: newId(),
      user_id: input.userId,
      email: input.email,
      kind: input.kind,
      token_hash: await sha256Hex(token),
      expires_at: new Date(Date.now() + TOKEN_TTL_MS[input.kind]).toISOString(),
      used_at: null,
      created_at: nowIso(),
    };
    await tokens().insert(row);
    return token;
  }

  /** Finds a live token of the given kind(s) and marks it used. Null when invalid. */
  async function consumeToken(token: string, kinds: AuthToken["kind"][]): Promise<AuthToken | null> {
    if (typeof token !== "string" || token.length < 16) return null;
    const token_hash = await sha256Hex(token);
    return db.transaction(async (tx) => {
      const row = await tx.from("auth_tokens").findOne({ token_hash, kind: kinds });
      if (!row || row.used_at) return null;
      if (new Date(row.expires_at).getTime() <= Date.now()) return null;
      return tx.from("auth_tokens").update(row.id, { used_at: nowIso() });
    });
  }

  // ---- account creation -------------------------------------------------

  async function createAccount(input: {
    email: string;
    name: string;
    role: Role;
    password_hash: string | null;
    verified: boolean;
    providers: AuthUser["providers"];
  }): Promise<{ user: AuthUser; profile: Profile }> {
    return db.transaction(async (tx) => {
      const existing = await tx.from("auth_users").findOne({ email: input.email });
      if (existing) throw Object.assign(new Error(MESSAGES.emailTaken), { code: "email_taken" });
      const id = newId();
      const user = await tx.from("auth_users").insert(
        buildAuthUser({ id, email: input.email, password_hash: input.password_hash, verified: input.verified, providers: input.providers }),
      );
      const profile = await tx.from("profiles").insert(buildProfile({ id, email: input.email, name: input.name, role: input.role }));
      return { user, profile };
    });
  }

  async function findUserByEmail(emailAddress: string): Promise<AuthUser | null> {
    return users().findOne({ email: emailAddress });
  }

  // ---- emails -----------------------------------------------------------

  async function sendVerifyEmail(to: string, userId: string): Promise<{ ok: boolean; error?: string }> {
    const token = await createToken({ kind: "verify_email", email: to, userId });
    const url = appUrl(`/verify-email?token=${encodeURIComponent(token)}`);
    return email.send({
      to,
      subject: "Verify your email",
      template: "verify-email",
      react: linkEmail({
        heading: `Welcome to ${site.name}`,
        intro: "One small step before we begin: please confirm this is your email address.",
        cta: "Verify my email",
        url,
      }),
      text: `Welcome to ${site.name}. Please verify your email by opening this link: ${url}`,
      payload: { url, kind: "verify_email" },
    });
  }

  // ---- AuthProvider -----------------------------------------------------

  const provider: AuthProvider = {
    kind: "mock",

    async getSession() {
      const cookie = await readSessionCookie();
      if (!cookie) return null;
      const profile = await activeProfile(cookie.userId);
      if (!profile) return null;
      return { user_id: profile.id, email: profile.email, role: profile.role, provider: "mock", remember: cookie.remember };
    },

    async signUpWithPassword(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail, code: "unknown" };
      const weak = validatePassword(input.password);
      if (weak) return { ok: false, error: weak, code: "weak_password" };
      const name = (input.name ?? "").trim() || nameFromEmail(emailAddress);
      const role: Role = input.role ?? "learner";
      const remember = input.remember ?? false;
      const autoVerify = input.autoVerify ?? false;

      if (await findUserByEmail(emailAddress)) {
        return { ok: false, error: MESSAGES.emailTaken, code: "email_taken" };
      }
      const password_hash = await bcrypt.hash(input.password, BCRYPT_COST);
      let created: { user: AuthUser; profile: Profile };
      try {
        created = await createAccount({ email: emailAddress, name, role, password_hash, verified: autoVerify, providers: ["password"] });
      } catch (err) {
        if ((err as { code?: string }).code === "email_taken") return { ok: false, error: MESSAGES.emailTaken, code: "email_taken" };
        throw err;
      }
      if (!autoVerify) {
        const sent = await sendVerifyEmail(emailAddress, created.user.id);
        if (!sent.ok) console.warn(`[mock-auth] verification email to ${emailAddress} failed: ${sent.error ?? "unknown"}`);
      }
      return signedIn(created.profile, remember, autoVerify ? {} : { needs_verification: true });
    },

    async signInWithPassword(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      const remember = input.remember ?? false;
      if (!isValidEmail(emailAddress) || typeof input.password !== "string") {
        return { ok: false, error: MESSAGES.invalidCredentials, code: "invalid_credentials" };
      }
      if (isRateLimited(emailAddress)) return { ok: false, error: MESSAGES.rateLimited, code: "rate_limited" };

      const user = await findUserByEmail(emailAddress);
      // Always run a bcrypt compare so timing does not reveal whether the email exists.
      const hash = user?.password_hash ?? (await dummyHash());
      const matches = await bcrypt.compare(input.password, hash);
      if (!user || !user.password_hash || !matches) {
        recordFailure(emailAddress);
        if (isRateLimited(emailAddress)) return { ok: false, error: MESSAGES.rateLimited, code: "rate_limited" };
        return { ok: false, error: MESSAGES.invalidCredentials, code: "invalid_credentials" };
      }
      const profile = await activeProfile(user.id);
      if (!profile) {
        recordFailure(emailAddress);
        return { ok: false, error: MESSAGES.invalidCredentials, code: "invalid_credentials" };
      }
      clearFailures(emailAddress);
      return signedIn(profile, remember, user.email_verified_at ? {} : { needs_verification: true });
    },

    async signOut() {
      await clearSessionCookie();
    },

    async sendMagicLink(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail };
      const user = await findUserByEmail(emailAddress);
      const token = await createToken({ kind: "magic_link", email: emailAddress, userId: user?.id ?? null });
      const next = input.redirectTo ? `&next=${encodeURIComponent(input.redirectTo)}` : "";
      const url = appUrl(`/auth/magic?token=${encodeURIComponent(token)}${next}`);
      const result = await email.send({
        to: emailAddress,
        subject: "Your sign-in link",
        template: "magic-link",
        react: linkEmail({
          heading: "Here's your sign-in link",
          intro: "Tap the link below to sign in. It works once and expires in 15 minutes.",
          cta: "Sign me in",
          url,
        }),
        text: `Sign in to ${site.name} with this link (valid 15 minutes): ${url}`,
        payload: { url, kind: "magic_link" },
      });
      return result.ok ? { ok: true } : { ok: false, error: result.error ?? "We couldn't send the email. Please try again." };
    },

    async completeMagicLink(input) {
      const row = await consumeToken(input.token, ["magic_link"]);
      if (!row) return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
      let user = row.user_id ? await users().get(row.user_id) : await findUserByEmail(row.email);
      let profile: Profile | null = null;
      if (!user) {
        const created = await createAccount({
          email: row.email,
          name: nameFromEmail(row.email),
          role: "learner",
          password_hash: null,
          verified: true,
          providers: ["magic_link"],
        });
        user = created.user;
        profile = created.profile;
      } else {
        await users().update(user.id, {
          email_verified_at: user.email_verified_at ?? nowIso(),
          providers: withProvider(user, "magic_link"),
        });
        profile = await activeProfile(user.id);
      }
      if (!profile) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      return signedIn(profile, true);
    },

    async sendVerificationEmail(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail };
      const user = await findUserByEmail(emailAddress);
      // No enumeration: unknown or already-verified addresses silently succeed.
      if (!user || user.email_verified_at) return { ok: true };
      const sent = await sendVerifyEmail(emailAddress, user.id);
      return sent.ok ? { ok: true } : { ok: false, error: sent.error ?? "We couldn't send the email. Please try again." };
    },

    async verifyEmail(input) {
      const row = await consumeToken(input.token, ["verify_email"]);
      if (!row) return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
      const user = row.user_id ? await users().get(row.user_id) : await findUserByEmail(row.email);
      if (!user) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      if (!user.email_verified_at) await users().update(user.id, { email_verified_at: nowIso() });
      const profile = await activeProfile(user.id);
      if (!profile) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      const current = await readSessionCookie();
      return signedIn(profile, current?.remember ?? true);
    },

    async requestPasswordReset(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) return { ok: true };
      const user = await findUserByEmail(emailAddress);
      if (!user) return { ok: true };
      const profile = await activeProfile(user.id);
      if (!profile) return { ok: true };
      const token = await createToken({ kind: "password_reset", email: emailAddress, userId: user.id });
      const url = appUrl(`/reset-password?token=${encodeURIComponent(token)}`);
      await email.send({
        to: emailAddress,
        subject: "Reset your password",
        template: "password-reset",
        react: linkEmail({
          heading: "Let's get you back in",
          intro: "Use the link below to choose a new password. It expires in one hour.",
          cta: "Reset my password",
          url,
        }),
        text: `Reset your ${site.name} password with this link (valid 1 hour): ${url}`,
        payload: { url, kind: "password_reset" },
      });
      return { ok: true };
    },

    async resetPassword(input) {
      const weak = validatePassword(input.password);
      if (weak) return { ok: false, error: weak, code: "weak_password" };
      const row = await consumeToken(input.token, ["password_reset", "set_password"]);
      if (!row) return { ok: false, error: MESSAGES.invalidLink, code: "unknown" };
      const user = row.user_id ? await users().get(row.user_id) : await findUserByEmail(row.email);
      if (!user) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      const password_hash = await bcrypt.hash(input.password, BCRYPT_COST);
      await users().update(user.id, {
        password_hash,
        email_verified_at: user.email_verified_at ?? nowIso(),
        providers: withProvider(user, "password"),
      });
      clearFailures(user.email);
      const profile = await activeProfile(user.id);
      if (!profile) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      return signedIn(profile, true);
    },

    async changePassword(input) {
      const user = await users().get(input.userId);
      if (!user) return { ok: false, error: MESSAGES.unknownUser };
      if (!user.password_hash) return { ok: false, error: MESSAGES.noPassword };
      const matches = await bcrypt.compare(input.currentPassword ?? "", user.password_hash);
      if (!matches) return { ok: false, error: "Your current password doesn't match. Please try again." };
      const weak = validatePassword(input.newPassword);
      if (weak) return { ok: false, error: weak };
      const password_hash = await bcrypt.hash(input.newPassword, BCRYPT_COST);
      await users().update(user.id, { password_hash, providers: withProvider(user, "password") });
      return { ok: true };
    },

    async oauthStartUrl(input) {
      const next = input.redirectTo ? `?next=${encodeURIComponent(input.redirectTo)}` : "";
      return `/auth/demo-${input.provider}${next}`;
    },

    async completeOAuth(input) {
      // Demo flow: the "code" is the email chosen on /auth/demo-google.
      const emailAddress = normalizeEmail(input.code ?? "");
      if (!isValidEmail(emailAddress)) return { ok: false, error: MESSAGES.invalidEmail, code: "unknown" };
      let user = await findUserByEmail(emailAddress);
      let profile: Profile | null;
      if (!user) {
        const created = await createAccount({
          email: emailAddress,
          name: nameFromEmail(emailAddress),
          role: "learner",
          password_hash: null,
          verified: true,
          providers: ["google"],
        });
        user = created.user;
        profile = created.profile;
      } else {
        await users().update(user.id, {
          email_verified_at: user.email_verified_at ?? nowIso(),
          providers: withProvider(user, "google"),
        });
        profile = await activeProfile(user.id);
      }
      if (!profile) return { ok: false, error: MESSAGES.unknownUser, code: "unknown" };
      return signedIn(profile, true);
    },

    async ensureAccount(input) {
      const emailAddress = normalizeEmail(input.email ?? "");
      if (!isValidEmail(emailAddress)) throw new Error(MESSAGES.invalidEmail);
      const existingProfile = await profiles().findOne({ email: emailAddress });
      if (existingProfile) {
        // Heal a profile without credentials (e.g. imported data).
        if (!(await users().get(existingProfile.id))) {
          await users().insert(
            buildAuthUser({ id: existingProfile.id, email: emailAddress, password_hash: null, verified: true, providers: [] }),
          );
        }
        return { profile: existingProfile, created: false };
      }
      const created = await createAccount({
        email: emailAddress,
        name: (input.name ?? "").trim() || nameFromEmail(emailAddress),
        role: "learner",
        password_hash: null,
        verified: true,
        providers: [],
      });
      if (input.sendSetPassword) {
        const token = await createToken({ kind: "set_password", email: emailAddress, userId: created.user.id });
        const url = appUrl(`/reset-password?token=${encodeURIComponent(token)}&welcome=1`);
        await email.send({
          to: emailAddress,
          subject: `Welcome to ${site.name} — set your password`,
          template: "set-password",
          react: linkEmail({
            heading: `Welcome to ${site.name}`,
            intro: "Your account is ready. Choose a password to sign in whenever you like. This link stays valid for 7 days.",
            cta: "Set my password",
            url,
            outro: "If you weren't expecting this, you can ignore it — nothing else will happen.",
          }),
          text: `Welcome to ${site.name}. Set your password with this link (valid 7 days): ${url}`,
          payload: { url, kind: "set_password" },
        });
      }
      return { profile: created.profile, created: true };
    },

    async deleteUser(userId) {
      await db.transaction(async (tx) => {
        await tx.from("auth_tokens").deleteWhere({ user_id: userId });
        await tx.from("auth_users").delete(userId);
      });
    },

    async adminSetPassword(input) {
      const weak = validatePassword(input.password);
      if (weak) throw new Error(weak);
      const user = await users().get(input.userId);
      if (!user) throw new Error(`[mock-auth] auth user "${input.userId}" not found`);
      const password_hash = await bcrypt.hash(input.password, BCRYPT_COST);
      await users().update(user.id, {
        password_hash,
        email_verified_at: user.email_verified_at ?? nowIso(),
        providers: withProvider(user, "password"),
      });
    },
  };

  return provider;
}
