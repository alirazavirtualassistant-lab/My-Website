"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Headphones, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { addAudioSlotAction, clearAudioSlotAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { FilePickButton } from "@/components/admin/media/file-pick-button";
import { uploadLessonMedia, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard, FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { ConfirmDialog } from "./confirm-dialog";

export interface AudioSlotRow {
  key: string;
  label: string;
  file_path: string | null;
  url: string | null;
}

function SlotRow({ lessonId, courseId, slot }: { lessonId: string; courseId: string; slot: AudioSlotRow }) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number | null>(null);
  async function upload(file: File) {
    setProgress(0);
    try {
      await uploadLessonMedia(lessonId, "audio", file, { slot: slot.key }, { onProgress: (p) => setProgress(p.percent) });
      toast.success(`Audio uploaded for “${slot.label}”.`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }
  async function clear(remove: boolean) {
    const res = await clearAudioSlotAction(lessonId, courseId, slot.key, remove);
    if (res.status === "error") {
      toast.error(res.summary?.[0] ?? "Could not update the slot.");
      throw new Error("failed");
    }
    toast.success(res.message ?? "Updated.");
    router.refresh();
  }
  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <Headphones className="size-4 text-rose-strong" aria-hidden="true" />
            {slot.label}
          </p>
          <p className="mt-0.5 font-mono text-xs break-all text-muted-foreground">{slot.file_path ?? `No file yet · key ${slot.key}`}</p>
        </div>
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Remove slot ${slot.label}`}>
              <Trash2 />
            </Button>
          }
          title={`Remove the “${slot.label}” slot?`}
          description="The slot disappears from the lesson. Any uploaded file is deleted."
          confirmLabel="Remove slot"
          onConfirm={() => clear(true)}
        />
      </div>
      {slot.url ? (
        <audio controls preload="none" src={slot.url} className="mt-3 w-full" aria-label={slot.label}>
          Your browser does not support embedded audio.
        </audio>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <FilePickButton accept="audio/mpeg,.mp3" label={slot.file_path ? "Replace MP3" : "Upload MP3"} onFile={upload} progress={progress} />
        {slot.file_path ? (
          <ConfirmDialog
            trigger={
              <Button type="button" variant="ghost" size="sm" className="text-danger">
                <X /> Clear file
              </Button>
            }
            title="Clear this audio file?"
            description="The slot stays and shows “audio coming soon” until a new file is uploaded."
            confirmLabel="Clear file"
            onConfirm={() => clear(false)}
          />
        ) : null}
      </div>
    </li>
  );
}

function LessonAudioCard({ lessonId, courseId, slots }: { lessonId: string; courseId: string; slots: AudioSlotRow[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const action = React.useMemo(() => addAudioSlotAction.bind(null, lessonId, courseId), [lessonId, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const onSaved = React.useCallback(() => {
    setOpen(false);
    router.refresh();
  }, [router]);
  useSavedToast(state, onSaved);
  return (
    <AdminCard
      id="lesson-audio"
      title="Audio"
      description="Optional MP3s shown beside the video (training audio, session summary…)."
      actions={
        <Button type="button" variant="outline" size="sm" aria-expanded={open} aria-controls="add-audio-slot" onClick={() => setOpen((v) => !v)}>
          <Plus /> Add slot
        </Button>
      }
    >
      {open ? (
        <form id="add-audio-slot" action={formAction} noValidate className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-cream-2/40 p-3 sm:flex-row sm:items-end">
          <FormErrors state={state} className="sm:basis-full" />
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="new-slot-label">Slot label</Label>
            <Input id="new-slot-label" name="label" placeholder="Training audio" maxLength={80} required />
          </div>
          <SaveButton size="sm">Add</SaveButton>
        </form>
      ) : null}
      {slots.length === 0 ? <p className="text-sm text-muted-foreground">No audio slots. Add one to attach an MP3.</p> : null}
      <ul className="space-y-3">
        {slots.map((s) => (
          <SlotRow key={s.key} lessonId={lessonId} courseId={courseId} slot={s} />
        ))}
      </ul>
    </AdminCard>
  );
}

export { LessonAudioCard };
