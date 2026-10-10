/**
 * Pure helpers for the bulk video uploader: match dropped files to lessons by
 * the sheet's planned video filename or by lesson-code prefix. No I/O, safe in
 * Client Components and tests.
 */

export interface MatchableLesson {
  id: string;
  code: string;
  title: string;
  planned_video_filename: string | null;
}

export type MatchReason = "filename" | "code" | "manual" | "none";

export interface VideoMatch<F extends { name: string } = File> {
  file: F;
  lesson_id: string | null;
  reason: MatchReason;
}

const VIDEO_EXT = /\.(mp4|mov|m4v|webm)$/i;

export function isVideoFile(name: string): boolean {
  return VIDEO_EXT.test(name);
}

/** Case-insensitive, extension-insensitive, separators collapsed: `M1T1-Intro.mp4` → `m1t1-intro`. */
export function normaliseFilename(name: string): string {
  return name
    .trim()
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

/** Lesson codes compare without underscores: `BONUS_T2a` and `bonus-t2a` are the same code. */
export function normaliseCode(code: string): string {
  return code.toLowerCase().replace(/[_\-\s]+/g, "");
}

/**
 * The leading lesson code of a filename, if it has one: `M1T1-Intro.mp4` →
 * `m1t1`, `BONUS_T2a_Final.mov` → `bonust2a`. Codes are letters+digits with an
 * optional trailing letter, ended by a separator or the end of the name.
 */
export function codePrefixOf(name: string): string | null {
  const base = name.replace(/^.*[\\/]/, "").replace(/\.[^.]+$/, "");
  // <LETTERS><digits?><_?T<digits><letter?>>? e.g. M0, M1T1, M1T10a, BONUS_T2a, REPLAY_T1
  const m = /^([A-Za-z]+\d*(?:_?[Tt]\d+[a-z]?)?)(?=[\s_\-.]|$)/.exec(base);
  if (!m || !/\d/.test(m[1])) return null;
  return normaliseCode(m[1]);
}

/**
 * Matches each file to at most one lesson:
 *   1. exact planned_video_filename (case-insensitive, extension ignored)
 *   2. the file name starts with a lesson code (`M1T1-*.mp4`, `bonus_t2a.mov`)
 * A lesson is claimed by the first file that matches it; later files for the
 * same lesson stay unmatched so the admin can pick.
 */
export function matchVideos<F extends { name: string }>(files: F[], lessons: MatchableLesson[]): VideoMatch<F>[] {
  const byFilename = new Map<string, MatchableLesson>();
  const byCode = new Map<string, MatchableLesson>();
  for (const l of lessons) {
    if (l.planned_video_filename) {
      const key = normaliseFilename(l.planned_video_filename);
      if (key && !byFilename.has(key)) byFilename.set(key, l);
    }
    const code = normaliseCode(l.code);
    if (code && !byCode.has(code)) byCode.set(code, l);
  }
  const claimed = new Set<string>();
  const out: VideoMatch<F>[] = [];
  for (const file of files) {
    let lesson: MatchableLesson | undefined;
    let reason: MatchReason = "none";
    const exact = byFilename.get(normaliseFilename(file.name));
    if (exact && !claimed.has(exact.id)) {
      lesson = exact;
      reason = "filename";
    } else {
      const prefix = codePrefixOf(file.name);
      const byPrefix = prefix ? byCode.get(prefix) : undefined;
      if (byPrefix && !claimed.has(byPrefix.id)) {
        lesson = byPrefix;
        reason = "code";
      }
    }
    if (lesson) claimed.add(lesson.id);
    out.push({ file, lesson_id: lesson?.id ?? null, reason });
  }
  return out;
}

/** Re-assigns a file to a lesson by hand, releasing any other file that held that lesson. */
export function assignMatch<F extends { name: string }>(matches: VideoMatch<F>[], fileIndex: number, lessonId: string | null): VideoMatch<F>[] {
  return matches.map((m, i) => {
    if (i === fileIndex) return { ...m, lesson_id: lessonId, reason: lessonId ? "manual" : "none" };
    if (lessonId && m.lesson_id === lessonId) return { ...m, lesson_id: null, reason: "none" };
    return m;
  });
}
