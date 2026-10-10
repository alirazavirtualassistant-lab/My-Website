import { describe, expect, it } from "vitest";
import {
  adjacentLessons,
  completedLessonIds,
  completedModuleCodes,
  courseProgress,
  findLesson,
  isLessonComplete,
  isLessonPublished,
  lessonOrder,
  moduleIsComplete,
  nextLesson,
  nextLessonAfter,
  prevLesson,
} from "@/lib/domain/progress";
import {
  NOW,
  STARTED_AT,
  completeLessons,
  completeModules,
  daysAfter,
  makeEnrollment,
  makeLesson,
  makeProgressRow,
  makeSheetTree,
  makeTree,
  makeTreeLesson,
  makeTreeModule,
  moduleByCode,
} from "./fixtures";

describe("isLessonPublished", () => {
  it("accepts published, rejects draft", () => {
    expect(isLessonPublished(makeLesson({ status: "published" }))).toBe(true);
    expect(isLessonPublished(makeLesson({ status: "draft" }))).toBe(false);
  });

  it("accepts a scheduled lesson only once publish_at has passed and now is known", () => {
    const scheduled = makeLesson({ status: "scheduled", publish_at: "2026-10-09T00:00:00Z" });
    expect(isLessonPublished(scheduled)).toBe(false);
    expect(isLessonPublished(scheduled, NOW)).toBe(true);
    expect(isLessonPublished(scheduled, new Date("2026-10-08T00:00:00Z"))).toBe(false);
    expect(isLessonPublished(makeLesson({ status: "scheduled", publish_at: null }), NOW)).toBe(false);
  });
});

describe("completedLessonIds / isLessonComplete", () => {
  it("only counts rows with completed_at", () => {
    const rows = [makeProgressRow("a"), makeProgressRow("b", false)];
    expect([...completedLessonIds(rows)]).toEqual(["a"]);
    expect(isLessonComplete(rows, "a")).toBe(true);
    expect(isLessonComplete(rows, "b")).toBe(false);
    expect(isLessonComplete(rows, "zzz")).toBe(false);
  });
});

describe("courseProgress", () => {
  const tree = makeSheetTree();

  it("starts at zero with the sheet's lesson counts", () => {
    const p = courseProgress(tree, []);
    expect(p.percent).toBe(0);
    expect(p.completedLessons).toBe(0);
    expect(p.totalLessons).toBe(59);
    expect(p.requiredTotal).toBe(53);
    expect(p.requiredCompleted).toBe(0);
    expect(p.byModule["mod-M2"]).toEqual({ completed: 0, total: 9, percent: 0 });
    expect(Object.keys(p.byModule)).toHaveLength(10);
  });

  it("counts completed lessons per module and overall", () => {
    const rows = [...completeModules(tree, (m) => m.code === "M1"), ...completeLessons(tree, ["M2T0", "M2T1", "BONUS_T0"].filter((id) => id !== "BONUS_T0")), makeProgressRow("BONUST0")];
    const p = courseProgress(tree, rows);
    expect(p.byModule["mod-M1"]).toEqual({ completed: 6, total: 6, percent: 100 });
    expect(p.byModule["mod-M2"]).toEqual({ completed: 2, total: 9, percent: 22 });
    expect(p.byModule["mod-BONUS"]).toEqual({ completed: 1, total: 4, percent: 25 });
    expect(p.completedLessons).toBe(9);
    expect(p.percent).toBe(Math.round((900) / 59));
    expect(p.requiredCompleted).toBe(8);
  });

  it("reaches 100% only when everything (bonus included) is done", () => {
    const required = completeModules(tree, (m) => m.required_for_certificate);
    const p = courseProgress(tree, required);
    expect(p.requiredCompleted).toBe(53);
    expect(p.percent).toBe(90);
    expect(courseProgress(tree, completeModules(tree)).percent).toBe(100);
  });

  it("ignores draft lessons and duplicate rows", () => {
    const t = makeTree({
      modules: [makeTreeModule({ id: "m", lessons: [makeTreeLesson({ id: "a" }), makeTreeLesson({ id: "d", status: "draft" })] })],
    });
    const p = courseProgress(t, [makeProgressRow("a"), makeProgressRow("a"), makeProgressRow("d")]);
    expect(p).toEqual({ percent: 100, completedLessons: 1, totalLessons: 1, requiredCompleted: 1, requiredTotal: 1, byModule: { m: { completed: 1, total: 1, percent: 100 } } });
  });

  it("is safe on an empty course", () => {
    expect(courseProgress(makeTree(), []).percent).toBe(0);
  });
});

