import "server-only";
import { getServices } from "@/services";
import type { DataStore } from "@/services/types";
import type {
  ActionLink,
  ActionStep,
  ActionStepKind,
  Course,
  CoursePackage,
  CourseStatus,
  Lesson,
  LessonResource,
  LessonStatus,
  Module,
  ModuleKind,
  ResourceType,
  UploadType,
} from "@/lib/types";
import { newId, nowIso, slugify } from "@/lib/utils";
import { getCourseTree } from "./catalog";
import { logAudit } from "./users";
import { guessType, storeCourseFile, storePublicAsset, validateUpload } from "./uploads";

/**
 * Admin courses CMS: the application API behind /admin/courses. Every mutation
 * re-reads what it touches, cascades deletes explicitly (the data store has no
 * foreign keys in mock mode) and writes an audit_log row.
 *
 * Pure helpers used by the client (filename matching, reordering) live in
 * src/components/admin/** so they can be imported from Client Components.
 */

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** A validation or state problem the admin can act on; actions show `message` inline. */
export class AdminCourseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminCourseError";
  }
}

function fail(message: string): never {
  throw new AdminCourseError(message);
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export interface AdminCourseRow {
  course: Course;
  module_count: number;
  lesson_count: number;
  enrolled: number;
}

export async function listCoursesForAdmin(): Promise<AdminCourseRow[]> {
  const { db } = await getServices();
  const [courses, modules, lessons, enrollments] = await Promise.all([
    db.from("courses").list({ orderBy: ["created_at", "asc"] }),
    db.from("modules").list(),
    db.from("lessons").list(),
    db.from("enrollments").list({ where: { status: "active" } }),
  ]);
  return courses.map((course) => ({
    course,
    module_count: modules.filter((m) => m.course_id === course.id).length,
    lesson_count: lessons.filter((l) => l.course_id === course.id).length,
    enrolled: new Set(enrollments.filter((e) => e.course_id === course.id).map((e) => e.user_id)).size,
  }));
}

/** Distinct learners with an active enrollment on the course. */
export async function enrolledCount(courseId: string): Promise<number> {
  const { db } = await getServices();
  const rows = await db.from("enrollments").list({ where: { course_id: courseId, status: "active" } });
  return new Set(rows.map((e) => e.user_id)).size;
}

/** Full tree including drafts, for the CMS. */
export async function getCourseTreeForAdmin(courseId: string) {
  return getCourseTree(courseId, { includeDrafts: true });
}

export async function getLessonForAdmin(lessonId: string): Promise<{ course: Course; module: Module; lesson: Lesson; resources: LessonResource[]; steps: ActionStep[] } | null> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) return null;
  const [course, mod, resources, steps] = await Promise.all([
    db.from("courses").get(lesson.course_id),
    db.from("modules").get(lesson.module_id),
    db.from("lesson_resources").list({ where: { lesson_id: lessonId }, orderBy: ["position", "asc"] }),
    db.from("action_steps").list({ where: { lesson_id: lessonId }, orderBy: ["position", "asc"] }),
  ]);
  if (!course || !mod) return null;
  return { course, module: mod, lesson, resources, steps };
}

export async function listQuizKeys(courseId: string): Promise<Array<{ key: string; title: string }>> {
  const { db } = await getServices();
  const all = await db.from("quiz_definitions").list();
  return all.filter((q) => q.course_id === courseId || q.course_id === null).map((q) => ({ key: q.key, title: q.title }));
}

/**
 * The installed course as a CoursePackage (ids stripped), so the importer can
 * diff an incoming package against what is live.
 */
