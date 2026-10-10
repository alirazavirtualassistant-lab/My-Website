"use client";

import * as React from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

/** localStorage key shared with <ThemeScript/>. */
export const THEME_STORAGE_KEY = "cyc-theme";
const CHANGE_EVENT = "cyc-theme-change";

function readPreference(): ThemePreference {
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies a preference to <html>: data-theme + color-scheme. Mirrors ThemeScript. */
export function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "system") {
    root.removeAttribute("data-theme");
    root.style.colorScheme = "";
  } else {
    root.setAttribute("data-theme", pref);
    root.style.colorScheme = pref;
  }
}

export function setThemePreference(pref: ThemePreference) {
  try {
    if (pref === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* storage unavailable (private mode) — still apply for this page */
  }
  applyTheme(pref);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  mq.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    mq.removeEventListener("change", onChange);
  };
}

const getServerPreference = (): ThemePreference => "system";
const getServerResolved = (): ResolvedTheme => "light";

/**
 * Theme preference + resolved theme, hydration-safe (server snapshot is
 * system/light; the client snapshot takes over after hydration without a
 * mismatch error).
 */
export function useTheme() {
  const theme = React.useSyncExternalStore(subscribe, readPreference, getServerPreference);
  const resolved = React.useSyncExternalStore(
    subscribe,
    () => {
      const p = readPreference();
      return p === "system" ? systemTheme() : p;
    },
    getServerResolved,
  );
  return { theme, resolved, setTheme: setThemePreference } as const;
}

const noopSubscribe = () => () => {};

/** false during SSR + hydration, true once the client has taken over. */
export function useIsClient(): boolean {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
