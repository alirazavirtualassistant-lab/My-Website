"use client";

import * as React from "react";
import { useActionState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { resendReceiptAction } from "@/app/(learner)/account/purchases/actions";
import { idleState } from "@/components/auth/types";

function ResendReceiptButton({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(resendReceiptAction, idleState);
  React.useEffect(() => {
    if (state.status === "sent") toast.success(`Receipt sent to ${state.email}.`);
    if (state.status === "error") toast.error(state.errors?.form ?? "We couldn't send that receipt.");
  }, [state.status, state.email, state.errors, state.stamp]);
  return (
    <form action={action}>
      <input type="hidden" name="order_id" value={orderId} />
      <Button type="submit" variant="outline" size="sm" loading={pending}>
        <Send /> Resend receipt
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {state.status === "sent" ? "Receipt sent." : state.status === "error" ? state.errors?.form : ""}
      </span>
    </form>
  );
}

export { ResendReceiptButton };
