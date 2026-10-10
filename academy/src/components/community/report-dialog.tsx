"use client";

import * as React from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { reportContentAction } from "@/app/(learner)/community/[course]/actions";

export interface ReportDialogProps {
  target: { postId: string } | { replyId: string };
  size?: "sm" | "md";
  className?: string;
}

/** "Report" button + dialog: a short reason goes to the moderation queue. */
function ReportDialog({ target, size = "md", className }: ReportDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const what = "postId" in target ? "post" : "reply";
  const fieldId = `report-${"postId" in target ? target.postId : target.replyId}`;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 3) {
      setError("Please tell us what's wrong in a few words.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await reportContentAction({ ...target, reason: trimmed });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setReason("");
      toast.success("Thank you. A moderator will take a look.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className={cn("text-muted-foreground", size === "sm" && "h-8 px-2 text-xs", className)}>
          <Flag aria-hidden="true" className={size === "sm" ? "size-3.5" : undefined} />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submit} className="grid gap-5">
          <DialogHeader>
            <DialogTitle>Report this {what}</DialogTitle>
            <DialogDescription>Tell us what feels off and a moderator will review it. Your report stays private.</DialogDescription>
          </DialogHeader>
          <FormField id={fieldId} label="What's wrong?" required error={error ?? undefined} hint="A few words are enough.">
            <Textarea name="reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={4} placeholder="For example: this shares medical advice, or it feels unkind." />
          </FormField>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" loading={pending}>
              Send report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ReportDialog };
