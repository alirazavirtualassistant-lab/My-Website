import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getServices } from "@/services";
import type { DataStore } from "@/services/types";
import type { Badge, CoursePackage, Product, SiteSettings } from "@/lib/types";
import { newId, nowIso, addDays, slugify } from "@/lib/utils";
import { env } from "@/lib/env";
import { pricing, site } from "@/lib/config/site";
import { COURSE_GOALS } from "@/lib/domain/xp";
import { installCoursePackage } from "./install-package";
import { grantEnrollment } from "./fulfilment";

const BOOTSTRAP_MARKER = "bootstrap:v1";

/**
 * Called once per process start (from route-group layouts) to make sure the
 * data store has what the app needs. In demo mode it also seeds the Baby Steps
 * course, demo accounts and a demo enrollment with some progress.
 */
declare global {
  // eslint-disable-next-line no-var
  var __cycBootstrapped: Promise<void> | undefined;
}

export function ensureBootstrapped(): Promise<void> {
  if (!globalThis.__cycBootstrapped) {
    globalThis.__cycBootstrapped = bootstrap().catch((err) => {
      globalThis.__cycBootstrapped = undefined;
      console.error("[bootstrap] failed", err);
    });
  }
  return globalThis.__cycBootstrapped;
}

async function bootstrap() {
  const services = await getServices();
  const { db } = services;
  await ensureSettings(db);
  await ensureBadges(db);
  if (!env.demo) return;
  const settings = await db.from("site_settings").get("default");
  const legal = settings?.legal ?? {};
  if (legal[BOOTSTRAP_MARKER]) return;
  await seedDemo(services);
  const latest = await db.from("site_settings").get("default");
  await db.from("site_settings").update("default", { legal: { ...(latest?.legal ?? {}), [BOOTSTRAP_MARKER]: nowIso() }, updated_at: nowIso() });
}

export async function ensureSettings(db: DataStore): Promise<SiteSettings> {
  const existing = await db.from("site_settings").get("default");
  if (existing) return existing;
  const legal: Record<string, string> = {};
  for (const slug of ["terms", "privacy", "refund-policy", "medical-disclaimer", "cookie-policy"]) {
    try {
      legal[slug] = await fs.readFile(path.join(process.cwd(), "src/content/legal", `${slug}.md`), "utf8");
    } catch {
      legal[slug] = `# ${slug}\n\n[LEGAL REVIEW NEEDED]`;
    }
  }
  return db.from("site_settings").insert({
    id: "default",
    site_name: site.name,
    logo_path: null,
    support_email: site.supportEmail,
    disclaimer_text: site.medicalDisclaimer,
    colors: null,
    legal,
    abandoned_cart_emails: true,
    weekly_nudges: true,
    testimonials_enabled: true,
    updated_at: nowIso(),
  });
}

export const BADGE_DEFINITIONS: Array<Omit<Badge, "id">> = [
  ...["M1", "M2", "M3", "M4", "M5", "M6", "M7"].map((code, i) => ({
    key: `module:${code}`,
    title: `Module ${i + 1} complete`,
    description: `Every lesson in Module ${i + 1} finished.`,
    icon: "leaf",
    xp_bonus: 0,
  })),
  ...COURSE_GOALS.map((g) => ({ key: g.badge_key, title: g.title, description: g.description, icon: g.icon, xp_bonus: g.xp })),
  { key: "streak:7", title: "7-day streak", description: "Showed up seven days in a row.", icon: "flame", xp_bonus: 0 },
  { key: "streak:30", title: "30-day streak", description: "Showed up thirty days in a row.", icon: "flame", xp_bonus: 0 },
];

export async function ensureBadges(db: DataStore) {
  const existing = await db.from("badges").list();
  const byKey = new Map(existing.map((b) => [b.key, b]));
  for (const def of BADGE_DEFINITIONS) {
    const prev = byKey.get(def.key);
    if (prev) await db.from("badges").update(prev.id, def);
    else await db.from("badges").insert({ ...def, id: newId() });
  }
}

export async function loadBundledPackage(slug = "baby-steps"): Promise<CoursePackage | null> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "content/courses", slug, "course.json"), "utf8");
    return JSON.parse(raw) as CoursePackage;
  } catch {
    return null;
  }
}

