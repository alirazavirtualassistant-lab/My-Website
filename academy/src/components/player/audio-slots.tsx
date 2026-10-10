import * as React from "react";
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioSlotView {
  key: string;
  label: string;
  /** Signed URL when the file exists, else null. */
  url: string | null;
}

/** One card per `lesson.audio_slots` entry: a native player or a calm "coming soon" state. */
function AudioSlots({ slots, className }: { slots: AudioSlotView[]; className?: string }) {
  if (slots.length === 0) return null;
  return (
    <section aria-label="Lesson audio" className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {slots.map((slot) => (
        <div key={slot.key} className="card-soft flex flex-col gap-3 p-4">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <Headphones className="size-4 text-rose-strong" aria-hidden="true" />
            {slot.label}
          </p>
          {slot.url ? (
            <audio controls preload="none" src={slot.url} className="w-full" aria-label={slot.label}>
              Your browser does not support embedded audio.
            </audio>
          ) : (
            <p className="rounded-md border border-dashed border-gold/60 bg-gold-soft/40 px-3 py-2 text-xs text-muted-foreground">Audio coming soon</p>
          )}
        </div>
      ))}
    </section>
  );
}

export { AudioSlots };
