import * as React from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { cn, formatDate, pluralize } from "@/lib/utils";
import type { UnlockItem } from "./types";

export interface UnlockTimelineProps extends React.ComponentProps<"div"> {
  items: UnlockItem[];
  /** Show the course title on each row (when more than one course is enrolled). */
  showCourse?: boolean;
  limit?: number;
}

/** Upcoming drip unlocks, soonest first. */
function UnlockTimeline({ items, showCourse = false, limit = 6, className, ...props }: UnlockTimelineProps) {
  const visible = items.slice(0, limit);
  const hidden = Math.max(0, items.length - visible.length);
  return (
    <div className={cn("card-soft p-5 sm:p-6", className)} {...props}>
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-rose-strong" aria-hidden="true" />
        <h3 className="text-lg">Coming up</h3>
      </div>
      {visible.length === 0 ? (
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
          Nothing is waiting to unlock — every module is already open.
        </p>
      ) : (
        <ol className="mt-4 space-y-0" aria-label="Upcoming module unlocks">
          {visible.map((item, i) => (
            <li key={`${item.courseSlug}-${item.moduleCode}`} className="relative flex gap-4 pb-4 last:pb-0">
              {i < visible.length - 1 ? <span aria-hidden="true" className="absolute top-7 bottom-0 left-[11px] w-px bg-line" /> : null}
              <span aria-hidden="true" className={cn("mt-1.5 flex size-[23px] shrink-0 items-center justify-center rounded-full border-2 bg-card", i === 0 ? "border-gold" : "border-line")}>
                <span className={cn("size-2 rounded-full", i === 0 ? "bg-gold" : "bg-line")} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  <time dateTime={item.unlocksAt}>{formatDate(item.unlocksAt, { weekday: "short", month: "short", day: "numeric" })}</time>
                  <span aria-hidden="true"> · </span>
                  <span className={cn("normal-case tracking-normal", i === 0 ? "text-warning" : "text-muted-foreground")}>{item.phrase}</span>
                </p>
                <p className="mt-0.5 font-semibold text-foreground">
                  {item.moduleCode} · {item.moduleTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pluralize(item.lessonCount, "lesson")}
                  {showCourse ? ` · ${item.courseTitle}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {hidden > 0 ? <p className="mt-3 text-xs text-muted-foreground">+ {pluralize(hidden, "more module")} after that.</p> : null}
    </div>
  );
}

export { UnlockTimeline };
