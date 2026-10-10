"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, FileArchive, FileSpreadsheet, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toaster";
import { formatBytes, uploadWithProgress, UploadError } from "@/components/admin/media/upload-client";

interface UploadResponse {
  ok: true;
  importId: string;
  warnings: number;
}

/**
 * Zip (+ optional workbook) → /api/admin/importer/upload → preview page.
 * Validation problems from the importer are listed inline so the sheet can
 * be fixed and re-uploaded.
 */
function ImportUploadForm() {
  const router = useRouter();
  const [zip, setZip] = React.useState<File | null>(null);
  const [sheet, setSheet] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [parsing, setParsing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [problems, setProblems] = React.useState<string[]>([]);
  const errorRef = React.useRef<HTMLDivElement>(null);
  const busy = progress !== null || parsing;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!zip) {
      setError("Please choose the course package (.zip).");
      setProblems([]);
      return;
    }
    setError(null);
    setProblems([]);
    setProgress(0);
    const fd = new FormData();
    fd.set("zip", zip, zip.name);
    if (sheet) fd.set("sheet", sheet, sheet.name);
    try {
      const res = await uploadWithProgress<UploadResponse>("/api/admin/importer/upload", fd, {
        onProgress: (p) => {
          setProgress(p.percent);
          if (p.percent >= 100) setParsing(true);
        },
      });
      toast.success(res.warnings > 0 ? `Package parsed with ${res.warnings} ${res.warnings === 1 ? "warning" : "warnings"}.` : "Package parsed.");
      router.push(`/admin/importer/${res.importId}`);
    } catch (err) {
      if (err instanceof UploadError) {
        const body = err.body as { problems?: string[] } | null;
        setError(err.message);
        setProblems(Array.isArray(body?.problems) ? body!.problems! : []);
      } else {
        setError("The upload failed. Please try again.");
      }
      setProgress(null);
      setParsing(false);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  }

  return (
    <form onSubmit={submit} noValidate className="card-soft p-5 sm:p-6" aria-labelledby="upload-title">
      <h2 id="upload-title" className="font-serif text-xl font-medium">
        Upload a package
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Nothing is installed until you confirm on the preview.</p>
      {error ? (
        <div ref={errorRef} tabIndex={-1} role="alert" className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <CircleAlert className="mt-0.5 size-5" aria-hidden="true" />
          <div>
            <p className="font-semibold">{error}</p>
            {problems.length > 0 ? (
              <ul className="mt-2 max-h-64 list-disc space-y-1 overflow-y-auto pl-4 font-mono text-xs">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
      <FormStack className="mt-5">
        <FormField id="import-zip" label="Course package (.zip)" required hint={zip ? `${zip.name} · ${formatBytes(zip.size)}` : "The zip exported from the course folder, workbook included."}>
          <Input type="file" accept=".zip,application/zip,application/x-zip-compressed" disabled={busy} onChange={(e) => setZip(e.target.files?.[0] ?? null)} className="file:mr-3 file:rounded-md file:bg-rose-soft file:px-3 file:text-rose-strong" />
        </FormField>
        <FormField id="import-sheet" label="Course sheet override (.xlsx)" hint={sheet ? `${sheet.name} · ${formatBytes(sheet.size)}` : "Only if you edited the workbook outside the zip. It replaces the one inside."}>
          <Input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={busy} onChange={(e) => setSheet(e.target.files?.[0] ?? null)} className="file:mr-3 file:rounded-md file:bg-rose-soft file:px-3 file:text-rose-strong" />
        </FormField>
      </FormStack>
      {progress !== null ? (
        <div className="mt-5" role="status">
          <Progress value={progress} tone="rose" size="sm" aria-label="Upload progress" />
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">{parsing ? "Uploaded. Reading the workbook and files…" : `Uploading… ${progress}%`}</p>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" loading={busy} disabled={!zip}>
          <Upload /> Upload and preview
        </Button>
        <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <FileArchive className="size-3.5" aria-hidden="true" /> zip up to 500 MB
          </span>
          <span className="inline-flex items-center gap-1">
            <FileSpreadsheet className="size-3.5" aria-hidden="true" /> xlsx optional
          </span>
        </span>
      </div>
    </form>
  );
}

export { ImportUploadForm };
