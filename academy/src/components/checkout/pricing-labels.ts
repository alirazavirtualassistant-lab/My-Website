/**
 * Small pure helpers that turn a Product into the short labels the cart,
 * checkout and confirmation screens show next to a line.
 */
import type { Product } from "@/lib/types";
import { installmentsSummary, isSaleActive, isSubscriptionProduct } from "@/lib/domain/pricing";
import { formatMoney } from "@/lib/utils";

export const PARTNER_LESSON_CODES = ["M1T4", "M3T2", "M4T4", "M6T1", "M6T2", "M6T3", "M6T4", "M6T5", "M6T6"] as const;

/** "One-time purchase", "Membership · billed monthly", "3 payments of $69". */
export function productKindLabel(product: Product, now = new Date()): string {
  if (product.is_free) return "Free";
  if (isSubscriptionProduct(product)) return `Membership · billed ${product.interval === "year" ? "yearly" : "monthly"}`;
  const plan = installmentsSummary(product, now);
  if (plan) return `Payment plan · ${plan.label}`;
  if (product.type === "bundle") return "Bundle · one-time purchase";
  return "One-time purchase";
}

/** What the "Pay" button should promise for this quote. */
export function payButtonLabel(opts: { totalCents: number; mode: "payment" | "subscription"; gift: boolean }): string {
  if (opts.totalCents === 0) return "Get it for free";
  if (opts.gift) return `Pay securely · ${formatMoney(opts.totalCents)}`;
  if (opts.mode === "subscription") return `Start membership · ${formatMoney(opts.totalCents)}`;
  return `Pay securely · ${formatMoney(opts.totalCents)}`;
}

/** List price to strike through when a sale is on, else null. */
export function strikePriceCents(product: Product, now = new Date()): number | null {
  if (product.is_free) return null;
  return isSaleActive(product, now) && product.sale_price_cents !== null && product.price_cents > product.sale_price_cents ? product.price_cents : null;
}
