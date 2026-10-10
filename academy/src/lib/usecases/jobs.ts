import "server-only";
import { getServices } from "@/services";
import { nowIso, daysBetween, addDays } from "@/lib/utils";
import { site } from "@/lib/config/site";
import { unlockDate } from "@/lib/domain/drip";

export interface DailyJobsSummary {
  ran_at: string;
  drip_unlock_emails: number;
  weekly_nudges: number;
  abandoned_cart_emails: number;
  expired_enrollments: number;
}

/** Idempotent per day: each email is recorded in email_events with a payload key the job checks before sending again. */
export async function runDailyJobs(now: Date): Promise<DailyJobsSummary> {
  const { db } = await getServices();
  const settings = await db.from("site_settings").get("default");
  const summary: DailyJobsSummary = { ran_at: nowIso(), drip_unlock_emails: 0, weekly_nudges: 0, abandoned_cart_emails: 0, expired_enrollments: 0 };
  const { sendTemplate } = await import("@/lib/email/send");
  const sentKeys = new Set((await db.from("email_events").list({ limit: 5000, orderBy: ["created_at", "desc"] })).map((e) => String(e.payload?.job_key ?? "")));
  const already = (key: string) => sentKeys.has(key);

  const enrollments = (await db.from("enrollments").list({ where: { status: "active" } })).filter((e) => !e.unlock_all);
  const courses = await db.from("courses").list();
  const modules = await db.from("modules").list();
  const profiles = await db.from("profiles").list();
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  // 1) Drip unlock emails: modules whose unlock date fell within the last 24h
  for (const e of enrollments) {
    const profile = profileById.get(e.user_id);
    if (!profile || profile.deleted_at || !profile.email_preferences?.drip_unlocks) continue;
    const course = courses.find((c) => c.id === e.course_id);
    if (!course) continue;
    for (const m of modules.filter((m) => m.course_id === e.course_id && m.drip_days > 0)) {
      const at = unlockDate(e, m.drip_days);
      const diffMs = now.getTime() - at.getTime();
      if (diffMs < 0 || diffMs > 86_400_000) continue;
      const key = `drip:${e.id}:${m.id}`;
      if (already(key)) continue;
      await sendTemplate("drip-unlock", profile.email, {
        name: profile.name,
        moduleTitle: `${m.code.replace(/^M/, "Module ")}: ${m.title}`,
        courseTitle: course.title,
        learnUrl: `${site.url}/learn/${course.slug}`,
        job_key: key,
      });
      summary.drip_unlock_emails += 1;
    }
  }

  // 2) Weekly nudges for learners inactive 7+ days (one per week)
  if (settings?.weekly_nudges) {
    const progress = await db.from("lesson_progress").list();
    const lastActivity = new Map<string, Date>();
    for (const p of progress) {
      const d = new Date(p.updated_at);
      const prev = lastActivity.get(p.user_id);
      if (!prev || d > prev) lastActivity.set(p.user_id, d);
    }
    const weekKey = `${now.getUTCFullYear()}-w${Math.floor(daysBetween(new Date(Date.UTC(now.getUTCFullYear(), 0, 1)), now) / 7)}`;
    for (const e of enrollments) {
      const profile = profileById.get(e.user_id);
      if (!profile || profile.deleted_at || !profile.email_preferences?.progress_nudges) continue;
      const last = lastActivity.get(e.user_id) ?? new Date(e.started_at);
      if (daysBetween(last, now) < 7) continue;
      const key = `nudge:${e.user_id}:${weekKey}`;
      if (already(key)) continue;
      const course = courses.find((c) => c.id === e.course_id);
      await sendTemplate("weekly-nudge", profile.email, { name: profile.name, courseTitle: course?.title ?? "your course", learnUrl: `${site.url}/learn`, job_key: key });
      sentKeys.add(key);
      summary.weekly_nudges += 1;
    }
  }

  // 3) Abandoned carts: open checkout sessions older than 24h (max 7 days), one reminder each
  if (settings?.abandoned_cart_emails) {
    const sessions = await db.from("checkout_sessions").list({ where: { status: "open" } });
    for (const s of sessions) {
      const age = now.getTime() - new Date(s.created_at).getTime();
      if (age < 86_400_000 || age > 7 * 86_400_000 || !s.email) continue;
      const key = `cart:${s.id}`;
      if (already(key)) continue;
      await sendTemplate("abandoned-cart", s.email, { cartUrl: `${site.url}/cart`, job_key: key });
      summary.abandoned_cart_emails += 1;
    }
  }

  // 4) Expire enrollments
  for (const e of enrollments) {
    if (e.expires_at && new Date(e.expires_at) <= now) {
      await db.from("enrollments").update(e.id, { status: "expired", updated_at: nowIso() });
      summary.expired_enrollments += 1;
    }
  }

  // Expire stale checkout sessions (> 7 days)
  for (const s of await db.from("checkout_sessions").list({ where: { status: "open" } })) {
    if (new Date(s.created_at) < addDays(now, -7)) await db.from("checkout_sessions").update(s.id, { status: "expired" });
  }

  return summary;
}
