"use client";

/**
 * Action-step checklist: optimistic checkboxes, XP chips, uploads, forum /
 * quiz / testimonial links and nested sub-items.
 */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardList, ExternalLink, FileCheck, MessageSquare, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toaster";
import { completeActionStepAction, uncompleteActionStepAction, uploadActionStepAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { STEP_KIND_LABEL } from "./format";
import { toastCompletion } from "./mark-complete";
import { TestimonialDialog } from "./testimonial-dialog";
import type { ActionStepView, CompletionResult } from "./types";

const ACCEPT: Record<NonNullable<ActionStepView["uploadType"]>, string> = {
  photo: "image/jpeg,image/png,image/webp,image/heic,image/heif",
  pdf: ".pdf,application/pdf",
  journal: ".pdf,.jpg,.jpeg,.png,.webp,.txt,.md,.docx",
  any: ".pdf,.jpg,.jpeg,.png,.webp,.txt,.md,.docx,.xlsx",
};

export interface ActionStepsProps {
  steps: ActionStepView[];
  courseId: string;
  defaultName: string;
  xpEarned: number;
  xpTotal: number;
  /** Extra content rendered under a given step (e.g. the M7T5 survey review). */
  extras?: Record<string, React.ReactNode>;
  className?: string;
}

function ActionSteps({ steps, courseId, defaultName, xpEarned, xpTotal, extras, className }: ActionStepsProps) {
  const [rows, setRows] = React.useState(steps);
  const [earned, setEarned] = React.useState(xpEarned);
  React.useEffect(() => setRows(steps), [steps]);
  React.useEffect(() => setEarned(xpEarned), [xpEarned]);

  const patch = React.useCallback((stepId: string, p: Partial<ActionStepView>) => {
    setRows((prev) => prev.map((r) => (r.id === stepId ? { ...r, ...p } : r)));
  }, []);
  const addXp = React.useCallback((n: number) => setEarned((e) => e + n), []);

  if (rows.length === 0) {
    return <p className={cn("text-sm text-muted-foreground", className)}>This lesson has no action steps. Take what you need from it and move on when you are ready.</p>;
  }

  const pct = xpTotal > 0 ? Math.min(100, Math.round((100 * earned) / xpTotal)) : 0;
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="card-soft flex items-center gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {earned} of {xpTotal} XP earned in this lesson
          </p>
          <Progress value={pct} size="sm" tone="gold" className="mt-2" aria-label={`${pct}% of lesson XP earned`} />
        </div>
        <p className="shrink-0 text-xs text-muted-foreground">Every step counts. Skip what does not serve you today.</p>
      </div>
      <ol className="flex flex-col gap-3">
        {rows.map((step) => (
          <StepRow key={step.id} step={step} courseId={courseId} defaultName={defaultName} onPatch={patch} onXp={addXp} extra={extras?.[step.id]} />
        ))}
      </ol>
    </div>
  );
}

