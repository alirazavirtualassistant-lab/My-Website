"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";

export interface NewsletterState {
  ok: boolean;
  message: string | null;
  error: string | null;
}

export const initialNewsletterState: NewsletterState = { ok: false, message: null, error: null };

export interface NewsletterFormProps extends Omit<React.ComponentProps<"div">, "children"> {
  action: (prev: NewsletterState, formData: FormData) => Promise<NewsletterState>;
  source?: string;
}

/** Email capture with inline validation, pending state and a success message. */
function NewsletterForm({ action, source = "home", className, ...props }: NewsletterFormProps) {
  const [state, formAction] = useActionState(action, initialNewsletterState);
  const errorId = state.error ? "newsletter-error" : undefined;

  if (state.ok) {
    return (
      <div data-slot="newsletter-form" role="status" className={cn("flex items-start gap-3 rounded-lg border border-sage/40 bg-sage-soft/70 p-4 text-sm", className)} {...props}>
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-sage-strong" aria-hidden="true" />
        <p className="text-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <div data-slot="newsletter-form" className={className} {...props}>
      <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end" noValidate>
        <input type="hidden" name="source" value={source} />
        <div className="grid gap-1.5">
          <Label htmlFor="newsletter-email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="pl-9"
              aria-invalid={state.error ? true : undefined}
              aria-describedby={[errorId, "newsletter-hint"].filter(Boolean).join(" ")}
            />
          </div>
        </div>
        <SubmitButton size="md" pendingText="Joining…" className="sm:h-10">
          Join the list
        </SubmitButton>
        {state.error ? (
          <p id="newsletter-error" role="alert" className="text-xs font-medium text-danger sm:col-span-2">
            {state.error}
          </p>
        ) : null}
        <p id="newsletter-hint" className="text-xs text-muted-foreground sm:col-span-2">
          Occasional notes from Cynthia and news about new courses. Unsubscribe any time; we never share your address.
        </p>
      </form>
    </div>
  );
}

export { NewsletterForm };
