import * as React from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CurrencyDisplay } from "@/components/ui/currency-display";

/**
 * Local pricing helpers for the public pages. Pure: no I/O.
 * TODO(shared): replace with `effectiveUnitPrice` from `@/lib/domain/pricing`
 * once that module lands; the shape below mirrors the request in the report.
 */
export interface EffectivePrice {
  /** What the visitor pays today. */
  cents: number;
  /** The list price when a sale is active, otherwise null. */
  original_cents: number | null;
  on_sale: boolean;
  sale_ends_at: string | null;
  currency: string;
}

export type PricedProduct = Pick<Product, "price_cents" | "sale_price_cents" | "sale_ends_at" | "is_free" | "currency">;

export function effectiveUnitPrice(product: PricedProduct, now: Date = new Date()): EffectivePrice {
  const currency = product.currency || "USD";
  if (product.is_free) return { cents: 0, original_cents: null, on_sale: false, sale_ends_at: null, currency };
  const sale = product.sale_price_cents;
  const saleActive =
    typeof sale === "number" &&
    sale >= 0 &&
    sale < product.price_cents &&
    (!product.sale_ends_at || new Date(product.sale_ends_at).getTime() > now.getTime());
  if (saleActive) {
    return { cents: sale, original_cents: product.price_cents, on_sale: true, sale_ends_at: product.sale_ends_at, currency };
  }
  return { cents: product.price_cents, original_cents: null, on_sale: false, sale_ends_at: null, currency };
}

/** "3 × $69" style label for a payment plan product. */
export function paymentPlanLabel(plan: Pick<Product, "installments" | "price_cents" | "currency"> | null, format: (cents: number, currency: string) => string): string | null {
  if (!plan || !plan.installments || plan.installments < 2) return null;
  return `${plan.installments} × ${format(plan.price_cents, plan.currency || "USD")}`;
}

export interface PriceProps extends Omit<React.ComponentProps<"span">, "children"> {
  price: EffectivePrice;
  size?: "sm" | "md" | "lg";
  /** Show the sale badge next to the price. */
  showSaleBadge?: boolean;
}

const sizes = { sm: "text-base", md: "text-2xl", lg: "text-4xl" } as const;

/** Current price with the list price struck through during a sale. */
function Price({ price, size = "md", showSaleBadge = false, className, ...props }: PriceProps) {
  return (
    <span data-slot="price" className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-1", className)} {...props}>
      <CurrencyDisplay cents={price.cents} currency={price.currency} className={cn("font-serif font-semibold text-foreground", sizes[size])} />
      {price.original_cents !== null ? (
        <>
          <span className="sr-only">Was</span>
          <CurrencyDisplay cents={price.original_cents} currency={price.currency} strike className={cn("text-sm", size === "lg" && "text-base")} />
        </>
      ) : null}
      {showSaleBadge && price.on_sale ? (
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-xs font-bold tracking-wide text-warning uppercase">Sale</span>
      ) : null}
    </span>
  );
}

export { Price };
