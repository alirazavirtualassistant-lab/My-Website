import type { CoursePackage } from "@/lib/types";

/**
 * Human-readable comparison of two course packages, for the admin importer's
 * "preview changes" step before re-installing a course.
 */

export type ChangeLevel = "course" | "module" | "lesson" | "quiz" | "forum" | "stats";
export type ChangeKind = "added" | "removed" | "changed";

export interface PackageChange {
  level: ChangeLevel;
  kind: ChangeKind;
  /** Module/lesson code, quiz key, forum slug, or "course"/"stats". */
  code: string;
  title: string;
  /** One line per changed field, e.g. `title: "A" → "B"`. */
  details: string[];
}

export interface PackageDiff {
  changes: PackageChange[];
  counts: Record<ChangeKind, number>;
  unchanged: boolean;
  /** e.g. "2 lessons changed, 1 resource added; total XP 4085 → 4095". */
  summary: string;
}

type PkgModule = CoursePackage["modules"][number];
type PkgLesson = PkgModule["lessons"][number];

const COURSE_FIELDS: Array<keyof CoursePackage["course"]> = [
  "slug",
  "title",
  "subtitle",
  "description",
  "short_description",
  "thumbnail_path",
  "illustration",
  "status",
  "publish_at",
  "level",
  "language",
  "topics",
  "badge",
  "partner_seat_enabled",
  "certificate_enabled",
  "lifetime_access",
  "access_days",
  "what_you_learn",
  "requirements",
  "who_for",
  "faq",
  "duration_weeks",
];

const MODULE_FIELDS: Array<keyof PkgModule> = [
  "kind",
  "title",
  "description",
  "notes",
  "drip_days",
  "completion_xp",
  "header_image_path",
  "illustration",
  "required_for_certificate",
];

const LESSON_FIELDS: Array<keyof PkgLesson> = [
  "title",
  "series",
  "description",
  "notes",
  "planned_video_filename",
  "duration_sec",
  "transcript",
  "transcript_source_file",
  "is_preview",
  "is_intro",
  "drip_days_override",
  "status",
  "publish_at",
  "doctor_callout",
  "quiz_key",
];

