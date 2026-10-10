import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { CourseCard } from "./course-card";
import type { CourseCardData } from "./catalog-data";

export interface CourseGridProps extends React.ComponentProps<"div"> {
  courses: CourseCardData[];
  comingSoon?: boolean;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyAction?: React.ReactNode;
  headingLevel?: "h2" | "h3";
}

/** Responsive grid of course cards with an empty state. Server-safe. */
function CourseGrid({ courses, comingSoon = false, emptyTitle = "No courses match those filters", emptyDescription = "Try clearing a filter or searching for something broader.", emptyAction, headingLevel, className, ...props }: CourseGridProps) {
  if (courses.length === 0) {
    return <EmptyState icon={<Search />} title={emptyTitle} description={emptyDescription} action={emptyAction} className={className} />;
  }
  return (
    <div data-slot="course-grid" className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} comingSoon={comingSoon} headingLevel={headingLevel} />
      ))}
    </div>
  );
}

export { CourseGrid };
