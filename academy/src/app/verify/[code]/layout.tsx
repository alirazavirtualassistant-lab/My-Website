import * as React from "react";
import { ensureBootstrapped } from "@/lib/usecases/demo";
import { getCurrentUser } from "@/lib/auth/session";
import { cartCount } from "@/lib/actions/cart";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const dynamic = "force-dynamic";

/** Public verification page shell: header + <main id="main"> + footer, outside the marketing group. */
export default async function VerifyLayout({ children }: { children: React.ReactNode }) {
  await ensureBootstrapped();
  const [me, count] = await Promise.all([getCurrentUser(), cartCount()]);
  const user = me ? { name: me.profile.name, avatar_url: me.profile.avatar_url, role: me.profile.role } : null;
  return (
    <>
      <SiteHeader user={user} cartCount={count} />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
