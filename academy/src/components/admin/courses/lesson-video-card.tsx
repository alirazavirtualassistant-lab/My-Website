"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2, Video, VideoOff } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { confirmMuxUploadAction, prepareVideoUploadAction } from "@/app/admin/(panel)/courses/[id]/curriculum/actions";
import { removeVideoAction } from "@/app/admin/(panel)/courses/[id]/lessons/[lessonId]/actions";
import { FilePickButton } from "@/components/admin/media/file-pick-button";
import { uploadLessonMedia, uploadWithProgress, UploadError } from "@/components/admin/media/upload-client";
import { AdminCard } from "./form-bits";
import { ConfirmDialog } from "./confirm-dialog";

interface Props {
  lessonId: string;
  courseId: string;
  videoMode: "mock" | "mux";
  provider: Lesson["video_provider"];
  videoUrl: string | null;
  /** Playable URL for self-hosted files (signed), for a quick check. */
  videoSrc: string | null;
  assetId: string | null;
  playbackId: string | null;
  plannedFilename: string | null;
}

/** Current video + upload/replace/remove. Mock mode posts the file; Mux mode PUTs to a direct upload. */
function LessonVideoCard({ lessonId, courseId, videoMode, provider, videoUrl, videoSrc, assetId, playbackId, plannedFilename }: Props) {
  const router = useRouter();
  const [progress, setProgress] = React.useState<number | null>(null);
  const status: "none" | "processing" | "ready" = provider === "none" ? (assetId ? "processing" : "none") : provider === "mux" && !playbackId ? "processing" : "ready";

  async function upload(file: File) {
    setProgress(0);
    try {
      const prep = await prepareVideoUploadAction(lessonId, file.name);
      if (!prep.ok) throw new Error(prep.error);
      const onProgress = (p: { percent: number }) => setProgress(p.percent);
      if (prep.mode === "mux") {
        await uploadWithProgress(prep.upload_url, file, { method: "PUT", headers: { "Content-Type": file.type || "video/mp4" }, onProgress });
        const res = await confirmMuxUploadAction(lessonId, prep.upload_id, courseId);
        if (res.status === "error") throw new Error(res.summary?.[0] ?? "Could not record the upload.");
        toast.success("Video uploaded. Mux is processing it; this page updates when it is ready.");
      } else {
        await uploadLessonMedia(lessonId, "video", file, {}, { onProgress });
        toast.success("Video uploaded.");
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof UploadError || err instanceof Error ? err.message : "The upload failed. Please try again.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <AdminCard
      id="lesson-video"
      title="Video"
      description={videoMode === "mux" ? "Uploads go directly to Mux with signed playback." : "Self-hosted: files are stored privately and streamed with short-lived links."}
      actions={
        <Badge variant={status === "ready" ? "success" : status === "processing" ? "gold" : "muted"}>
          {status === "ready" ? <Video /> : status === "processing" ? <LoaderCircle className="animate-spin" /> : <VideoOff />}
          {status === "ready" ? "Attached" : status === "processing" ? "Processing" : "No video"}
        </Badge>
      }
    >
      <div className="space-y-4">
        {status === "ready" && provider === "url" && videoSrc ? (
          <video controls preload="metadata" src={videoSrc} className="aspect-video w-full rounded-lg bg-ink" aria-label="Current lesson video">
            Your browser does not support embedded video.
          </video>
        ) : null}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-muted-foreground">Provider</dt>
          <dd className="font-mono">{provider}</dd>
          {provider === "url" && videoUrl ? (
            <>
              <dt className="text-muted-foreground">File</dt>
              <dd className="font-mono break-all">{videoUrl}</dd>
            </>
          ) : null}
          {assetId ? (
            <>
              <dt className="text-muted-foreground">{playbackId ? "Asset" : "Upload"}</dt>
              <dd className="font-mono break-all">{assetId}</dd>
            </>
          ) : null}
          {playbackId ? (
            <>
              <dt className="text-muted-foreground">Playback</dt>
              <dd className="font-mono break-all">{playbackId}</dd>
            </>
          ) : null}
          {plannedFilename ? (
            <>
              <dt className="text-muted-foreground">Planned file</dt>
              <dd className="font-mono break-all">{plannedFilename}</dd>
            </>
          ) : null}
        </dl>
        {status === "processing" ? <p className="rounded-md border border-gold/50 bg-gold-soft/50 px-3 py-2 text-xs text-foreground">Mux is still preparing this video. The lesson shows “coming soon” until the webhook marks it ready.</p> : null}
        <div className="flex flex-wrap items-start gap-2">
          <FilePickButton accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" label={status === "none" ? "Upload video" : "Replace video"} pendingLabel="Uploading video…" onFile={upload} progress={progress} />
          {status !== "none" ? (
            <ConfirmDialog
              trigger={
                <Button type="button" variant="ghost" size="sm" className="text-danger" disabled={progress !== null}>
                  <Trash2 /> Remove video
                </Button>
              }
              title="Remove this video?"
              description="Learners will see “video coming soon” until a new one is uploaded."
              confirmLabel="Remove video"
              onConfirm={async () => {
                const res = await removeVideoAction(lessonId, courseId);
                if (res.status === "error") {
                  toast.error(res.summary?.[0] ?? "Could not remove the video.");
                  throw new Error("failed");
                }
                toast.success("Video removed.");
                router.refresh();
              }}
            />
          ) : null}
        </div>
      </div>
    </AdminCard>
  );
}

export { LessonVideoCard };
