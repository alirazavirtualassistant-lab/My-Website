/**
 * Supabase seed.
 *
 *   npx tsx scripts/seed.ts [--file content/courses/baby-steps/course.json]
 *                           [--resources-dir content/storage/course-resources]
 *                           [--status draft|published] [--skip-files]
 *                           [--skip-products] [--dry-run]
 *
 * Reads the importer output (a CoursePackage, src/lib/types.ts) and upserts it
 * into a Supabase project with the service-role client:
 *
 *   course            by slug            (status kept on re-run unless --status)
 *   modules           by course_id+code  (stale modules removed — cascades!)
 *   lessons           by course_id+code  (admin-attached media/audio kept)
 *   lesson_resources  replaced per course
 *   action_steps      replaced per lesson, ids kept stable by source_label so
 *                     learner completions survive a re-seed
 *   quiz_definitions  by key
 *   forum_categories  by course_id+slug
 *   badges            fixed list (must match seed.sql + usecases/demo.ts)
 *   products          inserted when missing by slug (never overwritten:
 *                     prices/Stripe ids are edited in admin / stripe-setup)
 *   site_settings     inserted when missing; missing legal slugs filled from
 *                     src/content/legal/*.md
 *   storage           every file under --resources-dir → course-resources
 *                     bucket (upsert, same relative path)
 *
 * Idempotent: run it as often as you like. --dry-run needs no credentials.
 *
 * Env (from .env.local / .env or the shell):
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import fs from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ActionStep, Badge, CoursePackage, Lesson, LessonResource, Product, SiteSettings } from "../src/lib/types";
import { pricing, site } from "../src/lib/config/site";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface Args {
  file: string;
  resourcesDir: string;
  status: "draft" | "published" | null;
  skipFiles: boolean;
  skipProducts: boolean;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    file: "content/courses/baby-steps/course.json",
    resourcesDir: "content/storage/course-resources",
    status: null,
    skipFiles: false,
    skipProducts: false,
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} needs a value`);
      return v;
    };
    if (a === "--file") args.file = next();
    else if (a === "--resources-dir") args.resourcesDir = next();
    else if (a === "--status") {
      const v = next();
      if (v !== "draft" && v !== "published") throw new Error("--status must be draft or published");
      args.status = v;
    } else if (a === "--skip-files") args.skipFiles = true;
    else if (a === "--skip-products") args.skipProducts = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: tsx scripts/seed.ts [--file course.json] [--resources-dir DIR] [--status draft|published] [--skip-files] [--skip-products] [--dry-run]",
      );
      process.exit(0);
    } else throw new Error(`Unknown argument ${a}`);
  }
  return args;
}

function loadEnvFiles(): void {
  for (const name of [".env.local", ".env"]) {
    const file = path.resolve(process.cwd(), name);
    if (!fs.existsSync(file)) continue;
    try {
      process.loadEnvFile(file);
    } catch {
      // Older Node without loadEnvFile: rely on the shell environment.
    }
  }
}

// ---------------------------------------------------------------------------
// Fixed data (keep in sync with supabase/seed/seed.sql and
// src/lib/usecases/demo.ts BADGE_DEFINITIONS / COURSE_GOALS)
// ---------------------------------------------------------------------------

export const BADGES: Array<Omit<Badge, "id">> = [
  ...["M1", "M2", "M3", "M4", "M5", "M6", "M7"].map((code, i) => ({
    key: `module:${code}`,
    title: `Module ${i + 1} complete`,
    description: `Every lesson in Module ${i + 1} finished.`,
    icon: "leaf",
    xp_bonus: 0, // module XP is the module's own completion_xp
  })),
  // Welcome Guide "Course goals" (50 / 100 / 150 XP) — awarded after M1, M1–M4, M1–M7.
  {
    key: "goal:minimum",
    title: "Minimum goal",
    description: "Identify your personal health barriers (such as cravings) and set your first wellness habits.",
    icon: "sprout",
    xp_bonus: 50,
  },
  {
    key: "goal:target",
    title: "Target goal",
    description:
      "Reach a solid pre-conception baseline for you and your partner, including balanced nutrition and lower stress.",
    icon: "flower",
    xp_bonus: 100,
  },
  {
    key: "goal:stretch",
    title: "Stretch goal",
    description:
      "Reduce toxins, build strong family bonds, and prepare a multi-generational legacy of health with sustained vitality.",
    icon: "sun",
    xp_bonus: 150,
  },
  { key: "streak:7", title: "7-day streak", description: "Showed up seven days in a row.", icon: "flame", xp_bonus: 0 },
  { key: "streak:30", title: "30-day streak", description: "Showed up thirty days in a row.", icon: "flame", xp_bonus: 0 },
];

/** Products from the pricing placeholders. CONFIRM WITH CYNTHIA before launch. */
export function defaultProducts(courseId: string): Array<Omit<Product, "id" | "created_at" | "updated_at">> {
  const base = {
    sale_price_cents: null,
    sale_ends_at: null,
    currency: site.currency,
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_sale_price_id: null,
    active: true,
    is_free: false,
  };
  return [
    {
      ...base,
      type: "course",
      slug: "baby-steps",
      title: "Baby Steps: Your Health Journey Toward Conception",
      description:
        "Lifetime access to the full 12-week course, all resources, bonuses, replays, community and certificate. Includes one partner seat.",
      course_ids: [courseId],
      grants_all_courses: false,
      price_cents: pricing.babySteps.oneTimeCents, // CONFIRM WITH CYNTHIA
      sale_price_cents: pricing.babySteps.saleCents, // CONFIRM WITH CYNTHIA
      sale_ends_at: pricing.babySteps.saleEndsAt,
      interval: null,
      installments: null,
    },
    {
      ...base,
      type: "payment_plan",
      slug: "baby-steps-plan",
      title: `Baby Steps · ${pricing.babySteps.paymentPlan.installments} monthly payments`,
      description: `Same lifetime access, paid in ${pricing.babySteps.paymentPlan.installments} monthly instalments.`,
      course_ids: [courseId],
      grants_all_courses: false,
      price_cents: pricing.babySteps.paymentPlan.amountCents, // CONFIRM WITH CYNTHIA — per instalment
      interval: "month",
      installments: pricing.babySteps.paymentPlan.installments,
    },
    {
      ...base,
      type: "subscription",
      slug: "all-access-monthly",
      title: "All-Access · monthly",
      description: "Every current and future course while your membership is active.",
      course_ids: [],
      grants_all_courses: true,
      price_cents: pricing.allAccess.monthlyCents, // CONFIRM WITH CYNTHIA
      interval: "month",
      installments: null,
    },
    {
      ...base,
      type: "subscription",
      slug: "all-access-annual",
      title: "All-Access · annual",
      description: "Every current and future course, billed yearly.",
      course_ids: [],
      grants_all_courses: true,
      price_cents: pricing.allAccess.annualCents, // CONFIRM WITH CYNTHIA
      interval: "year",
      installments: null,
    },
  ];
}

