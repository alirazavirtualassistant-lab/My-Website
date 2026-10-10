import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-sans text-sm font-semibold transition-[background-color,color,box-shadow,transform] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-rose-strong",
        rose: "bg-primary text-primary-foreground shadow-soft hover:bg-rose-strong",
        secondary: "bg-secondary text-secondary-foreground hover:bg-gold-soft",
        outline: "border border-border bg-card text-foreground hover:border-rose/60 hover:bg-rose-soft/40",
        ghost: "text-foreground hover:bg-rose-soft/50 hover:text-rose-strong",
        link: "h-auto rounded-sm px-0 text-rose-strong underline-offset-4 hover:underline",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
        gold: "bg-gold text-[#2e2a27] shadow-soft hover:bg-gold/90",
      },
      size: {
        sm: "h-9 gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
        md: "h-10 px-4 has-[>svg]:px-3.5",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a <button> (e.g. a Next <Link>). */
  asChild?: boolean;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
}

function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (props.type ?? "button")}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle className="animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
