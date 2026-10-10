import "server-only";
import { getServices } from "@/services";
import type { Broadcast, Course, EmailEvent } from "@/lib/types";
import { templateNames } from "@/emails";
import { selectBroadcastRecipients } from "@/lib/usecases/admin-people";

export type EmailStatusFilter = "all" | EmailEvent["status"];

export interface EmailLogFilters {
  template: string | null;
  status: EmailStatusFilter;
  q: string | null;
}

export type EmailEventSummary = Omit<EmailEvent, "html" | "payload"> & { has_html: boolean };

export interface EmailLogData {
  rows: EmailEventSummary[];
  total: number;
  templates: string[];
  counts: { sent: number; failed: number; queued: number };
}

const PAGE = 100;

export async function getEmailLog(filters: EmailLogFilters): Promise<EmailLogData> {
  const { db } = await getServices();
  const where: Partial<EmailEvent> = {};
  if (filters.template) where.template = filters.template;
  if (filters.status !== "all") where.status = filters.status;
  const [rows, total, sent, failed, queued, recent] = await Promise.all([
    db.from("email_events").list({ where, orderBy: ["created_at", "desc"], limit: PAGE, search: filters.q ? { columns: ["to", "subject"], query: filters.q } : undefined }),
    db.from("email_events").count(where),
    db.from("email_events").count({ status: "sent" }),
    db.from("email_events").count({ status: "failed" }),
    db.from("email_events").count({ status: "queued" }),
    db.from("email_events").list({ orderBy: ["created_at", "desc"], limit: 500 }),
  ]);
  const seen = new Set<string>([...templateNames, ...recent.map((e) => e.template)]);
  return {
    rows: rows.map(({ html, payload: _payload, ...rest }) => ({ ...rest, has_html: !!html })),
    total,
    templates: [...seen].sort(),
    counts: { sent, failed, queued },
  };
}

export async function getEmailEvent(id: string): Promise<EmailEvent | null> {
  const { db } = await getServices();
  return db.from("email_events").get(id);
}

export interface BroadcastRow extends Broadcast {
  course_title: string | null;
  created_by_name: string | null;
}

export async function listBroadcasts(): Promise<BroadcastRow[]> {
  const { db } = await getServices();
  const [rows, courses] = await Promise.all([db.from("broadcasts").list({ orderBy: ["created_at", "desc"], limit: 200 }), db.from("courses").list()]);
  const creatorIds = [...new Set(rows.map((r) => r.created_by))];
  const creators = creatorIds.length ? await db.from("profiles").list({ where: { id: creatorIds } }) : [];
  const nameById = new Map(creators.map((p) => [p.id, p.name]));
  const titleById = new Map(courses.map((c) => [c.id, c.title]));
  return rows.map((r) => ({ ...r, course_title: r.course_id ? (titleById.get(r.course_id) ?? null) : null, created_by_name: nameById.get(r.created_by) ?? null }));
}

export interface AudienceCounts {
  all: number;
  byCourse: Record<string, { course: number; incomplete: number }>;
}

/** Recipient counts for every audience/course combination, so the form can show "will reach N people" without a round trip. */
export async function getAudienceCounts(): Promise<{ counts: AudienceCounts; courses: Course[] }> {
  const { db } = await getServices();
  const [profiles, enrollments, certificates, courses] = await Promise.all([
    db.from("profiles").list(),
    db.from("enrollments").list({ where: { status: "active" } }),
    db.from("certificates").list(),
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
  ]);
  const byCourse: AudienceCounts["byCourse"] = {};
  for (const c of courses) {
    byCourse[c.id] = {
      course: selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "course", courseId: c.id }).length,
      incomplete: selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "incomplete", courseId: c.id }).length,
    };
  }
  return { counts: { all: selectBroadcastRecipients({ profiles, enrollments, certificates, audience: "all", courseId: null }).length, byCourse }, courses: courses.filter((c) => c.status !== "archived") };
}
