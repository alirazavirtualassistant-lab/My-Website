import * as React from "react";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMUNITY_GUIDELINES } from "./types";

/** The Welcome Guide community guidelines, quoted verbatim. */
function CommunityRules({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="community-rules"
      aria-labelledby="community-rules-title"
      className={cn("flex gap-4 rounded-lg border border-sage/40 bg-sage-soft/60 p-4 sm:p-5", className)}
      {...props}
    >
      <div aria-hidden="true" className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-strong sm:flex">
        <HeartHandshake className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-sage-strong">From the Welcome Guide</p>
        <h2 id="community-rules-title" className="mt-1 font-serif text-xl font-medium">
          How we hold this space
        </h2>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-foreground/90 sm:grid-cols-2 sm:gap-x-6">
          {COMMUNITY_GUIDELINES.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-sage-strong" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export { CommunityRules };
