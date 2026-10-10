"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { magicLinkAction, resendVerificationAction, signInAction } from "@/app/(auth)/actions";
import { AuthCard, OrDivider } from "./auth-card";
import { DemoMailboxNote } from "./demo-mailbox-note";
import { FormErrorSummary } from "./form-error-summary";
import { GoogleButton } from "./google-button";
import { Honeypot } from "./honeypot";
import { MagicLinkSent } from "./magic-link-sent";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

export interface SignInFormProps {
  next: string;
  demoMailbox: boolean;
  /** One-line notice from the query string (e.g. a link that did not work). */
  notice?: { tone: "info" | "warning" | "success"; title: string; body?: string } | null;
  /** Pre-fill the email (e.g. after a reset). */
  email?: string;
}

type Mode = "password" | "magic";

function SignInForm({ next, demoMailbox, notice, email }: SignInFormProps) {
  const [mode, setMode] = React.useState<Mode>("password");
  const [epoch, setEpoch] = React.useState(0);
  const signUpHref = `/sign-up${next !== "/learn" ? `?next=${encodeURIComponent(next)}` : ""}`;
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in"
      description="Pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link href={signUpHref} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {notice ? (
        <Alert variant={notice.tone} className="mb-5">
          <AlertTitle>{notice.title}</AlertTitle>
          {notice.body ? <AlertDescription>{notice.body}</AlertDescription> : null}
        </Alert>
      ) : null}
      <GoogleButton next={next} />
      <OrDivider />
      <div key={epoch}>
        {mode === "password" ? (
          <PasswordSignIn next={next} demoMailbox={demoMailbox} email={email} onSwitch={() => setMode("magic")} />
        ) : (
          <MagicSignIn next={next} demoMailbox={demoMailbox} email={email} onSwitch={() => setMode("password")} onReset={() => setEpoch((e) => e + 1)} />
        )}
      </div>
    </AuthCard>
  );
}

function ResendVerification({ email }: { email: string }) {
  const [state, action, pending] = useActionState(resendVerificationAction, idleState);
  if (state.status === "sent") {
    return (
      <p role="status" className="text-xs text-sage-strong">
        Sent. Check your inbox for a fresh verification link.
      </p>
    );
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="email" value={email} />
      <Button type="submit" size="sm" variant="outline" loading={pending}>
        Resend verification email
      </Button>
      {state.status === "error" ? (
        <span role="alert" className="text-xs text-danger">
          {state.errors?.form}
        </span>
      ) : null}
    </form>
  );
}

function PasswordSignIn({ next, demoMailbox, email, onSwitch }: { next: string; demoMailbox: boolean; email?: string; onSwitch: () => void }) {
  const [state, action] = useActionState(signInAction, idleState);
  const errors = state.errors ?? {};
  const forgotHref = "/forgot-password";
  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Honeypot />
      <FormErrorSummary summary={state.summary} />
      {state.code === "rate_limited" ? (
        <p className="-mt-2 text-sm text-muted-foreground">
          While you wait, you can{" "}
          <Button type="button" variant="link" onClick={onSwitch}>
            sign in with a magic link
          </Button>{" "}
          instead.
        </p>
      ) : null}
      <FormStack>
        <FormField id="si-email" label="Email" error={errors.email} required>
          <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} defaultValue={email ?? state.email ?? ""} />
        </FormField>
        {state.code === "unverified" && (state.email || email) ? <ResendVerification email={state.email ?? email ?? ""} /> : null}
        <PasswordField
          id="si-password"
          autoComplete="current-password"
          error={errors.password}
          required
          hint={
            <Link href={forgotHref} className="font-semibold text-rose-strong underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          }
        />
      </FormStack>
      <div className="flex items-center gap-2.5">
        <Checkbox id="si-remember" name="remember" defaultChecked />
        <Label htmlFor="si-remember" className="font-normal">
          Keep me signed in for 30 days
        </Label>
      </div>
      <SubmitButton size="lg" className="w-full" pendingLabel="Signing you in…">
        Sign in
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        No password handy?{" "}
        <Button type="button" variant="link" onClick={onSwitch}>
          Email me a magic link
        </Button>
      </p>
      <DemoMailboxNote show={demoMailbox} />
    </form>
  );
}

function MagicSignIn({ next, demoMailbox, email, onSwitch, onReset }: { next: string; demoMailbox: boolean; email?: string; onSwitch: () => void; onReset: () => void }) {
  const [state, action] = useActionState(magicLinkAction, idleState);
  const errors = state.errors ?? {};
  if (state.status === "sent") return <MagicLinkSent email={state.email} demoMailbox={demoMailbox} onChangeEmail={onReset} />;
  return (
    <form action={action} noValidate className="grid gap-5">
      <input type="hidden" name="next" value={next} />
      <Honeypot />
      <FormErrorSummary summary={state.summary} />
      <FormField id="si-magic-email" label="Email" error={errors.email} required hint="We'll email you a one-time sign-in link.">
        <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} defaultValue={email ?? ""} />
      </FormField>
      <DemoMailboxNote show={demoMailbox} what="Magic links" />
      <SubmitButton size="lg" className="w-full" pendingLabel="Sending your link…">
        Email me a magic link
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        <Button type="button" variant="link" onClick={onSwitch}>
          Use a password instead
        </Button>
      </p>
    </form>
  );
}

export { SignInForm };
