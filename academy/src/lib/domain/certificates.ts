/**
 * Certificates — eligibility, verify codes and the LinkedIn "Add to profile" link.
 * Pure: the only randomness is injectable.
 */
import type { CourseTree, LessonProgress } from "@/lib/types";
import { shortCode } from "@/lib/utils";
import { completedLessonIds, isLessonPublished, type ProgressRow } from "./progress";

export interface CertificateRequirements {
  /** `course.certificate_enabled` */
  enabled: boolean;
  requiredTotal: number;
  requiredCompleted: number;
  /** published lessons in required modules that are not yet complete, in tree order */
  missingLessonIds: string[];
  eligible: boolean;
}

/**
 * Required = every published lesson in modules with `required_for_certificate`
 * (Course Home and M1–M7). Bonus and Replay modules are optional. A course
 * with no required lessons never issues certificates.
 */
export function certificateRequirements(
  tree: Pick<CourseTree, "course" | "modules">,
  rows: ReadonlyArray<ProgressRow | LessonProgress>,
  now?: Date,
): CertificateRequirements {
  const done = completedLessonIds(rows);
  const missingLessonIds: string[] = [];
  let requiredTotal = 0;
  let requiredCompleted = 0;
  for (const module of tree.modules) {
    if (!module.required_for_certificate) continue;
    for (const lesson of module.lessons) {
      if (!isLessonPublished(lesson, now)) continue;
      requiredTotal += 1;
      if (done.has(lesson.id)) requiredCompleted += 1;
      else missingLessonIds.push(lesson.id);
    }
  }
  const enabled = !!tree.course.certificate_enabled;
  return { enabled, requiredTotal, requiredCompleted, missingLessonIds, eligible: enabled && requiredTotal > 0 && missingLessonIds.length === 0 };
}

export function isEligibleForCertificate(
  tree: Pick<CourseTree, "course" | "modules">,
  rows: ReadonlyArray<ProgressRow | LessonProgress>,
  now?: Date,
): boolean {
  return certificateRequirements(tree, rows, now).eligible;
}

/** Same unambiguous alphabet as `shortCode` in utils (no 0/O/1/I). */
export const VERIFY_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const VERIFY_CODE_LENGTH = 10;

export interface MakeVerifyCodeOptions {
  length?: number;
  /** Test hook: returns `length` byte values; defaults to `crypto.getRandomValues` via `shortCode`. */
  random?: (length: number) => ArrayLike<number>;
}

/** Public certificate code, e.g. `K7PQ2MXD4R`. */
export function makeVerifyCode(opts: MakeVerifyCodeOptions = {}): string {
  const length = Math.max(4, Math.floor(opts.length ?? VERIFY_CODE_LENGTH));
  if (!opts.random) return shortCode(length);
  const bytes = opts.random(length);
  let out = "";
  for (let i = 0; i < length; i++) out += VERIFY_CODE_ALPHABET[Math.abs(Math.floor(bytes[i] ?? 0)) % VERIFY_CODE_ALPHABET.length];
  return out;
}

/** Normalises user input (`k7pq-2mxd 4r` → `K7PQ2MXD4R`); empty string when nothing usable remains. */
export function normalizeVerifyCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isValidVerifyCode(code: string, length = VERIFY_CODE_LENGTH): boolean {
  if (code.length !== length) return false;
  for (const ch of code) if (!VERIFY_CODE_ALPHABET.includes(ch)) return false;
  return true;
}

export interface LinkedInCertificateInput {
  /** certification name as it should appear on the profile */
  name: string;
  organizationName: string;
  issueYear: number;
  /** 1–12 */
  issueMonth: number;
  certUrl: string;
  certId: string;
  /** LinkedIn organisation id (preferred over organizationName when known) */
  organizationId?: string | number;
  expirationYear?: number;
  expirationMonth?: number;
}

/**
 * LinkedIn "Add to profile" deep link:
 * https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=…&organizationName=…&issueYear=…&issueMonth=…&certUrl=…&certId=…
 */
export function linkedInAddToProfileUrl(input: LinkedInCertificateInput): string {
  const url = new URL("https://www.linkedin.com/profile/add");
  const p = url.searchParams;
  p.set("startTask", "CERTIFICATION_NAME");
  p.set("name", input.name);
  if (input.organizationId !== undefined && input.organizationId !== "") p.set("organizationId", String(input.organizationId));
  else p.set("organizationName", input.organizationName);
  p.set("issueYear", String(Math.floor(input.issueYear)));
  p.set("issueMonth", String(Math.min(12, Math.max(1, Math.floor(input.issueMonth)))));
  if (input.expirationYear) p.set("expirationYear", String(Math.floor(input.expirationYear)));
  if (input.expirationMonth) p.set("expirationMonth", String(Math.min(12, Math.max(1, Math.floor(input.expirationMonth)))));
  p.set("certUrl", input.certUrl);
  p.set("certId", input.certId);
  return url.toString();
}
