import * as React from "react";
import { Flame } from "lucide-react";
import { cn, pluralize } from "@/lib/utils";
import type { StreakView } from "./types";

export interface StreakFlameProps extends React.ComponentProps<"div"> {
  streak: StreakView;
  variant?: "card" | "inline";
}

/** Gentle copy: a lapsed streak is an invitation, never a failure. */
export function streakHint(streak: StreakView): string {
  if (streak.current <= 0) return "Any lesson, step or note today starts a new streak.";
  if (streak.activeToday) return "You have already shown up today. Lovely.";
  return "One small step today keeps it going.";
}

/** Flame + "N days" with the current streak; soft when the streak is at zero. */
function StreakFlame({ streak, variant = "card", className, ...props }: StreakFlameProps) {
  const lit = streak.current > 0;
  const label = `${pluralize(streak.current, "day")} in a row`;
  if (variant === "inline") {
    return (
      <div data-slot="streak-flame" className={cn("flex items-center gap-2 text-sm", className)} aria-label={`Streak: ${label}`} {...props}>
        <Flame className={cn("size-4", lit ? "fill-gold-soft text-warning" : "text-muted-foreground")} aria-hidden="true" />
        <span className="font-semibold text-foreground tabular-nums">{pluralize(streak.current, "day")}</span>
      </div>
    );
  }
  return (
    <div data-slot="streak-flame" className={cn("flex items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-soft", className)} {...props}>
      <span
        aria-hidden="true"
        className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg", lit ? "bg-gold-soft text-warning" : "bg-muted-bg text-muted-foreground")}
      >
        <Flame className={cn("size-5", lit && "fill-gold/40")} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Current streak</p>
        <p className="mt-1 font-serif text-3xl leading-none font-medium text-foreground tabular-nums">
          {streak.current} <span className="text-xl">{streak.current === 1 ? "day" : "days"}</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{streakHint(streak)}</p>
        {streak.longest > 0 ? <p className="mt-1 text-xs text-muted-foreground tabular-nums">Longest so far: {pluralize(streak.longest, "day")}</p> : null}
      </div>
    </div>
  );
}

export { StreakFlame };
