import "server-only";
import { getServices } from "@/services";
import type { Testimonial } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { site } from "@/lib/config/site";
import { env } from "@/lib/env";

/** Learner-submitted testimonial (from the capstone "Post Testimonial" step). Always starts pending. */
export async function submitTestimonial(
  userId: string,
  courseId: string | null,
  input: { authorName: string; authorRole?: string | null; body: string; rating?: number | null },
): Promise<Testimonial> {
  const { db } = await getServices();
  const body = input.body.trim().slice(0, 2000);
  if (body.length < 10) throw new Error("Please write a few sentences");
  const row = await db.from("testimonials").insert({
    id: newId(),
    user_id: userId,
    course_id: courseId,
    author_name: input.authorName.trim().slice(0, 120) || "Anonymous learner",
    author_role: input.authorRole?.trim().slice(0, 120) || null,
    body,
    rating: input.rating != null ? Math.min(5, Math.max(1, Math.round(input.rating))) : null,
    status: "pending",
    featured: false,
    created_at: nowIso(),
    reviewed_at: null,
  });
  try {
    const { sendTemplate } = await import("@/lib/email/send");
    await sendTemplate("testimonial-received", env.resend.adminNotificationEmail, {
      authorName: row.author_name,
      body: row.body,
      reviewUrl: `${site.url}/admin/testimonials`,
    } as never);
  } catch (err) {
    console.warn("[testimonials] admin email failed", err);
  }
  return row;
}

export async function listApprovedTestimonials(courseId?: string | null): Promise<Testimonial[]> {
  const { db } = await getServices();
  const all = await db.from("testimonials").list({ where: { status: "approved" }, orderBy: ["created_at", "desc"] });
  return courseId ? all.filter((t) => t.course_id === courseId || t.course_id === null) : all;
}
