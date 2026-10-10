/**
 * Importer session store (mock backend): parse the real Baby Steps zip with
 * and without a workbook override, persist the preview, reload it and
 * re-read the learner files for installation.
 */
import { beforeAll, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-import-sessions-"));
process.env.DEMO_DATA_DIR = ROOT;
process.env.DEMO_MODE = "0";
process.env.AUTH_SECRET = "test-secret-not-for-production";

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined, getAll: () => [], has: () => false, set() {}, delete() {} }),
  headers: async () => new Headers(),
}));

const sessions = await import("@/app/admin/(panel)/importer/_lib/sessions");

const ZIP = path.resolve(process.cwd(), "content/source/Baby_Steps_Course.zip");
const SHEET_DIR = path.resolve(process.cwd(), "content/source/Baby_Steps_Course");

let zip: Buffer;
let sheet: { name: string; data: Buffer };

beforeAll(async () => {
  zip = await fs.promises.readFile(ZIP);
  const name = (await fs.promises.readdir(SHEET_DIR)).find((n) => /\.xlsx$/i.test(n));
  if (!name) throw new Error("source workbook missing");
  sheet = { name: "Edited_Sheet.xlsx", data: await fs.promises.readFile(path.join(SHEET_DIR, name)) };
});

describe("parseUploadedPackage", () => {
  it("parses the zip as-is", async () => {
    const result = await sessions.parseUploadedPackage(zip, "Baby_Steps_Course.zip", null);
    expect(result.pkg.stats.lesson_count).toBe(59);
    expect(result.files.length).toBeGreaterThan(50);
    expect(result.pkg.source.zip).toBe("Baby_Steps_Course.zip");
  });

  it("swaps in an override workbook", async () => {
    const result = await sessions.parseUploadedPackage(zip, "Baby_Steps_Course.zip", sheet);
    expect(result.pkg.stats.lesson_count).toBe(59);
    expect(result.pkg.source.sheet).toBe("Edited_Sheet.xlsx");
  });
});

describe("session store", () => {
  it("round-trips a session and its files, lists it and deletes it", async () => {
    const result = await sessions.parseUploadedPackage(zip, "Baby_Steps_Course.zip", sheet);
    const created = await sessions.createImportSession({ actorId: "admin-1", result, source: { kind: "zip", zip_name: "Baby_Steps_Course.zip", sheet_name: sheet.name }, zip, sheet });
    expect(created.file_count).toBe(result.files.length);
    expect(fs.existsSync(path.join(ROOT, "imports", `${created.id}.json`))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, "imports", `${created.id}.zip`))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, "imports", `${created.id}.xlsx`))).toBe(true);

    const loaded = await sessions.loadImportSession(created.id);
    expect(loaded?.pkg.course.slug).toBe("baby-steps");
    expect(loaded?.source).toEqual({ kind: "zip", zip_name: "Baby_Steps_Course.zip", sheet_name: "Edited_Sheet.xlsx" });

    const files = await sessions.loadImportFiles(loaded!);
    expect(files?.files.length).toBe(result.files.length);
    expect(files?.pkg.source.sheet).toBe("Edited_Sheet.xlsx");

    const listed = await sessions.listImportSessions();
    expect(listed.map((s) => s.id)).toContain(created.id);
    expect(listed[0]).toMatchObject({ course_slug: "baby-steps", lesson_count: 59 });

    await sessions.deleteImportSession(created.id);
    expect(await sessions.loadImportSession(created.id)).toBeNull();
    expect((await sessions.listImportSessions()).map((s) => s.id)).not.toContain(created.id);
  });

  it("rejects malformed ids and missing sessions", async () => {
    await expect(sessions.loadImportSession("../etc/passwd")).rejects.toThrow(/Invalid import id/);
    expect(await sessions.loadImportSession("00000000-0000-4000-8000-000000000000")).toBeNull();
  });
});
