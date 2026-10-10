/**
 * Supabase Storage adapter. Buckets are named exactly like the `Bucket` type
 * (course-resources, learner-uploads, public-assets, video-uploads); only
 * `public-assets` is a public bucket. Uses the service-role client so the
 * use-case layer decides who may read what; signed URLs are short-lived.
 */
import type { Bucket, DataStore, StorageProvider } from "@/services/types";
import { createAdminSupabase } from "./client";

const DEFAULT_SIGNED_URL_TTL_SEC = 10 * 60;

function isNotFound(error: { message: string; status?: number; statusCode?: string }): boolean {
  if (error.status === 404 || error.statusCode === "404") return true;
  const msg = error.message.toLowerCase();
  return msg.includes("not found") || msg.includes("object not found") || msg.includes("not_found");
}

function fail(bucket: Bucket, op: string, error: { message: string }): never {
  throw new Error(`[supabase-storage:${bucket}] ${op} failed: ${error.message}`);
}

function joinPath(prefix: string, name: string): string {
  const base = prefix.replace(/\/+$/, "");
  return base ? `${base}/${name}` : name;
}

export async function createSupabaseStorage(_db: DataStore): Promise<StorageProvider> {
  void _db;
  const bucket = (name: Bucket) => createAdminSupabase().storage.from(name);

  const storage: StorageProvider = {
    kind: "supabase",

    async getSignedUrl(input) {
      const expiresIn = Math.max(1, Math.floor(input.expiresInSec ?? DEFAULT_SIGNED_URL_TTL_SEC));
      const options = input.download ? { download: input.download } : undefined;
      const { data, error } = await bucket(input.bucket).createSignedUrl(input.path, expiresIn, options);
      if (error || !data) fail(input.bucket, "getSignedUrl", error ?? { message: "no url returned" });
      return data.signedUrl;
    },

    getPublicUrl(input) {
      return bucket(input.bucket).getPublicUrl(input.path).data.publicUrl;
    },

    async upload(input) {
      const body = Buffer.isBuffer(input.data) ? input.data : Buffer.from(input.data);
      const { data, error } = await bucket(input.bucket).upload(input.path, body, {
        contentType: input.contentType,
        upsert: true,
      });
      if (error || !data) fail(input.bucket, "upload", error ?? { message: "no path returned" });
      return { path: data.path, size: body.byteLength };
    },

    async read(input) {
      const { data, error } = await bucket(input.bucket).download(input.path);
      if (error) {
        if (isNotFound(error)) return null;
        fail(input.bucket, "read", error);
      }
      if (!data) return null;
      const buffer = Buffer.from(await data.arrayBuffer());
      return { data: buffer, contentType: data.type || "application/octet-stream" };
    },

    async delete(input) {
      const { error } = await bucket(input.bucket).remove([input.path]);
      if (error && !isNotFound(error)) fail(input.bucket, "delete", error);
    },

    async list(input) {
      // Non-recursive: lists objects directly under the prefix (folders are skipped).
      const prefix = input.prefix.replace(/\/+$/, "");
      const out: Array<{ path: string; size: number }> = [];
      const pageSize = 1000;
      for (let offset = 0; ; offset += pageSize) {
        const { data, error } = await bucket(input.bucket).list(prefix, {
          limit: pageSize,
          offset,
          sortBy: { column: "name", order: "asc" },
        });
        if (error) fail(input.bucket, "list", error);
        const items = data ?? [];
        for (const item of items) {
          if (item.id === null) continue; // folder placeholder
          const size = typeof item.metadata?.size === "number" ? item.metadata.size : 0;
          out.push({ path: joinPath(prefix, item.name), size });
        }
        if (items.length < pageSize) break;
      }
      return out;
    },

    async exists(input) {
      const { data, error } = await bucket(input.bucket).exists(input.path);
      if (error) {
        if (isNotFound(error)) return false;
        fail(input.bucket, "exists", error);
      }
      return data === true;
    },
  };

  return storage;
}