/** Products from the pricing placeholders in site.ts. Idempotent by slug. */
export async function ensureDefaultProducts(db: DataStore, courseId: string): Promise<Product[]> {
  const now = nowIso();
  const defs: Array<Omit<Product, "id" | "created_at" | "updated_at">> = [
    {
      type: "course",
      slug: "baby-steps",
      title: "Baby Steps: Your Health Journey Toward Conception",
      description: "Lifetime access to the full 12-week course, all resources, bonuses, replays, community and certificate. Includes one partner seat.",
      course_ids: [courseId],
      grants_all_courses: false,
      price_cents: pricing.babySteps.oneTimeCents,
      sale_price_cents: pricing.babySteps.saleCents,
      sale_ends_at: pricing.babySteps.saleEndsAt,
      currency: site.currency,
      interval: null,
      installments: null,
      stripe_product_id: null,
      stripe_price_id: null,
      stripe_sale_price_id: null,
      active: true,
      is_free: false,
    },
    {
      type: "payment_plan",
      slug: "baby-steps-plan",
      title: "Baby Steps · 3 monthly payments",
      description: `Same lifetime access, paid in ${pricing.babySteps.paymentPlan.installments} monthly instalments.`,
      course_ids: [courseId],
      grants_all_courses: false,
      price_cents: pricing.babySteps.paymentPlan.amountCents,
      sale_price_cents: null,
      sale_ends_at: null,
      currency: site.currency,
      interval: "month",
      installments: pricing.babySteps.paymentPlan.installments,
      stripe_product_id: null,
      stripe_price_id: null,
      stripe_sale_price_id: null,
      active: true,
      is_free: false,
    },
    {
      type: "subscription",
      slug: "all-access-monthly",
      title: "All-Access · monthly",
      description: "Every current and future course while your membership is active.",
      course_ids: [],
      grants_all_courses: true,
      price_cents: pricing.allAccess.monthlyCents,
      sale_price_cents: null,
      sale_ends_at: null,
      currency: site.currency,
      interval: "month",
      installments: null,
      stripe_product_id: null,
      stripe_price_id: null,
      stripe_sale_price_id: null,
      active: true,
      is_free: false,
    },
    {
      type: "subscription",
      slug: "all-access-annual",
      title: "All-Access · annual",
      description: "Every current and future course, billed yearly.",
      course_ids: [],
      grants_all_courses: true,
      price_cents: pricing.allAccess.annualCents,
      sale_price_cents: null,
      sale_ends_at: null,
      currency: site.currency,
      interval: "year",
      installments: null,
      stripe_product_id: null,
      stripe_price_id: null,
      stripe_sale_price_id: null,
      active: true,
      is_free: false,
    },
  ];
  const out: Product[] = [];
  for (const def of defs) {
    const prev = await db.from("products").findOne({ slug: def.slug });
    if (prev) out.push(prev);
    else out.push(await db.from("products").insert({ ...def, id: newId(), created_at: now, updated_at: now }));
  }
  return out;
}

