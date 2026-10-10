import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A native <select> styled like the Input, for forms that post FormData.
 * (The Radix Select is better for rich menus; this one is lighter and keeps
 * keyboard/mobile behaviour native.)
 */
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="native-select"
        className={cn(
          "flex h-10 w-full appearance-none rounded-lg border border-input bg-card py-2 pr-9 pl-3 text-base text-foreground shadow-xs transition-[color,box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-ring/40",
          "aria-invalid:border-danger aria-invalid:ring-danger/30",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export { NativeSelect };
