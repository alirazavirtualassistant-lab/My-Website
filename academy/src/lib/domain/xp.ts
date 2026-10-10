/**
 * XP, levels, course goals and ledger helpers — pure functions, no I/O.
 *
 * XP model (from the course sheet):
 * - every action step carries `xp`; a step with `sub_items` has its XP split
 *   across the sub items (the step's `xp` is the inclusive total);
 * - a module's XP = sum of its lessons' step XP + `completion_xp`
 *   (10 for M1–M7, 5 for Course Home, 0 for Bonus/Replay);
 * - the three Welcome Guide goals add 50 / 100 / 150 XP on top.
 */
import type { ActionStep, CourseTree, Lesson, Module, XpEntry, XpReason } from "@/lib/types";
import { xpLevels, type LevelKey } from "@/lib/config/site";

// ---------------------------------------------------------------------------
// Course XP totals
// ---------------------------------------------------------------------------

export type StepXp = Pick<ActionStep, "xp">;

export function computeLessonXp(actionSteps: ReadonlyArray<StepXp>): number {
  let total = 0;
  for (const step of actionSteps) total += Math.max(0, step.xp || 0);
  return total;
}

export function computeModuleXp(
  module: Pick<Module, "completion_xp">,
  lessons: ReadonlyArray<{ action_steps: ReadonlyArray<StepXp> }>,
): number {
  let total = Math.max(0, module.completion_xp || 0);
  for (const lesson of lessons) total += computeLessonXp(lesson.action_steps);
  return total;
}

export interface CourseXp {
  total: number;
  /** keyed by module id */
  byModule: Record<string, number>;
  /** keyed by module code (M0, M1 … BONUS, REPLAY) — matches the importer's `stats.xp_by_module` */
  byModuleCode: Record<string, number>;
  /** keyed by lesson id (step XP only; module completion XP is not attributed to a lesson) */
  byLesson: Record<string, number>;
}

export function computeCourseXp(tree: Pick<CourseTree, "modules">): CourseXp {
  const byModule: Record<string, number> = {};
  const byModuleCode: Record<string, number> = {};
  const byLesson: Record<string, number> = {};
  let total = 0;
  for (const module of tree.modules) {
    for (const lesson of module.lessons) byLesson[lesson.id] = computeLessonXp(lesson.action_steps);
    const moduleXp = computeModuleXp(module, module.lessons);
    byModule[module.id] = moduleXp;
    byModuleCode[module.code] = (byModuleCode[module.code] ?? 0) + moduleXp;
    total += moduleXp;
  }
  return { total, byModule, byModuleCode, byLesson };
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

export interface XpLevel {
  key: LevelKey;
  label: string;
  minXp: number;
}

/** Levels from config, guaranteed ascending by `minXp`. */
export const LEVELS: readonly XpLevel[] = [...xpLevels].sort((a, b) => a.minXp - b.minXp);

export interface LevelProgress {
  xp: number;
  level: XpLevel;
  next: XpLevel | null;
  /** 0..1 progress from `level.minXp` towards `next.minXp` (1 at the top level). */
  progress: number;
  /** XP still needed to reach `next` (0 at the top level). */
  xpToNext: number;
}

export function levelForXp(xp: number): LevelProgress {
  const safeXp = Number.isFinite(xp) ? Math.max(0, xp) : 0;
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) if (LEVELS[i].minXp <= safeXp) index = i;
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  if (!next) return { xp: safeXp, level, next: null, progress: 1, xpToNext: 0 };
  const span = next.minXp - level.minXp;
  const progress = span > 0 ? Math.min(1, Math.max(0, (safeXp - level.minXp) / span)) : 1;
  return { xp: safeXp, level, next, progress, xpToNext: Math.max(0, next.minXp - safeXp) };
}

export function levelByKey(key: LevelKey): XpLevel {
  return LEVELS.find((l) => l.key === key) ?? LEVELS[0];
}

// ---------------------------------------------------------------------------
// Awards for action steps
// ---------------------------------------------------------------------------

export interface XpAward {
  reason: XpReason;
  /** step id, `${step id}:${sub item key}`, module id or goal badge key */
  ref_id: string;
  amount: number;
}

export function subItemRefId(stepId: string, subItemKey: string): string {
  return `${stepId}:${subItemKey}`;
}

/**
 * The XP that is due for an action step given which sub items are done.
 *
 * - A step without sub items: its full `xp` once the step is complete.
 * - A step with sub items: each done sub item's XP (ref `${stepId}:${key}`),
 *   plus the step's remainder (`xp` minus the sub items' XP, ref = step id)
 *   only once every sub item is done.
 *
 * `stepCompleted` lets the caller force the step as complete (ticking the whole
 * step at once marks every sub item done) or explicitly incomplete. When
 * omitted it is derived from the sub items. Deduplication against the ledger is
 * the caller's job (see `hasAward`).
 */
