/**
 * Mux VideoProvider (@mux/mux-node@15).
 *
 * - Playback: signed playback ids. Tokens are RS256 JWTs signed with the Mux
 *   signing key from env (base64-encoded PEM). Video ('v'), thumbnail ('t')
 *   and storyboard ('s') tokens are issued together, valid for two hours.
 * - Lessons with provider 'url' (self-hosted / external file) reuse the mock
 *   adapter's resolver so both adapters behave identically for them.
 * - Direct uploads: `video.uploads.create` with a signed playback policy and
 *   the lesson id as `passthrough`. The admin UI stores the returned upload id
 *   on the lesson (`video_asset_id`) until `video.asset.ready` arrives.
 * - Webhooks: signature verified with MUX_WEBHOOK_SECRET; only
 *   `video.asset.ready` and `video.asset.errored` are mapped.
 */
import Mux from "@mux/mux-node";
import type { KeyObject } from "node:crypto";
import { env } from "@/lib/env";
import type { DataStore, Playback, StorageProvider, VideoProvider } from "@/services/types";
import { resolveUrlPlayback } from "@/services/mock/video";
import { decodeMuxPrivateKey, signMuxToken, verifyMuxSignature } from "./signing";

declare global {
  var __cycMuxClient: Mux | undefined;
}

export function getMux(): Mux {
  if (!globalThis.__cycMuxClient) {
    if (!env.mux.tokenId || !env.mux.tokenSecret) throw new Error("[mux] MUX_TOKEN_ID / MUX_TOKEN_SECRET are not set (VIDEO_PROVIDER=mux)");
    globalThis.__cycMuxClient = new Mux({
      tokenId: env.mux.tokenId,
      tokenSecret: env.mux.tokenSecret,
      webhookSecret: env.mux.webhookSecret || null,
    });
  }
  return globalThis.__cycMuxClient;
}

/** Test helper. */
export function resetMuxClient(): void {
  globalThis.__cycMuxClient = undefined;
}

interface MuxWebhookPayload {
  type?: string;
  data?: {
    id?: string;
    upload_id?: string;
    duration?: number;
    passthrough?: string;
    playback_ids?: Array<{ id?: string; policy?: string }>;
  };
}

/** Maps a parsed (already verified) Mux webhook body. Exported for tests. */
export function mapMuxWebhook(payload: MuxWebhookPayload): Awaited<ReturnType<VideoProvider["parseWebhook"]>> {
  const data = payload.data ?? {};
  const assetId = data.id;
  if (!assetId) return { type: "ignored" };
  switch (payload.type) {
    case "video.asset.ready": {
      const playbackId = data.playback_ids?.find((p) => p.policy === "signed")?.id ?? data.playback_ids?.[0]?.id;
      if (!playbackId) {
        console.warn(`[mux] asset ${assetId} is ready but has no playback id; ignoring`);
        return { type: "ignored" };
      }
      return {
        type: "asset.ready",
        upload_id: data.upload_id ?? null,
        asset_id: assetId,
        playback_id: playbackId,
        duration_sec: typeof data.duration === "number" ? data.duration : null,
      };
    }
    case "video.asset.errored":
      return { type: "asset.errored", upload_id: data.upload_id ?? null, asset_id: assetId };
    default:
      return { type: "ignored" };
  }
}

export async function createMuxVideo(_db: DataStore, storage: StorageProvider): Promise<VideoProvider> {
  void _db;
  let privateKey: KeyObject | null = null;

  function signingKey(): { keyId: string; privateKey: KeyObject } {
    if (!env.mux.signingKeyId) throw new Error("[mux] MUX_SIGNING_KEY_ID is not set (needed for signed playback)");
    if (!privateKey) privateKey = decodeMuxPrivateKey(env.mux.signingKeyPrivate);
    return { keyId: env.mux.signingKeyId, privateKey };
  }

  async function signedPlayback(playbackId: string): Promise<Playback> {
    const key = signingKey();
    const [token, thumbnail_token, storyboard_token] = await Promise.all([
      signMuxToken({ playbackId, audience: "v", ...key }),
      signMuxToken({ playbackId, audience: "t", ...key }),
      signMuxToken({ playbackId, audience: "s", ...key }),
    ]);
    return { kind: "mux", playback_id: playbackId, token, thumbnail_token, storyboard_token };
  }

  const video: VideoProvider = {
    kind: "mux",

    async getPlayback(input) {
      switch (input.provider) {
        case "mux":
          if (!input.playback_id) return { kind: "none" };
          return signedPlayback(input.playback_id);
        case "url":
          return resolveUrlPlayback(storage, input);
        default:
          return { kind: "none" };
      }
    },

    async createDirectUpload(input) {
      const upload = await getMux().video.uploads.create({
        cors_origin: input.cors_origin,
        new_asset_settings: {
          playback_policies: ["signed"],
          passthrough: input.lesson_id,
        },
      });
      if (!upload.url) throw new Error("[mux] direct upload has no url");
      return { upload_url: upload.url, upload_id: upload.id };
    },

    async parseWebhook({ rawBody, signature }) {
      verifyMuxSignature({ rawBody, header: signature, secret: env.mux.webhookSecret });
      let payload: MuxWebhookPayload;
      try {
        payload = JSON.parse(rawBody) as MuxWebhookPayload;
      } catch {
        throw new Error("[mux] webhook body is not JSON");
      }
      return mapMuxWebhook(payload);
    },

    async deleteAsset(asset_id) {
      try {
        await getMux().video.assets.delete(asset_id);
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 404) return; // already gone
        throw err;
      }
    },
  };

  return video;
}
