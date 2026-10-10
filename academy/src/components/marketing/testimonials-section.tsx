import * as React from "react";
import { MessageSquareHeart, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export interface TestimonialsSectionProps extends React.ComponentProps<"div"> {
  testimonials: Testimonial[];
  /** Copy for the empty state. */
  emptyTitle?: string;
  emptyDescription?: string;
}

function Stars({ rating }: { rating: number }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5 text-gold" aria-label={`${n} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} aria-hidden="true" className={cn("size-4", i < n ? "fill-current" : "opacity-30")} />
      ))}
    </span>
  );
}

/**
 * Approved learner stories, or a quiet placeholder. Never renders invented
 * quotes: with no approved testimonials it says so.
 */
function TestimonialsSection({ testimonials, emptyTitle = "Learner stories will appear here", emptyDescription = "Once learners share how the course landed for them, and Cynthia approves their words, you will read them here. Nothing is made up in the meantime.", className, ...props }: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return (
      <div data-slot="testimonials" className={className} {...props}>
        <EmptyState icon={<MessageSquareHeart />} title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }
  return (
    <ul data-slot="testimonials" className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {testimonials.map((t) => (
        <li key={t.id} className="card-soft flex flex-col gap-4 p-6">
          {t.rating !== null ? <Stars rating={t.rating} /> : null}
          <blockquote className="flex-1 font-serif text-lg leading-snug text-foreground/90">“{t.body}”</blockquote>
          <footer className="text-sm">
            <p className="font-semibold">{t.author_name}</p>
            {t.author_role ? <p className="text-muted-foreground">{t.author_role}</p> : null}
          </footer>
        </li>
      ))}
    </ul>
  );
}

export { TestimonialsSection };
