import * as React from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoMailboxNote } from "./demo-mailbox-note";

/** "Check your inbox" panel after a magic link / reset / verification email was sent. */
function MagicLinkSent({
  email,
  title = "Check your inbox",
  body,
  demoMailbox,
  onChangeEmail,
  children,
}: {
  email?: string;
  title?: string;
  body?: React.ReactNode;
  demoMailbox: boolean;
  onChangeEmail?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" className="grid gap-4">
      <div className="flex items-start gap-3 rounded-lg border border-sage/40 bg-sage-soft/70 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong" aria-hidden="true">
          <MailCheck className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-serif text-xl leading-tight font-medium text-foreground">{title}</p>
          <p className="mt-1 text-sm text-foreground/90">
            {body ?? (
              <>
                We sent a link to <span className="font-semibold break-all">{email}</span>. It works once and expires soon, so open it on this device when you can.
              </>
            )}
          </p>
        </div>
      </div>
      <DemoMailboxNote show={demoMailbox} />
      {children}
      {onChangeEmail ? (
        <Button type="button" variant="ghost" onClick={onChangeEmail} className="justify-self-start px-2">
          Use a different email
        </Button>
      ) : null}
    </div>
  );
}

export { MagicLinkSent };
