"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, FileDown, Rocket, Trash2 } from "lucide-react";
import type { CourseStatus } from "@/lib/types";
import { pluralize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { discardImportAction } from "@/app/admin/(panel)/importer/actions";
import { installImportAction } from "@/app/admin/(panel)/importer/[importId]/actions";
import { ConfirmDialog } from "@/components/admin/courses/confirm-dialog";

type Mode = "draft" | "published" | "keep";

/**
 * Install buttons. New course: draft or published. Existing course: update in
 * place (keeps status, lesson ids and attached videos) or replace as a draft.
 */
function ImportActions({ importId, existing, unchanged }: { importId: string; existing: { id: string; title: string; status: CourseStatus; enrolled: number } | null; unchanged: boolean }) {
  const router = useRouter();
  const [preserve, setPreserve] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState<Mode | null>(null);

  async function install(mode: Mode) {
    setBusy(mode);
    setError(null);
    try {
      const res = await installImportAction({ importId, mode, preserveCourseFields: preserve });
      // On success the action redirects; reaching here means it returned an error state.
      if (res && res.status === "error") {
        setError(res.summary?.[0] ?? "The import failed.");
        setBusy(null);
      }
    } catch (err) {
      // Next.js redirect() throws; let it propagate. Anything else is a real failure.
      if (err && typeof err === "object" && "digest" in err && String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) throw err;
      setError("The import failed. Please try again.");
      setBusy(null);
    }
  }

  return (
    <section aria-labelledby="install-title" className="card-soft p-5 sm:p-6">
      <h2 id="install-title" className="font-serif text-xl font-medium">
        {existing ? "Install the update" : "Install the course"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {existing
          ? `Lesson ids stay the same, so ${existing.enrolled > 0 ? `the ${pluralize(existing.enrolled, "enrolled learner")} keep` : "learners keep"} their progress. Videos, captions and audio you attached in the CMS are kept.`
          : "The course is created with every module, lesson, resource, quiz and forum category from the package."}
      </p>
      {error ? (
        <p role="alert" className="mt-4 inline-flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {error}
        </p>
      ) : null}
      {existing ? (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-border p-3">
          <Checkbox id="preserve-course-fields" checked={preserve} onCheckedChange={(v) => setPreserve(v === true)} className="mt-0.5" />
          <Label htmlFor="preserve-course-fields" className="flex-col items-start gap-0.5 font-normal">
            <span className="font-semibold">Keep my course settings</span>
            <span className="text-xs text-muted-foreground">Leave the title, descriptions, FAQ and other course-page fields as edited in the CMS; only modules, lessons, resources, quizzes and forum categories change.</span>
          </Label>
        </div>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {existing ? (
          <>
            <ConfirmDialog
              trigger={
                <Button type="button" loading={busy === "keep"} disabled={busy !== null}>
                  <Rocket /> Update existing course
                </Button>
              }
              destructive={false}
              title={`Update “${existing.title}”?`}
              description={unchanged ? "Nothing changes in the content; resource files are refreshed from the package." : `The changes listed above are applied to the ${existing.status} course right away.`}
              confirmLabel="Update course"
              onConfirm={() => install("keep")}
            />
            <ConfirmDialog
              trigger={
                <Button type="button" variant="outline" loading={busy === "draft"} disabled={busy !== null}>
                  <FileDown /> Replace as draft
                </Button>
              }
              title="Replace and set to draft?"
              description="The course is updated and its status becomes Draft, which hides it from the catalogue until you publish again. Enrolled learners keep access to their lessons."
              confirmLabel="Replace as draft"
              onConfirm={() => install("draft")}
            />
          </>
        ) : (
          <>
            <Button type="button" variant="outline" loading={busy === "draft"} disabled={busy !== null} onClick={() => install("draft")}>
              <FileDown /> Import as draft
            </Button>
            <ConfirmDialog
              trigger={
                <Button type="button" loading={busy === "published"} disabled={busy !== null}>
                  <Rocket /> Import and publish
                </Button>
              }
              destructive={false}
              title="Import and publish now?"
              description="The course appears in the catalogue immediately. You can still edit everything afterwards."
              confirmLabel="Import and publish"
              onConfirm={() => install("published")}
            />
          </>
        )}
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" className="text-danger" disabled={busy !== null}>
              <Trash2 /> Discard
            </Button>
          }
          title="Discard this preview?"
          description="The uploaded package is deleted. Nothing installed changes."
          confirmLabel="Discard"
          onConfirm={async () => {
            const res = await discardImportAction(importId);
            if (res.status === "error") {
              toast.error(res.summary?.[0] ?? "Could not discard.");
              throw new Error("failed");
            }
            toast.success("Preview discarded.");
            router.push("/admin/importer");
            router.refresh();
          }}
        />
      </div>
    </section>
  );
}

export { ImportActions };
