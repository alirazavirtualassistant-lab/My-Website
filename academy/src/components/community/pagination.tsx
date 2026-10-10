import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface PaginationProps extends React.ComponentProps<"nav"> {
  page: number;
  pageCount: number;
  /** Builds the href for a page number (keeps sort/other params). */
  hrefFor: (page: number) => string;
}

function Pagination({ page, pageCount, hrefFor, className, ...props }: PaginationProps) {
  if (pageCount <= 1) return null;
  const prev = page > 1 ? page - 1 : null;
  const next = page < pageCount ? page + 1 : null;
  const linkClass = cn(buttonVariants({ variant: "outline", size: "sm" }));
  const disabledClass = cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50");
  return (
    <nav aria-label="Pages" className={cn("flex items-center justify-between gap-3", className)} {...props}>
      {prev ? (
        <Link href={hrefFor(prev)} className={linkClass} rel="prev">
          <ChevronLeft aria-hidden="true" />
          Newer
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          <ChevronLeft aria-hidden="true" />
          Newer
        </span>
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      {next ? (
        <Link href={hrefFor(next)} className={linkClass} rel="next">
          Older
          <ChevronRight aria-hidden="true" />
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClass}>
          Older
          <ChevronRight aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

export { Pagination };
