import "server-only";
import { getServices } from "@/services";
import type { Course, Testimonial } from "@/lib/types";

export type TestimonialTab = Testimonial["status"];

export interface TestimonialRow extends Testimonial {
  course_title: string | null;
  submitter_email: string | null;
}

export interface TestimonialsData {
  rows: TestimonialRow[];
  counts: Record<TestimonialTab, number>;
  courses: Course[];
}

export async function getTestimonialsData(tab: TestimonialTab): Promise<TestimonialsData> {
  const { db } = await getServices();
  const [rows, courses, pending, approved, rejected] = await Promise.all([
    db.from("testimonials").list({ where: { status: tab }, orderBy: ["created_at", "desc"] }),
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
    db.from("testimonials").count({ status: "pending" }),
    db.from("testimonials").count({ status: "approved" }),
    db.from("testimonials").count({ status: "rejected" }),
  ]);
  const userIds = [...new Set(rows.map((r) => r.user_id).filter((id): id is string => !!id))];
  const profiles = userIds.length ? await db.from("profiles").list({ where: { id: userIds } }) : [];
  const emailById = new Map(profiles.map((p) => [p.id, p.deleted_at ? null : p.email]));
  const courseTitle = new Map(courses.map((c) => [c.id, c.title]));
  return {
    rows: rows
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.created_at.localeCompare(a.created_at))
      .map((r) => ({ ...r, course_title: r.course_id ? (courseTitle.get(r.course_id) ?? null) : null, submitter_email: r.user_id ? (emailById.get(r.user_id) ?? null) : null })),
    counts: { pending, approved, rejected },
    courses,
  };
}
