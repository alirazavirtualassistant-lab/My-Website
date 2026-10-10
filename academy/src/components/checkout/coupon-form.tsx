import * as React from "react";
import { Tag, X } from "lucide-react";
import { applyCouponAction } from "@/lib/actions/cart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";

export interface CouponFormProps {
  /** Code currently stored in the coupon cookie (upper-case) or null. */
  code: string | null;
  /** Why the stored code could not be applied, if so. */
  error: string | null;
  /** Discount the code produced, in cents (0 when none). */
  discountCents: number;
  compact?: boolean;
}

/**
 * Coupon entry. Posts the shared applyCouponAction; the page re-renders with the
 * quote so the discount or the error shows up inline. An applied code gets a
 * "Remove" button that clears the cookie.
 */
function CouponForm({ code, error, discountCents, compact = false }: CouponFormProps) {
  const applied = !!code && !error && discountCents > 0;
  const hintId = "coupon-hint";
  const errorId = "coupon-error";
  return (
    <div data-slot="coupon-form" className="grid gap-2">
      <form action={applyCouponAction} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="coupon">Coupon code</Label>
          <Input
            id="coupon"
            name="coupon"
            defaultValue={code ?? ""}
            placeholder="e.g. WELCOME"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={40}
            aria-describedby={error ? errorId : applied ? hintId : undefined}
            aria-invalid={error ? true : undefined}
            className="uppercase"
          />
        </div>
        <SubmitButton variant="outline" size={compact ? "sm" : "md"} pendingText="Checking…">
          <Tag aria-hidden="true" />
          Apply
        </SubmitButton>
      </form>
      {error ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : applied ? (
        <div className="flex flex-wrap items-center gap-2">
          <p id={hintId} className="text-xs font-medium text-sage-strong">
            {code} applied.
          </p>
          <form action={applyCouponAction}>
            <input type="hidden" name="coupon" value="" />
            <SubmitButton variant="link" size="sm" className="h-auto text-xs" pendingText="Removing…">
              <X aria-hidden="true" />
              Remove code
            </SubmitButton>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export { CouponForm };
