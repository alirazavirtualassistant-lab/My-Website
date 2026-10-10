"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionLink } from "@/lib/types";
import {
  AdminCourseError,
  addAudioSlot,
  clearAudioSlot,
  clearLessonCaptions,
  clearLessonThumbnail,
  createActionStep,
  deleteActionStep,
  deleteResource,
  removeLessonVideo,
  renameResource,
  reorderActionSteps,
  reorderResources,
  updateActionStep,
  updateLesson,
  type ActionStepInput,
} from "@/lib/usecases/admin-courses";
import { adminFormError, adminSuccess, formToObject, zodErrors, type AdminFormState } from "@/components/admin/courses/form-state";
import { joinDuration } from "@/components/admin/courses/reorder";

const bool = z.preprocess((v) => v === "on" || v === "true" || v === "1" || v === true, z.boolean());
const num = (max: number, message = "Please enter a whole number.") => z.preprocess((v) => (v === "" || v === undefined ? 0 : Number(v)), z.number({ message }).int(message).min(0, "Cannot be negative.").max(max));
const optionalText = z.string().trim().max(500).optional().default("").transform((v) => (v ? v : null));
const list = z.preprocess((v) => (Array.isArray(v) ? v : v === undefined ? [] : [v]), z.array(z.string().max(500)));

const lessonSchema = z
  .object({
    code: z.string({ message: "Please give the lesson a code." }).trim().min(1, "Please give the lesson a code.").max(20),
    title: z.string({ message: "Please give the lesson a title." }).trim().min(1, "Please give the lesson a title.").max(200),
    series: optionalText,
    description: z.string().max(2000).optional().default(""),
    notes: z.string().max(10000).optional().default(""),
    minutes: num(600),
    seconds: num(59, "Seconds must be 0–59."),
    planned_video_filename: optionalText,
    transcript: z.string().max(200000).optional().default(""),
    is_preview: bool,
    is_intro: bool,
    doctor_callout: bool,
    drip_days_override: z.preprocess((v) => (v === "" || v === undefined ? null : Number(v)), z.number({ message: "Please enter a whole number of days." }).int().min(0).max(3650).nullable()),
    status: z.enum(["draft", "published", "scheduled"], { message: "Please choose a status." }),
    publish_at: z.string().max(40).optional().default(""),
    quiz_key: z.string().trim().max(80).optional().default(""),
  })
  .superRefine((v, ctx) => {
    if (v.status === "scheduled" && !v.publish_at) ctx.addIssue({ code: "custom", path: ["publish_at"], message: "Pick when the lesson should go live." });
  });

function problem(err: unknown): AdminFormState {
  if (err instanceof AdminCourseError) return adminFormError(err.message);
  console.error("[admin/lesson]", err);
  return adminFormError("Something went wrong. Please try again.");
}

function revalidateLesson(courseId: string, lessonId: string) {
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath(`/admin/courses/${courseId}/curriculum`);
  revalidatePath("/learn", "layout");
  revalidatePath("/courses", "layout");
}

export async function saveLessonAction(lessonId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const parsed = lessonSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  const d = parsed.data;
  let publish_at: string | null = null;
  if (d.status === "scheduled") {
    const date = new Date(d.publish_at);
    if (Number.isNaN(date.getTime())) return adminFormError("That publish date could not be read.");
    publish_at = date.toISOString();
  }
  try {
    await updateLesson(session.user_id, lessonId, {
      code: d.code,
      title: d.title,
      series: d.series,
      description: d.description,
      notes: d.notes,
      duration_sec: joinDuration(d.minutes, d.seconds),
      planned_video_filename: d.planned_video_filename,
      transcript: d.transcript,
      is_preview: d.is_preview,
      is_intro: d.is_intro,
      doctor_callout: d.doctor_callout,
      drip_days_override: d.drip_days_override,
      status: d.status,
      publish_at,
      quiz_key: d.quiz_key || null,
    });
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Lesson saved.");
  } catch (err) {
    return problem(err);
  }
}

export async function removeVideoAction(lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  try {
    await removeLessonVideo(session.user_id, lessonId);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Video removed.");
  } catch (err) {
    return problem(err);
  }
}

export async function removeThumbnailAction(lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  try {
    await clearLessonThumbnail(session.user_id, lessonId);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Thumbnail removed.");
  } catch (err) {
    return problem(err);
  }
}

export async function removeCaptionsAction(lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  try {
    await clearLessonCaptions(session.user_id, lessonId);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Captions removed.");
  } catch (err) {
    return problem(err);
  }
}

export async function addAudioSlotAction(lessonId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const label = z.string({ message: "Please give the slot a label." }).trim().min(1, "Please give the slot a label.").max(80).safeParse(formData.get("label"));
  if (!label.success) return zodErrors(label.error);
  try {
    await addAudioSlot(session.user_id, lessonId, label.data);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Audio slot added.");
  } catch (err) {
    return problem(err);
  }
}

