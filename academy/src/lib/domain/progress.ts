/**
 * Course progress — pure functions over the course tree and lesson_progress rows.
 *
 * Only published lessons count (a `scheduled` lesson counts once its
 * `publish_at` has passed, when `now` is supplied). Drafts are invisible to
 * learners and are never required.
 */
import type { CourseTree, Enrollment, Lesson, LessonProgress } from "@/lib/types";
import { isUnlocked, lessonDripDays, type DripEnrollment } from "./drip";

export type TreeModule = CourseTree["modules"][number];
export type TreeLesson = TreeModule["lessons"][number];

export type ProgressRow = Pick<LessonProgress, "lesson_id" | "completed_at">;

export function isLessonPublished(lesson: Pick<Lesson, "status" | "publish_at">, now?: Date): boolean {
  if (lesson.status === "published") return true;
  if (lesson.status === "scheduled" && now && lesson.publish_at) return Date.parse(lesson.publish_at) <= now.getTime();
  return false;
}

/** Ids of lessons with a `completed_at` timestamp. */
export function completedLessonIds(rows: ReadonlyArray<ProgressRow>): Set<string> {
  const done = new Set<string>();
  for (const row of rows) if (row.completed_at) done.add(row.lesson_id);
  return done;
}

export function isLessonComplete(rows: ReadonlyArray<ProgressRow>, lessonId: string): boolean {
  return rows.some((r) => r.lesson_id === lessonId && !!r.completed_at);
}

export interface ModuleProgress {
  completed: number;
  total: number;
  /** 0–100, rounded */
  percent: number;
}

export interface CourseProgressSummary {
  /** 0–100, rounded, over all published lessons */
  percent: number;
  completedLessons: number;
  totalLessons: number;
  /** lessons in modules with `required_for_certificate` */
  requiredCompleted: number;
  requiredTotal: number;
  /** keyed by module id */
  byModule: Record<string, ModuleProgress>;
}

function percentOf(completed: number, total: number): number {
  return total > 0 ? Math.round((100 * completed) / total) : 0;
}

export function courseProgress(tree: Pick<CourseTree, "modules">, rows: ReadonlyArray<ProgressRow>, now?: Date): CourseProgressSummary {
  const done = completedLessonIds(rows);
  const byModule: Record<string, ModuleProgress> = {};
  let completedLessons = 0;
  let totalLessons = 0;
  let requiredCompleted = 0;
  let requiredTotal = 0;
  for (const mod of tree.modules) {
    const lessons = mod.lessons.filter((l) => isLessonPublished(l, now));
    const completed = lessons.filter((l) => done.has(l.id)).length;
    byModule[mod.id] = { completed, total: lessons.length, percent: percentOf(completed, lessons.length) };
    completedLessons += completed;
    totalLessons += lessons.length;
    if (mod.required_for_certificate) {
      requiredCompleted += completed;
      requiredTotal += lessons.length;
    }
  }
  return { percent: percentOf(completedLessons, totalLessons), completedLessons, totalLessons, requiredCompleted, requiredTotal, byModule };
}

/** Every published lesson in the module is complete (modules with no published lessons are never complete). */
export function moduleIsComplete(
  module: { lessons: ReadonlyArray<Pick<Lesson, "id" | "status" | "publish_at">> },
  rows: ReadonlyArray<ProgressRow>,
  now?: Date,
): boolean {
  const lessons = module.lessons.filter((l) => isLessonPublished(l, now));
  if (lessons.length === 0) return false;
  const done = completedLessonIds(rows);
  return lessons.every((l) => done.has(l.id));
}

/** Codes of modules that are complete, for the course-goal checks. */
export function completedModuleCodes(tree: Pick<CourseTree, "modules">, rows: ReadonlyArray<ProgressRow>, now?: Date): string[] {
  return tree.modules.filter((m) => moduleIsComplete(m, rows, now)).map((m) => m.code);
}

export interface OrderedLesson {
  module: TreeModule;
  lesson: TreeLesson;
  /** 0-based position in the flat order */
  index: number;
}

export interface LessonOrderOptions {
  /** Include draft/unreleased lessons (admin views). Default false. */
  includeUnpublished?: boolean;
  /** Lets scheduled lessons count as published once `publish_at` has passed. */
  now?: Date;
}

/** Flat lesson order: modules by `position`, then lessons by `position` (stable on ties). */
export function lessonOrder(tree: Pick<CourseTree, "modules">, opts: LessonOrderOptions = {}): OrderedLesson[] {
  const modules = [...tree.modules].sort((a, b) => a.position - b.position);
  const out: OrderedLesson[] = [];
  for (const mod of modules) {
    const lessons = [...mod.lessons].sort((a, b) => a.position - b.position);
    for (const lesson of lessons) {
      if (!opts.includeUnpublished && !isLessonPublished(lesson, opts.now)) continue;
      out.push({ module: mod, lesson, index: out.length });
    }
  }
  return out;
}

export interface AdjacentLessons {
  current: OrderedLesson | null;
  prev: OrderedLesson | null;
  next: OrderedLesson | null;
}

/** The lesson before and after `lessonId` in the flat order. */
export function adjacentLessons(treeOrOrder: Pick<CourseTree, "modules"> | ReadonlyArray<OrderedLesson>, lessonId: string): AdjacentLessons {
  const order = Array.isArray(treeOrOrder) ? (treeOrOrder as ReadonlyArray<OrderedLesson>) : lessonOrder(treeOrOrder as Pick<CourseTree, "modules">);
  const index = order.findIndex((o) => o.lesson.id === lessonId);
  if (index < 0) return { current: null, prev: null, next: null };
  return { current: order[index], prev: order[index - 1] ?? null, next: order[index + 1] ?? null };
}

export function prevLesson(treeOrOrder: Pick<CourseTree, "modules"> | ReadonlyArray<OrderedLesson>, lessonId: string): OrderedLesson | null {
  return adjacentLessons(treeOrOrder, lessonId).prev;
}

export function nextLessonAfter(treeOrOrder: Pick<CourseTree, "modules"> | ReadonlyArray<OrderedLesson>, lessonId: string): OrderedLesson | null {
  return adjacentLessons(treeOrOrder, lessonId).next;
}

export function findLesson(tree: Pick<CourseTree, "modules">, lessonId: string): { module: TreeModule; lesson: TreeLesson } | null {
  for (const mod of tree.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: mod, lesson };
  }
  return null;
}

/**
 * Where the learner should go next: the first unlocked, incomplete, published
 * lesson in order. When every unlocked lesson is done it falls back to the
 * first incomplete (still locked) lesson so the UI can say when it opens, and
 * finally to the first lesson of the course. Null only for an empty course.
 */
export function nextLesson(
  tree: Pick<CourseTree, "modules">,
  rows: ReadonlyArray<ProgressRow>,
  enrollment: DripEnrollment | Enrollment,
  now: Date,
): { module: TreeModule; lesson: TreeLesson } | null {
  const order = lessonOrder(tree, { now });
  if (order.length === 0) return null;
  const done = completedLessonIds(rows);
  let firstIncomplete: OrderedLesson | null = null;
  for (const entry of order) {
    if (done.has(entry.lesson.id)) continue;
    firstIncomplete ??= entry;
    if (isUnlocked(enrollment, lessonDripDays(entry.lesson, entry.module), now)) return { module: entry.module, lesson: entry.lesson };
  }
  const fallback = firstIncomplete ?? order[0];
  return { module: fallback.module, lesson: fallback.lesson };
}
