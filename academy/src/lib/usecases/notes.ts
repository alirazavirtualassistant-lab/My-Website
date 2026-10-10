import "server-only";
import { getServices } from "@/services";
import type { Note } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";

export async function listNotes(userId: string, lessonId: string): Promise<Note[]> {
  const { db } = await getServices();
  return db.from("notes").list({ where: { user_id: userId, lesson_id: lessonId }, orderBy: ["created_at", "asc"] });
}

export async function listAllNotes(userId: string, courseId: string): Promise<Note[]> {
  const { db } = await getServices();
  return db.from("notes").list({ where: { user_id: userId, course_id: courseId }, orderBy: ["created_at", "asc"] });
}

export async function saveNote(input: { userId: string; lessonId: string; courseId: string; noteId?: string | null; body: string; positionSec: number | null }): Promise<Note> {
  const { db } = await getServices();
  const body = input.body.slice(0, 20_000);
  const now = nowIso();
  if (input.noteId) {
    const existing = await db.from("notes").get(input.noteId);
    if (!existing || existing.user_id !== input.userId) throw new Error("Note not found");
    return db.from("notes").update(existing.id, { body, position_sec: input.positionSec, updated_at: now });
  }
  return db.from("notes").insert({ id: newId(), user_id: input.userId, lesson_id: input.lessonId, course_id: input.courseId, body, position_sec: input.positionSec, created_at: now, updated_at: now });
}

export async function deleteNote(userId: string, noteId: string): Promise<void> {
  const { db } = await getServices();
  const existing = await db.from("notes").get(noteId);
  if (!existing || existing.user_id !== userId) return;
  await db.from("notes").delete(noteId);
}

/** Markdown export of a learner's notes for a course. */
export function notesToMarkdown(courseTitle: string, notes: Array<Note & { lesson_title: string; lesson_code: string }>): string {
  const lines = [`# My notes — ${courseTitle}`, ""];
  let current = "";
  for (const n of notes) {
    if (n.lesson_code !== current) {
      current = n.lesson_code;
      lines.push(`## ${n.lesson_code} · ${n.lesson_title}`, "");
    }
    const stamp = n.position_sec != null ? ` _(at ${Math.floor(n.position_sec / 60)}:${String(Math.floor(n.position_sec % 60)).padStart(2, "0")})_` : "";
    lines.push(`- ${new Date(n.created_at).toLocaleString("en-US")}${stamp}`, "", `  ${n.body.replace(/\n/g, "\n  ")}`, "");
  }
  return lines.join("\n");
}
