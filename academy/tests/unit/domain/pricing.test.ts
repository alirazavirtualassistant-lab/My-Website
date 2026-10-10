import { describe, expect, it } from "vitest";
import { site } from "@/lib/config/site";
import {
  COUPON_ERRORS,
  applyCoupon,
  cartTotals,
  convertCents,
  couponAppliesToProduct,
  couponValidityError,
  displayCurrency,
  effectiveUnitPrice,
  formatPriceInCurrency,
  grantsCourse,
  installmentsSummary,
  isPaymentPlanProduct,
  isSaleActive,
  isSubscriptionProduct,
} from "@/lib/domain/pricing";
import { NOW, daysAfter, makeCoupon, makeProduct } from "./fixtures";

const future = daysAfter(NOW, 3).toISOString();
const past = daysAfter(NOW, -3).toISOString();

describe("isSaleActive / effectiveUnitPrice", () => {
  it("has no sale without a sale price", () => {
    const p = makeProduct({ price_cents: 19700 });
    expect(isSaleActive(p, NOW)).toBe(false);
    expect(effectiveUnitPrice(p, NOW)).toBe(19700);
  });

  it("runs an open-ended sale", () => {
    const p = makeProduct({ price_cents: 19700, sale_price_cents: 14700 });
    expect(isSaleActive(p, NOW)).toBe(true);
    expect(effectiveUnitPrice(p, NOW)).toBe(14700);
  });

  it("ends the sale at exactly sale_ends_at", () => {
    const p = makeProduct({ price_cents: 19700, sale_price_cents: 14700, sale_ends_at: NOW.toISOString() });
    expect(isSaleActive(p, new Date(NOW.getTime() - 1))).toBe(true);
    expect(isSaleActive(p, NOW)).toBe(false);
    expect(effectiveUnitPrice(p, NOW)).toBe(19700);
    expect(effectiveUnitPrice(makeProduct({ price_cents: 19700, sale_price_cents: 14700, sale_ends_at: future }), NOW)).toBe(14700);
    expect(effectiveUnitPrice(makeProduct({ price_cents: 19700, sale_price_cents: 14700, sale_ends_at: past }), NOW)).toBe(19700);
  });

  it("is zero for free products and never negative", () => {
    expect(effectiveUnitPrice(makeProduct({ price_cents: 19700, is_free: true }), NOW)).toBe(0);
    expect(effectiveUnitPrice(makeProduct({ price_cents: -5 }), NOW)).toBe(0);
  });
});

describe("coupon validity", () => {
  it("checks scope", () => {
    expect(couponAppliesToProduct(makeCoupon({ product_ids: [] }), "x")).toBe(true);
    expect(couponAppliesToProduct(makeCoupon({ product_ids: ["a"] }), "a")).toBe(true);
    expect(couponAppliesToProduct(makeCoupon({ product_ids: ["a"] }), "b")).toBe(false);
  });

  it("rejects inactive, expired and exhausted coupons", () => {
    expect(couponValidityError(makeCoupon(), NOW)).toBeNull();
    expect(couponValidityError(makeCoupon({ active: false }), NOW)).toBe(COUPON_ERRORS.inactive);
    expect(couponValidityError(makeCoupon({ expires_at: past }), NOW)).toBe(COUPON_ERRORS.expired);
    expect(couponValidityError(makeCoupon({ expires_at: NOW.toISOString() }), NOW)).toBe(COUPON_ERRORS.expired);
    expect(couponValidityError(makeCoupon({ expires_at: future }), NOW)).toBeNull();
    expect(couponValidityError(makeCoupon({ max_uses: 5, uses: 5 }), NOW)).toBe(COUPON_ERRORS.exhausted);
    expect(couponValidityError(makeCoupon({ max_uses: 5, uses: 4 }), NOW)).toBeNull();
    expect(couponValidityError(makeCoupon({ max_uses: null, uses: 999 }), NOW)).toBeNull();
  });
});

