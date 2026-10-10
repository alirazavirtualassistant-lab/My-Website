"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { idleState } from "@/components/auth/types";
import { messageOf, type AdminAction } from "./form-state";

export interface ActionButtonProps extends Omit<ButtonProps, "type" | "formAction"> {
  action: AdminAction;
  /** Hidden fields posted with the action. */
  fields: Record<string, string>;
  /** Spoken while pending, e.g. "Revoking…". */
  pendingLabel?: string;
  /** Called after a successful result (e.g. to close a menu). */
  onDone?: () => void;
  formClassName?: string;
}

/**
 * A single-purpose button: posts its hidden fields to a Server Action and
 * toasts the result. Stays a real <form>, so it works before hydration and
 * is keyboard/screen-reader friendly without any extra wiring.
 */
function ActionButton({ action, fields, pendingLabel, onDone, formClassName, children, ...buttonProps }: ActionButtonProps) {
  const [state, formAction, pending] = useActionState(action, idleState);
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;
  React.useEffect(() => {
    if (!state.stamp) return;
    const message = messageOf(state);
    if (state.status === "error") toast.error(message ?? "Something went wrong.");
    else {
      if (message) toast.success(message);
      onDoneRef.current?.();
    }
  }, [state]);
  return (
    <form action={formAction} className={formClassName ?? "inline-flex"}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" loading={pending} {...buttonProps}>
        {children}
      </Button>
      {pendingLabel ? (
        <span className="sr-only" role="status" aria-live="polite">
          {pending ? pendingLabel : ""}
        </span>
      ) : null}
    </form>
  );
}

export { ActionButton };