export async function exportCoursePackage(courseId: string): Promise<CoursePackage | null> {
  const { db } = await getServices();
  const tree = await getCourseTree(courseId, { includeDrafts: true });
  if (!tree) return null;
  const [quizzes, categories] = await Promise.all([
    db.from("quiz_definitions").list({ where: { course_id: courseId } }),
    db.from("forum_categories").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
  ]);
  const moduleCodeById = new Map(tree.modules.map((m) => [m.id, m.code]));
  const stripResource = (r: LessonResource) => ({ file_path: r.file_path, label: r.label, file_name: r.file_name, type: r.type, size_bytes: r.size_bytes, position: r.position });
  const xp_by_module: Record<string, number> = {};
  let transcript_count = 0;
  let total_video_sec = 0;
  let lesson_count = 0;
  const files = new Set<string>();
  const modules: CoursePackage["modules"] = tree.modules.map((m) => {
    let xp = m.completion_xp;
    for (const l of m.lessons) {
      lesson_count += 1;
      total_video_sec += l.duration_sec;
      if (l.transcript.trim()) transcript_count += 1;
      for (const r of l.resources) files.add(r.file_path);
      for (const s of l.action_steps) xp += s.xp;
    }
    for (const r of m.resources) files.add(r.file_path);
    xp_by_module[m.code] = xp;
    return {
      code: m.code,
      kind: m.kind,
      title: m.title,
      description: m.description,
      notes: m.notes,
      position: m.position,
      drip_days: m.drip_days,
      completion_xp: m.completion_xp,
      header_image_path: m.header_image_path,
      illustration: m.illustration,
      required_for_certificate: m.required_for_certificate,
      resources: m.resources.map(stripResource),
      lessons: m.lessons.map((l) => ({
        code: l.code,
        title: l.title,
        series: l.series,
        description: l.description,
        notes: l.notes,
        planned_video_filename: l.planned_video_filename,
        video_provider: l.video_provider,
        video_asset_id: l.video_asset_id,
        video_playback_id: l.video_playback_id,
        video_url: l.video_url,
        captions_path: l.captions_path,
        thumbnail_path: l.thumbnail_path,
        duration_sec: l.duration_sec,
        transcript: l.transcript,
        transcript_source_file: l.transcript_source_file,
        audio_slots: l.audio_slots,
        is_preview: l.is_preview,
        is_intro: l.is_intro,
        position: l.position,
        drip_days_override: l.drip_days_override,
        status: l.status,
        publish_at: l.publish_at,
        doctor_callout: l.doctor_callout,
        quiz_key: l.quiz_key,
        resources: l.resources.map(stripResource),
        action_steps: l.action_steps.map((s) => ({
          label: s.label,
          source_label: s.source_label,
          kind: s.kind,
          xp: s.xp,
          requires_upload: s.requires_upload,
          upload_type: s.upload_type,
          link: s.link,
          position: s.position,
          sub_items: s.sub_items,
        })),
      })),
    };
  });
  const c = tree.course;
  return {
    version: 1,
    generated_at: c.updated_at,
    source: { zip: null, sheet: "installed" },
    course: {
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      short_description: c.short_description,
      thumbnail_path: c.thumbnail_path,
      illustration: c.illustration,
      status: c.status,
      publish_at: c.publish_at,
      level: c.level,
      language: c.language,
      topics: c.topics,
      badge: c.badge,
      partner_seat_enabled: c.partner_seat_enabled,
      certificate_enabled: c.certificate_enabled,
      lifetime_access: c.lifetime_access,
      access_days: c.access_days,
      what_you_learn: c.what_you_learn,
      requirements: c.requirements,
      who_for: c.who_for,
      faq: c.faq,
      duration_weeks: c.duration_weeks,
    },
    modules,
    quizzes: quizzes.map((q) => ({ key: q.key, title: q.title, intro: q.intro, questions: q.questions, scoring: q.scoring, confirmation: q.confirmation, source_file: q.source_file })),
    forum_categories: categories.map((cat) => ({
      slug: cat.slug,
      title: cat.title,
      description: cat.description,
      position: cat.position,
      module_code: cat.module_id ? (moduleCodeById.get(cat.module_id) ?? null) : null,
    })),
    stats: {
      lesson_count,
      resource_count: files.size,
      transcript_count,
      total_video_sec,
      total_xp: Object.values(xp_by_module).reduce((a, b) => a + b, 0),
      xp_by_module,
    },
  };
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export type CourseInput = Omit<Course, "id" | "created_at" | "updated_at" | "last_updated_at" | "thumbnail_path"> & { thumbnail_path?: string | null };

async function assertSlugFree(db: DataStore, slug: string, exceptId: string | null) {
  const existing = await db.from("courses").findOne({ slug });
  if (existing && existing.id !== exceptId) fail(`The slug "${slug}" is already used by “${existing.title}”. Please choose another.`);
}

export async function createCourse(actorId: string, input: CourseInput): Promise<Course> {
  const { db } = await getServices();
  const slug = slugify(input.slug || input.title);
  if (!slug) fail("Please give the course a slug.");
  await assertSlugFree(db, slug, null);
  const now = nowIso();
  const course = await db.from("courses").insert({
    ...input,
    slug,
    thumbnail_path: input.thumbnail_path ?? null,
    id: newId(),
    last_updated_at: now,
    created_at: now,
    updated_at: now,
  });
  await logAudit(actorId, "course.created", "course", course.id, { slug: course.slug, title: course.title });
  return course;
}

export async function updateCourse(actorId: string, courseId: string, patch: Partial<CourseInput>): Promise<Course> {
  const { db } = await getServices();
  const existing = await db.from("courses").get(courseId);
  if (!existing) fail("That course no longer exists.");
  const next: Partial<Course> = { ...patch };
  if (patch.slug !== undefined) {
    const slug = slugify(patch.slug);
    if (!slug) fail("Please give the course a slug.");
    await assertSlugFree(db, slug, courseId);
    next.slug = slug;
  }
  const now = nowIso();
  const course = await db.from("courses").update(courseId, { ...next, last_updated_at: now, updated_at: now });
  await logAudit(actorId, "course.updated", "course", courseId, { fields: Object.keys(patch) });
  return course;
}

export async function setCourseThumbnail(actorId: string, courseId: string, file: File): Promise<Course> {
  const { db } = await getServices();
  const course = await db.from("courses").get(courseId);
  if (!course) fail("That course no longer exists.");
  const stored = await storePublicAsset("thumbnails", file, "image");
  const updated = await db.from("courses").update(courseId, { thumbnail_path: stored.path, updated_at: nowIso() });
  await logAudit(actorId, "course.thumbnail", "course", courseId, { path: stored.path });
  return updated;
}

export async function clearCourseThumbnail(actorId: string, courseId: string): Promise<void> {
  const { db } = await getServices();
  await db.from("courses").update(courseId, { thumbnail_path: null, updated_at: nowIso() });
  await logAudit(actorId, "course.thumbnail_removed", "course", courseId);
}

export type DeleteCourseResult = { ok: true } | { ok: false; error: string; enrolled: number };

/**
 * Deletes a course and everything under it. Refuses when learners hold an
 * active enrollment unless `force` is set — then enrollments, progress and XP
 * for the course go too. Certificates and orders are kept for the record.
 */
export async function deleteCourse(actorId: string, courseId: string, opts: { force?: boolean } = {}): Promise<DeleteCourseResult> {
  const { db } = await getServices();
  const course = await db.from("courses").get(courseId);
  if (!course) return { ok: false, error: "That course no longer exists.", enrolled: 0 };
  const enrolled = await enrolledCount(courseId);
  if (enrolled > 0 && !opts.force) {
    return { ok: false, error: `${enrolled} ${enrolled === 1 ? "learner has" : "learners have"} an active enrollment on this course. Archive it instead, or confirm a forced delete.`, enrolled };
  }
  await db.transaction(async (tx) => {
    const where = { course_id: courseId };
    await tx.from("action_step_completions").deleteWhere(where);
    await tx.from("lesson_progress").deleteWhere(where);
    await tx.from("notes").deleteWhere(where);
    await tx.from("action_steps").deleteWhere(where);
    await tx.from("lesson_resources").deleteWhere(where);
    await tx.from("lessons").deleteWhere(where);
    await tx.from("modules").deleteWhere(where);
    await tx.from("quiz_definitions").deleteWhere(where);
    await tx.from("quiz_responses").deleteWhere(where);
    const posts = await tx.from("forum_posts").list({ where });
    for (const p of posts) {
      await tx.from("forum_replies").deleteWhere({ post_id: p.id });
      await tx.from("forum_likes").deleteWhere({ post_id: p.id });
      await tx.from("forum_reports").deleteWhere({ post_id: p.id });
    }
    await tx.from("forum_posts").deleteWhere(where);
    await tx.from("forum_categories").deleteWhere(where);
    await tx.from("partner_links").deleteWhere(where);
    await tx.from("enrollments").deleteWhere(where);
    await tx.from("xp_ledger").deleteWhere(where);
    await tx.from("user_badges").deleteWhere(where);
    await tx.from("courses").delete(courseId);
  });
  await logAudit(actorId, "course.deleted", "course", courseId, { slug: course.slug, title: course.title, forced: enrolled > 0, enrolled });
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------

export interface ModuleInput {
  code: string;
  kind: ModuleKind;
  title: string;
  description: string;
  notes: string;
  drip_days: number;
  completion_xp: number;
  required_for_certificate: boolean;
  illustration: string | null;
}

export function normaliseCode(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "");
}

/** Next free module code for a course: M<n> after the highest existing M<n>. */
export function suggestModuleCode(existing: Array<Pick<Module, "code">>): string {
  let max = -1;
  for (const m of existing) {
    const match = /^M(\d+)$/.exec(m.code);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `M${max + 1}`;
}

/** Next free lesson code inside a module: <MODULE>T<n>. */
export function suggestLessonCode(moduleCode: string, existing: Array<Pick<Lesson, "code">>): string {
  const prefix = `${moduleCode}_T`;
  let max = 0;
  for (const l of existing) {
    const plain = new RegExp(`^${moduleCode}T(\\d+)[a-z]?$`).exec(l.code);
    const underscore = new RegExp(`^${moduleCode}_T(\\d+)[a-z]?$`).exec(l.code);
    const n = plain?.[1] ?? underscore?.[1];
    if (n) max = Math.max(max, Number(n));
  }
  const usesUnderscore = existing.some((l) => l.code.startsWith(prefix));
  return `${moduleCode}${usesUnderscore ? "_T" : "T"}${max + 1}`;
}

export async function createModule(actorId: string, courseId: string, input: ModuleInput): Promise<Module> {
  const { db } = await getServices();
  const course = await db.from("courses").get(courseId);
  if (!course) fail("That course no longer exists.");
  const code = normaliseCode(input.code);
  if (!code) fail("Please give the module a code, e.g. M8.");
  const existing = await db.from("modules").list({ where: { course_id: courseId } });
  if (existing.some((m) => m.code === code)) fail(`A module with the code ${code} already exists.`);
  if (!input.title.trim()) fail("Please give the module a title.");
  const now = nowIso();
  const row = await db.from("modules").insert({
    id: newId(),
    course_id: courseId,
    code,
    kind: input.kind,
    title: input.title.trim(),
    description: input.description,
    notes: input.notes,
    position: existing.length,
    drip_days: Math.max(0, Math.round(input.drip_days)),
    completion_xp: Math.max(0, Math.round(input.completion_xp)),
    header_image_path: null,
    illustration: input.illustration,
    required_for_certificate: input.required_for_certificate,
    created_at: now,
    updated_at: now,
  });
  await touchCourse(db, courseId);
  await logAudit(actorId, "module.created", "module", row.id, { course_id: courseId, code });
  return row;
}

export async function updateModule(actorId: string, moduleId: string, patch: Partial<ModuleInput>): Promise<Module> {
  const { db } = await getServices();
  const mod = await db.from("modules").get(moduleId);
  if (!mod) fail("That module no longer exists.");
  const next: Partial<Module> = { ...patch };
  if (patch.code !== undefined) {
    const code = normaliseCode(patch.code);
    if (!code) fail("Please give the module a code.");
    const siblings = await db.from("modules").list({ where: { course_id: mod.course_id } });
    if (siblings.some((m) => m.id !== moduleId && m.code === code)) fail(`A module with the code ${code} already exists.`);
    next.code = code;
  }
  if (patch.title !== undefined && !patch.title.trim()) fail("Please give the module a title.");
  if (patch.drip_days !== undefined) next.drip_days = Math.max(0, Math.round(patch.drip_days));
  if (patch.completion_xp !== undefined) next.completion_xp = Math.max(0, Math.round(patch.completion_xp));
  const row = await db.from("modules").update(moduleId, { ...next, updated_at: nowIso() });
  await touchCourse(db, mod.course_id);
  await logAudit(actorId, "module.updated", "module", moduleId, { fields: Object.keys(patch) });
  return row;
}

export async function deleteModule(actorId: string, moduleId: string): Promise<void> {
  const { db } = await getServices();
  const mod = await db.from("modules").get(moduleId);
  if (!mod) fail("That module no longer exists.");
  const lessons = await db.from("lessons").list({ where: { module_id: moduleId } });
  await db.transaction(async (tx) => {
    for (const l of lessons) await cascadeDeleteLesson(tx, l);
    await tx.from("lesson_resources").deleteWhere({ module_id: moduleId });
    await tx.from("forum_categories").updateWhere({ module_id: moduleId }, { module_id: null });
    await tx.from("modules").delete(moduleId);
    await renumber(tx, "modules", { course_id: mod.course_id });
  });
  await touchCourse(db, mod.course_id);
  await logAudit(actorId, "module.deleted", "module", moduleId, { course_id: mod.course_id, code: mod.code, lessons: lessons.length });
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export interface LessonInput {
  code: string;
  title: string;
  series: string | null;
  description: string;
  notes: string;
  planned_video_filename: string | null;
  duration_sec: number;
  transcript: string;
  is_preview: boolean;
  is_intro: boolean;
  drip_days_override: number | null;
  status: LessonStatus;
  publish_at: string | null;
  doctor_callout: boolean;
  quiz_key: string | null;
}

export async function createLesson(actorId: string, moduleId: string, input: Pick<LessonInput, "title" | "code"> & Partial<LessonInput>): Promise<Lesson> {
  const { db } = await getServices();
  const mod = await db.from("modules").get(moduleId);
  if (!mod) fail("That module no longer exists.");
  const code = normaliseCode(input.code);
  if (!code) fail("Please give the lesson a code, e.g. M1T7.");
  const courseLessons = await db.from("lessons").list({ where: { course_id: mod.course_id } });
  if (courseLessons.some((l) => l.code === code)) fail(`A lesson with the code ${code} already exists in this course.`);
  if (!input.title.trim()) fail("Please give the lesson a title.");
  const siblings = courseLessons.filter((l) => l.module_id === moduleId);
  const now = nowIso();
  const row = await db.from("lessons").insert({
    id: newId(),
    module_id: moduleId,
    course_id: mod.course_id,
    code,
    title: input.title.trim(),
    series: input.series ?? null,
    description: input.description ?? "",
    notes: input.notes ?? "",
    planned_video_filename: input.planned_video_filename ?? null,
    video_provider: "none",
    video_asset_id: null,
    video_playback_id: null,
    video_url: null,
    captions_path: null,
    thumbnail_path: null,
    duration_sec: Math.max(0, Math.round(input.duration_sec ?? 0)),
    transcript: input.transcript ?? "",
    transcript_source_file: null,
    audio_slots: [],
    is_preview: input.is_preview ?? false,
    is_intro: input.is_intro ?? false,
    position: siblings.length,
    drip_days_override: input.drip_days_override ?? null,
    status: input.status ?? "draft",
    publish_at: input.publish_at ?? null,
    doctor_callout: input.doctor_callout ?? false,
    quiz_key: input.quiz_key ?? null,
    created_at: now,
    updated_at: now,
  });
  await touchCourse(db, module.course_id);
  await logAudit(actorId, "lesson.created", "lesson", row.id, { course_id: module.course_id, module_id: moduleId, code });
  return row;
}

export async function updateLesson(actorId: string, lessonId: string, patch: Partial<LessonInput>): Promise<Lesson> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) fail("That lesson no longer exists.");
  const next: Partial<Lesson> = { ...patch };
  if (patch.code !== undefined) {
    const code = normaliseCode(patch.code);
    if (!code) fail("Please give the lesson a code.");
    const courseLessons = await db.from("lessons").list({ where: { course_id: lesson.course_id } });
    if (courseLessons.some((l) => l.id !== lessonId && l.code === code)) fail(`A lesson with the code ${code} already exists in this course.`);
    next.code = code;
  }
  if (patch.title !== undefined) {
    if (!patch.title.trim()) fail("Please give the lesson a title.");
    next.title = patch.title.trim();
  }
  if (patch.duration_sec !== undefined) next.duration_sec = Math.max(0, Math.round(patch.duration_sec));
  if (patch.drip_days_override !== undefined && patch.drip_days_override !== null) next.drip_days_override = Math.max(0, Math.round(patch.drip_days_override));
  const row = await db.from("lessons").update(lessonId, { ...next, updated_at: nowIso() });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.updated", "lesson", lessonId, { fields: Object.keys(patch) });
  return row;
}

/** Removes a lesson with its resources, action steps, progress, completions and notes. */
export async function deleteLesson(actorId: string, lessonId: string): Promise<void> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) fail("That lesson no longer exists.");
  await db.transaction(async (tx) => {
    await cascadeDeleteLesson(tx, lesson);
    await renumber(tx, "lessons", { module_id: lesson.module_id });
  });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.deleted", "lesson", lessonId, { course_id: lesson.course_id, code: lesson.code });
}

