"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { getCourseBySlug, getCourseTree } from "@/lib/usecases/catalog";
import { listAllNotes, notesToMarkdown } from "@/lib/usecases/notes";
import { slugify } from "@/lib/utils";

export interface NotesExportResult {
  ok: boolean;
  error?: string;
  filename?: string;
  markdown?: string;
}

/** Builds the Markdown export of every note the learner has in a course. The client turns it into a download. */
export async function exportNotesAction(input: { courseSlug: string }): Promise<NotesExportResult> {
  const session = await requireUser();
  const parsed = z.object({ courseSlug: z.string().min(1).max(120) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Bad input" };
  const course = await getCourseBySlug(parsed.data.courseSlug);
  if (!course) return { ok: false, error: "Course not found" };
  const [tree, notes] = await Promise.all([getCourseTree(course.id), listAllNotes(session.user_id, course.id)]);
  const lessons = new Map<string, { title: string; code: string; order: number }>();
  let order = 0;
  for (const m of tree?.modules ?? []) for (const l of m.lessons) lessons.set(l.id, { title: l.title, code: l.code, order: order++ });
  const rows = notes
    .map((n) => ({ ...n, lesson_title: lessons.get(n.lesson_id)?.title ?? "Lesson", lesson_code: lessons.get(n.lesson_id)?.code ?? "—", order: lessons.get(n.lesson_id)?.order ?? Number.MAX_SAFE_INTEGER }))
    .sort((a, b) => a.order - b.order || a.created_at.localeCompare(b.created_at));
  return { ok: true, filename: `${slugify(course.title) || "course"}-notes.md`, markdown: notesToMarkdown(course.title, rows) };
}
