"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AllAccessToggleProps {
  monthly: React.ReactNode;
  annual: React.ReactNode;
  /** Shown under the toggle, e.g. "Save $99 a year". */
  annualNote?: string | null;
  defaultInterval?: "month" | "year";
}

/**
 * Monthly / annual switch for the All-Access plan. The cards are rendered on
 * the server and passed in; this only decides which one is visible.
 */
function AllAccessToggle({ monthly, annual, annualNote, defaultInterval = "month" }: AllAccessToggleProps) {
  const [interval, setBilling] = React.useState<"month" | "year">(defaultInterval);
  const btn = (value: "month" | "year", label: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={interval === value}
      onClick={() => setBilling(value)}
      className={cn(
        "h-9 flex-1 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
        interval === value ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
  return (
    <div data-slot="all-access-toggle">
      <div role="radiogroup" aria-label="Billing interval" className="inline-flex w-full rounded-lg bg-muted-bg p-1">
        {btn("month", "Monthly")}
        {btn("year", "Annual")}
      </div>
      {annualNote ? <p className="mt-2 text-center text-xs text-sage-strong">{annualNote}</p> : null}
      <div className="mt-4">
        <div hidden={interval !== "month"}>{monthly}</div>
        <div hidden={interval !== "year"}>{annual}</div>
      </div>
    </div>
  );
}

export { AllAccessToggle };
