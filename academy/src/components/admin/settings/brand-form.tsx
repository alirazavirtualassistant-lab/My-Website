"use client";

import * as React from "react";
import { FormField, FormRow, FormStack } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import type { SiteSettings } from "@/lib/types";
import { saveBrandAction } from "@/app/admin/(panel)/settings/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

const TOGGLES: Array<{ key: "abandoned_cart_emails" | "weekly_nudges" | "testimonials_enabled"; label: string; help: string }> = [
  { key: "abandoned_cart_emails", label: "Abandoned-cart reminders", help: "One gentle email a day after someone leaves checkout without paying." },
  { key: "weekly_nudges", label: "Weekly progress nudges", help: "A short check-in for learners who have been away a week or more (only if they opted in)." },
  { key: "testimonials_enabled", label: "Show testimonials on the public site", help: "Approved testimonials appear on the home and course pages." },
];

function BrandForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useAdminAction(saveBrandAction, { toastError: false });
  const errors = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-6">
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
      <FormStack>
        <FormRow>
          <FormField id="site-name" label="Site name" required error={errors.site_name} hint="Browser titles, emails and the footer.">
            <Input name="site_name" defaultValue={settings.site_name} maxLength={80} required />
          </FormField>
          <FormField id="support-email" label="Support email" required error={errors.support_email} hint="Shown on contact, checkout and receipts.">
            <Input name="support_email" type="email" defaultValue={settings.support_email} required />
          </FormField>
        </FormRow>
        <FormField id="disclaimer-text" label="Medical disclaimer" required error={errors.disclaimer_text} hint="Shown on course pages, checkout, the footer, and before the first lesson plays. [LEGAL REVIEW NEEDED]">
          <Textarea name="disclaimer_text" defaultValue={settings.disclaimer_text} rows={4} maxLength={2000} required />
        </FormField>
      </FormStack>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {TOGGLES.map((t) => (
          <li key={t.key} className="flex items-start justify-between gap-4 p-4">
            <div className="min-w-0">
              <Label htmlFor={`toggle-${t.key}`} className="text-base font-semibold">
                {t.label}
              </Label>
              <p id={`toggle-${t.key}-help`} className="mt-1 text-sm text-muted-foreground">
                {t.help}
              </p>
            </div>
            <Switch id={`toggle-${t.key}`} name={t.key} value="on" defaultChecked={settings[t.key]} aria-describedby={`toggle-${t.key}-help`} className="mt-1" />
          </li>
        ))}
      </ul>
      <div>
        <SubmitButton pendingLabel="Saving…">Save settings</SubmitButton>
      </div>
    </form>
  );
}

export { BrandForm };
