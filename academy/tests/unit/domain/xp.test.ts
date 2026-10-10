import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { CoursePackage } from "@/lib/types";
import { xpLevels } from "@/lib/config/site";
import {
  CORE_MODULE_CODES,
  COURSE_GOALS,
  COURSE_GOALS_TOTAL_XP,
  LEVELS,
  computeCourseXp,
  computeLessonXp,
  computeModuleXp,
  courseGoalAwards,
  courseGoalByKey,
  courseGoalsReached,
  hasAward,
  ledgerTotal,
  ledgerTotalForCourse,
  levelByKey,
  levelForXp,
  shouldAwardModuleCompletion,
  subItemRefId,
  xpAwardsForStepCompletion,
} from "@/lib/domain/xp";
import {
  SHEET_TOTAL_XP,
  SHEET_XP_BY_MODULE,
  makeLesson,
  makePreActionsStep,
  makeSheetTree,
  makeStep,
  makeTreeLesson,
  makeTreeModule,
  makeXpEntry,
  moduleByCode,
  treeFromPackage,
} from "./fixtures";

describe("computeLessonXp / computeModuleXp", () => {
  it("sums step XP and ignores negatives", () => {
    expect(computeLessonXp([])).toBe(0);
    expect(computeLessonXp([makeStep({ xp: 50 }), makeStep({ xp: 25 })])).toBe(75);
    expect(computeLessonXp([makeStep({ xp: 50 }), makeStep({ xp: -5 })])).toBe(50);
  });

  it("adds the module completion XP once", () => {
    const lessons = [makeTreeLesson({ action_steps: [makeStep({ xp: 50 })] }), makeTreeLesson({ action_steps: [makeStep({ xp: 25 })] })];
    expect(computeModuleXp(makeTreeModule({ completion_xp: 10 }), lessons)).toBe(85);
    expect(computeModuleXp(makeTreeModule({ completion_xp: 0 }), lessons)).toBe(75);
    expect(computeModuleXp(makeTreeModule({ completion_xp: 5 }), [])).toBe(5);
  });
});

describe("computeCourseXp", () => {
  const tree = makeSheetTree();
  const xp = computeCourseXp(tree);

  it("reproduces the sheet numbers per module and in total", () => {
    expect(xp.byModuleCode).toEqual(SHEET_XP_BY_MODULE);
    expect(xp.total).toBe(SHEET_TOTAL_XP);
    expect(xp.total).toBe(4085);
  });

  it("keys byModule by id and byLesson by id", () => {
    expect(xp.byModule["mod-M1"]).toBe(460);
    expect(xp.byModule["mod-BONUS"]).toBe(50);
    expect(xp.byLesson["M0T0"]).toBe(60);
    expect(xp.byLesson["M1T0"]).toBe(75);
    expect(Object.keys(xp.byLesson)).toHaveLength(59);
    const lessonSum = Object.values(xp.byLesson).reduce((a, b) => a + b, 0);
    const completionSum = tree.modules.reduce((n, m) => n + m.completion_xp, 0);
    expect(lessonSum + completionSum).toBe(xp.total);
    expect(completionSum).toBe(75);
  });

  it("merges modules that share a code into byModuleCode", () => {
    const twice = { modules: [moduleByCode(tree, "M1"), { ...moduleByCode(tree, "M1"), id: "mod-M1-copy" }] };
    expect(computeCourseXp(twice).byModuleCode.M1).toBe(920);
    expect(computeCourseXp(twice).byModule["mod-M1-copy"]).toBe(460);
  });

  it("handles an empty course", () => {
    expect(computeCourseXp({ modules: [] })).toEqual({ total: 0, byModule: {}, byModuleCode: {}, byLesson: {} });
  });
});

describe("computeCourseXp against the imported package", () => {
  const file = path.resolve(process.cwd(), "content/courses/baby-steps/course.json");
  const available = fs.existsSync(file);

  it.skipIf(!available)("matches the importer's stats", () => {
    const pkg = JSON.parse(fs.readFileSync(file, "utf8")) as CoursePackage;
    const xp = computeCourseXp(treeFromPackage(pkg));
    expect(xp.byModuleCode).toEqual(pkg.stats.xp_by_module);
    expect(xp.total).toBe(pkg.stats.total_xp);
    expect(xp.total).toBe(4085);
  });
});

describe("levelForXp", () => {
  it("exposes the config levels in ascending order", () => {
    expect(LEVELS.map((l) => l.key)).toEqual(xpLevels.map((l) => l.key));
    expect(LEVELS.map((l) => l.minXp)).toEqual([0, 1000, 2500, 4000]);
  });

  it("starts at Seedling with the full road ahead", () => {
    const r = levelForXp(0);
    expect(r.level.key).toBe("seedling");
    expect(r.next?.key).toBe("sprout");
    expect(r.progress).toBe(0);
    expect(r.xpToNext).toBe(1000);
  });

  it("switches level exactly at the threshold", () => {
    expect(levelForXp(999).level.key).toBe("seedling");
    expect(levelForXp(1000).level.key).toBe("sprout");
    expect(levelForXp(2499).level.key).toBe("sprout");
    expect(levelForXp(2500).level.key).toBe("bloom");
    expect(levelForXp(3999).level.key).toBe("bloom");
    expect(levelForXp(4000).level.key).toBe("harvest");
  });

  it("reports progress within a level", () => {
    const r = levelForXp(1750);
    expect(r.level.key).toBe("sprout");
    expect(r.next?.key).toBe("bloom");
    expect(r.progress).toBeCloseTo(0.5, 5);
    expect(r.xpToNext).toBe(750);
    expect(levelForXp(3999).progress).toBeCloseTo(1499 / 1500, 5);
  });

  it("caps at the top level", () => {
    const top = levelForXp(4000);
    expect(top.next).toBeNull();
    expect(top.progress).toBe(1);
    expect(top.xpToNext).toBe(0);
    expect(levelForXp(10_000).level.key).toBe("harvest");
    expect(levelForXp(SHEET_TOTAL_XP + COURSE_GOALS_TOTAL_XP).level.key).toBe("harvest");
  });

  it("treats negative or invalid XP as 0", () => {
    expect(levelForXp(-50)).toEqual(levelForXp(0));
    expect(levelForXp(Number.NaN).xp).toBe(0);
  });

  it("looks levels up by key", () => {
    expect(levelByKey("bloom").minXp).toBe(2500);
  });
});

describe("xpAwardsForStepCompletion", () => {
  it("awards a plain step once in full", () => {
    const step = makeStep({ id: "s1", xp: 50 });
    expect(xpAwardsForStepCompletion(step, [])).toEqual([{ reason: "action_step", ref_id: "s1", amount: 50 }]);
    expect(xpAwardsForStepCompletion(step, [], true)).toEqual([{ reason: "action_step", ref_id: "s1", amount: 50 }]);
  });

  it("awards nothing for an incomplete or zero-XP plain step", () => {
    expect(xpAwardsForStepCompletion(makeStep({ xp: 50 }), [], false)).toEqual([]);
    expect(xpAwardsForStepCompletion(makeStep({ xp: 0 }), [])).toEqual([]);
  });

  it("awards each done sub item and nothing more until all are done", () => {
    const step = makePreActionsStep("M0T0");
    expect(xpAwardsForStepCompletion(step, ["introduce"])).toEqual([{ reason: "sub_item", ref_id: subItemRefId(step.id, "introduce"), amount: 10 }]);
    expect(xpAwardsForStepCompletion(step, ["survey", "whitelist"])).toEqual([
      { reason: "sub_item", ref_id: `${step.id}:whitelist`, amount: 10 },
      { reason: "sub_item", ref_id: `${step.id}:survey`, amount: 40 },
    ]);
    expect(xpAwardsForStepCompletion(step, ["introduce", "whitelist"]).map((a) => a.reason)).toEqual(["sub_item", "sub_item"]);
  });

  it("awards all sub items (and no remainder) when the sub items make up the whole step", () => {
    const step = makePreActionsStep("M0T0");
    const awards = xpAwardsForStepCompletion(step, ["introduce", "whitelist", "survey"]);
    expect(awards.map((a) => a.amount)).toEqual([10, 10, 40]);
    expect(awards.reduce((n, a) => n + a.amount, 0)).toBe(60);
    expect(awards.some((a) => a.reason === "action_step")).toBe(false);
  });

  it("awards the remainder as the step itself once every sub item is done", () => {
    const step = makeStep({ id: "s2", xp: 70, sub_items: [{ key: "a", label: "A", xp: 10 }, { key: "b", label: "B", xp: 40 }] });
    expect(xpAwardsForStepCompletion(step, ["a"])).toEqual([{ reason: "sub_item", ref_id: "s2:a", amount: 10 }]);
    expect(xpAwardsForStepCompletion(step, ["a", "b"])).toEqual([
      { reason: "sub_item", ref_id: "s2:a", amount: 10 },
      { reason: "sub_item", ref_id: "s2:b", amount: 40 },
      { reason: "action_step", ref_id: "s2", amount: 20 },
    ]);
  });

  it("treats stepCompleted=true as every sub item done", () => {
    const step = makePreActionsStep("M0T0");
    expect(xpAwardsForStepCompletion(step, [], true).reduce((n, a) => n + a.amount, 0)).toBe(60);
  });

  it("ignores unknown sub item keys and stepCompleted=false", () => {
    const step = makePreActionsStep("M0T0");
    expect(xpAwardsForStepCompletion(step, ["nope"])).toEqual([]);
    expect(xpAwardsForStepCompletion(step, ["introduce", "whitelist", "survey"], false).some((a) => a.reason === "action_step")).toBe(false);
  });
});

