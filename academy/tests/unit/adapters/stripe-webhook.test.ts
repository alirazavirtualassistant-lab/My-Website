import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import Stripe from "stripe";
import { createFakeDb, type FakeDb } from "./fake-db";

process.env.DEMO_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-stripe-"));
process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_unit_tests";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

const { createStripePayments, mapStripeEvent, resetStripeClient } = await import("@/services/stripe/payments");

const SECRET = process.env.STRIPE_WEBHOOK_SECRET;

function signed(payload: object): { rawBody: string; signature: string } {
  const rawBody = JSON.stringify(payload);
  const signature = Stripe.webhooks.generateTestHeaderString({ payload: rawBody, secret: SECRET });
  return { rawBody, signature };
}

function checkoutCompleted(over: Record<string, unknown> = {}) {
  return {
    id: "evt_checkout_1",
    object: "event",
    api_version: "2026-09-30.endive",
    created: 1_700_000_000,
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        object: "checkout.session",
        amount_total: 17700,
        currency: "usd",
        customer: "cus_123",
        customer_details: { email: "jordan@example.com" },
        customer_email: null,
        metadata: { session_ref: "ref-1", session_id: "ref-1", user_id: "user-1", email: "jordan@example.com", gift: "", mode: "payment" },
        mode: "payment",
        payment_intent: "pi_123",
        subscription: null,
        total_details: { amount_discount: 2000, amount_shipping: 0, amount_tax: 0 },
        ...over,
      },
    },
  };
}

function chargeRefunded() {
  return {
    id: "evt_refund_1",
    object: "event",
    api_version: "2026-09-30.endive",
    created: 1_700_000_100,
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
    type: "charge.refunded",
    data: {
      object: {
        id: "ch_123",
        object: "charge",
        amount: 17700,
        amount_refunded: 17700,
        refunded: true,
        payment_intent: "pi_123",
      },
    },
  };
}

let db: FakeDb;

beforeEach(() => {
  db = createFakeDb();
  resetStripeClient();
});

describe("stripe parseWebhook", () => {
  it("maps checkout.session.completed and closes our checkout_sessions row", async () => {
    const now = new Date().toISOString();
    await db.from("checkout_sessions").insert({
      id: "ref-1",
      provider: "stripe",
      user_id: "user-1",
      email: "jordan@example.com",
      items: [{ product_id: "p1", quantity: 1 }],
      coupon_code: null,
      gift: null,
      success_url: "/ok",
      cancel_url: "/cart",
      status: "open",
      order_id: null,
      created_at: now,
    });
    const payments = await createStripePayments(db);
    const event = await payments.parseWebhook(signed(checkoutCompleted()));
    expect(event).toEqual({
      id: "evt_checkout_1",
      type: "checkout.completed",
      session_id: "cs_test_123",
      payment_intent_id: "pi_123",
      subscription_id: null,
      customer_id: "cus_123",
      email: "jordan@example.com",
      amount_total_cents: 17700,
      tax_cents: 0,
      discount_cents: 2000,
      currency: "USD",
      metadata: { session_ref: "ref-1", session_id: "ref-1", user_id: "user-1", email: "jordan@example.com", gift: "", mode: "payment" },
    });
    expect((await db.from("checkout_sessions").get("ref-1"))?.status).toBe("complete");
  });

  it("maps charge.refunded", async () => {
    const payments = await createStripePayments(db);
    const event = await payments.parseWebhook(signed(chargeRefunded()));
    expect(event).toEqual({ id: "evt_refund_1", type: "charge.refunded", payment_intent_id: "pi_123", amount_refunded_cents: 17700, fully_refunded: true });
  });

  it("rejects a bad or missing signature", async () => {
    const payments = await createStripePayments(db);
    const { rawBody } = signed(chargeRefunded());
    await expect(payments.parseWebhook({ rawBody, signature: "t=1,v1=deadbeef" })).rejects.toThrow();
    await expect(payments.parseWebhook({ rawBody, signature: null })).rejects.toThrow(/signature/);
    const other = Stripe.webhooks.generateTestHeaderString({ payload: rawBody, secret: "whsec_other" });
    await expect(payments.parseWebhook({ rawBody, signature: other })).rejects.toThrow();
  });

  it("maps subscription, invoice and unknown events", () => {
    const sub = {
      id: "evt_sub",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_1",
          object: "subscription",
          status: "past_due",
          cancel_at_period_end: true,
          customer: { id: "cus_9" },
          items: { data: [{ id: "si_1", current_period_end: 1_800_000_000 }] },
        },
      },
    } as unknown as Stripe.Event;
    expect(mapStripeEvent(sub)).toEqual({
      id: "evt_sub",
      type: "subscription.updated",
      subscription_id: "sub_1",
      status: "past_due",
      current_period_end: new Date(1_800_000_000 * 1000).toISOString(),
      cancel_at_period_end: true,
      customer_id: "cus_9",
    });

    const invoice = {
      id: "evt_inv",
      type: "invoice.paid",
      data: {
        object: {
          id: "in_1",
          object: "invoice",
          amount_paid: 6900,
          customer: "cus_9",
          period_end: 1_700_000_000,
          parent: { type: "subscription_details", subscription_details: { subscription: "sub_1", metadata: { installments: "3" } } },
          lines: { data: [{ period: { start: 1_700_000_000, end: 1_702_600_000 } }] },
        },
      },
    } as unknown as Stripe.Event;
    expect(mapStripeEvent(invoice)).toEqual({ id: "evt_inv", type: "invoice.paid", subscription_id: "sub_1", customer_id: "cus_9", period_end: new Date(1_702_600_000 * 1000).toISOString(), amount_cents: 6900 });

    const failed = { id: "evt_f", type: "invoice.payment_failed", data: { object: { id: "in_2", object: "invoice", customer: "cus_9", parent: null } } } as unknown as Stripe.Event;
    expect(mapStripeEvent(failed)).toEqual({ id: "evt_f", type: "invoice.payment_failed", subscription_id: null, customer_id: "cus_9" });

    const deleted = { id: "evt_d", type: "customer.subscription.deleted", data: { object: { id: "sub_1", object: "subscription", customer: "cus_9" } } } as unknown as Stripe.Event;
    expect(mapStripeEvent(deleted)).toEqual({ id: "evt_d", type: "subscription.deleted", subscription_id: "sub_1", customer_id: "cus_9" });

    const unknown = { id: "evt_u", type: "payment_intent.created", data: { object: { id: "pi" } } } as unknown as Stripe.Event;
    expect(mapStripeEvent(unknown)).toEqual({ id: "evt_u", type: "ignored", raw_type: "payment_intent.created" });
  });
});
