import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.ComponentProps<"header">, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Centre the text (marketing pages). */
  align?: "left" | "center";
  /** Heading level for the title. */
  as?: "h1" | "h2";
}

function PageHeader({ eyebrow, title, description, actions, align = "left", as: Heading = "h1", className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
      {...props}
    >
      <div className={cn("flex max-w-2xl flex-col gap-2", align === "center" && "items-center")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading className="text-balance text-foreground">{title}</Heading>
        {description ? <p className="text-pretty text-base text-muted-foreground sm:text-lg">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export { PageHeader };
