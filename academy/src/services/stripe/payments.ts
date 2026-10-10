/**
 * Stripe PaymentsProvider (stripe@23, default API version of the SDK).
 *
 * Checkout: every session gets a `checkout_sessions` row first (provider
 * 'stripe', status open) whose id travels in Stripe metadata as `session_ref`
 * (and `session_id`, which the fulfilment use case reads). The Stripe session
 * id is what we return as `session_id`, so `orders.provider_session_id` and
 * `checkout.session.completed` match directly.
 *
 * Prices: `price_data` built from the products table (sale price while a sale
 * is on, else list price); a stored `stripe_price_id` / `stripe_sale_price_id`
 * wins when present. Subscriptions and payment plans use recurring prices.
 *
 * Payment plans (`installments = N`) are ordinary monthly subscriptions with
 * `metadata.installments = N` on the subscription. Cancelling after the Nth
 * payment is the job of the `invoice.paid` handler in the fulfilment use case
 * (it counts paid instalments and calls `cancelSubscription`); nothing else
 * about plans is exposed here.
 *
 * Coupons: a coupon with a `stripe_promotion_code_id` is applied as a promotion
 * code; a coupon the admin never synced is applied as a one-off Stripe coupon
 * worth `amounts.discount_cents` so what Stripe charges always equals the
 * server-side quote. Stripe does not allow `allow_promotion_codes` together
 * with `discounts`, so the promo-code box only appears when no coupon is set.
 */
import Stripe from "stripe";
import { env } from "@/lib/env";
import { site } from "@/lib/config/site";
import { effectiveUnitPrice, isSaleActive } from "@/lib/domain/pricing";
import type { CheckoutSession, Product } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import type { CreateCheckoutInput, DataStore, NormalizedPaymentEvent, PaymentsProvider } from "@/services/types";

const METADATA_VALUE_MAX = 480; // Stripe allows 500 chars per metadata value

/** Metadata keys used to find our objects again in Stripe. */
export const STRIPE_META = {
  productId: "cyc_product_id",
  priceKind: "cyc_price_kind", // list | sale
  userId: "user_id",
  couponCode: "cyc_coupon_code",
} as const;

declare global {
  var __cycStripeClient: Stripe | undefined;
}

/** Lazily constructed Stripe client (throws when STRIPE_SECRET_KEY is missing). */
export function getStripe(): Stripe {
  if (!globalThis.__cycStripeClient) {
    const key = env.stripe.secretKey;
    if (!key) throw new Error("[stripe] STRIPE_SECRET_KEY is not set (PAYMENTS_PROVIDER=stripe)");
    globalThis.__cycStripeClient = new Stripe(key, { appInfo: { name: site.name } });
  }
  return globalThis.__cycStripeClient;
}

