import "server-only";
import { getServices } from "@/services";
import type { DataStore, NormalizedPaymentEvent } from "@/services/types";
import type { Coupon, Enrollment, Gift, Order, Product, Profile, Subscription } from "@/lib/types";
import { newId, nowIso, randomToken, sha256Hex, addDays, normalizeEmail } from "@/lib/utils";
import { cartTotals, isSubscriptionProduct } from "@/lib/domain/pricing";
import { site } from "@/lib/config/site";
import { env } from "@/lib/env";

export interface CreateCheckoutArgs {
  userId: string | null;
  email: string | null;
  lines: Array<{ product_id: string; quantity: number }>;
  couponCode: string | null;
  gift: Order["gift"];
  successPath?: string;
  cancelPath?: string;
}

export interface CheckoutQuote {
  products: Product[];
  totals: ReturnType<typeof cartTotals>;
  coupon: Coupon | null;
  couponError: string | null;
  mode: "payment" | "subscription";
}

/** Server-side price computation; never trust client amounts. */
export async function quoteCheckout(lines: CreateCheckoutArgs["lines"], couponCode: string | null): Promise<CheckoutQuote> {
  const { db } = await getServices();
  const ids = [...new Set(lines.map((l) => l.product_id))];
  const products = ids.length ? await db.from("products").list({ where: { id: ids } }) : [];
  const activeProducts = products.filter((p) => p.active);
  if (activeProducts.length !== ids.length) throw new Error("One or more products are unavailable");
  const now = new Date();
  let coupon: Coupon | null = null;
  let couponError: string | null = null;
  if (couponCode) {
    coupon = await db.from("coupons").findOne({ code: couponCode.trim().toUpperCase() });
    if (!coupon) couponError = "That coupon code was not found";
  }
  const subs = activeProducts.filter(isSubscriptionProduct);
  if (subs.length > 1 || (subs.length === 1 && activeProducts.length > 1)) throw new Error("A membership must be purchased on its own");
  const totals = cartTotals({ lines, products: activeProducts, coupon, now });
  if (coupon && totals.discount_cents === 0 && totals.subtotal_cents > 0 && !couponError) couponError = totals.coupon_error ?? "That coupon does not apply to these items";
  return { products: activeProducts, totals, coupon: couponError ? null : coupon, couponError, mode: subs.length === 1 ? "subscription" : "payment" };
}

/** Creates a pending order + provider checkout session and returns the redirect URL. */
export async function createCheckout(args: CreateCheckoutArgs): Promise<{ url: string; orderId: string }> {
  const { db, payments } = await getServices();
  const quote = await quoteCheckout(args.lines, args.couponCode);
  const email = args.email ? normalizeEmail(args.email) : null;
  if (!args.userId && !email) throw new Error("Email is required for guest checkout");
  const now = nowIso();
  const isFree = quote.totals.total_cents === 0;
  const order: Order = {
    id: newId(),
    user_id: args.userId,
    email: email ?? "",
    items: quote.totals.lines.map((l) => ({ product_id: l.product.id, title: l.product.title, unit_cents: l.unit_cents, quantity: l.quantity })),
    subtotal_cents: quote.totals.subtotal_cents,
    discount_cents: quote.totals.discount_cents,
    tax_cents: 0,
    total_cents: quote.totals.total_cents,
    currency: site.currency,
    coupon_code: quote.coupon?.code ?? null,
    status: "pending",
    provider: payments.kind,
    provider_session_id: null,
    provider_payment_intent_id: null,
    provider_subscription_id: null,
    provider_event_ids: [],
    gift: args.gift,
    refunded_cents: 0,
    created_at: now,
    paid_at: null,
    updated_at: now,
  };
  if (args.userId && !order.email) {
    const profile = await db.from("profiles").get(args.userId);
    order.email = profile?.email ?? "";
  }
  await db.from("orders").insert(order);

  if (isFree) {
    // Free products/lead magnets: fulfil immediately through the same path.
    await handlePaymentEvent({
      id: `free_${order.id}`,
      type: "checkout.completed",
      session_id: `free_${order.id}`,
      payment_intent_id: null,
      subscription_id: null,
      customer_id: null,
      email: order.email,
      amount_total_cents: 0,
      tax_cents: 0,
      discount_cents: order.discount_cents,
      currency: order.currency,
      metadata: { order_id: order.id },
    });
    return { url: `${args.successPath ?? "/checkout/success"}?order=${order.id}`, orderId: order.id };
  }

  const base = site.url;
  const { url, session_id } = await payments.createCheckoutSession({
    lines: args.lines,
    user_id: args.userId,
    email: order.email || null,
    coupon_code: quote.coupon?.code ?? null,
    gift: args.gift,
    success_url: `${base}${args.successPath ?? "/checkout/success"}?order=${order.id}`,
    cancel_url: `${base}${args.cancelPath ?? "/cart"}?canceled=1`,
    mode: quote.mode,
    amounts: { subtotal_cents: order.subtotal_cents, discount_cents: order.discount_cents, total_cents: order.total_cents },
  });
  await db.from("orders").update(order.id, { provider_session_id: session_id, updated_at: nowIso() });
  // Mock sessions carry our order id so the mock webhook can find the order.
  if (payments.kind === "mock") {
    const cs = await db.from("checkout_sessions").get(session_id);
    if (cs) await db.from("checkout_sessions").update(session_id, { order_id: order.id });
  }
  return { url, orderId: order.id };
}

