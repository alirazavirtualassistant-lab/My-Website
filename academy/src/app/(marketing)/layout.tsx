import * as React from "react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseBySlug } from "@/lib/usecases/catalog";
import { cartCount } from "@/lib/actions/cart";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

/**
 * Public pages: header + <main id="main"> + footer. Toaster, cookie consent,
 * analytics and the demo ribbon are mounted once in the root layout.
 */
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  const [me, count, babySteps] = await Promise.all([getCurrentUser(), cartCount(), getCourseBySlug("baby-steps")]);
  const user = me ? { name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role } : null;
  const ctaHref = babySteps && babySteps.status === "published" ? `/courses/${babySteps.slug}` : "/courses";
  return (
    <>
      <SiteHeader user={user} cartCount={count} ctaHref={ctaHref} />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
