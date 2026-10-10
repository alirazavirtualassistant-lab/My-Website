import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-auth-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.AUTH_SECRET = "test-secret-not-for-production";

// ---------------------------------------------------------------------------
// next/headers cookie jar stub
// ---------------------------------------------------------------------------

interface SetCookie {
  name: string;
  value: string;
  options: Record<string, unknown>;
}

const jar = vi.hoisted(() => {
  const state = { cookies: new Map<string, string>(), sets: [] as Array<{ name: string; value: string; options: Record<string, unknown> }> };
  return {
    state,
    api: {
      get(name: string) {
        const value = state.cookies.get(name);
        return value === undefined ? undefined : { name, value };
      },
      getAll() {
        return Array.from(state.cookies, ([name, value]) => ({ name, value }));
      },
      has(name: string) {
        return state.cookies.has(name);
      },
      set(name: string, value: string, options: Record<string, unknown> = {}) {
        state.sets.push({ name, value, options });
        if (value === "" || options.maxAge === 0) state.cookies.delete(name);
        else state.cookies.set(name, value);
      },
      delete(name: string) {
        state.cookies.delete(name);
      },
    },
    reset() {
      state.cookies.clear();
      state.sets.length = 0;
    },
  };
});

vi.mock("next/headers", () => ({
  cookies: async () => jar.api,
  headers: async () => new Headers(),
}));

const { createMockDbInstance, resetMockDbCache } = await import("@/services/mock/db");
const { forgetMockStore, resolveStorePath } = await import("@/services/mock/store");
const { createMockAuth, resetMockAuthRateLimiter } = await import("@/services/mock/auth");
const { seedDemoAccounts, DEMO_ACCOUNTS } = await import("@/services/mock/seed");
const { SESSION_COOKIE_NAME } = await import("@/lib/auth/cookies");
type EmailMessage = import("@/services/types").EmailMessage;
type EmailProvider = import("@/services/types").EmailProvider;

function fakeEmail() {
  const sent: EmailMessage[] = [];
  const provider: EmailProvider = {
    kind: "mock",
    async send(message) {
      sent.push(message);
      return { ok: true, id: `msg_${sent.length}` };
    },
  };
  return { provider, sent };
}

function lastLink(sent: EmailMessage[], template: string): string {
  const msg = [...sent].reverse().find((m) => m.template === template);
  if (!msg) throw new Error(`no ${template} email sent`);
  return String(msg.payload?.url);
}

function tokenFrom(url: string): string {
  return new URL(url).searchParams.get("token") ?? "";
}

function lastSet(name = SESSION_COOKIE_NAME): SetCookie | undefined {
  return [...jar.state.sets].reverse().find((s) => s.name === name);
}

let counter = 0;
let dir = "";

beforeEach(() => {
  dir = path.join(ROOT, `case-${++counter}`);
  jar.reset();
  resetMockAuthRateLimiter();
});

afterEach(() => {
  forgetMockStore(resolveStorePath(dir));
  resetMockDbCache();
});

async function setup() {
  const db = await createMockDbInstance(dir);
  const mail = fakeEmail();
  const auth = await createMockAuth(db, mail.provider);
  return { db, auth, sent: mail.sent };
}

