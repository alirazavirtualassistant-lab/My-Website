"use server";

/**
 * Server Actions for the course player. Every action re-checks the session and
 * delegates access/drip enforcement to the use cases in src/lib/usecases.
 */
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession, requireUser } from "@/lib/auth/session";
import { getServices } from "@/services";
import { getLearnerAccess } from "@/lib/usecases/access";
import { getCourseById, lessonSlug } from "@/lib/usecases/catalog";
import { deleteNote, saveNote } from "@/lib/usecases/notes";
import { completeActionStep, getQuizResponses, markLessonComplete, submitQuizResponse, uncompleteActionStep, updateLessonPosition, type CompletionOutcome } from "@/lib/usecases/progress";
import { signedUrlFor, storeLearnerUpload } from "@/lib/usecases/uploads";
import { acceptDisclaimer } from "@/lib/usecases/users";
import { isUnlocked, lessonDripDays } from "@/lib/domain/drip";
import { bandFor, scoreQuiz } from "@/lib/domain/quizzes";
import { newId, nowIso } from "@/lib/utils";
import type { Lesson, Note, QuizDefinition } from "@/lib/types";
import type { CompletionResult, NoteResult, NoteView, QuizResultView, SimpleResult, TestimonialFormState } from "@/components/player/types";

const id = z.string().min(1).max(80);

function message(err: unknown, fallback: string): string {
  const m = err instanceof Error ? err.message : "";
  return m || fallback;
}

function fail(error: string): CompletionResult {
  return { ok: false, error, xpAwarded: 0, newBadges: [], moduleCompleted: null, certificateId: null, nextHref: null };
}

async function lessonHref(lesson: Lesson): Promise<string | null> {
  const course = await getCourseById(lesson.course_id);
  return course ? `/learn/${course.slug}/${lessonSlug(lesson)}` : null;
}

async function toResult(outcome: CompletionOutcome): Promise<CompletionResult> {
  return {
    ok: true,
    xpAwarded: outcome.xpAwarded,
    newBadges: outcome.newBadges.map((b) => ({ key: b.key, title: b.title })),
    moduleCompleted: outcome.moduleCompleted,
    certificateId: outcome.certificateId,
    nextHref: outcome.nextLesson ? await lessonHref(outcome.nextLesson.lesson) : null,
  };
}

function toNoteView(n: Note): NoteView {
  return { id: n.id, body: n.body, positionSec: n.position_sec, createdAt: n.created_at, updatedAt: n.updated_at };
}

function revalidateLearn() {
  revalidatePath("/learn", "layout");
}

// ---------------------------------------------------------------------------
// Playback position
// ---------------------------------------------------------------------------

const positionSchema = z.object({
  lessonId: id,
  positionSec: z.number().min(0).max(60 * 60 * 24),
  watchedDeltaSec: z.number().min(0).max(120).default(0),
});

/** Called every ~10s while playing and on pause. Silent: never throws to the client. */
export async function updateLessonPositionAction(input: z.input<typeof positionSchema>): Promise<SimpleResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Signed out" };
  const parsed = positionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  try {
    await updateLessonPosition(session.user_id, parsed.data.lessonId, parsed.data.positionSec, parsed.data.watchedDeltaSec, session.role);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err, "Could not save position") };
  }
}

// ---------------------------------------------------------------------------
// Lesson completion
// ---------------------------------------------------------------------------

export async function markLessonCompleteAction(input: { lessonId: string }): Promise<CompletionResult> {
  const session = await requireUser();
  const parsed = z.object({ lessonId: id }).safeParse(input);
  if (!parsed.success) return fail("Bad input");
  try {
    const outcome = await markLessonComplete(session.user_id, parsed.data.lessonId, session.role);
    revalidateLearn();
    return await toResult(outcome);
  } catch (err) {
    return fail(message(err, "We couldn't mark this lesson complete just now."));
  }
}

// ---------------------------------------------------------------------------
// Action steps
// ---------------------------------------------------------------------------

export async function completeActionStepAction(input: { stepId: string; subItemKey?: string | null }): Promise<CompletionResult> {
  const session = await requireUser();
  const parsed = z.object({ stepId: id, subItemKey: z.string().max(80).nullish() }).safeParse(input);
  if (!parsed.success) return fail("Bad input");
  try {
    const outcome = await completeActionStep(session.user_id, parsed.data.stepId, { subItemKey: parsed.data.subItemKey ?? undefined, role: session.role });
    revalidateLearn();
    return { ...(await toResult(outcome)), stepCompleted: outcome.stepCompleted, subItemsDone: outcome.subItemsDone };
  } catch (err) {
    return fail(message(err, "We couldn't save that step just now."));
  }
}

