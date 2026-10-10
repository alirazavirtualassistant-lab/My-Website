import * as React from "react";
import Link from "next/link";
import { ArrowRight, Award, HeartHandshake, LockKeyhole, Sparkles } from "lucide-react";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Illustration, isIllustrationName } from "@/components/shared/illustration";
import type { UnlockItem } from "./types";

export interface CourseProgressCardProps extends React.ComponentProps<"article"> {
  course: Pick<Course, "slug" | "title" | "subtitle" | "illustration" | "partner_seat_enabled" | "certificate_enabled">;
  percent: number;
  completedLessons: number;
  totalLessons: number;
  xpEarned: number;
  xpTotal: number;
  nextUnlock: UnlockItem | null;
  hasCertificate: boolean;
  /** Admin/assistant QA access (no enrolment). */
  viaAdmin?: boolean;
}

/** One enrolled course: ring, lessons, XP, next unlock and the partner teaser. */
function CourseProgressCard({
  course,
  percent,
  completedLessons,
  totalLessons,
  xpEarned,
  xpTotal,
  nextUnlock,
  hasCertificate,
  viaAdmin = false,
  className,
  ...props
}: CourseProgressCardProps) {
  const art = isIllustrationName(course.illustration) ? course.illustration : "leaves";
  const complete = totalLessons > 0 && completedLessons >= totalLessons;
  return (
    <article className={cn("card-soft flex flex-col gap-5 p-5 sm:p-6", className)} aria-labelledby={`course-${course.slug}`} {...props}>
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-cream-2 text-rose-strong">
          <Illustration name={art} size={44} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`course-${course.slug}`} className="text-balance text-xl leading-tight">
            <Link href={`/learn/${course.slug}`} className="rounded-sm hover:text-rose-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {course.title}
            </Link>
          </h3>
          {course.subtitle ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.subtitle}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hasCertificate ? (
              <Badge variant="success">
                <Award aria-hidden="true" /> Certificate earned
              </Badge>
            ) : complete ? (
              <Badge variant="gold">
                <Sparkles aria-hidden="true" /> All lessons complete
              </Badge>
            ) : null}
            {viaAdmin ? <Badge variant="muted">Team access</Badge> : null}
          </div>
        </div>
        <ProgressRing value={percent} size="sm" tone="sage" label={`${course.title}: ${percent}% complete`} />
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-cream-2/70 px-3 py-2">
          <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Lessons</dt>
          <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
            {completedLessons} <span className="font-normal text-muted-foreground">of {totalLessons}</span>
          </dd>
        </div>
        <div className="rounded-lg bg-cream-2/70 px-3 py-2">
          <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">XP</dt>
          <dd className="mt-0.5 font-semibold text-foreground tabular-nums">
            {xpEarned.toLocaleString("en-US")} <span className="font-normal text-muted-foreground">of {xpTotal.toLocaleString("en-US")}</span>
          </dd>
        </div>
      </dl>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        {nextUnlock ? (
          <>
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground/85">
                {nextUnlock.moduleCode} · {nextUnlock.moduleTitle}
              </span>{" "}
              {nextUnlock.phrase}
            </span>
          </>
        ) : (
          <>
            <Sparkles className="mt-0.5 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
            <span>Every module is open — go at your own pace.</span>
          </>
        )}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-3">
        <Button asChild>
          <Link href={`/learn/${course.slug}`}>
            {complete ? "Revisit course" : completedLessons > 0 ? "Continue" : "Start course"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        {course.partner_seat_enabled ? (
          <Link
            href={`/learn/${course.slug}/couple`}
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-rose-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HeartHandshake className="size-4" aria-hidden="true" />
            Learn as a couple
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export { CourseProgressCard };
