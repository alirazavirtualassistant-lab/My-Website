import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap, Quote, type LucideIcon } from "lucide-react";
import { site } from "@/lib/config/site";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageSection } from "@/components/layout/page-section";
import { Illustration } from "@/components/shared/illustration";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Promises } from "@/components/marketing/promises";
import { JsonLd } from "@/components/marketing/json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `About ${site.instructor.shortName}`,
  description: `${site.instructor.name}: ${site.instructor.title}. Her story, her books and why Baby Steps exists.`,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.instructor.name}`, description: site.instructor.bio, url: "/about" },
};

/**
 * Verbatim lines from the M1T1 teleprompter script ("Introduction to
 * Pre-Conception Health"), content/source/…/M1T1_…_teleprompter.txt.
 */
const IN_HER_WORDS = [
  "Let me tell you a little about me, because you deserve to know who's walking beside you. I'm Cynthia Myers Morrison. I hold a doctorate in education, and for more than two decades I've worked as a wellness coach and a food addiction professional, helping people understand the pull of cravings and find their way back into their own bodies. I came to this work honestly. I once carried close to a hundred extra pounds. I know from the inside what it feels like to want a healthier life for your family and to have no idea where the first step is, or to take the first step and then lose your footing on the third.",
  "The more I learned about epigenetics, the more I understood that pre-conception health isn't a niche topic for fertility clinics. It's the beginning of everything, the first chapter of a child's story, written months before the child exists. So this course is my way of taking what I know about cravings, habits, and heart-led change and pointing it at the most hopeful moment of your life: the months before a baby.",
];

const CREDENTIALS: Array<{ text: string; icon: LucideIcon }> = [
  { text: "Doctorate in education (EdD)", icon: GraduationCap },
  { text: site.instructor.title, icon: BookOpen },
  { text: `Credentials: ${site.instructor.credentials}`, icon: GraduationCap },
  { text: "More than twenty-five years of experience as a food addiction professional", icon: BookOpen },
];

const CLOSING_LINE =
  "You are not late. You are not broken. You are a person standing at the beginning of a ninety-day window with more influence than you've ever been told you had.";

export default async function AboutPage() {
  const { instructor } = site;
  const babySteps = await getCourseBySlug("baby-steps");
  const courseHref = babySteps && babySteps.status === "published" ? `/courses/${babySteps.slug}` : "/courses";

  return (
    <>
      <JsonLd
        id="person-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: instructor.name,
          jobTitle: instructor.title,
          description: instructor.bio,
          url: site.mainSite,
          sameAs: [site.social.linkedin, site.social.instagram, site.social.facebook],
          worksFor: { "@type": "Organization", name: site.name, url: site.url },
        }}
      />

      <Section spacing="lg" tone="cream2" className="border-b border-border">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">About your instructor</p>
            <h1 className="mt-3 text-balance">{instructor.name}</h1>
            <p className="mt-3 text-lg font-semibold text-rose-strong">{instructor.credentials}</p>
            <p className="mt-1 text-muted-foreground">{instructor.title}</p>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed">{instructor.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={courseHref}>
                  Start your Baby Steps
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.mainSite} target="_blank" rel="noopener noreferrer">
                  myersmorrison.com
                  <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Illustration name="calm" size={300} title="Line drawing of a calm, seated figure" className="text-rose-strong" />
          </div>
        </Container>
      </Section>

      <PageSection eyebrow="In her words" title="A little about me" description="From the first training in Baby Steps, exactly as Cynthia says it." containerSize="md">
        <div className="space-y-6">
          {IN_HER_WORDS.map((p) => (
            <blockquote key={p.slice(0, 24)} className="card-soft relative p-6 pl-12 font-serif text-xl leading-relaxed text-foreground/90 sm:p-8 sm:pl-14 sm:text-2xl">
              <Quote className="absolute top-6 left-5 size-5 text-gold sm:top-8 sm:left-6" aria-hidden="true" />
              {p}
            </blockquote>
          ))}
          <figure className="mx-auto max-w-2xl pt-4 text-center">
            <blockquote className="font-serif text-3xl leading-snug text-rose-strong italic">“{site.signatureQuote}”</blockquote>
            <figcaption className="mt-3 text-sm text-muted-foreground">— {instructor.name}</figcaption>
          </figure>
        </div>
      </PageSection>

      <Section tone="cream2" spacing="lg">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Credentials</p>
            <h2 className="mt-2">Trained, practised, lived</h2>
            <ul className="mt-5 space-y-3">
              {CREDENTIALS.map(({ text, icon: Icon }) => (
                <li key={text} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm shadow-soft">
                  <Icon className="mt-0.5 size-4 shrink-0 text-rose-strong" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Books</p>
            <h2 className="mt-2">Written with others, for others</h2>
            <ul className="mt-5 space-y-3">
              {instructor.books.map((b) => (
                <li key={b.title} className="card-soft flex items-start gap-4 p-5">
                  <BookOpen className="mt-1 size-6 shrink-0 text-rose-strong" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-2xl font-medium">{b.title}</p>
                    <p className="text-sm text-muted-foreground">with {b.with}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social links">
              {(
                [
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
          </div>
        </Container>
      </Section>

      <PageSection eyebrow="Why Baby Steps" title="Small, repeatable, kind" description="The course is built on three promises. Every lesson keeps all three." align="center">
        <Promises />
        {babySteps ? (
          <div className="card-soft mx-auto mt-10 max-w-3xl p-6 sm:p-8">
            <p className="eyebrow">{babySteps.title}</p>
            <p className="mt-3 text-pretty leading-relaxed text-foreground/90">{babySteps.description.split("\n\n")[0]}</p>
            <blockquote className="mt-5 border-l-2 border-gold pl-4 font-serif text-xl leading-snug text-foreground/85 italic">“{CLOSING_LINE}”</blockquote>
            <Button asChild className="mt-6">
              <Link href={courseHref}>
                Explore the course
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        ) : null}
      </PageSection>

      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
        </Container>
      </Section>
    </>
  );
}
