import * as React from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { cn, formatDate, pluralize } from "@/lib/utils";
import type { CategoryView } from "./types";

/** A forum category tile: title, description, post count and last activity. */
function CategoryCard({ category, className, ...props }: React.ComponentProps<"article"> & { category: CategoryView }) {
  const titleId = `category-${category.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      data-slot="category-card"
      className={cn("card-soft group relative flex h-full flex-col gap-2 p-5 transition-colors hover:border-rose/50 focus-within:border-rose/60", className)}
      {...props}
    >
      <h3 id={titleId} className="flex items-start justify-between gap-3 font-serif text-xl leading-snug font-medium">
        <Link href={category.href} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2">
          {category.title}
        </Link>
        <ArrowRight className="mt-1 size-4 shrink-0 text-rose-strong opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none" aria-hidden="true" />
      </h3>
      {category.description ? <p className="text-sm text-muted-foreground">{category.description}</p> : null}
      <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="size-3.5" aria-hidden="true" />
          {pluralize(category.postCount, "post")}
        </span>
        {category.lastActivityAt ? (
          <span>
            Last activity <time dateTime={category.lastActivityAt}>{formatDate(category.lastActivityAt, { month: "short", day: "numeric" })}</time>
          </span>
        ) : (
          <span>Quiet so far</span>
        )}
      </p>
    </article>
  );
}

export { CategoryCard };
