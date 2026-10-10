"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";

export default function LessonError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ course?: string }>();
  React.useEffect(() => {
    console.error(error);
  }, [error]);
  const courseHref = params?.course ? `/learn/${params.course}` : "/learn";
  return (
    <EmptyState
      icon={<Illustration name="calm" className="text-rose-strong" />}
      title="This lesson didn't load"
      description={
        <>
          Your progress is safe. Try again, or go back to the course overview.
          {error.digest ? <span className="mt-1 block font-mono text-xs">Reference: {error.digest}</span> : null}
        </>
      }
      action={
        <>
          <Button onClick={() => retry()}>Try again</Button>
          <Button asChild variant="outline">
            <Link href={courseHref}>Course overview</Link>
          </Button>
        </>
      }
    />
  );
}
