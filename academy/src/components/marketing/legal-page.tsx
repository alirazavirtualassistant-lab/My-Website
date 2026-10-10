import * as React from "react";
import Link from "next/link";
import { ScrollText, TriangleAlert } from "lucide-react";
import type { LegalDocument, LegalSlug } from "@/app/(marketing)/_lib/data";
import { LEGAL_PAGES } from "@/app/(marketing)/_lib/data";
import { formatDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Markdown } from "@/components/shared/markdown";

const NAV: Array<{ slug: LegalSlug; label: string }> = [
  { slug: "terms", label: "Terms" },
  { slug: "privacy", label: "Privacy" },
  { slug: "refund-policy", label: "Refunds" },
  { slug: "medical-disclaimer", label: "Medical disclaimer" },
  { slug: "cookies", label: "Cookies" },
];

/** Shared layout for the legal pages: title, review banner, markdown body and sibling links. */
function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <Section spacing="md">
      <Container size="md" className="grid gap-10 lg:grid-cols-[1fr_14rem]">
        <article className="min-w-0">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-2">{doc.title}</h1>
          {doc.updatedAt ? <p className="mt-2 text-sm text-muted-foreground">Last reviewed {formatDate(doc.updatedAt)}</p> : null}
          {doc.needsReview ? (
            <Alert variant="warning" className="mt-6">
              <TriangleAlert />
              <AlertTitle>Draft awaiting legal review</AlertTitle>
              <AlertDescription>
                This page is placeholder wording while the final text is reviewed by a qualified attorney. It shows the commitments the platform is
                built to keep; the wording may change before launch.
              </AlertDescription>
            </Alert>
          ) : null}
          <Markdown content={doc.body} className="prose-cyc mt-8 max-w-none" />
        </article>
        <nav aria-label="Legal pages" className="lg:sticky lg:top-24 lg:self-start">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <ScrollText className="size-4" aria-hidden="true" />
            Policies
          </p>
          <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {NAV.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/${n.slug}`}
                  aria-current={n.slug === doc.slug ? "page" : undefined}
                  className="inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold text-foreground/85 hover:bg-rose-soft/50 hover:text-rose-strong aria-[current=page]:bg-rose-soft/70 aria-[current=page]:text-rose-strong"
                >
                  {LEGAL_PAGES[n.slug].title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </Section>
  );
}

export { LegalPage };
