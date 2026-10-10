"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export default function AuthError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="card-soft w-full p-6 text-center sm:p-8" aria-labelledby="auth-error-title">
      <Illustration name="calm" size={120} className="mx-auto text-rose-strong" />
      <p className="eyebrow mt-6">A small bump</p>
      <h1 id="auth-error-title" className="mt-2 text-3xl">
        We couldn’t load this screen.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">It isn’t anything you did. Try again, or come back in a moment.</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}
