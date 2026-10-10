import { describe, expect, it } from "vitest";
import {
  STREAK_MILESTONES,
  dayKeyDiff,
  effectiveStreak,
  isDayKey,
  isStreakAlive,
  nextStreakMilestone,
  parseDayKey,
  shiftDayKey,
  streakBadgeKeys,
  updateStreak,
} from "@/lib/domain/streaks";
import { makeStreak } from "./fixtures";

describe("day keys", () => {
  it("parses and validates YYYY-MM-DD", () => {
    expect(parseDayKey("2026-10-10")).toBe(Date.UTC(2026, 9, 10));
    expect(isDayKey("2026-10-10")).toBe(true);
    expect(isDayKey("2026-1-1")).toBe(false);
    expect(isDayKey("10/10/2026")).toBe(false);
    expect(isDayKey(null)).toBe(false);
    expect(() => parseDayKey("yesterday")).toThrow(RangeError);
  });

  it("diffs and shifts across month, year and leap boundaries", () => {
    expect(dayKeyDiff("2026-10-31", "2026-11-01")).toBe(1);
    expect(dayKeyDiff("2026-12-31", "2027-01-01")).toBe(1);
    expect(dayKeyDiff("2026-10-10", "2026-10-08")).toBe(-2);
    expect(shiftDayKey("2026-01-31", 1)).toBe("2026-02-01");
    expect(shiftDayKey("2028-02-28", 1)).toBe("2028-02-29");
    expect(shiftDayKey("2027-02-28", 1)).toBe("2027-03-01");
    expect(shiftDayKey("2027-01-01", -1)).toBe("2026-12-31");
  });
});

describe("updateStreak", () => {
  it("starts a streak at 1", () => {
    expect(updateStreak(null, "2026-10-10")).toEqual({ current: 1, longest: 1, last_active_date: "2026-10-10" });
    expect(updateStreak(undefined, "2026-10-10")).toEqual({ current: 1, longest: 1, last_active_date: "2026-10-10" });
  });

  it("leaves a same-day activity unchanged", () => {
    const s = makeStreak({ current: 3, longest: 5, last_active_date: "2026-10-10" });
    expect(updateStreak(s, "2026-10-10")).toEqual({ current: 3, longest: 5, last_active_date: "2026-10-10" });
  });

  it("extends on the next day, including across month and year boundaries", () => {
    expect(updateStreak(makeStreak({ current: 3, longest: 3, last_active_date: "2026-10-09" }), "2026-10-10")).toEqual({ current: 4, longest: 4, last_active_date: "2026-10-10" });
    expect(updateStreak(makeStreak({ current: 6, longest: 6, last_active_date: "2026-10-31" }), "2026-11-01").current).toBe(7);
    expect(updateStreak(makeStreak({ current: 29, longest: 29, last_active_date: "2026-12-31" }), "2027-01-01")).toEqual({ current: 30, longest: 30, last_active_date: "2027-01-01" });
    expect(updateStreak(makeStreak({ current: 1, longest: 1, last_active_date: "2028-02-28" }), "2028-02-29").current).toBe(2);
  });

  it("resets to 1 after a gap but keeps the longest", () => {
    const s = makeStreak({ current: 9, longest: 9, last_active_date: "2026-10-01" });
    expect(updateStreak(s, "2026-10-03")).toEqual({ current: 1, longest: 9, last_active_date: "2026-10-03" });
    expect(updateStreak(s, "2027-10-01").current).toBe(1);
  });

  it("ignores activity dated before the last active day", () => {
    const s = makeStreak({ current: 4, longest: 4, last_active_date: "2026-10-10" });
    expect(updateStreak(s, "2026-10-09")).toEqual({ current: 4, longest: 4, last_active_date: "2026-10-10" });
  });

  it("keeps longest as the running maximum", () => {
    let s = updateStreak(null, "2026-10-01");
    for (let i = 2; i <= 8; i++) s = updateStreak(s, `2026-10-0${i}`);
    expect(s).toEqual({ current: 8, longest: 8, last_active_date: "2026-10-08" });
    s = updateStreak(s, "2026-10-20");
    expect(s).toEqual({ current: 1, longest: 8, last_active_date: "2026-10-20" });
    s = updateStreak(s, "2026-10-21");
    expect(s.longest).toBe(8);
  });

  it("recovers from a corrupt stored row and rejects a bad activity key", () => {
    expect(updateStreak(makeStreak({ current: 0, longest: 2, last_active_date: "2026-10-09" }), "2026-10-10")).toEqual({ current: 1, longest: 2, last_active_date: "2026-10-10" });
    expect(updateStreak(makeStreak({ current: 3, longest: 3, last_active_date: "not-a-date" }), "2026-10-10")).toEqual({ current: 1, longest: 3, last_active_date: "2026-10-10" });
    expect(() => updateStreak(null, "2026/10/10")).toThrow(RangeError);
  });
});

describe("badges and milestones", () => {
  it("earns streak:7 and streak:30", () => {
    expect([...STREAK_MILESTONES]).toEqual([7, 30]);
    expect(streakBadgeKeys(0)).toEqual([]);
    expect(streakBadgeKeys(6)).toEqual([]);
    expect(streakBadgeKeys(7)).toEqual(["streak:7"]);
    expect(streakBadgeKeys(29)).toEqual(["streak:7"]);
    expect(streakBadgeKeys(30)).toEqual(["streak:7", "streak:30"]);
    expect(streakBadgeKeys(100)).toEqual(["streak:7", "streak:30"]);
  });

  it("points to the next milestone", () => {
    expect(nextStreakMilestone(0)).toBe(7);
    expect(nextStreakMilestone(6)).toBe(7);
    expect(nextStreakMilestone(7)).toBe(30);
    expect(nextStreakMilestone(30)).toBeNull();
  });
});

describe("isStreakAlive / effectiveStreak", () => {
  it("is alive today and yesterday only", () => {
    expect(isStreakAlive(makeStreak({ current: 3, last_active_date: "2026-10-10" }), "2026-10-10")).toBe(true);
    expect(isStreakAlive(makeStreak({ current: 3, last_active_date: "2026-10-09" }), "2026-10-10")).toBe(true);
    expect(isStreakAlive(makeStreak({ current: 3, last_active_date: "2026-10-08" }), "2026-10-10")).toBe(false);
    expect(isStreakAlive(makeStreak({ current: 3, last_active_date: "2026-09-30" }), "2026-10-01")).toBe(true);
  });

  it("is dead for missing, zero or future-dated streaks", () => {
    expect(isStreakAlive(null, "2026-10-10")).toBe(false);
    expect(isStreakAlive(makeStreak({ current: 0, last_active_date: "2026-10-10" }), "2026-10-10")).toBe(false);
    expect(isStreakAlive(makeStreak({ current: 2, last_active_date: "2026-10-11" }), "2026-10-10")).toBe(false);
    expect(isStreakAlive(makeStreak({ current: 2, last_active_date: "bad" }), "2026-10-10")).toBe(false);
  });

  it("effectiveStreak shows 0 once lapsed", () => {
    expect(effectiveStreak(makeStreak({ current: 5, last_active_date: "2026-10-09" }), "2026-10-10")).toBe(5);
    expect(effectiveStreak(makeStreak({ current: 5, last_active_date: "2026-10-01" }), "2026-10-10")).toBe(0);
    expect(effectiveStreak(null, "2026-10-10")).toBe(0);
  });
});