export async function uncompleteActionStepAction(input: { stepId: string }): Promise<SimpleResult> {
  const session = await requireUser();
  const parsed = z.object({ stepId: id }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  try {
    await uncompleteActionStep(session.user_id, parsed.data.stepId);
    revalidateLearn();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't update that step just now.") };
  }
}

/** FormData: stepId + file. Stores the upload, then completes the step with its path. */
export async function uploadActionStepAction(formData: FormData): Promise<CompletionResult> {
  const session = await requireUser();
  const stepId = id.safeParse(formData.get("stepId"));
  const file = formData.get("file");
  if (!stepId.success) return fail("Bad input");
  if (!(file instanceof File) || file.size === 0) return fail("Please choose a file to upload.");
  const { db } = await getServices();
  const step = await db.from("action_steps").get(stepId.data);
  if (!step) return fail("That step no longer exists.");
  try {
    const stored = await storeLearnerUpload(session.user_id, `steps/${step.id}`, file, step.upload_type ?? "any");
    const outcome = await completeActionStep(session.user_id, step.id, { uploadPath: stored.path, role: session.role });
    revalidateLearn();
    const url = await signedUrlFor("learner-uploads", stored.path);
    return { ...(await toResult(outcome)), stepCompleted: outcome.stepCompleted, subItemsDone: outcome.subItemsDone, uploadFileName: file.name, uploadUrl: url };
  } catch (err) {
    return fail(message(err, "We couldn't save that file just now."));
  }
}

// ---------------------------------------------------------------------------
// Testimonials (status: pending — Cynthia approves them in the admin)
// ---------------------------------------------------------------------------

const testimonialSchema = z.object({
  stepId: id.optional(),
  courseId: id,
  authorName: z.string().trim().min(2, "Please add the name you'd like shown.").max(80),
  authorRole: z.string().trim().max(80).optional(),
  body: z.string().trim().min(20, "A few sentences would be lovely (at least 20 characters).").max(2000, "Please keep it under 2,000 characters."),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export async function submitTestimonialAction(_prev: TestimonialFormState, formData: FormData): Promise<TestimonialFormState> {
  const session = await requireUser();
  const raw = {
    stepId: formData.get("stepId") || undefined,
    courseId: formData.get("courseId"),
    authorName: formData.get("authorName"),
    authorRole: formData.get("authorRole") || undefined,
    body: formData.get("body"),
    rating: formData.get("rating") || undefined,
  };
  const parsed = testimonialSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0] ?? "form")] = issue.message;
    return { status: "error", errors };
  }
  const { db } = await getServices();
  const access = await getLearnerAccess(session.user_id, parsed.data.courseId, session.role);
  if (!access.allowed) return { status: "error", errors: { form: "You need to be enrolled to share a testimonial." } };
  try {
    await db.from("testimonials").insert({
      id: newId(),
      user_id: session.user_id,
      course_id: parsed.data.courseId,
      author_name: parsed.data.authorName,
      author_role: parsed.data.authorRole || null,
      body: parsed.data.body,
      rating: parsed.data.rating ?? null,
      status: "pending",
      featured: false,
      created_at: nowIso(),
      reviewed_at: null,
    });
    let outcome: CompletionResult | undefined;
    if (parsed.data.stepId) {
      const o = await completeActionStep(session.user_id, parsed.data.stepId, { role: session.role });
      outcome = { ...(await toResult(o)), stepCompleted: o.stepCompleted, subItemsDone: o.subItemsDone };
    }
    revalidateLearn();
    return { status: "success", message: "Thank you. Your words are with Cynthia for review.", outcome };
  } catch (err) {
    return { status: "error", errors: { form: message(err, "We couldn't send that just now. Please try again.") } };
  }
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

const noteSchema = z.object({
  lessonId: id,
  courseId: id,
  noteId: id.nullish(),
  body: z.string().max(20_000),
  positionSec: z.number().min(0).nullable(),
});

async function canUseLesson(userId: string, role: string, lessonId: string, courseId: string): Promise<boolean> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson || lesson.course_id !== courseId) return false;
  const access = await getLearnerAccess(userId, courseId, role);
  return access.allowed || lesson.is_preview;
}

export async function saveNoteAction(input: z.input<typeof noteSchema>): Promise<NoteResult> {
  const session = await requireUser();
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  if (!(await canUseLesson(session.user_id, session.role, parsed.data.lessonId, parsed.data.courseId))) return { ok: false, error: "You can't add notes to this lesson." };
  try {
    const note = await saveNote({ userId: session.user_id, lessonId: parsed.data.lessonId, courseId: parsed.data.courseId, noteId: parsed.data.noteId ?? null, body: parsed.data.body, positionSec: parsed.data.positionSec });
    return { ok: true, note: toNoteView(note) };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't save that note just now.") };
  }
}

