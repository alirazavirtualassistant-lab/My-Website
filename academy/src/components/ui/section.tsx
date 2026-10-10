import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      none: "",
      sm: "py-8 sm:py-10",
      md: "py-12 sm:py-16",
      lg: "py-16 sm:py-24",
    },
    tone: {
      none: "",
      cream: "bg-cream",
      cream2: "bg-cream-2",
      paper: "bg-paper",
      rose: "bg-rose-soft/50",
      sage: "bg-sage-soft/60",
      gold: "bg-gold-soft/60",
    },
  },
  defaultVariants: { spacing: "md", tone: "none" },
});

export interface SectionProps extends React.ComponentProps<"section">, VariantProps<typeof sectionVariants> {
  asChild?: boolean;
}

/** Vertical rhythm wrapper. Pair with <Container> for the horizontal gutter. */
function Section({ className, spacing, tone, asChild = false, ...props }: SectionProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "section";
  return <Comp data-slot="section" className={cn(sectionVariants({ spacing, tone }), className)} {...props} />;
}

export { Section, sectionVariants };
