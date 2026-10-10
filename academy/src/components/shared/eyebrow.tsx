import * as React from "react";
import { cn } from "@/lib/utils";

/** Letter-spaced small-caps label ("BABY STEPS · MODULE 1"). */
function Eyebrow({ className, tone = "rose", ...props }: React.ComponentProps<"p"> & { tone?: "rose" | "sage" | "gold" | "muted" }) {
  return (
    <p
      data-slot="eyebrow"
      className={cn(
        "eyebrow",
        tone === "sage" && "text-sage-strong",
        tone === "gold" && "text-warning",
        tone === "muted" && "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Eyebrow };
