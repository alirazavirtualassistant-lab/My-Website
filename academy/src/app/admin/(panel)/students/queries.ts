import "server-only";
import { getServices } from "@/services";
import type { AuditLog, Certificate, Course, Enrollment, Order, Profile, Subscription } from "@/lib/types";
import { getLearnerCourseState } from "@/lib/usecases/progress";

export interface CourseProgressRow {
  course: Course;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  level: string;
}

export interface StudentDetail {
  profile: Profile;
  enrollments: Array<Enrollment & { course: Course | null }>;
  /** Courses the student can still be comp-enrolled in (no active enrollment). */
  enrollableCourses: Course[];
  progress: CourseProgressRow[];
  certificates: Array<Certificate & { course: Course | null }>;
  orders: Order[];
  subscriptions: Array<Subscription & { product_title: string }>;
  communityCounts: { posts: number; replies: number };
  audit: Array<AuditLog & { actor_name: string | null }>;
}

/** Everything the student detail page shows. Completion status only — never note, quiz or upload contents. */
export async function getStudentDetail(userId: string): Promise<StudentDetail | null> {
  const { db } = await getServices();
  const profile = await db.from("profiles").get(userId);
  if (!profile || profile.deleted_at) return null;
  const [enrollments, certificates, orders, subscriptions, courses, products, postCount, replyCount] = await Promise.all([
    db.from("enrollments").list({ where: { user_id: userId }, orderBy: ["created_at", "desc"] }),
    db.from("certificates").list({ where: { user_id: userId }, orderBy: ["issued_at", "desc"] }),
    db.from("orders").list({ where: { user_id: userId }, orderBy: ["created_at", "desc"] }),
    db.from("subscriptions").list({ where: { user_id: userId }, orderBy: ["created_at", "desc"] }),
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
    db.from("products").list(),
    db.from("forum_posts").count({ user_id: userId, status: ["visible", "hidden"] }),
    db.from("forum_replies").count({ user_id: userId, status: ["visible", "hidden"] }),
  ]);
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const productById = new Map(products.map((p) => [p.id, p]));
  const now = new Date();
  const activeCourseIds = new Set(enrollments.filter((e) => e.status === "active" && (!e.expires_at || new Date(e.expires_at) > now)).map((e) => e.course_id));

  const progress: CourseProgressRow[] = [];
  for (const courseId of new Set(enrollments.map((e) => e.course_id))) {
    const course = courseById.get(courseId);
    if (!course) continue;
    const state = await getLearnerCourseState(userId, courseId);
    if (!state) continue;
    progress.push({
      course,
      percent: state.summary.percent,
      completedLessons: state.summary.completedLessons,
      totalLessons: state.summary.totalLessons,
      xp: state.xpEntries.filter((e) => e.course_id === courseId).reduce((n, e) => n + e.amount, 0),
      level: state.level.label,
    });
  }

  const targetIds = new Set<string>([userId, ...enrollments.map((e) => e.id), ...orders.map((o) => o.id), ...certificates.map((c) => c.id)]);
  const auditRows = (await db.from("audit_log").list({ orderBy: ["created_at", "desc"], limit: 3000 }))
    .filter((a) => (a.target_id && targetIds.has(a.target_id)) || a.actor_user_id === userId)
    .slice(0, 60);
  const actorIds = [...new Set(auditRows.map((a) => a.actor_user_id).filter((id): id is string => !!id))];
  const actors = actorIds.length ? await db.from("profiles").list({ where: { id: actorIds } }) : [];
  const actorName = new Map(actors.map((a) => [a.id, a.name]));

  return {
    profile,
    enrollments: enrollments.map((e) => ({ ...e, course: courseById.get(e.course_id) ?? null })),
    enrollableCourses: courses.filter((c) => c.status !== "archived" && !activeCourseIds.has(c.id)),
    progress,
    certificates: certificates.map((c) => ({ ...c, course: courseById.get(c.course_id) ?? null })),
    orders,
    subscriptions: subscriptions.map((s) => ({ ...s, product_title: productById.get(s.product_id)?.title ?? "Membership" })),
    communityCounts: { posts: postCount, replies: replyCount },
    audit: auditRows.map((a) => ({ ...a, actor_name: a.actor_user_id ? (actorName.get(a.actor_user_id) ?? null) : null })),
  };
}
