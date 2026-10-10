import { describe, expect, it } from "vitest";
import { continueFor, lastActivityAt, lessonSegment, pickContinue, type ContinueSource } from "@/components/dashboard/pick-continue";

function lesson(code: string, title = `Lesson ${code}`) {
  return { id: `lesson-${code}`, code, title, duration_sec: 600 };
}

function source(overrides: Partial<ContinueSource> & { slug?: string } = {}): ContinueSource {
  const { slug = "baby-steps", ...rest } = overrides;
  const next = rest.next === undefined ? { moduleId: "mod-M1", lesson: lesson("M1T2") } : rest.next;
  return {
    tree: {
      course: { slug, title: `Course ${slug}` },
      modules: [
        { id: "mod-M0", code: "M0", title: "Course Home" },
        { id: "mod-M1", code: "M1", title: "Foundations of Family Wellness" },
        { id: "mod-M2", code: "M2", title: "Nutrition for Optimal Fertility" },
      ],
    },
    enrollment: { started_at: "2026-09-30T09:00:00.000Z" },
    progress: [],
    summary: { percent: 20, completedLessons: 3, totalLessons: 15 },
    lessons: {
      "lesson-M1T2": { unlocked: true, unlocksAt: null, lastPositionSec: 215.7, completed: false },
      "lesson-M2T0": { unlocked: false, unlocksAt: "2026-10-14T09:00:00.000Z", lastPositionSec: 0, completed: false },
    },
    ...rest,
    next,
  };
}

describe("lessonSegment", () => {
  it("mirrors lessonSlug(): lowercase, underscores to dashes", () => {
    expect(lessonSegment({ code: "M1T1" })).toBe("m1t1");
    expect(lessonSegment({ code: "BONUS_T2a" })).toBe("bonus-t2a");
    expect(lessonSegment({ code: "REPLAY_T1" })).toBe("replay-t1");
  });
});

describe("lastActivityAt", () => {
  it("returns the latest updated_at, ignoring unparsable timestamps", () => {
    expect(lastActivityAt({ progress: [] })).toBeNull();
    expect(
      lastActivityAt({
        progress: [
          { updated_at: "2026-10-01T00:00:00.000Z", completed_at: null },
          { updated_at: "not a date", completed_at: null },
          { updated_at: "2026-10-05T00:00:00.000Z", completed_at: "2026-10-05T00:00:00.000Z" },
          { updated_at: "2026-10-03T00:00:00.000Z", completed_at: null },
        ],
      }),
    ).toBe("2026-10-05T00:00:00.000Z");
  });
});

describe("continueFor", () => {
  it("points at the next unlocked lesson with its resume position and module", () => {
    const pick = continueFor(source({ progress: [{ updated_at: "2026-10-08T10:00:00.000Z", completed_at: null }] }));
    expect(pick).not.toBeNull();
    expect(pick!.href).toBe("/learn/baby-steps/m1t2");
    expect(pick!.moduleCode).toBe("M1");
    expect(pick!.moduleTitle).toBe("Foundations of Family Wellness");
    expect(pick!.resumeSec).toBe(215);
    expect(pick!.unlocked).toBe(true);
    expect(pick!.percent).toBe(20);
    expect(pick!.isFresh).toBe(false);
    expect(pick!.lastActiveAt).toBe("2026-10-08T10:00:00.000Z");
  });

  it("falls back to the course home when the next lesson is still locked", () => {
    const pick = continueFor(source({ next: { moduleId: "mod-M2", lesson: lesson("M2T0") } }));
    expect(pick!.href).toBe("/learn/baby-steps");
    expect(pick!.unlocked).toBe(false);
    expect(pick!.unlocksAt).toBe("2026-10-14T09:00:00.000Z");
  });

  it("treats a lesson without a state entry as unlocked from the start", () => {
    const pick = continueFor(source({ next: { moduleId: "mod-M0", lesson: lesson("M0") }, lessons: {} }));
    expect(pick!.href).toBe("/learn/baby-steps/m0");
    expect(pick!.resumeSec).toBe(0);
    expect(pick!.isFresh).toBe(true);
  });

  it("returns null when the course has no next lesson", () => {
    expect(continueFor(source({ next: null }))).toBeNull();
  });
});

describe("pickContinue", () => {
  it("returns null for no enrolments", () => {
    expect(pickContinue([])).toBeNull();
  });

  it("prefers the course with the most recent activity", () => {
    const older = source({ slug: "older", progress: [{ updated_at: "2026-10-02T00:00:00.000Z", completed_at: null }] });
    const newer = source({ slug: "newer", progress: [{ updated_at: "2026-10-09T00:00:00.000Z", completed_at: null }] });
    expect(pickContinue([older, newer])!.courseSlug).toBe("newer");
    expect(pickContinue([newer, older])!.courseSlug).toBe("newer");
  });

  it("uses the enrolment start when a course has no activity yet, and activity beats a later enrolment", () => {
    const fresh = source({ slug: "fresh", enrollment: { started_at: "2026-10-09T00:00:00.000Z" } });
    const touched = source({ slug: "touched", enrollment: { started_at: "2026-09-01T00:00:00.000Z" }, progress: [{ updated_at: "2026-10-03T00:00:00.000Z", completed_at: null }] });
    expect(pickContinue([fresh, touched])!.courseSlug).toBe("fresh");

    const freshOld = source({ slug: "fresh-old", enrollment: { started_at: "2026-09-20T00:00:00.000Z" } });
    expect(pickContinue([freshOld, touched])!.courseSlug).toBe("touched");
  });

  it("keeps list order on a tie and skips courses without a next lesson", () => {
    const a = source({ slug: "a", enrollment: { started_at: "2026-10-01T00:00:00.000Z" } });
    const b = source({ slug: "b", enrollment: { started_at: "2026-10-01T00:00:00.000Z" } });
    expect(pickContinue([a, b])!.courseSlug).toBe("a");

    const empty = source({ slug: "empty", next: null, progress: [{ updated_at: "2026-12-01T00:00:00.000Z", completed_at: null }] });
    expect(pickContinue([empty, b])!.courseSlug).toBe("b");
    expect(pickContinue([empty])).toBeNull();
  });
});
