import { describe, expect, it } from "vitest";
import {
  DAY_MS,
  DRIP_SCHEDULE_DAYS,
  calendarDaysUntil,
  enrollmentIsCurrent,
  humanizeUnlock,
  isLessonUnlocked,
  isModuleUnlocked,
  isUnlocked,
  lessonDripDays,
  moduleUnlockDate,
  nextUnlockSummary,
  unlockDate,
  upcomingUnlocks,
} from "@/lib/domain/drip";
import { NOW, STARTED_AT, SHEET_MODULES, daysAfter, makeEnrollment, makeLesson, makeModule } from "./fixtures";

const start = new Date(STARTED_AT);

describe("lessonDripDays", () => {
  it("uses the module drip days when the lesson has no override", () => {
    expect(lessonDripDays(makeLesson({ drip_days_override: null }), makeModule({ drip_days: 14 }))).toBe(14);
  });

  it("lets a lesson override win, including an override of 0", () => {
    expect(lessonDripDays(makeLesson({ drip_days_override: 3 }), makeModule({ drip_days: 14 }))).toBe(3);
    expect(lessonDripDays(makeLesson({ drip_days_override: 0 }), makeModule({ drip_days: 14 }))).toBe(0);
  });

  it("never returns a negative number", () => {
    expect(lessonDripDays(makeLesson({ drip_days_override: -5 }), makeModule({ drip_days: 7 }))).toBe(0);
    expect(lessonDripDays(makeLesson(), makeModule({ drip_days: -1 }))).toBe(0);
  });

  it("exposes the sheet schedule", () => {
    expect([...DRIP_SCHEDULE_DAYS]).toEqual([0, 7, 14, 21, 28, 35, 42]);
    expect(SHEET_MODULES.filter((m) => m.kind === "core").map((m) => m.drip_days)).toEqual([0, 7, 14, 21, 28, 35, 42]);
  });
});

describe("enrollmentIsCurrent", () => {
  it("is true for an active enrolment without expiry", () => {
    expect(enrollmentIsCurrent(makeEnrollment(), NOW)).toBe(true);
  });

  it("is false when revoked or expired", () => {
    expect(enrollmentIsCurrent(makeEnrollment({ status: "revoked" }), NOW)).toBe(false);
    expect(enrollmentIsCurrent(makeEnrollment({ status: "expired" }), NOW)).toBe(false);
    expect(enrollmentIsCurrent(makeEnrollment({ expires_at: daysAfter(NOW, -1).toISOString() }), NOW)).toBe(false);
  });

  it("treats expires_at as exclusive and a future expiry as current", () => {
    expect(enrollmentIsCurrent(makeEnrollment({ expires_at: NOW.toISOString() }), NOW)).toBe(false);
    expect(enrollmentIsCurrent(makeEnrollment({ expires_at: new Date(NOW.getTime() + 1).toISOString() }), NOW)).toBe(true);
  });
});

describe("unlockDate", () => {
  it("adds whole days to started_at", () => {
    expect(unlockDate(makeEnrollment(), 7).toISOString()).toBe("2026-10-08T09:30:00.000Z");
    expect(unlockDate(makeEnrollment(), 42).toISOString()).toBe("2026-11-12T09:30:00.000Z");
  });

  it("returns started_at for immediately released content", () => {
    expect(unlockDate(makeEnrollment(), 0).getTime()).toBe(start.getTime());
    expect(unlockDate(makeEnrollment(), -3).getTime()).toBe(start.getTime());
  });

  it("is never in the future for unlock_all", () => {
    const e = makeEnrollment({ unlock_all: true });
    expect(unlockDate(e, 42, NOW).getTime()).toBe(NOW.getTime());
    expect(unlockDate(e, 42).getTime()).toBe(start.getTime());
    // content that is already open keeps its real unlock date
    expect(unlockDate(e, 7, NOW).toISOString()).toBe("2026-10-08T09:30:00.000Z");
  });

  it("does not mutate the input or share Date instances", () => {
    const e = makeEnrollment();
    const a = unlockDate(e, 7);
    a.setUTCFullYear(2000);
    expect(e.started_at).toBe(STARTED_AT);
    expect(unlockDate(e, 7).toISOString()).toBe("2026-10-08T09:30:00.000Z");
  });
});

