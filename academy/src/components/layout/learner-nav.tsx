"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isActivePath } from "./nav-link";
import { learnerNav } from "./nav-config";

/** Desktop rail (vertical) and mobile bottom tab bar share this list. */
function LearnerNav({ variant }: { variant: "rail" | "tabs" }) {
  const pathname = usePathname();
  if (variant === "tabs") {
    return (
      <nav
        aria-label="Learner"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85 md:hidden print:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {learnerNav.map(({ label, href, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                    active ? "text-rose-strong" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {Icon ? <Icon className={cn("size-5", active && "fill-rose-soft")} aria-hidden="true" /> : null}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="Learner" className="flex flex-col gap-1">
      {learnerNav.map(({ label, href, icon: Icon }) => {
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
              active ? "bg-rose-soft/70 text-rose-strong" : "text-foreground/80 hover:bg-rose-soft/40 hover:text-rose-strong",
            )}
          >
            {Icon ? <Icon className="size-4.5 shrink-0" aria-hidden="true" /> : null}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export { LearnerNav };
