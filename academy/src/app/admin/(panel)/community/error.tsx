"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/shared/illustration";

export default function CommunityError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-12 text-center">
      <Illustration name="calm" size={120} className="text-rose-strong" />
      <p className="eyebrow mt-6">A small bump</p>
      <h1 className="mt-2 text-balance">The moderation page didn’t load.</h1>
      <p className="mt-3 text-muted-foreground">Please try again. Nothing was changed.</p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p> : null}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
