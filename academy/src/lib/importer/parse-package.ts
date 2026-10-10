import type { ActionLink, CoursePackage, ModuleKind, ResourceType, UploadType } from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  BONUS_MODULE_TITLE,
  DEFAULT_COURSE_SLUG,
  DOCTOR_CALLOUT_CODES,
  FALLBACK_DURATION_SEC,
  FORUM_CATEGORY_COPY,
  HOME_LESSON,
  INTRO_LESSON_TITLE,
  LESSON_QUIZ_KEYS,
  PRE_ACTIONS_STEP_LABEL,
  PRE_ACTION_SUB_ITEMS,
  PREVIEW_LESSON_CODES,
  REPLAY_MODULE_TITLE,
  buildCourseRecord,
} from "./course-copy";
import type { ParsedSheet, SheetRow, XpSummaryEntry } from "./parse-sheet";
import { QUIZ_DEFINITIONS } from "./quizzes";
import { ImportError, type ImportOptions, type ImportResult, type StoredFile, type VirtualFiles } from "./types";

/**
 * Pure transformation: virtual file map + parsed sheet → CoursePackage.
 * No I/O. Every validation problem is collected and thrown together as an
 * ImportError so the admin preview can list them all at once.
 */

export type PackageModule = CoursePackage["modules"][number];
export type PackageLesson = PackageModule["lessons"][number];
export type PackageResource = PackageLesson["resources"][number];
export type PackageActionStep = PackageLesson["action_steps"][number];
export type PackageForumCategory = CoursePackage["forum_categories"][number];

export const HOME_CODE = "M0";
export const BONUS_CODE = "BONUS";
export const REPLAY_CODE = "REPLAY";

const TRANSCRIPT_SUFFIX = "_teleprompter.txt";
export const SUMMARIES_HEADING = "— SESSION SUMMARIES AUDIO (SCRIPT) —";
const AUDIO_EXTENSIONS = new Set(["mp3", "m4a", "wav"]);
export const PLACEHOLDER_URL = /forms\.gle|youtube\.com|facebook\.com\/groups/i;
const STEP_KINDS: PackageActionStep["kind"][] = ["consumption", "implementation", "optional", "rare"];

// ---------------------------------------------------------------------------
// Small parsers (exported for unit tests)
// ---------------------------------------------------------------------------

/** Folder name → module code: 00_Course_Home → M0, 03_Module_3_… → M3, 08_Bonuses → BONUS, 09_Replays → REPLAY. */
export function moduleCodeForFolder(dir: string): string | null {
  if (/course[_ -]?home/i.test(dir)) return HOME_CODE;
  const m = dir.match(/^\d+_Module_?(\d+)(?:_|$)/i);
  if (m) return `M${Number(m[1])}`;
  if (/^\d+_Bonus/i.test(dir)) return BONUS_CODE;
  if (/^\d+_Replay/i.test(dir)) return REPLAY_CODE;
  return null;
}

/** MODULE # cell → module code. */
export function moduleCodeForRow(moduleCell: string): string | null {
  const raw = moduleCell.trim();
  if (/^course\s*home$/i.test(raw)) return HOME_CODE;
  const m = raw.match(/^M\s*(\d+)$/i);
  if (m) return `M${Number(m[1])}`;
  if (/^bonus(es)?$/i.test(raw)) return BONUS_CODE;
  if (/^replays?$/i.test(raw)) return REPLAY_CODE;
  return null;
}

export function kindForCode(code: string): ModuleKind {
  if (code === HOME_CODE) return "home";
  if (code === BONUS_CODE) return "bonus";
  if (code === REPLAY_CODE) return "replay";
  return "core";
}

function moduleRank(code: string): number {
  switch (kindForCode(code)) {
    case "home":
      return 0;
    case "core":
      return 1 + Number(code.slice(1)) / 1000;
    case "bonus":
      return 2;
    case "replay":
      return 3;
  }
}

/** RELEASE cell → drip days. "Immediately"/"Immediate" → 0, "After 7 Days" → 7, "After 2 Weeks" → 14. */
export function parseRelease(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  if (/^immediate(ly)?$/i.test(t) || /^day\s*0$/i.test(t)) return 0;
  const d = t.match(/(\d+)\s*day/i);
  if (d) return Number(d[1]);
  const w = t.match(/(\d+)\s*week/i);
  if (w) return Number(w[1]) * 7;
  return null;
}

