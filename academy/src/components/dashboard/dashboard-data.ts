import "server-only";
/**
 * Server-only loaders for the My Learning dashboard and the learner shell
 * aside. Everything that is per-course goes through `getLearnerCourseState`;
 * the per-user overview (XP ledger, streak, badges) is read here because no
 * use case exposes it without a course yet — see the report for the
 * `getLearnerOverview()` request in `src/lib/usecases/progress.ts`.
 */
import { getServices } from "@/services";
import type { Badge, Certificate, Course, Enrollment, Lesson, Role } from "@/lib/types";
import { todayKey } from "@/lib/utils";
import { COURSE_GOALS, ledgerTotal, levelForXp, type LevelProgress } from "@/lib/domain/xp";
import { effectiveStreak, isStreakAlive } from "@/lib/domain/streaks";
import { upcomingUnlocks, humanizeUnlock } from "@/lib/domain/drip";
import { BADGE_DEFINITIONS } from "@/lib/usecases/demo";
import { listLearnerCourses } from "@/lib/usecases/access";
import { getCourseTree, listPublishedCourses, lessonSlug } from "@/lib/usecases/catalog";
import { getLearnerCourseState, type LearnerCourseState } from "@/lib/usecases/progress";
import { listCertificatesForUser } from "@/lib/usecases/certificates";
import { pickContinue, type ContinuePick } from "./pick-continue";

export type BadgeGroup = "goal" | "module" | "streak";

export interface BadgeItem {
  key: string;
  title: string;
  /** Verbatim badge description (course goals come from the Welcome Guide). */
  description: string;
  icon: string;
  group: BadgeGroup;
  earned: boolean;
  awardedAt: string | null;
  courseId: string | null;
}

export interface StreakView {
  /** Days in a row as of today (0 when the streak lapsed). */
  current: number;
  longest: number;
  /** Last activity was today or yesterday. */
  alive: boolean;
  /** The learner has already shown up today. */
  activeToday: boolean;
}

export interface LearnerOverview {
  xpTotal: number;
  level: LevelProgress;
  streak: StreakView;
  badges: BadgeItem[];
  earnedBadgeCount: number;
}

export function badgeGroupFor(key: string): BadgeGroup {
  if (key.startsWith("goal:")) return "goal";
  if (key.startsWith("streak:")) return "streak";
  return "module";
}

const GROUP_ORDER: Record<BadgeGroup, number> = { goal: 0, module: 1, streak: 2 };

/** Merges the badge catalogue with what the learner has earned, course goals first. */
export function buildBadgeItems(
  definitions: ReadonlyArray<Pick<Badge, "key" | "title" | "description" | "icon">>,
  earned: ReadonlyArray<{ key: string; awarded_at: string; course_id: string | null }>,
): BadgeItem[] {
  const earnedByKey = new Map(earned.map((e) => [e.key, e]));
  const goalIndex = new Map(COURSE_GOALS.map((g, i) => [g.badge_key, i]));
  return definitions
    .map((def) => {
      const hit = earnedByKey.get(def.key);
      return {
        key: def.key,
        title: def.title,
        description: def.description,
        icon: def.icon,
        group: badgeGroupFor(def.key),
        earned: !!hit,
        awardedAt: hit?.awarded_at ?? null,
        courseId: hit?.course_id ?? null,
      };
    })
    .sort((a, b) => {
      const g = GROUP_ORDER[a.group] - GROUP_ORDER[b.group];
      if (g !== 0) return g;
      if (a.group === "goal") return (goalIndex.get(a.key) ?? 99) - (goalIndex.get(b.key) ?? 99);
      return a.key.localeCompare(b.key, undefined, { numeric: true });
    });
}

/** XP, level, streak and badges for one learner — independent of any course. */
export async function loadLearnerOverview(userId: string, timeZone?: string | null): Promise<LearnerOverview> {
  const { db } = await getServices();
  const [entries, streak, userBadges, badgeRows] = await Promise.all([
    db.from("xp_ledger").list({ where: { user_id: userId } }),
    db.from("streaks").findOne({ user_id: userId }),
    db.from("user_badges").list({ where: { user_id: userId } }),
    db.from("badges").list(),
  ]);
  const xpTotal = ledgerTotal(entries);
  const today = todayKey(new Date(), timeZone ?? undefined);
  const byId = new Map(badgeRows.map((b) => [b.id, b]));
  const earned = userBadges.flatMap((ub) => {
    const badge = byId.get(ub.badge_id);
    return badge ? [{ key: badge.key, awarded_at: ub.awarded_at, course_id: ub.course_id }] : [];
  });
  const definitions = badgeRows.length ? badgeRows : BADGE_DEFINITIONS;
  const badges = buildBadgeItems(definitions, earned);
  return {
    xpTotal,
    level: levelForXp(xpTotal),
    streak: {
      current: effectiveStreak(streak, today),
      longest: Math.max(streak?.longest ?? 0, streak?.current ?? 0),
      alive: isStreakAlive(streak, today),
      activeToday: streak?.last_active_date === today,
    },
    badges,
    earnedBadgeCount: badges.filter((b) => b.earned).length,
  };
}

