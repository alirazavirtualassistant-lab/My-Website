import * as React from "react";
import { Award, Flame, Leaf, Lock, Sprout, Star, Target, type LucideIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import type { BadgeGroup, BadgeItem } from "./types";

const ICONS: Record<string, LucideIcon> = { leaf: Leaf, sprout: Sprout, target: Target, star: Star, flame: Flame };

const GROUP_LABELS: Record<BadgeGroup, { title: string; blurb: string }> = {
  goal: { title: "Course goals", blurb: "The three goals from the Welcome Guide. Each one also adds bonus XP." },
  module: { title: "Modules", blurb: "One badge for every core module you finish." },
  streak: { title: "Streaks", blurb: "Showing up on consecutive days." },
};

export interface BadgeGridProps extends React.ComponentProps<"div"> {
  items: BadgeItem[];
  /** Hide the group headings and render one flat grid. */
  flat?: boolean;
}

function BadgeTile({ item }: { item: BadgeItem }) {
  const Icon = ICONS[item.icon] ?? Award;
  return (
    <li
      className={cn(
        "flex gap-3 rounded-lg border p-4 transition-colors",
        item.earned ? "border-gold/60 bg-card shadow-soft" : "border-dashed border-border bg-card/50",
      )}
      aria-label={`${item.title}: ${item.earned ? `earned${item.awardedAt ? ` on ${formatDate(item.awardedAt)}` : ""}` : "not yet earned"}`}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative flex size-11 shrink-0 items-center justify-center rounded-full",
          item.earned ? "bg-gold-soft text-warning" : "bg-muted-bg text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
        {!item.earned ? (
          <span className="absolute -right-0.5 -bottom-0.5 flex size-4.5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
            <Lock className="size-2.5" />
          </span>
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("font-semibold", item.earned ? "text-foreground" : "text-foreground/70")}>{item.title}</p>
        <p className={cn("mt-0.5 text-sm leading-snug", item.earned ? "text-muted-foreground" : "text-muted-foreground/90")}>{item.description}</p>
        <p className={cn("mt-1.5 text-xs font-semibold", item.earned ? "text-sage-strong" : "text-muted-foreground")}>
          {item.earned ? (item.awardedAt ? `Earned ${formatDate(item.awardedAt, { month: "short", day: "numeric", year: "numeric" })}` : "Earned") : "Not yet"}
        </p>
      </div>
    </li>
  );
}

/** Earned vs locked badges, grouped as course goals / modules / streaks. */
function BadgeGrid({ items, flat = false, className, ...props }: BadgeGridProps) {
  if (flat) {
    return (
      <div className={className} {...props}>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BadgeTile key={item.key} item={item} />
          ))}
        </ul>
      </div>
    );
  }
  const groups = (["goal", "module", "streak"] as BadgeGroup[]).map((g) => ({ group: g, items: items.filter((b) => b.group === g) })).filter((g) => g.items.length > 0);
  return (
    <div className={cn("grid gap-8", className)} {...props}>
      {groups.map(({ group, items: list }) => {
        const earned = list.filter((b) => b.earned).length;
        return (
          <section key={group} aria-labelledby={`badges-${group}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 id={`badges-${group}`} className="text-lg">
                {GROUP_LABELS[group].title}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground tabular-nums">
                {earned} of {list.length} earned
              </p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{GROUP_LABELS[group].blurb}</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <BadgeTile key={item.key} item={item} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export { BadgeGrid };
