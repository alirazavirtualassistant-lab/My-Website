import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      prose: "max-w-[72ch]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "lg" },
});

export interface ContainerProps extends React.ComponentProps<"div">, VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

function Container({ className, size, asChild = false, ...props }: ContainerProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "div";
  return <Comp data-slot="container" className={cn(containerVariants({ size }), className)} {...props} />;
}

export { Container, containerVariants };
