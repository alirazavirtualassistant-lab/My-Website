import type { Metadata } from "next";
import Link from "next/link";
import { FolderInput, Plus } from "lucide-react";
import { listCoursesForAdmin } from "@/lib/usecases/admin-courses";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { CourseListTable } from "@/components/admin/courses/course-list-table";
import { SearchParamToast } from "@/components/admin/courses/search-param-toast";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Courses", robots: { index: false, follow: false } };

export default async function AdminCoursesPage() {
  const rows = await listCoursesForAdmin();
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <SearchParamToast />
      <PageHeader
        eyebrow="Admin"
        title="Courses"
        description="Everything learners can enrol in. Drafts stay hidden from the catalogue until you publish them."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/importer">
                <FolderInput /> Import a package
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/courses/new">
                <Plus /> New course
              </Link>
            </Button>
          </>
        }
      />
      <CourseListTable rows={rows} />
    </div>
  );
}
