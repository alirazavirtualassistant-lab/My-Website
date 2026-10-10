import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config/site";
import { siteFaq } from "@/content/faq";
import { listPublishedCourses } from "@/lib/usecases/catalog";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { FaqList, faqJsonLd } from "@/components/marketing/faq-list";
import { JsonLd } from "@/components/marketing/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about who the courses are for, how access works, partners, XP, privacy, refunds and gifting.",
  alternates: { canonical: "/faq" },
  openGraph: { title: `FAQ · ${site.name}`, description: "Answers about access, partners, XP, privacy, refunds and gifting.", url: "/faq" },
};

export default async function FaqPage() {
  const courses = await listPublishedCourses();
  const withFaq = courses.filter((c) => c.faq.length > 0);
  const all = [...siteFaq, ...withFaq.flatMap((c) => c.faq)];
  return (
    <>
      <JsonLd id="faq-jsonld" data={faqJsonLd(all)} />
      <Section spacing="md">
        <Container size="md">
          <PageHeader eyebrow="FAQ" title="Questions, answered calmly" description="If yours isn’t here, send it over. We read every message." />
          <nav aria-label="FAQ sections" className="mt-6 flex flex-wrap gap-2 text-sm">
            <a href="#general" className="rounded-full border border-border bg-card px-3.5 py-1.5 font-semibold hover:border-rose/50 hover:text-rose-strong">
              General
            </a>
            {withFaq.map((c) => (
              <a key={c.id} href={`#course-${c.slug}`} className="rounded-full border border-border bg-card px-3.5 py-1.5 font-semibold hover:border-rose/50 hover:text-rose-strong">
                {c.title.split(":")[0]}
              </a>
            ))}
          </nav>

          <section id="general" aria-labelledby="general-heading" className="mt-10 scroll-mt-24">
            <h2 id="general-heading" className="font-serif text-3xl">
              General
            </h2>
            <FaqList items={siteFaq} openFirst idPrefix="site-faq" className="mt-4" />
          </section>

          {withFaq.map((c) => (
            <section key={c.id} id={`course-${c.slug}`} aria-labelledby={`faq-${c.slug}-heading`} className="mt-12 scroll-mt-24">
              <h2 id={`faq-${c.slug}-heading`} className="font-serif text-3xl">
                {c.title}
              </h2>
              <FaqList items={c.faq} idPrefix={`faq-${c.slug}`} className="mt-4" />
              <Button asChild variant="link" className="mt-3">
                <Link href={`/courses/${c.slug}`}>See the course page</Link>
              </Button>
            </section>
          ))}

          <div className="card-soft mt-12 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-2xl">Still wondering about something?</p>
              <p className="text-sm text-muted-foreground">We usually reply within two working days.</p>
            </div>
            <Button asChild>
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </Container>
      </Section>
      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
        </Container>
      </Section>
    </>
  );
}
