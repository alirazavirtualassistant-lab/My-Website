/**
 * Pricing — sale prices, coupons, cart totals and display currencies.
 * Pure: every date comparison takes `now`. All amounts are integer cents (USD).
 */
import type { Coupon, Product } from "@/lib/types";
import { site } from "@/lib/config/site";
import { formatMoney } from "@/lib/utils";

export type PriceProduct = Pick<Product, "price_cents" | "sale_price_cents" | "sale_ends_at" | "is_free">;

/** A sale is on when `sale_price_cents` is set and `sale_ends_at` is null or still in the future. */
export function isSaleActive(product: Pick<Product, "sale_price_cents" | "sale_ends_at">, now: Date): boolean {
  if (product.sale_price_cents === null || product.sale_price_cents === undefined) return false;
  if (!product.sale_ends_at) return true;
  return Date.parse(product.sale_ends_at) > now.getTime();
}

/** Unit price in cents at `now`: 0 for free products, the sale price while a sale is on, else the list price. */
export function effectiveUnitPrice(product: PriceProduct, now: Date): number {
  if (product.is_free) return 0;
  const cents = isSaleActive(product, now) ? (product.sale_price_cents as number) : product.price_cents;
  return Math.max(0, Math.round(cents || 0));
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export const COUPON_ERRORS = {
  inactive: "That coupon is not active right now.",
  expired: "That coupon has expired.",
  exhausted: "That coupon has been fully redeemed.",
  scope: "That coupon does not apply to the items in your cart.",
} as const;

export type CouponError = (typeof COUPON_ERRORS)[keyof typeof COUPON_ERRORS];

export interface CouponResult {
  discount_cents: number;
  error: CouponError | null;
}

export function couponAppliesToProduct(coupon: Pick<Coupon, "product_ids">, productId: string): boolean {
  return coupon.product_ids.length === 0 || coupon.product_ids.includes(productId);
}

/** Why a coupon cannot be used at all (independent of the cart), or null when it is valid. */
export function couponValidityError(coupon: Pick<Coupon, "active" | "expires_at" | "max_uses" | "uses">, now: Date): CouponError | null {
  if (!coupon.active) return COUPON_ERRORS.inactive;
  if (coupon.expires_at && Date.parse(coupon.expires_at) <= now.getTime()) return COUPON_ERRORS.expired;
  if (coupon.max_uses !== null && coupon.max_uses !== undefined && coupon.uses >= coupon.max_uses) return COUPON_ERRORS.exhausted;
  return null;
}

/**
 * Discount for a coupon against priced lines. With `product_ids` empty the
 * whole subtotal is eligible; otherwise only lines for those products are.
 * Percent coupons round to the nearest cent; fixed coupons never exceed the
 * eligible amount. The discount never exceeds `subtotalCents`.
 */
export function applyCoupon(
  subtotalCents: number,
  coupon: Coupon | null | undefined,
  lines: ReadonlyArray<{ product: Pick<Product, "id">; line_cents: number }>,
  now: Date,
): CouponResult {
  if (!coupon) return { discount_cents: 0, error: null };
  const invalid = couponValidityError(coupon, now);
  if (invalid) return { discount_cents: 0, error: invalid };
  const eligibleLines = lines.filter((l) => couponAppliesToProduct(coupon, l.product.id));
  if (coupon.product_ids.length > 0 && eligibleLines.length === 0) return { discount_cents: 0, error: COUPON_ERRORS.scope };
  const eligible = coupon.product_ids.length === 0 ? Math.max(0, subtotalCents) : eligibleLines.reduce((n, l) => n + Math.max(0, l.line_cents), 0);
  let discount = 0;
  if (coupon.kind === "percent") {
    const pct = Math.min(100, Math.max(0, coupon.amount));
    discount = Math.round((eligible * pct) / 100);
  } else {
    discount = Math.min(Math.max(0, Math.round(coupon.amount)), eligible);
  }
  return { discount_cents: Math.min(discount, Math.max(0, subtotalCents)), error: null };
}

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export interface PricedLine {
  product: Product;
  unit_cents: number;
  quantity: number;
  line_cents: number;
}

export interface CartTotals {
  lines: PricedLine[];
  subtotal_cents: number;
  discount_cents: number;
  total_cents: number;
  /** Set when a coupon was supplied but could not be applied. */
  coupon_error: CouponError | null;
}

export interface CartTotalsInput {
  lines: ReadonlyArray<{ product_id: string; quantity: number }>;
  products: ReadonlyArray<Product>;
  coupon?: Coupon | null;
  now: Date;
}

/** Server-side totals. Lines whose product is missing, or with quantity < 1, are dropped. */
export function cartTotals({ lines, products, coupon, now }: CartTotalsInput): CartTotals {
  const byId = new Map(products.map((p) => [p.id, p]));
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = byId.get(line.product_id);
    const quantity = Math.floor(line.quantity);
    if (!product || !Number.isFinite(quantity) || quantity < 1) continue;
    const unit_cents = effectiveUnitPrice(product, now);
    priced.push({ product, unit_cents, quantity, line_cents: unit_cents * quantity });
  }
  const subtotal_cents = priced.reduce((n, l) => n + l.line_cents, 0);
  const { discount_cents, error } = applyCoupon(subtotal_cents, coupon ?? null, priced, now);
  return { lines: priced, subtotal_cents, discount_cents, total_cents: Math.max(0, subtotal_cents - discount_cents), coupon_error: error };
}