async function cascadeDeleteLesson(tx: DataStore, lesson: Lesson) {
  const where = { lesson_id: lesson.id };
  await tx.from("action_step_completions").deleteWhere(where);
  await tx.from("lesson_progress").deleteWhere(where);
  await tx.from("notes").deleteWhere(where);
  await tx.from("action_steps").deleteWhere(where);
  await tx.from("lesson_resources").deleteWhere(where);
  await tx.from("forum_posts").updateWhere(where, { lesson_id: null });
  await tx.from("lessons").delete(lesson.id);
}

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------

export interface CurriculumOrder {
  module_id: string;
  lesson_ids: string[];
}

/**
 * Persists a drag-and-drop result: module order and, per module, the lesson
 * order. Lessons may move between modules. Ids not mentioned keep their
 * relative order after the mentioned ones.
 */
export async function reorderCurriculum(actorId: string, courseId: string, order: CurriculumOrder[]): Promise<void> {
  const { db } = await getServices();
  const [modules, lessons] = await Promise.all([
    db.from("modules").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
    db.from("lessons").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
  ]);
  const moduleIds = new Set(modules.map((m) => m.id));
  const lessonById = new Map(lessons.map((l) => [l.id, l]));
  const now = nowIso();
  await db.transaction(async (tx) => {
    const orderedModules = [...order.map((o) => o.module_id).filter((id) => moduleIds.has(id)), ...modules.map((m) => m.id).filter((id) => !order.some((o) => o.module_id === id))];
    for (const [i, id] of orderedModules.entries()) {
      const m = modules.find((x) => x.id === id)!;
      if (m.position !== i) await tx.from("modules").update(id, { position: i, updated_at: now });
    }
    const placed = new Set<string>();
    for (const o of order) {
      if (!moduleIds.has(o.module_id)) continue;
      let pos = 0;
      for (const lid of o.lesson_ids) {
        const l = lessonById.get(lid);
        if (!l || placed.has(lid)) continue;
        placed.add(lid);
        if (l.module_id !== o.module_id || l.position !== pos) await tx.from("lessons").update(lid, { module_id: o.module_id, position: pos, updated_at: now });
        pos += 1;
      }
      // Lessons of this module that the client did not mention keep their order after the placed ones.
      for (const l of lessons.filter((x) => x.module_id === o.module_id && !placed.has(x.id))) {
        placed.add(l.id);
        if (l.position !== pos) await tx.from("lessons").update(l.id, { position: pos, updated_at: now });
        pos += 1;
      }
    }
  });
  await touchCourse(db, courseId);
  await logAudit(actorId, "course.reordered", "course", courseId, { modules: order.length });
}

