import * as React from "react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { cartCount } from "@/lib/actions/cart";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LearnerShell } from "@/components/layout/learner-shell";
import { LearnerAside } from "@/components/dashboard/learner-aside";
import { loadLearnerOverview } from "@/components/dashboard/dashboard-data";

export const dynamic = "force-dynamic";

/**
 * Signed-in shell for /learn, /community, /certificates and /account:
 * bootstrap → require a session → header + rail shell + footer. The rail
 * aside shows the learner's level ring and streak; it is best-effort and never
 * blocks the page. Toaster, cookie consent, analytics and the demo ribbon are
 * mounted once in the root layout.
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  const session = await requireUser();
  const [me, count] = await Promise.all([getCurrentUser(), cartCount()]);
  const user = me ? { name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role } : null;

  let aside: React.ReactNode = null;
  try {
    const overview = await loadLearnerOverview(session.user_id, me?.profile.timezone ?? null);
    aside = <LearnerAside level={overview.level} streak={overview.streak} />;
  } catch (err) {
    console.warn("[learner-layout] aside failed", err);
  }

  return (
    <>
      <SiteHeader user={user} cartCount={count} ctaHref="/learn" ctaLabel="My Learning" />
      <LearnerShell aside={aside}>{children}</LearnerShell>
      <SiteFooter />
    </>
  );
}
