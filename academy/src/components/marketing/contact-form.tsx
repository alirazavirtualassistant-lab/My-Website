"use client";

import * as React from "react";
import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "./submit-button";

export interface ContactState {
  ok: boolean;
  message: string | null;
  errors: Partial<Record<"name" | "email" | "message" | "form", string>>;
  values: { name: string; email: string; message: string };
}

export const initialContactState: ContactState = { ok: false, message: null, errors: {}, values: { name: "", email: "", message: "" } };

export interface ContactFormProps {
  action: (prev: ContactState, formData: FormData) => Promise<ContactState>;
}

/** Name / email / message with inline errors, honeypot and a success state. */
function ContactForm({ action }: ContactFormProps) {
  const [state, formAction] = useActionState(action, initialContactState);

  if (state.ok) {
    return (
      <div role="status" className="card-soft flex items-start gap-3 p-6">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-sage-strong" aria-hidden="true" />
        <div>
          <p className="font-serif text-2xl font-medium">Thank you, your message is on its way.</p>
          <p className="mt-1 text-muted-foreground">{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="card-soft p-6 sm:p-8" noValidate>
      <FormStack>
        {state.errors.form ? (
          <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {state.errors.form}
          </p>
        ) : null}
        <FormField id="contact-name" label="Your name" required error={state.errors.name}>
          <Input name="name" autoComplete="name" defaultValue={state.values.name} maxLength={80} />
        </FormField>
        <FormField id="contact-email" label="Email" required hint="So we can reply to you." error={state.errors.email}>
          <Input name="email" type="email" inputMode="email" autoComplete="email" defaultValue={state.values.email} maxLength={254} />
        </FormField>
        <FormField id="contact-message" label="Message" required hint="Questions about the course, your account or anything else. We read every one." error={state.errors.message}>
          <Textarea name="message" rows={6} defaultValue={state.values.message} maxLength={4000} />
        </FormField>
        {/* Honeypot: hidden from people, tempting for bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">We usually reply within two working days.</p>
          <SubmitButton size="lg" pendingText="Sending…">
            Send message
          </SubmitButton>
        </div>
      </FormStack>
    </form>
  );
}

export { ContactForm };
