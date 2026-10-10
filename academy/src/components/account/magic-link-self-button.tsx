"use client";

import * as React from "react";
import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendMagicLinkToMeAction } from "@/app/(learner)/account/logins/actions";
import { MagicLinkSent } from "@/components/auth/magic-link-sent";
import { idleState } from "@/components/auth/types";

/** "Email me a magic link" for the signed-in user's own address. */
function MagicLinkSelfButton({ demoMailbox }: { demoMailbox: boolean }) {
  const [state, action, pending] = useActionState(sendMagicLinkToMeAction, idleState);
  if (state.status === "sent") return <MagicLinkSent email={state.email} demoMailbox={demoMailbox} />;
  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <Button type="submit" variant="outline" loading={pending}>
        <Sparkles /> Email me a magic link
      </Button>
      {state.status === "error" ? (
        <p role="alert" className="text-xs text-danger">
          {state.errors?.form}
        </p>
      ) : null}
    </form>
  );
}

export { MagicLinkSelfButton };
