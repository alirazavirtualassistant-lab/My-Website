import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createFakeDb } from "./fake-db";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-storage-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.AUTH_SECRET = "storage-test-secret";

const storageModule = await import("@/services/mock/storage");
const { createMockStorage, verifySignedPath, signPath, buildSignedUrl, normalizeStoragePath, contentTypeFor } = storageModule;

type Storage = Awaited<ReturnType<typeof createMockStorage>>;
let storage: Storage;

beforeAll(async () => {
  storage = await createMockStorage(createFakeDb());
});

function parseUrl(url: string): { pathname: string; params: URLSearchParams } {
  const u = new URL(url, "http://localhost");
  return { pathname: u.pathname, params: u.searchParams };
}

describe("signed urls", () => {
  it("produces a url the route can verify", async () => {
    const now = Date.now();
    const url = await storage.getSignedUrl({ bucket: "course-resources", path: "baby-steps/Module 1/Guide.pdf", expiresInSec: 600, download: "Guide.pdf" });
    const { pathname, params } = parseUrl(url);
    expect(pathname).toBe("/api/files/course-resources/baby-steps/Module%201/Guide.pdf");
    expect(params.get("download")).toBe("Guide.pdf");
    const exp = Number(params.get("exp"));
    expect(exp).toBeGreaterThanOrEqual(Math.floor(now / 1000) + 599);
    const ok = verifySignedPath({ bucket: "course-resources", path: "baby-steps/Module 1/Guide.pdf", exp, sig: params.get("sig")!, now });
    expect(ok).toBe(true);
  });

  it("rejects expired, tampered and cross-bucket signatures", () => {
    const now = Date.now();
    const exp = Math.floor(now / 1000) + 60;
    const sig = signPath({ bucket: "learner-uploads", path: "u1/photo.png", exp });
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp, sig, now })).toBe(true);
    // expired
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp, sig, now: now + 61_000 })).toBe(false);
    // tampered path
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u2/photo.png", exp, sig, now })).toBe(false);
    // tampered exp
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp: exp + 1, sig, now })).toBe(false);
    // tampered signature / wrong length
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp, sig: sig.slice(0, -1) + (sig.endsWith("0") ? "1" : "0"), now })).toBe(false);
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp, sig: "abc", now })).toBe(false);
    // different bucket
    expect(verifySignedPath({ bucket: "course-resources", path: "u1/photo.png", exp, sig, now })).toBe(false);
    // unknown bucket / garbage exp never throw
    expect(verifySignedPath({ bucket: "nope", path: "u1/photo.png", exp, sig, now })).toBe(false);
    expect(verifySignedPath({ bucket: "learner-uploads", path: "u1/photo.png", exp: Number.NaN, sig, now })).toBe(false);
  });

  it("builds unsigned public urls", () => {
    expect(storage.getPublicUrl({ bucket: "public-assets", path: "courses/baby steps.png" })).toBe("/api/files/public-assets/courses/baby%20steps.png");
    expect(buildSignedUrl({ bucket: "video-uploads", path: "l1/video.mp4", now: 0, expiresInSec: 10 })).toMatch(/^\/api\/files\/video-uploads\/l1\/video\.mp4\?exp=10&sig=[0-9a-f]{64}$/);
  });
});

describe("path safety", () => {
  it("rejects traversal and absolute paths", async () => {
    const bad = ["../secrets.txt", "a/../../b", "/etc/passwd", "C:\\win\\x", "a\\..\\b", "", "a/b\0c"];
    for (const p of bad) {
      expect(() => normalizeStoragePath(p), p).toThrow();
      await expect(storage.read({ bucket: "course-resources", path: p })).rejects.toThrow();
      await expect(storage.upload({ bucket: "learner-uploads", path: p, data: Buffer.from("x"), contentType: "text/plain" })).rejects.toThrow();
      await expect(storage.exists({ bucket: "course-resources", path: p })).rejects.toThrow();
      await expect(storage.delete({ bucket: "course-resources", path: p })).rejects.toThrow();
    }
    expect(normalizeStoragePath("./a//b/./c.pdf")).toBe("a/b/c.pdf");
    await expect(storage.getSignedUrl({ bucket: "course-resources", path: "../x" })).rejects.toThrow();
  });

  it("rejects unknown buckets", async () => {
    await expect(storage.read({ bucket: "secrets" as never, path: "a.txt" })).rejects.toThrow(/unknown bucket/);
  });
});

