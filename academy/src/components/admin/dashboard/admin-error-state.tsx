"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export interface AdminErrorStateProps {
  error: Error & { digest?: string };
  retry: () => void;
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

/** Shared body for the admin error.tsx boundaries. */
function AdminErrorState({ error, retry, title = "That page didn’t load.", description = "Please try again. If it keeps happening, the details are in the server log.", backHref = "/admin", backLabel = "Back to dashboard" }: AdminErrorStateProps) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <Illustration name="calm" size={120} className="text-rose-strong" />
      <p className="eyebrow mt-8">A small bump</p>
      <h1 className="mt-3 text-balance">{title}</h1>
      <p className="mt-4 text-muted-foreground">{description}</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

export { AdminErrorState };
