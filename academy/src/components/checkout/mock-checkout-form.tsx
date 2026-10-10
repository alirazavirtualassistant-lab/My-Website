"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Lock, FlaskConical } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MockCheckoutFormProps {
  sessionId: string;
  /** Where to go once the mock webhook has fulfilled the order (relative path). */
  successPath: string;
  cancelPath: string;
  payLabel: string;
  /** Email shown as the receipt address. */
  email: string | null;
}

const FIELDS = [
  { id: "card-number", label: "Card number", value: "4242 4242 4242 4242", autoComplete: "cc-number" },
  { id: "card-expiry", label: "Expiry", value: "12 / 34", autoComplete: "cc-exp" },
  { id: "card-cvc", label: "CVC", value: "123", autoComplete: "cc-csc" },
  { id: "card-name", label: "Name on card", value: "Test Learner", autoComplete: "cc-name" },
] as const;

/**
 * The demo-mode "payment page". Pressing Pay posts a `checkout.completed` event
 * to /api/webhooks/mock — the very same fulfilment path Stripe's webhook uses —
 * then moves on to the confirmation page. The card fields are decoration.
 */
function MockCheckoutForm({ sessionId, successPath, cancelPath, payLabel, email }: MockCheckoutFormProps) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const pay = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/webhooks/mock", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ type: "checkout.completed", session_id: sessionId }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setError(body.error ?? "The test payment could not be completed. Please try again.");
          return;
        }
        router.push(successPath);
      } catch {
        setError("We couldn't reach the server. Check your connection and try again.");
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        pay();
      }}
      className="grid gap-6"
      aria-busy={pending || undefined}
    >
      <Alert variant="warning">
        <FlaskConical aria-hidden="true" />
        <AlertTitle>Test mode — no card needed</AlertTitle>
        <AlertDescription>
          <p>This is a simulated payment page for the demo. Nothing is charged. In production this screen is Stripe Checkout.</p>
        </AlertDescription>
      </Alert>

      <fieldset className="grid gap-4">
        <legend className="mb-1 flex items-center gap-2 font-serif text-xl">
          <CreditCard className="size-5 text-rose-strong" aria-hidden="true" />
          Card details
        </legend>
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
          {FIELDS.slice(0, 3).map((f) => (
            <div key={f.id} className="grid gap-1.5">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} defaultValue={f.value} readOnly inputMode="numeric" autoComplete={f.autoComplete} className="font-mono tabular-nums" aria-describedby="mock-fields-hint" />
            </div>
          ))}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={FIELDS[3].id}>{FIELDS[3].label}</Label>
          <Input id={FIELDS[3].id} defaultValue={FIELDS[3].value} readOnly autoComplete={FIELDS[3].autoComplete} aria-describedby="mock-fields-hint" />
        </div>
        <p id="mock-fields-hint" className="text-xs text-muted-foreground">
          Pre-filled with Stripe's test card. Fields are read-only.
          {email ? (
            <>
              {" "}
              Receipt goes to <span className="font-semibold text-foreground">{email}</span>.
            </>
          ) : null}
        </p>
      </fieldset>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Payment not completed</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost">
          <Link href={cancelPath}>Cancel and go back</Link>
        </Button>
        <Button type="submit" size="lg" loading={pending} className="sm:min-w-56">
          {pending ? "Processing test payment…" : (
            <>
              <Lock aria-hidden="true" />
              {payLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export { MockCheckoutForm };
