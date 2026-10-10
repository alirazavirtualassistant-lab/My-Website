"use client";

import * as React from "react";
import { site } from "@/lib/config/site";
import { formatMoney, cn } from "@/lib/utils";

export type DisplayCurrencyCode = (typeof site.displayCurrencies)[number]["code"];

const DEFAULT_CODE: DisplayCurrencyCode = "USD";

const DisplayCurrencyContext = React.createContext<{
  code: DisplayCurrencyCode;
  setCode: (code: DisplayCurrencyCode) => void;
}>({ code: DEFAULT_CODE, setCode: () => {} });

/** Optional provider; without it everything displays in USD. */
function DisplayCurrencyProvider({ initial = DEFAULT_CODE, children }: { initial?: DisplayCurrencyCode; children: React.ReactNode }) {
  const [code, setCode] = React.useState<DisplayCurrencyCode>(initial);
  const value = React.useMemo(() => ({ code, setCode }), [code]);
  return <DisplayCurrencyContext.Provider value={value}>{children}</DisplayCurrencyContext.Provider>;
}

function useDisplayCurrency() {
  return React.useContext(DisplayCurrencyContext);
}

/** Converts cents between the display currencies (USD base, display-only rates). */
export function convertCents(cents: number, from: string, to: string): number {
  if (from === to) return cents;
  const rateOf = (code: string) => site.displayCurrencies.find((c) => c.code === code)?.rate ?? null;
  const fromRate = rateOf(from);
  const toRate = rateOf(to);
  if (fromRate === null || toRate === null) return cents;
  return Math.round((cents / fromRate) * toRate);
}

export interface CurrencyDisplayProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Amount in minor units (cents) of `currency`. */
  cents: number;
  /** Currency the amount is stored in. Defaults to the site currency (USD). */
  currency?: string;
  /** Force a display currency (otherwise the context / USD). */
  displayAs?: DisplayCurrencyCode;
  /** Render with a strikethrough (original price next to a sale price). */
  strike?: boolean;
  /** Show "≈" + the code when the amount was converted. */
  showApprox?: boolean;
  /** "Free" instead of $0. */
  freeText?: string | null;
}

/**
 * Formats cents via formatMoney, converting to the display currency from
 * context when one is set. Charges are always in USD; this is a courtesy view.
 */
function CurrencyDisplay({ cents, currency = site.currency, displayAs, strike, showApprox = true, freeText = "Free", className, ...props }: CurrencyDisplayProps) {
  const ctx = useDisplayCurrency();
  const target = displayAs ?? ctx.code;
  const converted = target === currency;
  const amount = converted ? cents : convertCents(cents, currency, target);
  const text = cents === 0 && freeText ? freeText : formatMoney(amount, target);
  const approx = !converted && showApprox && cents !== 0;
  return (
    <span
      data-slot="currency"
      className={cn("tabular-nums", strike && "text-muted-foreground line-through decoration-rose/70", className)}
      title={approx ? `Approximately ${text}; charged as ${formatMoney(cents, currency)}` : undefined}
      {...props}
    >
      {approx ? <span aria-hidden="true">≈ </span> : null}
      {text}
      {approx ? <span className="sr-only"> approximately; charged as {formatMoney(cents, currency)}</span> : null}
    </span>
  );
}

export { CurrencyDisplay, DisplayCurrencyProvider, useDisplayCurrency };
