import * as React from "react";
import { FlaskConical, Footprints, HeartHandshake } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  science: <FlaskConical />,
  heart: <HeartHandshake />,
  steps: <Footprints />,
};

/** The three promises from site.promises as calm, equal cards. */
function Promises({ className, compact = false, ...props }: React.ComponentProps<"ul"> & { compact?: boolean }) {
  return (
    <ul data-slot="promises" className={cn("grid gap-4 sm:grid-cols-3", className)} {...props}>
      {site.promises.map((p) => (
        <li key={p.key} className={cn("card-soft flex flex-col gap-3", compact ? "p-5" : "p-6 sm:p-7")}>
          <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-rose-soft text-rose-strong [&>svg]:size-5">
            {ICONS[p.key] ?? <Footprints />}
          </span>
          <h3 className="font-serif text-2xl font-medium">{p.title}</h3>
          <p className="text-muted-foreground">{p.body}</p>
        </li>
      ))}
    </ul>
  );
}

export { Promises };
