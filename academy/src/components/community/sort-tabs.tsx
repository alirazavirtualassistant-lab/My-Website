import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SortTabsProps extends React.ComponentProps<"nav"> {
  current: "new" | "top";
  hrefFor: (sort: "new" | "top") => string;
}

/** Link-based "Newest / Most liked" tabs (server-rendered, no JS needed). */
function SortTabs({ current, hrefFor, className, ...props }: SortTabsProps) {
  const items: Array<{ key: "new" | "top"; label: string }> = [
    { key: "new", label: "Newest" },
    { key: "top", label: "Most liked" },
  ];
  return (
    <nav aria-label="Sort posts" className={cn("inline-flex h-10 w-fit items-center gap-1 rounded-lg bg-muted-bg p-1", className)} {...props}>
      {items.map((item) => {
        const active = item.key === current;
        return (
          <Link
            key={item.key}
            href={hrefFor(item.key)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-full items-center rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:outline-none",
              active ? "bg-card text-rose-strong shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { SortTabs };
