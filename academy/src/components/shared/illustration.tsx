import * as React from "react";
import { cn } from "@/lib/utils";

export const ILLUSTRATION_NAMES = [
  "family",
  "plate",
  "path",
  "leaves",
  "cradle",
  "home",
  "calm",
  "seedling",
  "sprout",
  "bloom",
  "harvest",
] as const;

export type IllustrationName = (typeof ILLUSTRATION_NAMES)[number];

export function isIllustrationName(name: string | null | undefined): name is IllustrationName {
  return !!name && (ILLUSTRATION_NAMES as readonly string[]).includes(name);
}

export interface IllustrationProps extends Omit<React.ComponentProps<"svg">, "name"> {
  name: IllustrationName;
  /** Accessible title. Without it the illustration is decorative (aria-hidden). */
  title?: string;
  /** Pixel size; omit to fill the parent width (square aspect). */
  size?: number;
  /** Draw everything in currentColor (no rose/gold/sage accents). */
  mono?: boolean;
}

const ROSE = "var(--rose)";
const GOLD = "var(--gold)";
const SAGE = "var(--sage-strong)";

type Palette = { rose: string; gold: string; sage: string };

const art: Record<IllustrationName, (p: Palette) => React.ReactNode> = {
  family: (p) => (
    <>
      <circle cx="38" cy="36" r="9" />
      <path d="M22 94c0-22 6-34 16-34s16 12 16 34" />
      <circle cx="82" cy="36" r="9" />
      <path d="M66 94c0-22 6-34 16-34s16 12 16 34" />
      <circle cx="60" cy="60" r="6.5" />
      <path d="M49 94c0-13 4-20 11-20s11 7 11 20" />
      <path d="M14 100h92" stroke={p.gold} />
    </>
  ),
  plate: (p) => (
    <>
      <path d="M20 62h80c0 20-16 34-40 34S20 82 20 62Z" />
      <path d="M46 96l2 8h24l2-8" />
      <path d="M28 70c8 4 56 4 64 0" stroke={p.gold} />
      <path d="M60 62V34" stroke={p.sage} />
      <path d="M60 50c-10 0-16-7-16-18 10 0 16 8 16 18Z" stroke={p.sage} />
      <path d="M60 42c10 0 17-7 17-18-10 0-17 8-17 18Z" stroke={p.sage} />
      <circle cx="80" cy="24" r="2" fill={p.gold} stroke="none" />
    </>
  ),
  path: (p) => (
    <>
      <path d="M14 102c30 0 14-40 44-40s14-40 46-40" strokeDasharray="6 7" />
      <ellipse cx="30" cy="92" rx="3" ry="4.5" transform="rotate(-20 30 92)" stroke={p.gold} />
      <ellipse cx="40" cy="84" rx="3" ry="4.5" transform="rotate(-20 40 84)" stroke={p.gold} />
      <ellipse cx="62" cy="56" rx="3" ry="4.5" transform="rotate(-20 62 56)" stroke={p.gold} />
      <ellipse cx="72" cy="48" rx="3" ry="4.5" transform="rotate(-20 72 48)" stroke={p.gold} />
      <circle cx="104" cy="22" r="4" fill={p.rose} stroke="none" />
      <circle cx="104" cy="22" r="9" stroke={p.rose} />
    </>
  ),
  leaves: (p) => (
    <>
      <path d="M26 100C40 70 60 46 94 22" />
      <path d="M42 70c-8-10-4-22 10-24 2 12-2 20-10 24Z" stroke={p.sage} />
      <path d="M52 58c12-2 20 6 20 18-12 0-18-8-20-18Z" stroke={p.sage} />
      <path d="M64 44c-6-12 0-22 14-22 0 12-6 20-14 22Z" stroke={p.sage} />
      <path d="M72 36c12-4 22 2 24 14-12 2-20-4-24-14Z" stroke={p.sage} />
      <circle cx="96" cy="20" r="2.5" fill={p.gold} stroke="none" />
    </>
  ),
  cradle: (p) => (
    <>
      <path d="M16 44c6 38 82 38 88 0-10 24-78 24-88 0Z" />
      <path d="M30 92c10 8 50 8 60 0" stroke={p.gold} />
      <path d="M60 60c-6-8-4-20 8-24 2 12-2 20-8 24Z" stroke={p.sage} />
      <path d="M60 60l6-16" stroke={p.sage} />
      <path d="M32 20v8M28 24h8" stroke={p.gold} />
      <path d="M88 14v6M85 17h6" stroke={p.gold} />
    </>
  ),
  home: (p) => (
    <>
      <path d="M18 60L60 24l42 36" />
      <path d="M30 52v44h60V52" />
      <path d="M52 96V76h16v20" />
      <path d="M60 60c0 0-9-6-9-12 0-4 4-6 9-2 5-4 9-2 9 2 0 6-9 12-9 12Z" stroke={p.rose} />
      <path d="M14 100h92" stroke={p.gold} />
    </>
  ),
  calm: (p) => (
    <>
      <path d="M28 40a32 32 0 0 1 64 0" stroke={p.gold} strokeDasharray="3 6" />
      <circle cx="60" cy="38" r="10" />
      <path d="M40 84c0-20 8-32 20-32s20 12 20 32" />
      <path d="M44 62c-6 8-10 14-8 22M76 62c6 8 10 14 8 22" />
      <path d="M22 90c12-8 26-8 38-2 12-6 26-6 38 2" />
      <path d="M30 100h60" stroke={p.sage} />
    </>
  ),
  seedling: (p) => (
    <>
      <path d="M28 96h64" stroke={p.gold} />
      <path d="M60 96V68" />
      <path d="M60 72c-10 0-16-8-16-18 10 0 16 8 16 18Z" stroke={p.sage} />
      <path d="M60 72c10 0 16-8 16-18-10 0-16 8-16 18Z" stroke={p.sage} />
    </>
  ),
  sprout: (p) => (
    <>
      <path d="M28 100h64" stroke={p.gold} />
      <path d="M60 100c0-14-2-28 0-42 1-8 2-14 0-24" />
      <path d="M60 70c-12 0-20-8-20-20 12 0 20 8 20 20Z" stroke={p.sage} />
      <path d="M60 54c12 0 20-8 20-20-12 0-20 8-20 20Z" stroke={p.sage} />
      <path d="M60 34c-6-2-8-8-6-12 4 2 7 6 6 12Z" stroke={p.sage} />
    </>
  ),
  bloom: (p) => (
    <>
      <path d="M28 100h64" stroke={p.gold} />
      <path d="M60 100V56" />
      <path d="M60 86c-10 0-18-8-18-18 10 0 18 8 18 18Z" stroke={p.sage} />
      <path d="M60 78c10 0 18-8 18-18-10 0-18 8-18 18Z" stroke={p.sage} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M60 31c-4-6-4-14 0-19 4 5 4 13 0 19Z" transform={`rotate(${a} 60 36)`} stroke={p.rose} />
      ))}
      <circle cx="60" cy="36" r="5" stroke={p.gold} />
    </>
  ),
  harvest: (p) => (
    <>
      <path d="M22 66h76c0 18-14 32-38 32S22 84 22 66Z" stroke={p.gold} />
      <path d="M28 74c8 4 56 4 64 0" stroke={p.gold} />
      <circle cx="44" cy="58" r="9" stroke={p.rose} />
      <circle cx="62" cy="50" r="11" stroke={p.rose} />
      <circle cx="80" cy="58" r="8" stroke={p.rose} />
      <path d="M62 39c-2-6 0-12 6-14 1 6-1 11-6 14Z" stroke={p.sage} />
      <path d="M62 39l4-9" stroke={p.sage} />
      <path d="M14 104h92" />
    </>
  ),
};

/**
 * Single-stroke line-art illustrations in the brand palette. Decorative by
 * default (aria-hidden); pass `title` to make it meaningful.
 *
 * <Illustration name="seedling" className="size-24 text-rose-strong" />
 */
function Illustration({ name, title, size, mono = false, className, ...props }: IllustrationProps) {
  const palette: Palette = mono ? { rose: "currentColor", gold: "currentColor", sage: "currentColor" } : { rose: ROSE, gold: GOLD, sage: SAGE };
  const titleId = React.useId();
  const render = art[name] ?? art.leaves;
  return (
    <svg
      data-slot="illustration"
      data-name={name}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? titleId : undefined}
      focusable="false"
      className={cn("shrink-0", !size && "h-auto w-full", className)}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {render(palette)}
    </svg>
  );
}

export { Illustration };