/**
 * The single entry point for payment webhooks (Stripe or mock). Idempotent by
 * provider event id. Enrollments are created here and nowhere else.
 */
export async function handlePaymentEvent(event: NormalizedPaymentEvent): Promise<{ handled: boolean; duplicate: boolean }> {
  const { db, payments } = await getServices();
  if (event.type === "ignored") return { handled: false, duplicate: false };
  return db.transaction(async (tx) => {
    const seen = await tx.from("webhook_events").get(event.id);
    if (seen) return { handled: true, duplicate: true };
    await tx.from("webhook_events").insert({ id: event.id, provider: payments.kind, type: event.type, processed_at: nowIso() });
    switch (event.type) {
      case "checkout.completed":
        await onCheckoutCompleted(tx, event);
        break;
      case "invoice.paid":
        await onInvoicePaid(tx, event);
        break;
      case "subscription.updated":
        await onSubscriptionUpdated(tx, event);
        break;
      case "subscription.deleted":
        await onSubscriptionDeleted(tx, event);
        break;
      case "charge.refunded":
        await onChargeRefunded(tx, event);
        break;
      case "invoice.payment_failed":
        await onPaymentFailed(tx, event);
        break;
    }
    return { handled: true, duplicate: false };
  });
}

async function findOrderForEvent(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "checkout.completed" }>): Promise<Order | null> {
  if (event.metadata.order_id) {
    const o = await tx.from("orders").get(event.metadata.order_id);
    if (o) return o;
  }
  const bySession = await tx.from("orders").findOne({ provider_session_id: event.session_id });
  if (bySession) return bySession;
  if (event.metadata.session_id) {
    const cs = await tx.from("checkout_sessions").get(event.metadata.session_id);
    if (cs?.order_id) return tx.from("orders").get(cs.order_id);
  }
  return null;
}

