import * as React from "react";
import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatMoney, cn } from "@/lib/utils";
import { formatPriceInCurrency } from "@/lib/domain/pricing";
import { Badge } from "@/components/ui/badge";
import { Illustration } from "@/components/shared/illustration";
import { productKindLabel, strikePriceCents } from "./pricing-labels";
import { RemoveLineButton } from "./remove-line-button";

export interface OrderLine {
  product: Product;
  unitCents: number;
  quantity: number;
  lineCents: number;
  /** Set when the product can no longer be bought (inactive / removed). */
  unavailable?: boolean;
}

export interface OrderLinesProps {
  lines: OrderLine[];
  /** Show the "Remove" button on each line (cart). */
  removable?: boolean;
  /** Display currency code; non-USD adds a converted estimate under the price. */
  displayCurrency?: string;
  /** Mark lines as gifts (checkout in gift mode). */
  gift?: boolean;
  className?: string;
}

/** The product rows of a cart / checkout summary. Server Component. */
function OrderLines({ lines, removable = false, displayCurrency = "USD", gift = false, className }: OrderLinesProps) {
  const now = new Date();
  return (
    <ul data-slot="order-lines" className={cn("divide-y divide-border", className)}>
      {lines.map((line) => {
        const strike = strikePriceCents(line.product, now);
        const courseSlug = line.product.type === "course" ? line.product.slug : null;
        return (
          <li key={line.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-rose-soft/60 text-rose-strong">
              <Illustration name={line.product.type === "subscription" ? "leaves" : line.product.type === "payment_plan" ? "path" : "seedling"} size={40} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <div className="min-w-0">
                  <p className="font-serif text-lg leading-snug font-medium text-foreground">
                    {courseSlug ? (
                      <Link href={`/courses/${courseSlug}`} className="rounded-sm underline-offset-4 hover:underline">
                        {line.product.title}
                      </Link>
                    ) : (
                      line.product.title
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{productKindLabel(line.product, now)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {gift ? (
                      <Badge variant="gold">
                        <Gift aria-hidden="true" /> Gift
                      </Badge>
                    ) : null}
                    {strike !== null ? (
                      <Badge variant="rose">
                        <Sparkles aria-hidden="true" /> Sale
                      </Badge>
                    ) : null}
                    {line.unavailable ? <Badge variant="muted">No longer available</Badge> : null}
                  </div>
                </div>
                <div className="text-right">
                  {line.unavailable ? (
                    <p className="text-sm text-muted-foreground">—</p>
                  ) : (
                    <>
                      <p className="font-semibold text-foreground tabular-nums">{line.lineCents === 0 ? "Free" : formatMoney(line.lineCents)}</p>
                      {strike !== null ? (
                        <p className="text-xs text-muted-foreground tabular-nums">
                          <span className="sr-only">Was </span>
                          <s>{formatMoney(strike * line.quantity)}</s>
                        </p>
                      ) : null}
                      {displayCurrency !== "USD" && line.lineCents > 0 ? (
                        <p className="text-xs text-muted-foreground tabular-nums">≈ {formatPriceInCurrency(line.lineCents, displayCurrency)}</p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Qty 1</p>
                {removable ? <RemoveLineButton productId={line.product.id} title={line.product.title} /> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export { OrderLines };
