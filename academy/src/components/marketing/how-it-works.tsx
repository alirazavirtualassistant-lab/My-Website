import * as React from "react";
import { Illustration, type IllustrationName } from "@/components/shared/illustration";
import { cn } from "@/lib/utils";

const STEPS: Array<{ title: string; body: string; art: IllustrationName }> = [
  { title: "Browse", body: "Read the full curriculum, watch the free previews and see exactly what is inside before you decide.", art: "path" },
  { title: "Enroll", body: "One payment, lifetime access, and a partner seat so the person beside you can walk with you.", art: "cradle" },
  { title: "Learn at your pace", body: "Short videos, a resource to download and two or three small actions. Modules open roughly weekly.", art: "seedling" },
  { title: "Earn your certificate", body: "Finish the core modules and your certificate is ready to download and share.", art: "harvest" },
];

/** Browse → Enroll → Learn → Certificate, with line-art instead of stock photos. */
function HowItWorks({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol data-slot="how-it-works" className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-4", className)} {...props}>
      {STEPS.map((step, i) => (
        <li key={step.title} className="relative flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="flex w-full items-start justify-between">
            <Illustration name={step.art} size={72} className="text-rose-strong" />
            <span aria-hidden="true" className="font-serif text-3xl leading-none text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="font-serif text-2xl font-medium">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export { HowItWorks };
