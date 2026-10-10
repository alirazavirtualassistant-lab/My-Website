"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { Lock, ShieldCheck, Gift } from "lucide-react";
import { site } from "@/lib/config/site";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { idleCheckoutState, type CheckoutFormState } from "./types";

export interface CheckoutFormProps {
  action: (prev: CheckoutFormState, formData: FormData) => Promise<CheckoutFormState>;
  /** Signed-in buyer, or null for guest checkout. */
  buyer: { name: string; email: string } | null;
  gift: boolean;
  payLabel: string;
  paymentsMode: "mock" | "stripe";
  /** Prefill the guest fields (e.g. after a validation round-trip). */
  defaults?: { email?: string; name?: string };
}

/**
 * The checkout form: guest identity (when signed out), gift recipient (in gift
 * mode), the disclaimer acknowledgement and the pay button. Inline errors come
 * back through useActionState; a successful submit redirects to the provider.
 */
function CheckoutForm({ action, buyer, gift, payLabel, paymentsMode, defaults }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(action, idleCheckoutState);
  const errors = state.errors ?? {};
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const signInNext = gift ? "/checkout?gift=1" : "/checkout";

  React.useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
  }, [state.status, state.stamp]);

  const errorList = Object.entries(errors).filter(([, v]) => !!v);

  return (
    <form action={formAction} noValidate className="grid gap-8" aria-busy={pending || undefined}>
      <input type="hidden" name="gift" value={gift ? "1" : "0"} />

      {state.status === "error" && errorList.length > 0 ? (
        <div ref={summaryRef} tabIndex={-1} className="outline-none">
          <Alert variant="destructive">
            <AlertTitle>{errors.form && errorList.length === 1 ? "We couldn't continue" : "Please check the form"}</AlertTitle>
            <AlertDescription>
              {errors.form ? <p>{errors.form}</p> : null}
              {errorList.length > 1 || !errors.form ? (
                <ul className="list-disc pl-5">
                  {errorList
                    .filter(([k]) => k !== "form")
                    .map(([k, v]) => (
                      <li key={k}>{v}</li>
                    ))}
                </ul>
              ) : null}
              {state.code === "empty_cart" ? (
                <p>
                  <Link href="/courses" className="font-semibold underline underline-offset-4">
                    Browse courses
                  </Link>
                </p>
              ) : state.code === "coupon" ? (
                <p>
                  <Link href="/cart" className="font-semibold underline underline-offset-4">
                    Change or remove the code in your cart
                  </Link>
                </p>
              ) : null}
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      <section aria-labelledby="checkout-you" className="grid gap-4">
        <div>
          <h2 id="checkout-you" className="font-serif text-2xl">
            {gift ? "Your details" : "Who is this for?"}
          </h2>
          {buyer ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{buyer.name}</span> ({buyer.email}). {gift ? "The receipt goes to you; the course goes to them." : "Your course will be added to this account."}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              We will create a free account for you and email a link to set your password.{" "}
              <Link href={`/sign-in?next=${encodeURIComponent(signInNext)}`} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                Already have an account? Sign in
              </Link>{" "}
              — your cart stays put.
            </p>
          )}
        </div>
        {buyer ? null : (
          <FormRow>
            <FormField id="name" label="Your name" required error={errors.name}>
              <Input name="name" autoComplete="name" defaultValue={defaults?.name ?? ""} maxLength={80} />
            </FormField>
            <FormField id="email" label="Email" required error={errors.email} hint="Your receipt and sign-in link go here.">
              <Input name="email" type="email" inputMode="email" autoComplete="email" defaultValue={defaults?.email ?? ""} maxLength={254} />
            </FormField>
          </FormRow>
        )}
      </section>

      {gift ? (
        <section aria-labelledby="checkout-gift" className="grid gap-4 rounded-lg border border-gold/50 bg-gold-soft/40 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-soft text-warning">
              <Gift className="size-4.5" />
            </div>
            <div>
              <h2 id="checkout-gift" className="font-serif text-2xl leading-tight">
                Who are you gifting?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">They get an email with your message and a link to open the course on their own account, whenever the time feels right.</p>
            </div>
          </div>
          <FormStack>
            <FormRow>
              <FormField id="recipient_name" label="Their name" required error={errors.recipient_name}>
                <Input name="recipient_name" autoComplete="off" maxLength={80} />
              </FormField>
              <FormField id="recipient_email" label="Their email" required error={errors.recipient_email}>
                <Input name="recipient_email" type="email" inputMode="email" autoComplete="off" maxLength={254} />
              </FormField>
            </FormRow>
            <FormField id="message" label="A message" hint="Optional, up to 1,000 characters. We include it word for word." error={errors.message}>
              <Textarea name="message" maxLength={1000} rows={4} placeholder="Thinking of you both…" />
            </FormField>
          </FormStack>
        </section>
      ) : null}

      <section aria-labelledby="checkout-ack" className="grid gap-3">
        <h2 id="checkout-ack" className="font-serif text-2xl">
          One gentle reminder
        </h2>
        <p className="text-sm text-muted-foreground">{site.medicalDisclaimer}</p>
        <div className="flex items-start gap-3">
          <Checkbox id="acknowledged" name="acknowledged" value="on" aria-describedby={errors.acknowledged ? "acknowledged-error" : undefined} aria-invalid={errors.acknowledged ? true : undefined} className="mt-0.5" />
          <Label htmlFor="acknowledged" className="leading-snug font-normal">
            I understand this course is educational and not medical advice.
          </Label>
        </div>
        {errors.acknowledged ? (
          <p id="acknowledged-error" role="alert" className="text-xs font-medium text-danger">
            {errors.acknowledged}
          </p>
        ) : null}
      </section>

      <div className="grid gap-3">
        <Button type="submit" size="lg" loading={pending} className="w-full">
          {pending ? "Taking you to payment…" : (
            <>
              <Lock aria-hidden="true" />
              {payLabel}
            </>
          )}
        </Button>
        <p className="flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {paymentsMode === "stripe"
              ? "You will finish on Stripe's secure payment page. We never see your card details."
              : "Test mode: the next page is a simulated payment screen. No card is needed and nothing is charged."}{" "}
            By paying you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-rose-strong">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="underline underline-offset-4 hover:text-rose-strong">
              refund policy
            </Link>
            .
          </span>
        </p>
      </div>
    </form>
  );
}

export { CheckoutForm };
