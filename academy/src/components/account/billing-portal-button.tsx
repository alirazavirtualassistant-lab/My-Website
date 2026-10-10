"use client";

import * as React from "react";
import { useActionState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBillingPortalAction } from "@/app/(learner)/account/billing/actions";
import { idleState } from "@/components/auth/types";

/** Opens the Stripe Customer Portal (or the mock portal in demo mode). */
function BillingPortalButton() {
  const [state, action, pending] = useActionState(openBillingPortalAction, idleState);
  return (
    <form action={action} className="grid gap-1">
      <Button type="submit" loading={pending}>
        Manage billing <ExternalLink aria-hidden="true" />
      </Button>
      {state.status === "error" ? (
        <p role="alert" className="text-xs text-danger">
          {state.errors?.form}
        </p>
      ) : null}
    </form>
  );
}

export { BillingPortalButton };
