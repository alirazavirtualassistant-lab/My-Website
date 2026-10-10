"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ConfirmDialogProps {
  /** The element that opens the dialog (rendered with asChild). */
  trigger: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When set, the person must type this word before the confirm button enables. */
  typeToConfirm?: string;
  destructive?: boolean;
  /** Runs on confirm; the dialog shows a pending state until it resolves. */
  onConfirm: () => Promise<void> | void;
  confirmVariant?: ButtonProps["variant"];
  children?: React.ReactNode;
}

/**
 * Accessible confirmation for destructive actions. The dialog traps focus,
 * announces its title/description and closes itself once `onConfirm` settles.
 */
function ConfirmDialog({ trigger, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", typeToConfirm, destructive = true, onConfirm, confirmVariant, children }: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [pending, startTransition] = React.useTransition();
  const inputId = React.useId();
  const ready = !typeToConfirm || typed.trim() === typeToConfirm;

  function confirm() {
    startTransition(async () => {
      try {
        await onConfirm();
        setOpen(false);
        setTyped("");
      } catch {
        // The caller surfaces its own toast; keep the dialog open to retry.
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!pending) {
          setOpen(v);
          if (!v) setTyped("");
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {typeToConfirm ? (
          <div className="grid gap-1.5">
            <Label htmlFor={inputId}>
              Type <span className="font-mono text-rose-strong">{typeToConfirm}</span> to confirm
            </Label>
            <Input id={inputId} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
          </div>
        ) : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={pending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button variant={confirmVariant ?? (destructive ? "destructive" : "default")} onClick={confirm} loading={pending} disabled={!ready}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmDialog };
