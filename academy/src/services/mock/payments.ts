/**
 * Mock PaymentsProvider for demo mode.
 *
 * Flow:
 *   createCheckoutSession → inserts a `checkout_sessions` row (status open,
 *   provider 'mock') and returns `/checkout/mock/<id>`. The mock checkout page
 *   POSTs `{ type: 'checkout.completed', session_id }` to /api/webhooks/mock,
 *   whose handler calls `parseWebhook` and then the fulfilment use case, exactly
 *   like Stripe would. Event ids are derived from the session id
 *   (`mock_evt_<session_id>`) so replays are idempotent.
 *
 * Admins can simulate the other Stripe events by posting:
 *   { type: 'charge.refunded', payment_intent_id, amount_refunded_cents, fully_refunded }
 *   { type: 'subscription.deleted', subscription_id }
 *   { type: 'subscription.updated', subscription_id, status?, current_period_end?, cancel_at_period_end? }
 *   { type: 'invoice.paid', subscription_id, amount_cents?, period_end?, invoice_id? }
 *   { type: 'invoice.payment_failed', subscription_id }
 * Any body may carry `event_id` to control idempotency explicitly.
 *
 * The `checkout_sessions` table has no columns for mode/amounts, so the mock
 * keeps them (a) as extra JSON fields on the row when the store is the mock
 * store, (b) in an in-process map, and (c) falls back to the linked order
 * (`checkout_sessions.order_id`, set by the fulfilment use case) which is the
 * source of truth in every backend.
 */
import type { CheckoutSession, Product } from "@/lib/types";
import { site } from "@/lib/config/site";
import { newId, nowIso } from "@/lib/utils";
import type { CreateCheckoutInput, DataStore, NormalizedPaymentEvent, PaymentsProvider } from "@/services/types";

export interface MockCheckoutExtras {
  mode: CreateCheckoutInput["mode"];
  amounts: CreateCheckoutInput["amounts"];
}

/** Row shape the mock store persists (extra fields are ignored by Supabase mode). */
export type MockCheckoutSessionRow = CheckoutSession & Partial<MockCheckoutExtras>;

type MockWebhookBody = {
  type?: string;
  event_id?: string;
  session_id?: string;
  payment_intent_id?: string | null;
  amount_refunded_cents?: number;
  fully_refunded?: boolean;
  subscription_id?: string | null;
  customer_id?: string | null;
  status?: string;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  period_end?: string | null;
  amount_cents?: number;
  invoice_id?: string;
};

declare global {
  var __cycMockCheckoutExtras: Map<string, MockCheckoutExtras> | undefined;
}

function extrasMap(): Map<string, MockCheckoutExtras> {
  if (!globalThis.__cycMockCheckoutExtras) globalThis.__cycMockCheckoutExtras = new Map();
  return globalThis.__cycMockCheckoutExtras;
}

export function mockCustomerId(userId: string): string {
  return `mock_cus_${userId}`;
}

export function mockPaymentIntentId(ref: string): string {
  return `mock_pi_${ref}`;
}

export function mockSubscriptionId(sessionId: string): string {
  return `mock_sub_${sessionId}`;
}

function isRecurring(product: Pick<Product, "type">): boolean {
  return product.type === "subscription" || product.type === "payment_plan";
}

function parseBody(rawBody: string): MockWebhookBody {
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    return parsed as MockWebhookBody;
  } catch {
    throw new Error("[mock-payments] webhook body must be a JSON object");
  }
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`[mock-payments] webhook body is missing "${field}"`);
  return value;
}

