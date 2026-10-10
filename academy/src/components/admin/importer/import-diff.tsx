import * as React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { PackageDiff } from "@/lib/importer";
import type { CourseStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusBadge } from "@/components/admin/courses/status-badge";

const KIND_VARIANT = { added: "success", removed: "rose", changed: "gold" } as const;
const LEVEL_ORDER = ["course", "module", "lesson", "quiz", "forum", "stats"] as const;

/** Changes between the installed course and the incoming package. */
function ImportDiff({ diff, existingTitle, existingStatus }: { diff: PackageDiff | null; existingTitle: string | null; existingStatus: CourseStatus | null }) {
  if (!diff || !existingTitle || !existingStatus) {
    return (
      <Alert variant="info">
        <Sparkles />
        <AlertTitle>New course</AlertTitle>
        <AlertDescription>No course with this slug is installed yet, so everything in the package is new.</AlertDescription>
      </Alert>
    );
  }
  if (diff.unchanged) {
    return (
      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>No changes</AlertTitle>
        <AlertDescription>The package matches “{existingTitle}” exactly. Installing it again only refreshes resource files.</AlertDescription>
      </Alert>
    );
  }
  return (
    <section aria-labelledby="diff-title" className="card-soft p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="diff-title" className="font-serif text-xl font-medium">
            Compared with what’s live
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            “{existingTitle}” <StatusBadge status={existingStatus} className="mx-1 align-middle" /> — {diff.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {diff.counts.added > 0 ? <Badge variant="success">{diff.counts.added} added</Badge> : null}
          {diff.counts.changed > 0 ? <Badge variant="gold">{diff.counts.changed} changed</Badge> : null}
          {diff.counts.removed > 0 ? <Badge variant="rose">{diff.counts.removed} removed</Badge> : null}
        </div>
      </div>
      <ol className="mt-4 divide-y divide-border">
        {[...diff.changes]
          .sort((a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level))
          .map((c) => (
            <li key={`${c.level}-${c.code}-${c.kind}`} className="py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={KIND_VARIANT[c.kind]}>{c.kind}</Badge>
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">{c.level}</span>
                <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                <span className="text-sm font-semibold text-foreground">{c.title}</span>
              </div>
              {c.details.length > 0 ? (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-xs text-muted-foreground">
                  {c.details.map((d) => (
                    <li key={d} className="break-words">
                      {d}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
      </ol>
    </section>
  );
}

export { ImportDiff };
