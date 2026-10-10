"use client";

import * as React from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { loadEmailHtmlAction, type EmailHtmlResult } from "@/app/admin/(panel)/emails/actions";

/** "View" → fetches the stored HTML on open and renders it in a sandboxed iframe. */
function EmailPreviewDialog({ id, subject }: { id: string; subject: string }) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<EmailHtmlResult | null>(null);
  const [pending, startTransition] = React.useTransition();
  React.useEffect(() => {
    if (!open || result) return;
    startTransition(async () => {
      const res = await loadEmailHtmlAction(id);
      setResult(res);
    });
  }, [open, result, id]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={`View email: ${subject}`}>
          <Eye aria-hidden="true" /> View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{result?.subject ?? subject}</DialogTitle>
          <DialogDescription>{result?.to ? `to ${result.to}` : "Loading the stored copy…"}</DialogDescription>
        </DialogHeader>
        <div className="min-h-[50vh] overflow-hidden rounded-lg border border-border bg-white">
          {pending || !result ? (
            <div className="grid gap-3 p-6" role="status" aria-label="Loading email">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : !result.ok ? (
            <p className="p-6 text-sm text-danger" role="alert">
              {result.error}
            </p>
          ) : result.html ? (
            <iframe title={`Email: ${result.subject}`} srcDoc={result.html} sandbox="allow-popups allow-popups-to-escape-sandbox" className="h-[65vh] w-full" />
          ) : (
            <pre className="max-h-[65vh] overflow-auto p-6 text-sm whitespace-pre-wrap text-ink">{result.text ?? "This email has no stored body (the provider only kept the metadata)."}</pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { EmailPreviewDialog };
