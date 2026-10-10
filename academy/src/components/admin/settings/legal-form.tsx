"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { saveLegalAction } from "@/app/admin/(panel)/settings/actions";
import { useAdminAction } from "@/components/admin/students/use-admin-action";

export interface LegalFormProps {
  pages: ReadonlyArray<{ key: string; label: string; href: string }>;
  values: Record<string, string>;
}

function LegalForm({ pages, values }: LegalFormProps) {
  const [state, action] = useAdminAction(saveLegalAction, { toastError: false });
  const errors = state.errors ?? {};
  return (
    <form action={action} noValidate className="grid gap-6">
      <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
      {pages.map((p) => (
        <FormField
          key={p.key}
          id={`legal-${p.key}`}
          label={
            <span className="inline-flex flex-wrap items-center gap-2">
              {p.label}
              <span className="rounded-sm border border-warning/50 bg-warning-soft px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-warning">[LEGAL REVIEW NEEDED]</span>
              <Link href={p.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-normal text-rose-strong underline-offset-4 hover:underline">
                View page <ExternalLink className="size-3" aria-hidden="true" />
              </Link>
            </span>
          }
          hint="Markdown. Headings, lists, bold and links are supported; raw HTML is shown as text."
          error={errors[p.key]}
          optionalText=""
        >
          <Textarea name={p.key} defaultValue={values[p.key] ?? ""} rows={10} className="font-mono text-xs leading-relaxed" />
        </FormField>
      ))}
      <div>
        <SubmitButton pendingLabel="Saving…">Save legal pages</SubmitButton>
      </div>
    </form>
  );
}

export { LegalForm };
