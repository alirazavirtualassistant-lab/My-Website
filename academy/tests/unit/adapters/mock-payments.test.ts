import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createFakeDb, type FakeDb } from "./fake-db";
import type { Order, Product } from "@/lib/types";

process.env.DEMO_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-payments-"));

const { createMockPayments } = await import("@/services/mock/payments");

function product(over: Partial<Product>): Product {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    type: "course",
    slug: "baby-steps",
    title: "Baby Steps",
    description: "",
    course_ids: [],
    grants_all_courses: false,
    price_cents: 19700,
    sale_price_cents: null,
    sale_ends_at: null,
    currency: "USD",
    interval: null,
    installments: null,
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_sale_price_id: null,
    active: true,
    is_free: false,
    created_at: now,
    updated_at: now,
    ...over,
  };
}

const baseInput = (over: Partial<Parameters<Awaited<ReturnType<typeof createMockPayments>>["createCheckoutSession"]>[0]> = {}) => ({
  lines: [{ product_id: "prod-1", quantity: 1 }],
  user_id: "user-1",
  email: "jordan@example.com",
  coupon_code: null,
  gift: null,
  success_url: "http://localhost:3000/checkout/success?order=o1",
  cancel_url: "http://localhost:3000/cart",
  mode: "payment" as const,
  amounts: { subtotal_cents: 19700, discount_cents: 2000, total_cents: 17700 },
  ...over,
});

let db: FakeDb;

beforeEach(() => {
  db = createFakeDb();
});

