import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Illustration, isIllustrationName, type IllustrationName } from "@/components/shared/illustration";

/**
 * The importer tags courses and modules with descriptive illustration keys
 * ("healthy-plate", "family-on-a-path"); the shared line-art set has a smaller
 * vocabulary. This maps the package keys onto the built-in drawings.
 */
const KEY_MAP: Record<string, IllustrationName> = {
  "welcoming-family": "cradle",
  "family-foundation": "family",
  "healthy-plate": "plate",
  "active-couple": "path",
  "calm-family": "calm",
  "clean-home": "home",
  "connected-family": "family",
  "family-on-a-path": "path",
  bonus: "sprout",
  replay: "bloom",
};

const MODULE_CODE_MAP: Record<string, IllustrationName> = {
  M0: "cradle",
  M1: "family",
  M2: "plate",
  M3: "path",
  M4: "calm",
  M5: "home",
  M6: "family",
  M7: "harvest",
  BONUS: "sprout",
  REPLAY: "bloom",
};

export function pickIllustration(key: string | null | undefined, fallback: IllustrationName = "leaves"): IllustrationName {
  if (!key) return fallback;
  if (isIllustrationName(key)) return key;
  return KEY_MAP[key] ?? MODULE_CODE_MAP[key] ?? fallback;
}

export function moduleIllustration(code: string, key?: string | null): IllustrationName {
  if (key && isIllustrationName(key)) return key;
  if (key && KEY_MAP[key]) return KEY_MAP[key];
  return MODULE_CODE_MAP[code] ?? "leaves";
}

export interface CourseArtProps extends React.ComponentProps<"div"> {
  /** Public URL of an uploaded thumbnail, if the course has one. */
  thumbnailUrl: string | null;
  illustration: string | null;
  title: string;
  /** Pixel size of the line-art when no thumbnail exists. */
  artSize?: number;
}

/** Course thumbnail with the line-art fallback; always a 16:10 box. */
function CourseArt({ thumbnailUrl, illustration, title, artSize = 120, className, ...props }: CourseArtProps) {
  return (
    <div
      data-slot="course-art"
      className={cn("relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-rose-soft/40", className)}
      {...props}
    >
      {thumbnailUrl ? (
        <Image src={thumbnailUrl} alt="" fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      ) : (
        <Illustration name={pickIllustration(illustration, "family")} size={artSize} title={`${title} illustration`} className="text-rose-strong" />
      )}
    </div>
  );
}

export { CourseArt };
