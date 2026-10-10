"use client";

import * as React from "react";
import { useActionState } from "react";
import { FormField, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { adminRegisterAction } from "@/app/admin/register/actions";
import { FormErrorSummary } from "./form-error-summary";
import { Honeypot } from "./honeypot";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

function AdminRegisterForm() {
  const [state, action] = useActionState(adminRegisterAction, idleState);
  const errors = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      <Honeypot />
      <FormErrorSummary summary={state.summary} />
      <FormStack>
        <FormField id="ar-name" label="Your name" error={errors.name} required>
          <Input name="name" autoComplete="name" required maxLength={80} />
        </FormField>
        <FormField id="ar-email" label="Email" error={errors.email} required>
          <Input type="email" name="email" autoComplete="email" inputMode="email" required maxLength={254} />
        </FormField>
        <PasswordField id="ar-password" autoComplete="new-password" error={errors.password} showStrength required />
        <FormField id="ar-code" label="Setup code" error={errors.setupCode} required hint="The ADMIN_SETUP_CODE value from your environment.">
          <Input name="setupCode" autoComplete="one-time-code" required maxLength={200} spellCheck={false} />
        </FormField>
      </FormStack>
      <SubmitButton size="lg" className="w-full" pendingLabel="Creating your admin account…">
        Create admin account
      </SubmitButton>
    </form>
  );
}

export { AdminRegisterForm };
