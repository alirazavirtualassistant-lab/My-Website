import { describe, expect, it } from "vitest";
import { curriculumOrder, joinDuration, moveItem, moveLesson, moveModule, nudge, renumber, splitDuration } from "@/components/admin/courses/reorder";

const tree = () => [
  { id: "m1", lessons: [{ id: "a" }, { id: "b" }, { id: "c" }] },
  { id: "m2", lessons: [{ id: "d" }, { id: "e" }] },
  { id: "m3", lessons: [] as Array<{ id: string }> },
];

describe("moveItem / nudge / renumber", () => {
  it("moves and clamps", () => {
    expect(moveItem([1, 2, 3, 4], 0, 2)).toEqual([2, 3, 1, 4]);
    expect(moveItem([1, 2, 3, 4], 3, 0)).toEqual([4, 1, 2, 3]);
    expect(moveItem([1, 2, 3], 1, 99)).toEqual([1, 3, 2]);
    expect(moveItem([1, 2, 3], 7, 0)).toEqual([1, 2, 3]);
  });

  it("nudges by id and ignores edges", () => {
    const items = [{ id: "x" }, { id: "y" }, { id: "z" }];
    expect(nudge(items, "y", -1).map((i) => i.id)).toEqual(["y", "x", "z"]);
    expect(nudge(items, "x", -1).map((i) => i.id)).toEqual(["x", "y", "z"]);
    expect(nudge(items, "z", 1).map((i) => i.id)).toEqual(["x", "y", "z"]);
  });

  it("renumbers positions to array order without touching correct rows", () => {
    const rows = [
      { id: "a", position: 2 },
      { id: "b", position: 1 },
    ];
    const out = renumber(rows);
    expect(out.map((r) => r.position)).toEqual([0, 1]);
    expect(out[1]).toBe(rows[1]);
  });
});

describe("moveLesson", () => {
  it("reorders within a module, dropping downwards lands after the hovered item", () => {
    const out = moveLesson(tree(), "a", { type: "lesson", id: "c" });
    expect(out[0].lessons.map((l) => l.id)).toEqual(["b", "c", "a"]);
  });

  it("reorders within a module, dropping upwards lands before the hovered item", () => {
    const out = moveLesson(tree(), "c", { type: "lesson", id: "a" });
    expect(out[0].lessons.map((l) => l.id)).toEqual(["c", "a", "b"]);
  });

  it("moves across modules before the hovered lesson", () => {
    const out = moveLesson(tree(), "b", { type: "lesson", id: "e" });
    expect(out[0].lessons.map((l) => l.id)).toEqual(["a", "c"]);
    expect(out[1].lessons.map((l) => l.id)).toEqual(["d", "b", "e"]);
  });

  it("appends when dropped on an empty module container", () => {
    const out = moveLesson(tree(), "d", { type: "module", id: "m3" });
    expect(out[1].lessons.map((l) => l.id)).toEqual(["e"]);
    expect(out[2].lessons.map((l) => l.id)).toEqual(["d"]);
  });

  it("returns the same reference for no-ops and unknown ids", () => {
    const t = tree();
    expect(moveLesson(t, "a", { type: "lesson", id: "a" })).toBe(t);
    expect(moveLesson(t, "zzz", { type: "module", id: "m1" })).toBe(t);
    expect(moveLesson(t, "a", { type: "module", id: "nope" })).toBe(t);
  });
});

describe("moveModule / curriculumOrder", () => {
  it("moves modules and emits the persisted payload", () => {
    const out = moveModule(tree(), "m3", "m1");
    expect(out.map((m) => m.id)).toEqual(["m3", "m1", "m2"]);
    expect(curriculumOrder(out)).toEqual([
      { module_id: "m3", lesson_ids: [] },
      { module_id: "m1", lesson_ids: ["a", "b", "c"] },
      { module_id: "m2", lesson_ids: ["d", "e"] },
    ]);
  });
});

describe("durations", () => {
  it("splits and joins minutes:seconds", () => {
    expect(splitDuration(600)).toEqual({ minutes: 10, seconds: 0 });
    expect(splitDuration(95)).toEqual({ minutes: 1, seconds: 35 });
    expect(joinDuration(10, 5)).toBe(605);
    expect(joinDuration(-1, 99)).toBe(59);
    expect(joinDuration(Number.NaN, Number.NaN)).toBe(0);
  });
});
