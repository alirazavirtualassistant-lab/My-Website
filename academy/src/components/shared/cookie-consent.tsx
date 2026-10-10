"use client";

import * as React from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export const COOKIE_CONSENT_KEY = "cyc-cookie-consent";
const CHANGE_EVENT = "cyc-consent-change";

export type ConsentValue = "all" | "essential";

/** Current stored consent, or null when the visitor has not chosen yet. Client only. */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

/** True only when the visitor accepted analytics cookies. */
export function hasAnalyticsConsent(): boolean {
  return getConsent() === "all";
}

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    /* storage unavailable — treat as session-only choice */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

type Snapshot = ConsentValue | "none" | "unknown";
const getSnapshot = (): Snapshot => getConsent() ?? "none";
const getServerSnapshot = (): Snapshot => "unknown";

/** Hydration-safe consent state: "unknown" on the server, then the stored value or "none". */
export function useConsent(): Snapshot {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Bottom cookie banner. Stores "all" | "essential" under localStorage
 * "cyc-cookie-consent". Nothing renders on the server, so there is no flash for
 * returning visitors who already chose.
 */
function CookieConsent({ className }: { className?: string }) {
  const consent = useConsent();
  if (consent !== "none") return null;
  return (
    <section
      role="region"
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-border bg-card p-4 text-sm text-foreground shadow-card sm:inset-x-auto sm:right-4 sm:bottom-4 print:hidden",
        className,
      )}
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-rose-strong" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg leading-tight font-medium">A small note about cookies</p>
          <p className="mt-1 text-muted-foreground">
            We use essential cookies to keep you signed in and, only with your okay, a privacy-friendly analytics cookie to see
            which lessons help most. Read our{" "}
            <Link href="/cookies" className="font-semibold text-rose-strong underline underline-offset-2">
              cookie policy
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConsent("all")}
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => setConsent("essential")}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none"
            >
              Essential only
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CookieConsent };
