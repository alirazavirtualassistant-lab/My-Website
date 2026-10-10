import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Receipt, Users } from "lucide-react";
import { listStudents } from "@/lib/usecases/admin";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StudentsSearch } from "@/components/admin/students/students-search";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Students", robots: { index: false, follow: false } };

const PAGE_SIZE = 25;

const roleVariant = { learner: "muted", assistant: "gold", admin: "rose" } as const;

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 120);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const { rows, total } = await listStudents({ query: q || undefined, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (n: number) => `/admin/students?${new URLSearchParams({ ...(q ? { q } : {}), ...(n > 1 ? { page: String(n) } : {}) }).toString()}`.replace(/\?$/, "");
  const exportHref = `/admin/students/export${q ? `?q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        eyebrow="People"
        title="Students"
        description="Everyone with an account. Open a student to manage access, progress, orders and certificates."
        actions={
          <>
            <Button asChild variant="ghost">
              <Link href="/admin/orders">
                <Receipt aria-hidden="true" /> Orders
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={exportHref} download>
                <Download aria-hidden="true" /> Export CSV
              </a>
            </Button>
          </>
        }
      />

      {sp.deleted === "1" ? (
        <Alert variant="success">
          <AlertTitle>Account deleted</AlertTitle>
          <AlertDescription>
            <p>Their progress, notes and uploads are gone; order records were kept for accounting.</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StudentsSearch initialQuery={q} />
        <p className="text-sm text-muted-foreground" role="status">
          {total === 0 ? "No students" : `${total.toLocaleString("en-US")} ${total === 1 ? "student" : "students"}`}
          {q ? ` matching “${q}”` : ""}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title={q ? "No one matches that search" : "No students yet"}
          description={q ? "Try a different name or email, or clear the search." : "Accounts appear here as people sign up or buy a course."}
          action={
            q ? (
              <Button asChild variant="outline">
                <Link href="/admin/students">Clear search</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Courses</TableHead>
              <TableHead className="text-right">XP</TableHead>
              <TableHead className="text-right">Lessons done</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.profile.id}>
                <TableCell>
                  <Link href={`/admin/students/${r.profile.id}`} className="group block min-w-0 max-w-[260px] rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                    <span className="block truncate font-semibold text-foreground group-hover:text-rose-strong group-hover:underline">{r.profile.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.profile.email}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={roleVariant[r.profile.role]} className="capitalize">
                    {r.profile.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{r.enrollments.filter((e) => e.status === "active").length}</TableCell>
                <TableCell className="text-right tabular-nums">{r.xp.toLocaleString("en-US")}</TableCell>
                <TableCell className="text-right tabular-nums">{r.completed_lessons}</TableCell>
                <TableCell className="text-muted-foreground">{r.last_active ? formatDate(r.last_active, { month: "short", day: "numeric", year: "numeric" }) : "—"}</TableCell>
                <TableCell className="text-right tabular-nums">{r.orders}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(r.profile.created_at, { month: "short", day: "numeric", year: "numeric" })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
          <Button asChild variant="outline" size="sm" disabled={page <= 1} aria-disabled={page <= 1}>
            {page > 1 ? (
              <Link href={pageHref(page - 1)}>
                <ChevronLeft aria-hidden="true" /> Previous
              </Link>
            ) : (
              <span>
                <ChevronLeft aria-hidden="true" /> Previous
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page} of {pages}
          </p>
          <Button asChild variant="outline" size="sm" aria-disabled={page >= pages}>
            {page < pages ? (
              <Link href={pageHref(page + 1)}>
                Next <ChevronRight aria-hidden="true" />
              </Link>
            ) : (
              <span>
                Next <ChevronRight aria-hidden="true" />
              </span>
            )}
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
