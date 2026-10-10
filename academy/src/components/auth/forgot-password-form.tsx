"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/app/(auth)/actions";
import { AuthCard } from "./auth-card";
import { DemoMailboxNote } from "./demo-mailbox-note";
import { FormErrorSummary } from "./form-error-summary";
import { Honeypot } from "./honeypot";
import { MagicLinkSent } from "./magic-link-sent";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

function ForgotPasswordForm({ demoMailbox }: { demoMailbox: boolean }) {
  const [state, action] = useActionState(forgotPasswordAction, idleState);
  const errors = state.errors ?? {};
  return (
    <AuthCard
      eyebrow="No worries"
      title="Reset your password"
      description="Tell us your email and we'll send a link to choose a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/sign-in" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {state.status === "sent" ? (
        <MagicLinkSent
          email={state.email}
          title="If that email has an account, a link is on its way"
          body={
            <>
              We sent reset instructions to <span className="font-semibold break-all">{state.email}</span> if an account exists. The link expires in about an hour. Nothing arrived? Check spam, or try the address you used at checkout.
            </>
          }
          demoMailbox={demoMailbox}
        />
      ) : (
        <form action={action} noValidate className="grid gap-5">
          <Honeypot />
          <FormErrorSummary summary={state.summary} />
          <FormField id="fp-email" label="Email" error={errors.email} required>
            <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} />
          </FormField>
          <DemoMailboxNote show={demoMailbox} what="Reset emails" />
          <SubmitButton size="lg" className="w-full" pendingLabel="Sending…">
            Send reset link
          </SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}

export { ForgotPasswordForm };
