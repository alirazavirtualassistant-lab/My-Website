"use client";

import * as React from "react";
import { useActionState } from "react";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { idleCoupleState, type CoupleFormState } from "./types";

export interface RevokeInviteButtonProps {
  action: (prev: CoupleFormState, formData: FormData) => Promise<CoupleFormState>;
  courseSlug: string;
  linkId: string;
  /** Accepted seat (removes the partner's access) vs pending invitation. */
  accepted: boolean;
}

/** Cancel a pending invitation or remove an accepted partner, with a confirm step. */
function RevokeInviteButton({ action, courseSlug, linkId, accepted }: RevokeInviteButtonProps) {
  const [state, formAction, pending] = useActionState(action, idleCoupleState);
  const [confirming, setConfirming] = React.useState(false);
  if (!confirming) {
    return (
      <div className="grid gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(true)} className="text-muted-foreground hover:text-danger">
          <XCircle aria-hidden="true" />
          {accepted ? "Remove partner" : "Cancel invitation"}
        </Button>
        {state.status === "error" ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {state.message}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <form action={formAction} className="grid gap-2 rounded-lg border border-danger/30 bg-danger-soft/40 p-3" aria-busy={pending || undefined}>
      <input type="hidden" name="course" value={courseSlug} />
      <input type="hidden" name="link_id" value={linkId} />
      <p className="text-sm">
        {accepted ? "Your partner will lose access to the course. Their notes and progress are kept on their account." : "The link in the email will stop working. You can send a new invitation afterwards."}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="destructive" size="sm" loading={pending}>
          {accepted ? "Yes, remove partner" : "Yes, cancel it"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
          Keep it
        </Button>
      </div>
    </form>
  );
}

export { RevokeInviteButton };
