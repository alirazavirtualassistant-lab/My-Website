"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ListTree, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Settings | Curriculum tabs under a course title. */
function CourseSubnav({ courseId, slug }: { courseId: string; slug: string }) {
  const pathname = usePathname();
  const items = [
    { href: `/admin/courses/${courseId}`, label: "Settings", icon: Settings2, exact: true },
    { href: `/admin/courses/${courseId}/curriculum`, label: "Curriculum", icon: ListTree, exact: false },
  ];
  return (
    <nav aria-label="Course sections" className="flex flex-wrap items-center gap-1 border-b border-border">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`/admin/courses/${courseId}/lessons/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active ? "border-rose text-rose-strong" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <Link href={`/courses/${slug}`} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <ExternalLink className="size-4" aria-hidden="true" />
        View on site
      </Link>
    </nav>
  );
}

export { CourseSubnav };
