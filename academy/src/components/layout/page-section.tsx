import * as React from "react";
import { cn } from "@/lib/utils";
import { Container, type ContainerProps } from "@/components/ui/container";
import { Section, type SectionProps } from "@/components/ui/section";

export interface PageSectionProps extends Omit<SectionProps, "title"> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: "left" | "center";
  containerSize?: ContainerProps["size"];
  headingLevel?: "h1" | "h2" | "h3";
}

/**
 * Section + Container + optional heading block, for marketing and dashboard pages.
 *
 * <PageSection eyebrow="Courses" title="Start where you are" description="…">…</PageSection>
 */
function PageSection({ eyebrow, title, description, actions, align = "left", containerSize, headingLevel: Heading = "h2", children, className, ...props }: PageSectionProps) {
  const hasHeader = eyebrow || title || description || actions;
  return (
    <Section className={className} {...props}>
      <Container size={containerSize}>
        {hasHeader ? (
          <div className={cn("mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between", align === "center" && "items-center text-center sm:flex-col sm:items-center")}>
            <div className={cn("flex max-w-2xl flex-col gap-2", align === "center" && "items-center")}>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              {title ? <Heading className="text-balance text-foreground">{title}</Heading> : null}
              {description ? <p className="text-pretty text-muted-foreground sm:text-lg">{description}</p> : null}
            </div>
            {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </Section>
  );
}

export { PageSection };