/** VIDEO cell → planned file name + stated runtime. Placeholder links ("YouTube: …", "(upload)") are ignored. */
export function parseVideoCell(text: string): { filename: string | null; duration_sec: number | null } {
  const f = text.match(/([A-Za-z0-9][\w.-]*\.(?:mp4|mov|m4v|webm))/i);
  const d = text.match(/\((\d+)\s*min/i);
  return { filename: f ? f[1] : null, duration_sec: d ? Number(d[1]) * 60 : null };
}

/** "Default cartoon (family foundation); M1-header.jpg (upload optional)" → "family-foundation". */
export function parseIllustration(text: string): string | null {
  const m = text.match(/cartoon\s*\(([^)]+)\)/i);
  return m ? slugify(m[1]) : null;
}

/** First line of a teleprompter script: "M1T1: … — 10 MIN" → 600. */
export function transcriptDurationSec(text: string): number | null {
  const first = text.split(/\r?\n/, 1)[0] ?? "";
  const m = first.match(/—\s*(\d+)\s*MIN\b/i) ?? first.match(/\b(\d+)\s*MIN\b/i);
  return m ? Number(m[1]) * 60 : null;
}

/** Comparable key for a resource name: drop "MxTy_" prefix, extension-normalise (.xls → .xlsx), keep letters/digits only. */
export function resourceKey(fileName: string): string {
  const base = fileName.trim().replace(/^M\d+T\d+_/i, "");
  const m = base.match(/^(.*)\.([A-Za-z0-9]+)$/);
  let stem = m ? m[1] : base;
  let ext = m ? m[2].toLowerCase() : "";
  if (ext === "xls") ext = "xlsx";
  stem = stem.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return ext ? `${stem}.${ext}` : stem;
}

/** Display label for a learner file: code prefix removed, underscores → spaces, no extension, plus the sheet's parenthetical. */
export function resourceLabel(fileName: string, parenthetical: string | null = null): string {
  const stem = fileName
    .replace(/\.[A-Za-z0-9]+$/, "")
    .replace(/^M\d+T\d+_/i, "")
    .replace(/_/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return parenthetical ? `${stem} (${parenthetical})` : stem;
}

export function resourceType(fileName: string): ResourceType {
  const ext = (fileName.match(/\.([A-Za-z0-9]+)$/)?.[1] ?? "").toLowerCase();
  switch (ext) {
    case "pdf":
      return "pdf";
    case "xlsx":
    case "xls":
    case "csv":
      return "xlsx";
    case "mp3":
    case "m4a":
    case "wav":
      return "mp3";
    case "docx":
    case "doc":
      return "docx";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return "image";
    default:
      return "other";
  }
}

export interface ResourceMention {
  raw: string;
  fileName: string;
  ext: string;
  parenthetical: string | null;
  embed: boolean;
}

const MENTION_RE = /^(.+?\.(pdf|xlsx?|csv|docx?|mp3|m4a|wav|png|jpe?g))\s*(?:\(([^)]*)\))?\s*\.?$/i;

/** Splits a RESOURCES cell ("Welcome Guide.pdf; Embed welcome-audio.mp3") into file mentions. */
export function parseResourceMentions(cell: string): ResourceMention[] {
  return cell
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token) => {
      let t = token;
      let embed = false;
      if (/^embed\s+/i.test(t)) {
        embed = true;
        t = t.replace(/^embed\s+/i, "");
      }
      const m = t.match(MENTION_RE);
      if (!m) return { raw: token, fileName: t, ext: "", parenthetical: null, embed };
      let parenthetical = m[3]?.trim() || null;
      if (parenthetical && /^embed(ded)?$/i.test(parenthetical)) {
        embed = true;
        parenthetical = null;
      }
      return { raw: token, fileName: m[1].trim(), ext: m[2].toLowerCase(), parenthetical, embed };
    });
}

/** Audio file names mentioned in free text ("Embed session summaries.mp3."). */
export function audioMentionsInText(text: string): string[] {
  const out: string[] = [];
  const re = /([A-Za-z0-9][A-Za-z0-9 _-]*\.(?:mp3|m4a|wav))/gi;
  for (const m of text.matchAll(re)) out.push(m[1].replace(/^embed\s+/i, "").trim());
  return out;
}

