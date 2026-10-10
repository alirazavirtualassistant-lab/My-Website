"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { CircleCheck, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { resendVerificationAction, verifyEmailAction } from "@/app/(auth)/actions";
import { AuthCard } from "./auth-card";
import { DemoMailboxNote } from "./demo-mailbox-note";
import { FormErrorSummary } from "./form-error-summary";
import { MagicLinkSent } from "./magic-link-sent";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

export interface VerifyEmailPanelProps {
  token: string | null;
  next: string;
  /** Email we already know (session or ?email=). */
  knownEmail: string | null;
  signedIn: boolean;
  demoMailbox: boolean;
}

/** Resend form: hidden email when known, otherwise asks for it. */
function ResendForm({ knownEmail, demoMailbox }: { knownEmail: string | null; demoMailbox: boolean }) {
  const [state, action] = useActionState(resendVerificationAction, idleState);
  const errors = state.errors ?? {};
  if (state.status === "sent") {
    return <MagicLinkSent email={state.email} title="A fresh link is on its way" demoMailbox={demoMailbox} />;
  }
  return (
    <form action={action} noValidate className="grid gap-4">
      <FormErrorSummary summary={state.summary} />
      {knownEmail ? (
        <input type="hidden" name="email" value={knownEmail} />
      ) : (
        <FormField id="ve-email" label="Email" error={errors.email} required>
          <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} />
        </FormField>
      )}
      <SubmitButton variant="outline" size="lg" className="w-full sm:w-auto" pendingLabel="Sending…">
        Resend verification email
      </SubmitButton>
    </form>
  );
}

/** With a token: verifies automatically on load (button fallback without JS). */
function VerifyRunner({ token, next, demoMailbox }: { token: string; next: string; demoMailbox: boolean }) {
  const [state, action, pending] = useActionState(verifyEmailAction, idleState);
  const started = React.useRef(false);
  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const data = new FormData();
    data.set("token", token);
    React.startTransition(() => action(data));
  }, [action, token]);

  if (state.status === "success") {
    return (
      <div role="status" aria-live="polite" className="grid gap-5">
        <div className="flex items-start gap-3 rounded-lg border border-sage/40 bg-sage-soft/70 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong" aria-hidden="true">
            <CircleCheck className="size-5" />
          </span>
          <div>
            <p className="font-serif text-xl leading-tight font-medium">You’re verified</p>
            <p className="mt-1 text-sm text-foreground/90">Thank you{state.email ? `, ${state.email}` : ""}. Everything is set — let’s take the first step.</p>
          </div>
        </div>
        <Button asChild size="lg" className="w-full">
          <Link href={next}>Continue</Link>
        </Button>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="grid gap-5">
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning-soft p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-warning" aria-hidden="true">
            <MailWarning className="size-5" />
          </span>
          <div>
            <p className="font-serif text-xl leading-tight font-medium text-foreground">That link didn’t work</p>
            <p className="mt-1 text-sm text-foreground/90">{state.errors?.form ?? "It may have expired or already been used. We can send you a fresh one."}</p>
          </div>
        </div>
        <ResendForm knownEmail={state.email ?? null} demoMailbox={demoMailbox} />
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4" aria-busy={pending}>
      <input type="hidden" name="token" value={token} />
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
        {pending ? "Verifying your email…" : "Confirm this is your email address."}
      </p>
      <SubmitButton size="lg" className="w-full" pendingLabel="Verifying…">
        Confirm my email
      </SubmitButton>
    </form>
  );
}

function VerifyEmailPanel({ token, next, knownEmail, signedIn, demoMailbox }: VerifyEmailPanelProps) {
  if (token) {
    return (
      <AuthCard eyebrow="One small step" title="Verifying your email">
        <VerifyRunner token={token} next={next} demoMailbox={demoMailbox} />
      </AuthCard>
    );
  }
  return (
    <AuthCard
      eyebrow="One small step"
      title="Check your inbox"
      description={
        knownEmail ? (
          <>
            We sent a verification link to <span className="font-semibold break-all text-foreground">{knownEmail}</span>. Open it to confirm your email.
          </>
        ) : (
          "We sent you a verification link. Open it to confirm your email address."
        )
      }
      footer={
        signedIn ? (
          <>
            You can keep going and verify later.{" "}
            <Link href={next} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
              Continue to My Learning
            </Link>
          </>
        ) : (
          <>
            Already verified?{" "}
            <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
              Sign in
            </Link>
          </>
        )
      }
    >
      <div className="grid gap-5">
        <DemoMailboxNote show={demoMailbox} what="Verification emails" />
        <p className="text-sm text-muted-foreground">Nothing arrived after a minute or two? Check your spam folder, or ask for a new link.</p>
        <ResendForm knownEmail={knownEmail} demoMailbox={demoMailbox} />
      </div>
    </AuthCard>
  );
}

export { VerifyEmailPanel };
