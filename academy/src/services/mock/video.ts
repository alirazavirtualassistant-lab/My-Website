/**
 * Mock VideoProvider for demo mode.
 *
 * - provider 'url'  → the lesson's `video_url` is either an absolute http(s)
 *   URL (used as-is) or a key in the `video-uploads` bucket (signed through
 *   the storage adapter). Captions/poster are signed the same way.
 * - provider 'mux'  → not available without Mux credentials; treated as
 *   'none' with a console warning so the player shows "coming soon".
 * - Direct uploads point at an in-app route that accepts a multipart MP4 and
 *   stores it in `video-uploads` (built by the admin CMS).
 *
 * `resolveUrlPlayback` is shared with the Mux adapter for self-hosted lessons.
 */
import type { DataStore, Playback, StorageProvider, VideoProvider } from "@/services/types";

const PLAYBACK_URL_TTL_SEC = 2 * 60 * 60; // long enough for a lesson in one sitting

export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** Builds a `{ kind: 'url' }` playback descriptor for a self-hosted lesson video. */
export async function resolveUrlPlayback(
  storage: StorageProvider,
  input: { video_url: string | null; captions_path: string | null; thumbnail_path: string | null },
): Promise<Playback> {
  if (!input.video_url) return { kind: "none" };
  const src = isAbsoluteUrl(input.video_url)
    ? input.video_url
    : await storage.getSignedUrl({ bucket: "video-uploads", path: input.video_url, expiresInSec: PLAYBACK_URL_TTL_SEC });
  const captions = input.captions_path
    ? isAbsoluteUrl(input.captions_path)
      ? input.captions_path
      : await storage.getSignedUrl({ bucket: "video-uploads", path: input.captions_path, expiresInSec: PLAYBACK_URL_TTL_SEC })
    : null;
  const poster = input.thumbnail_path ? await resolvePoster(storage, input.thumbnail_path) : null;
  return { kind: "url", src, captions, poster };
}

/** Thumbnails live in public-assets (course/lesson art) unless the key is an absolute URL. */
export async function resolvePoster(storage: StorageProvider, thumbnailPath: string): Promise<string> {
  if (isAbsoluteUrl(thumbnailPath)) return thumbnailPath;
  return storage.getPublicUrl({ bucket: "public-assets", path: thumbnailPath });
}

export function mockUploadId(lessonId: string): string {
  return `mock_up_${lessonId}`;
}

export async function createMockVideo(_db: DataStore, storage: StorageProvider): Promise<VideoProvider> {
  void _db;

  const video: VideoProvider = {
    kind: "mock",

    async getPlayback(input) {
      switch (input.provider) {
        case "url":
          return resolveUrlPlayback(storage, input);
        case "mux":
          console.warn(`[mock-video] lesson uses Mux playback id ${input.playback_id ?? "(none)"} but VIDEO_PROVIDER=mock; showing "coming soon".`);
          return { kind: "none" };
        default:
          return { kind: "none" };
      }
    },

    async createDirectUpload(input) {
      return { upload_url: `/api/admin/video/upload/${encodeURIComponent(input.lesson_id)}`, upload_id: mockUploadId(input.lesson_id) };
    },

    async parseWebhook() {
      return { type: "ignored" };
    },

    async deleteAsset() {
      // Nothing to delete: mock lessons keep their file in storage until the admin removes it.
    },
  };

  return video;
}
