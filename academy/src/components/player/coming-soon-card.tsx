import * as React from "react";
import Image from "next/image";
import { Video, FileText, Clock } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { Illustration, type IllustrationName } from "@/components/shared/illustration";

export interface ComingSoonCardProps extends React.ComponentProps<"div"> {
  title: string;
  durationSec: number;
  /** Public URL of the lesson thumbnail, when one exists. */
  thumbnailUrl: string | null;
  illustration: IllustrationName;
  /** Admins only: the file name the recording is expected under. */
  plannedFileName?: string | null;
  showPlannedFileName?: boolean;
  /** Anchor of the transcript tab/section. */
  transcriptHref?: string;
}

/**
 * Branded placeholder shown where the video will go until the recording is
 * uploaded. Calm, no countdowns: the transcript is the full script already.
 */
function ComingSoonCard({ title, durationSec, thumbnailUrl, illustration, plannedFileName, showPlannedFileName = false, transcriptHref = "#transcript", className, ...props }: ComingSoonCardProps) {
  return (
    <div
      data-slot="coming-soon-card"
      role="note"
      aria-label="Video coming soon"
      className={cn("relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gold/60 bg-gold-soft/40 p-6 text-center", className)}
      {...props}
    >
      {thumbnailUrl ? (
        <>
          <Image src={thumbnailUrl} alt="" fill unoptimized sizes="(min-width: 1280px) 60vw, 100vw" className="object-cover opacity-30" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-cream/90 via-cream/60 to-transparent" />
        </>
      ) : null}
      <div className="relative flex max-w-md flex-col items-center gap-2">
        {!thumbnailUrl ? <Illustration name={illustration} size={96} className="text-rose-strong sm:size-28" /> : null}
        <p className="eyebrow inline-flex items-center gap-2">
          <Video className="size-3.5" aria-hidden="true" />
          Video coming soon
        </p>
        <p className="font-serif text-2xl leading-tight font-medium text-foreground sm:text-3xl">{title}</p>
        <p className="text-sm text-muted-foreground">
          <a href={transcriptHref} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline underline-offset-4">
            <FileText className="size-4" aria-hidden="true" />
            Read the transcript below
          </a>
          {durationSec > 0 ? (
            <span className="ml-3 inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              about {formatDuration(durationSec)}
            </span>
          ) : null}
        </p>
        {showPlannedFileName && plannedFileName ? (
          <p className="mt-2 font-mono text-[11px] text-muted-foreground/80" title="Only admins see this">
            Expected file: {plannedFileName}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { ComingSoonCard };
