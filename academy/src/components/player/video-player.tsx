"use client";

/**
 * HTML5 player for `{ kind: "url" }` playback: resume, speed menu, captions,
 * keyboard shortcuts, position pings (server action every 10s + on pause,
 * sendBeacon on unload) and auto-advance when the lesson ends.
 */
import * as React from "react";
import { useRouter } from "next/navigation";
import { Captions, CaptionsOff, Gauge, Keyboard, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateLessonPositionAction } from "@/app/(learner)/learn/[course]/[lesson]/actions";
import { PLAYBACK_SPEEDS, SHORTCUT_HELP, formatClock, isTypingTarget, shortcutAction, stepSpeed } from "./transcript-utils";
import { readAutoAdvance, usePlayerStore } from "./player-store";

export const POSITION_BEACON_URL = "/api/lessons/position";
const PING_INTERVAL_MS = 10_000;
const AUTO_ADVANCE_SECONDS = 5;

export interface VideoPlayerProps {
  lessonId: string;
  lessonTitle: string;
  src: string;
  captions: string | null;
  poster: string | null;
  /** Resume point from lesson_progress.last_position_sec. */
  startSec: number;
  nextHref: string | null;
  className?: string;
}

/** True when a Radix dialog/sheet is open: shortcuts must not fire behind it. */
function overlayIsOpen(): boolean {
  return !!document.querySelector('[data-slot="dialog-content"], [data-slot="sheet-content"]');
}

