import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Gift, HeartHandshake, KeyRound, Mail, Receipt, SearchX, Undo2 } from "lucide-react";
import { getServices } from "@/services";
import { getSession } from "@/lib/auth/session";
import { site } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Illustration } from "@/components/shared/illustration";
import { canViewOrder, publicOrderStatus } from "@/components/checkout/ownership";
import { OrderLines, type OrderLine } from "@/components/checkout/order-lines";
import { Totals } from "@/components/checkout/totals";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import { readGuestCheckout } from "../../_lib/guest-cookie";
import { finalizeOrderAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: false } };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: orderId } = await searchParams;
  if (!orderId || orderId.length > 80) redirect("/cart");

  const [{ db }, session, guest] = await Promise.all([getServices(), getSession(), readGuestCheckout()]);
  const order = await db.from("orders").get(orderId);
  const viewer = { userId: session?.user_id ?? null, email: session?.email ?? null, role: session?.role ?? null, guestEmail: guest?.email ?? null };

  if (!order || !canViewOrder(order, viewer)) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="We couldn't find that order"
        description="If you just paid, sign in with the email you used at checkout and open My Learning — your course will be waiting there."
        action={
          <>
            <Button asChild>
              <Link href={`/sign-in?next=${encodeURIComponent(`/checkout/success?order=${orderId}`)}`}>Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact support</Link>
            </Button>
          </>
        }
      />
    );
  }

  const status = publicOrderStatus(order.status);
  const shortId = order.id.slice(0, 8).toUpperCase();

  if (status === "pending") {
    return (
      <div className="grid gap-8">
        <PageHeader eyebrow={`Order ${shortId}`} title="Thank you" description="We are waiting for the payment confirmation. This page will update on its own." />
        <OrderConfirmation orderId={order.id} status="pending" finalize={finalizeOrderAction} supportEmail={site.supportEmail} />
      </div>
    );
  }

  if (status === "failed" || status === "refunded") {
    const refunded = status === "refunded";
    return (
      <EmptyState
        icon={<Undo2 />}
        title={refunded ? "This order was refunded" : "This payment didn't go through"}
        description={refunded ? "Access from this order has been closed. Thank you for giving it a try — you are always welcome back." : "No charge was made. You can start again from your cart whenever you like."}
        action={
          <Button asChild>
            <Link href={refunded ? "/courses" : "/cart"}>{refunded ? "Browse courses" : "Back to cart"}</Link>
          </Button>
        }
      />
    );
  }

  // Paid: items, the first course granted, and what comes next.
  const products = order.items.length ? await db.from("products").list({ where: { id: order.items.map((i) => i.product_id) } }) : [];
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: OrderLine[] = order.items.flatMap((i) => {
    const product = byId.get(i.product_id);
    return product ? [{ product, unitCents: i.unit_cents, quantity: i.quantity, lineCents: i.unit_cents * i.quantity }] : [];
  });
  const enrollments = order.gift ? [] : await db.from("enrollments").list({ where: { order_id: order.id, status: "active" } });
  const ownEnrollments = enrollments.filter((e) => e.source !== "partner");
  const courseIds = [...new Set(ownEnrollments.map((e) => e.course_id))];
  const courses = courseIds.length ? await db.from("courses").list({ where: { id: courseIds } }) : [];
  const firstCourse = courses.sort((a, b) => courseIds.indexOf(a.id) - courseIds.indexOf(b.id))[0] ?? null;
  const partnerCourse = courses.find((c) => c.partner_seat_enabled) ?? null;
  const signedInBuyer = !!session && session.user_id === order.user_id;
  const learnHref = firstCourse ? `/learn/${firstCourse.slug}` : "/learn";
  const coupleHref = partnerCourse ? `/learn/${partnerCourse.slug}/couple` : null;
  const guestNote = !session;

  return (
    <div className="grid gap-8">
      <OrderConfirmation orderId={order.id} status="paid" finalize={finalizeOrderAction} supportEmail={site.supportEmail} />

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Illustration name={order.gift ? "cradle" : "sprout"} size={96} className="shrink-0 text-rose-strong" />
        <PageHeader
          eyebrow={`Order ${shortId} · ${formatDate(order.paid_at ?? order.created_at)}`}
          title={order.gift ? "Your gift is on its way" : "Welcome — you're in"}
          description={
            order.gift
              ? `We have emailed ${order.gift.recipient_name} at ${order.gift.recipient_email} with your message and a link to open the course. Nothing to do on your side.`
              : "Thank you for taking this step. Everything you need is ready in My Learning — start with the Course Home whenever you are ready."
          }
        />
      </div>

      {guestNote ? (
        <Alert variant="info">
          <KeyRound aria-hidden="true" />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>
            <p>
              We created a free account for <span className="font-semibold">{order.email}</span> and emailed you a link to set your password. Use it to sign in and open your course.
            </p>
          </AlertDescription>
        </Alert>
      ) : null}

      {!order.gift ? (
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={signedInBuyer ? learnHref : `/sign-in?next=${encodeURIComponent(learnHref)}&email=${encodeURIComponent(order.email)}`}>
              Start learning
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {session ? (
            <Button asChild variant="outline" size="lg">
              <Link href="/account/purchases">
                <Receipt aria-hidden="true" />
                View receipt
              </Link>
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="outline">
            <Link href="/courses">Browse more courses</Link>
          </Button>
          {session ? (
            <Button asChild variant="ghost" size="lg">
              <Link href="/account/purchases">
                <Receipt aria-hidden="true" />
                View receipt
              </Link>
            </Button>
          ) : null}
        </div>
      )}

      {coupleHref && !order.gift ? (
        <section aria-labelledby="partner-teaser" className="flex flex-col gap-4 rounded-lg border border-sage/40 bg-sage-soft/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <h2 id="partner-teaser" className="font-serif text-xl leading-tight">
                Invite your partner
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Your purchase includes one partner seat. Walk the course together, with a shared space for the couple exercises.</p>
            </div>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <Link href={signedInBuyer ? coupleHref : `/sign-in?next=${encodeURIComponent(coupleHref)}&email=${encodeURIComponent(order.email)}`}>
              Open the couple space
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      ) : null}

      <section aria-labelledby="order-items" className="card-soft p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="order-items" className="font-serif text-2xl">
            {order.gift ? "Gift details" : "What you bought"}
          </h2>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            Receipt sent to {order.email}
          </p>
        </div>
        {lines.length > 0 ? <OrderLines lines={lines} gift={!!order.gift} /> : <p className="text-sm text-muted-foreground">Items are listed on your receipt.</p>}
        {order.gift ? (
          <div className="mt-4 rounded-lg bg-gold-soft/50 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Gift className="size-4 text-warning" aria-hidden="true" />
              For {order.gift.recipient_name} · {order.gift.recipient_email}
            </p>
            {order.gift.message ? <blockquote className="mt-2 border-l-2 border-gold pl-3 font-serif text-base italic text-foreground/90">“{order.gift.message}”</blockquote> : null}
          </div>
        ) : null}
        <Totals className="mt-5" subtotalCents={order.subtotal_cents} discountCents={order.discount_cents} couponCode={order.coupon_code} taxCents={order.tax_cents} totalCents={order.total_cents} />
      </section>

      <p className="text-xs text-muted-foreground">
        Changed your mind? You have {site.refundDays} days — see the{" "}
        <Link href="/refund-policy" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          refund policy
        </Link>
        . Questions? Write to{" "}
        <a href={`mailto:${site.supportEmail}`} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          {site.supportEmail}
        </a>
        .
      </p>
    </div>
  );
}
