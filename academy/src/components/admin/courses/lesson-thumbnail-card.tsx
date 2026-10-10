"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { removeThumbnailAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { FilePickButton } from "@/components/admin/media/file-pick-button";
import { uploadLessonMedia, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard } from "./form-bits";
import { ConfirmDialog } from "./confirm-dialog";

function LessonThumbnailCard({ lessonId, courseId, thumbnailUrl }: { lessonId: string; courseId: string; thumbnailUrl: string | null }) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number | null>(null);
  async function upload(file: File) {
    setProgress(0);
    try {
      await uploadLessonMedia(lessonId, "thumbnail", file, {}, { onProgress: (p) => setProgress(p.percent) });
      toast.success("Thumbnail updated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }
  return (
    <AdminCard id="lesson-thumbnail" title="Thumbnail" description="Poster image for the player and the lesson list. JPG, PNG or WebP up to 10 MB.">
      <div className="flex gap-4">
        <div className="flex aspect-video w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-cream-2/60">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt="Current lesson thumbnail" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <FilePickButton accept="image/jpeg,image/png,image/webp" label={thumbnailUrl ? "Replace image" : "Upload image"} onFile={upload} progress={progress} />
          {thumbnailUrl ? (
            <ConfirmDialog
              trigger={
                <Button type="button" variant="ghost" size="sm" className="justify-start text-danger">
                  <Trash2 /> Remove
                </Button>
              }
              title="Remove the thumbnail?"
              confirmLabel="Remove"
              onConfirm={async () => {
                const res = await removeThumbnailAction(lessonId, courseId);
                if (res.status === "error") {
                  toast.error(res.summary?.[0] ?? "Could not remove the thumbnail.");
                  throw new Error("failed");
                }
                toast.success("Thumbnail removed.");
                router.refresh();
              }}
            />
          ) : null}
        </div>
      </div>
    </AdminCard>
  );
}

export { LessonThumbnailCard };
