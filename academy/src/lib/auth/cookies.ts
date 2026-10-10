/**
 * Session cookie constants shared by the mock auth adapter, the sign-out route
 * handler and anything else that needs to name the cookie. Pure constants: no
 * imports from next/* so this file is safe anywhere (edge, node, tests).
 */

/** Name of the signed-JWT session cookie used in mock (demo) mode. */
export const SESSION_COOKIE_NAME = "cyc_session";

/** "Remember me" sessions last 30 days. */
export const SESSION_REMEMBER_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/**
 * Sessions without "remember me" are browser-session cookies (no maxAge) whose
 * JWT expires after one day.
 */
export const SESSION_DEFAULT_TTL_SEC = 24 * 60 * 60;

/** JWT issuer / audience used by the mock session tokens. */
export const SESSION_JWT_ISSUER = "cradle-your-cravings-academy";

export interface SessionCookieOptions {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: "/";
  maxAge?: number;
}

/**
 * Cookie attributes for the session cookie. `remember` adds a 30-day maxAge;
 * otherwise the cookie is a browser-session cookie. `secure` is on in
 * production only so local http://localhost demos still work.
 */
export function sessionCookieOptions(input: { remember: boolean; secure: boolean }): SessionCookieOptions {
  const base: SessionCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: input.secure,
    path: "/",
  };
  if (input.remember) base.maxAge = SESSION_REMEMBER_MAX_AGE_SEC;
  return base;
}

/** Attributes used to clear the session cookie (same scope, maxAge 0). */
export function clearedSessionCookieOptions(secure: boolean): SessionCookieOptions {
  return { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 };
}
