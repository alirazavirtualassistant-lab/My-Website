"use client";

/**
 * Private notes for one lesson: composer with "Add note at current time",
 * inline editing with debounced autosave (800 ms) and a "Saved" indicator,
 * delete, and a link to the course-wide export page.
 */
import * as React from "react";
import Link from "next/link";
import { Check, Clock, FileDown, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { deleteNoteAction, saveNoteAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { usePlayerStore } from "./player-store";
import { formatClock, positionLabel } from "./transcript-utils";
import type { NoteView } from "./types";

const AUTOSAVE_MS = 800;

export interface NotesPanelProps {
  lessonId: string;
  courseId: string;
  courseSlug: string;
  initialNotes: NoteView[];
  className?: string;
}

function NotesPanel({ lessonId, courseId, courseSlug, initialNotes, className }: NotesPanelProps) {
  const { hasPlayer, currentTime, seekTo } = usePlayerStore();
  const [notes, setNotes] = React.useState<NoteView[]>(initialNotes);
  const [draft, setDraft] = React.useState("");
  const [draftAt, setDraftAt] = React.useState<number | null>(null);
  const [saving, startSave] = React.useTransition();
  const draftRef = React.useRef<HTMLTextAreaElement | null>(null);

  function addAtCurrentTime() {
    setDraftAt(Math.floor(currentTime()));
    draftRef.current?.focus();
  }

  function saveDraft() {
    const body = draft.trim();
    if (!body) {
      toast("Write a line or two first.");
      return;
    }
    startSave(async () => {
      const res = await saveNoteAction({ lessonId, courseId, body, positionSec: draftAt });
      if (!res.ok || !res.note) {
        toast.error(res.error ?? "We couldn't save that note just now.");
        return;
      }
      setNotes((prev) => [...prev, res.note!]);
      setDraft("");
      setDraftAt(null);
      toast.success("Note saved");
    });
  }

  function remove(id: string) {
    const prev = notes;
    setNotes((n) => n.filter((x) => x.id !== id));
    void deleteNoteAction({ noteId: id }).then((res) => {
      if (!res.ok) {
        setNotes(prev);
        toast.error(res.error ?? "We couldn't delete that note just now.");
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveDraft();
        }}
        className="card-soft flex flex-col gap-3 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="note-draft" className="text-sm font-semibold">
            New note
          </Label>
          <div className="flex flex-wrap items-center gap-2">
            {draftAt !== null ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-2 py-0.5 text-xs font-semibold text-rose-strong">
                <Clock className="size-3" aria-hidden="true" />
                {positionLabel(draftAt)}
                <button type="button" onClick={() => setDraftAt(null)} aria-label="Remove timestamp" className="ml-0.5 rounded-full hover:bg-rose/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                  <X className="size-3" />
                </button>
              </span>
            ) : null}
            {hasPlayer ? (
              <Button type="button" size="sm" variant="outline" onClick={addAtCurrentTime}>
                <Clock aria-hidden="true" />
                Add note at current time
              </Button>
            ) : null}
          </div>
        </div>
        <Textarea
          id="note-draft"
          ref={draftRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              saveDraft();
            }
          }}
          rows={3}
          placeholder="What stood out? What will you try this week?"
          maxLength={20_000}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Plain text. Private to you. Ctrl/⌘ + Enter to save.</p>
          <Button type="submit" size="sm" loading={saving}>
            <Plus aria-hidden="true" />
            Save note
          </Button>
        </div>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes for this lesson yet.</p>
      ) : (
        <ul className="flex flex-col gap-3" aria-label="Your notes">
          {notes.map((n) => (
            <NoteEditor key={n.id} note={n} lessonId={lessonId} courseId={courseId} hasPlayer={hasPlayer} onSeek={seekTo} onDelete={() => remove(n.id)} />
          ))}
        </ul>
      )}

      <p className="text-sm">
        <Link href={`/learn/${courseSlug}/notes`} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
          <FileDown className="size-4" aria-hidden="true" />
          All my notes for this course (export as Markdown)
        </Link>
      </p>
    </div>
  );
}

function NoteEditor({ note, lessonId, courseId, hasPlayer, onSeek, onDelete }: { note: NoteView; lessonId: string; courseId: string; hasPlayer: boolean; onSeek: (sec: number) => void; onDelete: () => void }) {
  const [body, setBody] = React.useState(note.body);
  const [status, setStatus] = React.useState<"saved" | "dirty" | "saving" | "error">("saved");
  const timer = React.useRef<number | null>(null);
  const latest = React.useRef(note.body);

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function schedule(next: string) {
    latest.current = next;
    setBody(next);
    setStatus("dirty");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setStatus("saving");
      const res = await saveNoteAction({ lessonId, courseId, noteId: note.id, body: latest.current, positionSec: note.positionSec });
      setStatus(res.ok ? "saved" : "error");
    }, AUTOSAVE_MS);
  }

  const stamp = positionLabel(note.positionSec);
  const editorId = `note-${note.id}`;
  return (
    <li className="card-soft flex flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex flex-wrap items-center gap-2">
          <span>{formatDate(note.createdAt, { month: "short", day: "numeric", year: "numeric" })}</span>
          {stamp ? (
            hasPlayer && note.positionSec !== null ? (
              <button type="button" onClick={() => onSeek(note.positionSec!)} className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-2 py-0.5 font-semibold text-rose-strong hover:bg-rose-soft/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label={`Play from ${formatClock(note.positionSec)}`}>
                <Clock className="size-3" aria-hidden="true" />
                {stamp}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2 py-0.5 font-semibold">
                <Clock className="size-3" aria-hidden="true" />
                {stamp}
              </span>
            )
          ) : null}
        </span>
        <span className="inline-flex items-center gap-3">
          <span role="status" aria-live="polite" className={cn("inline-flex items-center gap-1", status === "error" ? "text-danger" : status === "saved" ? "text-sage-strong" : "")}>
            {status === "saving" ? <LoaderCircle className="size-3 animate-spin" aria-hidden="true" /> : status === "saved" ? <Check className="size-3" aria-hidden="true" /> : null}
            {status === "saved" ? "Saved" : status === "saving" ? "Saving…" : status === "dirty" ? "Unsaved changes" : "Couldn't save"}
          </span>
          <button type="button" onClick={onDelete} className="inline-flex items-center gap-1 rounded-md px-1 text-muted-foreground hover:text-danger focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="Delete note">
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete
          </button>
        </span>
      </div>
      <Label htmlFor={editorId} className="sr-only">
        Edit note
      </Label>
      <Textarea id={editorId} value={body} onChange={(e) => schedule(e.target.value)} rows={Math.min(10, Math.max(2, body.split("\n").length))} maxLength={20_000} className="min-h-0" />
    </li>
  );
}

export { NotesPanel };
