"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { FormStack } from "@/components/ui/form-field";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { AuthCard } from "./auth-card";
import { FormErrorSummary } from "./form-error-summary";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

export interface ResetPasswordFormProps {
  token: string;
  /** Passwordless account created by checkout / gift / partner invite. */
  welcome: boolean;
}

function ResetPasswordForm({ token, welcome }: ResetPasswordFormProps) {
  const [state, action] = useActionState(resetPasswordAction, idleState);
  const errors = state.errors ?? {};
  return (
    <AuthCard
      eyebrow={welcome ? "Welcome" : "Almost there"}
      title={welcome ? "Choose your password" : "Choose a new password"}
      description={
        welcome
          ? "Your account is ready — this just sets a password so you can sign in whenever you like."
          : "Pick something memorable. You'll be signed in as soon as it's saved."
      }
      footer={
        <>
          Link not working?{" "}
          <Link href="/forgot-password" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
            Request a new one
          </Link>
        </>
      }
    >
      <form action={action} noValidate className="grid gap-5">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="welcome" value={welcome ? "1" : ""} />
        <FormErrorSummary summary={state.summary} />
        <FormStack>
          <PasswordField id="rp-password" label={welcome ? "Password" : "New password"} autoComplete="new-password" error={errors.password} showStrength required />
          <PasswordField id="rp-confirm" name="confirm" label="Type it again" autoComplete="new-password" error={errors.confirm} required />
        </FormStack>
        <SubmitButton size="lg" className="w-full" pendingLabel="Saving…">
          {welcome ? "Save password and continue" : "Save new password"}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export { ResetPasswordForm };
