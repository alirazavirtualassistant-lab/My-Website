import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps {
  /** id of the control; the label, hint and error ids are derived from it. */
  id: string;
  label: React.ReactNode;
  /** Visually hides the label (still announced). */
  hideLabel?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optionalText?: string;
  className?: string;
  /** A single form control. It receives id, aria-describedby, aria-invalid and aria-required. */
  children: React.ReactElement;
}

/**
 * Label + control + hint + error with the aria wiring done for you.
 *
 * <FormField id="email" label="Email" hint="We never share it." error={errors.email}>
 *   <Input type="email" name="email" />
 * </FormField>
 */
function FormField({ id, label, hideLabel, hint, error, required, optionalText = "Optional", className, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const child = children as React.ReactElement<Record<string, unknown>>;
  const control = React.cloneElement(child, {
    id,
    "aria-describedby": [child.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
    "aria-invalid": error ? true : child.props["aria-invalid"],
    "aria-required": required || undefined,
  });
  return (
    <div data-slot="form-field" className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id} className={cn(hideLabel && "sr-only")}>
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="text-rose-strong">
            *
          </span>
        ) : optionalText ? (
          <span className="ml-auto text-xs font-normal text-muted-foreground">{optionalText}</span>
        ) : null}
      </Label>
      {control}
      {hint ? (
        <p id={hintId} data-slot="form-hint" className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} data-slot="form-error" role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Small helper for a horizontal row of fields. */
function FormRow({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-row" className={cn("grid gap-4 sm:grid-cols-2", className)} {...props} />;
}

/** Vertical stack of fields. */
function FormStack({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="form-stack" className={cn("grid gap-5", className)} {...props} />;
}

export { FormField, FormRow, FormStack };
