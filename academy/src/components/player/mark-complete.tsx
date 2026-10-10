"use client";

/**
 * "Mark complete & continue" with optimistic progress, the calm outcome toast
 * (XP / badges / module / certificate) and the auto-advance toggle.
 */
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Award, CircleCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { markLessonCompleteAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { useAutoAdvance, usePlayerStore } from "./player-store";
import type { CompletionResult } from "./types";

/** One quiet toast summarising what a completion earned. No confetti. */
export function toastCompletion(result: CompletionResult, opts: { title: string; router: ReturnType<typeof useRouter> }) {
  const lines: string[] = [];
  if (result.xpAwarded > 0) lines.push(`+${result.xpAwarded} XP`);
  for (const b of result.newBadges) lines.push(`Badge earned: ${b.title}`);
  if (result.moduleCompleted) lines.push(`${result.moduleCompleted} complete`);
  if (result.certificateId) lines.push("Your certificate is ready");
  const certificateHref = result.certificateId ? `/certificates/${result.certificateId}` : null;
  toast.success(opts.title, {
    description: lines.length ? lines.join(" · ") : undefined,
    action: certificateHref ? { label: "View certificate", onClick: () => opts.router.push(certificateHref) } : undefined,
  });
}

export interface MarkCompleteProps {
  lessonId: string;
  nextHref: string | null;
  courseHref: string;
  className?: string;
}

function MarkComplete({ lessonId, nextHref, courseHref, className }: MarkCompleteProps) {
  const router = useRouter();
  const { isCompleted, markCompleted, unmarkCompleted } = usePlayerStore();
  const [pending, startTransition] = React.useTransition();
  const completed = isCompleted(lessonId);

  function complete() {
    markCompleted(lessonId);
    startTransition(async () => {
      const res = await markLessonCompleteAction({ lessonId });
      if (!res.ok) {
        unmarkCompleted(lessonId);
        toast.error(res.error ?? "We couldn't mark this lesson complete just now.");
        return;
      }
      toastCompletion(res, { title: "Lesson complete", router });
      const target = res.nextHref ?? nextHref;
      if (target) router.push(target);
      else router.refresh();
    });
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {completed ? (
        <>
          <span className="inline-flex h-10 items-center gap-2 rounded-lg bg-sage-soft px-4 text-sm font-semibold text-sage-strong">
            <CircleCheck className="size-4" aria-hidden="true" />
            Completed
          </span>
          {nextHref ? (
            <Button asChild>
              <Link href={nextHref}>
                Next lesson
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={courseHref}>
                <Award aria-hidden="true" />
                Back to the course
              </Link>
            </Button>
          )}
        </>
      ) : (
        <Button onClick={complete} loading={pending}>
          <Sparkles aria-hidden="true" />
          Mark complete{nextHref ? " & continue" : ""}
        </Button>
      )}
      <AutoAdvanceToggle />
    </div>
  );
}

function AutoAdvanceToggle() {
  const [on, setOn] = useAutoAdvance();
  return (
    <div className="ml-auto flex items-center gap-2">
      <Switch id="auto-advance" checked={on} onCheckedChange={setOn} />
      <Label htmlFor="auto-advance" className="text-xs font-semibold text-muted-foreground">
        Auto-advance
      </Label>
    </div>
  );
}

export { MarkComplete, AutoAdvanceToggle };
