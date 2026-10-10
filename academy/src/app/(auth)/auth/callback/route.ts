/**
 * GET /auth/callback — finishes Supabase flows (Google OAuth, magic links,
 * sign-up confirmation, recovery). Mock mode never lands here.
 *
 *   ?code=…&next=…                 PKCE exchange (OAuth / email links)
 *   ?code=…&type=magiclink         same, via completeMagicLink
 *   ?token_hash=…&type=…           implicit email links (templates using token_hash)
 *   ?error=…&error_description=…   provider error → /sign-in?error=oauth
 */
import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import { safeRedirectPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const next = safeRedirectPath(url.searchParams.get("next"), "/learn");
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") ?? "").toLowerCase();
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin), 303);

  if (url.searchParams.get("error")) {
    console.warn("[auth/callback] provider error", url.searchParams.get("error"), url.searchParams.get("error_description"));
    return to(`/sign-in?error=oauth&next=${encodeURIComponent(next)}`);
  }

  const { auth } = await getServices();
  try {
    if (tokenHash) {
      if (type === "recovery") return to(`/reset-password?token=${encodeURIComponent(tokenHash)}${url.searchParams.get("welcome") ? "&welcome=1" : ""}`);
      const result = type === "signup" || type === "email" || type === "email_change" ? await auth.verifyEmail({ token: tokenHash }) : await auth.completeMagicLink({ token: tokenHash });
      return to(result.ok ? next : `/sign-in?error=link&next=${encodeURIComponent(next)}`);
    }
    if (code) {
      const result = type === "magiclink" ? await auth.completeMagicLink({ token: code }) : await auth.completeOAuth({ code });
      return to(result.ok ? next : `/sign-in?error=${type === "magiclink" ? "link" : "oauth"}&next=${encodeURIComponent(next)}`);
    }
  } catch (err) {
    console.error("[auth/callback] failed", err);
    return to(`/sign-in?error=oauth&next=${encodeURIComponent(next)}`);
  }
  return to(`/sign-in?error=link&next=${encodeURIComponent(next)}`);
}