async function renumber(tx: DataStore, table: "modules" | "lessons" | "lesson_resources" | "action_steps", where: Record<string, string>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repo = tx.from(table) as any;
  const rows: Array<{ id: string; position: number }> = await repo.list({ where, orderBy: ["position", "asc"] });
  for (const [i, r] of rows.entries()) if (r.position !== i) await repo.update(r.id, { position: i });
}

async function reorderWithin(table: "lesson_resources" | "action_steps", where: Record<string, string>, orderedIds: string[]) {
  const { db } = await getServices();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repo = db.from(table) as any;
  const rows: Array<{ id: string; position: number }> = await repo.list({ where, orderBy: ["position", "asc"] });
  const ids = [...orderedIds.filter((id) => rows.some((r) => r.id === id)), ...rows.map((r) => r.id).filter((id) => !orderedIds.includes(id))];
  for (const [i, id] of ids.entries()) {
    const r = rows.find((x) => x.id === id)!;
    if (r.position !== i) await repo.update(id, { position: i });
  }
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export function resourceTypeFor(fileName: string): ResourceType {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "xlsx" || ext === "xls" || ext === "csv") return "xlsx";
  if (ext === "mp3" || ext === "m4a" || ext === "wav") return "mp3";
  if (ext === "docx" || ext === "doc") return "docx";
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return "image";
  return "other";
}

