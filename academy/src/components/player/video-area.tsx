"use client";

/**
 * Picks the right lazy-loaded player for a playback descriptor. The `none`
 * case is rendered on the server as <ComingSoonCard/>, so this only ever sees
 * `url` or `mux` (with a graceful fallback just in case).
 */
import * as React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Playback } from "./types";

const VideoPlayer = dynamic(() => import("./video-player").then((m) => m.VideoPlayer), {
  ssr: false,
  loading: () => <PlayerSkeleton />,
});
const MuxVideoPlayer = dynamic(() => import("./mux-video-player").then((m) => m.MuxVideoPlayer), {
  ssr: false,
  loading: () => <PlayerSkeleton />,
});

function PlayerSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-ink shadow-card" role="status" aria-label="Loading video">
      <Skeleton className="aspect-video w-full rounded-none bg-cream/10" />
      <div className="flex gap-2 px-3 py-2">
        <Skeleton className="h-8 w-16 bg-cream/10" />
        <Skeleton className="h-8 w-20 bg-cream/10" />
      </div>
    </div>
  );
}

export interface VideoAreaProps {
  playback: Playback;
  lessonId: string;
  lessonTitle: string;
  startSec: number;
  nextHref: string | null;
  userId?: string | null;
  className?: string;
}

function VideoArea({ playback, lessonId, lessonTitle, startSec, nextHref, userId, className }: VideoAreaProps) {
  if (playback.kind === "url") {
    return <VideoPlayer lessonId={lessonId} lessonTitle={lessonTitle} src={playback.src} captions={playback.captions} poster={playback.poster} startSec={startSec} nextHref={nextHref} className={className} />;
  }
  if (playback.kind === "mux") {
    return (
      <MuxVideoPlayer
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        playbackId={playback.playback_id}
        tokens={{ playback: playback.token, thumbnail: playback.thumbnail_token, storyboard: playback.storyboard_token }}
        startSec={startSec}
        nextHref={nextHref}
        userId={userId}
        className={className}
      />
    );
  }
  return null;
}

export { VideoArea, PlayerSkeleton };
