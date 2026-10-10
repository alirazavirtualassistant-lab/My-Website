import * as React from "react";
import Link from "next/link";
import { MessageCircleHeart } from "lucide-react";
import type { PartnerExerciseRow } from "./types";

/**
 * "Talk about it": the action steps from each partner lesson, quoted verbatim,
 * as conversation starters for the two of you. No invented copy.
 */
function TalkPrompts({ rows }: { rows: PartnerExerciseRow[] }) {
  const withPrompts = rows.filter((r) => r.prompts.length > 0);
  if (withPrompts.length === 0) return null;
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {withPrompts.map((r) => (
        <li key={r.lessonId} className="rounded-lg border border-border bg-card p-4">
          <p className="flex items-start gap-2 font-serif text-lg leading-snug">
            <MessageCircleHeart className="mt-1 size-4 shrink-0 text-rose-strong" aria-hidden="true" />
            {r.unlocked ? (
              <Link href={r.href} className="underline-offset-4 hover:text-rose-strong hover:underline">
                {r.title}
              </Link>
            ) : (
              <span>{r.title}</span>
            )}
          </p>
          <ul className="mt-2 grid gap-1 pl-6 text-sm text-foreground/90">
            {r.prompts.map((p, i) => (
              <li key={i} className="list-disc">
                {p}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export { TalkPrompts };
