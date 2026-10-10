"use client";

/**
 * First-lesson gate: the medical disclaimer must be accepted once before any
 * lesson plays. The dialog cannot be dismissed (no close button, Escape and
 * outside clicks are ignored); "I understand" calls the Server Action and
 * refreshes the page so the lesson renders normally.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { site } from "@/lib/config/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { acceptDisclaimerAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";

function DisclaimerGate({ disclaimerText }: { disclaimerText?: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const text = disclaimerText?.trim() || site.medicalDisclaimer;

  function accept() {
    setError(null);
    startTransition(async () => {
      const res = await acceptDisclaimerAction();
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(res.error ?? "We couldn't save that just now. Please try again.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div aria-hidden="true" className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-soft text-rose-strong sm:mx-0">
            <Stethoscope className="size-5" />
          </div>
          <DialogTitle>Before your first lesson</DialogTitle>
          <DialogDescription asChild>
            <div className="text-left text-sm leading-relaxed text-foreground/90">
              <p>{text}</p>
              <p className="mt-3 text-muted-foreground">Go at your own pace. You can pause, rewind and come back any time; nothing here is a test.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}
        <DialogFooter>
          <Button onClick={accept} loading={pending} autoFocus>
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { DisclaimerGate };
