"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { AdminAction } from "./form-state";
import { useAdminAction } from "./use-admin-action";

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
  const [, formAction, pending] = useAdminAction(action, { onSuccess: () => onDone?.() });
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
