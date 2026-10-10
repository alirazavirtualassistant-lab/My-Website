"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { site } from "@/lib/config/site";
import { ILLUSTRATION_NAMES } from "@/components/shared/illustration";
import { AdminCourseError, clearCourseThumbnail, createCourse, deleteCourse, updateCourse, type CourseInput } from "@/lib/usecases/admin-courses";
import { adminFormError, adminSuccess, formToObject, linesToList, zodErrors, type AdminFormState } from "@/components/admin/courses/form-state";

const bool = z.preprocess((v) => v === "on" || v === "true" || v === "1" || v === true, z.boolean());
const optionalInt = z.preprocess((v) => (v === "" || v === undefined || v === null ? null : Number(v)), z.number().int().min(0).max(100000).nullable());
const optionalDate = z.preprocess((v) => (v === "" || v === undefined ? null : v), z.string().max(40).nullable()).transform((v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
});
const list = z.preprocess((v) => (Array.isArray(v) ? v : v === undefined ? [] : [v]), z.array(z.string().max(200)));
const topicKeys = site.topics.map((t) => t.key) as [string, ...string[]];

const courseSchema = z
  .object({
    slug: z.string().trim().max(80).optional().default(""),
    title: z.string({ message: "Please give the course a title." }).trim().min(2, "Please give the course a title.").max(160, "Please keep the title under 160 characters."),
    subtitle: z.string().trim().max(300, "Please keep the subtitle under 300 characters.").optional().default(""),
    short_description: z.string().trim().max(400, "Please keep the short description under 400 characters.").optional().default(""),
    description: z.string().trim().max(20000, "The long description is a little long.").optional().default(""),
    illustration: z.string().trim().max(40).optional().default(""),
    level: z.string().trim().max(40).optional().default("All levels"),
    language: z.string().trim().max(40).optional().default("English"),
    topics: list,
    badge: z.enum(["", "bestseller", "new"]).optional().default(""),
    partner_seat_enabled: bool,
    certificate_enabled: bool,
    lifetime_access: bool,
    access_days: optionalInt,
    duration_weeks: optionalInt,
    what_you_learn: z.string().max(10000).optional().default(""),
    requirements: z.string().max(10000).optional().default(""),
    who_for: z.string().max(10000).optional().default(""),
    faq_q: list,
    faq_a: list,
    status: z.enum(["draft", "published", "scheduled", "archived"], { message: "Please choose a status." }),
    publish_at: optionalDate,
  })
  .superRefine((v, ctx) => {
    if (!v.lifetime_access && (v.access_days === null || v.access_days < 1)) ctx.addIssue({ code: "custom", path: ["access_days"], message: "Set how many days of access learners get, or switch lifetime access on." });
    if (v.status === "scheduled" && !v.publish_at) ctx.addIssue({ code: "custom", path: ["publish_at"], message: "Pick the date and time the course should go live." });
    if (v.illustration && !(ILLUSTRATION_NAMES as readonly string[]).includes(v.illustration)) ctx.addIssue({ code: "custom", path: ["illustration"], message: "Please choose one of the built-in illustrations." });
  });

function toCourseInput(data: z.output<typeof courseSchema>): CourseInput {
  const faq: Array<{ q: string; a: string }> = [];
  for (let i = 0; i < Math.max(data.faq_q.length, data.faq_a.length); i++) {
    const q = (data.faq_q[i] ?? "").trim();
    const a = (data.faq_a[i] ?? "").trim();
    if (q || a) faq.push({ q, a });
  }
  return {
    slug: data.slug || data.title,
    title: data.title,
    subtitle: data.subtitle,
    short_description: data.short_description,
    description: data.description,
    illustration: data.illustration || null,
    status: data.status,
    publish_at: data.status === "scheduled" ? data.publish_at : null,
    level: data.level || "All levels",
    language: data.language || "English",
    topics: data.topics.filter((t) => (topicKeys as string[]).includes(t)),
    badge: data.badge || null,
    partner_seat_enabled: data.partner_seat_enabled,
    certificate_enabled: data.certificate_enabled,
    lifetime_access: data.lifetime_access,
    access_days: data.lifetime_access ? null : data.access_days,
    what_you_learn: linesToList(data.what_you_learn),
    requirements: linesToList(data.requirements),
    who_for: linesToList(data.who_for),
    faq,
    duration_weeks: data.duration_weeks,
  };
}

function problem(err: unknown): AdminFormState {
  if (err instanceof AdminCourseError) return adminFormError(err.message);
  console.error("[admin/courses]", err);
  return adminFormError("Something went wrong while saving. Please try again.");
}

export async function createCourseAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin("/admin/courses/new");
  const parsed = courseSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  let id: string;
  try {
    const course = await createCourse(session.user_id, toCourseInput(parsed.data));
    id = course.id;
  } catch (err) {
    return problem(err);
  }
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect(`/admin/courses/${id}?toast=created`);
}

export async function saveCourseAction(courseId: string, _prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}`);
  const parsed = courseSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodErrors(parsed.error);
  try {
    const course = await updateCourse(session.user_id, courseId, toCourseInput(parsed.data));
    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    return adminSuccess("Course settings saved.");
  } catch (err) {
    return problem(err);
  }
}

export async function deleteCourseAction(courseId: string, force: boolean): Promise<{ ok: true } | { ok: false; error: string; enrolled: number }> {
  const session = await requireAdmin("/admin/courses");
  const result = await deleteCourse(session.user_id, courseId, { force });
  if (result.ok) {
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
  }
  return result;
}

export async function removeCourseThumbnailAction(courseId: string): Promise<AdminFormState> {
  const session = await requireAdmin(`/admin/courses/${courseId}`);
  try {
    await clearCourseThumbnail(session.user_id, courseId);
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return adminSuccess("Thumbnail removed.");
  } catch (err) {
    return problem(err);
  }
}
