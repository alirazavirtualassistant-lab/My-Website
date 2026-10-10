/**
 * `startCheckout` (the guard in front of the shared `createCheckout` use case)
 * with the services module mocked: an in-memory fake Repo plus a fake
 * PaymentsProvider, so no cookies, files or network are touched.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb, type FakeDb } from "../adapters/fake-db";
import type { Coupon, Product } from "@/lib/types";
import type { PaymentsProvider, Services } from "@/services/types";

const state = vi.hoisted(() => ({ services: null as unknown as Services }));

vi.mock("@/services", () => ({
  getServices: async () => state.services,
  resetServicesCache: () => {},
}));

const { startCheckout, CheckoutInputError } = await import("@/app/(checkout)/_lib/start-checkout");

function product(over: Partial<Product> = {}): Product {
  const now = new Date().toISOString();
  return {
    id: "prod-baby-steps",
    type: "course",
    slug: "baby-steps",
    title: "Baby Steps: Your Health Journey Toward Conception",
    description: "",
    course_ids: ["course-1"],
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

function coupon(over: Partial<Coupon> = {}): Coupon {
  return {
    id: "coupon-1",
    code: "WELCOME",
    kind: "percent",
    amount: 10,
    expires_at: null,
    max_uses: null,
    uses: 0,
    product_ids: [],
    stripe_coupon_id: null,
    stripe_promotion_code_id: null,
    active: true,
    created_at: new Date().toISOString(),
    ...over,
  };
}

let db: FakeDb;
let createCheckoutSession: ReturnType<typeof vi.fn>;

beforeEach(() => {
  db = createFakeDb();
  createCheckoutSession = vi.fn(async () => ({ url: "/checkout/mock/sess-1", session_id: "sess-1" }));
  const payments = { kind: "mock", createCheckoutSession } as unknown as PaymentsProvider;
  state.services = {
    db,
    payments,
    auth: {} as Services["auth"],
    storage: {} as Services["storage"],
    video: {} as Services["video"],
    email: {} as Services["email"],
    mode: { backend: "mock", payments: "mock", video: "mock", email: "mock", demo: true },
  };
});

const base = { userId: "user-1", email: null, couponCode: null, gift: null, successPath: "/checkout/success", cancelPath: "/cart" };

describe("startCheckout", () => {
  it("rejects an empty cart before touching the store or the provider", async () => {
    await expect(startCheckout({ ...base, cart: [] })).rejects.toBeInstanceOf(CheckoutInputError);
    await expect(startCheckout({ ...base, cart: [] })).rejects.toMatchObject({ code: "empty_cart" });
    expect(await db.from("orders").count()).toBe(0);
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });

  it("also treats a cart of zero-quantity / blank lines as empty", async () => {
    await expect(startCheckout({ ...base, cart: [{ product_id: "", quantity: 1 }, { product_id: "x", quantity: 0 }] })).rejects.toMatchObject({ code: "empty_cart" });
    expect(await db.from("orders").count()).toBe(0);
  });

  it("requires an email for guest checkout", async () => {
    await db.from("products").insert(product());
    await expect(startCheckout({ ...base, userId: null, email: null, cart: [{ product_id: "prod-baby-steps", quantity: 1 }] })).rejects.toMatchObject({ code: "email" });
    expect(await db.from("orders").count()).toBe(0);
  });

  it("refuses to continue with a coupon that cannot be applied", async () => {
    await db.from("products").insert(product());
    await db.from("coupons").insert(coupon({ code: "OLD", expires_at: "2000-01-01T00:00:00.000Z" }));
    await expect(startCheckout({ ...base, couponCode: "OLD", cart: [{ product_id: "prod-baby-steps", quantity: 1 }] })).rejects.toMatchObject({ code: "coupon" });
    await expect(startCheckout({ ...base, couponCode: "NOPE", cart: [{ product_id: "prod-baby-steps", quantity: 1 }] })).rejects.toMatchObject({ code: "coupon" });
    expect(await db.from("orders").count()).toBe(0);
  });

  it("creates a pending order with one unit per product and hands back the provider url", async () => {
    await db.from("products").insert(product());
    await db.from("coupons").insert(coupon());
    const result = await startCheckout({ ...base, couponCode: "WELCOME", cart: [{ product_id: "prod-baby-steps", quantity: 3 }, { product_id: "prod-baby-steps", quantity: 1 }] });
    expect(result.url).toBe("/checkout/mock/sess-1");
    const order = await db.from("orders").get(result.orderId);
    expect(order).toMatchObject({
      status: "pending",
      user_id: "user-1",
      subtotal_cents: 19700,
      discount_cents: 1970,
      total_cents: 17730,
      coupon_code: "WELCOME",
      provider: "mock",
      provider_session_id: "sess-1",
      items: [{ product_id: "prod-baby-steps", quantity: 1, unit_cents: 19700 }],
    });
    expect(createCheckoutSession).toHaveBeenCalledTimes(1);
    const input = createCheckoutSession.mock.calls[0][0] as { lines: Array<{ quantity: number }>; success_url: string; cancel_url: string; mode: string };
    expect(input.lines).toEqual([{ product_id: "prod-baby-steps", quantity: 1 }]);
    expect(input.success_url).toContain(`/checkout/success?order=${result.orderId}`);
    expect(input.cancel_url).toContain("/cart?canceled=1");
    expect(input.mode).toBe("payment");
  });
});