async function seedDemo(services: Awaited<ReturnType<typeof getServices>>) {
  const { db, auth } = services;
  const pkg = await loadBundledPackage("baby-steps");
  if (!pkg) {
    console.warn("[bootstrap] content/courses/baby-steps/course.json missing — run `npm run import:course`");
    return;
  }
  const result = await installCoursePackage(db, pkg, { status: "published" });
  const courseId = result.course_id;
  await ensureDefaultProducts(db, courseId);

  const { seedDemoAccounts, demoAccount } = await import("@/services/mock/seed");
  const seeded = await seedDemoAccounts(db, auth);
  const pick = (key: "admin" | "learner" | "partner") => (seeded.ids[key] ? { id: seeded.ids[key], email: demoAccount(key).email } : null);
  const learner = pick("learner");
  const partner = pick("partner");
  const admin = pick("admin");

  if (learner) {
    // Enrolled 10 days ago so Module 2 is open and Module 3 opens in 4 days.
    const startedAt = addDays(new Date(), -10).toISOString();
    const now = nowIso();
    const order = {
      id: newId(),
      user_id: learner.id,
      email: learner.email,
      items: [{ product_id: (await db.from("products").findOne({ slug: "baby-steps" }))!.id, title: "Baby Steps: Your Health Journey Toward Conception", unit_cents: pricing.babySteps.oneTimeCents, quantity: 1 }],
      subtotal_cents: pricing.babySteps.oneTimeCents,
      discount_cents: 0,
      tax_cents: 0,
      total_cents: pricing.babySteps.oneTimeCents,
      currency: site.currency,
      coupon_code: null,
      status: "paid" as const,
      provider: "mock" as const,
      provider_session_id: `demo_cs_${learner.id}`,
      provider_payment_intent_id: `mock_pi_demo_${learner.id}`,
      provider_subscription_id: null,
      provider_event_ids: ["demo_seed"],
      gift: null,
      refunded_cents: 0,
      created_at: startedAt,
      paid_at: startedAt,
      updated_at: now,
    };
    await db.from("orders").insert(order);
    const enrollment = await grantEnrollment(db, { userId: learner.id, courseId, source: "purchase", orderId: order.id, subscriptionId: null, startedAt });

    // Some progress: welcome + M1 intro + M1T1 complete, M1T1 quiz step done.
    const lessons = await db.from("lessons").list({ where: { course_id: courseId } });
    const byCode = new Map(lessons.map((l) => [l.code, l]));
    for (const code of ["M0", "M1T0", "M1T1"]) {
      const l = byCode.get(code);
      if (!l) continue;
      await db.from("lesson_progress").insert({ id: newId(), user_id: learner.id, lesson_id: l.id, course_id: courseId, completed_at: addDays(new Date(), -8).toISOString(), last_position_sec: 0, watched_sec: l.duration_sec, updated_at: now });
    }
    const m1t2 = byCode.get("M1T2");
    if (m1t2) await db.from("lesson_progress").insert({ id: newId(), user_id: learner.id, lesson_id: m1t2.id, course_id: courseId, completed_at: null, last_position_sec: 215, watched_sec: 215, updated_at: now });
    const m1t1 = byCode.get("M1T1");
    if (m1t1) {
      const steps = await db.from("action_steps").list({ where: { lesson_id: m1t1.id }, orderBy: ["position", "asc"] });
      const quizStep = steps[0];
      if (quizStep) {
        await db.from("action_step_completions").insert({ id: newId(), user_id: learner.id, step_id: quizStep.id, lesson_id: m1t1.id, course_id: courseId, upload_path: null, sub_items_done: [], completed_at: addDays(new Date(), -8).toISOString(), created_at: now });
        await db.from("xp_ledger").insert({ id: newId(), user_id: learner.id, course_id: courseId, amount: quizStep.xp, reason: "action_step", ref_id: quizStep.id, note: m1t1.id, created_at: addDays(new Date(), -8).toISOString() });
      }
    }
    await db.from("streaks").insert({ id: newId(), user_id: learner.id, current: 3, longest: 5, last_active_date: new Date().toISOString().slice(0, 10), updated_at: now });

    // Partner seat already accepted by the demo partner account.
    if (partner) {
      await db.from("partner_links").insert({ id: newId(), owner_user_id: learner.id, partner_user_id: partner.id, course_id: courseId, invite_email: partner.email, token_hash: "demo", status: "accepted", created_at: startedAt, accepted_at: startedAt });
      await db.from("enrollments").update(enrollment.id, { partner_invites_remaining: 0, updated_at: now });
      await grantEnrollment(db, { userId: partner.id, courseId, source: "partner", orderId: order.id, subscriptionId: null, startedAt });
    }
  }

  // A welcome post from Cynthia in Introductions
  if (admin) {
    const cat = (await db.from("forum_categories").list({ where: { course_id: courseId } })).find((c) => c.slug === slugify("Introductions"));
    if (cat) {
      await db.from("forum_posts").insert({
        id: newId(),
        category_id: cat.id,
        course_id: courseId,
        lesson_id: null,
        user_id: admin.id,
        title: "Welcome — introduce yourself here",
        body: "Tell us who you are, where you're starting, and one hope for this journey. Grace over guilt, always.",
        image_path: null,
        anonymous: false,
        pinned: true,
        locked: false,
        like_count: 0,
        reply_count: 0,
        status: "visible",
        created_at: nowIso(),
        updated_at: nowIso(),
      });
    }
  }
}

/** Admin → Settings → "Reset demo data": wipes the store and re-seeds. */
export async function resetDemoData(): Promise<void> {
  const { db } = await getServices();
  if (!env.demo || !db.reset) throw new Error("Reset is only available in demo mode");
  await db.reset();
  globalThis.__cycBootstrapped = undefined;
  await ensureBootstrapped();
}