describe("shouldAwardModuleCompletion", () => {
  const lessons = [makeLesson({ id: "a" }), makeLesson({ id: "b" }), makeLesson({ id: "d", status: "draft" })];

  it("needs every published lesson", () => {
    expect(shouldAwardModuleCompletion(lessons, ["a"])).toBe(false);
    expect(shouldAwardModuleCompletion(lessons, ["a", "b"])).toBe(true);
    expect(shouldAwardModuleCompletion(lessons, new Set(["a", "b"]))).toBe(true);
  });

  it("is false for a module without published lessons", () => {
    expect(shouldAwardModuleCompletion([], ["a"])).toBe(false);
    expect(shouldAwardModuleCompletion([makeLesson({ id: "d", status: "draft" })], ["d"])).toBe(false);
  });
});

describe("COURSE_GOALS", () => {
  it("quotes the Welcome Guide", () => {
    expect(COURSE_GOALS.map((g) => g.key)).toEqual(["minimum", "target", "stretch"]);
    expect(COURSE_GOALS.map((g) => g.xp)).toEqual([50, 100, 150]);
    expect(COURSE_GOALS.map((g) => g.badge_key)).toEqual(["goal:minimum", "goal:target", "goal:stretch"]);
    expect(COURSE_GOALS[0].description).toBe(
      "Minimum goal (50 XP): identify your personal health barriers (such as cravings) and set your first wellness habits.",
    );
    expect(COURSE_GOALS[1].description).toBe(
      "Target goal (100 XP): reach a solid pre-conception baseline for you and your partner, including balanced nutrition and lower stress.",
    );
    expect(COURSE_GOALS[2].description).toBe(
      "Stretch goal (150 XP): reduce toxins, build strong family bonds, and prepare a multi-generational legacy of health with sustained vitality.",
    );
    expect(COURSE_GOALS_TOTAL_XP).toBe(300);
  });

  it("requires M1, M1–M4 and M1–M7", () => {
    expect(COURSE_GOALS[0].requires_modules).toEqual(["M1"]);
    expect(COURSE_GOALS[1].requires_modules).toEqual(["M1", "M2", "M3", "M4"]);
    expect(COURSE_GOALS[2].requires_modules).toEqual([...CORE_MODULE_CODES]);
    expect(courseGoalByKey("target").xp).toBe(100);
  });

  it("courseGoalsReached follows module completion", () => {
    expect(courseGoalsReached([]).map((g) => g.key)).toEqual([]);
    expect(courseGoalsReached(["M0"]).map((g) => g.key)).toEqual([]);
    expect(courseGoalsReached(["M1"]).map((g) => g.key)).toEqual(["minimum"]);
    expect(courseGoalsReached(["M2", "M3", "M4"]).map((g) => g.key)).toEqual([]);
    expect(courseGoalsReached(new Set(["M1", "M2", "M3", "M4"])).map((g) => g.key)).toEqual(["minimum", "target"]);
    expect(courseGoalsReached([...CORE_MODULE_CODES, "BONUS"]).map((g) => g.key)).toEqual(["minimum", "target", "stretch"]);
  });

  it("courseGoalAwards skips goals already in the ledger", () => {
    const entries = [makeXpEntry({ reason: "course_goal", ref_id: "goal:minimum", amount: 50 })];
    expect(courseGoalAwards(["M1", "M2", "M3", "M4"], entries)).toEqual([{ reason: "course_goal", ref_id: "goal:target", amount: 100 }]);
    expect(courseGoalAwards(["M1"])).toEqual([{ reason: "course_goal", ref_id: "goal:minimum", amount: 50 }]);
  });
});

describe("ledger helpers", () => {
  const entries = [
    makeXpEntry({ amount: 50, reason: "action_step", ref_id: "s1" }),
    makeXpEntry({ amount: 10, reason: "sub_item", ref_id: "s2:a" }),
    makeXpEntry({ amount: 10, reason: "module_complete", ref_id: "mod-M1" }),
    makeXpEntry({ amount: -5, reason: "admin_adjustment", ref_id: null, course_id: null }),
  ];

  it("totals amounts including adjustments", () => {
    expect(ledgerTotal(entries)).toBe(65);
    expect(ledgerTotal([])).toBe(0);
    expect(ledgerTotalForCourse(entries, "course-baby-steps")).toBe(70);
    expect(ledgerTotalForCourse(entries, "other")).toBe(0);
  });

  it("hasAward matches reason and ref_id exactly", () => {
    expect(hasAward(entries, "action_step", "s1")).toBe(true);
    expect(hasAward(entries, "sub_item", "s1")).toBe(false);
    expect(hasAward(entries, "sub_item", "s2:a")).toBe(true);
    expect(hasAward(entries, "module_complete", "mod-M2")).toBe(false);
    expect(hasAward(entries, "admin_adjustment", null)).toBe(true);
    expect(hasAward([], "action_step", "s1")).toBe(false);
  });
});
