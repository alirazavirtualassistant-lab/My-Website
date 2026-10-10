/**
 * Pure Mux helpers: webhook signature verification and signed playback
 * tokens. No Mux client here so the unit tests can import this file without
 * credentials.
 *
 * Webhook signature (https://docs.mux.com/guides/verify-webhook-signatures):
 *   header  mux-signature: t=<unix seconds>,v1=<hex hmac>
 *   signed  "<t>.<raw body>" with HMAC-SHA256 keyed by the webhook secret.
 *
 * Playback tokens (https://docs.mux.com/guides/secure-video-playback):
 *   RS256 JWT, header kid = signing key id, claims { sub: playback id,
 *   aud: 'v' | 't' | 's', exp }.
 */
import { createHmac, createPrivateKey, timingSafeEqual, type KeyObject } from "node:crypto";
import { SignJWT } from "jose";

export const MUX_SIGNATURE_TOLERANCE_SEC = 5 * 60;
export const MUX_TOKEN_TTL_SEC = 2 * 60 * 60;

export type MuxAudience = "v" | "t" | "s" | "g";

export function computeMuxSignature(timestamp: number, rawBody: string, secret: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
}

/** Builds a `mux-signature` header value (used by tests and the admin "simulate" tools). */
export function buildMuxSignatureHeader(rawBody: string, secret: string, timestamp = Math.floor(Date.now() / 1000)): string {
  return `t=${timestamp},v1=${computeMuxSignature(timestamp, rawBody, secret)}`;
}

export function parseMuxSignatureHeader(header: string): { timestamp: number; signatures: string[] } {
  const out = { timestamp: -1, signatures: [] as string[] };
  for (const part of header.split(",")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === "t") out.timestamp = Number.parseInt(value, 10);
    else if (key === "v1" && value) out.signatures.push(value);
  }
  return out;
}

/**
 * Throws when the header is missing, malformed, stale (older than the
 * tolerance) or does not match the body. Returns the parsed timestamp.
 */
export function verifyMuxSignature(input: { rawBody: string; header: string | null; secret: string; now?: number; toleranceSec?: number }): number {
  if (!input.secret) throw new Error("[mux] MUX_WEBHOOK_SECRET is not set");
  if (!input.header) throw new Error("[mux] missing mux-signature header");
  const { timestamp, signatures } = parseMuxSignatureHeader(input.header);
  if (!Number.isFinite(timestamp) || timestamp < 0) throw new Error("[mux] could not read the timestamp from mux-signature");
  if (signatures.length === 0) throw new Error("[mux] no v1 signature in mux-signature");
  const expected = Buffer.from(computeMuxSignature(timestamp, input.rawBody, input.secret), "utf8");
  const ok = signatures.some((sig) => {
    const given = Buffer.from(sig, "utf8");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  if (!ok) throw new Error("[mux] signature does not match");
  const nowSec = Math.floor((input.now ?? Date.now()) / 1000);
  if (nowSec - timestamp > (input.toleranceSec ?? MUX_SIGNATURE_TOLERANCE_SEC)) throw new Error("[mux] webhook timestamp is too old");
  return timestamp;
}

/** Accepts a PEM or a base64-encoded PEM (how Mux hands out signing keys). */
export function decodeMuxPrivateKey(raw: string): KeyObject {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("[mux] MUX_SIGNING_KEY_PRIVATE is not set");
  const pem = trimmed.startsWith("-----BEGIN") ? trimmed : Buffer.from(trimmed, "base64").toString("utf8").trim();
  if (!pem.startsWith("-----BEGIN")) throw new Error("[mux] MUX_SIGNING_KEY_PRIVATE is neither a PEM nor a base64-encoded PEM");
  return createPrivateKey(pem); // handles PKCS#1 and PKCS#8
}

export async function signMuxToken(input: {
  playbackId: string;
  audience: MuxAudience;
  keyId: string;
  privateKey: KeyObject;
  ttlSec?: number;
  now?: number;
  params?: Record<string, string>;
}): Promise<string> {
  const nowSec = Math.floor((input.now ?? Date.now()) / 1000);
  const exp = nowSec + (input.ttlSec ?? MUX_TOKEN_TTL_SEC);
  return new SignJWT({ sub: input.playbackId, aud: input.audience, kid: input.keyId, ...(input.params ?? {}) })
    .setProtectedHeader({ alg: "RS256", kid: input.keyId })
    .setIssuedAt(nowSec)
    .setExpirationTime(exp)
    .sign(input.privateKey);
}
