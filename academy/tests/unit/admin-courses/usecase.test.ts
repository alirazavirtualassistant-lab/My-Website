/**
 * Integration over the mock store: installs the bundled Baby Steps package,
 * then drives the admin-courses use case end to end (modules, lessons,
 * ordering, resources, action steps, media, cascades, course deletion).
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-admin-courses-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.DEMO_MODE = "0";
process.env.AUTH_SECRET = "test-secret-not-for-production";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined, getAll: () => [], has: () => false, set() {}, delete() {} }),
  headers: async () => new Headers(),
}));

const { getServices } = await import("@/services");
const { installCoursePackage } = await import("@/lib/usecases/install-package");
const { loadBundledPackage } = await import("@/lib/usecases/demo");
const { diffPackages } = await import("@/lib/importer");
const admin = await import("@/lib/usecases/admin-courses");

const ACTOR = "test-admin";
let courseId = "";

function file(name: string, type: string, bytes = 64): File {
  return new File([new Uint8Array(bytes).fill(1)], name, { type });
}

beforeAll(async () => {
  const pkg = await loadBundledPackage("baby-steps");
  if (!pkg) throw new Error("bundled package missing");
  const { db } = await getServices();
  const result = await installCoursePackage(db, pkg, { status: "published" });
  courseId = result.course_id;
});

describe("reads", () => {
  it("lists courses with counts", async () => {
    const rows = await admin.listCoursesForAdmin();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ module_count: 10, lesson_count: 59, enrolled: 0 });
    expect(await admin.enrolledCount(courseId)).toBe(0);
  });

  it("exports the installed course as a package that diffs clean against the bundle", async () => {
    const bundled = (await loadBundledPackage("baby-steps"))!;
    const exported = await admin.exportCoursePackage(courseId);
    expect(exported).not.toBeNull();
    const diff = diffPackages(exported!, bundled);
    expect(diff.changes.filter((c) => c.level !== "stats")).toEqual([]);
    expect(diff.unchanged).toBe(true);
  });
});

describe("modules and lessons", () => {
  let moduleId = "";
  let lessonId = "";

  it("creates a module with a suggested code and refuses duplicates", async () => {
    const { db } = await getServices();
    const existing = await db.from("modules").list({ where: { course_id: courseId } });
    const code = admin.suggestModuleCode(existing);
    expect(code).toBe("M8");
    const mod = await admin.createModule(ACTOR, courseId, { code, kind: "core", title: "Extra module", description: "", notes: "", drip_days: 49, completion_xp: 10, required_for_certificate: false, illustration: null });
    moduleId = mod.id;
    expect(mod.position).toBe(10);
    await expect(admin.createModule(ACTOR, courseId, { code: "m8", kind: "core", title: "Dup", description: "", notes: "", drip_days: 0, completion_xp: 0, required_for_certificate: false, illustration: null })).rejects.toThrow(/already exists/);
  });

  it("creates a lesson, enforces unique codes and updates fields", async () => {
    const lesson = await admin.createLesson(ACTOR, moduleId, { code: admin.suggestLessonCode("M8", []), title: "A new training" });
    lessonId = lesson.id;
    expect(lesson.code).toBe("M8T1");
    expect(lesson.status).toBe("draft");
    await expect(admin.createLesson(ACTOR, moduleId, { code: "M1T1", title: "Clash" })).rejects.toThrow(/already exists/);
    const updated = await admin.updateLesson(ACTOR, lessonId, { title: "  Renamed  ", duration_sec: 125.4, drip_days_override: 3, is_preview: true });
    expect(updated).toMatchObject({ title: "Renamed", duration_sec: 125, drip_days_override: 3, is_preview: true });
    await expect(admin.updateLesson(ACTOR, lessonId, { code: "M1T2" })).rejects.toThrow(/already exists/);
  });

  it("reorders modules and moves a lesson into another module", async () => {
    const { db } = await getServices();
    const modules = await db.from("modules").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] });
    const m1 = modules.find((m) => m.code === "M1")!;
    const m1Lessons = await db.from("lessons").list({ where: { module_id: m1.id }, orderBy: ["position", "asc"] });
    const order = modules.map((m) => ({ module_id: m.id, lesson_ids: m.id === m1.id ? [lessonId, ...m1Lessons.map((l) => l.id)] : m.id === moduleId ? [] : [] }));
    // Put the new module first.
    const reordered = [order.find((o) => o.module_id === moduleId)!, ...order.filter((o) => o.module_id !== moduleId)];
    await admin.reorderCurriculum(ACTOR, courseId, reordered);
    const after = await db.from("modules").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] });
    expect(after[0].id).toBe(moduleId);
    expect(after.map((m) => m.position)).toEqual(after.map((_, i) => i));
    const moved = await db.from("lessons").get(lessonId);
    expect(moved?.module_id).toBe(m1.id);
    expect(moved?.position).toBe(0);
    const m1After = await db.from("lessons").list({ where: { module_id: m1.id }, orderBy: ["position", "asc"] });
    expect(m1After.map((l) => l.position)).toEqual(m1After.map((_, i) => i));
    expect(m1After[1].code).toBe(m1Lessons[0].code);
    // Lessons the client did not mention keep their relative order (M2 untouched).
    const m2 = modules.find((m) => m.code === "M2")!;
    const m2Lessons = await db.from("lessons").list({ where: { module_id: m2.id }, orderBy: ["position", "asc"] });
    expect(m2Lessons.map((l) => l.code)).toEqual(["M2T0", "M2T1", "M2T2", "M2T3", "M2T4", "M2T5", "M2T6", "M2T7", "M2T8"]);
  });

  it("manages action steps", async () => {
    const step = await admin.createActionStep(ACTOR, lessonId, { label: " Journal it ", kind: "implementation", xp: 30, requires_upload: false, upload_type: null, link: { type: "none" }, sub_items: [{ key: "", label: "Write one line", xp: 5 }] });
    expect(step).toMatchObject({ label: "Journal it", source_label: "Journal it", xp: 30, position: 0 });
    expect(step.sub_items?.[0].key).toBe("write-one-line");
    const second = await admin.createActionStep(ACTOR, lessonId, { label: "Upload a photo", kind: "optional", xp: 20, requires_upload: false, upload_type: null, link: { type: "upload", upload_type: "photo" }, sub_items: null });
    expect(second).toMatchObject({ requires_upload: true, upload_type: "photo", position: 1 });
    await admin.reorderActionSteps(ACTOR, lessonId, [second.id, step.id]);
    const { db } = await getServices();
    const ordered = await db.from("action_steps").list({ where: { lesson_id: lessonId }, orderBy: ["position", "asc"] });
    expect(ordered.map((s) => s.id)).toEqual([second.id, step.id]);
    const edited = await admin.updateActionStep(ACTOR, step.id, { label: "Journal it twice", kind: "rare", xp: 40, requires_upload: false, upload_type: null, link: { type: "quiz", quiz_key: "wellness-quiz" }, sub_items: null });
    expect(edited).toMatchObject({ label: "Journal it twice", xp: 40, link: { type: "quiz", quiz_key: "wellness-quiz" }, sub_items: null });
    await db.from("action_step_completions").insert({ id: "c1", user_id: "u1", step_id: second.id, lesson_id: lessonId, course_id: courseId, upload_path: null, sub_items_done: [], completed_at: null, created_at: new Date().toISOString() });
    await admin.deleteActionStep(ACTOR, second.id);
    expect(await db.from("action_step_completions").count({ step_id: second.id })).toBe(0);
    const left = await db.from("action_steps").list({ where: { lesson_id: lessonId } });
    expect(left).toHaveLength(1);
    expect(left[0].position).toBe(0);
  });

  it("uploads, renames, reorders and deletes resources (removing orphaned files)", async () => {
    const { db, storage } = await getServices();
    const a = await admin.addLessonResource(ACTOR, lessonId, file("M8T1_Worksheet.pdf", "application/pdf"));
    expect(a).toMatchObject({ type: "pdf", label: "M8T1 Worksheet", position: 0, size_bytes: 64 });
    expect(await storage.exists({ bucket: "course-resources", path: a.file_path })).toBe(true);
    const b = await admin.addLessonResource(ACTOR, lessonId, file("audio.mp3", "audio/mpeg"), "Session audio");
    expect(b).toMatchObject({ type: "mp3", label: "Session audio", position: 1 });
    await admin.reorderResources(ACTOR, lessonId, [b.id, a.id]);
    const ordered = await db.from("lesson_resources").list({ where: { lesson_id: lessonId }, orderBy: ["position", "asc"] });
    expect(ordered.map((r) => r.id)).toEqual([b.id, a.id]);
    expect((await admin.renameResource(ACTOR, a.id, "Worksheet")).label).toBe("Worksheet");
    await expect(admin.renameResource(ACTOR, a.id, "  ")).rejects.toThrow(/label/);
    await admin.deleteResource(ACTOR, a.id);
    expect(await storage.exists({ bucket: "course-resources", path: a.file_path })).toBe(false);
    expect((await db.from("lesson_resources").list({ where: { lesson_id: lessonId } })).map((r) => r.position)).toEqual([0]);
  });

  it("rejects unsupported uploads", async () => {
    await expect(admin.addLessonResource(ACTOR, lessonId, file("evil.exe", "application/octet-stream"))).rejects.toThrow(/not supported/);
    await expect(admin.storeLessonVideo(ACTOR, lessonId, file("notes.txt", "text/plain"))).rejects.toThrow(/not supported/);
  });

  it("attaches and removes a self-hosted video, captions, thumbnail and audio", async () => {
    const { storage } = await getServices();
    const withVideo = await admin.storeLessonVideo(ACTOR, lessonId, file("M8T1-Training.mp4", "video/mp4", 1024));
    expect(withVideo.video_provider).toBe("url");
    expect(withVideo.video_url).toBe("baby-steps/videos/M8T1-Training.mp4");
    expect(await storage.exists({ bucket: "video-uploads", path: withVideo.video_url! })).toBe(true);
    const withCaptions = await admin.setLessonCaptions(ACTOR, lessonId, file("M8T1.vtt", "text/vtt"));
    expect(withCaptions.captions_path).toBe("baby-steps/captions/M8T1.vtt");
    const withThumb = await admin.setLessonThumbnail(ACTOR, lessonId, file("poster.png", "image/png"));
    expect(withThumb.thumbnail_path).toMatch(/^thumbnails\/.+\.png$/);
    const slotted = await admin.addAudioSlot(ACTOR, lessonId, "Training audio");
    expect(slotted.audio_slots).toEqual([{ key: "training-audio", label: "Training audio", file_path: null }]);
    const again = await admin.addAudioSlot(ACTOR, lessonId, "Training audio");
    expect(again.audio_slots[1].key).toBe("training-audio-2");
    await expect(admin.uploadAudioSlot(ACTOR, lessonId, "training-audio", file("x.pdf", "application/pdf"))).rejects.toThrow(/MP3/);
    const uploaded = await admin.uploadAudioSlot(ACTOR, lessonId, "training-audio", file("summary.mp3", "audio/mpeg"));
    expect(uploaded.audio_slots[0].file_path).toBe("baby-steps/audio/M8T1/summary.mp3");
    const cleared = await admin.clearAudioSlot(ACTOR, lessonId, "training-audio", false);
    expect(cleared.audio_slots[0].file_path).toBeNull();
    const removed = await admin.clearAudioSlot(ACTOR, lessonId, "training-audio-2", true);
    expect(removed.audio_slots).toHaveLength(1);
    const noVideo = await admin.removeLessonVideo(ACTOR, lessonId);
    expect(noVideo).toMatchObject({ video_provider: "none", video_url: null });
    expect(await storage.exists({ bucket: "video-uploads", path: withVideo.video_url! })).toBe(false);
    await admin.clearLessonCaptions(ACTOR, lessonId);
    await admin.clearLessonThumbnail(ACTOR, lessonId);
  });

  it("tracks Mux uploads as pending until the webhook flips them", async () => {
    const pending = await admin.markVideoUploadPending(ACTOR, lessonId, "upload_123");
    expect(pending).toMatchObject({ video_provider: "mux", video_asset_id: "upload_123", video_playback_id: null });
    await admin.removeLessonVideo(ACTOR, lessonId);
  });

  it("deletes a lesson with its progress rows and renumbers siblings", async () => {
    const { db } = await getServices();
    const now = new Date().toISOString();
    await db.from("lesson_progress").insert({ id: "p1", user_id: "u1", lesson_id: lessonId, course_id: courseId, completed_at: null, last_position_sec: 10, watched_sec: 10, updated_at: now });
    await db.from("notes").insert({ id: "n1", user_id: "u1", lesson_id: lessonId, course_id: courseId, body: "hi", position_sec: null, created_at: now, updated_at: now });
    const before = await db.from("lessons").get(lessonId);
    await admin.deleteLesson(ACTOR, lessonId);
    expect(await db.from("lessons").get(lessonId)).toBeNull();
    expect(await db.from("lesson_progress").count({ lesson_id: lessonId })).toBe(0);
    expect(await db.from("notes").count({ lesson_id: lessonId })).toBe(0);
    expect(await db.from("action_steps").count({ lesson_id: lessonId })).toBe(0);
    expect(await db.from("lesson_resources").count({ lesson_id: lessonId })).toBe(0);
    const siblings = await db.from("lessons").list({ where: { module_id: before!.module_id }, orderBy: ["position", "asc"] });
    expect(siblings.map((l) => l.position)).toEqual(siblings.map((_, i) => i));
    expect(siblings[0].code).toBe("M1T0");
  });

  it("deletes a module and its lessons", async () => {
    const lesson = await admin.createLesson(ACTOR, moduleId, { code: "M8T9", title: "Doomed" });
    await admin.deleteModule(ACTOR, moduleId);
    const { db } = await getServices();
    expect(await db.from("modules").get(moduleId)).toBeNull();
    expect(await db.from("lessons").get(lesson.id)).toBeNull();
    const modules = await db.from("modules").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] });
    expect(modules.map((m) => m.position)).toEqual(modules.map((_, i) => i));
    expect(modules[0].code).toBe("M0");
  });

  it("writes audit rows for every mutation", async () => {
    const { db } = await getServices();
    const actions = new Set((await db.from("audit_log").list({ where: { actor_user_id: ACTOR } })).map((a) => a.action));
    for (const a of ["module.created", "lesson.created", "lesson.updated", "course.reordered", "action_step.created", "resource.added", "resource.deleted", "lesson.video_uploaded", "lesson.video_removed", "lesson.deleted", "module.deleted"]) {
      expect(actions.has(a), a).toBe(true);
    }
  });
});

describe("courses", () => {
  it("creates and updates a course with slug checks", async () => {
    const base = { title: "Second course", subtitle: "", description: "", short_description: "", illustration: "leaves", status: "draft" as const, publish_at: null, level: "Beginner", language: "English", topics: ["nutrition"], badge: null, partner_seat_enabled: true, certificate_enabled: false, lifetime_access: false, access_days: 90, what_you_learn: [], requirements: [], who_for: [], faq: [], duration_weeks: 4 };
    const course = await admin.createCourse(ACTOR, { ...base, slug: "Second Course!" });
    expect(course.slug).toBe("second-course");
    await expect(admin.createCourse(ACTOR, { ...base, slug: "baby-steps" })).rejects.toThrow(/already used/);
    await expect(admin.updateCourse(ACTOR, course.id, { slug: "baby-steps" })).rejects.toThrow(/already used/);
    const updated = await admin.updateCourse(ACTOR, course.id, { title: "Second course, renamed", status: "published" });
    expect(updated.title).toBe("Second course, renamed");
    const result = await admin.deleteCourse(ACTOR, course.id);
    expect(result.ok).toBe(true);
  });

  it("refuses to delete a course with active enrollments unless forced", async () => {
    const { db } = await getServices();
    const now = new Date().toISOString();
    await db.from("enrollments").insert({ id: "e1", user_id: "u1", course_id: courseId, source: "comp", order_id: null, subscription_id: null, started_at: now, expires_at: null, status: "active", unlock_all: false, partner_invites_remaining: 1, created_at: now, updated_at: now });
    const refused = await admin.deleteCourse(ACTOR, courseId);
    expect(refused.ok).toBe(false);
    if (!refused.ok) expect(refused.enrolled).toBe(1);
    expect(await db.from("courses").get(courseId)).not.toBeNull();
    const forced = await admin.deleteCourse(ACTOR, courseId, { force: true });
    expect(forced.ok).toBe(true);
    expect(await db.from("courses").get(courseId)).toBeNull();
    expect(await db.from("modules").count({ course_id: courseId })).toBe(0);
    expect(await db.from("lessons").count({ course_id: courseId })).toBe(0);
    expect(await db.from("action_steps").count({ course_id: courseId })).toBe(0);
    expect(await db.from("lesson_resources").count({ course_id: courseId })).toBe(0);
    expect(await db.from("enrollments").count({ course_id: courseId })).toBe(0);
    expect(await db.from("forum_categories").count({ course_id: courseId })).toBe(0);
    expect(await db.from("quiz_definitions").count({ course_id: courseId })).toBe(0);
    expect(await admin.listCoursesForAdmin()).toEqual([]);
  });
});
