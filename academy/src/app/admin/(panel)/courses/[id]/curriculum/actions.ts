"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { site } from "@/lib/config/site";
import {
  AdminCourseError,
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  markVideoUploadPending,
  prepareVideoUpload,
  reorderCurriculum,
  updateModule,
} from "@/lib/usecases/admin-courses";
import { adminFormError, adminSuccess, formToObject, zodErrors, type AdminFormState } from "@/components/admin/courses/form-state";

const bool = z.preprocess((v) => v === "on" || v === "true" || v === "1" || v === true, z.boolean());
const int = (max: number) => z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number({ message: "Please enter a whole number." }).int("Please enter a whole number.").min(0, "Cannot be negative.").max(max));

const moduleSchema = z.object({
  code: z.string({ message: "Please give the module a code." }).trim().min(1, "Please give the module a code.").max(20, "Keep the code under 20 characters."),
  title: z.string({ message: "Please give the module a title." }).trim().min(1, "Please give the module a title.").max(160),
  kind: z.enum(["home", "core", "bonus", "replay"], { message: "Please choose a module kind." }),
  description: z.string().max(2000).optional().default(""),
  notes: z.string().max(5000).optional().default(""),
  drip_days: int(3650),
  completion_xp: int(10000),
  required_for_certificate: bool,
  illustration: z.string().trim().max(60).optional().default(""),
});

const lessonSchema = z.object({
  code: z.string({ message: "Please give the lesson a code." }).trim().min(1, "Please give the lesson a code.").max(20),
  title: z.string({ message: "Please give the lesson a title." }).trim().min(1, "Please give the lesson a title.").max(200),
  is_intro: bool,
});

const orderSchema = z.array(z.object({ module_id: z.string().min(1).max(80), lesson_ids: z.array(z.string().min(1).max(80)).max(500) })).max(100);

function problem(err: unknown): AdminFormState {
  if (err instanceof AdminCourseError) return adminFormError(err.message);
  console.error("[admin/curriculum]", err);
  return adminFormError("Something went wrong. Please try again.");
}

function revalidateCourse(courseId: string) {
  revalidatePath(`/admin/courses/${courseId}/curriculum`);
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/courses");
  revalidatePath("/learn", "layout");
  revalidatePath("/courses", "layout");
}

export async function reorderCurriculumAction(courseId: string, order: unknown): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  const parsed = orderSchema.safeParse(order);
  if (!parsed.success) return adminFormError("That ordering could not be read. Please refresh and try again.");
  try {
    await reorderCurriculum(session.user_id, courseId, parsed.data);
    revalidateCourse(courseId);
    return adminSuccess("Order saved.");
  } catch (err) {
    return problem(err);
  }
}

export async function createModuleAction(courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  const parsed = moduleSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    await createModule(session.user_id, courseId, { ...parsed.data, illustration: parsed.data.illustration || null });
    revalidateCourse(courseId);
    return adminSuccess(`Module ${parsed.data.code.toUpperCase()} added.`);
  } catch (err) {
    return problem(err);
  }
}

export async function updateModuleAction(moduleId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  const parsed = moduleSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    await updateModule(session.user_id, moduleId, { ...parsed.data, illustration: parsed.data.illustration || null });
    revalidateCourse(courseId);
    return adminSuccess("Module saved.");
  } catch (err) {
    return problem(err);
  }
}

export async function deleteModuleAction(moduleId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  try {
    await deleteModule(session.user_id, moduleId);
    revalidateCourse(courseId);
    return adminSuccess("Module deleted.");
  } catch (err) {
    return problem(err);
  }
}

export async function createLessonAction(moduleId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  const parsed = lessonSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  let lessonId: string;
  try {
    const lesson = await createLesson(session.user_id, moduleId, { code: parsed.data.code, title: parsed.data.title, is_intro: parsed.data.is_intro });
    lessonId = lesson.id;
  } catch (err) {
    return problem(err);
  }
  revalidateCourse(courseId);
  redirect(`/admin/courses/${courseId}/lessons/${lessonId}?toast=lesson-created`);
}

export async function deleteLessonAction(lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/curriculum`);
  try {
    await deleteLesson(session.user_id, lessonId);
    revalidateCourse(courseId);
    return adminSuccess("Lesson deleted.");
  } catch (err) {
    return problem(err);
  }
}

export type PrepareUploadResult = { ok: true; mode: "mux" | "mock"; upload_url: string; upload_id: string } | { ok: false; error: string };

/**
 * Step 1 of a video upload. Mock mode answers with the in-app multipart route;
 * Mux mode answers with a direct-upload URL the browser PUTs the file to.
 */
export async function prepareVideoUploadAction(lessonId: string, filename: string): Promise<PrepareUploadResult> {
  const session = await requireAdmin("/admin/courses");
  const name = z.string().trim().min(1).max(255).safeParse(filename);
  if (!name.success) return { ok: false, error: "That file name could not be read." };
  try {
    const h = await headers();
    const origin = h.get("origin") ?? site.url;
    const result = await prepareVideoUpload(session.user_id, lessonId, name.data, origin);
    return { ok: true, ...result };
  } catch (err) {
    if (err instanceof AdminCourseError) return { ok: false, error: err.message };
    console.error("[admin/video] prepare failed", err);
    return { ok: false, error: "Could not start the upload. Please try again." };
  }
}

/** Step 2 (Mux only): the PUT finished; keep the upload id until the webhook marks the asset ready. */
export async function confirmMuxUploadAction(lessonId: string, uploadId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin("/admin/courses");
  const id = z.string().trim().min(1).max(200).safeParse(uploadId);
  if (!id.success) return adminFormError("That upload id could not be read.");
  try {
    await markVideoUploadPending(session.user_id, lessonId, id.data);
    revalidateCourse(courseId);
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
    return adminSuccess("Video uploaded — Mux is processing it.");
  } catch (err) {
    return problem(err);
  }
}
