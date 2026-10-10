import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, BookOpen, Calendar, Check, Clock, FileText, Globe, PlayCircle, ShieldCheck, ShoppingBag } from "lucide-react";
import { site } from "@/lib/config/site";
import type { CourseTree, ResourceType } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth/session";
import { courseStats, getCourseBySlug, getCourseTree, lessonSlug } from "@/lib/usecases/catalog";
import { getLearnerAccess, listProducts } from "@/lib/usecases/access";
import { formatDate, formatDuration, formatHoursMinutes, pluralize } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Markdown } from "@/components/shared/markdown";
import { CourseArt } from "@/components/marketing/course-illustration";
import { CurriculumAccordion } from "@/components/marketing/curriculum-accordion";
import { PurchaseBar, PurchaseCard } from "@/components/marketing/purchase-card";
import { InstructorCard } from "@/components/marketing/instructor-card";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { FaqList, faqJsonLd } from "@/components/marketing/faq-list";
import { JsonLd } from "@/components/marketing/json-ld";
import { effectiveUnitPrice } from "@/components/marketing/price";
import { allAccessProducts, courseProductFor, loadApprovedTestimonials, paymentPlanFor, resourceTypeCounts, thumbnailUrl } from "../../_lib/data";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

/** Deduplicated between generateMetadata and the page render. */
const loadCourse = cache(async (slug: string) => {
  const course = await getCourseBySlug(slug);
  if (!course || course.status !== "published") return null;
  const tree = await getCourseTree(course.id);
  if (!tree) return null;
  return { course, tree };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadCourse(slug);
  if (!data) return { title: "Course not found", robots: { index: false } };
  const { course } = data;
  return {
    title: course.title,
    description: course.subtitle || course.short_description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { title: course.title, description: course.subtitle || course.short_description, url: `/courses/${course.slug}`, type: "website" },
    twitter: { card: "summary_large_image", title: course.title, description: course.subtitle || course.short_description },
  };
}

const TYPE_LABEL: Record<ResourceType, string> = { pdf: "PDF", xlsx: "XLSX", mp3: "audio", docx: "DOCX", image: "image", other: "file" };

function resourceSummary(tree: CourseTree): string {
  const counts = resourceTypeCounts(tree);
  const total = Object.values(counts).reduce((n, c) => n + (c ?? 0), 0);
  const parts = (Object.entries(counts) as Array<[ResourceType, number]>)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => TYPE_LABEL[t]);
  return `${pluralize(total, "downloadable resource")}${parts.length ? ` (${parts.join(", ")})` : ""}`;
}

function CheckList({ items, columns = true }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={columns ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed sm:text-base">
          <Check className="mt-1 size-4 shrink-0 text-sage-strong" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="inline-flex items-center gap-1.5 text-sm text-foreground/85">
      <span aria-hidden="true" className="text-rose-strong [&>svg]:size-4">
        {icon}
      </span>
      {children}
    </li>
  );
}