describe("applyCoupon", () => {
  const a = makeProduct({ id: "a", price_cents: 19700 });
  const b = makeProduct({ id: "b", price_cents: 4900 });
  const lines = [
    { product: a, line_cents: 19700 },
    { product: b, line_cents: 4900 },
  ];
  const subtotal = 24600;

  it("does nothing without a coupon", () => {
    expect(applyCoupon(subtotal, null, lines, NOW)).toEqual({ discount_cents: 0, error: null });
    expect(applyCoupon(subtotal, undefined, lines, NOW)).toEqual({ discount_cents: 0, error: null });
  });

  it("applies percent and fixed discounts to the whole cart", () => {
    expect(applyCoupon(subtotal, makeCoupon({ kind: "percent", amount: 10 }), lines, NOW)).toEqual({ discount_cents: 2460, error: null });
    expect(applyCoupon(subtotal, makeCoupon({ kind: "fixed", amount: 5000 }), lines, NOW)).toEqual({ discount_cents: 5000, error: null });
  });

  it("rounds percent discounts to the nearest cent and clamps percent to 100", () => {
    expect(applyCoupon(101, makeCoupon({ kind: "percent", amount: 50 }), [{ product: a, line_cents: 101 }], NOW).discount_cents).toBe(51);
    expect(applyCoupon(19700, makeCoupon({ kind: "percent", amount: 33 }), [{ product: a, line_cents: 19700 }], NOW).discount_cents).toBe(6501);
    expect(applyCoupon(19700, makeCoupon({ kind: "percent", amount: 150 }), [{ product: a, line_cents: 19700 }], NOW).discount_cents).toBe(19700);
  });

  it("never discounts more than the subtotal", () => {
    expect(applyCoupon(4900, makeCoupon({ kind: "fixed", amount: 10000 }), [{ product: b, line_cents: 4900 }], NOW).discount_cents).toBe(4900);
    expect(applyCoupon(0, makeCoupon({ kind: "fixed", amount: 100 }), [], NOW).discount_cents).toBe(0);
  });

  it("limits scoped coupons to their products", () => {
    const scoped = makeCoupon({ kind: "percent", amount: 50, product_ids: ["b"] });
    expect(applyCoupon(subtotal, scoped, lines, NOW)).toEqual({ discount_cents: 2450, error: null });
    const fixedScoped = makeCoupon({ kind: "fixed", amount: 10000, product_ids: ["b"] });
    expect(applyCoupon(subtotal, fixedScoped, lines, NOW)).toEqual({ discount_cents: 4900, error: null });
  });

  it("reports when a scoped coupon matches nothing in the cart", () => {
    const scoped = makeCoupon({ product_ids: ["zzz"] });
    expect(applyCoupon(subtotal, scoped, lines, NOW)).toEqual({ discount_cents: 0, error: COUPON_ERRORS.scope });
  });

  it("surfaces validity errors instead of discounting", () => {
    expect(applyCoupon(subtotal, makeCoupon({ expires_at: past }), lines, NOW)).toEqual({ discount_cents: 0, error: COUPON_ERRORS.expired });
    expect(applyCoupon(subtotal, makeCoupon({ max_uses: 1, uses: 1 }), lines, NOW)).toEqual({ discount_cents: 0, error: COUPON_ERRORS.exhausted });
    expect(applyCoupon(subtotal, makeCoupon({ active: false }), lines, NOW)).toEqual({ discount_cents: 0, error: COUPON_ERRORS.inactive });
  });
});

describe("cartTotals", () => {
  const course = makeProduct({ id: "course", price_cents: 19700 });
  const onSale = makeProduct({ id: "sale", price_cents: 9900, sale_price_cents: 4900, sale_ends_at: future });
  const products = [course, onSale];

  it("prices lines with quantities and the current sale price", () => {
    const t = cartTotals({ lines: [{ product_id: "course", quantity: 1 }, { product_id: "sale", quantity: 2 }], products, now: NOW });
    expect(t.lines).toHaveLength(2);
    expect(t.lines[0]).toMatchObject({ unit_cents: 19700, quantity: 1, line_cents: 19700 });
    expect(t.lines[0].product).toBe(course);
    expect(t.lines[1]).toMatchObject({ unit_cents: 4900, quantity: 2, line_cents: 9800 });
    expect(t.subtotal_cents).toBe(29500);
    expect(t.discount_cents).toBe(0);
    expect(t.total_cents).toBe(29500);
    expect(t.coupon_error).toBeNull();
  });

  it("uses the list price once the sale has ended", () => {
    const t = cartTotals({ lines: [{ product_id: "sale", quantity: 1 }], products, now: daysAfter(NOW, 10) });
    expect(t.subtotal_cents).toBe(9900);
  });

  it("drops unknown products and non-positive quantities", () => {
    const t = cartTotals({ lines: [{ product_id: "ghost", quantity: 1 }, { product_id: "course", quantity: 0 }, { product_id: "course", quantity: 1.9 }], products, now: NOW });
    expect(t.lines).toHaveLength(1);
    expect(t.lines[0].quantity).toBe(1);
    expect(t.total_cents).toBe(19700);
  });

  it("applies a coupon and reports errors", () => {
    const ok = cartTotals({ lines: [{ product_id: "course", quantity: 1 }], products, coupon: makeCoupon({ kind: "percent", amount: 10 }), now: NOW });
    expect(ok.discount_cents).toBe(1970);
    expect(ok.total_cents).toBe(17730);
    expect(ok.coupon_error).toBeNull();

    const bad = cartTotals({ lines: [{ product_id: "course", quantity: 1 }], products, coupon: makeCoupon({ expires_at: past }), now: NOW });
    expect(bad.discount_cents).toBe(0);
    expect(bad.total_cents).toBe(19700);
    expect(bad.coupon_error).toBe(COUPON_ERRORS.expired);
  });

  it("never goes below zero and handles an empty cart", () => {
    const free = cartTotals({ lines: [{ product_id: "course", quantity: 1 }], products, coupon: makeCoupon({ kind: "fixed", amount: 99999 }), now: NOW });
    expect(free.total_cents).toBe(0);
    expect(cartTotals({ lines: [], products, now: NOW })).toEqual({ lines: [], subtotal_cents: 0, discount_cents: 0, total_cents: 0, coupon_error: null });
  });
});

