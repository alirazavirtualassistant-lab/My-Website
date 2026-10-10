"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type ThemePreference } from "./use-theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const META: Record<ThemePreference, { label: string; Icon: typeof Sun }> = {
  system: { label: "System theme", Icon: Monitor },
  light: { label: "Light theme", Icon: Sun },
  dark: { label: "Dark theme", Icon: Moon },
};

/**
 * Cycles system → light → dark. Persists to localStorage ("cyc-theme") and sets
 * data-theme on <html>. Renders the "system" state on the server, so there is no
 * hydration mismatch; the stored preference shows after hydration.
 */
function ThemeToggle({ className, showLabel = false, ...props }: Omit<React.ComponentProps<"button">, "onClick"> & { showLabel?: boolean }) {
  const { theme, setTheme } = useTheme();
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  const { label, Icon } = META[theme];
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${label}. Switch to ${META[next].label.toLowerCase()}`}
      title={label}
      data-theme-preference={theme}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-2.5 text-muted-foreground transition-colors hover:bg-rose-soft/50 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
      {showLabel ? <span className="text-sm font-semibold">{label.replace(" theme", "")}</span> : null}
    </button>
  );
}

export { ThemeToggle };
