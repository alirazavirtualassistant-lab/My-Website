"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Submit button that shows a spinner while its parent form is pending. The
 * visible label never changes (no layout shift); `pendingLabel` is announced
 * to screen readers only.
 */
function SubmitButton({ children, pendingLabel, ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" loading={pending} {...props}>
        {children}
      </Button>
      {pendingLabel ? (
        <span className="sr-only" role="status" aria-live="polite">
          {pending ? pendingLabel : ""}
        </span>
      ) : null}
    </>
  );
}

export { SubmitButton };
