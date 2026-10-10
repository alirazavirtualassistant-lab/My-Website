import * as React from "react";
import { Stethoscope, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalloutProps extends Omit<React.ComponentProps<"aside">, "title"> {
  /** `doctor` = the soft "check with your doctor" box; `generic` takes your own icon/title. */
  variant?: "doctor" | "generic" | "gold" | "sage";
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

const DOCTOR_TITLE = "A gentle reminder";
const DOCTOR_BODY =
  "Please check with your doctor or a qualified healthcare provider before changing your diet, movement, supplements, or fertility care. You know your body; they know your history.";

/**
 * Soft, calm callout. The default `doctor` variant renders the "check with your doctor"
 * reminder used on lessons flagged `doctor_callout`.
 */
function Callout({ variant = "doctor", icon, title, className, children, ...props }: CalloutProps) {
  const isDoctor = variant === "doctor";
  const tone =
    variant === "sage"
      ? "border-sage/40 bg-sage-soft/70 text-foreground [&_[data-slot=callout-icon]]:bg-sage-soft [&_[data-slot=callout-icon]]:text-sage-strong"
      : variant === "gold"
        ? "border-gold/50 bg-gold-soft/70 text-foreground [&_[data-slot=callout-icon]]:bg-gold-soft [&_[data-slot=callout-icon]]:text-warning"
        : "border-rose/30 bg-rose-soft/50 text-foreground [&_[data-slot=callout-icon]]:bg-rose-soft [&_[data-slot=callout-icon]]:text-rose-strong";
  const resolvedIcon = icon ?? (isDoctor ? <Stethoscope /> : <Sparkles />);
  const resolvedTitle = title ?? (isDoctor ? DOCTOR_TITLE : null);
  return (
    <aside
      data-slot="callout"
      data-variant={variant}
      role="note"
      className={cn("flex gap-3 rounded-lg border p-4 text-sm leading-relaxed", tone, className)}
      {...props}
    >
      <div data-slot="callout-icon" aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full [&>svg]:size-4.5">
        {resolvedIcon}
      </div>
      <div className="min-w-0 flex-1">
        {resolvedTitle ? <p className="font-serif text-lg leading-tight font-medium">{resolvedTitle}</p> : null}
        <div className={cn("text-foreground/90", resolvedTitle && "mt-1")}>{children ?? (isDoctor ? DOCTOR_BODY : null)}</div>
      </div>
    </aside>
  );
}

export { Callout };
