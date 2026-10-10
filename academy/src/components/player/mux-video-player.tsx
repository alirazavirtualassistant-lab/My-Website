"use client";

/**
 * Mux playback (`{ kind: "mux" }`): signed playback/thumbnail/storyboard
 * tokens, resume, the same speed ladder, position pings and auto-advance.
 * Keyboard shortcuts (space, arrows, m, f, c …) are built into mux-player.
 */
import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type MuxPlayerElement from "@mux/mux-player";
import { SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { updateLessonPositionAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { PLAYBACK_SPEEDS } from "./transcript-utils";
import { readAutoAdvance, usePlayerStore } from "./player-store";
import { POSITION_BEACON_URL } from "./video-player";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full rounded-lg" aria-label="Loading video" />,
});

const PING_INTERVAL_MS = 10_000;
const AUTO_ADVANCE_SECONDS = 5;

export interface MuxVideoPlayerProps {
  lessonId: string;
  lessonTitle: string;
  playbackId: string;
  tokens: { playback: string; thumbnail: string | null; storyboard: string | null };
  startSec: number;
  nextHref: string | null;
  userId?: string | null;
  className?: string;
}

function MuxVideoPlayer({ lessonId, lessonTitle, playbackId, tokens, startSec, nextHref, userId, className }: MuxVideoPlayerProps) {
  const router = useRouter();
  const { registerPlayer } = usePlayerStore();
  const ref = React.useRef<MuxPlayerElement | null>(null);
  const lastTimeRef = React.useRef(startSec);
  const watchedRef = React.useRef(0);
  const [ended, setEnded] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);

  const flushPing = React.useCallback(
    (useBeacon = false) => {
      const el = ref.current;
      if (!el) return;
      const position = Math.floor(el.currentTime ?? 0);
      const watched = Math.floor(watchedRef.current);
      watchedRef.current = 0;
      if (useBeacon) {
        try {
          const body = JSON.stringify({ lessonId, positionSec: position, watchedDeltaSec: watched });
          if (typeof navigator.sendBeacon === "function") navigator.sendBeacon(POSITION_BEACON_URL, new Blob([body], { type: "application/json" }));
          else void fetch(POSITION_BEACON_URL, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
        } catch {
          /* best effort */
        }
        return;
      }
      void updateLessonPositionAction({ lessonId, positionSec: position, watchedDeltaSec: watched }).catch(() => {});
    },
    [lessonId],
  );

  React.useEffect(() => {
    return registerPlayer({
      seek: (sec) => {
        const el = ref.current;
        if (!el) return;
        el.currentTime = Math.max(0, sec);
        void el.play?.()?.catch?.(() => {});
      },
      getCurrentTime: () => ref.current?.currentTime ?? 0,
    });
  }, [registerPlayer]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      const el = ref.current;
      if (!el || el.paused || el.ended) return;
      flushPing(false);
    }, PING_INTERVAL_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") flushPing(true);
    };
    const onPageHide = () => flushPing(true);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      flushPing(true);
    };
  }, [flushPing]);

  React.useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (nextHref) router.push(nextHref);
      setCountdown(null);
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, nextHref, router]);

  return (
    <div data-slot="mux-player" className={cn("relative overflow-hidden rounded-lg border border-border bg-ink shadow-card", className)}>
      <MuxPlayer
        ref={ref}
        playbackId={playbackId}
        tokens={{ playback: tokens.playback, thumbnail: tokens.thumbnail ?? undefined, storyboard: tokens.storyboard ?? undefined }}
        streamType="on-demand"
        startTime={startSec > 3 ? startSec : 0}
        playbackRates={[...PLAYBACK_SPEEDS]}
        accentColor="#b5656b"
        primaryColor="#fbf6ef"
        metadataVideoTitle={lessonTitle}
        metadataViewerUserId={userId ?? undefined}
        title={lessonTitle}
        className="aspect-video w-full"
        style={{ aspectRatio: "16 / 9", width: "100%" }}
        onTimeUpdate={() => {
          const el = ref.current;
          if (!el) return;
          const t = el.currentTime ?? 0;
          const delta = t - lastTimeRef.current;
          if (delta > 0 && delta < 2) watchedRef.current += delta;
          lastTimeRef.current = t;
        }}
        onPause={() => {
          if (!ref.current?.ended) flushPing(false);
        }}
        onPlay={() => setEnded(false)}
        onEnded={() => {
          setEnded(true);
          flushPing(false);
          if (nextHref && readAutoAdvance()) setCountdown(AUTO_ADVANCE_SECONDS);
        }}
      />
      {ended && nextHref ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream/10 bg-ink px-3 py-2 text-cream" role="status">
          <p className="text-sm">{countdown !== null ? `Up next in ${countdown}s` : "That is the end of this lesson"}</p>
          <div className="flex gap-2">
            {countdown !== null ? (
              <Button size="sm" variant="outline" className="bg-transparent text-cream hover:bg-cream/10 hover:text-cream" onClick={() => setCountdown(null)}>
                Stay here
              </Button>
            ) : null}
            <Button size="sm" variant="gold" onClick={() => router.push(nextHref)}>
              <SkipForward aria-hidden="true" />
              Next lesson
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { MuxVideoPlayer };