async function onCheckoutCompleted(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "checkout.completed" }>) {
  const order = await findOrderForEvent(tx, event);
  if (!order) {
    console.error("[fulfilment] no order for checkout event", event.id);
    return;
  }
  if (order.status === "paid") return; // already fulfilled (e.g. duplicate session completion)
  const now = nowIso();
  const { auth } = await getServices();

  // Resolve the buyer: existing user or a new passwordless account (guest checkout)
  let buyer: Profile | null = order.user_id ? await tx.from("profiles").get(order.user_id) : null;
  if (!buyer) {
    const email = normalizeEmail(order.email || event.email || "");
    if (!email) throw new Error("Order has no email");
    const ensured = await auth.ensureAccount({ email, sendSetPassword: true });
    buyer = ensured.profile;
  }
  if (event.customer_id && !buyer.stripe_customer_id) {
    await tx.from("profiles").update(buyer.id, { stripe_customer_id: event.customer_id, updated_at: now });
  }

  await tx.from("orders").update(order.id, {
    user_id: buyer.id,
    email: buyer.email,
    status: "paid",
    paid_at: now,
    tax_cents: event.tax_cents,
    total_cents: event.amount_total_cents || order.total_cents,
    provider_payment_intent_id: event.payment_intent_id,
    provider_subscription_id: event.subscription_id,
    provider_event_ids: [...order.provider_event_ids, event.id],
    updated_at: now,
  });

  // Coupon usage
  if (order.coupon_code) {
    const coupon = await tx.from("coupons").findOne({ code: order.coupon_code });
    if (coupon) await tx.from("coupons").update(coupon.id, { uses: coupon.uses + 1 });
  }

  const products = await tx.from("products").list({ where: { id: order.items.map((i) => i.product_id) } });
  const allCourses = await tx.from("courses").list();

  if (order.gift) {
    // Gift: do not enrol the buyer; create a redeemable gift per product.
    for (const p of products) {
      const token = randomToken(24);
      const gift: Gift = {
        id: newId(),
        order_id: order.id,
        product_id: p.id,
        buyer_user_id: buyer.id,
        buyer_email: buyer.email,
        recipient_email: normalizeEmail(order.gift.recipient_email),
        recipient_name: order.gift.recipient_name,
        message: order.gift.message,
        token_hash: await sha256Hex(token),
        status: "pending",
        redeemed_by_user_id: null,
        redeemed_at: null,
        created_at: now,
      };
      await tx.from("gifts").insert(gift);
      await safeSend("gift-received", gift.recipient_email, {
        recipientName: gift.recipient_name,
        buyerName: buyer.name,
        message: gift.message,
        productTitle: p.title,
        redeemUrl: `${site.url}/gift/${token}`,
      });
    }
    await safeSend("gift-sent-confirmation", buyer.email, { name: buyer.name, recipientEmail: order.gift.recipient_email, orderId: order.id });
  } else {
    for (const p of products) {
      if (isSubscriptionProduct(p)) {
        const sub: Subscription = {
          id: newId(),
          user_id: buyer.id,
          product_id: p.id,
          provider_subscription_id: event.subscription_id,
          status: "active",
          current_period_end: p.interval === "year" ? addDays(new Date(), 365).toISOString() : addDays(new Date(), 30).toISOString(),
          cancel_at_period_end: false,
          created_at: now,
          updated_at: now,
        };
        await tx.from("subscriptions").insert(sub);
        const courseIds = p.grants_all_courses ? allCourses.filter((c) => c.status === "published").map((c) => c.id) : p.course_ids;
        for (const courseId of courseIds) await grantEnrollment(tx, { userId: buyer.id, courseId, source: "subscription", orderId: order.id, subscriptionId: sub.id });
      } else if (p.type === "payment_plan") {
        // Payment plans are recurring in the provider; access is granted on the first payment.
        const sub: Subscription = {
          id: newId(),
          user_id: buyer.id,
          product_id: p.id,
          provider_subscription_id: event.subscription_id,
          status: "active",
          current_period_end: addDays(new Date(), 30).toISOString(),
          cancel_at_period_end: false,
          created_at: now,
          updated_at: now,
        };
        await tx.from("subscriptions").insert(sub);
        for (const courseId of p.course_ids) await grantEnrollment(tx, { userId: buyer.id, courseId, source: "purchase", orderId: order.id, subscriptionId: sub.id });
      } else {
        const courseIds = p.type === "bundle" ? p.course_ids : p.course_ids;
        for (const courseId of courseIds) await grantEnrollment(tx, { userId: buyer.id, courseId, source: p.is_free ? "free" : "purchase", orderId: order.id, subscriptionId: null });
      }
    }
    await safeSend("purchase-receipt", buyer.email, {
      name: buyer.name,
      orderId: order.id,
      items: order.items,
      totalCents: event.amount_total_cents || order.total_cents,
      discountCents: order.discount_cents,
      taxCents: event.tax_cents,
      currency: order.currency,
      learnUrl: `${site.url}/learn`,
    });
  }

  await safeSend("admin-new-sale", env.resend.adminNotificationEmail, {
    buyerEmail: buyer.email,
    items: order.items,
    totalCents: event.amount_total_cents || order.total_cents,
    orderId: order.id,
    gift: !!order.gift,
  });
}

