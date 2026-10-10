import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoMarkProps extends React.ComponentProps<"svg"> {
  size?: number;
  /** Draw the mark in a single colour (currentColor) instead of rose/sage/gold. */
  mono?: boolean;
}

/**
 * The organic mark: a crescent cradle (rose) holding a rising leaf (sage) with a
 * small gold seed. Single-stroke line art that reads at 16px and up.
 */
function LogoMark({ size = 32, mono = false, className, ...props }: LogoMarkProps) {
  const rose = mono ? "currentColor" : "var(--rose)";
  const sage = mono ? "currentColor" : "var(--sage-strong)";
  const gold = mono ? "currentColor" : "var(--gold)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* cradle */}
      <path d="M3.5 15.5C5 25 27 25 28.5 15.5" stroke={rose} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 24.5c3.5 2.6 12.5 2.6 16 0" stroke={rose} strokeWidth="1.5" strokeLinecap="round" />
      {/* leaf */}
      <path d="M16 18.5c-4-3.5-3-10 4.5-12.5c1 6.5-1 10.5-4.5 12.5Z" stroke={sage} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 18.5l3.6-8.4" stroke={sage} strokeWidth="1.4" strokeLinecap="round" />
      {/* seed */}
      <circle cx="25.5" cy="7.5" r="1.8" fill={gold} />
    </svg>
  );
}

export interface LogoProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** `full` = mark + wordmark; `mark` = the mark only. */
  variant?: "full" | "mark";
  /** Rendered height in px. Looks right at 28 and 40. */
  height?: number;
  /** Append a small "Academy" label under/next to the wordmark. */
  academy?: boolean;
  mono?: boolean;
}

/**
 * Brand lockup. Inline SVG mark + serif wordmark "Cradle Your Cravings".
 * Wrap it in a <Link href="/"> where it should navigate.
 */
function Logo({ variant = "full", height = 32, academy = true, mono = false, className, ...props }: LogoProps) {
  const markSize = Math.round(height * 0.95);
  const fontSize = Math.round(height * 0.62);
  if (variant === "mark") {
    return (
      <span className={cn("inline-flex items-center", className)} {...props}>
        <LogoMark size={height} mono={mono} />
        <span className="sr-only">Cradle Your Cravings Academy</span>
      </span>
    );
  }
  return (
    <span data-slot="logo" className={cn("inline-flex items-center gap-2 text-foreground", className)} style={{ height }} {...props}>
      <LogoMark size={markSize} mono={mono} />
      <span className="flex flex-col justify-center leading-none">
        <span
          aria-hidden="true"
          className="font-serif font-semibold tracking-tight whitespace-nowrap"
          style={{ fontSize, lineHeight: 1 }}
        >
          Cradle Your Cravings
        </span>
        {academy && height >= 36 ? (
          <span
            aria-hidden="true"
            className={cn("mt-1 font-sans font-bold tracking-[0.28em] uppercase", mono ? "opacity-70" : "text-rose-strong")}
            style={{ fontSize: Math.max(8, Math.round(height * 0.22)), lineHeight: 1 }}
          >
            Academy
          </span>
        ) : null}
        <span className="sr-only">Cradle Your Cravings Academy</span>
      </span>
    </span>
  );
}

export { Logo, LogoMark };
