import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";

/** Shown when a signed-in member opens a course community they are not enrolled in. */
function CommunityLocked({ courseSlug, courseTitle }: { courseSlug: string; courseTitle: string }) {
  return (
    <EmptyState
      icon={<Illustration name="home" className="text-rose-strong" />}
      title="This community opens with enrolment"
      description={`Members of ${courseTitle} share wins, questions and encouragement here. Once you are enrolled, you are warmly welcome.`}
      action={
        <>
          <Button asChild>
            <Link href={`/courses/${courseSlug}`}>See the course</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/community">Back to communities</Link>
          </Button>
        </>
      }
    />
  );
}

export { CommunityLocked };
