/**
 * Teleprompter transcripts are plain text with section markers such as
 * "— 0:30–2:00  INTRO: WHO I AM AND WHY I CARE —". This splits them for
 * display without changing a word. Pure: no I/O.
 */
export interface TranscriptSection {
  heading: string | null;
  paragraphs: string[];
}

export interface ParsedTranscript {
  title: string | null;
  sections: TranscriptSection[];
}

const SECTION_RE = /^[—–-]\s*(.+?)\s*[—–-]$/;

export function parseTranscript(text: string): ParsedTranscript {
  const lines = (text ?? "").replace(/\r\n?/g, "\n").split("\n");
  let title: string | null = null;
  const sections: TranscriptSection[] = [];
  let current: TranscriptSection = { heading: null, paragraphs: [] };
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) {
      current.paragraphs.push(buffer.join(" ").trim());
      buffer = [];
    }
  };
  const pushSection = () => {
    flush();
    if (current.heading !== null || current.paragraphs.length) sections.push(current);
  };

  let sawContent = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    const m = SECTION_RE.exec(line);
    if (m) {
      pushSection();
      current = { heading: m[1].trim(), paragraphs: [] };
      sawContent = true;
      continue;
    }
    if (!sawContent && title === null && sections.length === 0 && current.paragraphs.length === 0 && buffer.length === 0 && /—\s*\d+\s*MIN$/i.test(line)) {
      title = line;
      sawContent = true;
      continue;
    }
    sawContent = true;
    buffer.push(line);
  }
  pushSection();
  return { title, sections };
}

/** "[PAUSE — let this land]" style stage directions. */
export function isStageDirection(paragraph: string): boolean {
  return /^\[.*\]$/.test(paragraph.trim());
}

/** Rough reading time for the transcript, in whole minutes (min 1). */
export function readingMinutes(text: string): number {
  const words = (text ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}
