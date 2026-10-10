"use client";

import * as React from "react";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ANONYMOUS_EXPLANATION } from "./types";

export interface AnonymousSwitchProps {
  /** Form field name; submits "on" when checked. */
  name?: string;
  defaultChecked?: boolean;
  label?: string;
  /** `switch` for the post form, `checkbox` for the compact reply form. */
  variant?: "switch" | "checkbox";
  className?: string;
  id?: string;
}

/**
 * "Post anonymously" control with the explanation members need before they
 * tick it: hidden from other members, still visible to moderators.
 */
function AnonymousSwitch({ name = "anonymous", defaultChecked = false, label = "Post anonymously", variant = "switch", className, id }: AnonymousSwitchProps) {
  const generated = React.useId();
  const controlId = id ?? `${generated}-anonymous`;
  const hintId = `${controlId}-hint`;
  const [checked, setChecked] = React.useState(defaultChecked);

  if (variant === "checkbox") {
    return (
      <div className={cn("flex items-start gap-2", className)}>
        <Checkbox id={controlId} name={name} value="on" checked={checked} onCheckedChange={(v) => setChecked(v === true)} aria-describedby={hintId} className="mt-0.5" />
        <div className="grid gap-0.5">
          <Label htmlFor={controlId} className="text-sm font-semibold">
            {label}
          </Label>
          <p id={hintId} className="text-xs text-muted-foreground">
            {ANONYMOUS_EXPLANATION}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start justify-between gap-4 rounded-lg border border-border bg-cream-2/50 p-4", className)}>
      <div className="grid gap-1">
        <Label htmlFor={controlId} className="text-sm font-semibold">
          <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
          {label}
        </Label>
        <p id={hintId} className="text-xs text-muted-foreground">
          {ANONYMOUS_EXPLANATION}.
        </p>
      </div>
      <Switch id={controlId} name={name} value="on" checked={checked} onCheckedChange={setChecked} aria-describedby={hintId} className="mt-0.5 shrink-0" />
    </div>
  );
}

export { AnonymousSwitch };