export async function deleteNoteAction(input: { noteId: string }): Promise<SimpleResult> {
  const session = await requireUser();
  const parsed = z.object({ noteId: id }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  try {
    await deleteNote(session.user_id, parsed.data.noteId);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't delete that note just now.") };
  }
}

// ---------------------------------------------------------------------------
// Disclaimer gate
// ---------------------------------------------------------------------------

export async function acceptDisclaimerAction(): Promise<SimpleResult> {
  const session = await requireUser();
  try {
    await acceptDisclaimer(session.user_id);
    revalidateLearn();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't save that just now.") };
  }
}

// ---------------------------------------------------------------------------
// Resources (signed links expire after 10 minutes; the client refreshes on click)
// ---------------------------------------------------------------------------

export async function resourceUrlAction(input: { resourceId: string }): Promise<{ ok: boolean; url?: string; error?: string }> {
  const session = await requireUser();
  const parsed = z.object({ resourceId: id }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  const { db } = await getServices();
  const resource = await db.from("lesson_resources").get(parsed.data.resourceId);
  if (!resource) return { ok: false, error: "That file is no longer available." };
  const access = await getLearnerAccess(session.user_id, resource.course_id, session.role);
  if (!access.allowed) return { ok: false, error: "Enrol to download course resources." };
  if (access.via !== "admin") {
    if (!access.enrollment) return { ok: false, error: "Enrol to download course resources." };
    const lesson = resource.lesson_id ? await db.from("lessons").get(resource.lesson_id) : null;
    const moduleId = resource.module_id ?? lesson?.module_id ?? null;
    const mod = moduleId ? await db.from("modules").get(moduleId) : null;
    if (mod) {
      const drip = lesson ? lessonDripDays(lesson, mod) : mod.drip_days;
      if (!isUnlocked(access.enrollment, drip, new Date())) return { ok: false, error: "This resource opens with its module." };
    }
  }
  try {
    return { ok: true, url: await signedUrlFor("course-resources", resource.file_path, resource.file_name) };
  } catch (err) {
    return { ok: false, error: message(err, "We couldn't prepare that download.") };
  }
}

// ---------------------------------------------------------------------------
// Quizzes & surveys
// ---------------------------------------------------------------------------

const quizSchema = z.object({
  quizKey: z.string().min(1).max(80),
  lessonId: id,
  answers: z.record(z.string().max(80), z.union([z.string().max(5000), z.number(), z.null()])),
});

function quizView(def: QuizDefinition, answers: Record<string, string | number | null>, submittedAt: string): QuizResultView {
  const scored = scoreQuiz(def, answers);
  const sections = (def.scoring.sections ?? []).map((s) => {
    const score = scored.section_scores?.[s.key] ?? 0;
    const band = bandFor(s.bands, score);
    return { key: s.key, label: s.label, score, band: band ? { label: band.label, text: band.text } : null };
  });
  return {
    ok: true,
    score: scored.score,
    maxScore: scored.max_score,
    band: scored.band ? { label: scored.band.label, text: scored.band.text } : null,
    sections,
    confirmation: def.confirmation,
    submittedAt,
  };
}

export async function submitQuizAction(input: z.input<typeof quizSchema>): Promise<QuizResultView> {
  const session = await requireUser();
  const empty: QuizResultView = { ok: false, score: null, maxScore: null, band: null, sections: [], confirmation: "", submittedAt: "" };
  const parsed = quizSchema.safeParse(input);
  if (!parsed.success) return { ...empty, error: "Bad input" };
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(parsed.data.lessonId);
  if (!lesson) return { ...empty, error: "Lesson not found" };
  if (!(await canUseLesson(session.user_id, session.role, lesson.id, lesson.course_id))) return { ...empty, error: "You need to be enrolled to take this quiz." };
  const def = await db.from("quiz_definitions").findOne({ key: parsed.data.quizKey });
  if (!def) return { ...empty, error: "Quiz not found" };
  const pre = scoreQuiz(def, parsed.data.answers);
  if (pre.missing_required.length) return { ...empty, error: "Please answer every required question.", missing: pre.missing_required };
  try {
    const row = await submitQuizResponse(session.user_id, def.key, parsed.data.answers);
    revalidateLearn();
    return quizView(def, row.answers, row.submitted_at);
  } catch (err) {
    return { ...empty, error: message(err, "We couldn't save your answers just now.") };
  }
}

/** The learner's latest result for a quiz, in display form (null when never taken). */
export async function latestQuizResultAction(input: { quizKey: string }): Promise<QuizResultView | null> {
  const session = await requireUser();
  const parsed = z.object({ quizKey: z.string().min(1).max(80) }).safeParse(input);
  if (!parsed.success) return null;
  const { db } = await getServices();
  const def = await db.from("quiz_definitions").findOne({ key: parsed.data.quizKey });
  if (!def) return null;
  const [latest] = await getQuizResponses(session.user_id, def.key);
  return latest ? quizView(def, latest.answers, latest.submitted_at) : null;
}
