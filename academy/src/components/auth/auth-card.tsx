import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthCardProps extends React.ComponentProps<"section"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}

/** The white card every auth screen lives in: eyebrow, serif h1, short description, content, footer links. */
function AuthCard({ eyebrow, title, description, footer, className, children, ...props }: AuthCardProps) {
  return (
    <section data-slot="auth-card" className={cn("card-soft w-full p-6 sm:p-8", className)} aria-labelledby="auth-title" {...props}>
      <header className="mb-6">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 id="auth-title" className="mt-2 text-balance text-3xl sm:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">{description}</p> : null}
      </header>
      {children}
      {footer ? <footer className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">{footer}</footer> : null}
    </section>
  );
}

/** "or" divider between the social button and the form. */
function OrDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      {label}
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

export { AuthCard, OrDivider };
