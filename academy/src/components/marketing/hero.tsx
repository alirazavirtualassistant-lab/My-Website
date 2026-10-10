import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileText, Layers } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn, formatHoursMinutes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";
import type { CourseStats } from "@/lib/usecases/catalog";
import type { CourseCardData } from "./catalog-data";
import { CourseArt } from "./course-illustration";
import { Price } from "./price";

export interface HeroProps extends React.ComponentProps<"section"> {
  ctaHref: string;
  featured: { course: CourseCardData; stats: CourseStats } | null;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-cream-2 text-rose-strong [&>svg]:size-4">
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-foreground">{value}</span>
        <span className="block text-xs text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

/** Home hero: brand promise, two CTAs and the featured course with its real numbers. */
function Hero({ ctaHref, featured, className, ...props }: HeroProps) {
  return (
    <section data-slot="hero" aria-labelledby="hero-heading" className={cn("relative overflow-hidden", className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-rose-soft/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-gold-soft/70 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Cradle Your Cravings Academy</p>
          <h1 id="hero-heading" className="mt-4 text-balance">
            Science-backed. Heart-led. <span className="text-rose-strong">One baby step at a time.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
            Online courses by {site.instructor.name}. Prepare for conception and family wellness with small, repeatable steps
            grounded in named sources and delivered with grace over guilt.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={ctaHref}>
                Start your Baby Steps
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/courses">Browse courses</Link>
            </Button>
          </div>
          <blockquote className="mt-10 max-w-md border-l-2 border-gold pl-4 font-serif text-xl leading-snug text-foreground/85 italic">
            “{site.signatureQuote}”
            <footer className="mt-1 font-sans text-xs not-italic text-muted-foreground">— {site.instructor.name}</footer>
          </blockquote>
        </div>

        {featured ? (
          <article aria-labelledby="featured-course-heading" className="card-soft relative overflow-hidden lg:justify-self-end lg:w-full lg:max-w-md">
            <CourseArt thumbnailUrl={featured.course.thumbnail_url} illustration={featured.course.illustration} title={featured.course.title} artSize={150} className="aspect-[16/9]" />
            <div className="p-6">
              <p className="eyebrow text-[0.66rem]">Featured course · {featured.course.level}</p>
              <h2 id="featured-course-heading" className="mt-2 font-serif text-2xl leading-tight font-medium">
                <Link href={`/courses/${featured.course.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                  {featured.course.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{featured.course.subtitle}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat icon={<Clock />} label="of video" value={formatHoursMinutes(featured.stats.total_video_sec)} />
                <Stat icon={<BookOpen />} label="lessons" value={String(featured.stats.lesson_count)} />
                <Stat icon={<FileText />} label="resources" value={String(featured.stats.resource_count)} />
                <Stat icon={<Layers />} label="modules + bonuses" value={String(featured.stats.module_count)} />
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                {featured.course.price ? <Price price={featured.course.price} size="md" showSaleBadge /> : <span className="text-sm text-muted-foreground">Enrolment opens soon</span>}
                <span aria-hidden="true" className="inline-flex items-center gap-1 text-sm font-semibold text-rose-strong">
                  View course <ArrowRight className="size-4" />
                </span>
              </div>
            </div>
          </article>
        ) : (
          <div className="flex justify-center lg:justify-end">
            <Illustration name="cradle" size={320} className="text-rose-strong" />
          </div>
        )}
      </div>
    </section>
  );
}

export { Hero };
