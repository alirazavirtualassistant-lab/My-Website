"use client";

/**
 * M7T5 "Review Survey & Adjust Goals": the learner's own pre-course survey
 * answers, read-only, above a "Reflect" textarea that is saved as a note.
 */
import * as React from "react";
import Link from "next/link";
import { Check, LoaderCircle, NotebookPen } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { saveNoteAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";

export interface SurveyReviewProps {
  items: Array<{ key: string; question: string; answer: string }>;
  submittedAt: string | null;
  lessonId: string;
  courseId: string;
  /** An existing reflection note to continue editing, if any. */
  existing: { id: string; body: string } | null;
  surveyHref: string | null;
  className?: string;
}

export const REFLECTION_PREFIX = "Reflection on my pre-course survey:";

function SurveyReview({ items, submittedAt, lessonId, courseId, existing, surveyHref, className }: SurveyReviewProps) {
  const [body, setBody] = React.useState(existing ? existing.body.replace(new RegExp(`^${REFLECTION_PREFIX}\\s*`), "") : "");
  const [noteId, setNoteId] = React.useState<string | null>(existing?.id ?? null);
  const [status, setStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  function save() {
    const text = body.trim();
    if (!text) {
      toast("Write a line or two first.");
      return;
    }
    setStatus("saving");
    void saveNoteAction({ lessonId, courseId, noteId, body: `${REFLECTION_PREFIX}\n${text}`, positionSec: null }).then((res) => {
      if (!res.ok || !res.note) {
        setStatus("idle");
        toast.error(res.error ?? "We couldn't save that just now.");
        return;
      }
      setNoteId(res.note.id);
      setStatus("saved");
      toast.success("Reflection saved to your notes");
    });
  }

  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border border-gold/50 bg-gold-soft/30 p-4", className)}>
      <div>
        <p className="eyebrow">Your pre-course survey</p>
        {submittedAt ? <p className="mt-1 text-xs text-muted-foreground">Answered {formatDate(submittedAt)}. Read it slowly: this is where you started.</p> : null}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You have not filled in the pre-course survey yet.{" "}
          {surveyHref ? (
            <Link href={surveyHref} className="font-semibold text-rose-strong underline underline-offset-4">
              Answer it now
            </Link>
          ) : null}{" "}
          and come back to reflect.
        </p>
      ) : (
        <dl className="grid gap-3">
          {items.map((it) => (
            <div key={it.key} className="rounded-md bg-card/80 p-3">
              <dt className="text-sm font-semibold text-foreground">{it.question}</dt>
              <dd className="mt-1 text-sm whitespace-pre-wrap text-foreground/90">{it.answer || <span className="text-muted-foreground">(no answer)</span>}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="grid gap-2">
        <Label htmlFor="survey-reflect" className="inline-flex items-center gap-2">
          <NotebookPen className="size-4 text-rose-strong" aria-hidden="true" />
          Reflect
        </Label>
        <Textarea
          id="survey-reflect"
          rows={4}
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (status === "saved") setStatus("idle");
          }}
          placeholder="What has shifted since you wrote those answers? Which goals stay, which ones change?"
          maxLength={20_000}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span role="status" aria-live="polite" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            {status === "saving" ? <LoaderCircle className="size-3 animate-spin" aria-hidden="true" /> : status === "saved" ? <Check className="size-3 text-sage-strong" aria-hidden="true" /> : null}
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved to your notes" : "Saved as a private note on this lesson."}
          </span>
          <Button type="button" size="sm" onClick={save} loading={status === "saving"}>
            Save reflection
          </Button>
        </div>
      </div>
    </div>
  );
}

export { SurveyReview };
