import "server-only";
import { getServices } from "@/services";
import type { Course, CourseTree, Lesson, LessonResource, ActionStep, Module } from "@/lib/types";

export async function listPublishedCourses(): Promise<Course[]> {
  const { db } = await getServices();
  const courses = await db.from("courses").list({ where: { status: "published" }, orderBy: ["created_at", "desc"] });
  return courses;
}

export async function listAllCourses(): Promise<Course[]> {
  const { db } = await getServices();
  return db.from("courses").list({ orderBy: ["created_at", "desc"] });
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const { db } = await getServices();
  return db.from("courses").findOne({ slug });
}

export async function getCourseById(id: string): Promise<Course | null> {
  const { db } = await getServices();
  return db.from("courses").get(id);
}

/** Full course tree (modules → lessons → resources/action steps), ordered by position. */
export async function getCourseTree(courseId: string, opts: { includeDrafts?: boolean } = {}): Promise<CourseTree | null> {
  const { db } = await getServices();
  const course = await db.from("courses").get(courseId);
  if (!course) return null;
  const [modules, lessons, resources, steps] = await Promise.all([
    db.from("modules").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
    db.from("lessons").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
    db.from("lesson_resources").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
    db.from("action_steps").list({ where: { course_id: courseId }, orderBy: ["position", "asc"] }),
  ]);
  return buildTree(course, modules, lessons, resources, steps, opts);
}

export function buildTree(
  course: Course,
  modules: Module[],
  lessons: Lesson[],
  resources: LessonResource[],
  steps: ActionStep[],
  opts: { includeDrafts?: boolean } = {},
): CourseTree {
  const now = Date.now();
  const visibleLesson = (l: Lesson) => {
    if (opts.includeDrafts) return true;
    if (l.status === "published") return true;
    if (l.status === "scheduled" && l.publish_at && new Date(l.publish_at).getTime() <= now) return true;
    return false;
  };
  const stepsByLesson = new Map<string, ActionStep[]>();
  for (const s of steps) {
    const arr = stepsByLesson.get(s.lesson_id) ?? [];
    arr.push(s);
    stepsByLesson.set(s.lesson_id, arr);
  }
  const resByLesson = new Map<string, LessonResource[]>();
  const resByModule = new Map<string, LessonResource[]>();
  for (const r of resources) {
    if (r.lesson_id) {
      const arr = resByLesson.get(r.lesson_id) ?? [];
      arr.push(r);
      resByLesson.set(r.lesson_id, arr);
    } else if (r.module_id) {
      const arr = resByModule.get(r.module_id) ?? [];
      arr.push(r);
      resByModule.set(r.module_id, arr);
    }
  }
  const sortPos = <T extends { position: number }>(a: T, b: T) => a.position - b.position;
  return {
    course,
    modules: [...modules].sort(sortPos).map((m) => ({
      ...m,
      resources: (resByModule.get(m.id) ?? []).sort(sortPos),
      lessons: lessons
        .filter((l) => l.module_id === m.id && visibleLesson(l))
        .sort(sortPos)
        .map((l) => ({
          ...l,
          resources: (resByLesson.get(l.id) ?? []).sort(sortPos),
          action_steps: (stepsByLesson.get(l.id) ?? []).sort(sortPos),
        })),
    })),
  };
}

export interface CourseStats {
  lesson_count: number;
  module_count: number; // core modules (kind core)
  bonus_count: number;
  replay_count: number;
  resource_count: number; // distinct files
  total_video_sec: number;
  total_xp: number;
  preview_lesson_ids: string[];
}

export function courseStats(tree: CourseTree): CourseStats {
  const files = new Set<string>();
  let lesson_count = 0;
  let total_video_sec = 0;
  let total_xp = 0;
  const preview_lesson_ids: string[] = [];
  for (const m of tree.modules) {
    total_xp += m.completion_xp;
    for (const r of m.resources) files.add(r.file_path);
    for (const l of m.lessons) {
      lesson_count += 1;
      total_video_sec += l.duration_sec;
      if (l.is_preview) preview_lesson_ids.push(l.id);
      for (const r of l.resources) files.add(r.file_path);
      for (const s of l.action_steps) total_xp += s.xp;
    }
  }
  return {
    lesson_count,
    module_count: tree.modules.filter((m) => m.kind === "core").length,
    bonus_count: tree.modules.filter((m) => m.kind === "bonus").reduce((n, m) => n + m.lessons.length, 0),
    replay_count: tree.modules.filter((m) => m.kind === "replay").reduce((n, m) => n + m.lessons.length, 0),
    resource_count: files.size,
    total_video_sec,
    total_xp,
    preview_lesson_ids,
  };
}

export function findLesson(tree: CourseTree, lessonCodeOrId: string) {
  for (const m of tree.modules) {
    for (const l of m.lessons) {
      if (l.id === lessonCodeOrId || l.code.toLowerCase() === lessonCodeOrId.toLowerCase()) return { module: m, lesson: l };
    }
  }
  return null;
}

/** Lesson slug used in URLs: lowercase code, e.g. m1t1, bonus_t2a → bonus-t2a. */
export function lessonSlug(lesson: Pick<Lesson, "code">): string {
  return lesson.code.toLowerCase().replace(/_/g, "-");
}

export function findLessonBySlug(tree: CourseTree, slug: string) {
  const norm = slug.toLowerCase().replace(/-/g, "_");
  for (const m of tree.modules) {
    for (const l of m.lessons) {
      if (l.code.toLowerCase() === norm || l.id === slug) return { module: m, lesson: l };
    }
  }
  return null;
}