describe("isUnlocked", () => {
  const e = makeEnrollment();

  it("opens at exactly N days, not a millisecond earlier", () => {
    const at = daysAfter(STARTED_AT, 7);
    expect(isUnlocked(e, 7, at)).toBe(true);
    expect(isUnlocked(e, 7, new Date(at.getTime() - 1))).toBe(false);
    expect(isUnlocked(e, 7, new Date(at.getTime() + 1))).toBe(true);
  });

  it("opens immediately for 0 days but not before the enrolment starts", () => {
    expect(isUnlocked(e, 0, start)).toBe(true);
    expect(isUnlocked(e, 0, new Date(start.getTime() - 1))).toBe(false);
  });

  it("short-circuits with unlock_all", () => {
    expect(isUnlocked(makeEnrollment({ unlock_all: true }), 42, NOW)).toBe(true);
  });

  it("requires an active enrolment even with unlock_all", () => {
    expect(isUnlocked(makeEnrollment({ unlock_all: true, status: "revoked" }), 0, NOW)).toBe(false);
    expect(isUnlocked(makeEnrollment({ status: "expired" }), 0, NOW)).toBe(false);
  });

  it("respects expires_at", () => {
    const expired = makeEnrollment({ expires_at: daysAfter(STARTED_AT, 5).toISOString() });
    expect(isUnlocked(expired, 0, daysAfter(STARTED_AT, 4))).toBe(true);
    expect(isUnlocked(expired, 0, daysAfter(STARTED_AT, 5))).toBe(false);
    expect(isUnlocked(makeEnrollment({ unlock_all: true, expires_at: daysAfter(STARTED_AT, 5).toISOString() }), 0, NOW)).toBe(false);
  });

  it("walks the sheet schedule at NOW (9 days in)", () => {
    const open = SHEET_MODULES.filter((m) => isUnlocked(e, m.drip_days, NOW)).map((m) => m.code);
    expect(open).toEqual(["M0", "M1", "M2", "BONUS", "REPLAY"]);
  });
});

describe("module/lesson helpers", () => {
  it("moduleUnlockDate and isModuleUnlocked use the module drip days", () => {
    const e = makeEnrollment();
    const m = makeModule({ drip_days: 14 });
    expect(moduleUnlockDate(e, m).toISOString()).toBe("2026-10-15T09:30:00.000Z");
    expect(isModuleUnlocked(e, m, NOW)).toBe(false);
    expect(isModuleUnlocked(e, m, daysAfter(STARTED_AT, 14))).toBe(true);
  });

  it("isLessonUnlocked honours the lesson override", () => {
    const e = makeEnrollment();
    const m = makeModule({ drip_days: 14 });
    expect(isLessonUnlocked(e, makeLesson({ drip_days_override: 0 }), m, NOW)).toBe(true);
    expect(isLessonUnlocked(e, makeLesson(), m, NOW)).toBe(false);
  });
});

describe("calendarDaysUntil", () => {
  it("counts calendar days in UTC by default", () => {
    expect(calendarDaysUntil(new Date("2026-10-10T23:59:00Z"), NOW)).toBe(0);
    expect(calendarDaysUntil(new Date("2026-10-11T00:30:00Z"), NOW)).toBe(1);
    expect(calendarDaysUntil(new Date("2026-10-14T09:30:00Z"), NOW)).toBe(4);
    expect(calendarDaysUntil(new Date("2026-10-09T12:00:00Z"), NOW)).toBe(-1);
  });

  it("respects the time zone", () => {
    // 03:00Z on Oct 11 is still Oct 10 in New York
    expect(calendarDaysUntil(new Date("2026-10-11T03:00:00Z"), NOW, "America/New_York")).toBe(0);
    expect(calendarDaysUntil(new Date("2026-10-11T03:00:00Z"), NOW, "UTC")).toBe(1);
  });

  it("crosses month and year boundaries", () => {
    expect(calendarDaysUntil(new Date("2026-11-01T00:00:00Z"), new Date("2026-10-31T23:00:00Z"))).toBe(1);
    expect(calendarDaysUntil(new Date("2027-01-01T00:00:00Z"), new Date("2026-12-31T00:00:00Z"))).toBe(1);
  });
});