export function audioSlot(fileName: string): PackageLesson["audio_slots"][number] {
  const stem = fileName.replace(/\.[A-Za-z0-9]+$/, "").trim();
  const key = slugify(stem);
  let label: string;
  if (key === "audio") label = "Training audio";
  else {
    const words = stem.replace(/[-_]+/g, " ").toLowerCase().trim();
    label = words.charAt(0).toUpperCase() + words.slice(1);
    if (!/\baudio\b/.test(words)) label += " audio";
  }
  return { key, label, file_path: null };
}

export interface ParsedActionStep {
  source_label: string;
  label: string;
  xp: number;
}

/** "Complete Wellness Quiz (link: forms.gle/wellness-quiz), 50 XP" → label "Complete Wellness Quiz", xp 50. */
export function parseActionStepCell(cell: string): ParsedActionStep | null {
  const source = cell.trim();
  if (!source) return null;
  const m = source.match(/^(.*?),\s*(\d+)\s*XPs?\.?\s*$/i);
  if (!m) throw new Error(`action step "${source}" is not in the form "Label, NN XP"`);
  const label = m[1]
    .replace(/\s*\((?:link|url|form):[^)]*\)/gi, "")
    .replace(/\s*\(from\s[^)]*\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { source_label: source, label, xp: Number(m[2]) };
}

export function detectUploadType(label: string): UploadType {
  const l = label.toLowerCase();
  if (/journal\s*upload/.test(l)) return "journal";
  if (/pdf\s*upload/.test(l)) return "pdf";
  if (/\bphoto\b/.test(l)) return "photo";
  return "any";
}

export function resolveActionLink(label: string, requiresUpload: boolean, uploadType: UploadType | null): ActionLink {
  const l = label.toLowerCase();
  if (l.includes("wellness quiz")) return { type: "quiz", quiz_key: "wellness-quiz" };
  if (l.includes("sensitivity quiz")) return { type: "quiz", quiz_key: "sensitivity-quiz" };
  if (l.includes("gut health quiz")) return { type: "quiz", quiz_key: "gut-health-quiz" };
  if (/pre-?actions|pre-?course survey/.test(l)) return { type: "survey", quiz_key: "pre-course-survey" };
  if (/\btestimonial\b/.test(l)) return { type: "testimonial" };
  if (/\b(forum|share|post|discussion|group|anonymously|alumni)\b/.test(l)) return { type: "forum" };
  if (requiresUpload) return { type: "upload", upload_type: uploadType ?? "any" };
  return { type: "none" };
}

export function buildActionStep(cell: string, column: number, position: number): PackageActionStep | null {
  const parsed = parseActionStepCell(cell);
  if (!parsed) return null;
  const requires_upload = /\b(upload|photo)\b/i.test(parsed.label);
  const upload_type = requires_upload ? detectUploadType(parsed.label) : null;
  const link = resolveActionLink(parsed.label, requires_upload, upload_type);
  const sub_items =
    parsed.label.toLowerCase() === PRE_ACTIONS_STEP_LABEL.toLowerCase() ? PRE_ACTION_SUB_ITEMS.map((s) => ({ ...s })) : null;
  return {
    label: parsed.label,
    source_label: parsed.source_label,
    kind: STEP_KINDS[column] ?? "optional",
    xp: parsed.xp,
    requires_upload,
    upload_type,
    link,
    position,
    sub_items,
  };
}