const LEGAL_SLUGS = ["terms", "privacy", "refund-policy", "medical-disclaimer", "cookie-policy"] as const;
const PLACEHOLDER_LEGAL = /^#[^\n]*\n\n\[LEGAL REVIEW NEEDED\]\s*$/;

function legalText(slug: string): string {
  const file = path.resolve(process.cwd(), "src/content/legal", `${slug}.md`);
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  return `# ${slug}\n\n[LEGAL REVIEW NEEDED]`;
}

function defaultSettings(): SiteSettings {
  const legal: Record<string, string> = {};
  for (const slug of LEGAL_SLUGS) legal[slug] = legalText(slug);
  return {
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
    updated_at: new Date().toISOString(),
  };
}

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".vtt": "text/vtt",
  ".json": "application/json",
};

function contentTypeFor(file: string): string {
  return CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

// ---------------------------------------------------------------------------
// Package + files
// ---------------------------------------------------------------------------

function loadPackage(file: string): CoursePackage {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) {
    throw new Error(
      `Package not found: ${file}. Run "npm run import:course" first, or pass --file supabase/seed/fixture-course.json for a self-test.`,
    );
  }
  const pkg = JSON.parse(fs.readFileSync(abs, "utf8")) as CoursePackage;
  if (pkg.version !== 1 || !pkg.course?.slug || !Array.isArray(pkg.modules)) {
    throw new Error(`${file} is not a version-1 CoursePackage`);
  }
  return pkg;
}

