/**
 * Daily activity streaks — pure functions over `YYYY-MM-DD` day keys.
 *
 * Day keys are produced by `todayKey()` in the learner's time zone, so this
 * module never touches the clock or time zones itself.
 */
import type { Streak } from "@/lib/types";

export type StreakState = Pick<Streak, "current" | "longest" | "last_active_date">;

/** Streak lengths that earn a badge (`streak:7`, `streak:30`). */
export const STREAK_MILESTONES = [7, 30] as const;

const DAY_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 86_400_000;

/** Milliseconds (UTC midnight) for a `YYYY-MM-DD` key. Throws on malformed input. */
export function parseDayKey(key: string): number {
  const m = DAY_KEY.exec(key);
  if (!m) throw new RangeError(`Invalid day key: ${key}`);
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(ms)) throw new RangeError(`Invalid day key: ${key}`);
  return ms;
}

export function isDayKey(key: unknown): key is string {
  if (typeof key !== "string" || !DAY_KEY.test(key)) return false;
  return !Number.isNaN(Date.UTC(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, Number(key.slice(8, 10))));
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function dayKeyDiff(from: string, to: string): number {
  return Math.round((parseDayKey(to) - parseDayKey(from)) / DAY_MS);
}

/** `key` shifted by `days` (handles month and year boundaries). */
export function shiftDayKey(key: string, days: number): string {
  return new Date(parseDayKey(key) + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * The streak after activity on `activityDateKey`:
 * - no streak yet → 1;
 * - same day → unchanged;
 * - the day after `last_active_date` → +1;
 * - a gap of two or more days → back to 1;
 * - activity dated before `last_active_date` (clock skew) → unchanged.
 * `longest` always tracks the maximum.
 */
export function updateStreak(streak: StreakState | null | undefined, activityDateKey: string): StreakState {
  if (!isDayKey(activityDateKey)) throw new RangeError(`Invalid day key: ${activityDateKey}`);
  if (!streak || !isDayKey(streak.last_active_date) || streak.current <= 0) {
    const longest = Math.max(1, streak?.longest ?? 0);
    return { current: 1, longest, last_active_date: activityDateKey };
  }
  const diff = dayKeyDiff(streak.last_active_date, activityDateKey);
  if (diff <= 0) return { current: streak.current, longest: Math.max(streak.longest, streak.current), last_active_date: streak.last_active_date };
  const current = diff === 1 ? streak.current + 1 : 1;
  return { current, longest: Math.max(streak.longest, current), last_active_date: activityDateKey };
}

/** Badge keys earned at a streak of `current` days: `streak:7`, `streak:30`. */
export function streakBadgeKeys(current: number): string[] {
  return STREAK_MILESTONES.filter((m) => current >= m).map((m) => `streak:${m}`);
}

/** The next milestone above `current`, or null past the last one. */
export function nextStreakMilestone(current: number): number | null {
  return STREAK_MILESTONES.find((m) => m > current) ?? null;
}

/** A streak is alive when the last activity was today or yesterday. */
export function isStreakAlive(streak: StreakState | null | undefined, todayKey: string): boolean {
  if (!streak || streak.current <= 0 || !isDayKey(streak.last_active_date) || !isDayKey(todayKey)) return false;
  const diff = dayKeyDiff(streak.last_active_date, todayKey);
  return diff === 0 || diff === 1;
}

/** The streak as it stands on `todayKey` (0 when it lapsed), for display without writing. */
export function effectiveStreak(streak: StreakState | null | undefined, todayKey: string): number {
  return isStreakAlive(streak, todayKey) ? streak!.current : 0;
}
