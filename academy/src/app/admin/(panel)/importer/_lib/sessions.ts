import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "@/lib/env";
import { getServices } from "@/services";
import type { CoursePackage } from "@/lib/types";
import { newId, nowIso } from "@/lib/utils";
import { importFromFiles, importFromZip, zipToVirtualFiles, type ImportResult } from "@/lib/importer";

/**
 * A parsed package waiting for the admin's go-ahead. The JSON summary and the
 * original upload are kept side by side so the install step can re-read the
 * learner files without holding them in memory between requests.
 *
 *   mock backend      <env.dataDir>/imports/<id>.{json,zip,xlsx}
 *   supabase backend  video-uploads bucket, imports/<id>.{json,zip,xlsx}
 */
export interface ImportSession {
  id: string;
  created_at: string;
  created_by: string;
  source: { kind: "zip"; zip_name: string; sheet_name: string | null } | { kind: "bundled"; slug: string };
  pkg: CoursePackage;
  warnings: string[];
  file_count: number;
  total_file_bytes: number;
}

const PREFIX = "imports";
const ID_RE = /^[a-f0-9-]{36}$/i;

function importsDir(): string {
  return path.resolve(process.cwd(), env.dataDir, PREFIX);
}

function assertId(id: string): string {
  if (!ID_RE.test(id)) throw new Error("Invalid import id");
  return id.toLowerCase();
}

async function writeBlob(name: string, data: Buffer, contentType: string): Promise<void> {
  if (env.backend === "mock") {
    const dir = importsDir();
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), data);
    return;
  }
  const { storage } = await getServices();
  await storage.upload({ bucket: "video-uploads", path: `${PREFIX}/${name}`, data, contentType });
}

async function readBlob(name: string): Promise<Buffer | null> {
  if (env.backend === "mock") {
    try {
      return await fs.readFile(path.join(importsDir(), name));
    } catch {
      return null;
    }
  }
  const { storage } = await getServices();
  const file = await storage.read({ bucket: "video-uploads", path: `${PREFIX}/${name}` });
  return file?.data ?? null;
}

async function deleteBlob(name: string): Promise<void> {
  if (env.backend === "mock") {
    try {
      await fs.unlink(path.join(importsDir(), name));
    } catch {
      /* already gone */
    }
    return;
  }
  const { storage } = await getServices();
  await storage.delete({ bucket: "video-uploads", path: `${PREFIX}/${name}` });
}

/** Applies an optional workbook override, then parses the package. */
export async function parseUploadedPackage(zip: Buffer, zipName: string, sheet: { name: string; data: Buffer } | null): Promise<ImportResult> {
  if (!sheet) return importFromZip(zip, { zipName });
  const files = await zipToVirtualFiles(zip);
  for (const key of [...files.keys()]) if (!key.includes("/") && /\.xlsx$/i.test(key)) files.delete(key);
  const name = sheet.name.replace(/^.*[\\/]/, "").trim() || "Course_Sheet.xlsx";
  files.set(/\.xlsx$/i.test(name) ? name : `${name}.xlsx`, sheet.data);
  return importFromFiles(files, { zipName });
}

export async function createImportSession(input: {
  actorId: string;
  result: ImportResult;
  source: ImportSession["source"];
  zip: Buffer | null;
  sheet: { name: string; data: Buffer } | null;
}): Promise<ImportSession> {
  const session: ImportSession = {
    id: newId(),
    created_at: nowIso(),
    created_by: input.actorId,
    source: input.source,
    pkg: input.result.pkg,
    warnings: input.result.warnings,
    file_count: input.result.files.length,
    total_file_bytes: input.result.files.reduce((n, f) => n + f.size_bytes, 0),
  };
  await writeBlob(`${session.id}.json`, Buffer.from(JSON.stringify(session), "utf8"), "application/json");
  if (input.zip) await writeBlob(`${session.id}.zip`, input.zip, "application/zip");
  if (input.sheet) await writeBlob(`${session.id}.xlsx`, input.sheet.data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return session;
}

export async function loadImportSession(id: string): Promise<ImportSession | null> {
  const safe = assertId(id);
  const raw = await readBlob(`${safe}.json`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw.toString("utf8")) as ImportSession;
    if (!parsed || parsed.id !== safe || !parsed.pkg) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Re-parses the stored upload so the install step gets the learner files. */
export async function loadImportFiles(session: ImportSession): Promise<ImportResult | null> {
  if (session.source.kind !== "zip") return null;
  const zip = await readBlob(`${session.id}.zip`);
  if (!zip) return null;
  const sheetData = session.source.sheet_name ? await readBlob(`${session.id}.xlsx`) : null;
  return parseUploadedPackage(zip, session.source.zip_name, sheetData && session.source.sheet_name ? { name: session.source.sheet_name, data: sheetData } : null);
}

export async function deleteImportSession(id: string): Promise<void> {
  const safe = assertId(id);
  await Promise.all([deleteBlob(`${safe}.json`), deleteBlob(`${safe}.zip`), deleteBlob(`${safe}.xlsx`)]);
}

/** Pending previews, newest first (summary only). */
export async function listImportSessions(): Promise<Array<Pick<ImportSession, "id" | "created_at" | "source" | "warnings"> & { course_title: string; course_slug: string; lesson_count: number }>> {
  let names: string[] = [];
  if (env.backend === "mock") {
    try {
      names = (await fs.readdir(importsDir())).filter((n) => n.endsWith(".json"));
    } catch {
      names = [];
    }
  } else {
    const { storage } = await getServices();
    names = (await storage.list({ bucket: "video-uploads", prefix: PREFIX })).map((f) => f.path.replace(/^.*\//, "")).filter((n) => n.endsWith(".json"));
  }
  const sessions = await Promise.all(names.map((n) => loadImportSession(n.replace(/\.json$/, "")).catch(() => null)));
  return sessions
    .filter((s): s is ImportSession => !!s)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((s) => ({
      id: s.id,
      created_at: s.created_at,
      source: s.source,
      warnings: s.warnings,
      course_title: s.pkg.course.title,
      course_slug: s.pkg.course.slug,
      lesson_count: s.pkg.stats.lesson_count,
    }));
}
