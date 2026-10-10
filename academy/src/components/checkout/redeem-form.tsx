"use client";

import * as React from "react";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { idleActionState, type SimpleActionState } from "./types";

export interface RedeemFormProps {
  action: (prev: SimpleActionState, formData: FormData) => Promise<SimpleActionState>;
  token: string;
  label: string;
  pendingLabel: string;
  icon?: React.ReactNode;
  className?: string;
}

/** One-button form (redeem a gift / accept a partner invite) with inline error + pending state. */
function RedeemForm({ action, token, label, pendingLabel, icon, className }: RedeemFormProps) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  return (
    <form action={formAction} className={className} aria-busy={pending || undefined}>
      <input type="hidden" name="token" value={token} />
      {state.status === "error" ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>That didn't work</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
        {pending ? pendingLabel : (
          <>
            {icon}
            {label}
          </>
        )}
      </Button>
    </form>
  );
}

export { RedeemForm };
