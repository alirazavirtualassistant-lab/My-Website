"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export default function MarketingError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <Illustration name="calm" size={140} className="text-rose-strong" />
      <p className="eyebrow mt-8">A small bump</p>
      <h1 className="mt-3 max-w-xl text-balance">This page didn’t load the way it should.</h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        It isn’t anything you did. Please try again in a moment; if it keeps happening, let us know through the contact page and we will fix it.
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
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
