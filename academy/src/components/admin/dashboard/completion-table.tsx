import * as React from "react";
import { Leaf } from "lucide-react";
import type { AdminDashboardStats } from "@/lib/usecases/admin";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";

/** Completion rate per module: the share of active enrollments that finished every lesson. */
function CompletionTable({ rows }: { rows: AdminDashboardStats["completion_by_module"] }) {
  const multiCourse = new Set(rows.map((r) => r.course_title)).size > 1;
  return (
    <section aria-labelledby="completion-title" className="card-soft p-5 sm:p-6">
      <div className="mb-4">
        <p className="eyebrow">Completion</p>
        <h2 id="completion-title" className="mt-1 font-serif text-xl font-medium">
          Module completion
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Share of enrolled learners who have finished every lesson in the module.</p>
      </div>
      {rows.length === 0 ? (
        <EmptyState size="sm" icon={<Leaf />} title="No modules yet" description="Import or create a course to see completion here." />
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((r) => {
            const pct = Math.round(r.rate * 100);
            return (
              <li key={`${r.course_title}-${r.module_code}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 py-3">
                <span className="w-14 font-mono text-xs font-semibold text-muted-foreground">{r.module_code}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {r.module_title}
                    {multiCourse ? <span className="ml-2 text-xs font-normal text-muted-foreground">{r.course_title}</span> : null}
                  </p>
                  <Progress value={pct} size="sm" tone="sage" className="mt-1.5" aria-label={`${r.module_title}: ${pct}% complete`} />
                </div>
                <div className="text-right tabular-nums">
                  <p className="text-sm font-semibold text-foreground">{pct}%</p>
                  <p className="text-xs text-muted-foreground">
                    {r.completed}/{r.enrolled}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export { CompletionTable };
