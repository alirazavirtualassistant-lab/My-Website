import "server-only";
import type { DataStore } from "@/services/types";
import type { CoursePackage, Course, Module, Lesson, LessonResource, ActionStep, QuizDefinition, ForumCategory } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";

export interface InstallResult {
  course_id: string;
  created: boolean;
  modules: number;
  lessons: number;
  resources: number;
  action_steps: number;
  quizzes: number;
  forum_categories: number;
}

/**
 * Installs (or re-installs) a CoursePackage into the data store. Idempotent:
 * keyed by course slug, module code and lesson code, so re-running an import
 * updates content in place and keeps learner progress attached to the same
 * lesson ids. Resources and action steps are replaced per lesson.
 */
export async function installCoursePackage(
  db: DataStore,
  pkg: CoursePackage,
  opts: { status?: Course["status"]; preserveCourseFields?: boolean } = {},
): Promise<InstallResult> {
  return db.transaction(async (tx) => {
    const now = nowIso();
    const courses = tx.from("courses");
    const existing = await courses.findOne({ slug: pkg.course.slug });
    let course: Course;
    let created = false;
    if (existing) {
      const patch: Partial<Course> = opts.preserveCourseFields
        ? { last_updated_at: now, updated_at: now }
        : { ...pkg.course, status: opts.status ?? existing.status, last_updated_at: now, updated_at: now };
      course = await courses.update(existing.id, patch);
    } else {
      created = true;
      course = await courses.insert({
        ...pkg.course,
        id: newId(),
        status: opts.status ?? pkg.course.status,
        last_updated_at: now,
        created_at: now,
        updated_at: now,
      });
    }

    const modulesRepo = tx.from("modules");
    const lessonsRepo = tx.from("lessons");
    const resourcesRepo = tx.from("lesson_resources");
    const stepsRepo = tx.from("action_steps");

    const existingModules = await modulesRepo.list({ where: { course_id: course.id } });
    const existingLessons = await lessonsRepo.list({ where: { course_id: course.id } });
    const moduleByCode = new Map(existingModules.map((m) => [m.code, m]));
    const lessonByCode = new Map(existingLessons.map((l) => [l.code, l]));

    // Replace all resources for the course (they are derived from files).
    await resourcesRepo.deleteWhere({ course_id: course.id });

    let moduleCount = 0;
    let lessonCount = 0;
    let resourceCount = 0;
    let stepCount = 0;
    const seenModuleIds = new Set<string>();
    const seenLessonIds = new Set<string>();

    for (const [mi, pm] of pkg.modules.entries()) {
      const { lessons, resources, ...moduleFields } = pm;
      const prevModule = moduleByCode.get(pm.code);
      const moduleRow: Module = prevModule
        ? await modulesRepo.update(prevModule.id, { ...moduleFields, position: mi, updated_at: now })
        : await modulesRepo.insert({ ...moduleFields, id: newId(), course_id: course.id, position: mi, created_at: now, updated_at: now });
      seenModuleIds.add(moduleRow.id);
      moduleCount += 1;

      for (const [ri, r] of resources.entries()) {
        await resourcesRepo.insert({ ...r, id: newId(), course_id: course.id, module_id: moduleRow.id, lesson_id: null, position: ri, created_at: now });
        resourceCount += 1;
      }

      for (const [li, pl] of lessons.entries()) {
        const { resources: lres, action_steps, ...lessonFields } = pl;
        const prevLesson = lessonByCode.get(pl.code);
        const lessonRow: Lesson = prevLesson
          ? await lessonsRepo.update(prevLesson.id, {
              ...lessonFields,
              module_id: moduleRow.id,
              position: li,
              // keep media the admin may have attached
              video_provider: prevLesson.video_provider,
              video_asset_id: prevLesson.video_asset_id,
              video_playback_id: prevLesson.video_playback_id,
              video_url: prevLesson.video_url,
              captions_path: prevLesson.captions_path,
              thumbnail_path: prevLesson.thumbnail_path ?? lessonFields.thumbnail_path,
              audio_slots: mergeAudioSlots(prevLesson.audio_slots, lessonFields.audio_slots),
              updated_at: now,
            })
          : await lessonsRepo.insert({ ...lessonFields, id: newId(), module_id: moduleRow.id, course_id: course.id, position: li, created_at: now, updated_at: now });
        seenLessonIds.add(lessonRow.id);
        lessonCount += 1;

        for (const [ri, r] of lres.entries()) {
          await resourcesRepo.insert({ ...r, id: newId(), course_id: course.id, module_id: null, lesson_id: lessonRow.id, position: ri, created_at: now });
          resourceCount += 1;
        }

        // Replace action steps for this lesson, keeping ids stable by position+label when possible
        const prevSteps = await stepsRepo.list({ where: { lesson_id: lessonRow.id } });
        const prevByLabel = new Map(prevSteps.map((s) => [s.source_label, s]));
        const keep = new Set<string>();
        for (const [si, s] of action_steps.entries()) {
          const prev = prevByLabel.get(s.source_label);
          if (prev) {
            await stepsRepo.update(prev.id, { ...s, position: si });
            keep.add(prev.id);
          } else {
            const row = await stepsRepo.insert({ ...s, id: newId(), lesson_id: lessonRow.id, course_id: course.id, position: si, created_at: now });
            keep.add(row.id);
          }
          stepCount += 1;
        }
        for (const s of prevSteps) if (!keep.has(s.id)) await stepsRepo.delete(s.id);
      }
    }

    // Remove lessons/modules that are no longer in the package
    for (const l of existingLessons) {
      if (!seenLessonIds.has(l.id)) {
        await stepsRepo.deleteWhere({ lesson_id: l.id });
        await lessonsRepo.delete(l.id);
      }
    }
    for (const m of existingModules) if (!seenModuleIds.has(m.id)) await modulesRepo.delete(m.id);

    // Quizzes (by key)
    const quizRepo = tx.from("quiz_definitions");
    let quizCount = 0;
    for (const q of pkg.quizzes) {
      const prev = await quizRepo.findOne({ key: q.key });
      const row: QuizDefinition = { ...q, id: prev?.id ?? newId(), course_id: course.id };
      await quizRepo.upsert(row);
      quizCount += 1;
    }

    // Forum categories (by slug within course)
    const catRepo = tx.from("forum_categories");
    const modulesNow = await modulesRepo.list({ where: { course_id: course.id } });
    const modIdByCode = new Map(modulesNow.map((m) => [m.code, m.id]));
    let catCount = 0;
    for (const [ci, c] of pkg.forum_categories.entries()) {
      const { module_code, ...fields } = c;
      const prev = await catRepo.findOne({ course_id: course.id, slug: c.slug });
      const row: ForumCategory = {
        ...fields,
        id: prev?.id ?? newId(),
        course_id: course.id,
        module_id: module_code ? (modIdByCode.get(module_code) ?? null) : null,
        position: ci,
      };
      await catRepo.upsert(row);
      catCount += 1;
    }

    return {
      course_id: course.id,
      created,
      modules: moduleCount,
      lessons: lessonCount,
      resources: resourceCount,
      action_steps: stepCount,
      quizzes: quizCount,
      forum_categories: catCount,
    };
  });
}

function mergeAudioSlots(prev: Lesson["audio_slots"], next: Lesson["audio_slots"]): Lesson["audio_slots"] {
  const prevByKey = new Map(prev.map((s) => [s.key, s]));
  return next.map((s) => ({ ...s, file_path: prevByKey.get(s.key)?.file_path ?? s.file_path }));
}

export type { LessonResource, ActionStep };
