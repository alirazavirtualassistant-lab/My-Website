/**
 * Pure helpers for the course player — no React, no DOM, no I/O — so they can
 * be unit-tested and shared between the server (transcript rendering) and the
 * client (search, seeking, keyboard shortcuts).
 *
 * Teleprompter transcripts look like:
 *
 *   M1T1: INTRODUCTION TO PRE-CONCEPTION HEALTH — 10 MIN
 *
 *   — 0:00–0:30  HOOK —
 *
 *   A woman I worked with once told me…
 *
 *   [PAUSE — let this land]
 *
 * Section markers are lines that start with "— " and end with " —"; they carry
 * an optional timecode range ("0:30–2:00") followed by a label. Lines wrapped in
 * square brackets ("[PAUSE — …]", "[VISUAL: …]") are stage cues.
 */

// ---------------------------------------------------------------------------
// Transcript model
// ---------------------------------------------------------------------------

export interface TranscriptTime {
  /** "0:30" as written. */
  start: string;
  /** "2:00" as written, or null when the marker has a single time. */
  end: string | null;
  startSec: number;
  endSec: number | null;
}

export type TranscriptBlock = { kind: "paragraph"; text: string } | { kind: "cue"; text: string };

export interface TranscriptSection {
  /** Stable id for anchors ("section-3"). */
  id: string;
  /** The marker text between the dashes, verbatim ("0:30–2:00  WHY THIS MATTERS"); null for the untitled lead-in. */
  heading: string | null;
  /** The label without its timecode ("WHY THIS MATTERS"); equals `heading` when there is no timecode. */
  label: string | null;
  time: TranscriptTime | null;
  blocks: TranscriptBlock[];
}

export interface ParsedTranscript {
  /** First line when it reads like a title ("M1T1: … — 10 MIN"), verbatim. */
  title: string | null;
  sections: TranscriptSection[];
  /** Total words in paragraphs and cues. */
  wordCount: number;
}

const SECTION_RE = /^[—–]\s*(.+?)\s*[—–]$/;
const TITLE_RE = /[—–-]\s*\d+\s*MIN\s*$/i;
const TIMECODE_RE = /^(\d{1,2}:\d{2}(?::\d{2})?)(?:\s*[–—-]\s*(\d{1,2}:\d{2}(?::\d{2})?))?\s+(.+)$/;
const CUE_RE = /^\[[^\]]*\]$/;

/** "m:ss" or "h:mm:ss" → seconds. Returns null for anything else. */
export function parseClock(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const c = m[3] === undefined ? null : Number(m[3]);
  if (b >= 60 || (c !== null && c >= 60)) return null;
  return c === null ? a * 60 + b : a * 3600 + b * 60 + c;
}

