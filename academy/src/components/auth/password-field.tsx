"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password";
import { passwordStrength } from "./logic";

export interface PasswordFieldProps {
  id: string;
  name?: string;
  label?: React.ReactNode;
  autoComplete: "current-password" | "new-password";
  error?: string;
  hint?: React.ReactNode;
  required?: boolean;
  /** Live strength meter + rule hint (sign-up, reset, change). */
  showStrength?: boolean;
  optionalText?: string;
  className?: string;
}

const METER_COLORS = ["bg-line", "bg-danger", "bg-warning", "bg-sage", "bg-sage-strong"] as const;

/** Password input with a show/hide toggle and an optional strength meter. */
function PasswordField({ id, name = "password", label = "Password", autoComplete, error, hint, required, showStrength = false, optionalText = "", className }: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState("");
  const strength = showStrength ? passwordStrength(value) : null;
  const meterId = `${id}-strength`;
  const defaultHint = showStrength ? `At least ${PASSWORD_MIN_LENGTH} characters with a letter and a number.` : undefined;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <FormField id={id} label={label} error={error} hint={hint ?? defaultHint} required={required} optionalText={optionalText}>
        <div className="relative">
          <Input
            type={visible ? "text" : "password"}
            name={name}
            autoComplete={autoComplete}
            required={required}
            className="pr-11"
            aria-describedby={showStrength ? meterId : undefined}
            onChange={showStrength ? (e) => setValue(e.target.value) : undefined}
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </FormField>
      {showStrength && strength ? (
        <div id={meterId} className="grid gap-1">
          <div className="grid grid-cols-4 gap-1" aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <span key={step} className={cn("h-1.5 rounded-full transition-colors", step <= strength.score ? METER_COLORS[strength.score] : "bg-line")} />
            ))}
          </div>
          <p className="min-h-4 text-xs text-muted-foreground" role="status" aria-live="polite">
            {strength.score === 0 ? "" : strength.problem ? `${strength.label} — ${strength.problem}` : `Password strength: ${strength.label}`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export { PasswordField };
