"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

export interface SubmitButtonProps extends Omit<ButtonProps, "type" | "loading"> {
  /** Label while the form is submitting (defaults to the normal label). */
  pendingText?: React.ReactNode;
}

/** A submit button that shows a spinner while its parent <form action> is pending. */
function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}

export { SubmitButton };