/** Test helper: forget the cached client so a new key is picked up. */
export function resetStripeClient(): void {
  globalThis.__cycStripeClient = undefined;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function unixToIso(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

function isoToUnix(iso: string | null): number | undefined {
  if (!iso) return undefined;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? Math.floor(ms / 1000) : undefined;
}

function isRecurring(product: Pick<Product, "type">): boolean {
  return product.type === "subscription" || product.type === "payment_plan";
}

function clip(value: string, max = METADATA_VALUE_MAX): string {
  return value.length <= max ? value : value.slice(0, max);
}

function giftMetadata(gift: CreateCheckoutInput["gift"]): string {
  if (!gift) return "";
  const json = JSON.stringify(gift);
  if (json.length <= METADATA_VALUE_MAX) return json;
  // The order row keeps the full message; metadata only needs to identify the gift.
  return clip(JSON.stringify({ ...gift, message: clip(gift.message, 200) }));
}

function appendQuery(url: string, query: string): string {
  return url + (url.includes("?") ? "&" : "?") + query;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): string | null {
  // API versions from 2025-03 onwards keep the period on the items.
  const ends = sub.items?.data?.map((item) => item.current_period_end).filter((n): n is number => typeof n === "number") ?? [];
  if (ends.length === 0) return null;
  return unixToIso(Math.max(...ends));
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  return idOf(invoice.parent?.subscription_details?.subscription ?? null);
}

function invoicePeriodEnd(invoice: Stripe.Invoice): string | null {
  const lineEnds = invoice.lines?.data?.map((l) => l.period?.end).filter((n): n is number => typeof n === "number") ?? [];
  if (lineEnds.length > 0) return unixToIso(Math.max(...lineEnds));
  return unixToIso(invoice.period_end);
}

/** Maps a verified Stripe event to the provider-neutral shape. Pure; exported for tests. */
export function mapStripeEvent(event: Stripe.Event): NormalizedPaymentEvent {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        id: event.id,
        type: "checkout.completed",
        session_id: session.id,
        payment_intent_id: idOf(session.payment_intent),
        subscription_id: idOf(session.subscription),
        customer_id: idOf(session.customer),
        email: session.customer_details?.email ?? session.customer_email ?? null,
        amount_total_cents: session.amount_total ?? 0,
        tax_cents: session.total_details?.amount_tax ?? 0,
        discount_cents: session.total_details?.amount_discount ?? 0,
        currency: (session.currency ?? site.currency).toUpperCase(),
        metadata: { ...(session.metadata ?? {}) },
      };
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      return {
        id: event.id,
        type: "invoice.paid",
        subscription_id: invoiceSubscriptionId(invoice),
        customer_id: idOf(invoice.customer),
        period_end: invoicePeriodEnd(invoice),
        amount_cents: invoice.amount_paid ?? 0,
      };
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      return { id: event.id, type: "invoice.payment_failed", subscription_id: invoiceSubscriptionId(invoice), customer_id: idOf(invoice.customer) };
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      return {
        id: event.id,
        type: "subscription.updated",
        subscription_id: sub.id,
        status: sub.status,
        current_period_end: subscriptionPeriodEnd(sub),
        cancel_at_period_end: sub.cancel_at_period_end === true,
        customer_id: idOf(sub.customer),
      };
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      return { id: event.id, type: "subscription.deleted", subscription_id: sub.id, customer_id: idOf(sub.customer) };
    }
    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      return {
        id: event.id,
        type: "charge.refunded",
        payment_intent_id: idOf(charge.payment_intent),
        amount_refunded_cents: charge.amount_refunded ?? 0,
        fully_refunded: charge.refunded === true,
      };
    }
    default:
      return { id: event.id, type: "ignored", raw_type: event.type };
  }
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export async function createStripePayments(db: DataStore): Promise<PaymentsProvider> {
  const currency = site.currency.toLowerCase();

  async function findProductByOurId(stripe: Stripe, productId: string): Promise<Stripe.Product | null> {
    for await (const p of stripe.products.list({ limit: 100 })) {
      if (p.metadata?.[STRIPE_META.productId] === productId) return p;
    }
    return null;
  }

  async function activePrices(stripe: Stripe, stripeProductId: string): Promise<Stripe.Price[]> {
    const out: Stripe.Price[] = [];
    for await (const price of stripe.prices.list({ product: stripeProductId, active: true, limit: 100 })) out.push(price);
    return out;
  }

  function priceMatches(price: Stripe.Price, want: { unit_amount: number; interval: "month" | "year" | null }): boolean {
    if (price.currency !== currency) return false;
    if (price.unit_amount !== want.unit_amount) return false;
    const interval = price.recurring?.interval ?? null;
    if (interval !== want.interval) return false;
    if (price.recurring && (price.recurring.interval_count ?? 1) !== 1) return false;
    return true;
  }

  async function ensurePrice(
    stripe: Stripe,
    stripeProductId: string,
    kind: "list" | "sale",
    want: { unit_amount: number; interval: "month" | "year" | null; installments: number | null },
    productId: string,
  ): Promise<string> {
    const prices = await activePrices(stripe, stripeProductId);
    const ofKind = prices.filter((p) => p.metadata?.[STRIPE_META.priceKind] === kind);
    const existing = ofKind.find((p) => priceMatches(p, want));
    if (existing) return existing.id;
    const created = await stripe.prices.create({
      product: stripeProductId,
      currency,
      unit_amount: want.unit_amount,
      ...(want.interval ? { recurring: { interval: want.interval } } : {}),
      metadata: {
        [STRIPE_META.priceKind]: kind,
        [STRIPE_META.productId]: productId,
        ...(want.installments ? { installments: String(want.installments) } : {}),
      },
    });
    // Archive the stale prices of this kind (amount or interval changed).
    for (const stale of ofKind) await stripe.prices.update(stale.id, { active: false });
    return created.id;
  }

  async function archivePrices(stripe: Stripe, stripeProductId: string, kind: "list" | "sale"): Promise<void> {
    const prices = await activePrices(stripe, stripeProductId);
    for (const p of prices) if (p.metadata?.[STRIPE_META.priceKind] === kind) await stripe.prices.update(p.id, { active: false });
  }

  const payments: PaymentsProvider = {
    kind: "stripe",

    async createCheckoutSession(input) {
      const stripe = getStripe();
      const now = new Date();

      // 1) Our own session row (mirrors the mock adapter; referenced from Stripe metadata).
      const ref: CheckoutSession = {
        id: newId(),
        provider: "stripe",
        user_id: input.user_id,
        email: input.email,
        items: input.lines.map((l) => ({ product_id: l.product_id, quantity: l.quantity })),
        coupon_code: input.coupon_code,
        gift: input.gift,
        success_url: input.success_url,
        cancel_url: input.cancel_url,
        status: "open",
        order_id: null,
        created_at: nowIso(),
      };
      await db.from("checkout_sessions").insert(ref);

      // 2) Products → line items.
      const ids = [...new Set(input.lines.map((l) => l.product_id))];
      const products = ids.length ? await db.from("products").list({ where: { id: ids } }) : [];
      const byId = new Map(products.map((p) => [p.id, p]));
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      let installments: number | null = null;
      for (const line of input.lines) {
        const product = byId.get(line.product_id);
        if (!product) throw new Error(`[stripe] unknown product ${line.product_id}`);
        if (product.type === "payment_plan" && product.installments) installments = product.installments;
        const saleActive = isSaleActive(product, now);
        const storedPriceId = saleActive ? product.stripe_sale_price_id : product.stripe_price_id;
        const quantity = Math.max(1, Math.floor(line.quantity || 1));
        if (storedPriceId) {
          lineItems.push({ price: storedPriceId, quantity });
          continue;
        }
        lineItems.push({
          quantity,
          price_data: {
            currency: (product.currency || site.currency).toLowerCase(),
            unit_amount: effectiveUnitPrice(product, now),
            product_data: {
              name: product.title,
              ...(product.description ? { description: clip(product.description, 300) } : {}),
              metadata: { [STRIPE_META.productId]: product.id },
            },
            ...(isRecurring(product) ? { recurring: { interval: product.interval ?? "month" } } : {}),
          },
        });
      }

      // 3) Customer.
      const profile = input.user_id ? await db.from("profiles").get(input.user_id) : null;
      const customerId = profile?.stripe_customer_id ?? null;

      // 4) Coupon → discounts.
      const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
      if (input.coupon_code) {
        const coupon = await db.from("coupons").findOne({ code: input.coupon_code.toUpperCase() });
        if (coupon?.stripe_promotion_code_id) {
          discounts.push({ promotion_code: coupon.stripe_promotion_code_id });
        } else if (input.amounts.discount_cents > 0) {
          const adhoc = await stripe.coupons.create({
            name: `${input.coupon_code} (${ref.id.slice(0, 8)})`,
            amount_off: input.amounts.discount_cents,
            currency,
            duration: "once",
            max_redemptions: 1,
            metadata: { [STRIPE_META.couponCode]: input.coupon_code, session_ref: ref.id },
          });
          discounts.push({ coupon: adhoc.id });
        }
      }

      // 5) Metadata shared by the session, the payment intent and the subscription.
      const metadata: Record<string, string> = {
        session_ref: ref.id,
        session_id: ref.id,
        user_id: input.user_id ?? "",
        email: input.email ?? "",
        gift: giftMetadata(input.gift),
        mode: input.mode,
      };
      if (installments) metadata.installments = String(installments);

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: input.mode,
        line_items: lineItems,
        success_url: appendQuery(input.success_url, "session_id={CHECKOUT_SESSION_ID}"),
        cancel_url: input.cancel_url,
        metadata,
        client_reference_id: ref.id,
        automatic_tax: { enabled: env.stripe.taxEnabled },
        ...(customerId ? { customer: customerId } : input.email ? { customer_email: input.email } : {}),
        ...(discounts.length > 0 ? { discounts } : { allow_promotion_codes: true }),
        ...(input.mode === "payment"
          ? { payment_intent_data: { metadata }, ...(customerId ? {} : { customer_creation: "always" as const }) }
          : { subscription_data: { metadata } }),
      };
      const session = await stripe.checkout.sessions.create(params);
      if (!session.url) throw new Error("[stripe] checkout session has no url");
      return { url: session.url, session_id: session.id };
    },

    async createCustomerPortalSession(input) {
      const session = await getStripe().billingPortal.sessions.create({ customer: input.customer_id, return_url: input.return_url });
      return { url: session.url };
    },

    async parseWebhook({ rawBody, signature }) {
      const secret = env.stripe.webhookSecret;
      if (!secret) throw new Error("[stripe] STRIPE_WEBHOOK_SECRET is not set");
      if (!signature) throw new Error("[stripe] missing stripe-signature header");
      const event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
      const normalized = mapStripeEvent(event);
      if (normalized.type === "checkout.completed") {
        // Close our own session row so the abandoned-cart job leaves it alone.
        const refId = normalized.metadata.session_ref || normalized.metadata.session_id;
        if (refId) {
          try {
            const row = await db.from("checkout_sessions").get(refId);
            if (row && row.status === "open") await db.from("checkout_sessions").update(refId, { status: "complete" });
          } catch (err) {
            console.warn("[stripe] could not close checkout_sessions row", refId, errorMessage(err));
          }
        }
      }
      return normalized;
    },

    async refund(input) {
      try {
        const refund = await getStripe().refunds.create({
          payment_intent: input.payment_intent_id,
          ...(input.amount_cents ? { amount: input.amount_cents } : {}),
        });
        return { ok: true, refund_id: refund.id };
      } catch (err) {
        return { ok: false, error: errorMessage(err) };
      }
    },

    async cancelSubscription(input) {
      try {
        const stripe = getStripe();
        if (input.at_period_end) await stripe.subscriptions.update(input.subscription_id, { cancel_at_period_end: true });
        else await stripe.subscriptions.cancel(input.subscription_id);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: errorMessage(err) };
      }
    },

    async ensureCustomer(input) {
      const stripe = getStripe();
      const existing = await stripe.customers.list({ email: input.email, limit: 20 });
      const match = existing.data.find((c) => c.metadata?.[STRIPE_META.userId] === input.user_id) ?? existing.data[0];
      if (match) {
        if (match.metadata?.[STRIPE_META.userId] !== input.user_id) {
          await stripe.customers.update(match.id, { metadata: { [STRIPE_META.userId]: input.user_id } });
        }
        return match.id;
      }
      const created = await stripe.customers.create({ email: input.email, name: input.name, metadata: { [STRIPE_META.userId]: input.user_id } });
      return created.id;
    },

    async syncProduct(input) {
      const stripe = getStripe();
      let product = await findProductByOurId(stripe, input.product_id);
      if (!product) {
        product = await stripe.products.create({
          name: input.title,
          ...(input.description ? { description: clip(input.description, 500) } : {}),
          metadata: { [STRIPE_META.productId]: input.product_id },
        });
      } else if (product.name !== input.title || (product.description ?? "") !== clip(input.description, 500)) {
        product = await stripe.products.update(product.id, {
          name: input.title,
          description: input.description ? clip(input.description, 500) : "",
        });
      }
      const interval = input.interval ?? (input.installments ? "month" : null);
      const listPriceId = await ensurePrice(stripe, product.id, "list", { unit_amount: input.price_cents, interval, installments: input.installments }, input.product_id);
      let salePriceId: string | null = null;
      if (input.sale_price_cents !== null) {
        salePriceId = await ensurePrice(stripe, product.id, "sale", { unit_amount: input.sale_price_cents, interval, installments: input.installments }, input.product_id);
      } else {
        await archivePrices(stripe, product.id, "sale");
      }
      if (product.default_price !== listPriceId) await stripe.products.update(product.id, { default_price: listPriceId });
      return { stripe_product_id: product.id, stripe_price_id: listPriceId, stripe_sale_price_id: salePriceId };
    },

    async syncCoupon(input) {
      const stripe = getStripe();
      const code = input.code.toUpperCase();
      const found = await stripe.promotionCodes.list({ code, limit: 1 });
      const existingPromo = found.data[0];
      if (existingPromo?.active) {
        const couponId = idOf(existingPromo.promotion?.coupon ?? null);
        if (couponId) return { stripe_coupon_id: couponId, stripe_promotion_code_id: existingPromo.id };
      }
      const coupon = await stripe.coupons.create({
        name: code,
        duration: "once",
        ...(input.kind === "percent" ? { percent_off: input.amount } : { amount_off: input.amount, currency }),
        ...(isoToUnix(input.expires_at) ? { redeem_by: isoToUnix(input.expires_at) } : {}),
        ...(input.max_uses ? { max_redemptions: input.max_uses } : {}),
        metadata: { [STRIPE_META.couponCode]: code },
      });
      const promo = await stripe.promotionCodes.create({
        promotion: { type: "coupon", coupon: coupon.id },
        code,
        ...(isoToUnix(input.expires_at) ? { expires_at: isoToUnix(input.expires_at) } : {}),
        ...(input.max_uses ? { max_redemptions: input.max_uses } : {}),
        metadata: { [STRIPE_META.couponCode]: code },
      });
      return { stripe_coupon_id: coupon.id, stripe_promotion_code_id: promo.id };
    },
  };

  return payments;
}