export async function addLessonResource(actorId: string, lessonId: string, file: File, label?: string): Promise<LessonResource> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) fail("That lesson no longer exists.");
  const course = await db.from("courses").get(lesson.course_id);
  if (!course) fail("That course no longer exists.");
  const stored = await storeCourseFile(course.slug, `resources/${lesson.code}`, file, "resource");
  const existing = await db.from("lesson_resources").list({ where: { lesson_id: lessonId } });
  const row = await db.from("lesson_resources").insert({
    id: newId(),
    course_id: lesson.course_id,
    lesson_id: lessonId,
    module_id: null,
    file_path: stored.path,
    label: (label ?? "").trim() || file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
    file_name: file.name,
    type: resourceTypeFor(file.name),
    size_bytes: stored.size,
    position: existing.length,
    created_at: nowIso(),
  });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "resource.added", "lesson_resource", row.id, { lesson_id: lessonId, path: stored.path });
  return row;
}

export async function renameResource(actorId: string, resourceId: string, label: string): Promise<LessonResource> {
  const { db } = await getServices();
  const res = await db.from("lesson_resources").get(resourceId);
  if (!res) fail("That resource no longer exists.");
  const clean = label.trim();
  if (!clean) fail("Please give the resource a label.");
  const row = await db.from("lesson_resources").update(resourceId, { label: clean });
  await logAudit(actorId, "resource.renamed", "lesson_resource", resourceId, { label: clean });
  return row;
}

