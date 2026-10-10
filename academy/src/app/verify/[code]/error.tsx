"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { Illustration } from "@/components/shared/illustration";

export default function VerifyError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Section spacing="md">
      <Container size="md">
        <EmptyState
          className="mx-auto max-w-3xl"
          icon={<Illustration name="calm" className="text-rose-strong" />}
          title="We couldn't check that certificate right now"
          description={
            <>
              Please try again in a moment.
              {error.digest ? <span className="mt-1 block font-mono text-xs">Reference: {error.digest}</span> : null}
            </>
          }
          action={
            <>
              <Button onClick={() => retry()}>Try again</Button>
              <Button asChild variant="outline">
                <Link href="/">Home</Link>
              </Button>
            </>
          }
        />
      </Container>
    </Section>
  );
}
