import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FolderInput } from "lucide-react";
import { getAdminDashboardStats } from "@/lib/usecases/admin";
import { getSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatGrid } from "@/components/admin/dashboard/stat-grid";
import { CompletionTable } from "@/components/admin/dashboard/completion-table";
import { DropoffChart } from "@/components/admin/dashboard/dropoff-chart";
import { TopLessons } from "@/components/admin/dashboard/top-lessons";
import { QuickLinks } from "@/components/admin/dashboard/quick-links";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin dashboard", robots: { index: false, follow: false } };

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const [{ denied }, stats, session] = await Promise.all([searchParams, getAdminDashboardStats(), getSession()]);
  const firstName = session?.email ? undefined : undefined;
  void firstName;
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Dashboard"
        description="How the academy is doing today: revenue, learners and where people are in the course."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/importer">
                <FolderInput /> Importer
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/courses">
                <BookOpen /> Courses
              </Link>
            </Button>
          </>
        }
      />

      {denied ? (
        <Alert variant="info">
          <AlertTitle>That area is for the owner account</AlertTitle>
          <AlertDescription>Products, coupons, settings and team management are limited to the admin role. Everything else is open to you.</AlertDescription>
        </Alert>
      ) : null}

      <StatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <DropoffChart data={stats.dropoff} />
        <QuickLinks stats={stats} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <CompletionTable rows={stats.completion_by_module} />
        <TopLessons rows={stats.top_lessons} />
      </div>
    </div>
  );
}
