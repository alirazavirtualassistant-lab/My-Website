"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { cancelSubscriptionAction } from "@/app/(learner)/account/billing/actions";
import { SubmitButton } from "@/components/auth/submit-button";
import { idleState } from "@/components/auth/types";

/** Confirm → cancel at period end (access continues until then). */
function CancelSubscriptionButton({ subscriptionId, periodEndLabel }: { subscriptionId: string; periodEndLabel: string | null }) {
  const [open, setOpen] = React.useState(false);
  const [state, action] = useActionState(cancelSubscriptionAction, idleState);
  const succeeded = state.status === "success";
  React.useEffect(() => {
    if (succeeded) toast.success(state.message ?? "Your membership will end at the close of this period.");
  }, [succeeded, state.message, state.stamp]);
  return (
    <Dialog open={open && !succeeded} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cancel membership
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel your membership?</DialogTitle>
          <DialogDescription>
            {periodEndLabel ? `You'll keep full access until ${periodEndLabel}, and you won't be charged again.` : "You'll keep access until the end of the current period, and you won't be charged again."} You can come back any time.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="subscription_id" value={subscriptionId} />
          {state.status === "error" ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {state.errors?.form}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Keep my membership
              </Button>
            </DialogClose>
            <SubmitButton variant="destructive" pendingLabel="Cancelling…">
              Yes, cancel at period end
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { CancelSubscriptionButton };
