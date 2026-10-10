import * as React from "react";
import { redirect } from "next/navigation";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser, requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/layout/admin-shell";

/**
 * Minimal admin panel layout (created by the ADMIN-2 work because it did not
 * exist yet; ADMIN-1 owns this file and is expected to replace it — keep
 * ensureBootstrapped + requireAdmin + AdminShell). Owner-only pages call
 * requireRole("admin") themselves on top of this gate.
 */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  await requireAdmin("/admin");
  const me = await getCurrentUser();
  if (!me) redirect("/sign-in?next=%2Fadmin");
  return <AdminShell user={{ name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role }}>{children}</AdminShell>;
}
