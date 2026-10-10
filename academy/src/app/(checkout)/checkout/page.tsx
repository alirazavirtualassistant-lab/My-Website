import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { getServices } from "@/services";
import { getCurrentUser } from "@/lib/auth/session";
import { readCart, readCoupon, readDisplayCurrency } from "@/lib/usecases/cart";
import { quoteCheckout, type CheckoutQuote } from "@/lib/usecases/fulfilment";
import { installmentsSummary, isSubscriptionProduct } from "@/lib/domain/pricing";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { normalizeCheckoutLines } from "@/components/checkout/schemas";
import { payButtonLabel } from "@/components/checkout/pricing-labels";
import { OrderLines } from "@/components/checkout/order-lines";
import { Totals } from "@/components/checkout/totals";
import { CouponForm } from "@/components/checkout/coupon-form";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { readGuestCheckout } from "../_lib/guest-cookie";
import { createCheckoutAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ gift?: string }> }) {
  const { gift: giftParam } = await searchParams;
  const gift = giftParam === "1";
  const [me, cart, couponCode, currency, guest, { mode }] = await Promise.all([getCurrentUser(), readCart(), readCoupon(), readDisplayCurrency(), readGuestCheckout(), getServices()]);
  const lines = normalizeCheckoutLines(cart);
  if (lines.length === 0) redirect("/cart");

  let quote: CheckoutQuote;
  try {
    quote = await quoteCheckout(lines, couponCode);
  } catch {
    // Unavailable product or a membership mixed with a course: the cart page explains and lets them fix it.
    redirect("/cart");
  }

  const now = new Date();
  const subscription = quote.products.find(isSubscriptionProduct) ?? null;
  const plan = quote.products.map((p) => installmentsSummary(p, now)).find(Boolean) ?? null;
  const recurringNote = subscription
    ? `Renews ${subscription.interval === "year" ? "yearly" : "monthly"} until you cancel.`
    : plan
      ? `${plan.label}. The remaining payments are taken monthly.`
      : null;
  const payLabel = payButtonLabel({ totalCents: quote.totals.total_cents, mode: quote.mode, gift });

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Checkout · step 2 of 2"
        title={gift ? "Send as a gift" : "Almost there"}
        description={gift ? "Pay now; they open the course on their own account whenever they are ready." : "A few details, then a secure payment page. Nothing is charged until you confirm there."}
        actions={mode.payments === "mock" ? <Badge variant="gold">Test mode</Badge> : null}
      />

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] md:items-start">
        <aside aria-labelledby="checkout-summary" className="card-soft p-5 sm:p-6 md:order-last md:sticky md:top-24">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="checkout-summary" className="font-serif text-2xl">
              Order summary
            </h2>
            <Link href="/cart" className="inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Link>
          </div>
          <OrderLines
            gift={gift}
            displayCurrency={currency}
            lines={quote.totals.lines.map((l) => ({ product: l.product, unitCents: l.unit_cents, quantity: l.quantity, lineCents: l.line_cents }))}
          />
          <div className="mt-5 border-t border-border pt-4">
            <CouponForm compact code={couponCode} error={quote.couponError} discountCents={quote.totals.discount_cents} />
          </div>
          <Totals
            className="mt-5"
            subtotalCents={quote.totals.subtotal_cents}
            discountCents={quote.totals.discount_cents}
            couponCode={quote.coupon?.code ?? null}
            totalCents={quote.totals.total_cents}
            displayCurrency={currency}
            recurringNote={recurringNote}
          />
        </aside>

        <div className="card-soft p-5 sm:p-6">
          <CheckoutForm
            action={createCheckoutAction}
            buyer={me ? { name: me.profile.name, email: me.profile.email } : null}
            gift={gift}
            payLabel={payLabel}
            paymentsMode={mode.payments}
            defaults={guest ? { email: guest.email, name: guest.name } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
