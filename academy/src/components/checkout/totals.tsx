import * as React from "react";
import { formatMoney, cn } from "@/lib/utils";
import { formatPriceInCurrency } from "@/lib/domain/pricing";

export interface TotalsProps {
  subtotalCents: number;
  discountCents: number;
  couponCode?: string | null;
  /** Tax already known (paid orders) or null to show the "calculated at payment" note. */
  taxCents?: number | null;
  totalCents: number;
  displayCurrency?: string;
  /** "Due today" vs "Total" wording for memberships / plans. */
  recurringNote?: string | null;
  className?: string;
}

/** Subtotal / discount / tax / total block. Server Component. */
function Totals({ subtotalCents, discountCents, couponCode, taxCents = null, totalCents, displayCurrency = "USD", recurringNote = null, className }: TotalsProps) {
  const showEstimate = displayCurrency !== "USD" && totalCents > 0;
  return (
    <dl data-slot="totals" className={cn("grid gap-1.5 text-sm", className)}>
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
      </div>
      {discountCents > 0 ? (
        <div className="flex justify-between gap-4 text-sage-strong">
          <dt>Discount{couponCode ? ` (${couponCode})` : ""}</dt>
          <dd className="tabular-nums">−{formatMoney(discountCents)}</dd>
        </div>
      ) : null}
      <div className="flex justify-between gap-4">
        <dt className="text-muted-foreground">Tax</dt>
        <dd className="text-right text-muted-foreground tabular-nums">{taxCents === null ? "Calculated at payment" : taxCents === 0 ? "—" : formatMoney(taxCents)}</dd>
      </div>
      <div className="mt-1 flex justify-between gap-4 border-t border-border pt-2 text-base font-semibold">
        <dt>{recurringNote ? "Due today" : "Total"}</dt>
        <dd className="tabular-nums">{totalCents === 0 ? "Free" : formatMoney(totalCents)}</dd>
      </div>
      {recurringNote ? <p className="text-xs text-muted-foreground">{recurringNote}</p> : null}
      {showEstimate ? (
        <p className="text-xs text-muted-foreground">
          About <span className="font-semibold text-foreground tabular-nums">{formatPriceInCurrency(totalCents, displayCurrency)}</span> in {displayCurrency}. You will be charged in USD; your bank sets the final rate.
        </p>
      ) : null}
    </dl>
  );
}

export { Totals };
