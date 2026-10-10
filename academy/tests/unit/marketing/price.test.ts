import { describe, expect, it } from "vitest";
import { effectiveUnitPrice, paymentPlanLabel } from "@/components/marketing/price";
import { formatMoney } from "@/lib/utils";

const product = { price_cents: 19700, sale_price_cents: null as number | null, sale_ends_at: null as string | null, is_free: false, currency: "USD" };

describe("effectiveUnitPrice", () => {
  it("returns the list price when there is no sale", () => {
    expect(effectiveUnitPrice(product)).toEqual({ cents: 19700, original_cents: null, on_sale: false, sale_ends_at: null, currency: "USD" });
  });
  it("applies an active sale and keeps the original for strikethrough", () => {
    const now = new Date("2026-10-10T00:00:00Z");
    const p = { ...product, sale_price_cents: 14700, sale_ends_at: "2026-10-20T00:00:00Z" };
    expect(effectiveUnitPrice(p, now)).toMatchObject({ cents: 14700, original_cents: 19700, on_sale: true, sale_ends_at: "2026-10-20T00:00:00Z" });
  });
  it("ignores an expired sale or a sale that is not cheaper", () => {
    const now = new Date("2026-10-10T00:00:00Z");
    expect(effectiveUnitPrice({ ...product, sale_price_cents: 14700, sale_ends_at: "2026-10-01T00:00:00Z" }, now).on_sale).toBe(false);
    expect(effectiveUnitPrice({ ...product, sale_price_cents: 19700 }, now).on_sale).toBe(false);
  });
  it("treats free products as $0", () => {
    expect(effectiveUnitPrice({ ...product, is_free: true }).cents).toBe(0);
  });
});

describe("paymentPlanLabel", () => {
  it("formats N × amount", () => {
    expect(paymentPlanLabel({ installments: 3, price_cents: 6900, currency: "USD" }, formatMoney)).toBe("3 × $69");
    expect(paymentPlanLabel({ installments: null, price_cents: 6900, currency: "USD" }, formatMoney)).toBeNull();
    expect(paymentPlanLabel(null, formatMoney)).toBeNull();
  });
});
