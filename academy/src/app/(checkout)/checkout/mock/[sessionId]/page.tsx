import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, UserRound } from "lucide-react";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { site } from "@/lib/config/site";
import { quoteCheckout, type CheckoutQuote } from "@/lib/usecases/fulfilment";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Illustration } from "@/components/shared/illustration";
import { OrderLines, type OrderLine } from "@/components/checkout/order-lines";
import { Totals } from "@/components/checkout/totals";
import { MockCheckoutForm } from "@/components/checkout/mock-checkout-form";
import { payButtonLabel } from "@/components/checkout/pricing-labels";
import { readGuestCheckout } from "../../../_lib/guest-cookie";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Test payment", robots: { index: false, follow: false } };

/** Absolute provider URLs → in-app paths (same origin), so router.push works. */
function toPath(url: string, fallback: string): string {
  try {
    const u = new URL(url, site.url);
    return `${u.pathname}${u.search}`;
  } catch {
    return fallback;
  }
}

export default async function MockCheckoutPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const { db, mode } = await getServices();
  if (mode.payments !== "mock") notFound();
  const cs = await db.from("checkout_sessions").get(sessionId);
  if (!cs || cs.provider !== "mock") notFound();

  const [session, guest] = await Promise.all([getSession(), readGuestCheckout()]);
  const isStaff = session?.role === "admin" || session?.role === "assistant";
  const ownsSession = cs.user_id ? cs.user_id === session?.user_id : !session || (cs.email ?? "").toLowerCase() === (guest?.email ?? session?.email ?? "").toLowerCase();
  const successPath = toPath(cs.success_url, "/checkout/success");
  const cancelPath = toPath(cs.cancel_url, "/cart?canceled=1");

  if (!ownsSession && !isStaff) {
    return (
      <EmptyState
        icon={<UserRound />}
        title="This checkout belongs to another account"
        description="Sign in with the account that started it, or begin a fresh checkout from your cart."
        action={
          <>
            <Button asChild>
              <Link href={`/sign-in?next=${encodeURIComponent(`/checkout/mock/${cs.id}`)}`}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cart">Go to cart</Link>
            </Button>
          </>
        }
      />
    );
  }

  if (cs.status === "complete") {
    return (
      <EmptyState
        icon={<CheckCircle2 />}
        title="This test payment is already complete"
        description="Your order has been confirmed. You can see it on the confirmation page."
        action={
          <Button asChild>
            <Link href={successPath}>View confirmation</Link>
          </Button>
        }
      />
    );
  }

  if (cs.status === "expired") {
    return (
      <EmptyState
        icon={<Clock />}
        title="This checkout has expired"
        description="Checkout links stay open for seven days. Your cart is still saved — start again whenever you like."
        action={
          <Button asChild>
            <Link href="/cart">Back to cart</Link>
          </Button>
        }
      />
    );
  }

  // Order summary: the pending order is the source of truth; fall back to a fresh quote.
  const order = cs.order_id ? await db.from("orders").get(cs.order_id) : null;
  let lines: OrderLine[] = [];
  let totals = { subtotal: 0, discount: 0, total: 0, coupon: null as string | null };
  let quoteMode: CheckoutQuote["mode"] = "payment";
  if (order) {
    const products = order.items.length ? await db.from("products").list({ where: { id: order.items.map((i) => i.product_id) } }) : [];
    const byId = new Map(products.map((p) => [p.id, p]));
    lines = order.items.flatMap((i) => {
      const product = byId.get(i.product_id);
      return product ? [{ product, unitCents: i.unit_cents, quantity: i.quantity, lineCents: i.unit_cents * i.quantity }] : [];
    });
    totals = { subtotal: order.subtotal_cents, discount: order.discount_cents, total: order.total_cents, coupon: order.coupon_code };
    quoteMode = products.some((p) => p.type === "subscription") ? "subscription" : "payment";
  } else {
    try {
      const quote = await quoteCheckout(cs.items, cs.coupon_code);
      lines = quote.totals.lines.map((l) => ({ product: l.product, unitCents: l.unit_cents, quantity: l.quantity, lineCents: l.line_cents }));
      totals = { subtotal: quote.totals.subtotal_cents, discount: quote.totals.discount_cents, total: quote.totals.total_cents, coupon: quote.coupon?.code ?? null };
      quoteMode = quote.mode;
    } catch {
      lines = [];
    }
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Demo payment"
        title="Simulated checkout"
        description={`Pay ${formatMoney(totals.total)} with the pre-filled test card to see the full purchase flow.`}
        actions={<Badge variant="gold">Test mode</Badge>}
      />

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] md:items-start">
        <aside aria-labelledby="mock-summary" className="card-soft p-5 sm:p-6 md:order-last">
          <h2 id="mock-summary" className="mb-4 font-serif text-2xl">
            Order summary
          </h2>
          {lines.length > 0 ? (
            <OrderLines lines={lines} gift={!!cs.gift} />
          ) : (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Illustration name="seedling" size={36} className="text-rose-strong" />
              Items are listed on your order.
            </div>
          )}
          {cs.gift ? (
            <p className="mt-4 rounded-lg bg-gold-soft/50 p-3 text-xs text-foreground/80">
              Gift for <span className="font-semibold">{cs.gift.recipient_name}</span> ({cs.gift.recipient_email}).
            </p>
          ) : null}
          <Totals className="mt-5" subtotalCents={totals.subtotal} discountCents={totals.discount} couponCode={totals.coupon} taxCents={0} totalCents={totals.total} />
        </aside>

        <div className="card-soft p-5 sm:p-6">
          <MockCheckoutForm
            sessionId={cs.id}
            successPath={successPath}
            cancelPath={cancelPath}
            payLabel={payButtonLabel({ totalCents: totals.total, mode: quoteMode, gift: !!cs.gift })}
            email={cs.email ?? session?.email ?? null}
          />
        </div>
      </div>
    </div>
  );
}