/** Seconds → "m:ss" (or "h:mm:ss" past an hour). */
export function formatClock(sec: number): string {
  const total = Math.max(0, Math.floor(Number.isFinite(sec) ? sec : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/** Splits a section marker into its timecode (if any) and label. */
export function parseSectionHeading(heading: string): { label: string; time: TranscriptTime | null } {
  const m = TIMECODE_RE.exec(heading.trim());
  if (!m) return { label: heading.trim(), time: null };
  const startSec = parseClock(m[1]);
  if (startSec === null) return { label: heading.trim(), time: null };
  const endSec = m[2] ? parseClock(m[2]) : null;
  return {
    label: m[3].trim(),
    time: { start: m[1], end: m[2] ?? null, startSec, endSec },
  };
}

/** "[PAUSE — let this land]" / "[VISUAL: slide 3]" style stage directions. */
export function isCueLine(line: string): boolean {
  return CUE_RE.test(line.trim());
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function parseTranscript(text: string | null | undefined): ParsedTranscript {
  const lines = (text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const sections: TranscriptSection[] = [];
  let title: string | null = null;
  let wordCount = 0;
  let current: TranscriptSection = { id: "section-0", heading: null, label: null, time: null, blocks: [] };
  let buffer: string[] = [];
  let sawContent = false;

  const flushParagraph = () => {
    if (buffer.length === 0) return;
    const paragraph = buffer.join(" ").trim();
    buffer = [];
    if (!paragraph) return;
    current.blocks.push({ kind: "paragraph", text: paragraph });
    wordCount += countWords(paragraph);
  };
  const pushSection = () => {
    flushParagraph();
    if (current.heading !== null || current.blocks.length > 0) sections.push(current);
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    const marker = SECTION_RE.exec(line);
    if (marker) {
      pushSection();
      const heading = marker[1].trim();
      const { label, time } = parseSectionHeading(heading);
      current = { id: `section-${sections.length + 1}`, heading, label, time, blocks: [] };
      sawContent = true;
      continue;
    }
    if (!sawContent && TITLE_RE.test(line)) {
      title = line;
      sawContent = true;
      continue;
    }
    sawContent = true;
    if (isCueLine(line)) {
      flushParagraph();
      current.blocks.push({ kind: "cue", text: line });
      wordCount += countWords(line);
      continue;
    }
    buffer.push(line);
  }
  pushSection();
  // Re-number so ids are contiguous even when the lead-in section was empty.
  sections.forEach((s, i) => {
    s.id = `section-${i}`;
  });
  return { title, sections, wordCount };
}

/** Rough reading time in whole minutes (min 1), ~180 wpm. */
export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 180));
}

/** The section whose time range contains `sec` (last section whose start ≤ sec). */
export function sectionAtTime(parsed: ParsedTranscript, sec: number): TranscriptSection | null {
  let found: TranscriptSection | null = null;
  for (const s of parsed.sections) {
    if (!s.time) continue;
    if (s.time.startSec <= sec) found = s;
    else break;
  }
  return found;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface TextSegment {
  text: string;
  match: boolean;
  /** Global match index (0-based) when `match` is true. */
  matchIndex?: number;
}

export interface TranscriptMatch {
  sectionIndex: number;
  blockIndex: number;
  /** 0-based index of this match within the block. */
  occurrence: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive, whitespace-tolerant matcher for a query. Null for blank queries. */
export function searchPattern(query: string): RegExp | null {
  const q = query.trim();
  if (!q) return null;
  return new RegExp(escapeRegExp(q).replace(/\s+/g, "\\s+"), "gi");
}

/** Every match in document order, for next/previous navigation. */
export function findMatches(parsed: ParsedTranscript, query: string): TranscriptMatch[] {
  const re = searchPattern(query);
  if (!re) return [];
  const out: TranscriptMatch[] = [];
  parsed.sections.forEach((section, sectionIndex) => {
    section.blocks.forEach((block, blockIndex) => {
      let occurrence = 0;
      re.lastIndex = 0;
      while (re.exec(block.text)) {
        out.push({ sectionIndex, blockIndex, occurrence });
        occurrence += 1;
        if (re.lastIndex === 0) break; // zero-width guard
      }
    });
  });
  return out;
}

/** Splits `text` into plain/match segments; `firstMatchIndex` numbers matches globally. */
export function splitMatches(text: string, query: string, firstMatchIndex = 0): TextSegment[] {
  const re = searchPattern(query);
  if (!re) return [{ text, match: false }];
  const segments: TextSegment[] = [];
  let last = 0;
  let index = firstMatchIndex;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false });
    segments.push({ text: m[0], match: true, matchIndex: index++ });
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false });
  return segments.length ? segments : [{ text, match: false }];
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts
// ---------------------------------------------------------------------------

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export type PlayerAction =
  | { type: "togglePlay" }
  | { type: "seek"; deltaSec: number }
  | { type: "toggleMute" }
  | { type: "toggleFullscreen" }
  | { type: "toggleCaptions" }
  | { type: "speed"; direction: 1 | -1 };

export interface KeyLike {
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
}

/**
 * Maps a key press to a player action. Modifier combinations (except shift,
 * which is how "<" and ">" are typed) are left alone so browser shortcuts work.
 */
export function shortcutAction(e: KeyLike): PlayerAction | null {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  switch (e.key) {
    case " ":
    case "k":
    case "K":
      return { type: "togglePlay" };
    case "j":
    case "J":
      return { type: "seek", deltaSec: -10 };
    case "l":
    case "L":
      return { type: "seek", deltaSec: 10 };
    case "ArrowLeft":
      return { type: "seek", deltaSec: -5 };
    case "ArrowRight":
      return { type: "seek", deltaSec: 5 };
    case "m":
    case "M":
      return { type: "toggleMute" };
    case "f":
    case "F":
      return { type: "toggleFullscreen" };
    case "c":
    case "C":
      return { type: "toggleCaptions" };
    case "<":
      return { type: "speed", direction: -1 };
    case ">":
      return { type: "speed", direction: 1 };
    case ",":
      return e.shiftKey ? { type: "speed", direction: -1 } : null;
    case ".":
      return e.shiftKey ? { type: "speed", direction: 1 } : null;
    default:
      return null;
  }
}

/** Next/previous speed in the fixed ladder; clamps at the ends. */
export function stepSpeed(current: number, direction: 1 | -1): PlaybackSpeed {
  const ladder = PLAYBACK_SPEEDS;
  let index = ladder.findIndex((s) => Math.abs(s - current) < 0.001);
  if (index < 0) {
    // Snap an unknown rate to the nearest rung first.
    index = ladder.reduce((best, s, i) => (Math.abs(s - current) < Math.abs(ladder[best] - current) ? i : best), 0);
  }
  const next = Math.min(ladder.length - 1, Math.max(0, index + direction));
  return ladder[next];
}

/** Whether a key event from this element should be ignored (typing in a field). */
export function isTypingTarget(target: { tagName?: string; isContentEditable?: boolean; getAttribute?: (name: string) => string | null } | null | undefined): boolean {
  if (!target) return false;
  const tag = (target.tagName ?? "").toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return true;
  if (target.isContentEditable) return true;
  const role = target.getAttribute?.("role");
  return role === "textbox" || role === "combobox" || role === "menuitem" || role === "menuitemradio";
}

export const SHORTCUT_HELP: ReadonlyArray<{ keys: string; action: string }> = [
  { keys: "Space / K", action: "Play or pause" },
  { keys: "J / L", action: "Back or forward 10 seconds" },
  { keys: "← / →", action: "Back or forward 5 seconds" },
  { keys: "M", action: "Mute" },
  { keys: "F", action: "Full screen" },
  { keys: "C", action: "Captions" },
  { keys: "< / >", action: "Slower or faster" },
];

// ---------------------------------------------------------------------------
// Small formatting helpers used by the player UI
// ---------------------------------------------------------------------------

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Position in seconds → "at 3:21", for notes. */
export function positionLabel(sec: number | null | undefined): string | null {
  if (sec === null || sec === undefined || !Number.isFinite(sec)) return null;
  return `at ${formatClock(sec)}`;
}
