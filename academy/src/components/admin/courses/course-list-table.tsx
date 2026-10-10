import * as React from "react";
import Link from "next/link";
import { BookOpen, ExternalLink, ListTree, Settings2 } from "lucide-react";
import type { AdminCourseRow } from "@/lib/usecases/admin-courses";
import { formatDate, pluralize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Illustration, isIllustrationName } from "@/components/shared/illustration";
import { StatusBadge } from "./status-badge";
import { DeleteCourseButton } from "./delete-course-button";

function CourseListTable({ rows }: { rows: AdminCourseRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen />}
        title="No courses yet"
        description="Create a course from scratch, or import the Baby Steps package to start with the full curriculum."
        action={
          <>
            <Button asChild>
              <Link href="/admin/courses/new">New course</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/importer">Open the importer</Link>
            </Button>
          </>
        }
      />
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Lessons</TableHead>
          <TableHead className="text-right">Enrolled</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ course, module_count, lesson_count, enrolled }) => (
          <TableRow key={course.id}>
            <TableCell className="whitespace-normal">
              <Link href={`/admin/courses/${course.id}`} className="group flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rose-soft/60 text-rose-strong">
                  <Illustration name={isIllustrationName(course.illustration) ? course.illustration : "leaves"} size={32} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground group-hover:text-rose-strong">{course.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    /courses/{course.slug} · {pluralize(module_count, "module")}
                  </span>
                </span>
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge status={course.status} />
              {course.status === "scheduled" && course.publish_at ? <span className="ml-2 text-xs text-muted-foreground">{formatDate(course.publish_at, { month: "short", day: "numeric" })}</span> : null}
            </TableCell>
            <TableCell className="text-right tabular-nums">{lesson_count}</TableCell>
            <TableCell className="text-right tabular-nums">{enrolled}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(course.last_updated_at, { month: "short", day: "numeric", year: "numeric" })}</TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Settings2 /> Settings
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/courses/${course.id}/curriculum`}>
                    <ListTree /> Curriculum
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="size-9">
                  <Link href={`/courses/${course.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${course.title} on the site (opens in a new tab)`}>
                    <ExternalLink />
                  </Link>
                </Button>
                <DeleteCourseButton courseId={course.id} title={course.title} enrolled={enrolled} compact />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { CourseListTable };
