import * as React from "react";
import { cn } from "@/lib/utils";

/** Keyboard users jump straight to <main id="main">. Place it first inside <body>. */
function SkipLink({ href = "#main", className, children = "Skip to content", ...props }: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-rose-strong focus:shadow-card focus:ring-2 focus:ring-ring focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export { SkipLink };
