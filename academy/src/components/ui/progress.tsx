"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  tone?: "rose" | "sage" | "gold";
  size?: "sm" | "md" | "lg";
}

const toneClass = { rose: "bg-primary", sage: "bg-sage-strong", gold: "bg-gold" } as const;
const sizeClass = { sm: "h-1.5", md: "h-2.5", lg: "h-4" } as const;

function Progress({ className, value, tone = "sage", size = "md", ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, value ?? 0));
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={pct}
      className={cn("relative w-full overflow-hidden rounded-full bg-line", sizeClass[size], className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 rounded-full transition-transform duration-500 ease-out", toneClass[tone])}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
