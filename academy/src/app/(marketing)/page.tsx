import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/config/site";
import { siteFaq } from "@/content/faq";
import { courseStats, getCourseTree } from "@/lib/usecases/catalog";
import { listProducts } from "@/lib/usecases/access";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageSection } from "@/components/layout/page-section";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Illustration } from "@/components/shared/illustration";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Promises } from "@/components/marketing/promises";
import { InstructorCard } from "@/components/marketing/instructor-card";
import { CurriculumAccordion } from "@/components/marketing/curriculum-accordion";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqList, faqJsonLd } from "@/components/marketing/faq-list";
import { NewsletterForm } from "@/components/marketing/newsletter-form";
import { JsonLd } from "@/components/marketing/json-ld";
import { loadApprovedTestimonials, loadFeaturedCourse, toCourseCardData } from "./_lib/data";
import { subscribeNewsletterAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · ${site.tagline}` },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { title: site.name, description: site.description, url: "/", type: "website" },
};

const HOME_FAQ = siteFaq.slice(0, 6);

export default async function HomePage() {
  const course = await loadFeaturedCourse();
  const [tree, products, testimonials] = await Promise.all([course ? getCourseTree(course.id) : null, listProducts(), loadApprovedTestimonials(null, 6)]);
  const stats = tree ? courseStats(tree) : null;
  const featured = course && tree && stats ? { course: await toCourseCardData(course, { products, tree }), stats } : null;
  const ctaHref = course ? `/courses/${course.slug}` : "/courses";

  return (
    <>
      <JsonLd
        id="org-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          sameAs: [site.mainSite, site.social.linkedin, site.social.instagram, site.social.facebook],
          founder: { "@type": "Person", name: site.instructor.name, jobTitle: site.instructor.title, url: site.mainSite },
        }}
      />
      <Hero ctaHref={ctaHref} featured={featured} />

      <PageSection eyebrow="How it works" title="Four calm steps from curious to certified" align="center" tone="cream2" spacing="lg">
        <HowItWorks />
      </PageSection>

      <PageSection eyebrow="Our promise" title="Three things every lesson keeps" description="These are the commitments the whole Academy is built on." align="center">
        <Promises />
      </PageSection>

      <PageSection eyebrow="Meet your instructor" title="Walking beside you, not ahead of you" tone="cream2" spacing="lg">
        <InstructorCard variant="teaser" />
      </PageSection>

      {tree && course ? (
        <PageSection
          eyebrow="Inside the course"
          title="The seven core modules"
          description="Opened one at a time over about twelve weeks, so you can practise rather than just watch. Bonuses and replays are open from day one."
          actions={
            <Button asChild variant="outline">
              <Link href={`/courses/${course.slug}`}>
                See the full curriculum
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          <CurriculumAccordion tree={tree} variant="preview" courseSlug={course.slug} />
        </PageSection>
      ) : null}

      <PageSection eyebrow="Learner stories" title="In their own words" tone="cream2" spacing="lg" align="center">
        <TestimonialsSection testimonials={testimonials} />
      </PageSection>

      <PageSection
        eyebrow="Questions"
        title="Things people ask before they start"
        actions={
          <Button asChild variant="link">
            <Link href="/faq">
              All questions
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      >
        <FaqList items={HOME_FAQ} openFirst idPrefix="home-faq" />
        <JsonLd id="faq-jsonld" data={faqJsonLd(HOME_FAQ)} />
      </PageSection>

      <Section id="newsletter" tone="rose" spacing="lg">
        <Container size="md" className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <Illustration name="leaves" size={120} className="hidden text-rose-strong md:block" />
          <div>
            <p className="eyebrow">Stay in touch</p>
            <h2 className="mt-2">A few words from Cynthia, now and then</h2>
            <p className="mt-2 text-muted-foreground">New courses, free previews and gentle reminders. No pressure, no fear-based nudges.</p>
            <NewsletterForm action={subscribeNewsletterAction} source="home" className="mt-6" />
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