function show(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") {
    const oneLine = value.replace(/\s+/g, " ").trim();
    return `"${oneLine.length > 70 ? `${oneLine.slice(0, 69)}…` : oneLine}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `[${value.length} item${value.length === 1 ? "" : "s"}]`;
  return JSON.stringify(value);
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function fieldChanges<T extends object>(a: T, b: T, fields: Array<keyof T>): string[] {
  const out: string[] = [];
  for (const f of fields) {
    if (same(a[f], b[f])) continue;
    const key = String(f);
    if (key === "transcript") {
      out.push(`transcript changed (${String(a[f] ?? "").length} → ${String(b[f] ?? "").length} characters)`);
    } else {
      out.push(`${key}: ${show(a[f])} → ${show(b[f])}`);
    }
  }
  return out;
}

function byKey<T>(items: T[], key: (item: T) => string): Map<string, T> {
  return new Map(items.map((i) => [key(i), i]));
}

function resourceChanges(prev: PkgLesson["resources"], next: PkgLesson["resources"]): string[] {
  const out: string[] = [];
  const a = byKey(prev, (r) => r.file_path);
  const b = byKey(next, (r) => r.file_path);
  for (const [path, r] of b) {
    const old = a.get(path);
    if (!old) out.push(`resource added: ${r.label} (${r.file_name})`);
    else if (old.label !== r.label) out.push(`resource relabelled: ${show(old.label)} → ${show(r.label)}`);
    else if (old.size_bytes !== r.size_bytes) out.push(`resource file changed: ${r.file_name}`);
  }
  for (const [path, r] of a) if (!b.has(path)) out.push(`resource removed: ${r.label} (${r.file_name})`);
  return out;
}

function stepChanges(prev: PkgLesson["action_steps"], next: PkgLesson["action_steps"]): string[] {
  const out: string[] = [];
  const a = byKey(prev, (s) => s.source_label);
  const b = byKey(next, (s) => s.source_label);
  for (const [label, s] of b) {
    const old = a.get(label);
    if (!old) {
      out.push(`action step added: ${s.label} (${s.xp} XP)`);
      continue;
    }
    const diffs: string[] = [];
    if (old.label !== s.label) diffs.push(`label ${show(old.label)} → ${show(s.label)}`);
    if (old.xp !== s.xp) diffs.push(`xp ${old.xp} → ${s.xp}`);
    if (old.kind !== s.kind) diffs.push(`kind ${old.kind} → ${s.kind}`);
    if (!same(old.link, s.link)) diffs.push(`link ${JSON.stringify(old.link)} → ${JSON.stringify(s.link)}`);
    if (old.requires_upload !== s.requires_upload || old.upload_type !== s.upload_type) diffs.push(`upload ${show(old.upload_type)} → ${show(s.upload_type)}`);
    if (!same(old.sub_items, s.sub_items)) diffs.push("sub-items changed");
    if (diffs.length) out.push(`action step "${s.label}": ${diffs.join(", ")}`);
  }
  for (const [label, s] of a) if (!b.has(label)) out.push(`action step removed: ${s.label} (${s.xp} XP)`);
  return out;
}

export function diffPackages(existing: CoursePackage, incoming: CoursePackage): PackageDiff {
  const changes: PackageChange[] = [];

  const courseDetails = fieldChanges(existing.course, incoming.course, COURSE_FIELDS);
  if (courseDetails.length) changes.push({ level: "course", kind: "changed", code: "course", title: incoming.course.title, details: courseDetails });

  const prevModules = byKey(existing.modules, (m) => m.code);
  const nextModules = byKey(incoming.modules, (m) => m.code);
  const prevLessons = new Map<string, { module: PkgModule; lesson: PkgLesson }>();
  for (const m of existing.modules) for (const l of m.lessons) prevLessons.set(l.code, { module: m, lesson: l });
  const nextLessons = new Map<string, { module: PkgModule; lesson: PkgLesson }>();
  for (const m of incoming.modules) for (const l of m.lessons) nextLessons.set(l.code, { module: m, lesson: l });

  for (const m of incoming.modules) {
    const old = prevModules.get(m.code);
    if (!old) {
      changes.push({ level: "module", kind: "added", code: m.code, title: m.title, details: [`${m.lessons.length} lessons, ${m.resources.length} module resources`] });
      continue;
    }
    const details = fieldChanges(old, m, MODULE_FIELDS);
    if (old.position !== m.position) details.push(`position ${old.position} → ${m.position}`);
    details.push(...resourceChanges(old.resources, m.resources));
    if (details.length) changes.push({ level: "module", kind: "changed", code: m.code, title: m.title, details });
  }
  for (const m of existing.modules) {
    if (!nextModules.has(m.code)) changes.push({ level: "module", kind: "removed", code: m.code, title: m.title, details: [`${m.lessons.length} lessons`] });
  }

  for (const [code, { module, lesson }] of nextLessons) {
    const old = prevLessons.get(code);
    if (!old) {
      changes.push({ level: "lesson", kind: "added", code, title: lesson.title, details: [`in ${module.title}; ${lesson.action_steps.length} action steps, ${lesson.resources.length} resources`] });
      continue;
    }
    const details = fieldChanges(old.lesson, lesson, LESSON_FIELDS);
    if (old.module.code !== module.code) details.push(`moved from ${old.module.code} to ${module.code}`);
    else if (old.lesson.position !== lesson.position) details.push(`position ${old.lesson.position} → ${lesson.position}`);
    const prevSlots = old.lesson.audio_slots.map((s) => s.key).join(", ");
    const nextSlots = lesson.audio_slots.map((s) => s.key).join(", ");
    if (prevSlots !== nextSlots) details.push(`audio slots: ${show(prevSlots || null)} → ${show(nextSlots || null)}`);
    details.push(...resourceChanges(old.lesson.resources, lesson.resources));
    details.push(...stepChanges(old.lesson.action_steps, lesson.action_steps));
    if (details.length) changes.push({ level: "lesson", kind: "changed", code, title: lesson.title, details });
  }
  for (const [code, { lesson }] of prevLessons) {
    if (!nextLessons.has(code)) changes.push({ level: "lesson", kind: "removed", code, title: lesson.title, details: [] });
  }

  const prevQuizzes = byKey(existing.quizzes, (q) => q.key);
  const nextQuizzes = byKey(incoming.quizzes, (q) => q.key);
  for (const q of incoming.quizzes) {
    const old = prevQuizzes.get(q.key);
    if (!old) {
      changes.push({ level: "quiz", kind: "added", code: q.key, title: q.title, details: [`${q.questions.length} questions`] });
      continue;
    }
    const details: string[] = [];
    if (old.title !== q.title) details.push(`title: ${show(old.title)} → ${show(q.title)}`);
    if (old.intro !== q.intro) details.push("intro text changed");
    if (old.confirmation !== q.confirmation) details.push("confirmation text changed");
    if (!same(old.questions, q.questions)) details.push(`questions changed (${old.questions.length} → ${q.questions.length})`);
    if (!same(old.scoring, q.scoring)) details.push("scoring changed");
    if (old.source_file !== q.source_file) details.push(`source: ${show(old.source_file)} → ${show(q.source_file)}`);
    if (details.length) changes.push({ level: "quiz", kind: "changed", code: q.key, title: q.title, details });
  }
  for (const q of existing.quizzes) if (!nextQuizzes.has(q.key)) changes.push({ level: "quiz", kind: "removed", code: q.key, title: q.title, details: [] });

  const prevCats = byKey(existing.forum_categories, (c) => c.slug);
  const nextCats = byKey(incoming.forum_categories, (c) => c.slug);
  for (const c of incoming.forum_categories) {
    const old = prevCats.get(c.slug);
    if (!old) changes.push({ level: "forum", kind: "added", code: c.slug, title: c.title, details: [] });
    else {
      const details: string[] = [];
      if (old.title !== c.title) details.push(`title: ${show(old.title)} → ${show(c.title)}`);
      if (old.description !== c.description) details.push("description changed");
      if (old.module_code !== c.module_code) details.push(`module: ${show(old.module_code)} → ${show(c.module_code)}`);
      if (details.length) changes.push({ level: "forum", kind: "changed", code: c.slug, title: c.title, details });
    }
  }
  for (const c of existing.forum_categories) if (!nextCats.has(c.slug)) changes.push({ level: "forum", kind: "removed", code: c.slug, title: c.title, details: [] });

  const statDetails: string[] = [];
  const s1 = existing.stats;
  const s2 = incoming.stats;
  for (const key of ["lesson_count", "resource_count", "transcript_count", "total_video_sec", "total_xp"] as const) {
    if (s1[key] !== s2[key]) statDetails.push(`${key.replace(/_/g, " ")}: ${s1[key]} → ${s2[key]}`);
  }
  for (const code of new Set([...Object.keys(s1.xp_by_module), ...Object.keys(s2.xp_by_module)])) {
    const a = s1.xp_by_module[code];
    const b = s2.xp_by_module[code];
    if (a !== b) statDetails.push(`XP ${code}: ${a ?? 0} → ${b ?? 0}`);
  }
  if (statDetails.length) changes.push({ level: "stats", kind: "changed", code: "stats", title: "Totals", details: statDetails });

  const counts: Record<ChangeKind, number> = { added: 0, removed: 0, changed: 0 };
  for (const c of changes) counts[c.kind] += 1;

  return { changes, counts, unchanged: changes.length === 0, summary: summarise(changes, existing, incoming) };
}

function summarise(changes: PackageChange[], existing: CoursePackage, incoming: CoursePackage): string {
  if (changes.length === 0) return "No changes — the package matches what is installed.";
  const parts: string[] = [];
  for (const level of ["module", "lesson", "quiz", "forum"] as const) {
    for (const kind of ["added", "removed", "changed"] as const) {
      const n = changes.filter((c) => c.level === level && c.kind === kind).length;
      if (n) parts.push(`${n} ${level}${n === 1 ? "" : "s"} ${kind}`);
    }
  }
  if (changes.some((c) => c.level === "course")) parts.unshift("course details changed");
  const xp = existing.stats.total_xp !== incoming.stats.total_xp ? `; total XP ${existing.stats.total_xp} → ${incoming.stats.total_xp}` : "";
  return `${parts.join(", ") || "Only totals changed"}${xp}.`;
}
