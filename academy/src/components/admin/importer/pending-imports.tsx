"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { ImportSession } from "@/app/admin/(panel)/importer/_lib/sessions";
import { formatDate, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { discardImportAction } from "@/app/admin/(panel)/importer/actions";
import { ConfirmDialog } from "@/components/admin/courses/confirm-dialog";

type Row = Pick<ImportSession, "id" | "created_at" | "source" | "warnings"> & { course_title: string; course_slug: string; lesson_count: number };

/** Parsed packages that have not been installed or discarded yet. */
function PendingImports({ rows }: { rows: Row[] }) {
  const router = useRouter();
  if (rows.length === 0) return null;
  return (
    <section aria-labelledby="pending-title" className="card-soft p-5 sm:p-6">
      <h2 id="pending-title" className="font-serif text-xl font-medium">
        Waiting for review
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Previews you have not installed yet.</p>
      <ul className="mt-4 divide-y divide-border">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Link href={`/admin/importer/${r.id}`} className="text-sm font-semibold text-foreground hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                {r.course_title}
              </Link>
              <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>{r.source.kind === "zip" ? r.source.zip_name : `bundled ${r.source.slug}`}</span>
                <span aria-hidden="true">·</span>
                <span>{pluralize(r.lesson_count, "lesson")}</span>
                <span aria-hidden="true">·</span>
                <span>{formatDate(r.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                {r.warnings.length > 0 ? <Badge variant="gold">{pluralize(r.warnings.length, "warning")}</Badge> : null}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/importer/${r.id}`}>Open preview</Link>
              </Button>
              <ConfirmDialog
                trigger={
                  <Button type="button" variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-danger" aria-label={`Discard preview of ${r.course_title}`}>
                    <Trash2 />
                  </Button>
                }
                title="Discard this preview?"
                description="The uploaded package is deleted. Nothing installed changes."
                confirmLabel="Discard"
                onConfirm={async () => {
                  const res = await discardImportAction(r.id);
                  if (res.status === "error") {
                    toast.error(res.summary?.[0] ?? "Could not discard.");
                    throw new Error("failed");
                  }
                  toast.success("Preview discarded.");
                  router.refresh();
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { PendingImports };
