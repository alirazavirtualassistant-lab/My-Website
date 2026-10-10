/**
 * GET /auth/magic?token=…&next=… — consumes a mock-mode magic link (single
 * use, 15 minutes). Supabase magic links go through /auth/callback instead.
 */
import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const next = safeRedirectPath(url.searchParams.get("next"), "/learn");
  const token = url.searchParams.get("token") ?? "";
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin), 303);
  if (token.length < 16) return to(`/sign-in?error=link&next=${encodeURIComponent(next)}`);
  const { auth } = await getServices();
  try {
    const result = await auth.completeMagicLink({ token });
    return to(result.ok ? next : `/sign-in?error=link&next=${encodeURIComponent(next)}`);
  } catch (err) {
    console.error("[auth/magic] failed", err);
    return to(`/sign-in?error=link&next=${encodeURIComponent(next)}`);
  }
}
