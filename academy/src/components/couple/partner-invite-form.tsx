"use client";

import * as React from "react";
import { useActionState } from "react";
import { Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { idleCoupleState, type CoupleFormState } from "./types";

export interface PartnerInviteFormProps {
  action: (prev: CoupleFormState, formData: FormData) => Promise<CoupleFormState>;
  courseSlug: string;
  /** Pre-fill (re-sending / changing a pending invite). */
  defaultEmail?: string;
  submitLabel?: string;
  pendingLabel?: string;
  className?: string;
}

/** Email + send button for the partner seat. Errors from the use case show inline. */
function PartnerInviteForm({ action, courseSlug, defaultEmail = "", submitLabel = "Send invitation", pendingLabel = "Sending…", className }: PartnerInviteFormProps) {
  const [state, formAction, pending] = useActionState(action, idleCoupleState);
  const id = React.useId();
  return (
    <form action={formAction} noValidate className={className} aria-busy={pending || undefined}>
      <input type="hidden" name="course" value={courseSlug} />
      {state.status === "error" && state.errors?.form ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>We couldn’t send that</AlertTitle>
          <AlertDescription>
            <p>{state.errors.form}</p>
          </AlertDescription>
        </Alert>
      ) : null}
      {state.status === "success" ? (
        <Alert variant="success" className="mb-4">
          <AlertTitle>Invitation sent</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <FormField id={`${id}-email`} label="Your partner's email" required error={state.errors?.email} className="flex-1" hint="They get an email with a link; the seat is theirs once they accept.">
          <Input name="email" type="email" inputMode="email" autoComplete="off" defaultValue={defaultEmail} maxLength={254} />
        </FormField>
        <Button type="submit" loading={pending} className="sm:mb-6">
          {pending ? pendingLabel : (
            <>
              <Send aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export { PartnerInviteForm };
