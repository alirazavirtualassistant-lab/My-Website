/**
 * Server-side session helpers. Server Components, Server Actions and Route
 * Handlers only (imports next/headers + the services factory).
 *
 *   const session = await getSession();          // Session | null
 *   const me = await getCurrentUser();           // { session, profile } | null
 *   const session = await requireUser("/learn"); // redirects to /sign-in?next=…
 *   const admin = await requireAdmin();          // admin | assistant
 *   const owner = await requireRole("admin");    // owner-only areas
 */
import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Profile, Role } from "@/lib/types";
import { safeRedirectPath } from "@/lib/utils";
import { getServices } from "@/services";
import type { Session } from "@/services/types";

export type { Session };

export interface CurrentUser {
  session: Session;
  profile: Profile;
}

export const ADMIN_ROLES: readonly Role[] = ["admin", "assistant"];

export function isAdminRole(role: Role | null | undefined): boolean {
  return role === "admin" || role === "assistant";
}

/** Current session from the request cookies, or null. */
export async function getSession(): Promise<Session | null> {
  const { auth } = await getServices();
  return auth.getSession();
}

/** Session plus the live profile row (null when signed out or soft-deleted). */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;
  const { db } = await getServices();
  const profile = await db.from("profiles").get(session.user_id);
  if (!profile || profile.deleted_at) return null;
  return { session, profile };
}

/**
 * Best-effort current path for the `next` param. The proxy may set
 * `x-pathname`; otherwise fall back to the dashboard.
 */
async function currentPath(): Promise<string> {
  try {
    const h = await headers();
    const candidate = h.get("x-pathname") ?? h.get("x-invoke-path") ?? null;
    return safeRedirectPath(candidate, "/learn");
  } catch {
    return "/learn";
  }
}

export function signInUrl(next?: string | null): string {
  const target = safeRedirectPath(next, "/learn");
  return `/sign-in?next=${encodeURIComponent(target)}`;
}

/**
 * Requires a signed-in user; otherwise redirects to /sign-in?next=<path>.
 * Pass the current path when you know it (layouts/pages know their route).
 */
export async function requireUser(next?: string): Promise<Session> {
  const session = await getSession();
  if (session) return session;
  redirect(signInUrl(next ?? (await currentPath())));
}

/** Requires an admin or assistant; learners are sent to /learn?denied=1. */
export async function requireAdmin(next?: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(signInUrl(next ?? "/admin"));
  if (!isAdminRole(session.role)) redirect("/learn?denied=1");
  return session;
}

/**
 * Requires exactly this role. `requireRole("admin")` gates owner-only areas
 * (billing, settings, team): assistants bounce to /admin?denied=1, learners to
 * /learn?denied=1.
 */
export async function requireRole(role: Role, next?: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(signInUrl(next ?? (role === "learner" ? "/learn" : "/admin")));
  if (session.role !== role) {
    redirect(isAdminRole(session.role) ? "/admin?denied=1" : "/learn?denied=1");
  }
  return session;
}
