import "server-only";
import { getServices } from "@/services";
import type { Enrollment, Order, Profile } from "@/lib/types";
import { daysBetween } from "@/lib/utils";

export interface AdminDashboardStats {
  revenue: { today_cents: number; last30_cents: number; all_time_cents: number; refunded_cents: number };
  students: { total: number; new_last30: number; active_last7: number };
  mrr_cents: number;
  completion_by_module: Array<{ course_title: string; module_code: string; module_title: string; enrolled: number; completed: number; rate: number }>;
  top_lessons: Array<{ lesson_code: string; lesson_title: string; completions: number }>;
  dropoff: Array<{ lesson_code: string; lesson_title: string; position: number; reached: number }>;
  refunds: number;
  orders_last30: number;
  pending_testimonials: number;
  open_reports: number;
}

export async function getAdminDashboardStats(now = new Date()): Promise<AdminDashboardStats> {
  const { db } = await getServices();
  const [orders, profiles, enrollments, progress, lessons, modules, courses, subscriptions, products, testimonials, reports] = await Promise.all([
    db.from("orders").list(),
    db.from("profiles").list(),
    db.from("enrollments").list(),
    db.from("lesson_progress").list(),
    db.from("lessons").list(),
    db.from("modules").list(),
    db.from("courses").list(),
    db.from("subscriptions").list(),
    db.from("products").list(),
    db.from("testimonials").count({ status: "pending" }),
    db.from("forum_reports").count({ status: "open" }),
  ]);
  const paid = orders.filter((o) => o.status === "paid" || o.status === "partially_refunded" || o.status === "refunded");
  const net = (o: Order) => o.total_cents - o.refunded_cents;
  const todayKey = now.toISOString().slice(0, 10);
  const revenue = {
    today_cents: paid.filter((o) => (o.paid_at ?? "").slice(0, 10) === todayKey).reduce((n, o) => n + net(o), 0),
    last30_cents: paid.filter((o) => o.paid_at && daysBetween(new Date(o.paid_at), now) <= 30).reduce((n, o) => n + net(o), 0),
    all_time_cents: paid.reduce((n, o) => n + net(o), 0),
    refunded_cents: orders.reduce((n, o) => n + o.refunded_cents, 0),
  };
  const learners = profiles.filter((p) => !p.deleted_at && p.role === "learner");
  const activeUserIds = new Set(progress.filter((p) => daysBetween(new Date(p.updated_at), now) <= 7).map((p) => p.user_id));
  const students = {
    total: learners.length,
    new_last30: learners.filter((p) => daysBetween(new Date(p.created_at), now) <= 30).length,
    active_last7: activeUserIds.size,
  };
  const productById = new Map(products.map((p) => [p.id, p]));
  const mrr_cents = subscriptions
    .filter((s) => s.status === "active" || s.status === "trialing" || s.status === "past_due")
    .reduce((n, s) => {
      const p = productById.get(s.product_id);
      if (!p || p.type !== "subscription") return n;
      return n + (p.interval === "year" ? Math.round(p.price_cents / 12) : p.price_cents);
    }, 0);

  const completedByUserLesson = new Set(progress.filter((p) => p.completed_at).map((p) => `${p.user_id}:${p.lesson_id}`));
  const activeEnrollments = enrollments.filter((e) => e.status === "active");
  const completion_by_module = modules
    .filter((m) => m.kind === "core" || m.kind === "home")
    .map((m) => {
      const course = courses.find((c) => c.id === m.course_id);
      const mLessons = lessons.filter((l) => l.module_id === m.id);
      const enrolled = activeEnrollments.filter((e) => e.course_id === m.course_id);
      const completed = enrolled.filter((e) => mLessons.length > 0 && mLessons.every((l) => completedByUserLesson.has(`${e.user_id}:${l.id}`))).length;
      return { course_title: course?.title ?? "", module_code: m.code, module_title: m.title, enrolled: enrolled.length, completed, rate: enrolled.length ? completed / enrolled.length : 0 };
    })
    .sort((a, b) => a.module_code.localeCompare(b.module_code));

  const completionsByLesson = new Map<string, number>();
  for (const p of progress) if (p.completed_at) completionsByLesson.set(p.lesson_id, (completionsByLesson.get(p.lesson_id) ?? 0) + 1);
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const top_lessons = [...completionsByLesson.entries()]
    .map(([id, completions]) => ({ lesson_code: lessonById.get(id)?.code ?? "", lesson_title: lessonById.get(id)?.title ?? "", completions }))
    .sort((a, b) => b.completions - a.completions)
    .slice(0, 8);

  const ordered = [...lessons].sort((a, b) => {
    const ma = modules.find((m) => m.id === a.module_id)?.position ?? 0;
    const mb = modules.find((m) => m.id === b.module_id)?.position ?? 0;
    return ma - mb || a.position - b.position;
  });
  const dropoff = ordered.map((l, i) => ({ lesson_code: l.code, lesson_title: l.title, position: i, reached: progress.filter((p) => p.lesson_id === l.id).length }));

  return {
    revenue,
    students,
    mrr_cents,
    completion_by_module,
    top_lessons,
    dropoff,
    refunds: orders.filter((o) => o.status === "refunded" || o.status === "partially_refunded").length,
    orders_last30: paid.filter((o) => o.paid_at && daysBetween(new Date(o.paid_at), now) <= 30).length,
    pending_testimonials: testimonials,
    open_reports: reports,
  };
}

export interface StudentRow {
  profile: Profile;
  enrollments: Enrollment[];
  xp: number;
  completed_lessons: number;
  last_active: string | null;
  orders: number;
}

export async function listStudents(opts: { query?: string; limit?: number; offset?: number } = {}): Promise<{ rows: StudentRow[]; total: number }> {
  const { db } = await getServices();
  const profiles = await db.from("profiles").list({
    orderBy: ["created_at", "desc"],
    search: opts.query ? { columns: ["name", "email"], query: opts.query } : undefined,
  });
  const visible = profiles.filter((p) => !p.deleted_at);
  const page = visible.slice(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 50));
  const ids = page.map((p) => p.id);
  if (ids.length === 0) return { rows: [], total: visible.length };
  const [enrollments, xp, progress, orders] = await Promise.all([
    db.from("enrollments").list({ where: { user_id: ids } }),
    db.from("xp_ledger").list({ where: { user_id: ids } }),
    db.from("lesson_progress").list({ where: { user_id: ids } }),
    db.from("orders").list({ where: { user_id: ids } }),
  ]);
  const rows = page.map((profile) => {
    const mine = progress.filter((p) => p.user_id === profile.id);
    const last = mine.reduce<string | null>((acc, p) => (!acc || p.updated_at > acc ? p.updated_at : acc), null);
    return {
      profile,
      enrollments: enrollments.filter((e) => e.user_id === profile.id),
      xp: xp.filter((x) => x.user_id === profile.id).reduce((n, x) => n + x.amount, 0),
      completed_lessons: mine.filter((p) => p.completed_at).length,
      last_active: last,
      orders: orders.filter((o) => o.user_id === profile.id).length,
    };
  });
  return { rows, total: visible.length };
}

export function studentsToCsv(rows: StudentRow[]): string {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["name", "email", "role", "joined", "enrollments", "xp", "completed_lessons", "last_active", "orders"].join(",");
  const lines = rows.map((r) =>
    [r.profile.name, r.profile.email, r.profile.role, r.profile.created_at, r.enrollments.filter((e) => e.status === "active").length, r.xp, r.completed_lessons, r.last_active ?? "", r.orders].map(esc).join(","),
  );
  return [header, ...lines].join("\n");
}
