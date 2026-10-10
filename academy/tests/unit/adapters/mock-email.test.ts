import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { createFakeDb } from "./fake-db";

process.env.DEMO_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-email-"));

const { createMockEmail } = await import("@/services/mock/email");
const { sendTemplate, buildTemplateMessage } = await import("@/lib/email/send");
const { templateNames, templates } = await import("@/emails");
const { previews, renderPreview } = await import("@/emails/previews");
const { createMockVideo } = await import("@/services/mock/video");
const { createMockStorage } = await import("@/services/mock/storage");

describe("mock email", () => {
  it("records an email_events row with rendered html and text", async () => {
    const db = createFakeDb();
    const email = await createMockEmail(db);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const message = buildTemplateMessage("drip-unlock", "jordan@example.com", {
      name: "Jordan Lee",
      moduleTitle: "Module 2: Nutrition for Optimal Fertility",
      courseTitle: "Baby Steps",
      learnUrl: "http://localhost:3000/learn/baby-steps",
      job_key: "drip:e1:m2",
    });
    const result = await email.send(message);
    log.mockRestore();
    expect(result.ok).toBe(true);
    const rows = await db.from("email_events").list();
    expect(rows).toHaveLength(1);
    const row = rows[0];
    expect(row.id).toBe(result.id);
    expect(row).toMatchObject({ to: "jordan@example.com", template: "drip-unlock", provider: "mock", status: "sent", error: null });
    expect(row.subject).toBe("Module 2: Nutrition for Optimal Fertility is now open");
    expect(row.html).toContain("<!DOCTYPE html");
    expect(row.html).toContain("Module 2: Nutrition for Optimal Fertility");
    expect(row.html).toContain("http://localhost:3000/learn/baby-steps");
    expect(row.payload.job_key).toBe("drip:e1:m2");
    expect(String(row.payload.text)).toMatch(/module 2: nutrition for optimal fertility/i);
    expect(String(row.payload.text)).not.toContain("<");
  });

  it("never throws when rendering fails; records status failed", async () => {
    const db = createFakeDb();
    const email = await createMockEmail(db);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const Boom = () => {
      throw new Error("kaboom");
    };
    const result = await email.send({ to: "a@b.co", subject: "x", template: "boom", react: createElement(Boom) });
    warn.mockRestore();
    expect(result.ok).toBe(false);
    expect(result.error).toContain("kaboom");
    const row = (await db.from("email_events").list())[0];
    expect(row.status).toBe("failed");
    expect(row.html).toBeNull();
    expect(row.error).toContain("kaboom");
  });

  it("sendTemplate works with explicit services and never throws", async () => {
    const db = createFakeDb();
    const email = await createMockEmail(db);
    vi.spyOn(console, "log").mockImplementation(() => {});
    const ok = await sendTemplate({ email }, "welcome", "jordan@example.com", { name: "Jordan", learnUrl: "http://localhost:3000/learn" });
    expect(ok.ok).toBe(true);
    const failing = { kind: "mock" as const, send: async () => { throw new Error("provider down"); } };
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const failed = await sendTemplate({ email: failing }, "welcome", "jordan@example.com", { name: "Jordan", learnUrl: "/learn" });
    expect(failed).toEqual({ ok: false, error: "provider down" });
    vi.restoreAllMocks();
  });
});

describe("email templates", () => {
  it("every registered template renders its preview with a subject", async () => {
    expect(templateNames.length).toBe(20);
    for (const name of templateNames) {
      expect(previews[name], name).toBeDefined();
      expect(typeof templates[name].subject).toBe("function");
      const preview = await renderPreview(name);
      expect(preview.subject.length, name).toBeGreaterThan(3);
      expect(preview.html, name).toContain("Cradle Your Cravings");
      expect(preview.html, name).toContain("not medical advice");
      expect(preview.text.length, name).toBeGreaterThan(20);
    }
  });

  it("receipt lists items and totals", async () => {
    const preview = await renderPreview("purchase-receipt");
    expect(preview.html).toContain("Baby Steps");
    expect(preview.html).toContain("$177");
    expect(preview.html).toContain("Start learning");
  });

  it("broadcast renders markdown headings, bullets, bold and links", async () => {
    const preview = await renderPreview("broadcast", { name: "Jo", subject: "Hello", body: "# Title\n\n- one\n- two\n\nSome **bold** and a [link](https://example.com/x)." });
    expect(preview.html).toContain("<h2");
    expect(preview.html).toContain("<li");
    expect(preview.html).toContain("<strong>bold</strong>");
    expect(preview.html).toContain('href="https://example.com/x"');
  });
});

describe("mock video", () => {
  it("resolves url playback through signed storage urls and treats mux as none", async () => {
    process.env.AUTH_SECRET = "video-test-secret";
    const storage = await createMockStorage(createFakeDb());
    const video = await createMockVideo(createFakeDb(), storage);
    const signed = await video.getPlayback({ provider: "url", playback_id: null, video_url: "lesson-1/intro.mp4", captions_path: "lesson-1/intro.vtt", thumbnail_path: "lessons/intro.png", user_id: "u1" });
    expect(signed.kind).toBe("url");
    if (signed.kind !== "url") throw new Error("unreachable");
    expect(signed.src).toMatch(/^\/api\/files\/video-uploads\/lesson-1\/intro\.mp4\?exp=\d+&sig=[0-9a-f]{64}$/);
    expect(signed.captions).toMatch(/^\/api\/files\/video-uploads\/lesson-1\/intro\.vtt\?exp=/);
    expect(signed.poster).toBe("/api/files/public-assets/lessons/intro.png");

    const external = await video.getPlayback({ provider: "url", playback_id: null, video_url: "https://cdn.example.com/v.mp4", captions_path: null, thumbnail_path: null, user_id: null });
    expect(external).toEqual({ kind: "url", src: "https://cdn.example.com/v.mp4", captions: null, poster: null });

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await video.getPlayback({ provider: "mux", playback_id: "pb1", video_url: null, captions_path: null, thumbnail_path: null, user_id: null })).toEqual({ kind: "none" });
    warn.mockRestore();
    expect(await video.getPlayback({ provider: "none", playback_id: null, video_url: null, captions_path: null, thumbnail_path: null, user_id: null })).toEqual({ kind: "none" });
    expect(await video.createDirectUpload({ lesson_id: "l1", filename: "a.mp4", cors_origin: "http://localhost:3000" })).toEqual({ upload_url: "/api/admin/video/upload/l1", upload_id: "mock_up_l1" });
    expect(await video.parseWebhook({ rawBody: "{}", signature: null })).toEqual({ type: "ignored" });
  });
});
