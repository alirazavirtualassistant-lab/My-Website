"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  /** Gold gradient rule instead of the plain border colour. */
  tone?: "line" | "gold";
}

function Separator({ className, orientation = "horizontal", decorative = true, tone = "line", ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        tone === "gold" ? "gold-rule-center" : "bg-border",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
