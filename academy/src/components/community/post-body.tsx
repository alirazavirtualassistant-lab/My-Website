import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Learner-written text rendered as plain paragraphs with line breaks kept.
 * Nothing is linkified or parsed: what members type is exactly what shows.
 */
function PostBody({ body, className, ...props }: React.ComponentProps<"div"> & { body: string }) {
  const paragraphs = body.replace(/\r\n?/g, "\n").split(/\n{2,}/);
  return (
    <div data-slot="post-body" className={cn("grid gap-3 text-base leading-relaxed text-foreground", className)} {...props}>
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {para}
        </p>
      ))}
    </div>
  );
}

export { PostBody };