export interface UnlockItem {
  courseSlug: string;
  courseTitle: string;
  moduleCode: string;
  moduleTitle: string;
  lessonCount: number;
  unlocksAt: string;
  /** "opens tomorrow", "opens in 4 days" … */
  phrase: string;
}

export interface EnrolledCourseView {
  course: Course;
  enrollment: Enrollment;
  state: LearnerCourseState;
  /** XP earned in this course (ledger entries tagged with the course). */
  courseXpEarned: number;
  /** Soonest locked module for this enrolment, or null when everything is open. */
  nextUnlock: UnlockItem | null;
  certificate: Certificate | null;
}

export interface PreviewLessonLink {
  courseSlug: string;
  courseTitle: string;
  lesson: Pick<Lesson, "id" | "title" | "code" | "duration_sec">;
  href: string;
}

export interface DashboardData {
  overview: LearnerOverview;
  courses: EnrolledCourseView[];
  continuePick: ContinuePick | null;
  unlocks: UnlockItem[];
  certificates: Certificate[];
  /** Published courses the learner is not enrolled in (most recent first). */
  recommended: Course[];
  /** Free preview lessons for the empty state. */
  previews: PreviewLessonLink[];
}

function unlockItemsFor(view: { course: Course; enrollment: Enrollment; state: LearnerCourseState }, now: Date, timeZone?: string | null): UnlockItem[] {
  return upcomingUnlocks(view.enrollment, view.state.tree.modules, now, timeZone ?? undefined)
    .filter((u) => u.module.lessons.length > 0)
    .map((u) => ({
      courseSlug: view.course.slug,
      courseTitle: view.course.title,
      moduleCode: u.module.code,
      moduleTitle: u.module.title,
      lessonCount: u.module.lessons.length,
      unlocksAt: u.unlocksAt.toISOString(),
      phrase: humanizeUnlock(u.unlocksAt, now, timeZone ?? undefined),
    }));
}

/** Everything the /learn page renders, in one call. */
export async function loadDashboard(userId: string, role: Role, timeZone?: string | null): Promise<DashboardData> {
  const now = new Date();
  const [overview, enrolled, certificates, published] = await Promise.all([
    loadLearnerOverview(userId, timeZone),
    listLearnerCourses(userId),
    listCertificatesForUser(userId),
    listPublishedCourses(),
  ]);
  const certByCourse = new Map(certificates.map((c) => [c.course_id, c]));
  const states = await Promise.all(enrolled.map(({ course }) => getLearnerCourseState(userId, course.id, role)));
  const courses: EnrolledCourseView[] = [];
  enrolled.forEach(({ course, enrollment }, i) => {
    const state = states[i];
    if (!state) return;
    const effectiveEnrollment = state.enrollment ?? enrollment;
    const view = { course, enrollment: effectiveEnrollment, state };
    const unlocks = unlockItemsFor(view, now, timeZone);
    courses.push({
      ...view,
      courseXpEarned: ledgerTotal(state.xpEntries.filter((e) => e.course_id === course.id)),
      nextUnlock: unlocks[0] ?? null,
      certificate: certByCourse.get(course.id) ?? null,
    });
  });
  const unlocks = courses
    .flatMap((view) => unlockItemsFor(view, now, timeZone))
    .sort((a, b) => Date.parse(a.unlocksAt) - Date.parse(b.unlocksAt));
  const enrolledIds = new Set(courses.map((c) => c.course.id));
  const recommended = published.filter((c) => !enrolledIds.has(c.id));

  let previews: PreviewLessonLink[] = [];
  if (courses.length === 0) {
    const trees = await Promise.all(published.map((c) => getCourseTree(c.id)));
    previews = trees.flatMap((tree) => {
      if (!tree) return [];
      return tree.modules.flatMap((m) =>
        m.lessons
          .filter((l) => l.is_preview)
          .map((l) => ({
            courseSlug: tree.course.slug,
            courseTitle: tree.course.title,
            lesson: { id: l.id, title: l.title, code: l.code, duration_sec: l.duration_sec },
            href: `/courses/${tree.course.slug}/preview/${lessonSlug(l)}`,
          })),
      );
    });
  }

  return {
    overview,
    courses,
    continuePick: pickContinue(courses.map((c) => c.state)),
    unlocks,
    certificates,
    recommended,
    previews,
  };
}