export async function createMockPayments(db: DataStore): Promise<PaymentsProvider> {
  const sessions = () => db.from("checkout_sessions");

  /** Resolves mode + amounts for a stored session (row extras → memory → order → zeros). */
  async function resolveExtras(row: MockCheckoutSessionRow): Promise<MockCheckoutExtras & { order_id: string | null }> {
    const order = row.order_id ? await db.from("orders").get(row.order_id) : null;
    const remembered = extrasMap().get(row.id);
    let mode = row.mode ?? remembered?.mode ?? null;
    let amounts = row.amounts ?? remembered?.amounts ?? null;
    if (order) {
      amounts = amounts ?? { subtotal_cents: order.subtotal_cents, discount_cents: order.discount_cents, total_cents: order.total_cents };
      if (!mode) {
        const ids = order.items.map((i) => i.product_id);
        const products = ids.length ? await db.from("products").list({ where: { id: ids } }) : [];
        mode = products.some(isRecurring) ? "subscription" : "payment";
      }
    }
    return {
      mode: mode ?? "payment",
      amounts: amounts ?? { subtotal_cents: 0, discount_cents: 0, total_cents: 0 },
      order_id: order?.id ?? row.order_id ?? null,
    };
  }

  const payments: PaymentsProvider = {
    kind: "mock",

    async createCheckoutSession(input) {
      const id = newId();
      const base: CheckoutSession = {
        id,
        provider: "mock",
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
      const extras: MockCheckoutExtras = { mode: input.mode, amounts: { ...input.amounts } };
      extrasMap().set(id, extras);
      // Only the mock store tolerates columns the schema does not know about.
      const row: MockCheckoutSessionRow = db.kind === "mock" ? { ...base, ...extras } : base;
      await sessions().insert(row);
      return { url: `/checkout/mock/${id}`, session_id: id };
    },

    async createCustomerPortalSession() {
      return { url: "/account/billing?portal=mock" };
    },

    async parseWebhook({ rawBody }) {
      const body = parseBody(rawBody);
      const type = requireString(body.type, "type");

      switch (type) {
        case "checkout.completed": {
          const sessionId = requireString(body.session_id, "session_id");
          const row = (await sessions().get(sessionId)) as MockCheckoutSessionRow | null;
          if (!row) throw new Error(`[mock-payments] unknown checkout session ${sessionId}`);
          const { mode, amounts, order_id } = await resolveExtras(row);
          const metadata: Record<string, string> = { session_id: row.id };
          if (order_id) metadata.order_id = order_id;
          const event: NormalizedPaymentEvent = {
            id: body.event_id ?? `mock_evt_${row.id}`,
            type: "checkout.completed",
            session_id: row.id,
            payment_intent_id: mockPaymentIntentId(order_id ?? row.id),
            subscription_id: mode === "subscription" ? mockSubscriptionId(row.id) : null,
            customer_id: row.user_id ? mockCustomerId(row.user_id) : null,
            email: row.email,
            amount_total_cents: amounts.total_cents,
            tax_cents: 0,
            discount_cents: amounts.discount_cents,
            currency: site.currency,
            metadata,
          };
          return event;
        }
        case "charge.refunded": {
          const paymentIntentId = body.payment_intent_id ?? null;
          const amount = Math.max(0, Math.round(Number(body.amount_refunded_cents ?? 0)));
          return {
            id: body.event_id ?? `mock_evt_refund_${paymentIntentId ?? "unknown"}_${amount}`,
            type: "charge.refunded",
            payment_intent_id: paymentIntentId,
            amount_refunded_cents: amount,
            fully_refunded: body.fully_refunded === true,
          };
        }
        case "subscription.deleted": {
          const subscriptionId = requireString(body.subscription_id, "subscription_id");
          return {
            id: body.event_id ?? `mock_evt_sub_deleted_${subscriptionId}`,
            type: "subscription.deleted",
            subscription_id: subscriptionId,
            customer_id: body.customer_id ?? null,
          };
        }
        case "subscription.updated": {
          const subscriptionId = requireString(body.subscription_id, "subscription_id");
          const status = body.status ?? "active";
          const cancelAtPeriodEnd = body.cancel_at_period_end === true;
          return {
            id: body.event_id ?? `mock_evt_sub_updated_${subscriptionId}_${status}_${cancelAtPeriodEnd ? "cancel" : "keep"}`,
            type: "subscription.updated",
            subscription_id: subscriptionId,
            status,
            current_period_end: body.current_period_end ?? null,
            cancel_at_period_end: cancelAtPeriodEnd,
            customer_id: body.customer_id ?? null,
          };
        }
        case "invoice.paid": {
          const subscriptionId = body.subscription_id ?? null;
          const invoiceRef = body.invoice_id ?? `${Date.now()}`;
          return {
            id: body.event_id ?? `mock_evt_invoice_paid_${subscriptionId ?? "none"}_${invoiceRef}`,
            type: "invoice.paid",
            subscription_id: subscriptionId,
            customer_id: body.customer_id ?? null,
            period_end: body.period_end ?? null,
            amount_cents: Math.max(0, Math.round(Number(body.amount_cents ?? 0))),
          };
        }
        case "invoice.payment_failed": {
          const subscriptionId = body.subscription_id ?? null;
          return {
            id: body.event_id ?? `mock_evt_invoice_failed_${subscriptionId ?? "none"}_${body.invoice_id ?? Date.now()}`,
            type: "invoice.payment_failed",
            subscription_id: subscriptionId,
            customer_id: body.customer_id ?? null,
          };
        }
        default:
          return { id: body.event_id ?? `mock_evt_ignored_${Date.now()}`, type: "ignored", raw_type: type };
      }
    },

    async refund(input) {
      return { ok: true, refund_id: `mock_re_${input.payment_intent_id}_${input.amount_cents ?? "full"}` };
    },

    async cancelSubscription() {
      return { ok: true };
    },

    async ensureCustomer(input) {
      return mockCustomerId(input.user_id);
    },

    async syncProduct(input) {
      return {
        stripe_product_id: `mock_prod_${input.product_id}`,
        stripe_price_id: `mock_price_${input.product_id}`,
        stripe_sale_price_id: input.sale_price_cents !== null ? `mock_price_sale_${input.product_id}` : null,
      };
    },

    async syncCoupon(input) {
      return { stripe_coupon_id: `mock_coupon_${input.code}`, stripe_promotion_code_id: `mock_promo_${input.code}` };
    },
  };

  return payments;
}
