import Link from "next/link";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/** Demo-mode hint: emails don't leave the box; they land in /dev/mailbox. */
function DemoMailboxNote({ show, what = "Emails", className }: { show: boolean; what?: string; className?: string }) {
  if (!show) return null;
  return (
    <p className={cn("flex items-start gap-2 rounded-lg border border-gold/50 bg-gold-soft/60 px-3 py-2 text-xs text-foreground/90", className)} role="note">
      <Inbox className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
      <span>
        Demo mode: {what.toLowerCase()} land in the{" "}
        <Link href="/dev/mailbox" className="font-semibold text-rose-strong underline underline-offset-4">
          demo mailbox
        </Link>{" "}
        instead of a real inbox.
      </span>
    </p>
  );
}

export { DemoMailboxNote };