/** Deletes the row and, when no other row shares the file, the stored file. */
export async function deleteResource(actorId: string, resourceId: string): Promise<void> {
  const { db, storage } = await getServices();
  const res = await db.from("lesson_resources").get(resourceId);
  if (!res) fail("That resource no longer exists.");
  await db.from("lesson_resources").delete(resourceId);
  const others = await db.from("lesson_resources").count({ file_path: res.file_path });
  if (others === 0) {
    try {
      await storage.delete({ bucket: "course-resources", path: res.file_path });
    } catch (err) {
      console.warn("[admin-courses] could not delete file", res.file_path, err);
    }
  }
  if (res.lesson_id) await db.transaction((tx) => renumber(tx, "lesson_resources", { lesson_id: res.lesson_id! }));
  await logAudit(actorId, "resource.deleted", "lesson_resource", resourceId, { path: res.file_path, file_removed: others === 0 });
}

export async function reorderResources(actorId: string, lessonId: string, orderedIds: string[]): Promise<void> {
  await reorderWithin("lesson_resources", { lesson_id: lessonId }, orderedIds);
  await logAudit(actorId, "resource.reordered", "lesson", lessonId, { count: orderedIds.length });
}

// ---------------------------------------------------------------------------
// Action steps
// ---------------------------------------------------------------------------

export interface ActionStepInput {
  label: string;
  kind: ActionStepKind;
  xp: number;
  requires_upload: boolean;
  upload_type: UploadType | null;
  link: ActionLink;
  sub_items: Array<{ key: string; label: string; xp: number }> | null;
}

function cleanStep(input: ActionStepInput): ActionStepInput {
  const label = input.label.trim();
  if (!label) fail("Please give the action step a label.");
  const sub_items = input.sub_items?.length
    ? input.sub_items
        .map((s, i) => ({ key: slugify(s.key || s.label).slice(0, 40) || `item-${i + 1}`, label: s.label.trim(), xp: Math.max(0, Math.round(s.xp)) }))
        .filter((s) => s.label)
    : null;
  const requires_upload = input.requires_upload || input.link.type === "upload";
  return {
    label,
    kind: input.kind,
    xp: Math.max(0, Math.round(input.xp)),
    requires_upload,
    upload_type: requires_upload ? (input.link.type === "upload" ? input.link.upload_type : (input.upload_type ?? "any")) : null,
    link: input.link,
    sub_items,
  };
}

export async function createActionStep(actorId: string, lessonId: string, input: ActionStepInput): Promise<ActionStep> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) fail("That lesson no longer exists.");
  const clean = cleanStep(input);
  const existing = await db.from("action_steps").list({ where: { lesson_id: lessonId } });
  const row = await db.from("action_steps").insert({
    ...clean,
    id: newId(),
    lesson_id: lessonId,
    course_id: lesson.course_id,
    source_label: clean.label,
    position: existing.length,
    created_at: nowIso(),
  });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "action_step.created", "action_step", row.id, { lesson_id: lessonId, xp: row.xp });
  return row;
}

