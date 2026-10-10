import * as React from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small fixed corner ribbon shown only in demo mode. */
function DemoRibbon({ demo, className }: { demo: boolean; className?: string }) {
  if (!demo) return null;
  return (
    <div
      role="status"
      aria-label="Demo mode. Test data only."
      className={cn(
        "pointer-events-none fixed bottom-3 left-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold-soft/95 px-3 py-1 text-[11px] font-bold tracking-wider text-warning uppercase shadow-soft backdrop-blur print:hidden",
        className,
      )}
    >
      <FlaskConical className="size-3.5" aria-hidden="true" />
      Demo mode · test data
    </div>
  );
}

export { DemoRibbon };
