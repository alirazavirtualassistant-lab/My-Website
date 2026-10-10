/**
 * Pure helpers shared by the auth + account forms (client and server) and
 * their unit tests. No I/O, no Next imports, so this file is safe to import
 * from Client Components, Server Actions and vitest alike.
 */
import { z } from "zod";
import { PASSWORD_MIN_LENGTH, validatePassword } from "@/lib/auth/password";
import { safeRedirectPath } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Field schemas
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string({ message: "Please enter your email address." })
  .trim()
  .min(1, "Please enter your email address.")
  .max(254, "That email address is a little long.")
  .toLowerCase()
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Please enter a valid email address.");

export const passwordSchema = z
  .string({ message: "Please choose a password." })
  .max(200, "That password is a little long — please keep it under 200 characters.")
  .superRefine((value, ctx) => {
    const problem = validatePassword(value);
    if (problem) ctx.addIssue({ code: "custom", message: problem });
  });

export const nameSchema = z
  .string({ message: "Please tell us your name." })
  .trim()
  .min(1, "Please tell us your name.")
  .max(80, "Please keep your name under 80 characters.");

/** Checkbox values arrive as "on" (or "true"/"1") from FormData; absent means false. */
export const checkboxSchema = z.preprocess((v) => v === "on" || v === "true" || v === "1" || v === true, z.boolean());

/** Honeypot: humans never fill it in. */
export const honeypotSchema = z.string().max(200).optional().default("");

export const nextSchema = z
  .string()
  .max(500)
  .optional()
  .transform((v) => safeRedirectPath(v, "/learn"));

export const tokenSchema = z.string().trim().min(16, "That link looks incomplete. Please open it from your email again.").max(2000);

// ---------------------------------------------------------------------------
// Form schemas
// ---------------------------------------------------------------------------

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  remember: checkboxSchema,
  consent: checkboxSchema.refine((v) => v, "Please agree to the terms and privacy policy to continue."),
  next: nextSchema,
  website: honeypotSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string({ message: "Please enter your password." }).min(1, "Please enter your password.").max(200),
  remember: checkboxSchema,
  next: nextSchema,
  website: honeypotSchema,
});

export const magicLinkSchema = z.object({
  email: emailSchema,
  next: nextSchema,
  website: honeypotSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  website: honeypotSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().max(2000).optional().default(""),
    password: passwordSchema,
    confirm: z.string({ message: "Please type your password again." }).max(200),
    welcome: checkboxSchema,
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Those passwords don't match yet." });

export const changePasswordSchema = z
  .object({
    current: z.string({ message: "Please enter your current password." }).min(1, "Please enter your current password.").max(200),
    password: passwordSchema,
    confirm: z.string({ message: "Please type your new password again." }).max(200),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Those passwords don't match yet." })
  .refine((v) => v.password !== v.current, { path: ["password"], message: "Please choose a password that's different from your current one." });

export const profileSchema = z.object({
  name: nameSchema,
  timezone: z
    .string()
    .trim()
    .max(80)
    .optional()
    .default("")
    .transform((v) => (v ? v : null)),
});

export const emailPreferencesSchema = z.object({
  progress_nudges: checkboxSchema,
  drip_unlocks: checkboxSchema,
  newsletter: checkboxSchema,
  community: checkboxSchema,
});

export const deleteAccountSchema = z.object({
  confirm: z
    .string({ message: "Please type DELETE to confirm." })
    .trim()
    .refine((v) => v === "DELETE", "Please type DELETE (in capitals) to confirm."),
});

export const adminRegisterSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  setupCode: z.string({ message: "Please enter the setup code." }).trim().min(1, "Please enter the setup code.").max(200),
  website: honeypotSchema,
});

export const demoGoogleSchema = z.object({
  email: emailSchema,
  next: nextSchema,
});

// ---------------------------------------------------------------------------
// FormData → object → schema
// ---------------------------------------------------------------------------

export type FieldErrors = Record<string, string>;

export type ParseResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors; summary: string[] };

/** Plain object from FormData (strings only; files are skipped). */
export function formToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !(key in out)) out[key] = value;
  });
  return out;
}

/** First message per field, in schema order, plus a flat summary list. */
export function fieldErrors(error: z.ZodError): { errors: FieldErrors; summary: string[] } {
  const errors: FieldErrors = {};
  const summary: string[] = [];
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in errors)) {
      errors[key] = issue.message;
      summary.push(issue.message);
    }
  }
  return { errors, summary };
}

export function parseForm<S extends z.ZodType>(schema: S, input: FormData | Record<string, unknown>): ParseResult<z.output<S>> {
  const raw = input instanceof FormData ? formToObject(input) : input;
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data as z.output<S> };
  return { ok: false, ...fieldErrors(result.error) };
}

/** True when the honeypot was filled in — treat the request as a bot and pretend it succeeded. */
export function isHoneypotTripped(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

// ---------------------------------------------------------------------------
// Password strength hint (client-side, purely advisory)
// ---------------------------------------------------------------------------

export interface PasswordStrength {
  /** 0 = empty, 1 = too short, 2 = okay, 3 = good, 4 = strong */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  /** What is still missing for the minimum rule (null when it already passes). */
  problem: string | null;
  meetsMinimum: boolean;
}

export function passwordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", problem: null, meetsMinimum: false };
  const problem = validatePassword(password);
  if (problem) return { score: 1, label: password.length < PASSWORD_MIN_LENGTH ? "Too short" : "Almost there", problem, meetsMinimum: false };
  let points = 0;
  if (password.length >= 12) points += 1;
  if (password.length >= 16) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password)) points += 1;
  const score: PasswordStrength["score"] = points >= 3 ? 4 : points >= 1 ? 3 : 2;
  const label = score === 4 ? "Strong" : score === 3 ? "Good" : "Okay";
  return { score, label, problem: null, meetsMinimum: true };
}

// ---------------------------------------------------------------------------
// Small pure helpers used by pages
// ---------------------------------------------------------------------------

export type AuthErrorCode = "invalid_credentials" | "email_taken" | "unverified" | "rate_limited" | "weak_password" | "unknown";

/** Which field an auth error belongs to, for inline placement. */
export function errorField(code: AuthErrorCode | undefined): "email" | "password" | "form" {
  switch (code) {
    case "email_taken":
    case "unverified":
      return "email";
    case "weak_password":
      return "password";
    default:
      return "form";
  }
}

/** Group IANA zones by their leading region ("America/New_York" → "America"). */
export function groupTimeZones(zones: readonly string[]): Array<{ region: string; zones: string[] }> {
  const groups = new Map<string, string[]>();
  for (const zone of zones) {
    const [region, ...rest] = zone.split("/");
    const key = rest.length === 0 ? "Other" : region;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(zone);
  }
  const order = ["America", "Europe", "Asia", "Africa", "Australia", "Pacific", "Atlantic", "Indian", "Antarctica", "Arctic", "Other"];
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    })
    .map(([region, list]) => ({ region, zones: [...list].sort() }));
}

/** "America/New_York" → "New York". */
export function timeZoneLabel(zone: string): string {
  const parts = zone.split("/");
  return (parts[parts.length - 1] ?? zone).replace(/_/g, " ");
}

/** Mask an email for confirmation copy: "cynthia@example.com" → "c•••••@example.com". */
export function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  return `${head}${"•".repeat(Math.max(3, Math.min(6, local.length - 1)))}@${domain}`;
}
