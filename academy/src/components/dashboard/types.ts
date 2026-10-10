/**
 * View models shared by the dashboard loaders and components. Plain types only
 * (no server imports) so client components can import them freely.
 */
import type { Lesson } from "@/lib/types";

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

export interface PreviewLessonLink {
  courseSlug: string;
  courseTitle: string;
  lesson: Pick<Lesson, "id" | "title" | "code" | "duration_sec">;
  href: string;
}
