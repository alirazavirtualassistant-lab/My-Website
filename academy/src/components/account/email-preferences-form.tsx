"use client";

import * as React from "react";
import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toaster";
import { updateEmailPreferencesAction } from "@/app/(learner)/account/emails/actions";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";

export interface EmailPreferencesFormProps {
  preferences: { progress_nudges: boolean; drip_unlocks: boolean; newsletter: boolean; community: boolean };
}

const OPTIONS: Array<{ key: keyof EmailPreferencesFormProps["preferences"]; label: string; description: string }> = [
  { key: "drip_unlocks", label: "New module unlocked", description: "A short note the day a module opens, with a link straight to it." },
  { key: "progress_nudges", label: "Gentle progress nudges", description: "An occasional check-in when it's been a while. Never daily, never pushy." },
  { key: "community", label: "Community replies", description: "When someone replies to a post or comment of yours." },
  { key: "newsletter", label: "Letters from Cynthia", description: "News, new courses and the odd recipe. A few times a season." },
];

function EmailPreferencesForm({ preferences }: EmailPreferencesFormProps) {
  const [state, action] = useActionState(updateEmailPreferencesAction, idleState);
  React.useEffect(() => {
    if (state.stamp && state.message) toast.success(state.message);
  }, [state.stamp, state.message]);
  return (
    <form action={action} className="grid gap-6">
      <FormErrorSummary summary={state.summary} />
      <ul className="divide-y divide-border">
        {OPTIONS.map((opt) => (
          <li key={opt.key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <Label htmlFor={`pref-${opt.key}`} className="text-base font-semibold">
                {opt.label}
              </Label>
              <p id={`pref-${opt.key}-desc`} className="mt-1 text-sm text-muted-foreground">
                {opt.description}
              </p>
            </div>
            <Switch id={`pref-${opt.key}`} name={opt.key} value="on" defaultChecked={preferences[opt.key]} aria-describedby={`pref-${opt.key}-desc`} className="mt-1" />
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">Receipts, password and account emails always send — we need those to look after your account.</p>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Saving…">Save preferences</SubmitButton>
        {state.status === "success" ? (
          <p role="status" className="text-sm text-sage-strong">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export { EmailPreferencesForm };
