import * as React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration, isIllustrationName } from "@/components/shared/illustration";

export interface RecommendedCourseProps extends React.ComponentProps<"div"> {
  course: Course | null;
}

/** A published course the learner is not enrolled in, or a calm "more coming soon". */
function RecommendedCourse({ course, className, ...props }: RecommendedCourseProps) {
  if (!course) {
    return (
      <EmptyState
        size="sm"
        icon={<Compass />}
        title="More courses coming soon"
        description="You are enrolled in everything that is currently published. New courses will appear here first."
        className={className}
      />
    );
  }
  const art = isIllustrationName(course.illustration) ? course.illustration : "path";
  return (
    <div className={cn("card-soft flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6", className)} {...props}>
      <span aria-hidden="true" className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-rose-soft/60 text-rose-strong">
        <Illustration name={art} size={64} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl">{course.title}</h3>
          {course.badge === "new" ? <Badge variant="gold">New</Badge> : course.badge === "bestseller" ? <Badge variant="rose">Bestseller</Badge> : null}
        </div>
        {course.short_description ? <p className="mt-1 text-sm text-muted-foreground">{course.short_description}</p> : null}
        <p className="mt-1 text-xs text-muted-foreground">
          {course.level}
          {course.duration_weeks ? ` · ${course.duration_weeks} weeks` : ""}
        </p>
      </div>
      <Button asChild variant="outline" className="shrink-0">
        <Link href={`/courses/${course.slug}`}>
          See the course
          <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}

export { RecommendedCourse };