export async function grantEnrollment(
  tx: DataStore,
  input: { userId: string; courseId: string; source: Enrollment["source"]; orderId: string | null; subscriptionId: string | null; startedAt?: string },
): Promise<Enrollment> {
  const repo = tx.from("enrollments");
  const existing = (await repo.list({ where: { user_id: input.userId, course_id: input.courseId } })).find((e) => e.status === "active");
  if (existing) return existing;
  const course = await tx.from("courses").get(input.courseId);
  const now = nowIso();
  const expires = course && !course.lifetime_access && course.access_days ? addDays(new Date(), course.access_days).toISOString() : null;
  const row: Enrollment = {
    id: newId(),
    user_id: input.userId,
    course_id: input.courseId,
    source: input.source,
    order_id: input.orderId,
    subscription_id: input.subscriptionId,
    started_at: input.startedAt ?? now,
    expires_at: expires,
    status: "active",
    unlock_all: false,
    partner_invites_remaining: course?.partner_seat_enabled && input.source !== "partner" ? 1 : 0,
    created_at: now,
    updated_at: now,
  };
  await repo.insert(row);
  // Re-activate a previously revoked enrollment's progress stays attached by user+lesson ids.
  return row;
}

export async function revokeEnrollment(tx: DataStore, enrollmentId: string, reason: string) {
  const repo = tx.from("enrollments");
  const e = await repo.get(enrollmentId);
  if (!e || e.status === "revoked") return;
  await repo.update(e.id, { status: "revoked", updated_at: nowIso() });
  // Partner enrollments granted from this owner's seat go too.
  const links = await tx.from("partner_links").list({ where: { owner_user_id: e.user_id, course_id: e.course_id } });
  for (const link of links) {
    if (!link.partner_user_id) continue;
    const partnerEnrollments = await repo.list({ where: { user_id: link.partner_user_id, course_id: e.course_id, source: "partner" } });
    for (const pe of partnerEnrollments) if (pe.status === "active") await repo.update(pe.id, { status: "revoked", updated_at: nowIso() });
  }
  await tx.from("audit_log").insert({ id: newId(), actor_user_id: null, action: "enrollment.revoked", target_type: "enrollment", target_id: e.id, meta: { reason }, created_at: nowIso() });
}

async function onInvoicePaid(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "invoice.paid" }>) {
  if (!event.subscription_id) return;
  const sub = await tx.from("subscriptions").findOne({ provider_subscription_id: event.subscription_id });
  if (!sub) return;
  const product = await tx.from("products").get(sub.product_id);
  const now = nowIso();
  await tx.from("subscriptions").update(sub.id, { status: "active", current_period_end: event.period_end ?? sub.current_period_end, updated_at: now });
  for (const e of await tx.from("enrollments").list({ where: { subscription_id: sub.id } })) {
    if (e.status !== "active") await tx.from("enrollments").update(e.id, { status: "active", updated_at: now });
  }
  // Payment plans: count paid invoices; cancel after the final instalment.
  if (product?.type === "payment_plan" && product.installments) {
    const paidCount = (await tx.from("webhook_events").list({ where: { type: "invoice.paid" } })).length; // coarse; refined by provider ids below
    const invoicesForSub = await tx.from("audit_log").list({ where: { target_type: "subscription", target_id: sub.id, action: "installment.paid" } });
    await tx.from("audit_log").insert({ id: newId(), actor_user_id: null, action: "installment.paid", target_type: "subscription", target_id: sub.id, meta: { event_id: event.id, paidCount }, created_at: now });
    if (invoicesForSub.length + 1 >= product.installments) {
      const { payments } = await getServices();
      if (sub.provider_subscription_id) await payments.cancelSubscription({ subscription_id: sub.provider_subscription_id, at_period_end: false });
      await tx.from("subscriptions").update(sub.id, { status: "canceled", cancel_at_period_end: false, updated_at: now });
      // Enrollment stays active: the plan is paid off.
    }
  }
  const profile = await tx.from("profiles").get(sub.user_id);
  if (profile && product && product.type === "subscription") await safeSend("subscription-renewed", profile.email, { name: profile.name, productTitle: product.title, amountCents: event.amount_cents, periodEnd: event.period_end });
}

async function onSubscriptionUpdated(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "subscription.updated" }>) {
  const sub = await tx.from("subscriptions").findOne({ provider_subscription_id: event.subscription_id });
  if (!sub) return;
  const status = normaliseSubStatus(event.status);
  const now = nowIso();
  await tx.from("subscriptions").update(sub.id, { status, current_period_end: event.current_period_end ?? sub.current_period_end, cancel_at_period_end: event.cancel_at_period_end, updated_at: now });
  const product = await tx.from("products").get(sub.product_id);
  if (product?.type === "payment_plan") return; // access tied to instalments, not status
  const enrollments = await tx.from("enrollments").list({ where: { subscription_id: sub.id } });
  const shouldHaveAccess = status === "active" || status === "trialing" || status === "past_due";
  for (const e of enrollments) {
    if (shouldHaveAccess && e.status !== "active") await tx.from("enrollments").update(e.id, { status: "active", updated_at: now });
    if (!shouldHaveAccess && e.status === "active") await tx.from("enrollments").update(e.id, { status: "expired", updated_at: now });
  }
}

