"use client";

import * as React from "react";
import { useActionState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { deleteAccountAction } from "@/app/(learner)/account/privacy/actions";
import { FormErrorSummary } from "@/components/auth/form-error-summary";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";

/** Type DELETE to confirm. On success the action signs out and redirects home. */
function DeleteAccountDialog({ email }: { email: string }) {
  const [state, action] = useActionState(deleteAccountAction, idleState);
  const [typed, setTyped] = React.useState("");
  const errors = state.errors ?? {};
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete my account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account?</DialogTitle>
          <DialogDescription>
            This removes your progress, notes, uploads and certificates for <span className="font-semibold">{email}</span>, and signs you out. Community posts become “Deleted member”. Order records stay for accounting. This can’t be undone.
          </DialogDescription>
        </DialogHeader>
        <form action={action} noValidate className="grid gap-4">
          <FormErrorSummary summary={state.summary} />
          <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger" role="note">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>If you only want fewer emails, the Emails tab can do that instead.</span>
          </div>
          <FormField id="del-confirm" label="Type DELETE to confirm" error={errors.confirm} required optionalText="">
            <Input name="confirm" autoComplete="off" spellCheck={false} value={typed} onChange={(e) => setTyped(e.target.value)} required />
          </FormField>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Keep my account
              </Button>
            </DialogClose>
            <SubmitButton variant="destructive" disabled={typed.trim() !== "DELETE"} pendingLabel="Deleting…">
              Delete my account
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { DeleteAccountDialog };
