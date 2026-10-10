import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressRingProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** 0–100 */
  value: number;
  size?: "xs" | "sm" | "md" | "lg" | number;
  strokeWidth?: number;
  tone?: "rose" | "sage" | "gold";
  /** Hide the default percentage label (or pass your own children). */
  showLabel?: boolean;
  label?: string;
  children?: React.ReactNode;
}

const sizePx = { xs: 32, sm: 48, md: 72, lg: 112 } as const;
const toneVar = { rose: "var(--rose)", sage: "var(--sage-strong)", gold: "var(--gold)" } as const;

/** SVG progress ring. Accessible as a progressbar; the percent label sits in the centre. */
function ProgressRing({ value, size = "md", strokeWidth, tone = "sage", showLabel = true, label, children, className, ...props }: ProgressRingProps) {
  const px = typeof size === "number" ? size : sizePx[size];
  const sw = strokeWidth ?? Math.max(3, Math.round(px / 12));
  const r = (px - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const offset = c * (1 - pct / 100);
  const fontSize = px <= 32 ? 9 : px <= 48 ? 12 : px <= 72 ? 16 : 22;
  return (
    <div
      data-slot="progress-ring"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label ?? `${pct}% complete`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px, height: px }}
      {...props}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} className="-rotate-90" aria-hidden="true">
        <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={sw} />
        <circle
          cx={px / 2}
          cy={px / 2}
          r={r}
          fill="none"
          stroke={toneVar[tone]}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ??
          (showLabel ? (
            <span className="font-serif font-semibold text-foreground tabular-nums" style={{ fontSize }}>
              {pct}%
            </span>
          ) : null)}
      </div>
    </div>
  );
}

export { ProgressRing };
