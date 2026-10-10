"use client";

import * as React from "react";
import { useActionState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";
import { demoGoogleAction } from "@/app/(auth)/actions";
import { AuthCard, OrDivider } from "./auth-card";
import { FormErrorSummary } from "./form-error-summary";
import { SubmitButton } from "./submit-button";
import { idleState } from "./types";

export interface DemoGoogleAccount {
  email: string;
  name: string;
  role: string;
  description: string;
}

/** Demo-only stand-in for Google's account chooser. The chosen email is the OAuth "code". */
function DemoGooglePicker({ accounts, next }: { accounts: DemoGoogleAccount[]; next: string }) {
  const [state, action, pending] = useActionState(demoGoogleAction, idleState);
  const errors = state.errors ?? {};
  return (
    <AuthCard eyebrow="Demo mode" title="Choose an account" description="This stands in for Google's account picker. Nothing leaves this demo.">
      <form action={action} noValidate className="grid gap-5" aria-busy={pending}>
        <input type="hidden" name="next" value={next} />
        <FormErrorSummary summary={state.summary} />
        <ul className="divide-y divide-border rounded-lg border border-border bg-card" aria-label="Demo accounts">
          {accounts.map((account) => (
            <li key={account.email}>
              <button
                type="submit"
                name="email"
                value={account.email}
                disabled={pending}
                className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60 first:rounded-t-lg last:rounded-b-lg"
              >
                <Avatar className="size-9">
                  <AvatarFallback>{initials(account.name)}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{account.name}</span>
                    <Badge variant="muted" className="capitalize">
                      {account.role}
                    </Badge>
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{account.email}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <OrDivider label="or use another email" />
        <FormField id="dg-email" label="Email" error={errors.email} hint="A new learner account is created on the spot." optionalText="">
          <Input type="email" name="email_custom" autoComplete="email" inputMode="email" maxLength={254} placeholder="you@example.com" />
        </FormField>
        <SubmitButton size="lg" className="w-full" pendingLabel="Signing you in…">
          Continue
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export { DemoGooglePicker };