describe("mock auth: password sign-up and sign-in", () => {
  it("signs up, sets a session cookie, creates rows and emails a verification link", async () => {
    const { db, auth, sent } = await setup();
    const result = await auth.signUpWithPassword({ email: "  Ada@Example.com ", password: "babysteps1", name: "Ada" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.needs_verification).toBe(true);
    expect(result.session.email).toBe("ada@example.com");
    expect(result.profile.role).toBe("learner");
    expect(result.profile.email_preferences).toEqual({ progress_nudges: true, drip_unlocks: true, newsletter: true, community: true });

    const cookie = lastSet();
    expect(cookie).toBeDefined();
    expect(cookie?.value.split(".")).toHaveLength(3);
    expect(cookie?.options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
    expect(cookie?.options.maxAge).toBeUndefined();

    const user = await db.from("auth_users").get(result.profile.id);
    expect(user?.password_hash).toMatch(/^\$2[aby]\$10\$/);
    expect(user?.email_verified_at).toBeNull();
    expect(user?.providers).toEqual(["password"]);

    expect(sent).toHaveLength(1);
    expect(sent[0].template).toBe("verify-email");
    expect(sent[0].subject).toBe("Verify your email");
    expect(lastLink(sent, "verify-email")).toContain("/verify-email?token=");

    const tokens = await db.from("auth_tokens").list({ where: { kind: "verify_email" } });
    expect(tokens).toHaveLength(1);
    expect(tokens[0].token_hash).not.toBe(tokenFrom(lastLink(sent, "verify-email")));

    // getSession reads the cookie back and reflects the live profile role.
    const session = await auth.getSession();
    expect(session?.user_id).toBe(result.profile.id);
    expect(session?.remember).toBe(false);
    await db.from("profiles").update(result.profile.id, { role: "admin" });
    expect((await auth.getSession())?.role).toBe("admin");
  });

  it("remember me sets a 30-day cookie; autoVerify skips the email", async () => {
    const { auth, sent } = await setup();
    const result = await auth.signUpWithPassword({ email: "b@example.com", password: "babysteps1", name: "B", remember: true, autoVerify: true });
    expect(result.ok).toBe(true);
    expect(sent).toHaveLength(0);
    expect(lastSet()?.options.maxAge).toBe(30 * 24 * 60 * 60);
    expect((await auth.getSession())?.remember).toBe(true);
  });

  it("rejects weak passwords, bad emails and duplicates", async () => {
    const { auth } = await setup();
    expect(await auth.signUpWithPassword({ email: "c@example.com", password: "short1", name: "C" })).toMatchObject({ ok: false, code: "weak_password" });
    expect(await auth.signUpWithPassword({ email: "c@example.com", password: "onlyletters", name: "C" })).toMatchObject({ ok: false, code: "weak_password" });
    expect(await auth.signUpWithPassword({ email: "not-an-email", password: "babysteps1", name: "C" })).toMatchObject({ ok: false });
    expect((await auth.signUpWithPassword({ email: "c@example.com", password: "babysteps1", name: "C" })).ok).toBe(true);
    expect(await auth.signUpWithPassword({ email: "C@example.com", password: "babysteps1", name: "C" })).toMatchObject({ ok: false, code: "email_taken" });
  });

  it("signs in with the right password and rejects the wrong one", async () => {
    const { auth } = await setup();
    await auth.signUpWithPassword({ email: "d@example.com", password: "babysteps1", name: "D", autoVerify: true });
    await auth.signOut();
    expect(jar.state.cookies.has(SESSION_COOKIE_NAME)).toBe(false);
    expect(await auth.getSession()).toBeNull();

    const wrong = await auth.signInWithPassword({ email: "d@example.com", password: "babysteps2" });
    expect(wrong).toMatchObject({ ok: false, code: "invalid_credentials" });
    const unknown = await auth.signInWithPassword({ email: "nobody@example.com", password: "babysteps1" });
    expect(unknown).toMatchObject({ ok: false, code: "invalid_credentials" });

    const right = await auth.signInWithPassword({ email: "D@example.com", password: "babysteps1" });
    expect(right.ok).toBe(true);
    expect((await auth.getSession())?.email).toBe("d@example.com");
  });

  it("rate limits after 5 failed attempts per email", async () => {
    const { auth } = await setup();
    await auth.signUpWithPassword({ email: "e@example.com", password: "babysteps1", name: "E", autoVerify: true });
    for (let i = 0; i < 4; i++) {
      expect(await auth.signInWithPassword({ email: "e@example.com", password: "wrong-pass1" })).toMatchObject({ code: "invalid_credentials" });
    }
    expect(await auth.signInWithPassword({ email: "e@example.com", password: "wrong-pass1" })).toMatchObject({ code: "rate_limited" });
    // Even the right password is blocked while limited...
    expect(await auth.signInWithPassword({ email: "e@example.com", password: "babysteps1" })).toMatchObject({ code: "rate_limited" });
    // ...but other emails are unaffected.
    expect(await auth.signInWithPassword({ email: "other@example.com", password: "babysteps1" })).toMatchObject({ code: "invalid_credentials" });
  });

  it("ignores tampered or expired session cookies", async () => {
    const { auth } = await setup();
    await auth.signUpWithPassword({ email: "f@example.com", password: "babysteps1", name: "F", autoVerify: true });
    const token = jar.state.cookies.get(SESSION_COOKIE_NAME)!;
    jar.state.cookies.set(SESSION_COOKIE_NAME, token.slice(0, -2) + "xx");
    expect(await auth.getSession()).toBeNull();
    jar.state.cookies.set(SESSION_COOKIE_NAME, "garbage");
    expect(await auth.getSession()).toBeNull();
  });

  it("returns null when the profile is soft-deleted", async () => {
    const { db, auth } = await setup();
    const r = await auth.signUpWithPassword({ email: "g@example.com", password: "babysteps1", name: "G", autoVerify: true });
    if (!r.ok) throw new Error(r.error);
    await db.from("profiles").update(r.profile.id, { deleted_at: new Date().toISOString() });
    expect(await auth.getSession()).toBeNull();
  });
});

describe("mock auth: email links", () => {
  it("magic link signs in (creating the account) and can only be used once", async () => {
    const { db, auth, sent } = await setup();
    expect(await auth.sendMagicLink({ email: "magic@example.com", redirectTo: "/learn/baby-steps" })).toEqual({ ok: true });
    const url = lastLink(sent, "magic-link");
    expect(url).toContain("/auth/magic?token=");
    expect(new URL(url).searchParams.get("next")).toBe("/learn/baby-steps");

    const token = tokenFrom(url);
    const first = await auth.completeMagicLink({ token });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.profile.name).toBe("Magic");
    expect(first.session.remember).toBe(true);
    const user = await db.from("auth_users").get(first.profile.id);
    expect(user?.email_verified_at).not.toBeNull();
    expect(user?.providers).toEqual(["magic_link"]);

    const second = await auth.completeMagicLink({ token });
    expect(second).toMatchObject({ ok: false });
    expect(await auth.completeMagicLink({ token: "bogus-token-value-1234567890" })).toMatchObject({ ok: false });
  });

  it("rejects expired tokens", async () => {
    const { db, auth, sent } = await setup();
    await auth.sendMagicLink({ email: "late@example.com" });
    const token = tokenFrom(lastLink(sent, "magic-link"));
    await db.from("auth_tokens").updateWhere({ kind: "magic_link" }, { expires_at: new Date(Date.now() - 1000).toISOString() });
    expect(await auth.completeMagicLink({ token })).toMatchObject({ ok: false });
  });

  it("verifies email via the token and resends on request", async () => {
    const { db, auth, sent } = await setup();
    const r = await auth.signUpWithPassword({ email: "v@example.com", password: "babysteps1", name: "V" });
    if (!r.ok) throw new Error(r.error);
    expect(await auth.sendVerificationEmail({ email: "v@example.com" })).toEqual({ ok: true });
    expect(sent.filter((m) => m.template === "verify-email")).toHaveLength(2);

    const verified = await auth.verifyEmail({ token: tokenFrom(lastLink(sent, "verify-email")) });
    expect(verified.ok).toBe(true);
    expect((await db.from("auth_users").get(r.profile.id))?.email_verified_at).not.toBeNull();
    // Already verified: silently ok, no new email.
    expect(await auth.sendVerificationEmail({ email: "v@example.com" })).toEqual({ ok: true });
    expect(sent.filter((m) => m.template === "verify-email")).toHaveLength(2);
    // Unknown address: no enumeration.
    expect(await auth.sendVerificationEmail({ email: "ghost@example.com" })).toEqual({ ok: true });
  });

  it("password reset flow: request -> reset -> sign in with the new password", async () => {
    const { auth, sent } = await setup();
    await auth.signUpWithPassword({ email: "r@example.com", password: "oldpass123", name: "R", autoVerify: true });
    await auth.signOut();

    expect(await auth.requestPasswordReset({ email: "ghost@example.com" })).toEqual({ ok: true });
    expect(sent.filter((m) => m.template === "password-reset")).toHaveLength(0);

    expect(await auth.requestPasswordReset({ email: "R@example.com" })).toEqual({ ok: true });
    const url = lastLink(sent, "password-reset");
    expect(url).toContain("/reset-password?token=");
    const token = tokenFrom(url);

    expect(await auth.resetPassword({ token, password: "weak" })).toMatchObject({ ok: false, code: "weak_password" });
    const reset = await auth.resetPassword({ token, password: "newpass123" });
    expect(reset.ok).toBe(true);
    expect(await auth.getSession()).not.toBeNull();
    // Token is consumed.
    expect(await auth.resetPassword({ token, password: "another123" })).toMatchObject({ ok: false });

    await auth.signOut();
    expect(await auth.signInWithPassword({ email: "r@example.com", password: "oldpass123" })).toMatchObject({ ok: false });
    expect((await auth.signInWithPassword({ email: "r@example.com", password: "newpass123" })).ok).toBe(true);
  });

  it("changePassword verifies the current password", async () => {
    const { auth } = await setup();
    const r = await auth.signUpWithPassword({ email: "cp@example.com", password: "oldpass123", name: "CP", autoVerify: true });
    if (!r.ok) throw new Error(r.error);
    expect(await auth.changePassword({ userId: r.profile.id, currentPassword: "nope12345", newPassword: "newpass123" })).toMatchObject({ ok: false });
    expect(await auth.changePassword({ userId: r.profile.id, currentPassword: "oldpass123", newPassword: "short" })).toMatchObject({ ok: false });
    expect(await auth.changePassword({ userId: r.profile.id, currentPassword: "oldpass123", newPassword: "newpass123" })).toEqual({ ok: true });
    await auth.signOut();
    expect((await auth.signInWithPassword({ email: "cp@example.com", password: "newpass123" })).ok).toBe(true);
  });
});

describe("mock auth: OAuth demo, ensureAccount, admin helpers", () => {
  it("oauthStartUrl returns the in-app demo route and completeOAuth signs in by email", async () => {
    const { db, auth } = await setup();
    expect(await auth.oauthStartUrl({ provider: "google", redirectTo: "/learn" })).toBe("/auth/demo-google?next=%2Flearn");
    const r = await auth.completeOAuth({ code: "Jane.Doe@gmail.com" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.profile.name).toBe("Jane Doe");
    expect((await db.from("auth_users").get(r.profile.id))?.providers).toEqual(["google"]);
    // Existing password account gains the google provider.
    await auth.signUpWithPassword({ email: "mix@example.com", password: "babysteps1", name: "Mix", autoVerify: true });
    const again = await auth.completeOAuth({ code: "mix@example.com" });
    expect(again.ok).toBe(true);
    if (!again.ok) return;
    expect((await db.from("auth_users").get(again.profile.id))?.providers).toEqual(["password", "google"]);
    expect(await auth.completeOAuth({ code: "" })).toMatchObject({ ok: false });
  });

  it("ensureAccount creates a passwordless verified account and emails a set-password link", async () => {
    const { db, auth, sent } = await setup();
    const first = await auth.ensureAccount({ email: "Gift@Example.com", name: "Gift Recipient", sendSetPassword: true });
    expect(first.created).toBe(true);
    expect(first.profile.email).toBe("gift@example.com");
    const user = await db.from("auth_users").get(first.profile.id);
    expect(user?.password_hash).toBeNull();
    expect(user?.email_verified_at).not.toBeNull();
    const url = lastLink(sent, "set-password");
    expect(url).toContain("/reset-password?token=");
    expect(url).toContain("welcome=1");
    expect(jar.state.cookies.has(SESSION_COOKIE_NAME)).toBe(false);

    const second = await auth.ensureAccount({ email: "gift@example.com", sendSetPassword: true });
    expect(second.created).toBe(false);
    expect(second.profile.id).toBe(first.profile.id);
    expect(sent.filter((m) => m.template === "set-password")).toHaveLength(1);

    // The welcome link sets a password and signs in.
    const reset = await auth.resetPassword({ token: tokenFrom(url), password: "welcome123" });
    expect(reset.ok).toBe(true);
    expect((await db.from("auth_users").get(first.profile.id))?.providers).toEqual(["password"]);
  });

  it("adminSetPassword and deleteUser", async () => {
    const { db, auth } = await setup();
    const r = await auth.ensureAccount({ email: "team@example.com", name: "Team" });
    await auth.adminSetPassword({ userId: r.profile.id, password: "teampass123" });
    expect((await auth.signInWithPassword({ email: "team@example.com", password: "teampass123" })).ok).toBe(true);
    await expect(auth.adminSetPassword({ userId: r.profile.id, password: "weak" })).rejects.toThrow();
    await expect(auth.adminSetPassword({ userId: "missing", password: "teampass123" })).rejects.toThrow(/not found/);

    await auth.requestPasswordReset({ email: "team@example.com" });
    expect(await db.from("auth_tokens").count({ user_id: r.profile.id })).toBe(1);
    await auth.deleteUser(r.profile.id);
    expect(await db.from("auth_users").get(r.profile.id)).toBeNull();
    expect(await db.from("auth_tokens").count({ user_id: r.profile.id })).toBe(0);
    // Profile soft-delete is the use case's job; the row remains.
    expect(await db.from("profiles").get(r.profile.id)).not.toBeNull();
  });
});

describe("demo seed", () => {
  it("creates the four demo accounts idempotently", async () => {
    const { db, auth, sent } = await setup();
    const first = await seedDemoAccounts(db, auth);
    expect(first.created).toHaveLength(4);
    expect(first.existing).toHaveLength(0);
    expect(sent).toHaveLength(0);

    const second = await seedDemoAccounts(db, auth);
    expect(second.created).toHaveLength(0);
    expect(second.existing).toHaveLength(4);
    expect(second.ids).toEqual(first.ids);
    expect(await db.from("profiles").count()).toBe(4);
    expect(await db.from("auth_users").count()).toBe(4);

    for (const account of DEMO_ACCOUNTS) {
      const result = await auth.signInWithPassword({ email: account.email, password: account.password });
      expect(result.ok, account.email).toBe(true);
      if (!result.ok) continue;
      expect(result.profile.role).toBe(account.role);
      expect(result.profile.name).toBe(account.name);
      expect(result.needs_verification).toBeUndefined();
    }
    // Roles are restored if someone changes them while playing.
    await db.from("profiles").update(first.ids.admin, { role: "learner" });
    await seedDemoAccounts(db, auth);
    expect((await db.from("profiles").get(first.ids.admin))?.role).toBe("admin");
  });
});
