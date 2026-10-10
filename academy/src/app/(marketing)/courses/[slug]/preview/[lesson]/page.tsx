import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, FileText, Sparkles } from "lucide-react";
import { site } from "@/lib/config/site";
import { getCurrentUser } from "@/lib/auth/session";
import { findLessonBySlug, getCourseBySlug, getCourseTree, lessonSlug } from "@/lib/usecases/catalog";
import { getLearnerAccess, listProducts } from "@/lib/usecases/access";
import { formatDuration, formatMoney, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { moduleIllustration } from "@/components/marketing/course-illustration";
import { LockedResources, MorePreviews, TranscriptView, VideoOrComingSoon } from "@/components/marketing/preview-lesson";
import { readingMinutes } from "@/components/marketing/transcript";
import { effectiveUnitPrice } from "@/components/marketing/price";
import { courseProductFor } from "../../../../_lib/data";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string; lesson: string }>;

/** Deduplicated between generateMetadata and the page render. Only preview lessons resolve. */
const loadPreview = cache(async (slug: string, lessonParam: string) => {
  const course = await getCourseBySlug(slug);
  if (!course || course.status !== "published") return null;
  const tree = await getCourseTree(course.id);
  if (!tree) return null;
  const found = findLessonBySlug(tree, lessonParam);
  if (!found || !found.lesson.is_preview) return null;
  return { course, tree, ...found };
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, lesson } = await params;
  const data = await loadPreview(slug, lesson);
  if (!data) notFound();
  const title = `${data.lesson.title} (free preview)`;
  const description = data.lesson.description || `A free preview lesson from ${data.course.title}.`;
  return {
    title,
    description,
    alternates: { canonical: `/courses/${data.course.slug}/preview/${lessonSlug(data.lesson)}` },
    openGraph: { title: `${title} · ${data.course.title}`, description, url: `/courses/${data.course.slug}/preview/${lessonSlug(data.lesson)}` },
  };
}

export default async function PreviewLessonPage({ params }: { params: Params }) {
  const { slug, lesson: lessonParam } = await params;
  const data = await loadPreview(slug, lessonParam);
  if (!data) notFound();
  const { course, tree, module: mod, lesson } = data;
  const [me, products] = await Promise.all([getCurrentUser(), listProducts()]);
  const access = me ? await getLearnerAccess(me.session.user_id, course.id, me.session.role) : null;
  const enrolled = Boolean(access?.allowed);
  const product = courseProductFor(products, course.id);
  const price = product ? effectiveUnitPrice(product) : null;
  const art = moduleIllustration(mod.code, mod.illustration);

  return (
    <>
      <div className="border-b border-gold/60 bg-gold-soft/70">
        <Container size="xl" className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
          <p className="inline-flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="size-4 text-warning" aria-hidden="true" />
            Free preview from <span className="font-serif text-base">{course.title}</span>
          </p>
          {enrolled ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/learn/${course.slug}/${lessonSlug(lesson)}`}>Open in the course player</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link href={`/courses/${course.slug}#enrol`}>
                {price ? (price.cents === 0 ? "Enrol for free" : `Enrol · ${formatMoney(price.cents, price.currency)}`) : "See the course"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </Container>
      </div>

      <Section spacing="md">
        <Container size="xl" className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12">
          <article className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/courses" className="hover:text-rose-strong hover:underline underline-offset-4">
                    Courses
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/courses/${course.slug}`} className="hover:text-rose-strong hover:underline underline-offset-4">
                    {course.title}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground/80">
                  Preview
                </li>
              </ol>
            </nav>
            <p className="eyebrow mt-6">
              {mod.title}
              {lesson.series ? ` · ${lesson.series}` : ""}
            </p>
            <h1 className="mt-2 text-balance">{lesson.title}</h1>
            {lesson.description ? <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{lesson.description}</p> : null}
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground" aria-label="Lesson facts">
              <li>
                <Badge variant="success">Free preview</Badge>
              </li>
              {lesson.duration_sec > 0 ? (
                <li className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {formatDuration(lesson.duration_sec)} video
                </li>
              ) : null}
              <li className="inline-flex items-center gap-1.5">
                <FileText className="size-4" aria-hidden="true" />
                {readingMinutes(lesson.transcript)} min read
              </li>
              {lesson.resources.length > 0 ? (
                <li className="inline-flex items-center gap-1.5">
                  <FileText className="size-4" aria-hidden="true" />
                  {pluralize(lesson.resources.length, "resource")}
                </li>
              ) : null}
            </ul>

            <VideoOrComingSoon lesson={lesson} illustration={art} className="mt-8" />

            {lesson.doctor_callout ? <Callout className="mt-6" /> : null}

            {lesson.notes ? (
              <aside aria-label="Lesson notes" className="mt-6 rounded-lg border border-border bg-cream-2/60 p-4 text-sm leading-relaxed text-foreground/90">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Notes</p>
                <p className="mt-1">{lesson.notes}</p>
              </aside>
            ) : null}

            <section aria-labelledby="transcript-heading" className="mt-10">
              <h2 id="transcript-heading" className="font-serif text-3xl">
                Transcript
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">The full teleprompter script, word for word.</p>
              <div className="card-soft mt-4 p-6 sm:p-8">
                <TranscriptView transcript={lesson.transcript} />
              </div>
            </section>

            {lesson.action_steps.length > 0 ? (
              <section aria-labelledby="steps-heading" className="mt-10">
                <h2 id="steps-heading" className="font-serif text-3xl">
                  Your action steps
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Each one earns XP inside the course when you mark it complete.</p>
                <ol className="mt-4 space-y-2">
                  {lesson.action_steps.map((s, i) => (
                    <li key={s.id} className="card-soft flex items-center gap-3 p-4 text-sm">
                      <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-soft font-serif text-base text-rose-strong">
                        {i + 1}
                      </span>
                      <span className="flex-1 font-medium">{s.label}</span>
                      <span className="text-xs font-bold text-warning">+{s.xp} XP</span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/courses/${course.slug}`}>
                  <ArrowLeft aria-hidden="true" />
                  Back to the course
                </Link>
              </Button>
              {!enrolled ? (
                <Button asChild>
                  <Link href={`/courses/${course.slug}#enrol`}>
                    Enrol to unlock every lesson
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {!enrolled ? <LockedResources resources={lesson.resources} courseSlug={course.slug} /> : null}
            <div className="card-soft p-5">
              <p className="eyebrow">Want all {pluralize(tree.modules.reduce((n, m) => n + m.lessons.length, 0), "lesson")}?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {enrolled ? "You are enrolled. Open the course player to track progress and earn XP." : "Enrol once for lifetime access, every resource, the community and your certificate."}
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href={enrolled ? `/learn/${course.slug}` : `/courses/${course.slug}#enrol`}>{enrolled ? "Go to course" : "See pricing and enrol"}</Link>
              </Button>
            </div>
            <MorePreviews tree={tree} current={lesson.id} className="card-soft p-5" />
          </aside>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container size="md">
          <MedicalDisclaimer />
          <p className="mt-3 text-center text-xs text-muted-foreground">Questions? Email {site.supportEmail}.</p>
        </Container>
      </Section>
    </>
  );
}
