import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Clock, FileText } from "lucide-react";
import { cn, formatDate, formatHoursMinutes, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CourseArt } from "./course-illustration";
import { Price } from "./price";
import { topicLabel, type CourseCardData } from "./catalog-data";

export interface CourseCardProps extends React.ComponentProps<"article"> {
  course: CourseCardData;
  /** Scheduled courses render without a link and with an "Opens …" note. */
  comingSoon?: boolean;
  headingLevel?: "h2" | "h3";
}

function CourseBadge({ badge }: { badge: CourseCardData["badge"] }) {
  if (badge === "bestseller") return <Badge variant="gold">Bestseller</Badge>;
  if (badge === "new") return <Badge variant="rose">New</Badge>;
  return null;
}

/**
 * Catalog card: art, title, short description, duration, lesson count and price.
 * The whole card is clickable through a stretched link on the title.
 */
function CourseCard({ course, comingSoon = false, headingLevel: Heading = "h3", className, ...props }: CourseCardProps) {
  const href = `/courses/${course.slug}`;
  const topics = course.topics.slice(0, 2).map(topicLabel);
  return (
    <article
      data-slot="course-card"
      className={cn(
        "card-soft group relative flex h-full flex-col overflow-hidden transition-[box-shadow,transform] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        !comingSoon && "hover:-translate-y-0.5 hover:shadow-card motion-reduce:hover:translate-y-0",
        comingSoon && "opacity-90",
        className,
      )}
      {...props}
    >
      <CourseArt thumbnailUrl={course.thumbnail_url} illustration={course.illustration} title={course.title} artSize={110} />
      <div className="absolute top-3 left-3 flex gap-2">
        {comingSoon ? <Badge variant="muted">Coming soon</Badge> : <CourseBadge badge={course.badge} />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="eyebrow text-[0.66rem]">
          {course.level}
          {topics.length ? ` · ${topics.join(" · ")}` : ""}
        </p>
        <Heading className="font-serif text-xl leading-tight font-medium">
          {comingSoon ? (
            <span>{course.title}</span>
          ) : (
            <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {course.title}
            </Link>
          )}
        </Heading>
        <p className="line-clamp-3 text-sm text-muted-foreground">{course.short_description}</p>
        <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-muted-foreground">
          {course.duration_sec > 0 ? (
            <div className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              <dt className="sr-only">Video</dt>
              <dd>{formatHoursMinutes(course.duration_sec)} of video</dd>
            </div>
          ) : null}
          {course.lesson_count > 0 ? (
            <div className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" aria-hidden="true" />
              <dt className="sr-only">Lessons</dt>
              <dd>{pluralize(course.lesson_count, "lesson")}</dd>
            </div>
          ) : null}
          {course.resource_count > 0 ? (
            <div className="inline-flex items-center gap-1">
              <FileText className="size-3.5" aria-hidden="true" />
              <dt className="sr-only">Resources</dt>
              <dd>{pluralize(course.resource_count, "resource")}</dd>
            </div>
          ) : null}
        </dl>
        <div className="flex items-center justify-between border-t border-border pt-4">
          {comingSoon ? (
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarClock className="size-4" aria-hidden="true" />
              {course.publish_at ? `Opens ${formatDate(course.publish_at, { month: "long", day: "numeric" })}` : "Date to be announced"}
            </span>
          ) : course.price ? (
            <Price price={course.price} size="sm" showSaleBadge />
          ) : (
            <span className="text-sm text-muted-foreground">Enrolment opens soon</span>
          )}
          {!comingSoon ? (
            <span aria-hidden="true" className="inline-flex items-center gap-1 text-sm font-semibold text-rose-strong">
              View course
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export { CourseCard };
