/**
 * Serialisable view models passed from the lesson/course Server Components to
 * the player's Client Components, plus the result shapes of the Server Actions
 * in src/app/(learner)/learn/[course]/[lesson]/actions.ts. Plain data only.
 */
import type { ActionLink, ActionStepKind, QuizQuestion } from "@/lib/types";
import type { Playback } from "@/services/types";

export type { Playback };

export interface SidebarLesson {
  id: string;
  code: string;
  title: string;
  href: string;
  durationSec: number;
  unlocked: boolean;
  /** ISO date when still locked. */
  unlocksAt: string | null;
  isPreview: boolean;
  isIntro: boolean;
}

export interface SidebarModule {
  id: string;
  code: string;
  kind: "home" | "core" | "bonus" | "replay";
  title: string;
  unlocked: boolean;
  unlocksAt: string | null;
  lessons: SidebarLesson[];
}

export interface CurriculumData {
  courseSlug: string;
  courseTitle: string;
  courseHref: string;
  modules: SidebarModule[];
  totalLessons: number;
}

export interface ResourceView {
  id: string;
  label: string;
  fileName: string;
  type: "pdf" | "xlsx" | "mp3" | "docx" | "image" | "other";
  sizeBytes: number;
  /** Signed URL valid for ~10 minutes from render. */
  url: string;
  /** "lesson" | "module" grouping label. */
  scope: "lesson" | "module";
}

export interface ActionStepView {
  id: string;
  label: string;
  kind: ActionStepKind;
  xp: number;
  requiresUpload: boolean;
  uploadType: "photo" | "pdf" | "journal" | "any" | null;
  link: ActionLink;
  subItems: Array<{ key: string; label: string; xp: number }> | null;
  /** Current completion state for this learner. */
  completed: boolean;
  subItemsDone: string[];
  uploadPath: string | null;
  uploadFileName: string | null;
  /** Signed URL of the upload, when present. */
  uploadUrl: string | null;
  /** Where "Take the quiz" / "Open the forum thread" / "Review your survey" go. */
  quizHref: string | null;
  quizTitle: string | null;
  forumHref: string | null;
}

export interface NoteView {
  id: string;
  body: string;
  positionSec: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionPostView {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  isInstructor: boolean;
  replyCount: number;
  likeCount: number;
  createdAt: string;
  href: string;
}

export interface CompletionResult {
  ok: boolean;
  error?: string;
  xpAwarded: number;
  newBadges: Array<{ key: string; title: string }>;
  moduleCompleted: string | null;
  certificateId: string | null;
  nextHref: string | null;
  /** For action steps: the step's completion state after the call. */
  stepCompleted?: boolean;
  subItemsDone?: string[];
  uploadFileName?: string | null;
  uploadUrl?: string | null;
}

export interface NoteResult {
  ok: boolean;
  error?: string;
  note?: NoteView;
}

export interface QuizQuestionView {
  question: QuizQuestion;
}

export interface QuizResultView {
  ok: boolean;
  error?: string;
  missing?: string[];
  score: number | null;
  maxScore: number | null;
  band: { label: string; text: string } | null;
  sections: Array<{ key: string; label: string; score: number; band: { label: string; text: string } | null }>;
  confirmation: string;
  submittedAt: string;
}

export interface SimpleResult {
  ok: boolean;
  error?: string;
}

export interface TestimonialFormState {
  status: "idle" | "error" | "success";
  errors?: Record<string, string>;
  message?: string;
  outcome?: CompletionResult;
}
