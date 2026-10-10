"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Captions, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { removeCaptionsAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { FilePickButton } from "@/components/admin/media/file-pick-button";
import { uploadLessonMedia, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard } from "./form-bits";
import { ConfirmDialog } from "./confirm-dialog";

function LessonCaptionsCard({ lessonId, courseId, captionsPath, captionsUrl }: { lessonId: string; courseId: string; captionsPath: string | null; captionsUrl: string | null }) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number | null>(null);
  async function upload(file: File) {
    setProgress(0);
    try {
      await uploadLessonMedia(lessonId, "captions", file, {}, { onProgress: (p) => setProgress(p.percent) });
      toast.success("Captions updated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }
  return (
    <AdminCard id="lesson-captions" title="Captions" description="WebVTT (.vtt) subtitles for the self-hosted player. Mux generates its own when enabled.">
      <div className="space-y-3">
        {captionsPath ? (
          <p className="flex items-center gap-2 text-xs">
            <Captions className="size-4 text-sage-strong" aria-hidden="true" />
            <span className="font-mono break-all">{captionsPath}</span>
            {captionsUrl ? (
              <a href={captionsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-rose-strong underline-offset-4 hover:underline">
                Open <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No captions file yet.</p>
        )}
        <div className="flex flex-wrap gap-2">
          <FilePickButton accept=".vtt,text/vtt,text/plain" label={captionsPath ? "Replace captions" : "Upload .vtt"} onFile={upload} progress={progress} />
          {captionsPath ? (
            <ConfirmDialog
              trigger={
                <Button type="button" variant="ghost" size="sm" className="text-danger">
                  <Trash2 /> Remove
                </Button>
              }
              title="Remove captions?"
              confirmLabel="Remove"
              onConfirm={async () => {
                const res = await removeCaptionsAction(lessonId, courseId);
                if (res.status === "error") {
                  toast.error(res.summary?.[0] ?? "Could not remove the captions.");
                  throw new Error("failed");
                }
                toast.success("Captions removed.");
                router.refresh();
              }}
            />
          ) : null}
        </div>
      </div>
    </AdminCard>
  );
}

export { LessonCaptionsCard };
