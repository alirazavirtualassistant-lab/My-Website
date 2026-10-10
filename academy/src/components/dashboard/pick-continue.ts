/**
 * "Continue where you left off" — a pure helper that picks the course and
 * lesson the dashboard hero should point at. No I/O, no React, so it is safe
 * to unit test and to import from anywhere.
 *
 * Rule: the most recently active course wins (latest `lesson_progress.updated_at`,
 * falling back to the enrolment's `started_at`), then that course's `next`
 * lesson (already computed by `getLearnerCourseState`). A `LearnerCourseState`
 * is structurally assignable to `ContinueSource`, so pages pass states straight in.
 */

export interface ContinueSourceLesson {
  id: string;
  code: string;
  title: string;
  duration_sec: number;
}

export interface ContinueSource {
  tree: {
    course: { slug: string; title: string };
    modules: ReadonlyArray<{ id: string; code: string; title: string }>;
  };
  enrollment: { started_at: string; updated_at?: string } | null;
  progress: ReadonlyArray<{ updated_at: string; completed_at: string | null }>;
  summary: { percent: number; completedLessons: number; totalLessons: number };
  next: { moduleId: string; lesson: ContinueSourceLesson } | null;
  lessons: Record<string, { unlocked: boolean; unlocksAt: string | null; lastPositionSec: number; completed: boolean }>;
}

export interface ContinuePick {
  courseSlug: string;
  courseTitle: string;
  moduleCode: string;
  moduleTitle: string;
  lesson: ContinueSourceLesson;
  /** Lesson URL when unlocked, otherwise the course home. */
  href: string;
  unlocked: boolean;
  unlocksAt: string | null;
  /** Seconds into the lesson video to resume from (0 = from the start). */
  resumeSec: number;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  /** ISO timestamp of the latest activity, or null for a brand-new enrolment. */
  lastActiveAt: string | null;
  /** True when the learner has not opened anything in this course yet. */
  isFresh: boolean;
}

/** Mirrors `lessonSlug()` in `@/lib/usecases/catalog` (kept local so this file stays I/O-free). */
export function lessonSegment(lesson: Pick<ContinueSourceLesson, "code">): string {
  return lesson.code.toLowerCase().replace(/_/g, "-");
}

function safeTime(iso: string | null | undefined): number {
  if (!iso) return Number.NEGATIVE_INFINITY;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : Number.NEGATIVE_INFINITY;
}

/** Latest `updated_at` across the course's progress rows, or null when there is none. */
export function lastActivityAt(source: Pick<ContinueSource, "progress">): string | null {
  let best: string | null = null;
  let bestTime = Number.NEGATIVE_INFINITY;
  for (const row of source.progress) {
    const t = safeTime(row.updated_at);
    if (t > bestTime) {
      bestTime = t;
      best = row.updated_at;
    }
  }
  return best;
}

/** Builds the hero payload for one course, or null when the course has no next lesson. */
export function continueFor(source: ContinueSource): ContinuePick | null {
  if (!source.next) return null;
  const { lesson, moduleId } = source.next;
  const mod = source.tree.modules.find((m) => m.id === moduleId);
  const state = source.lessons[lesson.id];
  const unlocked = state?.unlocked ?? true;
  const slug = source.tree.course.slug;
  const lastActiveAt = lastActivityAt(source);
  return {
    courseSlug: slug,
    courseTitle: source.tree.course.title,
    moduleCode: mod?.code ?? "",
    moduleTitle: mod?.title ?? "",
    lesson,
    href: unlocked ? `/learn/${slug}/${lessonSegment(lesson)}` : `/learn/${slug}`,
    unlocked,
    unlocksAt: state?.unlocksAt ?? null,
    resumeSec: Math.max(0, Math.floor(state?.lastPositionSec ?? 0)),
    percent: source.summary.percent,
    completedLessons: source.summary.completedLessons,
    totalLessons: source.summary.totalLessons,
    lastActiveAt,
    isFresh: lastActiveAt === null,
  };
}

/**
 * The course to resume: most recent activity first, then enrolment start,
 * then list order. Courses without a next lesson (empty courses) are skipped.
 */
export function pickContinue(sources: ReadonlyArray<ContinueSource>): ContinuePick | null {
  let best: { pick: ContinuePick; score: number; index: number } | null = null;
  sources.forEach((source, index) => {
    const pick = continueFor(source);
    if (!pick) return;
    const activity = safeTime(pick.lastActiveAt);
    const started = safeTime(source.enrollment?.started_at);
    const score = Number.isFinite(activity) ? activity : Number.isFinite(started) ? started : Number.NEGATIVE_INFINITY;
    if (!best || score > best.score) best = { pick, score, index };
  });
  return best ? (best as { pick: ContinuePick }).pick : null;
}
