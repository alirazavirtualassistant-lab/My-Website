import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends Omit<React.ComponentProps<"section">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Red-tinted border for destructive areas. */
  tone?: "default" | "danger";
}

/** A titled white card used for each settings group on the account pages. */
function SectionCard({ title, description, actions, tone = "default", className, children, ...props }: SectionCardProps) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className={cn("card-soft p-5 sm:p-6", tone === "danger" && "border-danger/30", className)} {...props}>
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 id={id} className="font-serif text-2xl leading-tight">
            {title}
          </h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export { SectionCard };
