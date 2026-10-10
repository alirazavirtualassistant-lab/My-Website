import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Info } from "lucide-react";
import { readCart, readCoupon, readDisplayCurrency } from "@/lib/usecases/cart";
import { listProducts } from "@/lib/usecases/access";
import { quoteCheckout, type CheckoutQuote } from "@/lib/usecases/fulfilment";
import { effectiveUnitPrice, installmentsSummary, isSubscriptionProduct } from "@/lib/domain/pricing";
import { site } from "@/lib/config/site";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Illustration } from "@/components/shared/illustration";
import { normalizeCheckoutLines } from "@/components/checkout/schemas";
import { OrderLines, type OrderLine } from "@/components/checkout/order-lines";
import { Totals } from "@/components/checkout/totals";
import { CouponForm } from "@/components/checkout/coupon-form";
import { CurrencySelect } from "@/components/checkout/currency-select";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your cart", robots: { index: false, follow: false } };

export default async function CartPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const { canceled } = await searchParams;
  const [cart, couponCode, currency, products] = await Promise.all([readCart(), readCoupon(), readDisplayCurrency(), listProducts()]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const now = new Date();

  const available = cart.filter((i) => byId.has(i.product_id));
  const unavailableIds = cart.filter((i) => !byId.has(i.product_id)).map((i) => i.product_id);
  const lines = normalizeCheckoutLines(available);

  let quote: CheckoutQuote | null = null;
  let quoteError: string | null = null;
  if (lines.length > 0) {
    try {
      quote = await quoteCheckout(lines, couponCode);
    } catch (err) {
      quoteError = err instanceof Error ? err.message : "We couldn't price your cart just now.";
    }
  }

  const displayLines: OrderLine[] = quote
    ? quote.totals.lines.map((l) => ({ product: l.product, unitCents: l.unit_cents, quantity: l.quantity, lineCents: l.line_cents }))
    : lines.map((l) => {
        const product = byId.get(l.product_id)!;
        const unit = effectiveUnitPrice(product, now);
        return { product, unitCents: unit, quantity: 1, lineCents: unit };
      });

  const isEmpty = cart.length === 0;
  const subscription = quote?.products.find(isSubscriptionProduct) ?? null;
  const plan = quote?.products.map((p) => installmentsSummary(p, now)).find(Boolean) ?? null;
  const recurringNote = subscription
    ? `Renews ${subscription.interval === "year" ? "yearly" : "monthly"} until you cancel. Manage it any time from your account.`
    : plan
      ? `${plan.label} — one charge now, the rest monthly. Access stays once the plan is paid off.`
      : null;

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow="Checkout · step 1 of 2" title="Your cart" description={isEmpty ? undefined : "Everything here is digital: lifetime access for courses, instant delivery, no shipping."} />

      {canceled === "1" ? (
        <Alert variant="info">
          <Info aria-hidden="true" />
          <AlertTitle>Checkout was cancelled</AlertTitle>
          <AlertDescription>
            <p>No payment was taken. Your cart is still here whenever you are ready.</p>
          </AlertDescription>
        </Alert>
      ) : null}

      {isEmpty ? (
        <EmptyState
          icon={<Illustration name="seedling" className="text-rose-strong" />}
          title="Your cart is empty"
          description="Start with one small step. Browse the courses and add the one that feels right for where you are."
          action={
            <Button asChild size="lg">
              <Link href="/courses">
                Browse courses
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6">
          {unavailableIds.length > 0 ? (
            <Alert variant="warning">
              <Info aria-hidden="true" />
              <AlertTitle>{unavailableIds.length === 1 ? "One item is no longer available" : "Some items are no longer available"}</AlertTitle>
              <AlertDescription>
                <p>It has been left out of your total. Remove it below to tidy up your cart.</p>
              </AlertDescription>
            </Alert>
          ) : null}

          {quoteError ? (
            <Alert variant="warning">
              <Info aria-hidden="true" />
              <AlertTitle>We need one small change</AlertTitle>
              <AlertDescription>
                <p>{quoteError}. Remove an item and the totals will update.</p>
              </AlertDescription>
            </Alert>
          ) : null}

          <section aria-labelledby="cart-items" className="card-soft p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="cart-items" className="font-serif text-2xl">
                Items
              </h2>
              <CurrencySelect value={currency} />
            </div>
            <OrderLines
              removable
              displayCurrency={currency}
              lines={[
                ...displayLines,
                ...unavailableIds.map<OrderLine>((id) => ({
                  product: {
                    id,
                    type: "course",
                    slug: "",
                    title: "Unavailable item",
                    description: "",
                    course_ids: [],
                    grants_all_courses: false,
                    price_cents: 0,
                    sale_price_cents: null,
                    sale_ends_at: null,
                    currency: site.currency,
                    interval: null,
                    installments: null,
                    stripe_product_id: null,
                    stripe_price_id: null,
                    stripe_sale_price_id: null,
                    active: false,
                    is_free: false,
                    created_at: "",
                    updated_at: "",
                  },
                  unitCents: 0,
                  quantity: 1,
                  lineCents: 0,
                  unavailable: true,
                })),
              ]}
            />
          </section>

          <div className="grid gap-6 md:grid-cols-[1fr_minmax(0,18rem)] md:items-start">
            <section aria-labelledby="cart-coupon" className="card-soft p-5 sm:p-6">
              <h2 id="cart-coupon" className="mb-3 font-serif text-xl">
                Have a code?
              </h2>
              <CouponForm code={couponCode} error={quote?.couponError ?? (couponCode && !quote ? "Fix the cart first, then we will check the code." : null)} discountCents={quote?.totals.discount_cents ?? 0} />
            </section>

            <section aria-labelledby="cart-summary" className="card-soft p-5 sm:p-6">
              <h2 id="cart-summary" className="mb-3 font-serif text-xl">
                Summary
              </h2>
              {quote ? (
                <Totals
                  subtotalCents={quote.totals.subtotal_cents}
                  discountCents={quote.totals.discount_cents}
                  couponCode={quote.coupon?.code ?? null}
                  totalCents={quote.totals.total_cents}
                  displayCurrency={currency}
                  recurringNote={recurringNote}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Totals will appear once the cart is ready.</p>
              )}
              <Button asChild size="lg" className="mt-5 w-full" aria-disabled={!quote || undefined} tabIndex={!quote ? -1 : undefined}>
                <Link href={quote ? "/checkout" : "#cart-items"}>
                  <ShoppingBag aria-hidden="true" />
                  Checkout
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {site.refundDays}-day money-back guarantee ·{" "}
                <Link href="/refund-policy" className="underline underline-offset-4 hover:text-rose-strong">
                  refund policy
                </Link>
              </p>
            </section>
          </div>

          <p className="text-sm text-muted-foreground">
            Want to add more?{" "}
            <Link href="/courses" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
              Back to courses
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
