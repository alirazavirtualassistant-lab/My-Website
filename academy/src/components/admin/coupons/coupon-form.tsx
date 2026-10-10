"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";
import type { Coupon } from "@/lib/types";
import { saveCouponAction } from "@/app/admin/(panel)/coupons/actions";

export interface CouponFormProps {
  coupon: Coupon | null;
  products: Array<{ id: string; title: string }>;
}

/** New/edit coupon. The code is uppercased as you type and again on the server; the server mirrors it into the payment provider. */
function CouponForm({ coupon, products }: CouponFormProps) {
  const [state, action] = useActionState(saveCouponAction, idleState);
  const errors = state.errors ?? {};
  const [kind, setKind] = React.useState<Coupon["kind"]>(coupon?.kind ?? "percent");
  const [code, setCode] = React.useState(coupon?.code ?? "");
  const amountDefault = coupon ? (coupon.kind === "fixed" ? (coupon.amount / 100).toFixed(2) : String(coupon.amount)) : "";
  const amountRef = React.useRef<HTMLInputElement>(null);

  return (
    <form action={action} noValidate className="grid gap-8">
      {coupon ? <input type="hidden" name="id" value={coupon.id} /> : null}
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />

      <FormStack>
        <FormRow>
          <FormField id="coupon-code" label="Code" required hint="Letters, numbers, dashes. Shown to customers exactly like this." error={errors.code}>
            <Input
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40))}
              placeholder="LAUNCH20"
              autoComplete="off"
              spellCheck={false}
              className="font-mono uppercase tracking-wider"
              required
            />
          </FormField>
          <FormField id="coupon-amount" label={kind === "percent" ? "Percent off" : "Amount off (USD)"} required error={errors.amount}>
            <Input ref={amountRef} name="amount" inputMode="decimal" defaultValue={amountDefault} placeholder={kind === "percent" ? "20" : "25.00"} required />
          </FormField>
        </FormRow>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-semibold">Discount type</legend>
          <RadioGroup name="kind" value={kind} onValueChange={(v) => setKind(v as Coupon["kind"])} className="sm:grid-cols-2">
            <Label htmlFor="kind-percent" className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
              <RadioGroupItem id="kind-percent" value="percent" />
              Percentage off
            </Label>
            <Label htmlFor="kind-fixed" className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-rose has-[[data-state=checked]]:bg-rose-soft/40">
              <RadioGroupItem id="kind-fixed" value="fixed" />
              Fixed amount off
            </Label>
          </RadioGroup>
          {errors.kind ? (
            <p role="alert" className="text-xs font-medium text-danger">
              {errors.kind}
            </p>
          ) : null}
        </fieldset>

        <FormRow>
          <FormField id="coupon-expires" label="Expires" hint="Usable until the end of that day (UTC). Leave blank for no expiry." error={errors.expires_at}>
            <Input name="expires_at" type="date" defaultValue={coupon?.expires_at ? coupon.expires_at.slice(0, 10) : ""} />
          </FormField>
          <FormField id="coupon-max-uses" label="Maximum uses" hint={coupon ? `Used ${coupon.uses} time${coupon.uses === 1 ? "" : "s"} so far.` : "Leave blank for unlimited."} error={errors.max_uses}>
            <Input name="max_uses" type="number" min={1} defaultValue={coupon?.max_uses ?? ""} placeholder="Unlimited" />
          </FormField>
        </FormRow>
      </FormStack>

      <div className="grid gap-2" role="group" aria-labelledby="scope-label" aria-describedby="scope-hint">
        <p id="scope-label" className="text-sm font-semibold">
          Applies to
        </p>
        <p id="scope-hint" className="text-xs text-muted-foreground">
          Leave everything unticked to apply to every product.
        </p>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active products yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                <Checkbox id={`scope-${p.id}`} name="product_ids" value={p.id} defaultChecked={coupon?.product_ids.includes(p.id) ?? false} />
                <Label htmlFor={`scope-${p.id}`} className="min-w-0 flex-1 cursor-pointer leading-snug font-medium">
                  <span className="truncate">{p.title}</span>
                </Label>
              </li>
            ))}
          </ul>
        )}
        {errors.product_ids ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {errors.product_ids}
          </p>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
        <div>
          <Label htmlFor="coupon-active" className="text-base font-semibold">
            Active
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">Inactive coupons stay here for your records but can’t be redeemed.</p>
        </div>
        <Switch id="coupon-active" name="active" value="on" defaultChecked={coupon?.active ?? true} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Saving…">{coupon ? "Save changes" : "Create coupon"}</SubmitButton>
        <Button asChild variant="ghost">
          <Link href="/admin/coupons">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

export { CouponForm };
