import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateKeyPairSync } from "node:crypto";
import { jwtVerify } from "jose";
import { createFakeDb } from "./fake-db";

process.env.DEMO_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "cyc-mux-"));
process.env.MUX_WEBHOOK_SECRET = "mux-test-secret";

const { buildMuxSignatureHeader, computeMuxSignature, verifyMuxSignature, decodeMuxPrivateKey, signMuxToken } = await import("@/services/mux/signing");
const { createMuxVideo, mapMuxWebhook } = await import("@/services/mux/video");
const { createMockStorage } = await import("@/services/mock/storage");

const SECRET = "mux-test-secret";

describe("mux webhook signatures", () => {
  it("accepts a header built with the known secret", () => {
    const body = JSON.stringify({ type: "video.asset.ready", data: { id: "a1" } });
    const ts = 1_700_000_000;
    const header = buildMuxSignatureHeader(body, SECRET, ts);
    expect(header).toBe(`t=${ts},v1=${computeMuxSignature(ts, body, SECRET)}`);
    expect(verifyMuxSignature({ rawBody: body, header, secret: SECRET, now: ts * 1000 + 10_000 })).toBe(ts);
  });

  it("rejects missing, tampered, wrong-secret and stale headers", () => {
    const body = '{"type":"video.asset.ready"}';
    const ts = 1_700_000_000;
    const header = buildMuxSignatureHeader(body, SECRET, ts);
    expect(() => verifyMuxSignature({ rawBody: body, header: null, secret: SECRET, now: ts * 1000 })).toThrow(/missing/);
    expect(() => verifyMuxSignature({ rawBody: body + " ", header, secret: SECRET, now: ts * 1000 })).toThrow(/does not match/);
    expect(() => verifyMuxSignature({ rawBody: body, header, secret: "other", now: ts * 1000 })).toThrow(/does not match/);
    expect(() => verifyMuxSignature({ rawBody: body, header: "t=abc,v1=00", secret: SECRET, now: ts * 1000 })).toThrow(/timestamp/);
    expect(() => verifyMuxSignature({ rawBody: body, header: `t=${ts}`, secret: SECRET, now: ts * 1000 })).toThrow(/no v1/);
    expect(() => verifyMuxSignature({ rawBody: body, header, secret: SECRET, now: (ts + 301) * 1000 })).toThrow(/too old/);
    expect(() => verifyMuxSignature({ rawBody: body, header, secret: "", now: ts * 1000 })).toThrow(/MUX_WEBHOOK_SECRET/);
  });

  it("parseWebhook verifies and maps asset events", async () => {
    const video = await createMuxVideo(createFakeDb(), await createMockStorage(createFakeDb()));
    const ready = JSON.stringify({
      type: "video.asset.ready",
      data: { id: "asset_1", upload_id: "upload_1", duration: 612.4, passthrough: "lesson-1", playback_ids: [{ id: "pb_public", policy: "public" }, { id: "pb_signed", policy: "signed" }] },
    });
    const event = await video.parseWebhook({ rawBody: ready, signature: buildMuxSignatureHeader(ready, SECRET) });
    expect(event).toEqual({ type: "asset.ready", upload_id: "upload_1", asset_id: "asset_1", playback_id: "pb_signed", duration_sec: 612.4 });

    const errored = JSON.stringify({ type: "video.asset.errored", data: { id: "asset_2", upload_id: null } });
    expect(await video.parseWebhook({ rawBody: errored, signature: buildMuxSignatureHeader(errored, SECRET) })).toEqual({ type: "asset.errored", upload_id: null, asset_id: "asset_2" });

    const other = JSON.stringify({ type: "video.upload.created", data: { id: "upload_1" } });
    expect(await video.parseWebhook({ rawBody: other, signature: buildMuxSignatureHeader(other, SECRET) })).toEqual({ type: "ignored" });

    await expect(video.parseWebhook({ rawBody: ready, signature: "t=1,v1=bad" })).rejects.toThrow();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(mapMuxWebhook({ type: "video.asset.ready", data: { id: "a", playback_ids: [] } })).toEqual({ type: "ignored" });
    warn.mockRestore();
    expect(mapMuxWebhook({ type: "video.asset.ready" })).toEqual({ type: "ignored" });
  });
});

describe("mux playback tokens", () => {
  it("signs RS256 tokens with the expected claims from a base64 PEM", async () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
    const base64 = Buffer.from(pem).toString("base64");
    const key = decodeMuxPrivateKey(base64);
    const now = 1_700_000_000_000;
    const token = await signMuxToken({ playbackId: "pb_1", audience: "v", keyId: "key_abc", privateKey: key, now, ttlSec: 7200 });
    const { payload, protectedHeader } = await jwtVerify(token, publicKey, { audience: "v", subject: "pb_1", currentDate: new Date(now) });
    expect(protectedHeader).toMatchObject({ alg: "RS256", kid: "key_abc" });
    expect(payload).toMatchObject({ sub: "pb_1", aud: "v", kid: "key_abc", exp: now / 1000 + 7200 });
    // PEM passed directly and PKCS#1 keys also work
    expect(decodeMuxPrivateKey(pem).type).toBe("private");
    expect(decodeMuxPrivateKey(privateKey.export({ type: "pkcs1", format: "pem" }).toString()).type).toBe("private");
    expect(() => decodeMuxPrivateKey("")).toThrow();
    expect(() => decodeMuxPrivateKey(Buffer.from("nope").toString("base64"))).toThrow(/PEM/);
  });

  it("getPlayback signs video, thumbnail and storyboard tokens", async () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    process.env.MUX_SIGNING_KEY_ID = "key_xyz";
    process.env.MUX_SIGNING_KEY_PRIVATE = Buffer.from(privateKey.export({ type: "pkcs8", format: "pem" }).toString()).toString("base64");
    const video = await createMuxVideo(createFakeDb(), await createMockStorage(createFakeDb()));
    const playback = await video.getPlayback({ provider: "mux", playback_id: "pb_9", video_url: null, captions_path: null, thumbnail_path: null, user_id: "u1" });
    expect(playback.kind).toBe("mux");
    if (playback.kind !== "mux") throw new Error("unreachable");
    expect(playback.playback_id).toBe("pb_9");
    for (const [token, aud] of [
      [playback.token, "v"],
      [playback.thumbnail_token, "t"],
      [playback.storyboard_token, "s"],
    ] as const) {
      const { payload } = await jwtVerify(token!, publicKey, { audience: aud, subject: "pb_9" });
      expect(payload.kid).toBe("key_xyz");
    }
    expect(await video.getPlayback({ provider: "mux", playback_id: null, video_url: null, captions_path: null, thumbnail_path: null, user_id: null })).toEqual({ kind: "none" });
    const url = await video.getPlayback({ provider: "url", playback_id: null, video_url: "https://cdn.example.com/a.mp4", captions_path: null, thumbnail_path: null, user_id: null });
    expect(url).toEqual({ kind: "url", src: "https://cdn.example.com/a.mp4", captions: null, poster: null });
  });
});
