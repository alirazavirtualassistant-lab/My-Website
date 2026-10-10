import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServices } from "@/services";
import { getCourseById } from "@/lib/usecases/catalog";
import { enrolledCount } from "@/lib/usecases/admin-courses";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/courses/course-form";
import { CourseSubnav } from "@/components/admin/courses/course-subnav";
import { CourseThumbnailCard } from "@/components/admin/courses/course-thumbnail-card";
import { DeleteCourseButton } from "@/components/admin/courses/delete-course-button";
import { StatusBadge } from "@/components/admin/courses/status-badge";
import { SearchParamToast } from "@/components/admin/courses/search-param-toast";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = await getCourseById(id);
  return { title: course ? `${course.title} · Settings` : "Course", robots: { index: false, follow: false } };
}

export default async function CourseSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  if (!course) notFound();
  const [{ storage }, enrolled] = await Promise.all([getServices(), enrolledCount(id)]);
  const thumbnailUrl = course.thumbnail_path ? storage.getPublicUrl({ bucket: "public-assets", path: course.thumbnail_path }) : null;
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <SearchParamToast />
      <PageHeader
        eyebrow="Courses"
        title={course.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={course.status} />
            <span>
              {enrolled} enrolled · /courses/{course.slug}
            </span>
          </span>
        }
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/courses">
              <ArrowLeft /> All courses
            </Link>
          </Button>
        }
      />
      <CourseSubnav courseId={course.id} slug={course.slug} />
      <CourseThumbnailCard courseId={course.id} thumbnailUrl={thumbnailUrl} illustration={course.illustration} />
      <CourseForm course={course} />
      <section aria-labelledby="danger-title" className="rounded-lg border border-danger/30 bg-danger-soft/40 p-5 sm:p-6">
        <h2 id="danger-title" className="font-serif text-xl font-medium text-danger">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Deleting removes the course and all of its content. Prefer “Archived” status to hide a course while keeping learners’ access.</p>
        <div className="mt-4">
          <DeleteCourseButton courseId={course.id} title={course.title} enrolled={enrolled} />
        </div>
      </section>
    </div>
  );
}