export async function updateActionStep(actorId: string, stepId: string, input: ActionStepInput): Promise<ActionStep> {
  const { db } = await getServices();
  const step = await db.from("action_steps").get(stepId);
  if (!step) fail("That action step no longer exists.");
  const clean = cleanStep(input);
  const row = await db.from("action_steps").update(stepId, clean);
  await touchCourse(db, step.course_id);
  await logAudit(actorId, "action_step.updated", "action_step", stepId, { xp: row.xp });
  return row;
}

/** Deletes the step and every learner completion of it (XP already in the ledger stays). */
export async function deleteActionStep(actorId: string, stepId: string): Promise<void> {
  const { db } = await getServices();
  const step = await db.from("action_steps").get(stepId);
  if (!step) fail("That action step no longer exists.");
  await db.transaction(async (tx) => {
    await tx.from("action_step_completions").deleteWhere({ step_id: stepId });
    await tx.from("action_steps").delete(stepId);
    await renumber(tx, "action_steps", { lesson_id: step.lesson_id });
  });
  await touchCourse(db, step.course_id);
  await logAudit(actorId, "action_step.deleted", "action_step", stepId, { lesson_id: step.lesson_id });
}

export async function reorderActionSteps(actorId: string, lessonId: string, orderedIds: string[]): Promise<void> {
  await reorderWithin("action_steps", { lesson_id: lessonId }, orderedIds);
  await logAudit(actorId, "action_step.reordered", "lesson", lessonId, { count: orderedIds.length });
}

// ---------------------------------------------------------------------------
// Lesson media
// ---------------------------------------------------------------------------

async function requireLessonWithCourse(lessonId: string): Promise<{ lesson: Lesson; course: Course }> {
  const { db } = await getServices();
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) fail("That lesson no longer exists.");
  const course = await db.from("courses").get(lesson.course_id);
  if (!course) fail("That course no longer exists.");
  return { lesson, course };
}

/** Mock/self-hosted mode: a multipart upload stored in the video-uploads bucket. */
export async function storeLessonVideo(actorId: string, lessonId: string, file: File): Promise<Lesson> {
  const { db, video } = await getServices();
  const { lesson, course } = await requireLessonWithCourse(lessonId);
  const stored = await storeCourseFile(course.slug, "videos", file, "video");
  if (lesson.video_provider === "mux" && lesson.video_asset_id) {
    try {
      await video.deleteAsset(lesson.video_asset_id);
    } catch (err) {
      console.warn("[admin-courses] could not delete previous Mux asset", err);
    }
  }
  const row = await db.from("lessons").update(lessonId, {
    video_provider: "url",
    video_url: stored.path,
    video_asset_id: null,
    video_playback_id: null,
    planned_video_filename: lesson.planned_video_filename ?? file.name,
    updated_at: nowIso(),
  });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.video_uploaded", "lesson", lessonId, { path: stored.path, size: stored.size });
  return row;
}

/** Mux mode: creates a direct upload; the client PUTs the file to `upload_url`. */
export async function prepareVideoUpload(actorId: string, lessonId: string, filename: string, corsOrigin: string): Promise<{ mode: "mux" | "mock"; upload_url: string; upload_id: string }> {
  const { video } = await getServices();
  await requireLessonWithCourse(lessonId);
  const result = await video.createDirectUpload({ lesson_id: lessonId, filename, cors_origin: corsOrigin });
  await logAudit(actorId, "lesson.video_upload_prepared", "lesson", lessonId, { provider: video.kind, upload_id: result.upload_id });
  return { mode: video.kind === "mux" ? "mux" : "mock", ...result };
}

/** Mux mode: after the PUT succeeds, remember the upload id until the webhook flips it to ready. */
export async function markVideoUploadPending(actorId: string, lessonId: string, uploadId: string): Promise<Lesson> {
  const { db } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  const row = await db.from("lessons").update(lessonId, {
    video_provider: "mux",
    video_asset_id: uploadId,
    video_playback_id: null,
    video_url: null,
    updated_at: nowIso(),
  });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.video_pending", "lesson", lessonId, { upload_id: uploadId });
  return row;
}

export async function removeLessonVideo(actorId: string, lessonId: string): Promise<Lesson> {
  const { db, storage, video } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  if (lesson.video_provider === "url" && lesson.video_url && !/^https?:\/\//i.test(lesson.video_url)) {
    try {
      await storage.delete({ bucket: "video-uploads", path: lesson.video_url });
    } catch (err) {
      console.warn("[admin-courses] could not delete video file", err);
    }
  }
  if (lesson.video_provider === "mux" && lesson.video_asset_id && lesson.video_playback_id) {
    try {
      await video.deleteAsset(lesson.video_asset_id);
    } catch (err) {
      console.warn("[admin-courses] could not delete Mux asset", err);
    }
  }
  const row = await db.from("lessons").update(lessonId, { video_provider: "none", video_url: null, video_asset_id: null, video_playback_id: null, updated_at: nowIso() });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.video_removed", "lesson", lessonId);
  return row;
}

