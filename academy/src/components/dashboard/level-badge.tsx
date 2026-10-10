import * as React from "react";
import type { LevelProgress } from "@/lib/domain/xp";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Illustration, isIllustrationName, type IllustrationName } from "@/components/shared/illustration";

export interface LevelBadgeProps extends React.ComponentProps<"div"> {
  level: LevelProgress;
  /** `card` = full tile with progress bar; `inline` = illustration + label only. */
  variant?: "card" | "inline";
}

/** Seedling → Sprout → Bloom → Harvest; the level keys double as illustration names. */
export function illustrationForLevel(key: string): IllustrationName {
  return isIllustrationName(key) ? key : "seedling";
}

export function formatXp(xp: number): string {
  return `${Math.round(xp).toLocaleString("en-US")} XP`;
}

/** The learner's level with a line-art plant and progress towards the next level. */
function LevelBadge({ level, variant = "card", className, ...props }: LevelBadgeProps) {
  const name = illustrationForLevel(level.level.key);
  const pct = Math.round(level.progress * 100);
  if (variant === "inline") {
    return (
      <div data-slot="level-badge" className={cn("flex items-center gap-3", className)} {...props}>
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong">
          <Illustration name={name} size={36} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Level</p>
          <p className="font-serif text-xl leading-tight font-medium text-foreground">{level.level.label}</p>
        </div>
      </div>
    );
  }
  return (
    <div data-slot="level-badge" className={cn("flex items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-soft", className)} {...props}>
      <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong sm:size-20">
        <Illustration name={name} size={56} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Your level</p>
        <p className="mt-1 font-serif text-3xl leading-none font-medium text-foreground">{level.level.label}</p>
        <p className="mt-2 text-sm text-muted-foreground tabular-nums">{formatXp(level.xp)}</p>
        <div className="mt-3">
          <Progress
            value={pct}
            tone="sage"
            size="sm"
            aria-label={level.next ? `${pct}% of the way from ${level.level.label} to ${level.next.label}` : `${level.level.label}: top level reached`}
          />
          <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
            {level.next ? (
              <>
                <span className="font-semibold text-foreground/80">{level.xpToNext.toLocaleString("en-US")} XP</span> to {level.next.label}
              </>
            ) : (
              "You have reached the top level. Beautifully done."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export { LevelBadge };
