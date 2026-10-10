import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn, initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface InstructorCardProps extends React.ComponentProps<"section"> {
  /** `teaser` = short bio + link to /about; `full` = bio, books and links. */
  variant?: "teaser" | "full";
  headingLevel?: "h2" | "h3";
}

/** Cynthia's card, built from site.instructor only (no invented claims). */
function InstructorCard({ variant = "teaser", headingLevel: Heading = "h2", className, ...props }: InstructorCardProps) {
  const { instructor } = site;
  return (
    <section
      data-slot="instructor-card"
      aria-labelledby="instructor-heading"
      className={cn("card-soft grid gap-6 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-8", className)}
      {...props}
    >
      <div className="flex flex-col items-start gap-3">
        <Avatar className="size-24 border-2 border-gold/60 bg-rose-soft text-2xl sm:size-28">
          <AvatarFallback className="font-serif text-3xl text-rose-strong">{initials(instructor.name)}</AvatarFallback>
        </Avatar>
        <p className="eyebrow">Your instructor</p>
      </div>
      <div className="min-w-0">
        <Heading id="instructor-heading" className="font-serif text-3xl font-medium">
          {instructor.name}
        </Heading>
        <p className="mt-1 text-sm font-semibold text-rose-strong">{instructor.credentials}</p>
        <p className="mt-1 text-sm text-muted-foreground">{instructor.title}</p>
        <p className="mt-4 leading-relaxed text-foreground/90">{instructor.bio}</p>

        {variant === "full" ? (
          <>
            <h3 className="mt-6 font-serif text-xl font-medium">Books</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-3">
              {instructor.books.map((b) => (
                <li key={b.title} className="flex items-start gap-2 rounded-lg border border-border bg-cream-2/50 p-3 text-sm">
                  <BookOpen className="mt-0.5 size-4 shrink-0 text-rose-strong" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">{b.title}</span>
                    <span className="block text-muted-foreground">with {b.with}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Links">
              {(
                [
                  ["myersmorrison.com", site.mainSite],
                  ["LinkedIn", site.social.linkedin],
                  ["Instagram", site.social.instagram],
                  ["Facebook", site.social.facebook],
                ] as const
              ).map(([label, href]) => (
                <li key={href}>
                  <Button asChild variant="outline" size="sm">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {label}
                      <ArrowUpRight aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Button asChild variant="link" className="mt-4">
            <Link href="/about">
              More about {instructor.shortName}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
}

export { InstructorCard };