describe("moduleIsComplete / completedModuleCodes", () => {
  const tree = makeSheetTree();

  it("needs every published lesson", () => {
    const m1 = moduleByCode(tree, "M1");
    expect(moduleIsComplete(m1, [])).toBe(false);
    expect(moduleIsComplete(m1, completeLessons(tree, ["M1T0", "M1T1", "M1T2", "M1T3", "M1T4"]))).toBe(false);
    expect(moduleIsComplete(m1, completeModules(tree, (m) => m.code === "M1"))).toBe(true);
  });

  it("is false for an empty module and ignores drafts", () => {
    expect(moduleIsComplete(makeTreeModule({ lessons: [] }), [])).toBe(false);
    const withDraft = makeTreeModule({ lessons: [makeTreeLesson({ id: "a" }), makeTreeLesson({ id: "d", status: "draft" })] });
    expect(moduleIsComplete(withDraft, [makeProgressRow("a")])).toBe(true);
  });

  it("lists completed module codes in tree order", () => {
    const rows = completeModules(tree, (m) => ["M0", "M1", "REPLAY"].includes(m.code));
    expect(completedModuleCodes(tree, rows)).toEqual(["M0", "M1", "REPLAY"]);
  });
});

describe("lessonOrder and neighbours", () => {
  const tree = makeSheetTree();

  it("flattens modules then lessons by position", () => {
    const order = lessonOrder(tree);
    expect(order).toHaveLength(59);
    expect(order[0].lesson.id).toBe("M0T0");
    expect(order[1].lesson.id).toBe("M1T0");
    expect(order[6].lesson.id).toBe("M1T5");
    expect(order[7].lesson.id).toBe("M2T0");
    expect(order[58].lesson.id).toBe("REPLAYT1");
    expect(order.map((o) => o.index)).toEqual(order.map((_, i) => i));
  });

  it("sorts unsorted input and skips unpublished unless asked", () => {
    const t = makeTree({
      modules: [
        makeTreeModule({ id: "m2", code: "M2", position: 2, lessons: [makeTreeLesson({ id: "b2", position: 1 }), makeTreeLesson({ id: "b1", position: 0 })] }),
        makeTreeModule({ id: "m1", code: "M1", position: 1, lessons: [makeTreeLesson({ id: "a1", position: 0 }), makeTreeLesson({ id: "draft", position: 1, status: "draft" })] }),
      ],
    });
    expect(lessonOrder(t).map((o) => o.lesson.id)).toEqual(["a1", "b1", "b2"]);
    expect(lessonOrder(t, { includeUnpublished: true }).map((o) => o.lesson.id)).toEqual(["a1", "draft", "b1", "b2"]);
  });

  it("includes scheduled lessons once their publish_at has passed", () => {
    const t = makeTree({ modules: [makeTreeModule({ lessons: [makeTreeLesson({ id: "s", status: "scheduled", publish_at: "2026-10-01T00:00:00Z" })] })] });
    expect(lessonOrder(t)).toHaveLength(0);
    expect(lessonOrder(t, { now: NOW })).toHaveLength(1);
  });

  it("finds previous and next across module boundaries", () => {
    const first = adjacentLessons(tree, "M0T0");
    expect(first.prev).toBeNull();
    expect(first.current?.lesson.id).toBe("M0T0");
    expect(first.next?.lesson.id).toBe("M1T0");
    const edge = adjacentLessons(tree, "M1T5");
    expect(edge.prev?.lesson.id).toBe("M1T4");
    expect(edge.next?.lesson.id).toBe("M2T0");
    expect(edge.next?.module.code).toBe("M2");
    const last = adjacentLessons(tree, "REPLAYT1");
    expect(last.next).toBeNull();
    expect(prevLesson(tree, "M2T0")?.lesson.id).toBe("M1T5");
    expect(nextLessonAfter(tree, "M2T0")?.lesson.id).toBe("M2T1");
  });

  it("accepts a precomputed order and handles unknown ids", () => {
    const order = lessonOrder(tree);
    expect(adjacentLessons(order, "M3T0").prev?.lesson.id).toBe("M2T8");
    expect(adjacentLessons(order, "nope")).toEqual({ current: null, prev: null, next: null });
    expect(prevLesson(tree, "nope")).toBeNull();
  });

  it("findLesson returns the module with the lesson", () => {
    expect(findLesson(tree, "M4T2")?.module.code).toBe("M4");
    expect(findLesson(tree, "nope")).toBeNull();
  });
});

