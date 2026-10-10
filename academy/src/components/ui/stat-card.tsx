import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Small text under the value, e.g. "+12 this week". */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "default" | "rose" | "sage" | "gold";
  /** Visual trend hint for the hint text. */
  trend?: "up" | "down" | "flat";
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted-bg text-muted-foreground",
  rose: "bg-rose-soft text-rose-strong",
  sage: "bg-sage-soft text-sage-strong",
  gold: "bg-gold-soft text-warning",
};

function StatCard({ label, value, hint, icon, tone = "default", trend, className, ...props }: StatCardProps) {
  return (
    <div
      data-slot="stat-card"
      className={cn("flex items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-soft", className)}
      {...props}
    >
      {icon ? (
        <div aria-hidden="true" className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg [&>svg]:size-5", toneClasses[tone])}>
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-3xl leading-none font-medium text-foreground tabular-nums">{value}</p>
        {hint ? (
          <p
            className={cn(
              "mt-2 text-xs",
              trend === "up" && "text-sage-strong",
              trend === "down" && "text-danger",
              (!trend || trend === "flat") && "text-muted-foreground",
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { StatCard };
