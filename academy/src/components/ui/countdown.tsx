"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Remaining {
  total: number; // ms, never negative
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

/** Pure helper: time left between `now` and `to`. Exported for tests and server-side labels. */
export function getRemaining(to: string | number | Date, now: number = Date.now()): Remaining {
  const target = to instanceof Date ? to.getTime() : typeof to === "number" ? to : Date.parse(to);
  const total = Number.isFinite(target) ? Math.max(0, target - now) : 0;
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: total <= 0,
  };
}

// ---- 1-second ticker shared by every mounted countdown -----------------------
let tickNow = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribeTick(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    tickNow = Date.now();
    timer = setInterval(() => {
      tickNow = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
    // First paint after hydration should show real digits, not placeholders.
    queueMicrotask(() => listeners.forEach((l) => l()));
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
const getTick = () => tickNow;
const getServerTick = () => 0;

export interface CountdownProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** ISO string, epoch ms or Date. */
  to: string | number | Date;
  /** Text shown next to the digits, e.g. "Sale ends in". */
  label?: React.ReactNode;
  /** Compact single-line "2d 04h 12m 09s" instead of boxed units. */
  compact?: boolean;
  /** Hide the seconds unit. */
  hideSeconds?: boolean;
  /** Rendered instead of the digits once the date has passed. */
  doneText?: React.ReactNode;
  onComplete?: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Counts down to a date (sale timers, drip unlocks). Hydration-safe: renders placeholders until the client ticks. */
function Countdown({ to, label, compact = false, hideSeconds = false, doneText = "Ended", onComplete, className, ...props }: CountdownProps) {
  const now = React.useSyncExternalStore(subscribeTick, getTick, getServerTick);
  const ready = now > 0;
  const r = ready ? getRemaining(to, now) : null;
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    if (r?.done && !firedRef.current) {
      firedRef.current = true;
      onComplete?.();
    }
  }, [r?.done, onComplete]);

  const units: Array<[string, string]> = [
    ["days", r ? String(r.days) : "--"],
    ["hours", r ? pad(r.hours) : "--"],
    ["minutes", r ? pad(r.minutes) : "--"],
    ...(hideSeconds ? [] : ([["seconds", r ? pad(r.seconds) : "--"]] as Array<[string, string]>)),
  ];
  const srText = r
    ? r.done
      ? "Ended"
      : `${r.days} days, ${r.hours} hours, ${r.minutes} minutes${hideSeconds ? "" : `, ${r.seconds} seconds`} remaining`
    : "Loading countdown";

  return (
    <div
      data-slot="countdown"
      role="timer"
      aria-live="off"
      aria-label={typeof label === "string" ? label : undefined}
      className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...props}
    >
      {label ? <span className="text-sm font-semibold text-muted-foreground">{label}</span> : null}
      <span className="sr-only">{srText}</span>
      {r?.done ? (
        <span aria-hidden="true" className="text-sm font-semibold text-foreground">
          {doneText}
        </span>
      ) : compact ? (
        <span aria-hidden="true" className="font-serif text-lg font-semibold text-foreground tabular-nums">
          {units.map(([u, v]) => `${v}${u[0]}`).join(" ")}
        </span>
      ) : (
        <span aria-hidden="true" className="inline-flex items-start gap-1.5">
          {units.map(([u, v]) => (
            <span key={u} className="flex min-w-11 flex-col items-center rounded-lg border border-border bg-card px-2 py-1 shadow-soft">
              <span className="font-serif text-xl leading-none font-semibold text-rose-strong tabular-nums">{v}</span>
              <span className="mt-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{u.slice(0, 3)}</span>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export { Countdown };
