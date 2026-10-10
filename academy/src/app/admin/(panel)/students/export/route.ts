/**
 * GET /admin/students/export?q=… — every (matching) student as CSV.
 * Admin + assistant. Completion counts only; never note or quiz contents.
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { listStudents, studentsToCsv } from "@/lib/usecases/admin";
import { logAudit } from "@/lib/usecases/users";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await requireAdmin("/admin/students");
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 120);
  const { rows } = await listStudents({ query: q || undefined, limit: 100_000, offset: 0 });
  const csv = studentsToCsv(rows);
  await logAudit(session.user_id, "students.exported", "profile", null, { count: rows.length, query: q || null });
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${csv}`, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="students-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