export async function setLessonThumbnail(actorId: string, lessonId: string, file: File): Promise<Lesson> {
  const { db } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  const stored = await storePublicAsset("thumbnails", file, "image");
  const row = await db.from("lessons").update(lessonId, { thumbnail_path: stored.path, updated_at: nowIso() });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.thumbnail", "lesson", lessonId, { path: stored.path });
  return row;
}

export async function clearLessonThumbnail(actorId: string, lessonId: string): Promise<void> {
  const { db } = await getServices();
  await db.from("lessons").update(lessonId, { thumbnail_path: null, updated_at: nowIso() });
  await logAudit(actorId, "lesson.thumbnail_removed", "lesson", lessonId);
}

export async function setLessonCaptions(actorId: string, lessonId: string, file: File): Promise<Lesson> {
  const { db } = await getServices();
  const { lesson, course } = await requireLessonWithCourse(lessonId);
  const stored = await storeCourseFile(course.slug, "captions", file, "captions");
  const row = await db.from("lessons").update(lessonId, { captions_path: stored.path, updated_at: nowIso() });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.captions", "lesson", lessonId, { path: stored.path });
  return row;
}

export async function clearLessonCaptions(actorId: string, lessonId: string): Promise<void> {
  const { db, storage } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  if (lesson.captions_path && !/^https?:\/\//i.test(lesson.captions_path)) {
    try {
      await storage.delete({ bucket: "video-uploads", path: lesson.captions_path });
    } catch {
      /* already gone */
    }
  }
  await db.from("lessons").update(lessonId, { captions_path: null, updated_at: nowIso() });
  await logAudit(actorId, "lesson.captions_removed", "lesson", lessonId);
}

export async function addAudioSlot(actorId: string, lessonId: string, label: string): Promise<Lesson> {
  const { db } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  const clean = label.trim();
  if (!clean) fail("Please give the audio slot a label.");
  let key = slugify(clean).slice(0, 40) || "audio";
  const taken = new Set(lesson.audio_slots.map((s) => s.key));
  let n = 2;
  while (taken.has(key)) key = `${slugify(clean).slice(0, 36) || "audio"}-${n++}`;
  const row = await db.from("lessons").update(lessonId, { audio_slots: [...lesson.audio_slots, { key, label: clean, file_path: null }], updated_at: nowIso() });
  await logAudit(actorId, "lesson.audio_slot_added", "lesson", lessonId, { key });
  return row;
}

export async function uploadAudioSlot(actorId: string, lessonId: string, key: string, file: File): Promise<Lesson> {
  const { db } = await getServices();
  const { lesson, course } = await requireLessonWithCourse(lessonId);
  if (!lesson.audio_slots.some((s) => s.key === key)) fail("That audio slot no longer exists.");
  const type = file.type || guessType(file.name);
  if (type !== "audio/mpeg" && type !== "audio/mp4") fail("Please upload an MP3 file.");
  const problem = validateUpload(file, "resource");
  if (problem) fail(problem);
  const stored = await storeCourseFile(course.slug, `audio/${lesson.code}`, file, "resource");
  const slots = lesson.audio_slots.map((s) => (s.key === key ? { ...s, file_path: stored.path } : s));
  const row = await db.from("lessons").update(lessonId, { audio_slots: slots, updated_at: nowIso() });
  await touchCourse(db, lesson.course_id);
  await logAudit(actorId, "lesson.audio_uploaded", "lesson", lessonId, { key, path: stored.path });
  return row;
}

/** Clears the file from a slot (`remove` also drops the slot itself). */
export async function clearAudioSlot(actorId: string, lessonId: string, key: string, remove = false): Promise<Lesson> {
  const { db, storage } = await getServices();
  const { lesson } = await requireLessonWithCourse(lessonId);
  const slot = lesson.audio_slots.find((s) => s.key === key);
  if (!slot) fail("That audio slot no longer exists.");
  if (slot.file_path) {
    const others = await db.from("lesson_resources").count({ file_path: slot.file_path });
    if (others === 0) {
      try {
        await storage.delete({ bucket: "course-resources", path: slot.file_path });
      } catch {
        /* bundled or already gone */
      }
    }
  }
  const slots = remove ? lesson.audio_slots.filter((s) => s.key !== key) : lesson.audio_slots.map((s) => (s.key === key ? { ...s, file_path: null } : s));
  const row = await db.from("lessons").update(lessonId, { audio_slots: slots, updated_at: nowIso() });
  await logAudit(actorId, remove ? "lesson.audio_slot_removed" : "lesson.audio_cleared", "lesson", lessonId, { key });
  return row;
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

async function touchCourse(db: DataStore, courseId: string) {
  const now = nowIso();
  try {
    await db.from("courses").update(courseId, { last_updated_at: now, updated_at: now });
  } catch {
    /* course may be mid-delete */
  }
}

export const COURSE_STATUSES: CourseStatus[] = ["draft", "published", "scheduled", "archived"];
export const LESSON_STATUSES: LessonStatus[] = ["draft", "published", "scheduled"];
export const MODULE_KINDS: ModuleKind[] = ["home", "core", "bonus", "replay"];