describe("upcomingUnlocks", () => {
  const modules = SHEET_MODULES.map((s) => makeModule({ code: s.code, position: s.position, drip_days: s.drip_days }));

  it("lists locked modules soonest first with days until", () => {
    const e = makeEnrollment();
    const list = upcomingUnlocks(e, modules, NOW);
    expect(list.map((u) => u.module.code)).toEqual(["M3", "M4", "M5", "M6", "M7"]);
    expect(list[0].unlocksAt.toISOString()).toBe("2026-10-15T09:30:00.000Z");
    expect(list.map((u) => u.daysUntil)).toEqual([5, 12, 19, 26, 33]);
  });

  it("is empty for unlock_all, revoked or expired enrolments", () => {
    expect(upcomingUnlocks(makeEnrollment({ unlock_all: true }), modules, NOW)).toEqual([]);
    expect(upcomingUnlocks(makeEnrollment({ status: "revoked" }), modules, NOW)).toEqual([]);
    expect(upcomingUnlocks(makeEnrollment({ expires_at: NOW.toISOString() }), modules, NOW)).toEqual([]);
  });

  it("is empty once everything is open", () => {
    expect(upcomingUnlocks(makeEnrollment(), modules, daysAfter(STARTED_AT, 42))).toEqual([]);
    expect(upcomingUnlocks(makeEnrollment(), modules, new Date(daysAfter(STARTED_AT, 42).getTime() - 1))).toHaveLength(1);
  });

  it("orders ties by module position", () => {
    const tied = [makeModule({ code: "B", position: 2, drip_days: 21 }), makeModule({ code: "A", position: 1, drip_days: 21 })];
    expect(upcomingUnlocks(makeEnrollment(), tied, NOW).map((u) => u.module.code)).toEqual(["A", "B"]);
  });

  it("includes a module opening later today as 0 days", () => {
    const e = makeEnrollment({ started_at: "2026-10-03T20:00:00.000Z" }); // +7d = Oct 10 20:00Z
    const list = upcomingUnlocks(e, [makeModule({ code: "M2", drip_days: 7 })], NOW);
    expect(list).toHaveLength(1);
    expect(list[0].daysUntil).toBe(0);
  });
});

describe("humanizeUnlock", () => {
  it("phrases the wait warmly", () => {
    expect(humanizeUnlock(new Date(NOW.getTime() - 1), NOW)).toBe("open now");
    expect(humanizeUnlock(NOW, NOW)).toBe("open now");
    expect(humanizeUnlock(new Date(NOW.getTime() + 3 * 60 * 60 * 1000), NOW)).toBe("opens today");
    expect(humanizeUnlock(new Date(NOW.getTime() + DAY_MS), NOW)).toBe("opens tomorrow");
    expect(humanizeUnlock(new Date("2026-10-14T09:30:00Z"), NOW)).toBe("opens in 4 days");
    expect(humanizeUnlock(new Date("2026-11-12T09:30:00Z"), NOW)).toBe("opens in 33 days");
  });

  it("uses the learner's time zone for today/tomorrow", () => {
    const lateTonightUtc = new Date("2026-10-11T02:00:00Z");
    expect(humanizeUnlock(lateTonightUtc, NOW, "America/Los_Angeles")).toBe("opens today");
    expect(humanizeUnlock(lateTonightUtc, NOW)).toBe("opens tomorrow");
  });
});

describe("nextUnlockSummary", () => {
  const modules = SHEET_MODULES.map((s) => makeModule({ code: s.code, position: s.position, drip_days: s.drip_days }));

  it("summarises the soonest locked module", () => {
    const summary = nextUnlockSummary(makeEnrollment(), modules, NOW);
    expect(summary).not.toBeNull();
    expect(summary!.module.code).toBe("M3");
    expect(summary!.daysUntil).toBe(5);
    expect(summary!.phrase).toBe("opens in 5 days");
    expect(summary!.remaining).toBe(5);
    expect(summary!.unlocksAt.toISOString()).toBe("2026-10-15T09:30:00.000Z");
  });

  it("is null when nothing is locked", () => {
    expect(nextUnlockSummary(makeEnrollment({ unlock_all: true }), modules, NOW)).toBeNull();
    expect(nextUnlockSummary(makeEnrollment(), modules, daysAfter(STARTED_AT, 60))).toBeNull();
    expect(nextUnlockSummary(makeEnrollment(), [], NOW)).toBeNull();
  });
});
