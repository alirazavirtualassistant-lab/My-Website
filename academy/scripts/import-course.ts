/**
 * Course importer CLI.
 *
 *   npx tsx scripts/import-course.ts [--source content/source/Baby_Steps_Course]
 *                                    [--zip content/source/Baby_Steps_Course.zip]
 *                                    [--out content/courses/baby-steps]
 *                                    [--storage content/storage/course-resources]
 *                                    [--slug baby-steps] [--dry-run]
 *
 * Writes <out>/course.json and copies every learner file to
 * <storage>/<file_path>. Exits 1 when the package fails validation.
 */
import fs from "node:fs/promises";
import path from "node:path";
import type { CoursePackage } from "../src/lib/types";
import { ImportError, importFromDirectory, importFromZip, type ImportResult } from "../src/lib/importer";

interface Args {
  source: string;
  zip: string | null;
  out: string;
  storage: string;
  slug: string;
  dryRun: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    source: "content/source/Baby_Steps_Course",
    zip: null,
    out: "content/courses/baby-steps",
    storage: "content/storage/course-resources",
    slug: "baby-steps",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`${a} needs a value`);
      return v;
    };
    if (a === "--source") args.source = next();
    else if (a === "--zip") args.zip = next();
    else if (a === "--out") args.out = next();
    else if (a === "--storage") args.storage = next();
    else if (a === "--slug") args.slug = next();
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log("Usage: tsx scripts/import-course.ts [--source DIR | --zip FILE] [--out DIR] [--storage DIR] [--slug SLUG] [--dry-run]");
      process.exit(0);
    } else throw new Error(`Unknown argument ${a}`);
  }
  return args;
}

function pad(text: string, width: number, align: "left" | "right" = "left"): string {
  const s = String(text);
  const fill = Math.max(0, width - s.length);
  return align === "left" ? s + " ".repeat(fill) : " ".repeat(fill) + s;
}

function table(headers: string[], rows: string[][], rightAlignFrom = 1): string {
  const widths = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (cells: string[]) => cells.map((c, i) => pad(c, widths[i], i >= rightAlignFrom ? "right" : "left")).join("  ");
  return [line(headers), widths.map((w) => "-".repeat(w)).join("  "), ...rows.map(line)].join("\n");
}

function minutes(sec: number): string {
  return (sec / 60).toFixed(sec % 60 === 0 ? 0 : 1);
}

export function summary(pkg: CoursePackage): string {
  const rows = pkg.modules.map((m) => {
    const lessonFiles = new Set(m.lessons.flatMap((l) => l.resources.map((r) => r.file_path)));
    for (const r of m.resources) lessonFiles.add(r.file_path);
    const transcripts = m.lessons.filter((l) => l.transcript_source_file).length;
    const video = m.lessons.reduce((a, l) => a + l.duration_sec, 0);
    return [
      m.code,
      m.title,
      String(m.lessons.length),
      String(lessonFiles.size),
      String(transcripts),
      minutes(video),
      String(pkg.stats.xp_by_module[m.code] ?? 0),
    ];
  });
  const totals = [
    "TOTAL",
    `${pkg.modules.length} modules`,
    String(pkg.stats.lesson_count),
    String(pkg.stats.resource_count),
    String(pkg.stats.transcript_count),
    minutes(pkg.stats.total_video_sec),
    String(pkg.stats.total_xp),
  ];
  return table(["Code", "Module", "Lessons", "Resources", "Transcripts", "Video min", "XP"], [...rows, totals], 2);
}

async function writeOutputs(result: ImportResult, args: Args): Promise<{ written: number; bytes: number }> {
  await fs.mkdir(args.out, { recursive: true });
  await fs.writeFile(path.join(args.out, "course.json"), `${JSON.stringify(result.pkg, null, 2)}\n`, "utf8");
  let bytes = 0;
  for (const f of result.files) {
    const dest = path.join(args.storage, ...f.storage_path.split("/"));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, f.data);
    bytes += f.size_bytes;
  }
  return { written: result.files.length, bytes };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const started = Date.now();
  let result: ImportResult;
  if (args.zip) {
    const data = await fs.readFile(args.zip);
    result = await importFromZip(data, { slug: args.slug, zipName: path.basename(args.zip) });
  } else {
    const zipSibling = `${args.source.replace(/\/+$/, "")}.zip`;
    const zipName = await fs
      .stat(zipSibling)
      .then(() => path.basename(zipSibling))
      .catch(() => null);
    result = await importFromDirectory(args.source, { slug: args.slug, zipName });
  }
  const { pkg } = result;

  console.log(`\n${pkg.course.title}`);
  console.log(`Source: ${args.zip ?? args.source} (${pkg.source.sheet})\n`);
  console.log(summary(pkg));
  const lessonTranscripts = pkg.modules.reduce((a, m) => a + m.lessons.filter((l) => l.transcript_source_file).length, 0);
  console.log(
    `\nLessons ${pkg.stats.lesson_count} · distinct resources ${pkg.stats.resource_count} · transcript files consumed ${pkg.stats.transcript_count} (${lessonTranscripts} lesson transcripts + ${pkg.stats.transcript_count - lessonTranscripts} appended) · video ${minutes(pkg.stats.total_video_sec)} min · total XP ${pkg.stats.total_xp}`,
  );
  console.log(`Quizzes: ${pkg.quizzes.map((q) => `${q.key} (${q.questions.length})`).join(", ")}`);
  console.log(`Forum categories: ${pkg.forum_categories.length}`);
  if (result.warnings.length) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    for (const w of result.warnings) console.log(`  - ${w}`);
  }

  if (args.dryRun) {
    console.log("\nDry run: nothing written.");
    return;
  }
  const { written, bytes } = await writeOutputs(result, args);
  console.log(`\nWrote ${path.join(args.out, "course.json")} and copied ${written} files (${(bytes / 1024 / 1024).toFixed(1)} MB) to ${args.storage}/${args.slug}/ in ${Date.now() - started} ms.`);
}

main().catch((err: unknown) => {
  if (err instanceof ImportError) {
    console.error(`\nImport failed with ${err.problems.length} problem${err.problems.length === 1 ? "" : "s"}:`);
    for (const p of err.problems) console.error(`  - ${p}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