describe("nextLesson", () => {
  const tree = makeSheetTree();
  const enrollment = makeEnrollment();

  it("starts at Course Home for a fresh enrolment", () => {
    const next = nextLesson(tree, [], enrollment, NOW);
    expect(next?.module.code).toBe("M0");
    expect(next?.lesson.id).toBe("M0T0");
  });

  it("moves to the first incomplete unlocked lesson", () => {
    const rows = completeLessons(tree, ["M0T0", "M1T0", "M1T1"]);
    expect(nextLesson(tree, rows, enrollment, NOW)?.lesson.id).toBe("M1T2");
  });

  it("skips locked modules while something later is open", () => {
    const day3 = daysAfter(STARTED_AT, 3);
    const rows = completeModules(tree, (m) => ["M0", "M1"].includes(m.code));
    // M2 is locked on day 3; Bonus is open immediately, so that is next
    expect(nextLesson(tree, rows, enrollment, day3)?.lesson.id).toBe("BONUST0");
    expect(nextLesson(tree, rows, enrollment, daysAfter(STARTED_AT, 7))?.lesson.id).toBe("M2T0");
  });

  it("falls back to the first incomplete (locked) lesson when every open lesson is done", () => {
    const day3 = daysAfter(STARTED_AT, 3);
    const rows = completeModules(tree, (m) => ["M0", "M1", "BONUS", "REPLAY"].includes(m.code));
    const next = nextLesson(tree, rows, enrollment, day3);
    expect(next?.lesson.id).toBe("M2T0");
    expect(next?.module.code).toBe("M2");
  });

  it("falls back to the first lesson when the course is complete", () => {
    expect(nextLesson(tree, completeModules(tree), enrollment, NOW)?.lesson.id).toBe("M0T0");
  });

  it("falls back to the first incomplete lesson for a revoked enrolment", () => {
    const rows = completeLessons(tree, ["M0T0"]);
    expect(nextLesson(tree, rows, makeEnrollment({ status: "revoked" }), NOW)?.lesson.id).toBe("M1T0");
  });

  it("treats unlock_all as everything open", () => {
    const rows = completeModules(tree, (m) => ["M0", "M1", "BONUS", "REPLAY"].includes(m.code));
    expect(nextLesson(tree, rows, makeEnrollment({ unlock_all: true }), daysAfter(STARTED_AT, 1))?.lesson.id).toBe("M2T0");
  });

  it("honours a lesson drip override and skips drafts", () => {
    const t = makeTree({
      modules: [
        makeTreeModule({
          id: "m",
          code: "M2",
          drip_days: 7,
          lessons: [
            makeTreeLesson({ id: "draft", position: 0, status: "draft", drip_days_override: 0 }),
            makeTreeLesson({ id: "early", position: 1, drip_days_override: 0 }),
            makeTreeLesson({ id: "later", position: 2 }),
          ],
        }),
      ],
    });
    expect(nextLesson(t, [], enrollment, daysAfter(STARTED_AT, 1))?.lesson.id).toBe("early");
    expect(nextLesson(t, [makeProgressRow("early")], enrollment, daysAfter(STARTED_AT, 1))?.lesson.id).toBe("later");
  });

  it("is null for an empty course", () => {
    expect(nextLesson(makeTree(), [], enrollment, NOW)).toBeNull();
  });
});
