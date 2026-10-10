"use client";

import * as React from "react";
import { useActionState } from "react";
import { FormStack } from "@/components/ui/form-field";
import { toast } from "@/components/ui/toaster";
import { changePasswordAction } from "@/app/(learner)/account/logins/actions";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { PasswordField } from "@/components/auth/password-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";

/** Change password (requires the current one). Remounts on success so the fields clear. */
function PasswordChangeForm({ hasPassword }: { hasPassword: boolean }) {
  const [epoch, setEpoch] = React.useState(0);
  return <Inner key={epoch} hasPassword={hasPassword} onSaved={() => setEpoch((e) => e + 1)} />;
}

function Inner({ hasPassword, onSaved }: { hasPassword: boolean; onSaved: () => void }) {
  const [state, action] = useActionState(changePasswordAction, idleState);
  const errors = state.errors ?? {};
  React.useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message ?? "Password updated.");
      onSaved();
    }
  }, [state.status, state.message, onSaved]);

  if (!hasPassword) {
    return (
      <p className="text-sm text-muted-foreground">
        This account doesn’t have a password yet. Use <span className="font-semibold text-foreground">Forgot password</span> from the sign-in page to set one, or keep signing in with a magic link or Google.
      </p>
    );
  }
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormErrorSummary summary={state.summary} />
      <FormStack>
        <PasswordField id="pw-current" name="current" label="Current password" autoComplete="current-password" error={errors.current} required />
        <PasswordField id="pw-new" name="password" label="New password" autoComplete="new-password" error={errors.password} showStrength required />
        <PasswordField id="pw-confirm" name="confirm" label="Type the new password again" autoComplete="new-password" error={errors.confirm} required />
      </FormStack>
      <div>
        <SubmitButton pendingLabel="Updating…">Update password</SubmitButton>
      </div>
    </form>
  );
}

export { PasswordChangeForm };
