"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { magicLinkAction, signUpAction } from "@/app/(auth)/actions";
import { AuthCard, OrDivider } from "./auth-card";
import { DemoMailboxNote } from "./demo-mailbox-note";
import { FormErrorSummary } from "./form-error-summary";
import { GoogleButton } from "./google-button";
import { Honeypot } from "./honeypot";
import { MagicLinkSent } from "./magic-link-sent";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

export interface SignUpFormProps {
  next: string;
  demoMailbox: boolean;
}

type Mode = "password" | "magic";

function SignUpForm({ next, demoMailbox }: SignUpFormProps) {
  const [mode, setMode] = React.useState<Mode>("password");
  // Bumping the key remounts the forms, which resets both action states.
  const [epoch, setEpoch] = React.useState(0);
  const signInHref = `/sign-in${next !== "/learn" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <AuthCard
      eyebrow="Welcome"
      title="Create your account"
      description="Small steps start here. Pick a password or let us email you a sign-in link."
      footer={
        <>
          Already have an account?{" "}
          <Link href={signInHref} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton next={next} />
      <OrDivider />
      <div key={epoch}>
        {mode === "password" ? (
          <PasswordSignUp next={next} demoMailbox={demoMailbox} onSwitch={() => setMode("magic")} />
        ) : (
          <MagicSignUp
            next={next}
            demoMailbox={demoMailbox}
            onSwitch={() => setMode("password")}
            onReset={() => {
              setEpoch((e) => e + 1);
            }}
          />
        )}
      </div>
    </AuthCard>
  );
}

function ConsentLabel() {
  return (
    <>
      I agree to the{" "}
      <Link href="/terms" className="font-semibold text-rose-strong underline-offset-4 hover:underline" target="_blank" rel="noopener">
        terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className="font-semibold text-rose-strong underline-offset-4 hover:underline" target="_blank" rel="noopener">
        privacy policy
      </Link>
      .
    </>
  );
}

function PasswordSignUp({ next, demoMailbox, onSwitch }: { next: string; demoMailbox: boolean; onSwitch: () => void }) {
  const [state, action] = useActionState(signUpAction, idleState);
  const errors = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Honeypot />
      <FormErrorSummary summary={state.summary} />
      <FormStack>
        <FormField id="su-name" label="Your name" error={errors.name} required>
          <Input name="name" autoComplete="name" required maxLength={80} />
        </FormField>
        <FormField id="su-email" label="Email" error={errors.email} required hint={state.code === "email_taken" ? <Link href={`/sign-in?next=${encodeURIComponent(next)}`} className="font-semibold text-rose-strong underline underline-offset-4">Sign in instead</Link> : undefined}>
          <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} />
        </FormField>
        <PasswordField id="su-password" autoComplete="new-password" error={errors.password} showStrength required />
      </FormStack>

      <div className="grid gap-3">
        <div className="flex items-center gap-2.5">
          <Checkbox id="su-remember" name="remember" defaultChecked />
          <Label htmlFor="su-remember" className="font-normal">
            Keep me signed in for 30 days
          </Label>
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox id="su-consent" name="consent" className="mt-0.5" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "su-consent-error" : undefined} />
            <Label htmlFor="su-consent" className="inline font-normal leading-snug">
              <span>
                <ConsentLabel />
              </span>
            </Label>
          </div>
          {errors.consent ? (
            <p id="su-consent-error" role="alert" className="text-xs font-medium text-danger">
              {errors.consent}
            </p>
          ) : null}
        </div>
      </div>

      <DemoMailboxNote show={demoMailbox} what="Verification emails" />

      <SubmitButton size="lg" className="w-full" pendingLabel="Creating your account…">
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Prefer no password?{" "}
        <Button type="button" variant="link" onClick={onSwitch}>
          Email me a magic link
        </Button>
      </p>
    </form>
  );
}

function MagicSignUp({ next, demoMailbox, onSwitch, onReset }: { next: string; demoMailbox: boolean; onSwitch: () => void; onReset: () => void }) {
  const [state, action] = useActionState(magicLinkAction, idleState);
  const errors = state.errors ?? {};
  if (state.status === "sent") {
    return <MagicLinkSent email={state.email} demoMailbox={demoMailbox} onChangeEmail={onReset} />;
  }
  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Honeypot />
      <FormErrorSummary summary={state.summary} />
      <FormField id="su-magic-email" label="Email" error={errors.email} required hint="We'll email you a one-time link. No password needed.">
        <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} />
      </FormField>
      <p className="text-xs text-muted-foreground">
        By continuing you agree to the{" "}
        <Link href="/terms" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
          privacy policy
        </Link>
        .
      </p>
      <DemoMailboxNote show={demoMailbox} what="Magic links" />
      <SubmitButton size="lg" className="w-full" pendingLabel="Sending your link…">
        Email me a magic link
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Changed your mind?{" "}
        <Button type="button" variant="link" onClick={onSwitch}>
          Use a password instead
        </Button>
      </p>
    </form>
  );
}

export { SignUpForm };
