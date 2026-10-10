import * as React from "react";
import { Award } from "lucide-react";
import type { AdminDashboardStats } from "@/lib/usecases/admin";
import { EmptyState } from "@/components/ui/empty-state";
import { pluralize } from "@/lib/utils";

/** Most-completed lessons. */
function TopLessons({ rows }: { rows: AdminDashboardStats["top_lessons"] }) {
  const max = rows[0]?.completions ?? 0;
  return (
    <section aria-labelledby="top-lessons-title" className="card-soft p-5 sm:p-6">
      <div className="mb-4">
        <p className="eyebrow">Lessons</p>
        <h2 id="top-lessons-title" className="mt-1 font-serif text-xl font-medium">
          Most completed
        </h2>
      </div>
      {rows.length === 0 ? (
        <EmptyState size="sm" icon={<Award />} title="No completions yet" description="Lesson completions will rank here once learners get going." />
      ) : (
        <ol className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.lesson_code || i} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3">
              <span className="font-serif text-lg text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{r.lesson_code}</span>
                  {r.lesson_title}
                </p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${max ? Math.max(4, Math.round((r.completions / max) * 100)) : 0}%` }} />
                </div>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">{pluralize(r.completions, "completion")}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export { TopLessons };