/** Maps the XP Summary tab onto module codes (Course Home + Pre-actions both count towards M0). */
export function expectedXpByModule(summary: XpSummaryEntry[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const { label, xp } of summary) {
    const l = label.trim();
    let code: string | null = null;
    if (/^course\s*home$/i.test(l) || /^pre-?actions/i.test(l)) code = HOME_CODE;
    else if (/^M\d+$/i.test(l)) code = l.toUpperCase();
    else if (/^bonus/i.test(l)) code = BONUS_CODE;
    else if (/^replay/i.test(l)) code = REPLAY_CODE;
    if (!code) continue;
    out[code] = (out[code] ?? 0) + xp;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface LearnerFile {
  path: string;
  name: string;
  key: string;
  storage_path: string;
  size: number;
  data: Buffer;
}

interface TranscriptFile {
  path: string;
  name: string;
  text: string;
}

function detectModuleFolders(files: VirtualFiles, problems: string[]): Map<string, string> {
  const top = new Set<string>();
  for (const p of files.keys()) {
    const i = p.indexOf("/");
    if (i > 0) top.add(p.slice(0, i));
  }
  const map = new Map<string, string>();
  for (const dir of [...top].sort()) {
    const code = moduleCodeForFolder(dir);
    if (!code) continue;
    if (map.has(code)) problems.push(`Folders "${map.get(code)}" and "${dir}" both look like module ${code}`);
    else map.set(code, dir);
  }
  return map;
}

function collectLearnerFiles(files: VirtualFiles, folder: string, slug: string, problems: string[]): LearnerFile[] {
  const prefix = `${folder}/Resources/`;
  const out: LearnerFile[] = [];
  for (const [p, data] of files) {
    if (!p.startsWith(prefix)) continue;
    const name = p.slice(p.lastIndexOf("/") + 1);
    out.push({ path: p, name, key: resourceKey(name), storage_path: `${slug}/${p}`, size: data.length, data });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  const seen = new Map<string, string>();
  for (const f of out) {
    const other = seen.get(f.key);
    if (other) problems.push(`${folder}/Resources: "${other}" and "${f.name}" normalise to the same name; rename one`);
    else seen.set(f.key, f.name);
  }
  return out;
}

function collectTranscripts(files: VirtualFiles, folder: string): TranscriptFile[] {
  const prefix = `${folder}/Scripts/`;
  const out: TranscriptFile[] = [];
  for (const [p, data] of files) {
    if (!p.startsWith(prefix) || !p.endsWith(TRANSCRIPT_SUFFIX)) continue;
    const name = p.slice(p.lastIndexOf("/") + 1);
    out.push({ path: p, name, text: decodeText(data) });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function decodeText(data: Buffer): string {
  const text = data.toString("utf8");
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function trainingSortKey(code: string): [number, string] {
  const m = code.match(/^(\d+)\s*([a-z]*)$/i);
  return m ? [Number(m[1]), m[2].toLowerCase()] : [Number.MAX_SAFE_INTEGER, code];
}

function compareTraining(a: SheetRow, b: SheetRow): number {
  const [an, al] = trainingSortKey(a.trainingCode);
  const [bn, bl] = trainingSortKey(b.trainingCode);
  return an - bn || al.localeCompare(bl) || a.rowNumber - b.rowNumber;
}

/** Which teleprompter file belongs to a lesson. */
function transcriptMatcher(kind: ModuleKind, code: string, trainingCode: string): (name: string) => boolean {
  if (kind === "home" || kind === "core") {
    const prefix = `${code.toUpperCase()}_`;
    return (name) => name.toUpperCase().startsWith(prefix);
  }
  const m = trainingCode.match(/^(\d+)\s*([a-z]?)$/i);
  const n = m ? m[1] : trainingCode;
  const letter = m?.[2]?.toLowerCase() ?? "";
  const word = kind === "bonus" ? "bonus" : "replay";
  const prefix = `${word}${n}_`;
  const session = letter ? letter.charCodeAt(0) - "a".charCodeAt(0) + 1 : null;
  const sessionRe = session ? new RegExp(`session\\s*_?${session}(?!\\d)`, "i") : null;
  return (name) => {
    const lower = name.toLowerCase();
    if (!lower.startsWith(prefix)) return false;
    if (/summar/i.test(lower)) return false;
    return sessionRe ? sessionRe.test(lower) : true;
  };
}

function hasPlaceholder(text: string): boolean {
  return PLACEHOLDER_URL.test(text);
}

function attachResource(target: PackageResource[], file: LearnerFile, label: string, attached: Set<string>): void {
  if (target.some((r) => r.file_path === file.storage_path)) return;
  attached.add(file.storage_path);
  target.push({
    file_path: file.storage_path,
    label,
    file_name: file.name,
    type: resourceType(file.name),
    size_bytes: file.size,
    position: target.length,
  });
}

interface LessonSpec {
  code: string;
  title: string;
  series: string | null;
  description: string;
  notes: string;
  is_intro: boolean;
  row: SheetRow | null;
  /** Validate the computed XP against this (training rows only). */
  sheetXp: number | null;
  matcher: (name: string) => boolean;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function parsePackage(files: VirtualFiles, sheet: ParsedSheet, opts: ImportOptions = {}): ImportResult {
  const slug = opts.slug ?? DEFAULT_COURSE_SLUG;
  const problems: string[] = [];
  const warnings: string[] = [];

  const folders = detectModuleFolders(files, problems);

  // Group sheet rows by module code.
  const groups = new Map<string, { moduleRow: SheetRow | null; trainingRows: SheetRow[] }>();
  for (const row of sheet.rows) {
    const code = moduleCodeForRow(row.moduleCode);
    if (!code) {
      problems.push(`Row ${row.rowNumber}: unrecognised MODULE # "${row.moduleCode}"`);
      continue;
    }
    const g = groups.get(code) ?? { moduleRow: null, trainingRows: [] };
    if (!row.trainingCode) {
      if (g.moduleRow) problems.push(`Row ${row.rowNumber}: second module row for ${code} (first was row ${g.moduleRow.rowNumber})`);
      else g.moduleRow = row;
    } else g.trainingRows.push(row);
    groups.set(code, g);
  }
  if (!groups.has(HOME_CODE)) problems.push(`Course sheet has no "Course Home" row`);

  const codes = [...groups.keys()].sort((a, b) => moduleRank(a) - moduleRank(b));
  const modules: PackageModule[] = [];
  const storedFiles: StoredFile[] = [];
  const attachedPaths = new Set<string>();
  let transcriptCount = 0;

  for (const code of codes) {
    const kind = kindForCode(code);
    const group = groups.get(code)!;
    const moduleRow = group.moduleRow;
    const folder = folders.get(code);
    if (!folder) {
      problems.push(`No package folder found for module ${code} (expected something like "0N_Module_N_…")`);
      continue;
    }
    if ((kind === "home" || kind === "core") && !moduleRow) {
      problems.push(`Module ${code}: no module row (TRAINING # blank) in the sheet`);
      continue;
    }

    const learnerFiles = collectLearnerFiles(files, folder, slug, problems);
    const byKey = new Map(learnerFiles.map((f) => [f.key, f]));
    const transcripts = collectTranscripts(files, folder);
    for (const f of learnerFiles) {
      storedFiles.push({ storage_path: f.storage_path, source_path: f.path, file_name: f.name, size_bytes: f.size, data: f.data });
    }

    // Module record
    let drip = 0;
    if (moduleRow) {
      const parsed = parseRelease(moduleRow.release);
      if (parsed === null && moduleRow.release) problems.push(`Row ${moduleRow.rowNumber}: cannot read RELEASE "${moduleRow.release}"`);
      drip = parsed ?? 0;
    }
    const completionXp = kind === "home" || kind === "core" ? (moduleRow?.xp ?? 0) : 0;
    if ((kind === "home" || kind === "core") && moduleRow && moduleRow.xp === null) {
      problems.push(`Row ${moduleRow.rowNumber}: module ${code} has no XP value`);
    }
    const title =
      kind === "bonus" ? BONUS_MODULE_TITLE : kind === "replay" ? REPLAY_MODULE_TITLE : (moduleRow?.moduleName ?? code);
    if ((kind === "core" || kind === "home") && !moduleRow?.moduleName && kind === "core") {
      problems.push(`Row ${moduleRow?.rowNumber}: module ${code} has no MODULE NAME`);
    }

    const mod: PackageModule = {
      code,
      kind,
      title: kind === "home" ? (moduleRow?.moduleName || "Course Home") : title,
      description: kind === "bonus" || kind === "replay" ? "" : (moduleRow?.shortDescription ?? ""),
      notes: kind === "bonus" || kind === "replay" ? "" : (moduleRow?.notes ?? ""),
      position: modules.length,
      drip_days: drip,
      completion_xp: completionXp,
      header_image_path: null,
      illustration: moduleRow ? parseIllustration(moduleRow.video) : null,
      required_for_certificate: kind === "home" || kind === "core",
      resources: [],
      lessons: [],
    };

    // Lesson specs
    const specs: LessonSpec[] = [];
    const trainingRows = [...group.trainingRows].sort(compareTraining);
    if (kind === "home") {
      specs.push({
        code: HOME_CODE,
        title: HOME_LESSON.title,
        series: null,
        description: HOME_LESSON.description,
        notes: moduleRow!.notes,
        is_intro: false,
        row: moduleRow,
        sheetXp: null,
        matcher: transcriptMatcher("home", HOME_CODE, ""),
      });
      for (const r of trainingRows) problems.push(`Row ${r.rowNumber}: Course Home should not have training rows`);
    } else if (kind === "core") {
      const introCode = `${code}T0`;
      specs.push({
        code: introCode,
        title: INTRO_LESSON_TITLE,
        series: null,
        description: "",
        notes: "",
        is_intro: true,
        row: null,
        sheetXp: null,
        matcher: transcriptMatcher("core", introCode, "0"),
      });
      for (const r of trainingRows) {
        const lessonCode = `${code}T${r.trainingCode}`;
        if (!r.trainingName) problems.push(`Row ${r.rowNumber}: ${lessonCode} has no TRAINING NAME`);
        specs.push({
          code: lessonCode,
          title: r.trainingName || lessonCode,
          series: null,
          description: r.shortDescription,
          notes: r.notes,
          is_intro: false,
          row: r,
          sheetXp: r.xp,
          matcher: transcriptMatcher("core", lessonCode, r.trainingCode),
        });
      }
    } else {
      for (const r of trainingRows) {
        const lessonCode = `${code}_T${r.trainingCode}`;
        const hasTrainingName = Boolean(r.trainingName);
        specs.push({
          code: lessonCode,
          title: hasTrainingName ? r.trainingName : r.moduleName || lessonCode,
          series: hasTrainingName ? r.moduleName || null : null,
          description: r.shortDescription,
          notes: r.notes,
          is_intro: false,
          row: r,
          sheetXp: r.xp,
          matcher: transcriptMatcher(kind, lessonCode, r.trainingCode),
        });
      }
    }

    // Build lessons
    for (const spec of specs) {
      const row = spec.row;
      const video = row ? parseVideoCell(row.video) : { filename: null, duration_sec: null };

      const matches = transcripts.filter((t) => spec.matcher(t.name));
      let transcript = "";
      let transcriptSource: string | null = null;
      if (matches.length === 1) {
        transcript = matches[0].text;
        transcriptSource = matches[0].path;
        transcriptCount += 1;
      } else if (matches.length === 0) {
        problems.push(`${spec.code}: no *_teleprompter.txt transcript found in ${folder}/Scripts`);
      } else {
        problems.push(`${spec.code}: ambiguous transcript (${matches.map((m) => m.name).join(", ")})`);
      }

      let duration = video.duration_sec ?? transcriptDurationSec(transcript);
      if (duration === null) {
        duration = FALLBACK_DURATION_SEC;
        warnings.push(`${spec.code}: no runtime in the sheet or transcript header; using ${FALLBACK_DURATION_SEC}s`);
      }

      // Action steps
      const steps: PackageActionStep[] = [];
      if (row) {
        row.actionSteps.forEach((cell, column) => {
          try {
            const step = buildActionStep(cell, column, steps.length);
            if (step) steps.push(step);
          } catch (err) {
            problems.push(`Row ${row.rowNumber} (${spec.code}): ${(err as Error).message}`);
          }
        });
      }
      for (const s of steps) {
        if (hasPlaceholder(s.label)) problems.push(`${spec.code}: action step label still contains a placeholder link: "${s.label}"`);
        if (s.sub_items) {
          const subTotal = s.sub_items.reduce((a, b) => a + b.xp, 0);
          if (subTotal !== s.xp) problems.push(`${spec.code}: sub-items total ${subTotal} XP but the step is worth ${s.xp} XP`);
        }
      }
      const lessonXp = steps.reduce((a, s) => a + s.xp, 0);
      if (spec.sheetXp !== null && lessonXp !== spec.sheetXp) {
        problems.push(`Row ${row?.rowNumber} (${spec.code}): action steps add up to ${lessonXp} XP but the XP column says ${spec.sheetXp}`);
      }
      for (const field of [spec.description, spec.notes, spec.title]) {
        if (hasPlaceholder(field)) warnings.push(`${spec.code}: verbatim sheet text contains a placeholder link ("${field}")`);
      }

      // Audio slots
      const audioNames: string[] = [];
      const mentions = row ? parseResourceMentions(row.resources) : [];
      for (const m of mentions) if (AUDIO_EXTENSIONS.has(m.ext)) audioNames.push(m.fileName);
      if (row) audioNames.push(...audioMentionsInText(row.notes));
      const audio_slots: PackageLesson["audio_slots"] = [];
      for (const name of audioNames) {
        const slot = audioSlot(name);
        if (!audio_slots.some((s) => s.key === slot.key)) audio_slots.push(slot);
      }

      const stepQuiz = steps.map((s) => s.link).find((l): l is Extract<ActionLink, { quiz_key: string }> => "quiz_key" in l);
      const quiz_key = stepQuiz?.quiz_key ?? LESSON_QUIZ_KEYS[spec.code] ?? null;
      if (quiz_key && !QUIZ_DEFINITIONS.some((q) => q.key === quiz_key)) problems.push(`${spec.code}: unknown quiz key "${quiz_key}"`);

      const lesson: PackageLesson = {
        code: spec.code,
        title: spec.title,
        series: spec.series,
        description: spec.description,
        notes: spec.notes,
        planned_video_filename: video.filename,
        video_provider: "none",
        video_asset_id: null,
        video_playback_id: null,
        video_url: null,
        captions_path: null,
        thumbnail_path: null,
        duration_sec: duration,
        transcript,
        transcript_source_file: transcriptSource,
        audio_slots,
        is_preview: PREVIEW_LESSON_CODES.includes(spec.code),
        is_intro: spec.is_intro,
        position: mod.lessons.length,
        drip_days_override: null,
        status: "published",
        publish_at: null,
        doctor_callout: DOCTOR_CALLOUT_CODES.includes(spec.code) || /\b(doctor|professional)\b/i.test(spec.notes),
        quiz_key,
        resources: [],
        action_steps: steps,
      };

      // Resources named in the sheet row, then files carrying this lesson's code prefix.
      for (const m of mentions) {
        if (AUDIO_EXTENSIONS.has(m.ext)) continue;
        if (!m.ext) {
          problems.push(`Row ${row?.rowNumber} (${spec.code}): cannot read resource mention "${m.raw}"`);
          continue;
        }
        const file = byKey.get(resourceKey(m.fileName));
        if (!file) {
          problems.push(`Row ${row?.rowNumber} (${spec.code}): resource "${m.fileName}" not found in ${folder}/Resources`);
          continue;
        }
        attachResource(lesson.resources, file, resourceLabel(file.name, m.parenthetical), attachedPaths);
      }
      const prefix = `${spec.code.toUpperCase()}_`;
      for (const file of learnerFiles) {
        if (file.name.toUpperCase().startsWith(prefix)) attachResource(lesson.resources, file, resourceLabel(file.name), attachedPaths);
      }
      if (kind === "home") {
        for (const file of learnerFiles) attachResource(lesson.resources, file, resourceLabel(file.name), attachedPaths);
      }

      mod.lessons.push(lesson);
    }

    // Session-summaries script (not a lesson): appended to the last lesson of its bonus series.
    for (const t of transcripts.filter((x) => /summar/i.test(x.name))) {
      const m = t.name.match(/^(bonus|replay)\s*(\d+)_/i);
      const series = m ? `${code}_T${m[2]}` : null;
      const targets = series ? mod.lessons.filter((l) => l.code.toUpperCase().startsWith(series.toUpperCase())) : [];
      const target = targets[targets.length - 1];
      if (!target) {
        problems.push(`${folder}: summaries script "${t.name}" has no lesson to attach to`);
        continue;
      }
      target.transcript = `${target.transcript.replace(/\s+$/, "")}\n\n${SUMMARIES_HEADING}\n\n${t.text}`;
      transcriptCount += 1;
    }

    // Module-level resources: named on the module row, then anything in Resources/ no lesson claimed.
    if (moduleRow) {
      for (const m of parseResourceMentions(moduleRow.resources)) {
        if (AUDIO_EXTENSIONS.has(m.ext)) continue;
        const file = m.ext ? byKey.get(resourceKey(m.fileName)) : undefined;
        if (!file) {
          if (kind !== "home") problems.push(`Row ${moduleRow.rowNumber} (${code}): resource "${m.fileName}" not found in ${folder}/Resources`);
          continue;
        }
        attachResource(mod.resources, file, resourceLabel(file.name, m.parenthetical), attachedPaths);
      }
    }
    for (const file of learnerFiles) {
      if (!attachedPaths.has(file.storage_path)) attachResource(mod.resources, file, resourceLabel(file.name), attachedPaths);
    }

    // Every transcript in the folder should have been used.
    for (const t of transcripts) {
      const used = mod.lessons.some((l) => l.transcript_source_file === t.path) || /summar/i.test(t.name);
      if (!used) warnings.push(`${t.path}: transcript not matched to any lesson`);
    }

    modules.push(mod);
  }

  // Cross-package validation ------------------------------------------------
  for (const f of storedFiles) {
    if (!attachedPaths.has(f.storage_path)) problems.push(`${f.source_path}: learner file is not attached to any lesson or module`);
    if (/\/Scripts\//i.test(f.source_path)) problems.push(`${f.source_path}: script files must never be attached as resources`);
  }
  const lessonCodes = new Set<string>();
  for (const m of modules) {
    for (const l of m.lessons) {
      if (lessonCodes.has(l.code)) problems.push(`Duplicate lesson code ${l.code}`);
      lessonCodes.add(l.code);
      if (!l.transcript.trim()) problems.push(`${l.code}: transcript is empty`);
    }
  }

  const xp_by_module: Record<string, number> = {};
  for (const m of modules) {
    xp_by_module[m.code] = m.completion_xp + m.lessons.reduce((a, l) => a + l.action_steps.reduce((b, s) => b + s.xp, 0), 0);
  }
  const expected = expectedXpByModule(sheet.xpSummary);
  for (const [code, xp] of Object.entries(expected)) {
    if (!(code in xp_by_module)) problems.push(`XP Summary lists ${code} but the package has no such module`);
    else if (xp_by_module[code] !== xp) problems.push(`${code}: computed ${xp_by_module[code]} XP but the XP Summary tab says ${xp}`);
  }

  const allLessons = modules.flatMap((m) => m.lessons);
  const stats: CoursePackage["stats"] = {
    lesson_count: allLessons.length,
    resource_count: attachedPaths.size,
    transcript_count: transcriptCount,
    total_video_sec: allLessons.reduce((a, l) => a + l.duration_sec, 0),
    total_xp: Object.values(xp_by_module).reduce((a, b) => a + b, 0),
    xp_by_module,
  };

  if (problems.length) throw new ImportError(problems);

  // Course record, quizzes, forum categories ------------------------------------
  const home = modules.find((m) => m.kind === "home")!;
  const core = modules.filter((m) => m.kind === "core");
  const course = buildCourseRecord({
    slug,
    homeShortDescription: home.description,
    coreModules: core.map((m) => ({ code: m.code, title: m.title, description: m.description, drip_days: m.drip_days })),
  });

  const quizzes = QUIZ_DEFINITIONS.map((q) => {
    const sourcePath = q.source_file ? `${slug}/${q.source_file}` : null;
    if (q.source_file && !files.has(q.source_file)) warnings.push(`Quiz ${q.key}: source PDF ${q.source_file} is not in the package`);
    return { ...q, questions: q.questions.map((qq) => ({ ...qq })), source_file: sourcePath };
  });

  const forum_categories: PackageForumCategory[] = [];
  const pushCategory = (title: string, description: string, module_code: string | null) =>
    forum_categories.push({ slug: slugify(title), title, description, position: forum_categories.length, module_code });
  pushCategory(FORUM_CATEGORY_COPY.general.title, FORUM_CATEGORY_COPY.general.description, null);
  pushCategory(FORUM_CATEGORY_COPY.introductions.title, FORUM_CATEGORY_COPY.introductions.description, home.code);
  for (const m of core) pushCategory(m.title, FORUM_CATEGORY_COPY.module(m.title), m.code);
  if (modules.some((m) => m.kind === "bonus")) pushCategory(FORUM_CATEGORY_COPY.bonuses.title, FORUM_CATEGORY_COPY.bonuses.description, BONUS_CODE);
  if (modules.some((m) => m.kind === "replay")) pushCategory(FORUM_CATEGORY_COPY.replays.title, FORUM_CATEGORY_COPY.replays.description, REPLAY_CODE);
  pushCategory(FORUM_CATEGORY_COPY.alumni.title, FORUM_CATEGORY_COPY.alumni.description, null);

  storedFiles.sort((a, b) => a.storage_path.localeCompare(b.storage_path));

  const pkg: CoursePackage = {
    version: 1,
    generated_at: opts.now ?? new Date().toISOString(),
    source: { zip: opts.zipName ?? null, sheet: sheet.fileName },
    course,
    modules,
    quizzes,
    forum_categories,
    stats,
  };

  return { pkg, files: storedFiles, warnings };
}
