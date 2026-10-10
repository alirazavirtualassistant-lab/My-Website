/** Plain view models + action states for the couple space (serialisable). */

export interface CoupleFormState {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: { email?: string; form?: string };
  stamp?: number;
}

export const idleCoupleState: CoupleFormState = { status: "idle" };

export interface PersonProgressView {
  id: string;
  name: string;
  avatarUrl: string | null;
  roleLabel: "Course owner" | "Partner";
  isMe: boolean;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  levelLabel: string;
  streak: number;
}

export interface PartnerExerciseRow {
  lessonId: string;
  code: string;
  moduleCode: string;
  title: string;
  href: string;
  /** Unlocked for the viewer (drip). */
  unlocked: boolean;
  unlocksAt: string | null;
  me: boolean;
  partner: boolean | null; // null when there is no partner yet
  /** Verbatim action-step labels from the course sheet. */
  prompts: string[];
}