describe("display currencies", () => {
  it("resolves codes case-insensitively and falls back to USD", () => {
    expect(displayCurrency("eur").code).toBe("EUR");
    expect(displayCurrency("XXX").code).toBe("USD");
    expect(displayCurrency(null).code).toBe("USD");
  });

  it("converts to whole units with the site rates", () => {
    expect(convertCents(19700, "USD")).toBe(197);
    expect(convertCents(19700, "EUR")).toBe(Math.round(197 * site.displayCurrencies[1].rate));
    expect(convertCents(19700, "EUR")).toBe(181);
    expect(convertCents(19700, "GBP")).toBe(156);
    expect(convertCents(19700, "CAD")).toBe(268);
    expect(convertCents(19700, "AUD")).toBe(299);
  });

  it("formats USD exactly and other currencies rounded with their symbol", () => {
    expect(formatPriceInCurrency(19700, "USD")).toBe("$197");
    expect(formatPriceInCurrency(6950, "USD")).toBe("$69.50");
    expect(formatPriceInCurrency(19700, "EUR")).toBe("€181");
    expect(formatPriceInCurrency(19700, "GBP")).toBe("£156");
    expect(formatPriceInCurrency(19700, "CAD")).toBe("CA$268");
    expect(formatPriceInCurrency(19700, "AUD")).toBe("A$299");
    expect(formatPriceInCurrency(200000, "EUR")).toBe("€1,840");
    expect(formatPriceInCurrency(19700, "xyz")).toBe("$197");
    expect(formatPriceInCurrency(0, "EUR")).toBe("€0");
  });
});

describe("product helpers", () => {
  it("summarises payment plans", () => {
    const plan = makeProduct({ type: "payment_plan", installments: 3, price_cents: 6900 });
    expect(installmentsSummary(plan)).toEqual({ count: 3, each_cents: 6900, total_cents: 20700, label: "3 payments of $69" });
    expect(installmentsSummary(makeProduct({ type: "course" }))).toBeNull();
    expect(installmentsSummary(makeProduct({ type: "payment_plan", installments: 1 }))).toBeNull();
    expect(installmentsSummary(makeProduct({ type: "payment_plan", installments: null }))).toBeNull();
  });

  it("uses the sale price per installment when now is given", () => {
    const plan = makeProduct({ type: "payment_plan", installments: 3, price_cents: 6900, sale_price_cents: 5900, sale_ends_at: future });
    expect(installmentsSummary(plan, NOW)?.each_cents).toBe(5900);
    expect(installmentsSummary(plan)?.each_cents).toBe(6900);
    expect(installmentsSummary(plan, daysAfter(NOW, 10))?.each_cents).toBe(6900);
  });

  it("classifies products", () => {
    expect(isSubscriptionProduct(makeProduct({ type: "subscription", interval: "month" }))).toBe(true);
    expect(isSubscriptionProduct(makeProduct({ type: "payment_plan", installments: 3 }))).toBe(false);
    expect(isSubscriptionProduct(makeProduct({ type: "course" }))).toBe(false);
    expect(isPaymentPlanProduct(makeProduct({ type: "payment_plan", installments: 3 }))).toBe(true);
    expect(isPaymentPlanProduct(makeProduct({ type: "payment_plan", installments: 1 }))).toBe(false);
  });

  it("grantsCourse checks the course list or the all-courses flag", () => {
    expect(grantsCourse(makeProduct({ course_ids: ["c1"] }), "c1")).toBe(true);
    expect(grantsCourse(makeProduct({ course_ids: ["c1"] }), "c2")).toBe(false);
    expect(grantsCourse(makeProduct({ course_ids: [], grants_all_courses: true }), "c2")).toBe(true);
  });
});
