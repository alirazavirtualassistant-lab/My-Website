import * as React from "react";
import { cn } from "@/lib/utils";
import { LearnerNav } from "./learner-nav";

export interface LearnerShellProps {
  children: React.ReactNode;
  /** Optional content under the rail nav (e.g. an XP ring or streak card). */
  aside?: React.ReactNode;
  className?: string;
  /** Narrower content for reading pages. */
  contentClassName?: string;
}

/**
 * Two-column shell for signed-in pages: slim left rail on md+, bottom tab bar on
 * mobile. Renders <main id="main"> so the SkipLink works.
 */
function LearnerShell({ children, aside, className, contentClassName }: LearnerShellProps) {
  return (
    <div data-slot="learner-shell" className={cn("mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8", className)}>
      <aside className="sticky top-24 hidden h-fit w-52 shrink-0 flex-col gap-6 self-start md:flex">
        <LearnerNav variant="rail" />
        {aside}
      </aside>
      <main id="main" tabIndex={-1} className={cn("min-w-0 flex-1 pb-20 outline-none md:pb-0", contentClassName)}>
        {children}
      </main>
      <LearnerNav variant="tabs" />
    </div>
  );
}

export { LearnerShell };
