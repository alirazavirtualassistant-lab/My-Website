/**
 * Drip scheduling — pure functions, no I/O.
 *
 * The drip clock starts at `enrollment.started_at`. Each module carries
 * `drip_days` from the course sheet (Immediately = 0, then 7 / 14 / 21 / 28 /
 * 35 / 42) and a lesson may override it with `drip_days_override`.
 *
 * Every function takes `now: Date` instead of reading the clock so results are
 * deterministic and easy to test.
 */
import type { Enrollment, Lesson, Module } from "@/lib/types";
import { addDays, todayKey } from "@/lib/utils";

export const DAY_MS = 86_400_000;

/** The module release schedule from the course sheet, in days after enrolment. */
export const DRIP_SCHEDULE_DAYS = [0, 7, 14, 21, 28, 35, 42] as const;

export type DripLesson = Pick<Lesson, "drip_days_override">;
export type DripModule = Pick<Module, "drip_days">;
export type DripEnrollment = Pick<Enrollment, "started_at" | "unlock_all" | "status" | "expires_at">;

/** Effective drip days for a lesson: the lesson override wins over the module value. Never negative. */
export function lessonDripDays(lesson: DripLesson, module: DripModule): number {
  const override = lesson.drip_days_override;
  const days = override === null || override === undefined ? module.drip_days : override;
  return Number.isFinite(days) ? Math.max(0, days) : 0;
}

/**
 * True when the enrolment itself grants access right now: status is `active`
 * and it has not expired (`expires_at` is exclusive — at exactly `expires_at`
 * the enrolment is over).
 */
export function enrollmentIsCurrent(enrollment: Pick<Enrollment, "status" | "expires_at">, now: Date): boolean {
  if (enrollment.status !== "active") return false;
  if (enrollment.expires_at && Date.parse(enrollment.expires_at) <= now.getTime()) return false;
  return true;
}

/**
 * The instant at which content with `dripDays` opens for this enrolment:
 * `started_at + dripDays` (calendar days, DST-safe). When the enrolment has
 * `unlock_all` the content is open no later than `now` (or `started_at` when
 * `now` is omitted), so the returned date is never in the future.
 */
export function unlockDate(enrollment: Pick<Enrollment, "started_at" | "unlock_all">, dripDays: number, now?: Date): Date {
  const start = new Date(enrollment.started_at);
  const at = addDays(start, Math.max(0, Number.isFinite(dripDays) ? dripDays : 0));
  if (enrollment.unlock_all) {
    const ceiling = now ?? start;
    return at.getTime() < ceiling.getTime() ? at : new Date(ceiling);
  }
  return at;
}

/**
 * Whether content with `dripDays` is open at `now`. The enrolment must be
 * current (active, not expired); then `unlock_all` short-circuits the drip
 * check; otherwise the content opens at exactly `started_at + dripDays`.
 */
export function isUnlocked(enrollment: DripEnrollment, dripDays: number, now: Date): boolean {
  if (!enrollmentIsCurrent(enrollment, now)) return false;
  if (enrollment.unlock_all) return true;
  return now.getTime() >= unlockDate(enrollment, dripDays).getTime();
}

export function moduleUnlockDate(enrollment: Pick<Enrollment, "started_at" | "unlock_all">, module: DripModule, now?: Date): Date {
  return unlockDate(enrollment, module.drip_days, now);
}

export function isModuleUnlocked(enrollment: DripEnrollment, module: DripModule, now: Date): boolean {
  return isUnlocked(enrollment, module.drip_days, now);
}

export function isLessonUnlocked(enrollment: DripEnrollment, lesson: DripLesson, module: DripModule, now: Date): boolean {
  return isUnlocked(enrollment, lessonDripDays(lesson, module), now);
}

/**
 * Whole calendar days from `now` to `target` in the given time zone (UTC by
 * default). 0 = later today, 1 = tomorrow, negative = already past.
 */
export function calendarDaysUntil(target: Date, now: Date, timeZone?: string): number {
  const from = Date.parse(todayKey(now, timeZone));
  const to = Date.parse(todayKey(target, timeZone));
  return Math.round((to - from) / DAY_MS);
}

export interface UpcomingUnlock<M extends DripModule = Module> {
  module: M;
  unlocksAt: Date;
  daysUntil: number;
}

/**
 * Modules that are still locked for this enrolment, soonest first. Empty when
 * the enrolment is not current or has `unlock_all`.
 */
export function upcomingUnlocks<M extends DripModule & Partial<Pick<Module, "position">>>(
  enrollment: DripEnrollment,
  modules: readonly M[],
  now: Date,
  timeZone?: string,
): Array<UpcomingUnlock<M>> {
  if (!enrollmentIsCurrent(enrollment, now) || enrollment.unlock_all) return [];
  const out: Array<UpcomingUnlock<M>> = [];
  for (const module of modules) {
    const unlocksAt = unlockDate(enrollment, module.drip_days);
    if (unlocksAt.getTime() <= now.getTime()) continue;
    out.push({ module, unlocksAt, daysUntil: calendarDaysUntil(unlocksAt, now, timeZone) });
  }
  return out.sort((a, b) => a.unlocksAt.getTime() - b.unlocksAt.getTime() || (a.module.position ?? 0) - (b.module.position ?? 0));
}

/** "opens today" / "opens tomorrow" / "opens in 4 days" / "open now". */
export function humanizeUnlock(date: Date, now: Date, timeZone?: string): string {
  if (date.getTime() <= now.getTime()) return "open now";
  const days = calendarDaysUntil(date, now, timeZone);
  if (days <= 0) return "opens today";
  if (days === 1) return "opens tomorrow";
  return `opens in ${days} days`;
}

export interface NextUnlockSummary<M extends DripModule = Module> extends UpcomingUnlock<M> {
  /** e.g. "opens in 4 days" */
  phrase: string;
  /** How many modules are still locked, including this one. */
  remaining: number;
}

/** The soonest locked module for the dashboard, or null when everything is open. */
export function nextUnlockSummary<M extends DripModule & Partial<Pick<Module, "position">>>(
  enrollment: DripEnrollment,
  modules: readonly M[],
  now: Date,
  timeZone?: string,
): NextUnlockSummary<M> | null {
  const upcoming = upcomingUnlocks(enrollment, modules, now, timeZone);
  const first = upcoming[0];
  if (!first) return null;
  return { ...first, phrase: humanizeUnlock(first.unlocksAt, now, timeZone), remaining: upcoming.length };
}
