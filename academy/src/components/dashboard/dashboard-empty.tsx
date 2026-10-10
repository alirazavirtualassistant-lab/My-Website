import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, PlayCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";
import type { PreviewLessonLink } from "./types";

export interface DashboardEmptyProps {
  firstName: string;
  previews: PreviewLessonLink[];
}

/** No enrolments yet: a warm invitation plus the free preview lessons. */
function DashboardEmpty({ firstName, previews }: DashboardEmptyProps) {
  return (
    <div className="grid gap-8">
      <EmptyState
        icon={<Illustration name="path" className="text-rose-strong" />}
        title={`Your learning home is ready, ${firstName}`}
        description="Once you join a course it will live here with your progress, XP and next steps. Until then, you are welcome to look around."
        action={
          <>
            <Button asChild size="lg">
              <Link href="/courses">
                Browse courses
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </>
        }
      />
      {previews.length > 0 ? (
        <section aria-labelledby="previews-heading" className="card-soft p-5 sm:p-6">
          <p className="eyebrow">Free to watch</p>
          <h2 id="previews-heading" className="mt-1 text-2xl">
            Try a preview lesson
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">No sign-up or purchase needed — a feel for the pace and the voice.</p>
          <ul className="mt-4 divide-y divide-border">
            {previews.slice(0, 6).map((p) => (
              <li key={p.lesson.id}>
                <Link
                  href={p.href}
                  className="group flex items-center gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                >
                  <PlayCircle className="size-5 shrink-0 text-rose-strong" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground group-hover:text-rose-strong">{p.lesson.title}</span>
                    <span className="block text-xs text-muted-foreground">{p.courseTitle}</span>
                  </span>
                  {p.lesson.duration_sec > 0 ? (
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {formatDuration(p.lesson.duration_sec)}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export { DashboardEmpty };
