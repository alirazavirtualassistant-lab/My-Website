import "server-only";
import { getServices } from "@/services";
import type { Enrollment, Subscription, Product, Course } from "@/lib/types";
import { hasCourseAccess } from "@/lib/domain/access";

export interface AccessInfo {
  allowed: boolean;
  via: "enrollment" | "subscription" | "admin" | null;
  enrollment: Enrollment | null;
  subscription: Subscription | null;
}

/**
 * Determines whether a user can open paid content for a course. Admins and
 * assistants always have access (for QA); learners need an active enrollment
 * (purchase, gift, comp, partner, free) or an active All-Access subscription.
 * Subscription access is also materialised as an enrollment row with
 * source = 'subscription' by the fulfilment use case, so progress/drip logic
 * always has an enrollment to anchor to.
 */
export async function getLearnerAccess(userId: string | null, courseId: string, role?: string): Promise<AccessInfo> {
  if (!userId) return { allowed: false, via: null, enrollment: null, subscription: null };
  const { db } = await getServices();
  const now = new Date();
  const [enrollments, subscriptions, products] = await Promise.all([
    db.from("enrollments").list({ where: { user_id: userId, course_id: courseId } }),
    db.from("subscriptions").list({ where: { user_id: userId } }),
    db.from("products").list({ where: { type: "subscription" } }),
  ]);
  const result = hasCourseAccess({ enrollments, subscriptions, products, courseId, now });
  const enrollment = pickEnrollment(enrollments, now);
  const subscription = subscriptions.find((s) => ["active", "trialing", "past_due"].includes(s.status)) ?? null;
  if (result.allowed) return { allowed: true, via: result.via, enrollment, subscription };
  if (role === "admin" || role === "assistant") return { allowed: true, via: "admin", enrollment, subscription };
  return { allowed: false, via: null, enrollment, subscription };
}

export function pickEnrollment(enrollments: Enrollment[], now: Date): Enrollment | null {
  const active = enrollments
    .filter((e) => e.status === "active" && (!e.expires_at || new Date(e.expires_at) > now))
    .sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
  return active[0] ?? enrollments[0] ?? null;
}

/** Courses a user can learn right now (active enrollments), with the course rows. */
export async function listLearnerCourses(userId: string): Promise<Array<{ course: Course; enrollment: Enrollment }>> {
  const { db } = await getServices();
  const now = new Date();
  const enrollments = await db.from("enrollments").list({ where: { user_id: userId }, orderBy: ["started_at", "desc"] });
  const byCourse = new Map<string, Enrollment>();
  for (const e of enrollments) {
    if (e.status !== "active") continue;
    if (e.expires_at && new Date(e.expires_at) <= now) continue;
    if (!byCourse.has(e.course_id)) byCourse.set(e.course_id, e);
  }
  if (byCourse.size === 0) return [];
  const courses = await db.from("courses").list({ where: { id: [...byCourse.keys()] } });
  return courses
    .filter((c) => c.status !== "archived")
    .map((course) => ({ course, enrollment: byCourse.get(course.id)! }));
}

export async function listProducts(opts: { activeOnly?: boolean } = { activeOnly: true }): Promise<Product[]> {
  const { db } = await getServices();
  const products = await db.from("products").list({ orderBy: ["created_at", "asc"] });
  return opts.activeOnly ? products.filter((p) => p.active) : products;
}
