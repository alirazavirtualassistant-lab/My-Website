"use client";

/**
 * Client-side state shared across the lesson page:
 *
 * - optimistic completion set (sidebar checkmarks + progress bar update the
 *   moment "Mark complete" is pressed, before the server round-trip finishes);
 * - a bridge to whichever video player is mounted (seek / current time), used
 *   by transcript time chips and "Add note at current time";
 * - the auto-advance preference (localStorage).
 */
import * as React from "react";

export const AUTO_ADVANCE_KEY = "cyc-player-auto-advance";
const AUTO_ADVANCE_EVENT = "cyc-player-auto-advance-change";

export interface PlayerBridge {
  seek: (sec: number) => void;
  getCurrentTime: () => number;
}

interface PlayerStoreValue {
  completedIds: ReadonlySet<string>;
  totalLessons: number;
  percent: number;
  markCompleted: (lessonId: string) => void;
  unmarkCompleted: (lessonId: string) => void;
  isCompleted: (lessonId: string) => boolean;
  /** Called by the mounted player; returns an unregister function. */
  registerPlayer: (bridge: PlayerBridge) => () => void;
  hasPlayer: boolean;
  seekTo: (sec: number) => void;
  currentTime: () => number;
}

const PlayerStoreContext = React.createContext<PlayerStoreValue | null>(null);

export interface PlayerStoreProviderProps {
  initialCompletedIds: string[];
  totalLessons: number;
  children: React.ReactNode;
}

function PlayerStoreProvider({ initialCompletedIds, totalLessons, children }: PlayerStoreProviderProps) {
  const [completedIds, setCompletedIds] = React.useState<ReadonlySet<string>>(() => new Set(initialCompletedIds));
  const [hasPlayer, setHasPlayer] = React.useState(false);
  const bridgeRef = React.useRef<PlayerBridge | null>(null);

  // Keep in sync when the server re-renders with fresh data (router.refresh()).
  const serverKey = initialCompletedIds.join("|");
  React.useEffect(() => {
    setCompletedIds((prev) => {
      const next = new Set(initialCompletedIds);
      // Preserve optimistic additions that the server has not confirmed yet.
      for (const id of prev) next.add(id);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverKey]);

  const markCompleted = React.useCallback((lessonId: string) => {
    setCompletedIds((prev) => (prev.has(lessonId) ? prev : new Set([...prev, lessonId])));
  }, []);
  const unmarkCompleted = React.useCallback((lessonId: string) => {
    setCompletedIds((prev) => {
      if (!prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.delete(lessonId);
      return next;
    });
  }, []);
  const isCompleted = React.useCallback((lessonId: string) => completedIds.has(lessonId), [completedIds]);

  const registerPlayer = React.useCallback((bridge: PlayerBridge) => {
    bridgeRef.current = bridge;
    setHasPlayer(true);
    return () => {
      if (bridgeRef.current === bridge) {
        bridgeRef.current = null;
        setHasPlayer(false);
      }
    };
  }, []);
  const seekTo = React.useCallback((sec: number) => bridgeRef.current?.seek(sec), []);
  const currentTime = React.useCallback(() => bridgeRef.current?.getCurrentTime() ?? 0, []);

  const percent = totalLessons > 0 ? Math.round((100 * Math.min(completedIds.size, totalLessons)) / totalLessons) : 0;

  const value = React.useMemo<PlayerStoreValue>(
    () => ({ completedIds, totalLessons, percent, markCompleted, unmarkCompleted, isCompleted, registerPlayer, hasPlayer, seekTo, currentTime }),
    [completedIds, totalLessons, percent, markCompleted, unmarkCompleted, isCompleted, registerPlayer, hasPlayer, seekTo, currentTime],
  );
  return <PlayerStoreContext.Provider value={value}>{children}</PlayerStoreContext.Provider>;
}

/** Null-safe: components rendered outside the provider (course overview) get inert defaults. */
function usePlayerStore(): PlayerStoreValue {
  const ctx = React.useContext(PlayerStoreContext);
  return ctx ?? FALLBACK;
}

const FALLBACK: PlayerStoreValue = {
  completedIds: new Set(),
  totalLessons: 0,
  percent: 0,
  markCompleted: () => {},
  unmarkCompleted: () => {},
  isCompleted: () => false,
  registerPlayer: () => () => {},
  hasPlayer: false,
  seekTo: () => {},
  currentTime: () => 0,
};

// ---------------------------------------------------------------------------
// Auto-advance preference
// ---------------------------------------------------------------------------

export function readAutoAdvance(): boolean {
  try {
    return window.localStorage.getItem(AUTO_ADVANCE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function writeAutoAdvance(on: boolean) {
  try {
    window.localStorage.setItem(AUTO_ADVANCE_KEY, on ? "on" : "off");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(AUTO_ADVANCE_EVENT));
}

function subscribeAutoAdvance(onChange: () => void) {
  window.addEventListener(AUTO_ADVANCE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(AUTO_ADVANCE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Hydration-safe (server snapshot = on). */
export function useAutoAdvance(): [boolean, (on: boolean) => void] {
  const on = React.useSyncExternalStore(subscribeAutoAdvance, readAutoAdvance, () => true);
  return [on, writeAutoAdvance];
}

export { PlayerStoreProvider, usePlayerStore };
