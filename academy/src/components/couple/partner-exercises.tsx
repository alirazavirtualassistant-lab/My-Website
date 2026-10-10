import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { PartnerExerciseRow } from "./types";

function Mark({ done, label }: { done: boolean | null; label: string }) {
  if (done === null) return <span className="text-xs text-muted-foreground">—</span>;
  return done ? (
    <span className="inline-flex items-center gap-1 text-sage-strong">
      <CheckCircle2 className="size-5" aria-hidden="true" />
      <span className="sr-only">{label}: complete</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <Circle className="size-5" aria-hidden="true" />
      <span className="sr-only">{label}: not yet</span>
    </span>
  );
}

export interface PartnerExercisesProps {
  rows: PartnerExerciseRow[];
  meLabel: string;
  partnerLabel: string | null;
}

/**
 * The shared checklist: every lesson that asks the couple to do something
 * together, with each partner's completion state. Titles are verbatim.
 */
function PartnerExercises({ rows, meLabel, partnerLabel }: PartnerExercisesProps) {
  const done = rows.filter((r) => r.me).length;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">Partner exercises and who has completed each one</caption>
        <thead className="bg-cream-2/60 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-2.5 text-left">
              Lesson
            </th>
            <th scope="col" className="w-16 px-2 py-2.5 text-center">
              You
            </th>
            <th scope="col" className="w-16 px-2 py-2.5 text-center">
              {partnerLabel ? <span className="line-clamp-1">{partnerLabel.split(" ")[0]}</span> : <span className="text-muted-foreground/70">Partner</span>}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.lessonId} className={cn(!r.unlocked && "text-muted-foreground")}>
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  {r.unlocked ? (
                    <Link href={r.href} className="font-semibold text-foreground underline-offset-4 hover:text-rose-strong hover:underline">
                      {r.title}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Lock className="size-3.5" aria-hidden="true" />
                      {r.title}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.moduleCode.replace(/^M(\d+)$/, "Module $1")} · {r.code}
                  {!r.unlocked && r.unlocksAt ? ` · opens ${formatDate(r.unlocksAt, { month: "short", day: "numeric" })}` : ""}
                </p>
              </td>
              <td className="px-2 py-3 text-center">
                <Mark done={r.me} label={meLabel} />
              </td>
              <td className="px-2 py-3 text-center">
                <Mark done={r.partner} label={partnerLabel ?? "Partner"} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-cream-2/40 text-xs text-muted-foreground">
            <td colSpan={3} className="px-4 py-2">
              You have completed {done} of {rows.length} partner lessons. Mark lessons complete from the lesson page.
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export { PartnerExercises };
