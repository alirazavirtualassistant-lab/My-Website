import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqListProps extends Omit<React.ComponentProps<"div">, "children"> {
  items: FaqItem[];
  /** Open the first answer by default. */
  openFirst?: boolean;
  /** Prefix for accordion item values when several lists share a page. */
  idPrefix?: string;
}

/** Accordion of questions and answers (plain text answers, rendered verbatim). */
function FaqList({ items, openFirst = false, idPrefix = "faq", className, ...props }: FaqListProps) {
  if (items.length === 0) return null;
  return (
    <div data-slot="faq-list" className={cn("rounded-lg border border-border bg-card px-5 shadow-soft sm:px-6", className)} {...props}>
      <Accordion type="multiple" defaultValue={openFirst ? [`${idPrefix}-0`] : []}>
        {items.map((item, i) => (
          <AccordionItem key={`${idPrefix}-${i}`} value={`${idPrefix}-${i}`}>
            <AccordionTrigger className="font-serif text-lg font-medium sm:text-xl">{item.q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-foreground/85">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

/** schema.org FAQPage payload for a list of items. */
export function faqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export { FaqList };