describe("mock payments", () => {
  it("creates a checkout_sessions row and returns the mock checkout url", async () => {
    const payments = await createMockPayments(db);
    const { url, session_id } = await payments.createCheckoutSession(baseInput());
    expect(url).toBe(`/checkout/mock/${session_id}`);
    const row = await db.from("checkout_sessions").get(session_id);
    expect(row).toMatchObject({ provider: "mock", status: "open", user_id: "user-1", email: "jordan@example.com", items: [{ product_id: "prod-1", quantity: 1 }] });
  });

  it("round-trips checkout.completed with a stable event id (idempotent)", async () => {
    const payments = await createMockPayments(db);
    const { session_id } = await payments.createCheckoutSession(baseInput());
    const rawBody = JSON.stringify({ type: "checkout.completed", session_id });
    const first = await payments.parseWebhook({ rawBody, signature: null });
    const second = await payments.parseWebhook({ rawBody, signature: "ignored" });
    expect(first.type).toBe("checkout.completed");
    expect(first.id).toBe(`mock_evt_${session_id}`);
    expect(second.id).toBe(first.id);
    if (first.type !== "checkout.completed") throw new Error("unreachable");
    expect(first.amount_total_cents).toBe(17700);
    expect(first.discount_cents).toBe(2000);
    expect(first.metadata).toEqual({ session_id });
    expect(first.subscription_id).toBeNull();
    expect(first.customer_id).toBe("mock_cus_user-1");
    expect(first.email).toBe("jordan@example.com");
  });

  it("gives subscription checkouts a mock subscription id and includes the linked order id", async () => {
    await db.from("products").insert(product({ id: "sub-1", type: "subscription", interval: "month", price_cents: 2900 }));
    const payments = await createMockPayments(db);
    const { session_id } = await payments.createCheckoutSession(baseInput({ lines: [{ product_id: "sub-1", quantity: 1 }], mode: "subscription", amounts: { subtotal_cents: 2900, discount_cents: 0, total_cents: 2900 } }));
    const order: Order = {
      id: "order-1",
      user_id: "user-1",
      email: "jordan@example.com",
      items: [{ product_id: "sub-1", title: "All-Access", unit_cents: 2900, quantity: 1 }],
      subtotal_cents: 2900,
      discount_cents: 0,
      tax_cents: 0,
      total_cents: 2900,
      currency: "USD",
      coupon_code: null,
      status: "pending",
      provider: "mock",
      provider_session_id: session_id,
      provider_payment_intent_id: null,
      provider_subscription_id: null,
      provider_event_ids: [],
      gift: null,
      refunded_cents: 0,
      created_at: new Date().toISOString(),
      paid_at: null,
      updated_at: new Date().toISOString(),
    };
    await db.from("orders").insert(order);
    await db.from("checkout_sessions").update(session_id, { order_id: "order-1" });
    const event = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "checkout.completed", session_id }), signature: null });
    if (event.type !== "checkout.completed") throw new Error("unreachable");
    expect(event.subscription_id).toBe(`mock_sub_${session_id}`);
    expect(event.payment_intent_id).toBe("mock_pi_order-1");
    expect(event.metadata).toEqual({ session_id, order_id: "order-1" });
  });

  it("derives amounts and mode from the order when the row has no extras (Supabase backend)", async () => {
    await db.from("products").insert(product({ id: "plan-1", type: "payment_plan", interval: "month", installments: 3, price_cents: 6900 }));
    const payments = await createMockPayments(db);
    const now = new Date().toISOString();
    await db.from("checkout_sessions").insert({
      id: "cs-plain",
      provider: "mock",
      user_id: null,
      email: "guest@example.com",
      items: [{ product_id: "plan-1", quantity: 1 }],
      coupon_code: null,
      gift: null,
      success_url: "/ok",
      cancel_url: "/cart",
      status: "open",
      order_id: "order-2",
      created_at: now,
    });
    await db.from("orders").insert({
      id: "order-2",
      user_id: null,
      email: "guest@example.com",
      items: [{ product_id: "plan-1", title: "Plan", unit_cents: 6900, quantity: 1 }],
      subtotal_cents: 6900,
      discount_cents: 0,
      tax_cents: 0,
      total_cents: 6900,
      currency: "USD",
      coupon_code: null,
      status: "pending",
      provider: "mock",
      provider_session_id: "cs-plain",
      provider_payment_intent_id: null,
      provider_subscription_id: null,
      provider_event_ids: [],
      gift: null,
      refunded_cents: 0,
      created_at: now,
      paid_at: null,
      updated_at: now,
    });
    const event = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "checkout.completed", session_id: "cs-plain" }), signature: null });
    if (event.type !== "checkout.completed") throw new Error("unreachable");
    expect(event.amount_total_cents).toBe(6900);
    expect(event.subscription_id).toBe("mock_sub_cs-plain");
    expect(event.customer_id).toBeNull();
  });

  it("maps simulated refund / subscription / invoice bodies", async () => {
    const payments = await createMockPayments(db);
    const refund = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "charge.refunded", payment_intent_id: "mock_pi_x", amount_refunded_cents: 500, fully_refunded: false }), signature: null });
    expect(refund).toEqual({ id: "mock_evt_refund_mock_pi_x_500", type: "charge.refunded", payment_intent_id: "mock_pi_x", amount_refunded_cents: 500, fully_refunded: false });
    const deleted = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "subscription.deleted", subscription_id: "mock_sub_1" }), signature: null });
    expect(deleted).toMatchObject({ type: "subscription.deleted", subscription_id: "mock_sub_1" });
    const updated = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "subscription.updated", subscription_id: "mock_sub_1", status: "past_due", cancel_at_period_end: true }), signature: null });
    expect(updated).toMatchObject({ type: "subscription.updated", status: "past_due", cancel_at_period_end: true });
    const paid = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "invoice.paid", subscription_id: "mock_sub_1", amount_cents: 6900, invoice_id: "inv-2" }), signature: null });
    expect(paid).toEqual({ id: "mock_evt_invoice_paid_mock_sub_1_inv-2", type: "invoice.paid", subscription_id: "mock_sub_1", customer_id: null, period_end: null, amount_cents: 6900 });
    const other = await payments.parseWebhook({ rawBody: JSON.stringify({ type: "something.else" }), signature: null });
    expect(other).toMatchObject({ type: "ignored", raw_type: "something.else" });
  });

  it("rejects malformed bodies and unknown sessions", async () => {
    const payments = await createMockPayments(db);
    await expect(payments.parseWebhook({ rawBody: "not json", signature: null })).rejects.toThrow(/JSON/);
    await expect(payments.parseWebhook({ rawBody: JSON.stringify({ type: "checkout.completed", session_id: "nope" }), signature: null })).rejects.toThrow(/unknown checkout session/);
  });

  it("returns fake ids for the admin helpers", async () => {
    const payments = await createMockPayments(db);
    expect(await payments.ensureCustomer({ user_id: "u1", email: "a@b.co", name: "A" })).toBe("mock_cus_u1");
    expect(await payments.createCustomerPortalSession({ customer_id: "mock_cus_u1", return_url: "/" })).toEqual({ url: "/account/billing?portal=mock" });
    expect(await payments.refund({ payment_intent_id: "mock_pi_1" })).toMatchObject({ ok: true, refund_id: expect.stringMatching(/^mock_re_/) });
    expect(await payments.cancelSubscription({ subscription_id: "s", at_period_end: true })).toEqual({ ok: true });
    const synced = await payments.syncProduct({ product_id: "p1", title: "T", description: "", price_cents: 100, sale_price_cents: 50, currency: "USD", interval: null, installments: null });
    expect(synced).toEqual({ stripe_product_id: "mock_prod_p1", stripe_price_id: "mock_price_p1", stripe_sale_price_id: "mock_price_sale_p1" });
    expect(await payments.syncCoupon({ code: "WELCOME", kind: "percent", amount: 10, expires_at: null, max_uses: null })).toEqual({ stripe_coupon_id: "mock_coupon_WELCOME", stripe_promotion_code_id: "mock_promo_WELCOME" });
  });
});
