import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, LockKeyhole, Play } from "lucide-react";
import { humanizeUnlock } from "@/lib/domain/drip";
import { cn, formatClock, formatDate, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { ContinuePick } from "./pick-continue";

export interface ContinueHeroProps extends React.ComponentProps<"section"> {
  pick: ContinuePick;
  /** Injectable clock for the unlock phrase (defaults to now). */
  now?: Date;
  timeZone?: string | null;
}

/** "Continue where you left off": the most recently active course's next lesson. */
function ContinueHero({ pick, now = new Date(), timeZone, className, ...props }: ContinueHeroProps) {
  const locked = !pick.unlocked;
  const unlockPhrase = pick.unlocksAt ? humanizeUnlock(new Date(pick.unlocksAt), now, timeZone ?? undefined) : null;
  const eyebrow = locked ? "Up next" : pick.isFresh ? "Start here" : "Continue where you left off";
  const cta = locked ? "Open the course" : pick.isFresh || pick.resumeSec === 0 ? "Start lesson" : "Continue lesson";
  return (
    <section
      aria-labelledby="continue-heading"
      className={cn("card-soft relative overflow-hidden p-5 sm:p-7", className)}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-rose/70 to-transparent" />
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {pick.courseTitle}
            {pick.moduleTitle ? (
              <>
                <span aria-hidden="true"> · </span>
                <span className="text-sage-strong">
                  {pick.moduleCode ? `${pick.moduleCode} · ` : ""}
                  {pick.moduleTitle}
                </span>
              </>
            ) : null}
          </p>
          <h2 id="continue-heading" className="mt-1 text-balance text-2xl sm:text-3xl">
            {pick.lesson.title}
          </h2>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground" aria-label="Lesson details">
            {pick.lesson.duration_sec > 0 ? (
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {formatDuration(pick.lesson.duration_sec)}
              </li>
            ) : null}
            {!locked && pick.resumeSec > 0 ? (
              <li className="inline-flex items-center gap-1.5">
                <Play className="size-4" aria-hidden="true" />
                Resume at {formatClock(pick.resumeSec)}
              </li>
            ) : null}
            {locked && unlockPhrase ? (
              <li className="inline-flex items-center gap-1.5 text-warning">
                <LockKeyhole className="size-4" aria-hidden="true" />
                <span className="capitalize">{unlockPhrase}</span>
                {pick.unlocksAt ? <span className="text-muted-foreground">({formatDate(pick.unlocksAt, { month: "short", day: "numeric" })})</span> : null}
              </li>
            ) : null}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={pick.href}>
                {cta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/learn/${pick.courseSlug}`}>Course home</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-2">
          <ProgressRing value={pick.percent} size="lg" tone="rose" label={`${pick.percent}% of the course complete`} />
          <p className="text-sm text-muted-foreground tabular-nums md:text-center">
            {pick.completedLessons} of {pick.totalLessons} lessons
          </p>
        </div>
      </div>
    </section>
  );
}

export { ContinueHero };
