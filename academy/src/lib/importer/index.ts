import fs from "node:fs/promises";
import path from "node:path";
import { parseCourseSheet, type ParsedSheet } from "./parse-sheet";
import { parsePackage } from "./parse-package";
import { normalisePath, zipToVirtualFiles } from "./zip";
import { ImportError, type ImportOptions, type ImportResult, type VirtualFiles } from "./types";

/**
 * Public importer API.
 *
 *   importFromDirectory("content/source/Baby_Steps_Course")  → scripts
 *   importFromZip(buffer)                                      → admin bulk importer
 *   diffPackages(existing, incoming)                           → admin preview
 *
 * Both importers return the CoursePackage, the learner files to copy into the
 * course-resources bucket, and non-fatal warnings. Validation failures throw
 * ImportError with every problem listed.
 */

export { diffPackages } from "./diff";
export type { PackageChange, PackageDiff, ChangeKind, ChangeLevel } from "./diff";
export { parseCourseSheet, rowsFromMatrix } from "./parse-sheet";
export type { ParsedSheet, SheetRow, XpSummaryEntry } from "./parse-sheet";
export { parsePackage } from "./parse-package";
export { zipToVirtualFiles } from "./zip";
export { QUIZ_DEFINITIONS } from "./quizzes";
export { ImportError } from "./types";
export type { ImportOptions, ImportResult, StoredFile, VirtualFiles } from "./types";

const SKIP_DIRS = new Set(["node_modules", ".git", "__MACOSX", "_production"]);

/** Reads a package folder on disk into a virtual file map (package-relative, forward-slash paths). */
export async function readDirectoryToVirtualFiles(dir: string): Promise<VirtualFiles> {
  const root = path.resolve(dir);
  const files: VirtualFiles = new Map();
  async function walk(current: string): Promise<void> {
    const entries = await fs.readdir(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      if (entry.name === ".DS_Store" || entry.name === "Thumbs.db") continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) await walk(full);
      } else if (entry.isFile()) {
        files.set(normalisePath(path.relative(root, full)), await fs.readFile(full));
      }
    }
  }
  await walk(root);
  return files;
}

/** Finds the course workbook: a root-level .xlsx, preferring one whose name mentions "sheet". */
export function findSheetPath(files: VirtualFiles): string | null {
  const candidates = [...files.keys()].filter((p) => !p.includes("/") && /\.xlsx$/i.test(p) && !p.startsWith("~$"));
  if (candidates.length === 0) return null;
  return candidates.find((p) => /sheet/i.test(p)) ?? candidates.sort()[0];
}

/** Imports from an in-memory file map (the two entry points below both end here). */
export async function importFromFiles(files: VirtualFiles, opts: ImportOptions = {}): Promise<ImportResult> {
  const sheetPath = findSheetPath(files);
  if (!sheetPath) throw new ImportError(["No course workbook (.xlsx) found at the root of the package"]);
  let sheet: ParsedSheet;
  try {
    sheet = await parseCourseSheet(files.get(sheetPath)!, sheetPath);
  } catch (err) {
    throw new ImportError([`${sheetPath}: ${(err as Error).message}`]);
  }
  return parsePackage(files, sheet, opts);
}

export async function importFromDirectory(dir: string, opts: ImportOptions = {}): Promise<ImportResult> {
  const files = await readDirectoryToVirtualFiles(dir);
  if (files.size === 0) throw new ImportError([`${dir}: directory is empty or missing`]);
  return importFromFiles(files, { zipName: null, ...opts });
}

export async function importFromZip(data: Buffer | Uint8Array | ArrayBuffer, opts: ImportOptions = {}): Promise<ImportResult> {
  let files: VirtualFiles;
  try {
    files = await zipToVirtualFiles(data);
  } catch (err) {
    throw new ImportError([`Could not read the zip file: ${(err as Error).message}`]);
  }
  if (files.size === 0) throw new ImportError(["The zip file is empty"]);
  return importFromFiles(files, { zipName: opts.zipName ?? "upload.zip", ...opts });
}
