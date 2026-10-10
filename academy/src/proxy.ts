import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic auth checks at the edge. This only looks for the presence of a
 * session cookie to redirect anonymous visitors away from learner/admin areas
 * quickly; real authorisation (role checks, enrollment checks) happens in the
 * server layouts and actions.
 */

const SESSION_COOKIE = "cyc_session"; // mock-mode session (see src/lib/auth/cookies.ts)

const PROTECTED_PREFIXES = ["/learn", "/account", "/community", "/certificates", "/admin"];
const PUBLIC_UNDER_PROTECTED = ["/admin/register", "/admin/sign-in"];
const AUTH_PAGES = ["/sign-in", "/sign-up"];

function hasSessionCookie(req: NextRequest): boolean {
  if (req.cookies.get(SESSION_COOKIE)?.value) return true;
  // Supabase SSR cookies: sb-<project-ref>-auth-token (possibly chunked .0, .1 …)
  return req.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token") && c.value !== "");
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const signedIn = hasSessionCookie(req);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isPublicException = PUBLIC_UNDER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected && !isPublicException && !signedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && signedIn) {
    const url = req.nextUrl.clone();
    const next = req.nextUrl.searchParams.get("next");
    url.pathname = next && next.startsWith("/") && !next.startsWith("//") ? next : "/learn";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Forward the pathname so server helpers (requireUser) can build ?next=…
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname + search);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  // Lesson pages never carry analytics; hint to downstream components.
  if (pathname.startsWith("/learn/")) res.headers.set("x-cyc-no-analytics", "1");
  return res;
}

export const config = {
  matcher: [
    // Skip static files, images and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml|manifest.webmanifest|api/).*)",
  ],
};
