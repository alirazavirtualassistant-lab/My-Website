"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, FileVideo, Trash2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toaster";
import { confirmMuxUploadAction, prepareVideoUploadAction } from "@/app/admin/(panel)/courses/[id]/curriculum/actions";
import { NativeSelect } from "@/components/admin/courses/native-select";
import { assignMatch, isVideoFile, matchVideos, type MatchReason, type VideoMatch } from "./match-videos";
import { formatBytes, uploadLessonMedia, uploadWithProgress, UploadError } from "./upload-client";

export interface BulkLesson {
  id: string;
  code: string;
  title: string;
  planned_video_filename: string | null;
  video: "none" | "processing" | "ready";
  module_code: string;
}

type RowStatus = { kind: "queued" } | { kind: "uploading"; percent: number } | { kind: "done" } | { kind: "error"; message: string };

interface Row extends VideoMatch<File> {
  key: string;
  status: RowStatus;
}

const REASON_LABEL: Record<MatchReason, string> = { filename: "Matched planned filename", code: "Matched lesson code", manual: "Chosen by you", none: "No match" };

let seq = 0;

/**
 * Drop many videos, auto-match them to lessons by planned filename or code
 * prefix, fix any misses by hand and upload sequentially with progress.
 * Mock mode posts to the in-app route; Mux mode PUTs to a direct-upload URL.
 */
