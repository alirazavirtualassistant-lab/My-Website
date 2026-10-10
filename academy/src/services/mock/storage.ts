/**
 * Mock StorageProvider: files on the local disk.
 *
 * Two roots are consulted, in order:
 *   1. write root     <env.dataDir>/storage/<bucket>/<path>   (uploads land here)
 *   2. bundled root   content/storage/<bucket>/<path>         (read-only; the
 *      importer puts the course resources here so demo mode works from a
 *      fresh checkout)
 *
 * Private buckets are served by src/app/api/files/[bucket]/[...path] which
 * checks the HMAC signature produced by `signPath` via `verifySignedPath`.
 * `public-assets` is served unsigned.
 *
 * Paths are always "/"-separated storage keys (never OS paths). Anything that
 * tries to escape the bucket ("..", absolute paths, drive letters, NUL bytes)
 * throws.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "@/lib/env";
import type { Bucket, DataStore, StorageProvider } from "@/services/types";

export const DEFAULT_SIGNED_URL_TTL_SEC = 10 * 60;

const BUCKETS: readonly Bucket[] = ["course-resources", "learner-uploads", "public-assets", "video-uploads"];

const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  wav: "audio/wav",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  vtt: "text/vtt",
  srt: "application/x-subrip",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  json: "application/json",
  html: "text/html; charset=utf-8",
  css: "text/css",
  js: "text/javascript",
  zip: "application/zip",
};

// ---------------------------------------------------------------------------
// Pure helpers (exported for the route handler and tests)
// ---------------------------------------------------------------------------

/** MIME type from a file name / storage path; octet-stream when unknown. */
export function contentTypeFor(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

/**
 * Normalises a storage key and rejects anything that could escape the
 * bucket directory. Returns the clean "/"-separated key.
 */
export function normalizeStoragePath(input: string): string {
  if (typeof input !== "string" || input.length === 0) throw new Error("[mock-storage] empty path");
  if (input.includes("\0")) throw new Error("[mock-storage] invalid path");
  const unified = input.replace(/\\/g, "/");
  if (unified.startsWith("/") || /^[a-zA-Z]:/.test(unified)) throw new Error(`[mock-storage] absolute paths are not allowed: ${input}`);
  const segments = unified.split("/").filter((s) => s.length > 0 && s !== ".");
  if (segments.length === 0) throw new Error("[mock-storage] empty path");
  if (segments.some((s) => s === ".." || s.includes(".."))) throw new Error(`[mock-storage] path traversal rejected: ${input}`);
  return segments.join("/");
}

function assertBucket(bucket: string): asserts bucket is Bucket {
  if (!BUCKETS.includes(bucket as Bucket)) throw new Error(`[mock-storage] unknown bucket: ${bucket}`);
}

/** Absolute directory of the writable root. */
export function writeRoot(): string {
  return path.resolve(process.cwd(), env.dataDir, "storage");
}

/** Absolute directory of the read-only bundled root. */
export function bundledRoot(): string {
  return path.resolve(process.cwd(), "content", "storage");
}

/** Resolves a (bucket, key) under a root, re-checking containment. */
function resolveUnder(root: string, bucket: Bucket, key: string): string {
  const base = path.resolve(root, bucket);
  const full = path.resolve(base, ...key.split("/"));
  if (full !== base && !full.startsWith(base + path.sep)) throw new Error(`[mock-storage] path escapes bucket: ${key}`);
  return full;
}

function signingSecret(): string {
  return env.authSecret;
}

/** HMAC-SHA256 hex over `bucket|path|exp`. */
export function signPath(input: { bucket: Bucket; path: string; exp: number }): string {
  const key = normalizeStoragePath(input.path);
  return createHmac("sha256", signingSecret()).update(`${input.bucket}|${key}|${Math.floor(input.exp)}`).digest("hex");
}

/**
 * Verifies a signature produced by `signPath`. `exp` is a unix timestamp in
 * seconds; `now` is milliseconds (Date.now()) so the route can pass it as-is.
 */
export function verifySignedPath(input: { bucket: Bucket | string; path: string; exp: number; sig: string; now?: number }): boolean {
  try {
    assertBucket(input.bucket);
    const exp = Number(input.exp);
    if (!Number.isFinite(exp) || exp <= 0) return false;
    const nowSec = Math.floor((input.now ?? Date.now()) / 1000);
    if (exp < nowSec) return false;
    const expected = signPath({ bucket: input.bucket, path: input.path, exp });
    const given = String(input.sig ?? "");
    if (given.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(given, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

function encodeKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

/** Builds the signed URL served by /api/files. Exported so tests and previews can build one without the adapter. */
export function buildSignedUrl(input: { bucket: Bucket; path: string; expiresInSec?: number; download?: string; now?: number }): string {
  const key = normalizeStoragePath(input.path);
  const ttl = Math.max(1, Math.floor(input.expiresInSec ?? DEFAULT_SIGNED_URL_TTL_SEC));
  const exp = Math.floor((input.now ?? Date.now()) / 1000) + ttl;
  const sig = signPath({ bucket: input.bucket, path: key, exp });
  let url = `/api/files/${input.bucket}/${encodeKey(key)}?exp=${exp}&sig=${sig}`;
  if (input.download) url += `&download=${encodeURIComponent(input.download)}`;
  return url;
}

export function buildPublicUrl(key: string): string {
  return `/api/files/public-assets/${encodeKey(normalizeStoragePath(key))}`;
}

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

async function statOrNull(file: string): Promise<{ size: number; isFile: boolean } | null> {
  try {
    const st = await fs.stat(file);
    return { size: st.size, isFile: st.isFile() };
  } catch {
    return null;
  }
}

async function walk(dir: string, relPrefix: string, out: Map<string, number>): Promise<void> {
  let entries: Array<{ name: string; isDirectory(): boolean; isFile(): boolean }>;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(abs, rel, out);
    else if (entry.isFile() && !out.has(rel)) {
      const st = await statOrNull(abs);
      out.set(rel, st?.size ?? 0);
    }
  }
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export async function createMockStorage(_db: DataStore): Promise<StorageProvider> {
  void _db;

  /** Finds the first root containing the file. */
  async function locate(bucket: Bucket, key: string): Promise<string | null> {
    for (const root of [writeRoot(), bundledRoot()]) {
      const full = resolveUnder(root, bucket, key);
      const st = await statOrNull(full);
      if (st?.isFile) return full;
    }
    return null;
  }

  const storage: StorageProvider = {
    kind: "mock",

    async getSignedUrl(input) {
      assertBucket(input.bucket);
      return buildSignedUrl(input);
    },

    getPublicUrl(input) {
      return buildPublicUrl(input.path);
    },

    async upload(input) {
      assertBucket(input.bucket);
      const key = normalizeStoragePath(input.path);
      const full = resolveUnder(writeRoot(), input.bucket, key);
      await fs.mkdir(path.dirname(full), { recursive: true });
      const body = Buffer.isBuffer(input.data) ? input.data : Buffer.from(input.data);
      const tmp = `${full}.${process.pid}.${Date.now()}.tmp`;
      await fs.writeFile(tmp, body);
      await fs.rename(tmp, full);
      return { path: key, size: body.byteLength };
    },

    async read(input) {
      assertBucket(input.bucket);
      const key = normalizeStoragePath(input.path);
      const full = await locate(input.bucket, key);
      if (!full) return null;
      const data = await fs.readFile(full);
      return { data, contentType: contentTypeFor(key) };
    },

    async delete(input) {
      assertBucket(input.bucket);
      const key = normalizeStoragePath(input.path);
      const full = resolveUnder(writeRoot(), input.bucket, key);
      try {
        await fs.unlink(full);
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        if (code !== "ENOENT") throw err;
        // Bundled files are read-only; deleting one is a no-op.
      }
    },

    async list(input) {
      assertBucket(input.bucket);
      const prefix = input.prefix ? normalizeStoragePath(input.prefix) : "";
      const found = new Map<string, number>();
      for (const root of [writeRoot(), bundledRoot()]) {
        const dir = prefix ? resolveUnder(root, input.bucket, prefix) : path.resolve(root, input.bucket);
        await walk(dir, prefix, found);
      }
      return Array.from(found, ([p, size]) => ({ path: p, size })).sort((a, b) => a.path.localeCompare(b.path));
    },

    async exists(input) {
      assertBucket(input.bucket);
      const key = normalizeStoragePath(input.path);
      return (await locate(input.bucket, key)) !== null;
    },
  };

  return storage;
}
