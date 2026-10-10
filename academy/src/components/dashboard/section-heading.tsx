import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
}

/** Dashboard section header: eyebrow, serif h2, optional one-liner and a right-aligned action. */
function SectionHeading({ eyebrow, title, description, action, id, className, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id} className="mt-1 text-2xl text-foreground sm:text-[1.75rem]">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { SectionHeading };