export async function clearAudioSlotAction(lessonId: string, courseId: string, key: string, remove: boolean): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const k = z.string().min(1).max(60).safeParse(key);
  if (!k.success) return adminFormError("That slot could not be read.");
  try {
    await clearAudioSlot(session.user_id, lessonId, k.data, remove);
    revalidateLesson(courseId, lessonId);
    return adminSuccess(remove ? "Audio slot removed." : "Audio file cleared.");
  } catch (err) {
    return problem(err);
  }
}

export async function renameResourceAction(resourceId: string, lessonId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const label = z.string({ message: "Please give the resource a label." }).trim().min(1, "Please give the resource a label.").max(200).safeParse(formData.get("label"));
  if (!label.success) return zodErrors(label.error);
  try {
    await renameResource(session.user_id, resourceId, label.data);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Resource renamed.");
  } catch (err) {
    return problem(err);
  }
}

export async function deleteResourceAction(resourceId: string, lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  try {
    await deleteResource(session.user_id, resourceId);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Resource deleted.");
  } catch (err) {
    return problem(err);
  }
}

export async function reorderResourcesAction(lessonId: string, courseId: string, ids: string[]): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const parsed = z.array(z.string().min(1).max(80)).max(200).safeParse(ids);
  if (!parsed.success) return adminFormError("That order could not be read.");
  try {
    await reorderResources(session.user_id, lessonId, parsed.data);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Order saved.");
  } catch (err) {
    return problem(err);
  }
}

const stepSchema = z.object({
  label: z.string({ message: "Please give the action step a label." }).trim().min(1, "Please give the action step a label.").max(300),
  kind: z.enum(["consumption", "implementation", "optional", "rare"], { message: "Please choose a kind." }),
  xp: num(1000, "XP must be a whole number."),
  requires_upload: bool,
  upload_type: z.enum(["", "photo", "pdf", "journal", "any"]).optional().default(""),
  link_type: z.enum(["none", "forum", "quiz", "survey", "upload", "testimonial"], { message: "Please choose a link type." }),
  quiz_key: z.string().trim().max(80).optional().default(""),
  sub_key: list,
  sub_label: list,
  sub_xp: list,
});

function toStepInput(d: z.output<typeof stepSchema>): ActionStepInput {
  const uploadType = d.upload_type || "any";
  let link: ActionLink;
  switch (d.link_type) {
    case "forum":
    case "testimonial":
    case "none":
      link = { type: d.link_type };
      break;
    case "quiz":
      link = { type: "quiz", quiz_key: d.quiz_key };
      break;
    case "survey":
      link = { type: "survey", quiz_key: d.quiz_key };
      break;
    case "upload":
      link = { type: "upload", upload_type: uploadType };
      break;
  }
  const sub_items: ActionStepInput["sub_items"] = [];
  for (let i = 0; i < Math.max(d.sub_label.length, d.sub_key.length); i++) {
    const label = (d.sub_label[i] ?? "").trim();
    if (!label) continue;
    sub_items.push({ key: d.sub_key[i] ?? "", label, xp: Number(d.sub_xp[i] ?? 0) || 0 });
  }
  return {
    label: d.label,
    kind: d.kind,
    xp: d.xp,
    requires_upload: d.requires_upload || d.link_type === "upload",
    upload_type: d.requires_upload || d.link_type === "upload" ? uploadType : null,
    link,
    sub_items: sub_items.length ? sub_items : null,
  };
}

export async function saveActionStepAction(stepId: string | null, lessonId: string, courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const parsed = stepSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  if ((parsed.data.link_type === "quiz" || parsed.data.link_type === "survey") && !parsed.data.quiz_key) {
    return adminFormError("Choose which quiz or survey this step opens.");
  }
  try {
    const input = toStepInput(parsed.data);
    if (stepId) await updateActionStep(session.user_id, stepId, input);
    else await createActionStep(session.user_id, lessonId, input);
    revalidateLesson(courseId, lessonId);
    return adminSuccess(stepId ? "Action step saved." : "Action step added.");
  } catch (err) {
    return problem(err);
  }
}

export async function deleteActionStepAction(stepId: string, lessonId: string, courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  try {
    await deleteActionStep(session.user_id, stepId);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Action step deleted.");
  } catch (err) {
    return problem(err);
  }
}

export async function reorderActionStepsAction(lessonId: string, courseId: string, ids: string[]): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}/lessons/${lessonId}`);
  const parsed = z.array(z.string().min(1).max(80)).max(200).safeParse(ids);
  if (!parsed.success) return adminFormError("That order could not be read.");
  try {
    await reorderActionSteps(session.user_id, lessonId, parsed.data);
    revalidateLesson(courseId, lessonId);
    return adminSuccess("Order saved.");
  } catch (err) {
    return problem(err);
  }
}
