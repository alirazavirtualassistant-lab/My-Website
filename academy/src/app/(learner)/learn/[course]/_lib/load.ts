import "server-only";
import { notFound } from "next/navigation";
import { requireUser, type Session } from "@/lib/auth/session";
import { getCourseBySlug, lessonSlug } from "@/lib/usecases/catalog";
import { getLearnerCourseState, type LearnerCourseState } from "@/lib/usecases/progress";
import { ledgerTotalForCourse } from "@/lib/domain/xp";
import { unlockDate } from "@/lib/domain/drip";
import type { Course } from "@/lib/types";
import type { CurriculumData, SidebarModule } from "@/components/player/types";

export interface LoadedCourse {
  session: Session;
  course: Course;
  state: LearnerCourseState;
  /** XP the learner has earned inside this course (ledger entries for the course). */
  courseXpEarned: number;
}

/** Session + course + learner state for `/learn/[course]/**`. 404s for unknown or archived courses. */
export async function loadCourse(slug: string, nextPath: string): Promise<LoadedCourse> {
  const session = await requireUser(nextPath);
  const course = await getCourseBySlug(slug);
  if (!course || course.status === "archived" || course.status === "draft") notFound();
  const state = await getLearnerCourseState(session.user_id, course.id, session.role);
  if (!state) notFound();
  return { session, course, state, courseXpEarned: ledgerTotalForCourse(state.xpEntries, course.id) };
}

export function courseHref(slug: string): string {
  return `/learn/${slug}`;
}

export function lessonHref(slug: string, lesson: { code: string }): string {
  return `/learn/${slug}/${lessonSlug(lesson)}`;
}

export function previewHref(slug: string, lesson: { code: string }): string {
  return `/courses/${slug}/preview/${lessonSlug(lesson)}`;
}

/** Module unlock info derived from the enrolment (admins: always open). */
export function moduleUnlock(state: LearnerCourseState, module: { drip_days: number; lessons: Array<{ id: string }> }): { unlocked: boolean; unlocksAt: string | null } {
  if (state.access.via === "admin") return { unlocked: true, unlocksAt: null };
  const enrollment = state.enrollment;
  if (!enrollment) {
    // No enrolment: only preview lessons are open (module itself is locked).
    return { unlocked: false, unlocksAt: null };
  }
  const anyLessonUnlocked = module.lessons.some((l) => state.lessons[l.id]?.unlocked);
  const at = unlockDate(enrollment, module.drip_days);
  const unlocked = anyLessonUnlocked || at.getTime() <= Date.now();
  return { unlocked, unlocksAt: unlocked ? null : at.toISOString() };
}

/** Serialisable curriculum for the sidebar/drawer. */
export function buildCurriculum(course: Course, state: LearnerCourseState): CurriculumData {
  const modules: SidebarModule[] = state.tree.modules
    .filter((m) => m.lessons.length > 0)
    .map((m) => {
      const unlock = moduleUnlock(state, m);
      return {
        id: m.id,
        code: m.code,
        kind: m.kind,
        title: m.title,
        unlocked: unlock.unlocked,
        unlocksAt: unlock.unlocksAt,
        lessons: m.lessons.map((l) => {
          const ls = state.lessons[l.id];
          const open = ls?.unlocked ?? false;
          return {
            id: l.id,
            code: l.code,
            title: l.title,
            href: open || state.access.allowed ? lessonHref(course.slug, l) : l.is_preview ? previewHref(course.slug, l) : lessonHref(course.slug, l),
            durationSec: l.duration_sec,
            unlocked: open,
            unlocksAt: ls?.unlocksAt ?? null,
            isPreview: l.is_preview,
            isIntro: l.is_intro,
          };
        }),
      };
    });
  return {
    courseSlug: course.slug,
    courseTitle: course.title,
    courseHref: courseHref(course.slug),
    modules,
    totalLessons: state.summary.totalLessons,
  };
}

export function completedLessonIds(state: LearnerCourseState): string[] {
  return state.progress.filter((p) => p.completed_at).map((p) => p.lesson_id);
}
