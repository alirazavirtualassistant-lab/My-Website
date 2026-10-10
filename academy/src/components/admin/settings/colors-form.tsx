"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { saveColorsAction } from "@/app/admin/(panel)/settings/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

const EXAMPLE = `{
  "rose": "#b5656b",
  "rose-strong": "#9a4f56",
  "gold": "#d9b36c",
  "sage": "#8fa88a"
}`;

function ColorsForm({ colors }: { colors: Record<string, string> | null }) {
  const [state, action] = useAdminAction(saveColorsAction, { toastError: false });
  const errors = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-5">
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
      <FormField id="colors-json" label="Token overrides (JSON)" hint={`Stored for a future theme switch; the live site keeps the built-in palette for now. Token names match globals.css (rose, rose-strong, gold, sage, cream…). Example:\n${EXAMPLE}`} error={errors.colors} optionalText="">
        <Textarea name="colors" defaultValue={colors ? JSON.stringify(colors, null, 2) : ""} rows={6} className="font-mono text-xs" placeholder={EXAMPLE} spellCheck={false} />
      </FormField>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton variant="outline" pendingLabel="Saving…">
          Save colours
        </SubmitButton>
        {colors ? (
          <ul className="flex flex-wrap gap-2" aria-label="Stored colours">
            {Object.entries(colors).map(([k, v]) => (
              <li key={k} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-xs">
                <span aria-hidden="true" className="size-3 rounded-full border border-border" style={{ background: v }} />
                <span className="font-mono">{k}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </form>
  );
}

export { ColorsForm };
