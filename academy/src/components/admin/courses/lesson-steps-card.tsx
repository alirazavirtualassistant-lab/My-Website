"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ListChecks, Pencil, Plus, Trash2 } from "lucide-react";
import type { ActionStep, ActionStepKind } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { deleteActionStepAction, reorderActionStepsAction, saveActionStepAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { AdminCard, FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { ConfirmDialog } from "./confirm-dialog";
import { NativeSelect } from "./native-select";
import { moveItem, nudge } from "./reorder";

const KIND_LABEL: Record<ActionStepKind, string> = { consumption: "Consumption", implementation: "Implementation", optional: "Optional", rare: "Rare" };
const LINK_LABEL: Record<ActionStep["link"]["type"], string> = { none: "No link", forum: "Share in the forum", quiz: "Open a quiz", survey: "Open a survey", upload: "Upload a file", testimonial: "Leave a testimonial" };

interface SubItemDraft {
  id: string;
  key: string;
  label: string;
  xp: number;
}

let seq = 0;

function StepForm({ step, lessonId, courseId, quizzes, onSaved }: { step: ActionStep | null; lessonId: string; courseId: string; quizzes: Array<{ key: string; title: string }>; onSaved: () => void }) {
  const router = useRouter();
  const action = React.useMemo(() => saveActionStepAction.bind(null, step?.id ?? null, lessonId, courseId), [step?.id, lessonId, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const onSuccess = React.useCallback(() => {
    onSaved();
    router.refresh();
  }, [onSaved, router]);
  useSavedToast(state, onSuccess);
  const errors = state.errors ?? {};
  const [linkType, setLinkType] = React.useState<ActionStep["link"]["type"]>(step?.link.type ?? "none");
  const [requiresUpload, setRequiresUpload] = React.useState(step?.requires_upload ?? false);
  const [subItems, setSubItems] = React.useState<SubItemDraft[]>(() => (step?.sub_items ?? []).map((s) => ({ ...s, id: `sub-${++seq}` })));
  const prefix = step?.id ?? "new-step";
  const initialQuiz = step && (step.link.type === "quiz" || step.link.type === "survey") ? step.link.quiz_key : "";
  const initialUploadType = step?.upload_type ?? (step?.link.type === "upload" ? step.link.upload_type : "any");
  const showUpload = requiresUpload || linkType === "upload";

  return (
    <form action={formAction} noValidate className="grid gap-5">
      <FormErrors state={state} />
      <FormStack>
        <FormField id={`${prefix}-label`} label="Label" error={errors.label} required hint="What the learner sees, e.g. “Journal Your Baseline”.">
          <Input name="label" defaultValue={step?.label ?? ""} maxLength={300} required autoFocus />
        </FormField>
        <FormRow className="sm:grid-cols-3">
          <FormField id={`${prefix}-kind`} label="Kind" error={errors.kind} required>
            <NativeSelect name="kind" defaultValue={step?.kind ?? "implementation"}>
              {(Object.keys(KIND_LABEL) as ActionStepKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </NativeSelect>
          </FormField>
          <FormField id={`${prefix}-xp`} label="XP" error={errors.xp} required>
            <Input name="xp" type="number" min={0} max={1000} defaultValue={step?.xp ?? 10} inputMode="numeric" />
          </FormField>
          <FormField id={`${prefix}-link`} label="Link" error={errors.link_type} required>
            <NativeSelect name="link_type" value={linkType} onChange={(e) => setLinkType(e.target.value as ActionStep["link"]["type"])}>
              {(Object.keys(LINK_LABEL) as Array<ActionStep["link"]["type"]>).map((k) => (
                <option key={k} value={k}>
                  {LINK_LABEL[k]}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </FormRow>
        {linkType === "quiz" || linkType === "survey" ? (
          <FormField id={`${prefix}-quiz`} label={linkType === "quiz" ? "Quiz" : "Survey"} error={errors.quiz_key} required>
            <NativeSelect name="quiz_key" defaultValue={initialQuiz}>
              <option value="">— Choose —</option>
              {quizzes.map((q) => (
                <option key={q.key} value={q.key}>
                  {q.title} ({q.key})
                </option>
              ))}
            </NativeSelect>
          </FormField>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Checkbox id={`${prefix}-upload`} name="requires_upload" checked={showUpload} disabled={linkType === "upload"} onCheckedChange={(v) => setRequiresUpload(v === true)} />
            <Label htmlFor={`${prefix}-upload`} className="font-normal">
              Requires an upload to complete
            </Label>
          </div>
          {showUpload ? (
            <FormField id={`${prefix}-upload-type`} label="Upload type" error={errors.upload_type}>
              <NativeSelect name="upload_type" defaultValue={initialUploadType ?? "any"}>
                <option value="any">Any file</option>
                <option value="photo">Photo</option>
                <option value="pdf">PDF</option>
                <option value="journal">Journal (PDF, image or text)</option>
              </NativeSelect>
            </FormField>
          ) : null}
        </div>
        <fieldset className="rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-semibold">Sub-checklist</legend>
          <p className="text-xs text-muted-foreground">Optional smaller items with their own XP (like the three pre-actions).</p>
          <ol className="mt-3 space-y-2">
            {subItems.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[1fr_5rem_auto] items-center gap-2">
                <input type="hidden" name="sub_key[]" value={s.key} />
                <div>
                  <label className="sr-only" htmlFor={`${s.id}-label`}>
                    Sub-item {i + 1} label
                  </label>
                  <Input id={`${s.id}-label`} name="sub_label[]" value={s.label} maxLength={300} onChange={(e) => setSubItems((items) => items.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)))} />
                </div>
                <div>
                  <label className="sr-only" htmlFor={`${s.id}-xp`}>
                    Sub-item {i + 1} XP
                  </label>
                  <Input id={`${s.id}-xp`} name="sub_xp[]" type="number" min={0} max={1000} value={s.xp} inputMode="numeric" onChange={(e) => setSubItems((items) => items.map((x) => (x.id === s.id ? { ...x, xp: Number(e.target.value) || 0 } : x)))} />
                </div>
                <div className="flex items-center">
                  <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move sub-item ${i + 1} up`} disabled={i === 0} onClick={() => setSubItems((items) => moveItem(items, i, i - 1))}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move sub-item ${i + 1} down`} disabled={i === subItems.length - 1} onClick={() => setSubItems((items) => moveItem(items, i, i + 1))}>
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Remove sub-item ${i + 1}`} onClick={() => setSubItems((items) => items.filter((x) => x.id !== s.id))}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setSubItems((items) => [...items, { id: `sub-${++seq}`, key: "", label: "", xp: 10 }])}>
            <Plus /> Add sub-item
          </Button>
        </fieldset>
      </FormStack>
      <div className="flex justify-end">
        <SaveButton>{step ? "Save step" : "Add step"}</SaveButton>
      </div>
    </form>
  );
}

function StepDialog({ step, lessonId, courseId, quizzes, trigger }: { step: ActionStep | null; lessonId: string; courseId: string; quizzes: Array<{ key: string; title: string }>; trigger: React.ReactElement }) {
  const [open, setOpen] = React.useState(false);
  const onSaved = React.useCallback(() => setOpen(false), []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{step ? "Edit action step" : "Add an action step"}</DialogTitle>
          <DialogDescription>Action steps earn XP when learners tick them off. Kinds mirror the course sheet columns.</DialogDescription>
        </DialogHeader>
        {open ? <StepForm step={step} lessonId={lessonId} courseId={courseId} quizzes={quizzes} onSaved={onSaved} /> : null}
      </DialogContent>
    </Dialog>
  );
}

/** Action steps list with add/edit/reorder/delete. */
function LessonStepsCard({ lessonId, courseId, steps, quizzes }: { lessonId: string; courseId: string; steps: ActionStep[]; quizzes: Array<{ key: string; title: string }> }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const total = steps.reduce((n, s) => n + s.xp, 0);

  function move(id: string, delta: -1 | 1) {
    const next = nudge(steps, id, delta);
    if (next.map((s) => s.id).join() === steps.map((s) => s.id).join()) return;
    startTransition(async () => {
      const res = await reorderActionStepsAction(lessonId, courseId, next.map((s) => s.id));
      if (res.status === "error") toast.error(res.summary?.[0] ?? "Could not reorder.");
      router.refresh();
    });
  }

  return (
    <AdminCard
      id="lesson-steps"
      title="Action steps"
      description={`What learners do after watching. ${total} XP in total.`}
      actions={
        <StepDialog
          step={null}
          lessonId={lessonId}
          courseId={courseId}
          quizzes={quizzes}
          trigger={
            <Button type="button" size="sm">
              <Plus /> Add step
            </Button>
          }
        />
      }
    >
      {steps.length === 0 ? (
        <EmptyState size="sm" icon={<ListChecks />} title="No action steps yet" description="Add the small, repeatable actions that go with this lesson." />
      ) : (
        <ol className="divide-y divide-border">
          {steps.map((s, i) => (
            <li key={s.id} className="flex items-start gap-3 py-3">
              <span className="mt-0.5 w-6 shrink-0 font-serif text-lg text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline">{KIND_LABEL[s.kind]}</Badge>
                  <Badge variant="gold">{s.xp} XP</Badge>
                  {s.link.type !== "none" ? <Badge variant="muted">{LINK_LABEL[s.link.type]}{"quiz_key" in s.link ? ` · ${s.link.quiz_key}` : ""}</Badge> : null}
                  {s.requires_upload ? <Badge variant="muted">Upload: {s.upload_type ?? "any"}</Badge> : null}
                  {s.sub_items?.length ? <Badge variant="muted">{s.sub_items.length} sub-items</Badge> : null}
                </p>
                {s.source_label && s.source_label !== s.label ? <p className="mt-1 text-xs text-muted-foreground">Sheet: {s.source_label}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move step ${i + 1} up`} disabled={i === 0 || pending} onClick={() => move(s.id, -1)}>
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move step ${i + 1} down`} disabled={i === steps.length - 1 || pending} onClick={() => move(s.id, 1)}>
                  <ArrowDown />
                </Button>
                <StepDialog
                  step={s}
                  lessonId={lessonId}
                  courseId={courseId}
                  quizzes={quizzes}
                  trigger={
                    <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Edit step ${i + 1}`}>
                      <Pencil />
                    </Button>
                  }
                />
                <ConfirmDialog
                  trigger={
                    <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Delete step ${i + 1}`}>
                      <Trash2 />
                    </Button>
                  }
                  title="Delete this action step?"
                  description={`“${s.label}” and learners’ completions of it will be removed. XP already awarded stays in their ledger.`}
                  confirmLabel="Delete step"
                  onConfirm={async () => {
                    const res = await deleteActionStepAction(s.id, lessonId, courseId);
                    if (res.status === "error") {
                      toast.error(res.summary?.[0] ?? "Could not delete the step.");
                      throw new Error("failed");
                    }
                    toast.success("Action step deleted.");
                    router.refresh();
                  }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </AdminCard>
  );
}

export { LessonStepsCard };
