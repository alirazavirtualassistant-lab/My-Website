"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, Download, FileText, Pencil, Trash2, X } from "lucide-react";
import type { LessonResource } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { deleteResourceAction, renameResourceAction, reorderResourcesAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { FilePickButton } from "@/components/admin/media/file-pick-button";
import { formatBytes, uploadLessonMedia, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard, FormErrors, SaveButton, useSavedToast } from "./form-bits";
import { idleAdminState } from "./form-state";
import { ConfirmDialog } from "./confirm-dialog";
import { nudge } from "./reorder";

export type ResourceRow = LessonResource & { url: string };

function RenameForm({ resource, lessonId, courseId, onDone }: { resource: ResourceRow; lessonId: string; courseId: string; onDone: () => void }) {
  const router = useRouter();
  const action = React.useMemo(() => renameResourceAction.bind(null, resource.id, lessonId, courseId), [resource.id, lessonId, courseId]);
  const [state, formAction] = useActionState(action, idleAdminState);
  const onSaved = React.useCallback(() => {
    onDone();
    router.refresh();
  }, [onDone, router]);
  useSavedToast(state, onSaved);
  return (
    <form action={formAction} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <FormErrors state={state} className="sm:basis-full" />
      <div className="grid flex-1 gap-1.5">
        <Label htmlFor={`rename-${resource.id}`}>Label</Label>
        <Input id={`rename-${resource.id}`} name="label" defaultValue={resource.label} maxLength={200} autoFocus required />
      </div>
      <div className="flex gap-1">
        <SaveButton size="sm">
          <Check /> Save
        </SaveButton>
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          <X /> Cancel
        </Button>
      </div>
    </form>
  );
}

/** Lesson downloads: upload, rename, reorder, delete. */
function LessonResourcesCard({ lessonId, courseId, resources }: { lessonId: string; courseId: string; resources: ResourceRow[] }) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number | null>(null);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  async function upload(file: File) {
    setProgress(0);
    try {
      await uploadLessonMedia(lessonId, "resource", file, {}, { onProgress: (p) => setProgress(p.percent) });
      toast.success(`“${file.name}” added. You can rename its label.`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }

  function move(id: string, delta: -1 | 1) {
    const next = nudge(resources, id, delta);
    if (next.map((r) => r.id).join() === resources.map((r) => r.id).join()) return;
    startTransition(async () => {
      const res = await reorderResourcesAction(lessonId, courseId, next.map((r) => r.id));
      if (res.status === "error") toast.error(res.summary?.[0] ?? "Could not reorder.");
      router.refresh();
    });
  }

  return (
    <AdminCard
      id="lesson-resources"
      title="Resources"
      description="Downloads shown with the lesson. PDF, XLSX, DOCX, MP3, images or text up to 50 MB."
      actions={<FilePickButton accept=".pdf,.xlsx,.docx,.mp3,.png,.jpg,.jpeg,.txt,application/pdf,audio/mpeg,image/*" label="Upload resource" onFile={upload} progress={progress} />}
    >
      {resources.length === 0 ? (
        <EmptyState size="sm" icon={<FileText />} title="No resources yet" description="Upload the workbook, checklist or audio that goes with this lesson." />
      ) : (
        <ol className="divide-y divide-border">
          {resources.map((r, i) => (
            <li key={r.id} className="py-3">
              {editing === r.id ? (
                <RenameForm resource={r} lessonId={lessonId} courseId={courseId} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-soft/60 text-rose-strong">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{r.label}</p>
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span className="font-mono">{r.file_name}</span>
                      <Badge variant="outline" className="uppercase">
                        {r.type}
                      </Badge>
                      <span>{formatBytes(r.size_bytes)}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${r.label} up`} disabled={i === 0 || pending} onClick={() => move(r.id, -1)}>
                      <ArrowUp />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${r.label} down`} disabled={i === resources.length - 1 || pending} onClick={() => move(r.id, 1)}>
                      <ArrowDown />
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <a href={r.url} target="_blank" rel="noreferrer" aria-label={`Download ${r.label}`}>
                        <Download />
                      </a>
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Rename ${r.label}`} onClick={() => setEditing(r.id)}>
                      <Pencil />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Delete ${r.label}`}>
                          <Trash2 />
                        </Button>
                      }
                      title={`Delete “${r.label}”?`}
                      description="The download disappears from the lesson. The file is removed from storage if no other lesson uses it."
                      confirmLabel="Delete resource"
                      onConfirm={async () => {
                        const res = await deleteResourceAction(r.id, lessonId, courseId);
                        if (res.status === "error") {
                          toast.error(res.summary?.[0] ?? "Could not delete the resource.");
                          throw new Error("failed");
                        }
                        toast.success("Resource deleted.");
                        router.refresh();
                      }}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </AdminCard>
  );
}

export { LessonResourcesCard };