async function onSubscriptionDeleted(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "subscription.deleted" }>) {
  const sub = await tx.from("subscriptions").findOne({ provider_subscription_id: event.subscription_id });
  if (!sub) return;
  const now = nowIso();
  await tx.from("subscriptions").update(sub.id, { status: "canceled", updated_at: now });
  const product = await tx.from("products").get(sub.product_id);
  if (product?.type !== "payment_plan") {
    for (const e of await tx.from("enrollments").list({ where: { subscription_id: sub.id } })) {
      if (e.status === "active") await tx.from("enrollments").update(e.id, { status: "expired", updated_at: now });
    }
  }
  const profile = await tx.from("profiles").get(sub.user_id);
  if (profile && product) await safeSend("subscription-canceled", profile.email, { name: profile.name, productTitle: product.title });
}

async function onChargeRefunded(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "charge.refunded" }>) {
  if (!event.payment_intent_id) return;
  const order = await tx.from("orders").findOne({ provider_payment_intent_id: event.payment_intent_id });
  if (!order) return;
  const now = nowIso();
  await tx.from("orders").update(order.id, {
    status: event.fully_refunded ? "refunded" : "partially_refunded",
    refunded_cents: event.amount_refunded_cents,
    provider_event_ids: [...order.provider_event_ids, event.id],
    updated_at: now,
  });
  if (event.fully_refunded) {
    for (const e of await tx.from("enrollments").list({ where: { order_id: order.id } })) await revokeEnrollment(tx, e.id, "refund");
    for (const g of await tx.from("gifts").list({ where: { order_id: order.id } })) if (g.status === "pending") await tx.from("gifts").update(g.id, { status: "canceled" });
  }
}

async function onPaymentFailed(tx: DataStore, event: Extract<NormalizedPaymentEvent, { type: "invoice.payment_failed" }>) {
  if (!event.subscription_id) return;
  const sub = await tx.from("subscriptions").findOne({ provider_subscription_id: event.subscription_id });
  if (!sub) return;
  await tx.from("subscriptions").update(sub.id, { status: "past_due", updated_at: nowIso() });
  const profile = await tx.from("profiles").get(sub.user_id);
  if (profile) await safeSend("payment-failed", profile.email, { name: profile.name, billingUrl: `${site.url}/account/billing` });
}

function normaliseSubStatus(s: string): Subscription["status"] {
  const allowed: Subscription["status"][] = ["active", "trialing", "past_due", "canceled", "unpaid", "incomplete"];
  return (allowed as string[]).includes(s) ? (s as Subscription["status"]) : "active";
}

/** Admin-initiated refund: calls the provider, then the webhook path revokes access. In mock mode the event is applied directly. */
export async function refundOrder(orderId: string, actorUserId: string): Promise<{ ok: boolean; error?: string }> {
  const { db, payments } = await getServices();
  const order = await db.from("orders").get(orderId);
  if (!order || order.status !== "paid") return { ok: false, error: "Order is not refundable" };
  if (!order.provider_payment_intent_id && payments.kind !== "mock") return { ok: false, error: "Order has no payment to refund" };
  const res = await payments.refund({ payment_intent_id: order.provider_payment_intent_id ?? `mock_pi_${order.id}` });
  if (!res.ok) return res;
  await db.from("audit_log").insert({ id: newId(), actor_user_id: actorUserId, action: "order.refund", target_type: "order", target_id: order.id, meta: { refund_id: res.refund_id }, created_at: nowIso() });
  if (payments.kind === "mock") {
    await handlePaymentEvent({ id: `mock_evt_refund_${order.id}`, type: "charge.refunded", payment_intent_id: order.provider_payment_intent_id ?? `mock_pi_${order.id}`, amount_refunded_cents: order.total_cents, fully_refunded: true });
  }
  return { ok: true };
}

async function safeSend(template: string, to: string, props: Record<string, unknown>) {
  try {
    const { sendTemplate } = await import("@/lib/email/send");
    await sendTemplate(template as never, to, props as never);
  } catch (err) {
    console.warn(`[fulfilment] email ${template} failed`, err);
  }
}
