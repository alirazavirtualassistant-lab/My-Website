"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";

export default function CheckoutGroupError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <EmptyState
      icon={<Illustration name="calm" className="text-rose-strong" />}
      title="This page didn't load"
      description={
        <>
          Nothing has been charged. Try again in a moment, or go back to your cart.
          {error.digest ? <span className="mt-1 block font-mono text-xs">Reference: {error.digest}</span> : null}
        </>
      }
      action={
        <>
          <Button onClick={() => retry()}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/cart">Back to cart</Link>
          </Button>
        </>
      }
    />
  );
}
