import * as React from "react";
import { redirect } from "next/navigation";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser, requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/layout/admin-shell";

export const dynamic = "force-dynamic";

/**
 * Admin panel chrome + role gate. Every admin page lives under this route
 * group (URLs stay /admin/…); /admin/register sits outside it on purpose so
 * the first-admin bootstrap stays reachable without a session.
 *
 * AdminShell filters the sidebar with `visibleFor(adminNav, role)`, so an
 * assistant never sees Products, Coupons, Settings or Team.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  await requireAdmin("/admin");
  const me = await getCurrentUser();
  if (!me) redirect("/sign-in?next=%2Fadmin");
  return <AdminShell user={{ name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role }}>{children}</AdminShell>;
}
