"use client";

import * as React from "react";
import { useActionState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";
import { messageOf, type AdminAction } from "./form-state";

export interface ConfirmActionDialogProps {
  action: AdminAction;
  fields: Record<string, string>;
  /** The button that opens the dialog. */
  trigger: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  /** When set, the user must type this word before the confirm button enables. */
  confirmWord?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Styles the confirm button; defaults to destructive. */
  confirmVariant?: ButtonProps["variant"];
  /** Extra inputs rendered inside the form (e.g. a reason or a radio choice). */
  children?: React.ReactNode;
  /** A soft warning line under the description. */
  warning?: React.ReactNode;
}

/**
 * Accessible confirm step for irreversible admin actions (refund, delete,
 * reset). Closes itself and toasts on success; keeps inline errors on failure.
 */
function ConfirmActionDialog({ action, fields, trigger, title, description, confirmWord, confirmLabel, cancelLabel = "Cancel", confirmVariant = "destructive", children, warning }: ConfirmActionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [state, formAction] = useActionState(action, idleState);
  const errors = state.errors ?? {};
  React.useEffect(() => {
    if (!state.stamp) return;
    if (state.status === "error") return;
    const message = messageOf(state);
    if (message) toast.success(message);
    setOpen(false);
    setTyped("");
  }, [state]);
  const ready = !confirmWord || typed.trim() === confirmWord;
  const id = React.useId();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={formAction} noValidate className="grid gap-4">
          {Object.entries(fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <FormErrorSummary summary={state.status === "error" ? state.summary : undefined} />
          {warning ? (
            <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-sm text-warning" role="note">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{warning}</span>
            </div>
          ) : null}
          {children}
          {confirmWord ? (
            <FormField id={`${id}-confirm`} label={`Type ${confirmWord} to confirm`} error={errors.confirm} required optionalText="">
              <Input name="confirm" autoComplete="off" spellCheck={false} value={typed} onChange={(e) => setTyped(e.target.value)} required />
            </FormField>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {cancelLabel}
              </Button>
            </DialogClose>
            <SubmitButton variant={confirmVariant} disabled={!ready} pendingLabel="Working…">
              {confirmLabel}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmActionDialog };
