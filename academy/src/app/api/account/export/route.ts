/**
 * GET /api/account/export — the signed-in user's data as a JSON download
 * (GDPR-style export). Anonymous requests are redirected to sign-in.
 */
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { exportUserData, logAudit } from "@/lib/usecases/users";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireUser("/account/privacy");
  const data = await exportUserData(session.user_id);
  await logAudit(session.user_id, "user.exported", "profile", session.user_id, {});
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cradle-your-cravings-export-${stamp}.json"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
