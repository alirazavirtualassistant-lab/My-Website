import * as React from "react";
import { Stethoscope } from "lucide-react";
import { site } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export interface MedicalDisclaimerProps extends React.ComponentProps<"div"> {
  /** Shows a visible "[LEGAL REVIEW NEEDED]" tag (admin previews, drafts). */
  showReviewTag?: boolean;
  /** `box` = soft bordered block; `inline` = plain small print (footers, checkout). */
  variant?: "box" | "inline";
  heading?: React.ReactNode;
}

/** The site-wide medical disclaimer from site.medicalDisclaimer. */
function MedicalDisclaimer({ showReviewTag = false, variant = "box", heading = "Medical disclaimer", className, ...props }: MedicalDisclaimerProps) {
  if (variant === "inline") {
    return (
      <div data-slot="medical-disclaimer" className={cn("text-xs leading-relaxed text-muted-foreground", className)} {...props}>
        {showReviewTag ? <ReviewTag /> : null}
        <p>
          <span className="font-semibold text-foreground/80">{heading}: </span>
          {site.medicalDisclaimer}
        </p>
      </div>
    );
  }
  return (
    <div
      data-slot="medical-disclaimer"
      role="note"
      className={cn("flex gap-3 rounded-lg border border-border bg-cream-2/60 p-4 text-sm leading-relaxed text-foreground/90", className)}
      {...props}
    >
      <Stethoscope className="mt-0.5 size-4.5 shrink-0 text-rose-strong" aria-hidden="true" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
          {heading}
          {showReviewTag ? <ReviewTag /> : null}
        </p>
        <p className="mt-1">{site.medicalDisclaimer}</p>
      </div>
    </div>
  );
}

function ReviewTag() {
  return (
    <span className="inline-flex rounded-sm border border-warning/50 bg-warning-soft px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-warning">
      [LEGAL REVIEW NEEDED]
    </span>
  );
}

export { MedicalDisclaimer };
