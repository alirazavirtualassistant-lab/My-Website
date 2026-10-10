import * as React from "react";
import Link from "next/link";
import type { LevelProgress } from "@/lib/domain/xp";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Illustration } from "@/components/shared/illustration";
import { illustrationForLevel } from "./level-badge";
import { StreakFlame } from "./streak-flame";
import type { StreakView } from "./types";

export interface LearnerAsideProps {
  level: LevelProgress;
  streak: StreakView;
}

/** Compact level ring + streak under the rail nav (desktop only; the shell hides the aside on mobile). */
function LearnerAside({ level, streak }: LearnerAsideProps) {
  const pct = Math.round(level.progress * 100);
  return (
    <Link
      href="/learn"
      className="block rounded-lg border border-border bg-card p-4 text-center shadow-soft transition-colors hover:border-rose/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Level ${level.level.label}, ${Math.round(level.xp).toLocaleString("en-US")} XP${level.next ? `, ${pct}% of the way to ${level.next.label}` : ""}. Streak ${streak.current} ${streak.current === 1 ? "day" : "days"}.`}
    >
      <ProgressRing value={level.next ? pct : 100} size="md" tone="sage" showLabel={false} className="mx-auto" aria-hidden="true" role={undefined}>
        <Illustration name={illustrationForLevel(level.level.key)} size={40} className="text-sage-strong" />
      </ProgressRing>
      <p className="mt-2 font-serif text-lg leading-tight font-medium text-foreground" aria-hidden="true">
        {level.level.label}
      </p>
      <p className="text-xs text-muted-foreground tabular-nums" aria-hidden="true">
        {Math.round(level.xp).toLocaleString("en-US")} XP
        {level.next ? ` · ${level.xpToNext.toLocaleString("en-US")} to ${level.next.label}` : ""}
      </p>
      <div className="mt-3 flex justify-center" aria-hidden="true">
        <StreakFlame streak={streak} variant="inline" />
      </div>
    </Link>
  );
}

export { LearnerAside };