describe("files on disk", () => {
  it("uploads, reads, lists, checks and deletes under the data dir", async () => {
    const data = Buffer.from("hello, cravings");
    const res = await storage.upload({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt", data, contentType: "text/plain" });
    expect(res).toEqual({ path: "user-1/Journal Week 1.txt", size: data.byteLength });
    expect(fs.existsSync(path.join(ROOT, "storage", "learner-uploads", "user-1", "Journal Week 1.txt"))).toBe(true);

    const read = await storage.read({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt" });
    expect(read?.data.toString()).toBe("hello, cravings");
    expect(read?.contentType).toBe("text/plain; charset=utf-8");
    expect(await storage.exists({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt" })).toBe(true);
    expect(await storage.exists({ bucket: "learner-uploads", path: "user-1/missing.txt" })).toBe(false);
    expect(await storage.read({ bucket: "learner-uploads", path: "user-1/missing.txt" })).toBeNull();

    await storage.upload({ bucket: "learner-uploads", path: "user-1/nested/photo.png", data: Buffer.from([1, 2, 3]), contentType: "image/png" });
    await storage.upload({ bucket: "learner-uploads", path: "user-2/other.pdf", data: Buffer.from([1]), contentType: "application/pdf" });
    const listed = await storage.list({ bucket: "learner-uploads", prefix: "user-1" });
    expect(listed).toEqual([
      { path: "user-1/Journal Week 1.txt", size: data.byteLength },
      { path: "user-1/nested/photo.png", size: 3 },
    ]);

    await storage.delete({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt" });
    expect(await storage.exists({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt" })).toBe(false);
    await expect(storage.delete({ bucket: "learner-uploads", path: "user-1/Journal Week 1.txt" })).resolves.toBeUndefined();
  });

  it("falls back to the bundled content/storage root for reads", async () => {
    const bundled = path.resolve(process.cwd(), "content", "storage", "course-resources");
    const sample = findFirstFile(bundled);
    if (!sample) return; // bundled resources not present in this checkout
    const key = path.relative(bundled, sample).split(path.sep).join("/");
    expect(await storage.exists({ bucket: "course-resources", path: key })).toBe(true);
    const read = await storage.read({ bucket: "course-resources", path: key });
    expect(read?.data.byteLength).toBe(fs.statSync(sample).size);
    expect(read?.contentType).toBe(contentTypeFor(key));
    const listed = await storage.list({ bucket: "course-resources", prefix: key.split("/")[0] });
    expect(listed.some((f) => f.path === key)).toBe(true);
    // Deleting a bundled file is a no-op (read-only root).
    await storage.delete({ bucket: "course-resources", path: key });
    expect(fs.existsSync(sample)).toBe(true);
  });

  it("infers content types from the extension", () => {
    expect(contentTypeFor("a/b.PDF")).toBe("application/pdf");
    expect(contentTypeFor("x.xlsx")).toContain("spreadsheetml");
    expect(contentTypeFor("x.mp3")).toBe("audio/mpeg");
    expect(contentTypeFor("x.mp4")).toBe("video/mp4");
    expect(contentTypeFor("x.webp")).toBe("image/webp");
    expect(contentTypeFor("x.svg")).toBe("image/svg+xml");
    expect(contentTypeFor("x.vtt")).toBe("text/vtt");
    expect(contentTypeFor("x.json")).toBe("application/json");
    expect(contentTypeFor("x.unknownext")).toBe("application/octet-stream");
  });
});

function findFirstFile(dir: string): string | null {
  if (!fs.existsSync(dir)) return null;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isFile()) return full;
    if (entry.isDirectory()) {
      const found = findFirstFile(full);
      if (found) return found;
    }
  }
  return null;
}
