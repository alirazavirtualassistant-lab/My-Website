import type { Metadata } from "next";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/ui/page-header";
import { ImportUploadForm } from "@/components/admin/importer/import-upload-form";
import { PendingImports } from "@/components/admin/importer/pending-imports";
import { ReimportBundledButton } from "@/components/admin/importer/reimport-bundled-button";
import { listImportSessions } from "./_lib/sessions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Importer", robots: { index: false, follow: false } };

export default async function ImporterPage() {
  const pending = await listImportSessions();
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Course importer"
        description="Upload a course package zip (the folder structure with the course sheet inside). You’ll see a full preview and a comparison with what’s live before anything changes."
        actions={env.demo ? <ReimportBundledButton /> : null}
      />
      <ImportUploadForm />
      <PendingImports rows={pending} />
      <section aria-labelledby="importer-help" className="card-soft p-5 text-sm text-muted-foreground sm:p-6">
        <h2 id="importer-help" className="font-serif text-lg font-medium text-foreground">
          What the importer expects
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            A <span className="font-mono">.zip</span> with the course workbook (<span className="font-mono">.xlsx</span>) at its root and one folder per module (for example <span className="font-mono">01_Module_1_…/Resources</span>, <span className="font-mono">…/Scripts</span>).
          </li>
          <li>Optionally a separate workbook, which replaces the one inside the zip.</li>
          <li>Titles, descriptions, notes, transcripts and action steps are taken verbatim from the sheet. Placeholder links are never shown to learners.</li>
          <li>Re-importing an existing course keeps lesson ids stable, so learners keep their progress. Videos you have attached are kept.</li>
        </ul>
      </section>
    </div>
  );
}