export function xpAwardsForStepCompletion(
  step: Pick<ActionStep, "id" | "xp" | "sub_items">,
  subItemsDone: ReadonlyArray<string>,
  stepCompleted?: boolean,
): XpAward[] {
  const subs = step.sub_items ?? [];
  if (subs.length === 0) {
    if (stepCompleted === false) return [];
    return step.xp > 0 ? [{ reason: "action_step", ref_id: step.id, amount: step.xp }] : [];
  }
  const done = new Set(subItemsDone);
  const allDone = stepCompleted ?? subs.every((s) => done.has(s.key));
  const awards: XpAward[] = [];
  let subTotal = 0;
  for (const sub of subs) {
    subTotal += Math.max(0, sub.xp || 0);
    if ((allDone || done.has(sub.key)) && sub.xp > 0) {
      awards.push({ reason: "sub_item", ref_id: subItemRefId(step.id, sub.key), amount: sub.xp });
    }
  }
  if (allDone) {
    const remainder = step.xp - subTotal;
    if (remainder > 0) awards.push({ reason: "action_step", ref_id: step.id, amount: remainder });
  }
  return awards;
}

// ---------------------------------------------------------------------------
// Module completion + course goals
// ---------------------------------------------------------------------------

/** True when every published lesson of the module is complete (and there is at least one). */
export function shouldAwardModuleCompletion(
  moduleLessons: ReadonlyArray<Pick<Lesson, "id" | "status">>,
  completedLessonIds: Iterable<string>,
): boolean {
  const required = moduleLessons.filter((l) => l.status === "published");
  if (required.length === 0) return false;
  const done = completedLessonIds instanceof Set ? completedLessonIds : new Set(completedLessonIds);
  return required.every((l) => done.has(l.id));
}

export type CourseGoalKey = "minimum" | "target" | "stretch";

export interface CourseGoal {
  key: CourseGoalKey;
  /** badge key in the `badges` table and `ref_id` of the course_goal ledger entry */
  badge_key: `goal:${CourseGoalKey}`;
  title: string;
  /** Verbatim from the Welcome Guide. */
  description: string;
  icon: string;
  xp: number;
  /** Core module codes that must all be complete. */
  requires_modules: string[];
}

export const CORE_MODULE_CODES = ["M1", "M2", "M3", "M4", "M5", "M6", "M7"] as const;

/** The three course goals from the Welcome Guide, in the order they are reached. */
export const COURSE_GOALS: readonly CourseGoal[] = [
  {
    key: "minimum",
    badge_key: "goal:minimum",
    title: "Minimum goal",
    description:
      "Minimum goal (50 XP): identify your personal health barriers (such as cravings) and set your first wellness habits.",
    icon: "sprout",
    xp: 50,
    requires_modules: ["M1"],
  },
  {
    key: "target",
    badge_key: "goal:target",
    title: "Target goal",
    description:
      "Target goal (100 XP): reach a solid pre-conception baseline for you and your partner, including balanced nutrition and lower stress.",
    icon: "target",
    xp: 100,
    requires_modules: ["M1", "M2", "M3", "M4"],
  },
  {
    key: "stretch",
    badge_key: "goal:stretch",
    title: "Stretch goal",
    description:
      "Stretch goal (150 XP): reduce toxins, build strong family bonds, and prepare a multi-generational legacy of health with sustained vitality.",
    icon: "star",
    xp: 150,
    requires_modules: ["M1", "M2", "M3", "M4", "M5", "M6", "M7"],
  },
];

/** Sum of the goal bonuses (300). Added to the course XP this gives the "~4,385 XP" the level thresholds reflect. */
export const COURSE_GOALS_TOTAL_XP = COURSE_GOALS.reduce((n, g) => n + g.xp, 0);

export function courseGoalByKey(key: CourseGoalKey): CourseGoal {
  return COURSE_GOALS.find((g) => g.key === key) ?? COURSE_GOALS[0];
}

/** Goals whose required modules are all in `completedModuleCodes`, in order. */
export function courseGoalsReached(completedModuleCodes: Iterable<string>): CourseGoal[] {
  const done = completedModuleCodes instanceof Set ? completedModuleCodes : new Set(completedModuleCodes);
  return COURSE_GOALS.filter((g) => g.requires_modules.every((code) => done.has(code)));
}

/** Goal awards that are reached but not yet in the ledger. */
export function courseGoalAwards(
  completedModuleCodes: Iterable<string>,
  existingEntries: ReadonlyArray<Pick<XpEntry, "reason" | "ref_id">> = [],
): XpAward[] {
  return courseGoalsReached(completedModuleCodes)
    .filter((g) => !hasAward(existingEntries, "course_goal", g.badge_key))
    .map((g) => ({ reason: "course_goal" as const, ref_id: g.badge_key, amount: g.xp }));
}

// ---------------------------------------------------------------------------
// Ledger helpers
// ---------------------------------------------------------------------------

export function ledgerTotal(entries: ReadonlyArray<Pick<XpEntry, "amount">>): number {
  let total = 0;
  for (const e of entries) total += Number.isFinite(e.amount) ? e.amount : 0;
  return total;
}

/** Dedupe guard: has this (reason, ref_id) already been recorded? */
export function hasAward(entries: ReadonlyArray<Pick<XpEntry, "reason" | "ref_id">>, reason: XpReason, refId: string | null): boolean {
  return entries.some((e) => e.reason === reason && e.ref_id === refId);
}

/** Ledger total restricted to one course (entries with `course_id` null are excluded). */
export function ledgerTotalForCourse(entries: ReadonlyArray<Pick<XpEntry, "amount" | "course_id">>, courseId: string): number {
  return ledgerTotal(entries.filter((e) => e.course_id === courseId));
}