// ---------------------------------------------------------------------------
// Display currencies
// ---------------------------------------------------------------------------

export type DisplayCurrency = (typeof site.displayCurrencies)[number];

export function displayCurrency(code: string | null | undefined): DisplayCurrency {
  const wanted = (code ?? "USD").toUpperCase();
  return site.displayCurrencies.find((c) => c.code === wanted) ?? site.displayCurrencies[0];
}

/** USD cents converted to whole units of the display currency (rounded to the nearest unit). */
export function convertCents(cents: number, displayCurrencyCode: string): number {
  const currency = displayCurrency(displayCurrencyCode);
  return Math.round((cents / 100) * currency.rate);
}

/**
 * Price for display. USD (the charge currency) keeps exact cents; other
 * currencies are converted with the placeholder rates in `site.displayCurrencies`
 * and rounded to the nearest unit, e.g. `€181`. Unknown codes fall back to USD.
 */
export function formatPriceInCurrency(cents: number, displayCurrencyCode: string): string {
  const currency = displayCurrency(displayCurrencyCode);
  if (currency.code === "USD") return formatMoney(cents, "USD");
  const units = convertCents(cents, currency.code);
  const sign = units < 0 ? "-" : "";
  return `${sign}${currency.symbol}${Math.abs(units).toLocaleString("en-US")}`;
}

// ---------------------------------------------------------------------------
// Product helpers
// ---------------------------------------------------------------------------

export function isSubscriptionProduct(product: Pick<Product, "type">): boolean {
  return product.type === "subscription";
}

export function isPaymentPlanProduct(product: Pick<Product, "type" | "installments">): boolean {
  return product.type === "payment_plan" && (product.installments ?? 0) > 1;
}

export interface InstallmentsSummary {
  count: number;
  /** charged per installment (the product's unit price) */
  each_cents: number;
  total_cents: number;
  /** e.g. "3 payments of $69" */
  label: string;
}

/** For payment plans `price_cents` is the per-installment charge. Null for other product types. */
export function installmentsSummary(product: Pick<Product, "type" | "installments"> & PriceProduct, now?: Date): InstallmentsSummary | null {
  if (!isPaymentPlanProduct(product)) return null;
  const count = product.installments as number;
  const each_cents = now ? effectiveUnitPrice(product, now) : Math.max(0, Math.round(product.price_cents || 0));
  return { count, each_cents, total_cents: each_cents * count, label: `${count} payments of ${formatMoney(each_cents)}` };
}

export function grantsCourse(product: Pick<Product, "grants_all_courses" | "course_ids">, courseId: string): boolean {
  return !!product.grants_all_courses || product.course_ids.includes(courseId);
}
