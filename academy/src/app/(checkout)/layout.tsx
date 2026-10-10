import * as React from "react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser } from "@/lib/auth/session";
import { cartCount } from "@/lib/actions/cart";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Container } from "@/components/ui/container";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";

export const dynamic = "force-dynamic";

/**
 * Cart, checkout, gift and partner-invite pages: public header (with the live
 * cart count), a narrow reading-width column, the medical disclaimer under
 * every screen, then the footer. Toaster / consent / analytics / ribbon are
 * mounted once in the root layout.
 */
export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  const [me, count] = await Promise.all([getCurrentUser(), cartCount()]);
  const user = me ? { name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role } : null;
  return (
    <>
      <SiteHeader user={user} cartCount={count} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Container size="sm" className="flex flex-1 flex-col gap-8 py-8 sm:py-12">
          <div className="flex-1">{children}</div>
          <MedicalDisclaimer variant="box" className="mt-4" />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
