"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";
import type { Product, ProductType } from "@/lib/types";
import { saveProductAction } from "@/app/admin/(panel)/products/actions";

export interface ProductFormProps {
  product: Product | null;
  courses: Array<{ id: string; title: string; status: string }>;
}

const TYPE_LABELS: Record<ProductType, string> = {
  course: "Single course",
  bundle: "Bundle of courses",
  subscription: "Membership (recurring)",
  payment_plan: "Payment plan (instalments)",
};

const dollars = (cents: number | null | undefined) => (cents === null || cents === undefined ? "" : (cents / 100).toFixed(2));

/** New/edit product form. Prices are typed in dollars and stored as cents; the server mirrors the product into the payment provider. */
function ProductForm({ product, courses }: ProductFormProps) {
  const [state, action] = useActionState(saveProductAction, idleState);
  const errors = state.errors ?? {};
  const [type, setType] = React.useState<ProductType>(product?.type ?? "course");
  const [isFree, setIsFree] = React.useState(product?.is_free ?? false);
  const [grantsAll, setGrantsAll] = React.useState(product?.grants_all_courses ?? false);
  const recurring = type === "subscription";
  const plan = type === "payment_plan";

  return (
    <form action={action} noValidate className="grid gap-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />

      <FormStack>
        <FormRow>
          <div className="grid gap-1.5">
            <Label htmlFor="product-type">
              Type <span aria-hidden="true" className="text-rose-strong">*</span>
            </Label>
            <Select name="type" value={type} onValueChange={(v) => setType(v as ProductType)}>
              <SelectTrigger id="product-type" className="w-full" aria-invalid={errors.type ? true : undefined}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABELS) as ProductType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.type}
              </p>
            ) : null}
          </div>
          <FormField id="product-slug" label="URL slug" hint="Leave blank to generate from the title." error={errors.slug}>
            <Input name="slug" defaultValue={product?.slug ?? ""} placeholder="baby-steps" autoComplete="off" />
          </FormField>
        </FormRow>
        <FormField id="product-title" label="Title" required error={errors.title}>
          <Input name="title" defaultValue={product?.title ?? ""} required maxLength={160} />
        </FormField>
        <FormField id="product-description" label="Description" hint="Shown on pricing and checkout. One or two sentences." error={errors.description}>
          <Textarea name="description" defaultValue={product?.description ?? ""} maxLength={2000} rows={3} />
        </FormField>
      </FormStack>

      <fieldset className="grid gap-4">
        <legend className="mb-1 font-serif text-xl">What it unlocks</legend>
        {recurring || type === "bundle" ? (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <div>
              <Label htmlFor="grants-all" className="text-base font-semibold">
                Every current and future course
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">Typical for All-Access. Turn off to pick specific courses.</p>
            </div>
            <Switch id="grants-all" name="grants_all_courses" value="on" checked={grantsAll} onCheckedChange={setGrantsAll} />
          </div>
        ) : null}
        {!grantsAll || (!recurring && type !== "bundle") ? (
          <div className="grid gap-2" role="group" aria-labelledby="courses-label" aria-describedby={errors.course_ids ? "courses-error" : undefined}>
            <p id="courses-label" className="text-sm font-semibold">
              Courses {type === "bundle" ? "(pick two or more)" : ""}
            </p>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No courses yet.{" "}
                <Link href="/admin/courses" className="text-rose-strong underline underline-offset-4">
                  Create one first.
                </Link>
              </p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {courses.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
                    <Checkbox id={`course-${c.id}`} name="course_ids" value={c.id} defaultChecked={product?.course_ids.includes(c.id) ?? false} />
                    <Label htmlFor={`course-${c.id}`} className="min-w-0 flex-1 cursor-pointer leading-snug font-medium">
                      <span className="truncate">{c.title}</span>
                      {c.status !== "published" ? <span className="ml-auto text-xs font-normal text-muted-foreground capitalize">{c.status}</span> : null}
                    </Label>
                  </li>
                ))}
              </ul>
            )}
            {errors.course_ids ? (
              <p id="courses-error" role="alert" className="text-xs font-medium text-danger">
                {errors.course_ids}
              </p>
            ) : null}
          </div>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-4">
        <legend className="mb-1 font-serif text-xl">Pricing</legend>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
          <div>
            <Label htmlFor="is-free" className="text-base font-semibold">
              Free product
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">Lead magnets and free courses. Checkout skips payment and enrols straight away.</p>
          </div>
          <Switch id="is-free" name="is_free" value="on" checked={isFree} onCheckedChange={setIsFree} />
        </div>
        {!isFree ? (
          <>
            <FormRow>
              <FormField id="product-price" label={plan ? "Amount per instalment (USD)" : recurring ? "Price per period (USD)" : "Price (USD)"} required error={errors.price}>
                <Input name="price" inputMode="decimal" defaultValue={dollars(product?.price_cents ?? 0)} placeholder="197.00" required />
              </FormField>
              {recurring ? (
                <div className="grid gap-1.5">
                  <Label htmlFor="product-interval">Billing interval</Label>
                  <Select name="interval" defaultValue={product?.interval ?? "month"}>
                    <SelectTrigger id="product-interval" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : plan ? (
                <FormField id="product-installments" label="Number of instalments" required hint="Charged monthly; access opens on the first payment." error={errors.installments}>
                  <Input name="installments" type="number" min={2} max={24} defaultValue={product?.installments ?? 3} required />
                </FormField>
              ) : null}
            </FormRow>
            {!recurring && !plan ? (
              <FormRow>
                <FormField id="product-sale-price" label="Sale price (USD)" hint="Leave blank when there is no sale." error={errors.sale_price}>
                  <Input name="sale_price" inputMode="decimal" defaultValue={dollars(product?.sale_price_cents)} placeholder="147.00" />
                </FormField>
                <FormField id="product-sale-ends" label="Sale ends" hint="Ends at the end of that day (UTC). The course page shows a countdown." error={errors.sale_ends_at}>
                  <Input name="sale_ends_at" type="date" defaultValue={product?.sale_ends_at ? product.sale_ends_at.slice(0, 10) : ""} />
                </FormField>
              </FormRow>
            ) : null}
          </>
        ) : null}
      </fieldset>

      <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
        <div>
          <Label htmlFor="product-active" className="text-base font-semibold">
            On sale
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">Inactive products are hidden from pricing and can’t be bought. Existing access is unaffected.</p>
        </div>
        <Switch id="product-active" name="active" value="on" defaultChecked={product?.active ?? true} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Saving…">{product ? "Save changes" : "Create product"}</SubmitButton>
        <Button asChild variant="ghost">
          <Link href="/admin/products">Cancel</Link>
        </Button>
        {product?.stripe_product_id ? <p className="text-xs text-muted-foreground">Saving re-syncs the provider ids.</p> : null}
      </div>
    </form>
  );
}

export { ProductForm, TYPE_LABELS };
