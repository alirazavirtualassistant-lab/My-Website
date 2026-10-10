import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { diffPackages } from "@/lib/importer";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { enrolledCount, exportCoursePackage } from "@/lib/usecases/admin-courses";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { ImportSummary } from "@/components/admin/importer/import-summary";
import { ImportDiff } from "@/components/admin/importer/import-diff";
import { ImportActions } from "@/components/admin/importer/import-actions";
import { loadImportSession } from "../_lib/sessions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ importId: string }> }): Promise<Metadata> {
  const { importId } = await params;
  const session = /^[a-f0-9-]{36}$/i.test(importId) ? await loadImportSession(importId) : null;
  return { title: session ? `Preview · ${session.pkg.course.title}` : "Import preview", robots: { index: false, follow: false } };
}

export default async function ImportPreviewPage({ params }: { params: Promise<{ importId: string }> }) {
  const { importId } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(importId)) notFound();
  const session = await loadImportSession(importId);
  if (!session) notFound();
  const { pkg } = session;
  const existing = await getCourseBySlug(pkg.course.slug);
  const [existingPkg, enrolled] = existing ? await Promise.all([exportCoursePackage(existing.id), enrolledCount(existing.id)]) : [null, 0];
  const diff = existingPkg ? diffPackages(existingPkg, pkg) : null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Importer · preview"
        title={pkg.course.title}
        description={
          session.source.kind === "zip"
            ? `From ${session.source.zip_name}${session.source.sheet_name ? ` with ${session.source.sheet_name}` : ""} · parsed ${formatDate(session.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
            : `Bundled package (content/courses/${session.source.slug}) · generated ${formatDate(pkg.generated_at, { month: "short", day: "numeric", year: "numeric" })}`
        }
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/importer">
              <ArrowLeft /> Importer
            </Link>
          </Button>
        }
      />

      {session.warnings.length > 0 ? (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>
            {session.warnings.length} {session.warnings.length === 1 ? "warning" : "warnings"} — the package still imports
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc space-y-0.5 pl-4">
              {session.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <ImportSummary pkg={pkg} fileCount={session.file_count} totalFileBytes={session.total_file_bytes} />
      <ImportDiff diff={diff} existingTitle={existing?.title ?? null} existingStatus={existing?.status ?? null} />
      <ImportActions importId={session.id} existing={existing ? { id: existing.id, title: existing.title, status: existing.status, enrolled } : null} unchanged={diff?.unchanged ?? false} />
    </div>
  );
}
