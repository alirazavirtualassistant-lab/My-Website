"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { setDisplayCurrencyAction } from "@/lib/actions/cart";

export interface CurrencySelectProps {
  value: string;
  className?: string;
}

/**
 * Display-currency picker. A native <select> (keyboard + screen-reader friendly)
 * that submits the shared `setDisplayCurrencyAction` on change; the page then
 * re-renders with converted estimates. Charges are always made in USD.
 */
function CurrencySelect({ value, className }: CurrencySelectProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const id = React.useId();
  return (
    <form
      action={setDisplayCurrencyAction}
      onChange={(e) => {
        const form = e.currentTarget;
        startTransition(async () => {
          await setDisplayCurrencyAction(new FormData(form));
          router.refresh();
        });
      }}
      className={cn("flex items-center gap-2 text-sm", className)}
    >
      <label htmlFor={id} className="font-semibold text-foreground/80">
        Show prices in
      </label>
      <select
        id={id}
        name="currency"
        defaultValue={value}
        disabled={pending}
        aria-busy={pending || undefined}
        className="h-9 rounded-lg border border-input bg-card px-2.5 text-sm text-foreground shadow-xs outline-none focus-visible:border-rose focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
      >
        {site.displayCurrencies.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="rounded-md border border-border px-2 py-1 text-xs font-semibold">
          Update
        </button>
      </noscript>
    </form>
  );
}

export { CurrencySelect };