export default async function CourseLandingPage({ params, searchParams }: { params: Params; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const data = await loadCourse(slug);
  if (!data) notFound();
  const { course, tree } = data;

  const [me, products, testimonials, thumb] = await Promise.all([getCurrentUser(), listProducts(), loadApprovedTestimonials(course.id, 6), thumbnailUrl(course)]);
  const access = me ? await getLearnerAccess(me.session.user_id, course.id, me.session.role) : null;
  const enrolled = Boolean(access?.allowed);
  const stats = courseStats(tree);
  const product = courseProductFor(products, course.id);
  const plan = paymentPlanFor(products, course.id);
  const allAccess = allAccessProducts(products);
  const price = product ? effectiveUnitPrice(product) : null;
  const previews = tree.modules.flatMap((m) => m.lessons.filter((l) => l.is_preview));
  const added = query.added === "1";
  const summary = resourceSummary(tree);

  const courseJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle || course.short_description,
    url: `${site.url}/courses/${course.slug}`,
    inLanguage: course.language === "English" ? "en" : course.language,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    instructor: { "@type": "Person", name: site.instructor.name, jobTitle: site.instructor.title, url: site.mainSite },
    educationalLevel: course.level,
    numberOfLessons: stats.lesson_count,
    timeRequired: `PT${Math.max(1, Math.round(stats.total_video_sec / 3600))}H`,
    dateModified: course.last_updated_at,
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: `PT${Math.max(1, Math.round(stats.total_video_sec / 3600))}H` },
    ...(price
      ? {
          offers: {
            "@type": "Offer",
            price: (price.cents / 100).toFixed(2),
            priceCurrency: price.currency,
            availability: "https://schema.org/InStock",
            url: `${site.url}/courses/${course.slug}`,
            category: "Paid",
          },
        }
      : {}),
  };
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.instructor.name,
    jobTitle: site.instructor.title,
    url: site.mainSite,
    sameAs: [site.social.linkedin, site.social.instagram, site.social.facebook],
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <JsonLd id="course-jsonld" data={[courseJsonLd, personJsonLd, ...(course.faq.length ? [faqJsonLd(course.faq)] : [])]} />

      {/* Header band */}
      <Section tone="cream2" spacing="md" className="border-b border-border">
        <Container size="xl" className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/courses" className="hover:text-rose-strong hover:underline underline-offset-4">
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="truncate text-foreground/80">
                  {course.title}
                </li>
              </ol>
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {course.badge === "bestseller" ? <Badge variant="gold">Bestseller</Badge> : course.badge === "new" ? <Badge variant="rose">New</Badge> : null}
              <Badge variant="outline">{course.level}</Badge>
              {course.duration_weeks ? <Badge variant="outline">{course.duration_weeks}-week journey</Badge> : null}
            </div>
            <h1 className="mt-4 text-balance">{course.title}</h1>
            {course.subtitle ? <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">{course.subtitle}</p> : null}
            <p className="mt-4 text-sm">
              Created by{" "}
              <Link href="/about" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                {site.instructor.name}
              </Link>
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Course facts">
              {stats.total_video_sec > 0 ? <Meta icon={<Clock />}>{formatHoursMinutes(stats.total_video_sec)} of video</Meta> : null}
              <Meta icon={<BookOpen />}>{pluralize(stats.lesson_count, "lesson")}</Meta>
              {stats.resource_count > 0 ? <Meta icon={<FileText />}>{pluralize(stats.resource_count, "resource")}</Meta> : null}
              <Meta icon={<Calendar />}>Last updated {formatDate(course.last_updated_at, { month: "long", year: "numeric" })}</Meta>
              <Meta icon={<Globe />}>{course.language}</Meta>
            </ul>
            {added ? (
              <Alert variant="success" className="mt-6 max-w-xl">
                <ShoppingBag />
                <AlertTitle>Added to your cart</AlertTitle>
                <AlertDescription>
                  <Link href="/cart" className="font-semibold underline underline-offset-2">
                    View cart
                  </Link>{" "}
                  or{" "}
                  <Link href="/checkout" className="font-semibold underline underline-offset-2">
                    go to checkout
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
          <div>
            <div className="card-soft overflow-hidden">
              <CourseArt thumbnailUrl={thumb} illustration={course.illustration} title={course.title} artSize={140} className="aspect-[16/9]" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Body + sticky purchase column */}
      <Section spacing="md" className="pb-28 lg:pb-16">
        <Container size="xl" className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0 space-y-14">
            {course.what_you_learn.length > 0 ? (
              <section aria-labelledby="learn-heading" className="card-soft p-6 sm:p-8">
                <h2 id="learn-heading" className="font-serif text-3xl">
                  What you’ll learn
                </h2>
                <div className="mt-5">
                  <CheckList items={course.what_you_learn} />
                </div>
              </section>
            ) : null}

            {previews.length > 0 && !enrolled ? (
              <section aria-labelledby="preview-heading">
                <p className="eyebrow">Free previews</p>
                <h2 id="preview-heading" className="mt-2 font-serif text-3xl">
                  Watch before you decide
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {previews.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/courses/${course.slug}/preview/${lessonSlug(l)}`}
                        className="card-soft flex items-center gap-3 p-4 transition-colors hover:border-rose/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                      >
                        <PlayCircle className="size-8 shrink-0 text-rose-strong" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">{l.title}</span>
                          <span className="block text-xs text-muted-foreground">
                            Free preview{l.duration_sec > 0 ? ` · ${formatDuration(l.duration_sec)}` : ""}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="curriculum-heading">
              <p className="eyebrow">Curriculum</p>
              <h2 id="curriculum-heading" className="mt-2 font-serif text-3xl">
                Everything inside
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {pluralize(stats.module_count, "core module")}
                {stats.bonus_count > 0 ? ` · ${pluralize(stats.bonus_count, "bonus training")}` : ""}
                {stats.replay_count > 0 ? ` · ${pluralize(stats.replay_count, "coaching replay")}` : ""} · {pluralize(stats.lesson_count, "lesson")}
                {stats.total_video_sec > 0 ? ` · ${formatHoursMinutes(stats.total_video_sec)}` : ""}
              </p>
              <CurriculumAccordion tree={tree} variant="full" courseSlug={course.slug} enrolled={enrolled} className="mt-5" />
            </section>

            {course.description ? (
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="font-serif text-3xl">
                  About this course
                </h2>
                <Markdown content={course.description} className="prose-cyc mt-4 max-w-none" />
              </section>
            ) : null}

            {course.requirements.length > 0 ? (
              <section aria-labelledby="req-heading">
                <h2 id="req-heading" className="font-serif text-3xl">
                  Requirements
                </h2>
                <div className="mt-4">
                  <CheckList items={course.requirements} columns={false} />
                </div>
              </section>
            ) : null}

            {course.who_for.length > 0 ? (
              <section aria-labelledby="who-heading">
                <h2 id="who-heading" className="font-serif text-3xl">
                  Who this course is for
                </h2>
                <div className="mt-4">
                  <CheckList items={course.who_for} columns={false} />
                </div>
              </section>
            ) : null}

            <InstructorCard variant="full" />

            {course.faq.length > 0 ? (
              <section aria-labelledby="course-faq-heading">
                <h2 id="course-faq-heading" className="font-serif text-3xl">
                  Course FAQ
                </h2>
                <FaqList items={course.faq} className="mt-4" idPrefix="course-faq" />
              </section>
            ) : null}

            <section aria-labelledby="guarantee-heading" className="flex gap-4 rounded-lg border border-sage/40 bg-sage-soft/60 p-6">
              <ShieldCheck className="mt-0.5 size-7 shrink-0 text-sage-strong" aria-hidden="true" />
              <div>
                <h2 id="guarantee-heading" className="font-serif text-2xl">
                  {site.refundDays}-day money-back guarantee
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                  If {course.title.split(":")[0]} isn’t right for you, email{" "}
                  <a href={`mailto:${site.supportEmail}`} className="font-semibold text-rose-strong underline underline-offset-2">
                    {site.supportEmail}
                  </a>{" "}
                  within {site.refundDays} days of purchase for a full refund. See the{" "}
                  <Link href="/refund-policy" className="font-semibold text-rose-strong underline underline-offset-2">
                    refund policy
                  </Link>
                  .
                </p>
              </div>
            </section>

            <section aria-labelledby="stories-heading">
              <h2 id="stories-heading" className="font-serif text-3xl">
                Learner stories
              </h2>
              <TestimonialsSection testimonials={testimonials} className="mt-4" emptyTitle="Learner stories will appear here" emptyDescription="When learners share how this course landed for them, and Cynthia approves their words, they will appear here. Nothing is invented in the meantime." />
            </section>

            {course.certificate_enabled ? (
              <section aria-labelledby="cert-heading" className="card-soft flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:gap-5">
                <Award className="size-10 shrink-0 text-warning" aria-hidden="true" />
                <div className="flex-1">
                  <h2 id="cert-heading" className="font-serif text-2xl">
                    Certificate of completion
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">Finish the core modules and your certificate is ready to download and share, with a public verification code.</p>
                </div>
              </section>
            ) : null}
          </div>

          <div id="enrol" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <PurchaseCard course={course} stats={stats} product={product} plan={plan} allAccess={allAccess} enrolled={enrolled} resourceSummary={summary} />
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="pb-28 lg:pb-10">
        <Container size="md">
          <MedicalDisclaimer />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Not sure yet?{" "}
            <Link href="/courses" className="font-semibold text-rose-strong underline underline-offset-4">
              Browse all courses
            </Link>
          </p>
        </Container>
      </Section>

      <PurchaseBar course={course} product={product} enrolled={enrolled} />
    </>
  );
}
