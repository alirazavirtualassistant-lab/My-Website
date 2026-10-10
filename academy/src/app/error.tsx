"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <Illustration name="calm" size={160} className="text-rose-strong" />
      <p className="eyebrow mt-8">A small bump</p>
      <h1 className="mt-3 max-w-xl text-balance">Something didn’t load the way it should.</h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        It isn’t anything you did. Please try again in a moment; if it keeps happening, we’d love to hear from you so we can
        fix it.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Reference: <span className="select-all">{error.digest}</span>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={() => retry()}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/courses">Browse courses</Link>
        </Button>
      </div>
    </main>
  );
}
