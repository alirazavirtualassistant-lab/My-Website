"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toaster";
import { Illustration, isIllustrationName } from "@/components/shared/illustration";
import { removeCourseThumbnailAction } from "@/app/admin/(panel)/courses/actions";
import { uploadWithProgress, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard } from "./form-bits";
import { ConfirmDialog } from "./confirm-dialog";

/**
 * Course thumbnail: uploads go straight to the admin media route (so large
 * images are not bound by the Server Action body limit) and the page refreshes.
 */
function CourseThumbnailCard({ courseId, thumbnailUrl, illustration }: { courseId: string; thumbnailUrl: string | null; illustration: string | null }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState<number | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setProgress(0);
    const fd = new FormData();
    fd.set("file", file, file.name);
    try {
      await uploadWithProgress(`/api/admin/video/course-thumbnail/${encodeURIComponent(courseId)}`, fd, { onProgress: (p) => setProgress(p.percent) });
      toast.success("Thumbnail updated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <AdminCard id="thumbnail" title="Thumbnail" description="JPG, PNG or WebP up to 10 MB. Without one, the illustration is used.">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex aspect-video w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-border bg-cream-2/60">
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt="Current course thumbnail" className="h-full w-full object-cover" />
          ) : (
            <Illustration name={isIllustrationName(illustration) ? illustration : "leaves"} size={96} className="text-rose-strong" />
          )}
        </div>
        <div className="flex flex-col gap-3">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="course-thumb-input" onChange={(e) => onFile(e.target.files?.[0])} />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={progress !== null}>
            <Upload /> {thumbnailUrl ? "Replace image" : "Upload image"}
          </Button>
          {progress !== null ? <Progress value={progress} size="sm" aria-label="Upload progress" /> : null}
          {thumbnailUrl ? (
            <ConfirmDialog
              trigger={
                <Button type="button" variant="ghost" className="justify-start text-danger">
                  <Trash2 /> Remove thumbnail
                </Button>
              }
              title="Remove the thumbnail?"
              description="The course will fall back to its illustration."
              confirmLabel="Remove"
              onConfirm={async () => {
                const res = await removeCourseThumbnailAction(courseId);
                if (res.status === "error") {
                  toast.error(res.summary?.[0] ?? "Could not remove the thumbnail.");
                  throw new Error("failed");
                }
                toast.success("Thumbnail removed.");
                router.refresh();
              }}
            />
          ) : (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="size-3.5" aria-hidden="true" /> No thumbnail yet
            </p>
          )}
        </div>
      </div>
    </AdminCard>
  );
}

export { CourseThumbnailCard };