function StepRow({ step, courseId, defaultName, onPatch, onXp, extra }: { step: ActionStepView; courseId: string; defaultName: string; onPatch: (id: string, p: Partial<ActionStepView>) => void; onXp: (n: number) => void; extra?: React.ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [uploading, startUpload] = React.useTransition();
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const needsUpload = step.requiresUpload && !step.uploadPath;
  const checkboxId = `step-${step.id}`;

  function applyResult(res: CompletionResult, title: string) {
    onPatch(step.id, { completed: res.stepCompleted ?? true, subItemsDone: res.subItemsDone ?? step.subItemsDone });
    if (res.xpAwarded > 0) onXp(res.xpAwarded);
    toastCompletion(res, { title, router });
  }

  function toggle(next: boolean) {
    if (next) {
      if (needsUpload) {
        toast("Upload your file first, then this step ticks itself.");
        return;
      }
      onPatch(step.id, { completed: true, subItemsDone: step.subItems ? step.subItems.map((s) => s.key) : step.subItemsDone });
      startTransition(async () => {
        const res = await completeActionStepAction({ stepId: step.id });
        if (!res.ok) {
          onPatch(step.id, { completed: false, subItemsDone: step.subItemsDone });
          toast.error(res.error ?? "We couldn't save that step just now.");
          return;
        }
        applyResult(res, "Step complete");
      });
    } else {
      const prev = { completed: step.completed, subItemsDone: step.subItemsDone };
      onPatch(step.id, { completed: false, subItemsDone: [] });
      startTransition(async () => {
        const res = await uncompleteActionStepAction({ stepId: step.id });
        if (!res.ok) {
          onPatch(step.id, prev);
          toast.error(res.error ?? "We couldn't update that step just now.");
          return;
        }
        onXp(-(step.xp));
        toast("Step unticked. Tick it again whenever you are ready.");
      });
    }
  }

  function completeSub(key: string) {
    const before = step.subItemsDone;
    onPatch(step.id, { subItemsDone: [...before, key] });
    startTransition(async () => {
      const res = await completeActionStepAction({ stepId: step.id, subItemKey: key });
      if (!res.ok) {
        onPatch(step.id, { subItemsDone: before });
        toast.error(res.error ?? "We couldn't save that just now.");
        return;
      }
      applyResult(res, res.stepCompleted ? "Step complete" : "Saved");
    });
  }

  function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setUploadError("Please choose a file first.");
      return;
    }
    setUploadError(null);
    const fd = new FormData(form);
    startUpload(async () => {
      const res = await uploadActionStepAction(fd);
      if (!res.ok) {
        setUploadError(res.error ?? "We couldn't save that file just now.");
        return;
      }
      onPatch(step.id, { uploadPath: "uploaded", uploadFileName: res.uploadFileName ?? file.name, uploadUrl: res.uploadUrl ?? null });
      applyResult(res, "Upload saved");
      form.reset();
    });
  }

  const quizLabel = step.link.type === "survey" ? "Open the survey" : step.quizTitle?.toLowerCase().includes("survey") ? "Review your survey" : "Take the quiz";

  return (
    <li className={cn("card-soft p-4 transition-colors", step.completed && "border-sage/40 bg-sage-soft/30")}>
      <div className="flex items-start gap-3">
        <Checkbox
          id={checkboxId}
          checked={step.completed}
          disabled={pending || (needsUpload && !step.completed)}
          onCheckedChange={(v) => toggle(v === true)}
          aria-describedby={`${checkboxId}-meta`}
          className="mt-0.5"
        />
        <div className="min-w-0 flex-1">
          <Label htmlFor={checkboxId} className={cn("block text-base leading-snug font-semibold", step.completed && "text-sage-strong")}>
            {step.label}
          </Label>
          <p id={`${checkboxId}-meta`} className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="muted">{STEP_KIND_LABEL[step.kind]}</Badge>
            <Badge variant="gold">+{step.xp} XP</Badge>
            {needsUpload && !step.completed ? <span>Upload a file to complete this step.</span> : null}
          </p>

          {step.subItems && step.subItems.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2 border-l-2 border-gold/50 pl-3">
              {step.subItems.map((sub) => {
                const done = step.completed || step.subItemsDone.includes(sub.key);
                const subId = `${checkboxId}-${sub.key}`;
                return (
                  <li key={sub.key} className="flex items-start gap-2">
                    <Checkbox id={subId} checked={done} disabled={done || pending} onCheckedChange={(v) => v === true && completeSub(sub.key)} className="mt-0.5 size-4" />
                    <Label htmlFor={subId} className={cn("text-sm leading-snug font-normal", done && "text-sage-strong")}>
                      {sub.label}
                      <span className="ml-1 text-xs font-semibold text-warning">+{sub.xp} XP</span>
                    </Label>
                  </li>
                );
              })}
              {step.subItemsDone.length > 0 && !step.completed ? <li className="text-xs text-muted-foreground">Untick the whole step to start over.</li> : null}
            </ul>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2 empty:hidden">
            {step.forumHref ? (
              <Button asChild size="sm" variant="outline">
                <Link href={step.forumHref}>
                  <MessageSquare aria-hidden="true" />
                  Open the forum thread
                </Link>
              </Button>
            ) : null}
            {step.quizHref ? (
              <Button asChild size="sm" variant={step.completed ? "outline" : "secondary"}>
                <Link href={step.quizHref}>
                  <ClipboardList aria-hidden="true" />
                  {quizLabel}
                </Link>
              </Button>
            ) : null}
            {step.link.type === "testimonial" ? <TestimonialDialog stepId={step.id} courseId={courseId} defaultName={defaultName} completed={step.completed} onCompleted={(res) => res && applyResult(res, "Thank you")} /> : null}
          </div>

          {step.requiresUpload ? (
            <div className="mt-3 rounded-lg border border-dashed border-border bg-cream-2/50 p-3">
              {step.uploadFileName ? (
                <p className="mb-2 inline-flex flex-wrap items-center gap-2 text-sm">
                  <FileCheck className="size-4 text-sage-strong" aria-hidden="true" />
                  <span className="font-medium">{step.uploadFileName}</span>
                  {step.uploadUrl ? (
                    <a href={step.uploadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-strong underline underline-offset-4">
                      Open
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </a>
                  ) : null}
                </p>
              ) : null}
              <form onSubmit={upload} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="hidden" name="stepId" value={step.id} />
                <Label htmlFor={`${checkboxId}-file`} className="sr-only">
                  {step.uploadFileName ? "Replace your file" : "Choose a file"}
                </Label>
                <input
                  ref={fileRef}
                  id={`${checkboxId}-file`}
                  name="file"
                  type="file"
                  accept={ACCEPT[step.uploadType ?? "any"]}
                  aria-describedby={uploadError ? `${checkboxId}-file-error` : undefined}
                  className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-rose-soft file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-rose-strong hover:file:bg-rose-soft/80"
                />
                <Button type="submit" size="sm" loading={uploading}>
                  <Upload aria-hidden="true" />
                  {step.uploadFileName ? "Replace" : "Upload"}
                </Button>
              </form>
              {uploadError ? (
                <p id={`${checkboxId}-file-error`} role="alert" className="mt-2 text-xs font-medium text-danger">
                  {uploadError}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  {step.uploadType === "photo" ? "JPG, PNG or WebP, up to 10 MB." : step.uploadType === "pdf" ? "PDF, up to 20 MB." : "PDF, image, text or Word file, up to 20 MB."} Private to you and Cynthia.
                </p>
              )}
            </div>
          ) : null}

          {extra ? <div className="mt-4">{extra}</div> : null}
        </div>
      </div>
    </li>
  );
}

export { ActionSteps };
