"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import type { AdminFormState } from "./form-state";

/** Submit button that spins while its form is pending. */
function SaveButton({ children = "Save changes", pendingLabel = "Saving…", ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <Button type="submit" loading={pending} {...props}>
        {children}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {pending ? pendingLabel : ""}
      </span>
    </>
  );
}

/** Error summary that takes focus when it appears. */
function FormErrors({ state, className }: { state: AdminFormState; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const summary = state.status === "error" ? (state.summary ?? []) : [];
  const key = summary.join("|");
  React.useEffect(() => {
    if (key) ref.current?.focus();
  }, [key]);
  if (summary.length === 0) return null;
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className={cn("grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <CircleAlert className="mt-0.5 size-5" aria-hidden="true" />
      {summary.length === 1 ? (
        <p className="font-medium">{summary[0]}</p>
      ) : (
        <div>
          <p className="font-semibold">Let’s fix a couple of things</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {summary.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Fires a success toast every time the action reports a new successful submit. */
function useSavedToast(state: AdminFormState, onSuccess?: () => void) {
  const last = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    if (state.status === "success" && state.stamp && state.stamp !== last.current) {
      last.current = state.stamp;
      toast.success(state.message ?? "Saved");
      onSuccess?.();
    }
  }, [state, onSuccess]);
}

/** Section wrapper used across the CMS pages. */
function AdminCard({ title, description, actions, children, className, id }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("card-soft p-5 sm:p-6", className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={id ? `${id}-title` : undefined} className="font-serif text-xl font-medium text-foreground">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export { SaveButton, FormErrors, useSavedToast, AdminCard };