function sendBeacon(lessonId: string, positionSec: number, watchedDeltaSec: number) {
  try {
    const body = JSON.stringify({ lessonId, positionSec: Math.floor(positionSec), watchedDeltaSec: Math.floor(watchedDeltaSec) });
    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(POSITION_BEACON_URL, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(POSITION_BEACON_URL, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* best effort */
  }
}

function VideoPlayer({ lessonId, lessonTitle, src, captions, poster, startSec, nextHref, className }: VideoPlayerProps) {
  const router = useRouter();
  const { registerPlayer } = usePlayerStore();
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [speed, setSpeed] = React.useState<number>(1);
  const [captionsOn, setCaptionsOn] = React.useState<boolean>(!!captions);
  const [resumedFrom, setResumedFrom] = React.useState<number | null>(null);
  const [ended, setEnded] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | null>(null);
  const [announce, setAnnounce] = React.useState("");

  // Watched-time accounting between pings.
  const lastTimeRef = React.useRef(0);
  const watchedRef = React.useRef(0);
  const lastPingAtRef = React.useRef(0);

  const flushPing = React.useCallback(
    (useBeacon = false) => {
      const v = videoRef.current;
      if (!v) return;
      const position = v.currentTime;
      const watched = watchedRef.current;
      watchedRef.current = 0;
      lastPingAtRef.current = Date.now();
      if (useBeacon) {
        sendBeacon(lessonId, position, watched);
        return;
      }
      void updateLessonPositionAction({ lessonId, positionSec: Math.floor(position), watchedDeltaSec: Math.floor(watched) }).catch(() => {});
    },
    [lessonId],
  );

  // Bridge for transcript chips + notes.
  React.useEffect(() => {
    return registerPlayer({
      seek: (sec) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, sec);
        void v.play().catch(() => {});
        wrapperRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      },
      getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    });
  }, [registerPlayer]);

  // Periodic pings while playing; beacon on unload / tab hidden.
  React.useEffect(() => {
    const id = window.setInterval(() => {
      const v = videoRef.current;
      if (!v || v.paused || v.ended) return;
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
      // Leaving the page client-side (next lesson): keep the position.
      flushPing(true);
    };
  }, [flushPing]);

  // Keyboard shortcuts (global, except while typing or behind an overlay).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (isTypingTarget(e.target as HTMLElement | null) && !(wrapperRef.current && wrapperRef.current === e.target)) return;
      if (overlayIsOpen()) return;
      const v = videoRef.current;
      if (!v) return;
      const action = shortcutAction(e);
      if (!action) return;
      e.preventDefault();
      switch (action.type) {
        case "togglePlay":
          if (v.paused) void v.play().catch(() => {});
          else v.pause();
          break;
        case "seek":
          v.currentTime = Math.min(Math.max(0, v.currentTime + action.deltaSec), Number.isFinite(v.duration) ? v.duration : Infinity);
          setAnnounce(`${action.deltaSec > 0 ? "Forward" : "Back"} ${Math.abs(action.deltaSec)} seconds, now at ${formatClock(v.currentTime)}`);
          break;
        case "toggleMute":
          v.muted = !v.muted;
          setAnnounce(v.muted ? "Muted" : "Sound on");
          break;
        case "toggleFullscreen":
          if (document.fullscreenElement) void document.exitFullscreen?.();
          else void (wrapperRef.current ?? v).requestFullscreen?.();
          break;
        case "toggleCaptions":
          toggleCaptions();
          break;
        case "speed":
          applySpeed(stepSpeed(v.playbackRate, action.direction));
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance countdown after the video ends.
  React.useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (nextHref) router.push(nextHref);
      return;
    }
    const id = window.setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [countdown, nextHref, router]);

  function applySpeed(rate: number) {
    const v = videoRef.current;
    if (v) v.playbackRate = rate;
    setSpeed(rate);
    setAnnounce(`Speed ${rate}×`);
  }

  function toggleCaptions() {
    const v = videoRef.current;
    if (!v || !captions) return;
    const track = v.textTracks?.[0];
    const next = !captionsOn;
    if (track) track.mode = next ? "showing" : "hidden";
    setCaptionsOn(next);
    setAnnounce(next ? "Captions on" : "Captions off");
  }

  function onLoadedMetadata() {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
    if (captions) {
      const track = v.textTracks?.[0];
      if (track) track.mode = captionsOn ? "showing" : "hidden";
    }
    const duration = Number.isFinite(v.duration) ? v.duration : Infinity;
    if (startSec > 3 && startSec < duration - 5) {
      v.currentTime = startSec;
      lastTimeRef.current = startSec;
      setResumedFrom(startSec);
    }
  }

  function onTimeUpdate() {
    const v = videoRef.current;
    if (!v) return;
    const delta = v.currentTime - lastTimeRef.current;
    if (delta > 0 && delta < 2) watchedRef.current += delta;
    lastTimeRef.current = v.currentTime;
  }

  function onEnded() {
    setEnded(true);
    flushPing(false);
    if (nextHref && readAutoAdvance()) setCountdown(AUTO_ADVANCE_SECONDS);
  }

  function restart() {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    setCountdown(null);
    v.currentTime = 0;
    void v.play().catch(() => {});
  }

  return (
    <div
      ref={wrapperRef}
      data-slot="video-player"
      role="region"
      aria-label={`Video player: ${lessonTitle}. Keyboard shortcuts available.`}
      tabIndex={0}
      className={cn("group/player relative overflow-hidden rounded-lg border border-border bg-ink shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", className)}
    >
      <video
        ref={videoRef}
        className="aspect-video w-full bg-black"
        controls
        playsInline
        preload="metadata"
        src={src}
        poster={poster ?? undefined}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPause={() => {
          if (!videoRef.current?.ended) flushPing(false);
        }}
        onPlay={() => setEnded(false)}
        onEnded={onEnded}
        onRateChange={() => {
          const r = videoRef.current?.playbackRate;
          if (r && Math.abs(r - speed) > 0.001) setSpeed(r);
        }}
      >
        {captions ? <track kind="captions" src={captions} srcLang="en" label="English" default /> : null}
        Your browser does not support embedded video.
      </video>

      {ended ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 p-6 text-center text-cream" role="status">
          {countdown !== null && nextHref ? (
            <>
              <p className="font-serif text-2xl">Up next in {countdown}s</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="gold" onClick={() => router.push(nextHref)}>
                  <SkipForward aria-hidden="true" />
                  Go now
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent text-cream hover:bg-cream/10 hover:text-cream" onClick={() => setCountdown(null)}>
                  Stay here
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="font-serif text-2xl">That is the end of this lesson</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="outline" className="bg-transparent text-cream hover:bg-cream/10 hover:text-cream" onClick={restart}>
                  <RotateCcw aria-hidden="true" />
                  Watch again
                </Button>
                {nextHref ? (
                  <Button size="sm" variant="gold" onClick={() => router.push(nextHref)}>
                    <SkipForward aria-hidden="true" />
                    Next lesson
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-cream/10 bg-ink px-3 py-2 text-cream">
        {resumedFrom !== null ? <p className="mr-auto text-xs text-cream/70">Resumed from {formatClock(resumedFrom)}</p> : <span className="mr-auto" />}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-cream hover:bg-cream/10 hover:text-cream" aria-label={`Playback speed, currently ${speed}×`}>
              <Gauge aria-hidden="true" />
              {speed}×
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Playback speed</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={String(speed)} onValueChange={(v) => applySpeed(Number(v))}>
              {PLAYBACK_SPEEDS.map((s) => (
                <DropdownMenuRadioItem key={s} value={String(s)}>
                  {s === 1 ? "Normal" : `${s}×`}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {captions ? (
          <Button size="sm" variant="ghost" className="text-cream hover:bg-cream/10 hover:text-cream" aria-pressed={captionsOn} onClick={toggleCaptions}>
            {captionsOn ? <Captions aria-hidden="true" /> : <CaptionsOff aria-hidden="true" />}
            Captions
          </Button>
        ) : null}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="ghost" className="text-cream hover:bg-cream/10 hover:text-cream" aria-label="Keyboard shortcuts">
              <Keyboard aria-hidden="true" />
              <span className="hidden sm:inline">Shortcuts</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <p className="text-sm font-semibold">Keyboard shortcuts</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              {SHORTCUT_HELP.map((h) => (
                <React.Fragment key={h.keys}>
                  <dt className="font-mono text-muted-foreground">{h.keys}</dt>
                  <dd>{h.action}</dd>
                </React.Fragment>
              ))}
            </dl>
          </PopoverContent>
        </Popover>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

export { VideoPlayer };
