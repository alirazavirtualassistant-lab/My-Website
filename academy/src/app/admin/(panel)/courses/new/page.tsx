import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/courses/course-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New course", robots: { index: false, follow: false } };

export default function NewCoursePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <PageHeader
        eyebrow="Courses"
        title="New course"
        description="Start with the essentials. You can add modules, lessons and media once it exists."
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/courses">
              <ArrowLeft /> All courses
            </Link>
          </Button>
        }
      />
      <CourseForm course={null} />
    </div>
  );
}
