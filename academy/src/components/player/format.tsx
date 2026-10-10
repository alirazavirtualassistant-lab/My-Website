import * as React from "react";
import { FileText, FileSpreadsheet, FileAudio, FileType, Image as ImageIcon, File as FileIcon, type LucideProps } from "lucide-react";
import type { ResourceType } from "@/lib/types";
import { isIllustrationName, type IllustrationName } from "@/components/shared/illustration";

/**
 * Small server-safe helpers shared by the course overview and the lesson page.
 * (No hooks, no browser APIs.)
 */

/** The importer tags modules with descriptive keys; map them onto the line-art set. */
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

export function moduleArt(code: string, key?: string | null): IllustrationName {
  if (key && isIllustrationName(key)) return key;
  if (key && KEY_MAP[key]) return KEY_MAP[key];
  return MODULE_CODE_MAP[code] ?? "leaves";
}

export function ResourceIcon({ type, ...props }: { type: ResourceType } & LucideProps) {
  switch (type) {
    case "pdf":
      return <FileText {...props} />;
    case "xlsx":
      return <FileSpreadsheet {...props} />;
    case "mp3":
      return <FileAudio {...props} />;
    case "docx":
      return <FileType {...props} />;
    case "image":
      return <ImageIcon {...props} />;
    default:
      return <FileIcon {...props} />;
  }
}

export const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
  pdf: "PDF",
  xlsx: "Spreadsheet",
  mp3: "Audio",
  docx: "Word document",
  image: "Image",
  other: "File",
};

export const STEP_KIND_LABEL: Record<"consumption" | "implementation" | "optional" | "rare", string> = {
  consumption: "Learn",
  implementation: "Do",
  optional: "Optional",
  rare: "Bonus",
};

/** "Module 3" for core modules, otherwise the module title. */
export function moduleDisplayName(module: { code: string; kind: string; title: string }): string {
  const m = /^M(\d+)$/.exec(module.code);
  if (module.kind === "core" && m) return `Module ${Number(m[1])}`;
  return module.title;
}

/** Is this an absolute http(s) URL (as opposed to a storage key)? */
export function isAbsoluteUrl(value: string | null | undefined): boolean {
  return !!value && /^https?:\/\//i.test(value);
}
