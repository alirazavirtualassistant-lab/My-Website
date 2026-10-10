/**
 * Pure decision logic for the first-admin bootstrap page. Kept free of I/O so
 * it can be unit-tested and reasoned about on its own.
 */

export type RegisterGuardState =
  | { allowed: true; reason: "first_admin" | "demo_extra_admin" }
  | { allowed: false; reason: "not_configured" | "admin_exists" };

export interface RegisterGuardInput {
  /** ADMIN_SETUP_CODE is non-empty. */
  setupCodeConfigured: boolean;
  /** At least one profile with role=admin and no deleted_at. */
  adminExists: boolean;
  /** DEMO_MODE — evaluation builds may add extra admins. */
  demo: boolean;
}

export function registerGuard(input: RegisterGuardInput): RegisterGuardState {
  if (!input.setupCodeConfigured) return { allowed: false, reason: "not_configured" };
  if (input.adminExists) {
    return input.demo ? { allowed: true, reason: "demo_extra_admin" } : { allowed: false, reason: "admin_exists" };
  }
  return { allowed: true, reason: "first_admin" };
}

/**
 * Constant-time string comparison that does not short-circuit on length or on
 * the first differing byte. Both strings are compared over the longer length;
 * a length mismatch still yields false.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  const length = Math.max(ab.length, bb.length);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < length; i++) {
    diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  }
  return diff === 0;
}

/** Validates a submitted setup code against the configured one. */
export function setupCodeMatches(configured: string, submitted: string): boolean {
  if (!configured) return false;
  return constantTimeEqual(configured.trim(), submitted.trim());
}
