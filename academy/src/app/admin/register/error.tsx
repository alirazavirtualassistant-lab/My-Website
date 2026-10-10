"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export default function AdminRegisterError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="flex min-h-screen flex-1 flex-col items-center justify-center bg-cream px-4 py-16 text-center">
      <Illustration name="calm" size={140} className="text-rose-strong" />
      <p className="eyebrow mt-8">A small bump</p>
      <h1 className="mt-3 max-w-xl text-balance">Admin setup didn't load.</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Please try again. If it keeps happening, check the server logs for the data store connection.</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
