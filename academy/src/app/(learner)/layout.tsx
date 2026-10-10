import * as React from "react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { cartCount } from "@/lib/actions/cart";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LearnerShell } from "@/components/layout/learner-shell";

/**
 * Minimal signed-in shell (created by the auth/account work because it did not
 * exist yet; the dashboard owner is expected to replace it with the full
 * version — keep ensureBootstrapped + requireUser + LearnerShell).
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  await requireUser();
  const [me, count] = await Promise.all([getCurrentUser(), cartCount()]);
  const user = me ? { name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role } : null;
  return (
    <>
      <SiteHeader user={user} cartCount={count} ctaHref="/learn" ctaLabel="My Learning" />
      <LearnerShell>{children}</LearnerShell>
      <SiteFooter />
    </>
  );
}
