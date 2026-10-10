"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";

export default function CategoryError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ course?: string }>();
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <EmptyState
      icon={<Illustration name="calm" className="text-rose-strong" />}
      title="These posts didn't load"
      description={
        <>
          It isn’t anything you did. Take a breath and try again in a moment.
          {error.digest ? <span className="mt-1 block font-mono text-xs">Reference: {error.digest}</span> : null}
        </>
      }
      action={
        <>
          <Button onClick={() => retry()}>Try again</Button>
          <Button asChild variant="outline">
            <Link href={params?.course ? `/community/${params.course}` : "/community"}>Back to the community</Link>
          </Button>
        </>
      }
    />
  );
}
