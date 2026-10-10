"use client";

import * as React from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Error summary announced to assistive tech and focused when it appears.
 * Pass the flat `summary` list from the action state.
 */
function FormErrorSummary({ summary, title = "Let's fix a couple of things", className }: { summary?: string[]; title?: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const key = summary?.join("|") ?? "";
  React.useEffect(() => {
    if (key) ref.current?.focus({ preventScroll: false });
  }, [key]);
  if (!summary || summary.length === 0) return null;
  const single = summary.length === 1;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      data-slot="form-error-summary"
      className={cn("grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <CircleAlert className="mt-0.5 size-5" aria-hidden="true" />
      {single ? (
        <p className="font-medium">{summary[0]}</p>
      ) : (
        <div>
          <p className="font-semibold">{title}</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {summary.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { FormErrorSummary };