interface LocalFile {
  rel: string; // forward-slash path relative to resourcesDir = storage path
  abs: string;
  size: number;
}

function walkFiles(dir: string): LocalFile[] {
  const root = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(root)) return [];
  const out: LocalFile[] = [];
  const visit = (d: string) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, entry.name);
      if (entry.isDirectory()) visit(abs);
      else if (entry.isFile() && !entry.name.startsWith(".")) {
        out.push({ rel: path.relative(root, abs).split(path.sep).join("/"), abs, size: fs.statSync(abs).size });
      }
    }
  };
  visit(root);
  return out.sort((a, b) => a.rel.localeCompare(b.rel));
}

function packageResourcePaths(pkg: CoursePackage): string[] {
  const paths = new Set<string>();
  for (const m of pkg.modules) {
    for (const r of m.resources) paths.add(r.file_path);
    for (const l of m.lessons) for (const r of l.resources) paths.add(r.file_path);
  }
  return [...paths].sort();
}

// ---------------------------------------------------------------------------
// Supabase helpers
// ---------------------------------------------------------------------------

type Db = SupabaseClient;

interface DbError {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
}

function fail(where: string, error: DbError | null | undefined): never {
  const code = error?.code ? ` [${error.code}]` : "";
  const details = error?.details ? ` (${error.details})` : "";
  const hint = error?.hint ? ` Hint: ${error.hint}` : "";
  throw new Error(`[seed] ${where} failed${code}: ${error?.message ?? "unknown error"}${details}${hint}`);
}

function nowIso(): string {
  return new Date().toISOString();
}

function chunk<T>(items: T[], size = 200): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