function BulkVideoUpload({ courseId, lessons, videoMode }: { courseId: string; lessons: BulkLesson[]; videoMode: "mock" | "mux" }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [running, setRunning] = React.useState(false);

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => isVideoFile(f.name));
    const skipped = Array.from(list).length - files.length;
    if (skipped > 0) toast.info(`${skipped} ${skipped === 1 ? "file was" : "files were"} skipped — only MP4, MOV and WebM videos are accepted.`);
    if (files.length === 0) return;
    setRows((prev) => {
      const taken = new Set(prev.map((r) => r.lesson_id).filter(Boolean) as string[]);
      const free = lessons.filter((l) => !taken.has(l.id));
      const matched = matchVideos(files, free);
      return [...prev, ...matched.map((m) => ({ ...m, key: `row-${++seq}`, status: { kind: "queued" } as RowStatus }))];
    });
  }

  function setLesson(index: number, lessonId: string | null) {
    setRows((prev) => assignMatch(prev, index, lessonId).map((m, i) => ({ ...prev[i], ...m })));
  }

  function patch(key: string, status: RowStatus) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, status } : r)));
  }

  async function uploadOne(row: Row) {
    const lessonId = row.lesson_id!;
    patch(row.key, { kind: "uploading", percent: 0 });
    const prep = await prepareVideoUploadAction(lessonId, row.file.name);
    if (!prep.ok) throw new Error(prep.error);
    const onProgress = (p: { percent: number }) => patch(row.key, { kind: "uploading", percent: p.percent });
    if (prep.mode === "mux") {
      await uploadWithProgress(prep.upload_url, row.file, { method: "PUT", headers: { "Content-Type": row.file.type || "video/mp4" }, onProgress });
      const confirm = await confirmMuxUploadAction(lessonId, prep.upload_id, courseId);
      if (confirm.status === "error") throw new Error(confirm.summary?.[0] ?? "Could not record the upload.");
    } else {
      await uploadLessonMedia(lessonId, "video", row.file, {}, { onProgress });
    }
    patch(row.key, { kind: "done" });
  }

  async function uploadAll() {
    const ready = rows.filter((r) => r.lesson_id && r.status.kind !== "done");
    if (ready.length === 0) {
      toast.info("Match each file to a lesson first.");
      return;
    }
    setRunning(true);
    let ok = 0;
    let failed = 0;
    for (const row of ready) {
      try {
        await uploadOne(row);
        ok += 1;
      } catch (err) {
        failed += 1;
        patch(row.key, { kind: "error", message: err instanceof UploadError || err instanceof Error ? err.message : "Upload failed." });
      }
    }
    setRunning(false);
    if (ok > 0) toast.success(`${ok} ${ok === 1 ? "video" : "videos"} uploaded.${videoMode === "mux" ? " Mux will mark them ready in a few minutes." : ""}`);
    if (failed > 0) toast.error(`${failed} ${failed === 1 ? "upload" : "uploads"} failed — see the table for details.`);
    router.refresh();
  }

  const matchedCount = rows.filter((r) => r.lesson_id).length;
  const takenIds = new Set(rows.map((r) => r.lesson_id).filter(Boolean) as string[]);

  return (
    <section aria-labelledby="bulk-upload-title" className="card-soft p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Media</p>
          <h2 id="bulk-upload-title" className="mt-1 font-serif text-xl font-medium">
            Bulk upload videos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drop the finished videos here. Files are matched to lessons by the planned filename from the sheet (for example <span className="font-mono">M1T1-Intro.mp4</span>) or by the lesson code at the start of the name.
            {videoMode === "mux" ? " Uploads go straight to Mux." : " Uploads are stored with the course files."}
          </p>
        </div>
        <Badge variant="outline" className="shrink-0">
          {videoMode === "mux" ? "Mux" : "Self-hosted"}
        </Badge>
      </div>

      <div
        role="group"
        aria-label="Drop videos here"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn("flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors", dragOver ? "border-rose bg-rose-soft/40" : "border-border bg-cream-2/40")}
      >
        <FileVideo className="size-8 text-rose-strong" aria-hidden="true" />
        <p className="text-sm text-foreground">
          Drag videos here, or{" "}
          <button type="button" className="font-semibold text-rose-strong underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" onClick={() => inputRef.current?.click()}>
            choose files
          </button>
        </p>
        <p className="text-xs text-muted-foreground">MP4, MOV or WebM · up to 2 GB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          multiple
          className="sr-only"
          aria-label="Choose video files"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {rows.length > 0 ? (
        <div className="mt-5 space-y-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Lesson</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Remove</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => {
                const lesson = lessons.find((l) => l.id === row.lesson_id);
                return (
                  <TableRow key={row.key} className={cn(!row.lesson_id && "bg-warning-soft/40")}>
                    <TableCell className="whitespace-normal">
                      <p className="font-mono text-xs break-all text-foreground">{row.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(row.file.size)} · {REASON_LABEL[row.reason]}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <label className="sr-only" htmlFor={`${row.key}-lesson`}>
                        Lesson for {row.file.name}
                      </label>
                      <NativeSelect id={`${row.key}-lesson`} value={row.lesson_id ?? ""} onChange={(e) => setLesson(i, e.target.value || null)} disabled={running || row.status.kind === "done"} className="min-w-56 text-xs" aria-invalid={!row.lesson_id}>
                        <option value="">— Choose a lesson —</option>
                        {lessons.map((l) => (
                          <option key={l.id} value={l.id} disabled={takenIds.has(l.id) && l.id !== row.lesson_id}>
                            {l.code} · {l.title}
                            {l.video === "ready" ? " (has video)" : ""}
                          </option>
                        ))}
                      </NativeSelect>
                      {lesson?.video === "ready" && row.status.kind !== "done" ? <p className="mt-1 text-xs text-warning">This lesson already has a video; uploading replaces it.</p> : null}
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {row.status.kind === "queued" ? (
                        <span className="text-xs text-muted-foreground">{row.lesson_id ? "Ready" : "Needs a lesson"}</span>
                      ) : row.status.kind === "uploading" ? (
                        <div className="w-32">
                          <Progress value={row.status.percent} size="sm" tone="rose" aria-label={`Uploading ${row.file.name}`} />
                          <p className="mt-1 text-xs text-muted-foreground tabular-nums">{row.status.percent}%</p>
                        </div>
                      ) : row.status.kind === "done" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-sage-strong">
                          <CheckCircle2 className="size-4" aria-hidden="true" /> Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-start gap-1 text-xs text-danger">
                          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {row.status.message}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Remove ${row.file.name} from the list`} disabled={running} onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}>
                        <X />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" role="status">
              {matchedCount} of {rows.length} matched
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" disabled={running} onClick={() => setRows([])}>
                <Trash2 /> Clear list
              </Button>
              <Button type="button" size="sm" loading={running} disabled={matchedCount === 0} onClick={uploadAll}>
                <Upload /> Upload {matchedCount > 0 ? `${matchedCount} ${matchedCount === 1 ? "video" : "videos"}` : "videos"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export { BulkVideoUpload };