interface Summary {
  course: "created" | "updated";
  course_id: string;
  modules: number;
  modules_removed: number;
  lessons: number;
  lessons_removed: number;
  resources: number;
  action_steps: number;
  action_steps_removed: number;
  quizzes: number;
  forum_categories: number;
  badges: number;
  products_created: number;
  products_existing: number;
  settings: "created" | "patched" | "unchanged";
  files_uploaded: number;
  files_skipped: number;
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Seeding steps
// ---------------------------------------------------------------------------

async function seedCourse(db: Db, pkg: CoursePackage, status: Args["status"]): Promise<{ id: string; created: boolean }> {
  const now = nowIso();
  const { data: existing, error } = await db.from("courses").select("id,status").eq("slug", pkg.course.slug).maybeSingle();
  if (error) fail("courses.select", error);
  const fields = { ...pkg.course, last_updated_at: now, updated_at: now };
  if (existing) {
    const { error: e } = await db
      .from("courses")
      .update({ ...fields, status: status ?? existing.status })
      .eq("id", existing.id);
    if (e) fail("courses.update", e);
    return { id: existing.id as string, created: false };
  }
  const { data, error: e } = await db
    .from("courses")
    .insert({ ...fields, status: status ?? pkg.course.status, created_at: now })
    .select("id")
    .single();
  if (e || !data) fail("courses.insert", e);
  return { id: data.id as string, created: true };
}

async function seedModules(db: Db, pkg: CoursePackage, courseId: string, summary: Summary): Promise<Map<string, string>> {
  const { data: existing, error } = await db.from("modules").select("id,code").eq("course_id", courseId);
  if (error) fail("modules.select", error);
  const now = nowIso();
  const rows = pkg.modules.map((m, i) => ({
    course_id: courseId,
    code: m.code,
    kind: m.kind,
    title: m.title,
    description: m.description,
    notes: m.notes,
    position: i,
    drip_days: m.drip_days,
    completion_xp: m.completion_xp,
    header_image_path: m.header_image_path,
    illustration: m.illustration,
    required_for_certificate: m.required_for_certificate,
    updated_at: now,
  }));
  const { data, error: e } = await db.from("modules").upsert(rows, { onConflict: "course_id,code" }).select("id,code");
  if (e || !data) fail("modules.upsert", e);
  const byCode = new Map<string, string>((data as Array<{ id: string; code: string }>).map((r) => [r.code, r.id]));
  summary.modules = byCode.size;

  const stale = ((existing ?? []) as Array<{ id: string; code: string }>).filter((m) => !byCode.has(m.code));
  if (stale.length > 0) {
    summary.warnings.push(`Removed modules no longer in the package (lessons + learner progress cascade): ${stale.map((m) => m.code).join(", ")}`);
    const { error: d } = await db.from("modules").delete().in("id", stale.map((m) => m.id));
    if (d) fail("modules.delete", d);
    summary.modules_removed = stale.length;
  }
  return byCode;
}

type ExistingLesson = Pick<
  Lesson,
  "id" | "code" | "video_provider" | "video_asset_id" | "video_playback_id" | "video_url" | "captions_path" | "thumbnail_path" | "audio_slots"
>;

function mergeAudioSlots(prev: Lesson["audio_slots"], next: Lesson["audio_slots"]): Lesson["audio_slots"] {
  const prevByKey = new Map(prev.map((s) => [s.key, s]));
  return next.map((s) => ({ ...s, file_path: prevByKey.get(s.key)?.file_path ?? s.file_path }));
}

async function seedLessons(
  db: Db,
  pkg: CoursePackage,
  courseId: string,
  moduleIds: Map<string, string>,
  summary: Summary,
): Promise<Map<string, string>> {
  const { data: existing, error } = await db
    .from("lessons")
    .select("id,code,video_provider,video_asset_id,video_playback_id,video_url,captions_path,thumbnail_path,audio_slots")
    .eq("course_id", courseId);
  if (error) fail("lessons.select", error);
  const prevByCode = new Map<string, ExistingLesson>(((existing ?? []) as ExistingLesson[]).map((l) => [l.code, l]));
  const now = nowIso();

  const rows = pkg.modules.flatMap((m) =>
    m.lessons.map((l, li) => {
      const prev = prevByCode.get(l.code);
      const moduleId = moduleIds.get(m.code);
      if (!moduleId) throw new Error(`[seed] module ${m.code} has no id`);
      return {
        module_id: moduleId,
        course_id: courseId,
        code: l.code,
        title: l.title,
        series: l.series,
        description: l.description,
        notes: l.notes,
        planned_video_filename: l.planned_video_filename,
        // Media the admin attached in the CMS survives a re-seed.
        video_provider: prev?.video_provider ?? l.video_provider,
        video_asset_id: prev?.video_asset_id ?? l.video_asset_id,
        video_playback_id: prev?.video_playback_id ?? l.video_playback_id,
        video_url: prev?.video_url ?? l.video_url,
        captions_path: prev?.captions_path ?? l.captions_path,
        thumbnail_path: prev?.thumbnail_path ?? l.thumbnail_path,
        duration_sec: l.duration_sec,
        transcript: l.transcript,
        transcript_source_file: l.transcript_source_file,
        audio_slots: prev ? mergeAudioSlots(prev.audio_slots ?? [], l.audio_slots) : l.audio_slots,
        is_preview: l.is_preview,
        is_intro: l.is_intro,
        position: li,
        drip_days_override: l.drip_days_override,
        status: l.status,
        publish_at: l.publish_at,
        doctor_callout: l.doctor_callout,
        quiz_key: l.quiz_key,
        updated_at: now,
      };
    }),
  );

  const byCode = new Map<string, string>();
  for (const part of chunk(rows, 50)) {
    const { data, error: e } = await db.from("lessons").upsert(part, { onConflict: "course_id,code" }).select("id,code");
    if (e || !data) fail("lessons.upsert", e);
    for (const r of data as Array<{ id: string; code: string }>) byCode.set(r.code, r.id);
  }
  summary.lessons = byCode.size;

  const stale = [...prevByCode.values()].filter((l) => !byCode.has(l.code));
  if (stale.length > 0) {
    summary.warnings.push(`Removed lessons no longer in the package (learner progress cascades): ${stale.map((l) => l.code).join(", ")}`);
    const { error: d } = await db.from("lessons").delete().in("id", stale.map((l) => l.id));
    if (d) fail("lessons.delete", d);
    summary.lessons_removed = stale.length;
  }
  return byCode;
}

async function seedResources(
  db: Db,
  pkg: CoursePackage,
  courseId: string,
  moduleIds: Map<string, string>,
  lessonIds: Map<string, string>,
  summary: Summary,
): Promise<void> {
  const { error: d } = await db.from("lesson_resources").delete().eq("course_id", courseId);
  if (d) fail("lesson_resources.delete", d);

  type Row = Omit<LessonResource, "id" | "created_at">;
  const rows: Row[] = [];
  for (const m of pkg.modules) {
    const moduleId = moduleIds.get(m.code);
    if (!moduleId) continue;
    m.resources.forEach((r, ri) =>
      rows.push({ ...r, course_id: courseId, module_id: moduleId, lesson_id: null, position: ri }),
    );
    for (const l of m.lessons) {
      const lessonId = lessonIds.get(l.code);
      if (!lessonId) continue;
      l.resources.forEach((r, ri) =>
        rows.push({ ...r, course_id: courseId, module_id: null, lesson_id: lessonId, position: ri }),
      );
    }
  }
  for (const part of chunk(rows)) {
    const { error } = await db.from("lesson_resources").insert(part);
    if (error) fail("lesson_resources.insert", error);
  }
  summary.resources = rows.length;
}

async function seedActionSteps(
  db: Db,
  pkg: CoursePackage,
  courseId: string,
  lessonIds: Map<string, string>,
  summary: Summary,
): Promise<void> {
  const { data: existing, error } = await db.from("action_steps").select("id,lesson_id,source_label").eq("course_id", courseId);
  if (error) fail("action_steps.select", error);
  const prevByLesson = new Map<string, Map<string, string>>();
  for (const s of (existing ?? []) as Array<{ id: string; lesson_id: string; source_label: string }>) {
    let m = prevByLesson.get(s.lesson_id);
    if (!m) prevByLesson.set(s.lesson_id, (m = new Map()));
    m.set(s.source_label, s.id);
  }

  type Row = Omit<ActionStep, "id" | "created_at">;
  const updates: Array<Row & { id: string }> = [];
  const inserts: Row[] = [];
  const keep = new Set<string>();
  for (const m of pkg.modules) {
    for (const l of m.lessons) {
      const lessonId = lessonIds.get(l.code);
      if (!lessonId) continue;
      const prev = prevByLesson.get(lessonId) ?? new Map<string, string>();
      l.action_steps.forEach((s, si) => {
        const row: Row = { ...s, lesson_id: lessonId, course_id: courseId, position: si };
        const id = prev.get(s.source_label);
        if (id) {
          updates.push({ ...row, id });
          keep.add(id);
        } else inserts.push(row);
      });
    }
  }
  for (const part of chunk(updates)) {
    const { error: e } = await db.from("action_steps").upsert(part, { onConflict: "id" });
    if (e) fail("action_steps.upsert", e);
  }
  for (const part of chunk(inserts)) {
    const { error: e } = await db.from("action_steps").insert(part);
    if (e) fail("action_steps.insert", e);
  }
  const stale = ((existing ?? []) as Array<{ id: string }>).map((s) => s.id).filter((id) => !keep.has(id));
  if (stale.length > 0) {
    const { error: d } = await db.from("action_steps").delete().in("id", stale);
    if (d) fail("action_steps.delete", d);
  }
  summary.action_steps = updates.length + inserts.length;
  summary.action_steps_removed = stale.length;
}

async function seedQuizzes(db: Db, pkg: CoursePackage, courseId: string, summary: Summary): Promise<void> {
  const rows = pkg.quizzes.map((q) => ({ ...q, course_id: courseId }));
  if (rows.length > 0) {
    const { error } = await db.from("quiz_definitions").upsert(rows, { onConflict: "key" });
    if (error) fail("quiz_definitions.upsert", error);
  }
  summary.quizzes = rows.length;
}

async function seedForumCategories(
  db: Db,
  pkg: CoursePackage,
  courseId: string,
  moduleIds: Map<string, string>,
  summary: Summary,
): Promise<void> {
  const rows = pkg.forum_categories.map((c, i) => {
    const { module_code, ...fields } = c;
    return { ...fields, course_id: courseId, module_id: module_code ? (moduleIds.get(module_code) ?? null) : null, position: i };
  });
  if (rows.length > 0) {
    const { error } = await db.from("forum_categories").upsert(rows, { onConflict: "course_id,slug" });
    if (error) fail("forum_categories.upsert", error);
  }
  summary.forum_categories = rows.length;
}

async function seedBadges(db: Db, summary: Summary): Promise<void> {
  const { error } = await db.from("badges").upsert(BADGES, { onConflict: "key" });
  if (error) fail("badges.upsert", error);
  summary.badges = BADGES.length;
}

async function seedProducts(db: Db, courseId: string, summary: Summary): Promise<void> {
  const defs = defaultProducts(courseId);
  const { data: existing, error } = await db
    .from("products")
    .select("slug")
    .in("slug", defs.map((d) => d.slug));
  if (error) fail("products.select", error);
  const have = new Set(((existing ?? []) as Array<{ slug: string }>).map((p) => p.slug));
  const missing = defs.filter((d) => !have.has(d.slug));
  if (missing.length > 0) {
    const now = nowIso();
    const { error: e } = await db.from("products").insert(missing.map((d) => ({ ...d, created_at: now, updated_at: now })));
    if (e) fail("products.insert", e);
  }
  summary.products_created = missing.length;
  summary.products_existing = have.size;
}

async function seedSettings(db: Db, summary: Summary): Promise<void> {
  const { data: existing, error } = await db.from("site_settings").select("id,legal").eq("id", "default").maybeSingle();
  if (error) fail("site_settings.select", error);
  if (!existing) {
    const { error: e } = await db.from("site_settings").insert(defaultSettings());
    if (e) fail("site_settings.insert", e);
    summary.settings = "created";
    return;
  }
  // Fill legal slugs that are missing or still the seed.sql placeholder; never
  // touch text an admin has edited.
  const legal = { ...((existing.legal ?? {}) as Record<string, string>) };
  let changed = false;
  for (const slug of LEGAL_SLUGS) {
    const current = legal[slug];
    if (current === undefined || PLACEHOLDER_LEGAL.test(current)) {
      const fresh = legalText(slug);
      if (fresh !== current) {
        legal[slug] = fresh;
        changed = true;
      }
    }
  }
  if (changed) {
    const { error: e } = await db.from("site_settings").update({ legal, updated_at: nowIso() }).eq("id", "default");
    if (e) fail("site_settings.update", e);
    summary.settings = "patched";
  } else summary.settings = "unchanged";
}

async function uploadFiles(db: Db, files: LocalFile[], summary: Summary): Promise<void> {
  const bucket = db.storage.from("course-resources");
  for (const f of files) {
    const { error } = await bucket.upload(f.rel, fs.readFileSync(f.abs), { upsert: true, contentType: contentTypeFor(f.abs) });
    if (error) fail(`storage.upload ${f.rel}`, error as DbError);
    summary.files_uploaded += 1;
    process.stdout.write(`  uploaded ${f.rel} (${f.size} bytes)\n`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function crossCheckFiles(pkg: CoursePackage, files: LocalFile[], warnings: string[]): void {
  const onDisk = new Set(files.map((f) => f.rel));
  const wanted = packageResourcePaths(pkg);
  const missing = wanted.filter((p) => !onDisk.has(p));
  if (missing.length > 0) {
    warnings.push(`${missing.length} resource path(s) in the package have no file on disk (not uploaded): ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""}`);
  }
  const prefix = `${pkg.course.slug}/`;
  const unreferenced = files.filter((f) => f.rel.startsWith(prefix) && !wanted.includes(f.rel));
  if (unreferenced.length > 0) {
    warnings.push(`${unreferenced.length} file(s) on disk are not referenced by the package (uploaded anyway): ${unreferenced.slice(0, 5).map((f) => f.rel).join(", ")}${unreferenced.length > 5 ? ", …" : ""}`);
  }
}

function printPlan(args: Args, pkg: CoursePackage, files: LocalFile[], warnings: string[]): void {
  const lessons = pkg.modules.reduce((a, m) => a + m.lessons.length, 0);
  const steps = pkg.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.action_steps.length, 0), 0);
  const resources = pkg.modules.reduce((a, m) => a + m.resources.length + m.lessons.reduce((b, l) => b + l.resources.length, 0), 0);
  console.log(`Package: ${args.file}`);
  console.log(`Course:  ${pkg.course.title} (slug ${pkg.course.slug}, status ${args.status ?? pkg.course.status}${args.status ? " via --status" : ""})`);
  console.log(`Plan:    ${pkg.modules.length} modules, ${lessons} lessons, ${resources} resources, ${steps} action steps, ${pkg.quizzes.length} quizzes, ${pkg.forum_categories.length} forum categories`);
  console.log(`         ${BADGES.length} badges, ${args.skipProducts ? "products skipped" : "4 products (if missing)"}, site_settings default row`);
  console.log(`Files:   ${args.skipFiles ? "skipped" : `${files.length} file(s) under ${args.resourcesDir} → bucket course-resources`}`);
  for (const w of warnings) console.log(`warning: ${w}`);
}

function printSummary(s: Summary): void {
  console.log("\nSeed summary");
  console.log(`  course            ${s.course} (${s.course_id})`);
  console.log(`  modules           ${s.modules} upserted${s.modules_removed ? `, ${s.modules_removed} removed` : ""}`);
  console.log(`  lessons           ${s.lessons} upserted${s.lessons_removed ? `, ${s.lessons_removed} removed` : ""}`);
  console.log(`  lesson_resources  ${s.resources} replaced`);
  console.log(`  action_steps      ${s.action_steps} upserted${s.action_steps_removed ? `, ${s.action_steps_removed} removed` : ""}`);
  console.log(`  quiz_definitions  ${s.quizzes} upserted`);
  console.log(`  forum_categories  ${s.forum_categories} upserted`);
  console.log(`  badges            ${s.badges} upserted`);
  console.log(`  products          ${s.products_created} created, ${s.products_existing} already present`);
  console.log(`  site_settings     ${s.settings}`);
  console.log(`  files             ${s.files_uploaded} uploaded${s.files_skipped ? `, ${s.files_skipped} skipped` : ""}`);
  for (const w of s.warnings) console.log(`  warning: ${w}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  loadEnvFiles();
  const pkg = loadPackage(args.file);
  const files = args.skipFiles ? [] : walkFiles(args.resourcesDir);
  const warnings: string[] = [];
  if (!args.skipFiles) crossCheckFiles(pkg, files, warnings);
  printPlan(args, pkg, files, warnings);

  if (args.dryRun) {
    console.log("\n--dry-run: nothing written.");
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (set them in .env.local). Use --dry-run to preview.");
  }
  const db: Db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "X-Client-Info": "cyc-academy-seed" } },
  });

  const summary: Summary = {
    course: "updated",
    course_id: "",
    modules: 0,
    modules_removed: 0,
    lessons: 0,
    lessons_removed: 0,
    resources: 0,
    action_steps: 0,
    action_steps_removed: 0,
    quizzes: 0,
    forum_categories: 0,
    badges: 0,
    products_created: 0,
    products_existing: 0,
    settings: "unchanged",
    files_uploaded: 0,
    files_skipped: args.skipFiles ? 1 : 0,
    warnings,
  };

  console.log(`\nSeeding ${url} …`);
  const course = await seedCourse(db, pkg, args.status);
  summary.course = course.created ? "created" : "updated";
  summary.course_id = course.id;
  const moduleIds = await seedModules(db, pkg, course.id, summary);
  const lessonIds = await seedLessons(db, pkg, course.id, moduleIds, summary);
  await seedResources(db, pkg, course.id, moduleIds, lessonIds, summary);
  await seedActionSteps(db, pkg, course.id, lessonIds, summary);
  await seedQuizzes(db, pkg, course.id, summary);
  await seedForumCategories(db, pkg, course.id, moduleIds, summary);
  await seedBadges(db, summary);
  if (!args.skipProducts) await seedProducts(db, course.id, summary);
  await seedSettings(db, summary);
  if (!args.skipFiles) {
    console.log(`\nUploading ${files.length} file(s) to course-resources …`);
    await uploadFiles(db, files, summary);
  }
  printSummary(summary);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
