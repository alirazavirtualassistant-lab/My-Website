import "server-only";
import { getServices } from "@/services";
import type { UploadType } from "@/lib/types";
import { newId, slugify } from "@/lib/utils";

const MAX_BYTES: Record<UploadType | "image" | "avatar" | "video" | "captions" | "resource", number> = {
  photo: 10 * 1024 * 1024,
  pdf: 20 * 1024 * 1024,
  journal: 20 * 1024 * 1024,
  any: 20 * 1024 * 1024,
  image: 10 * 1024 * 1024,
  avatar: 3 * 1024 * 1024,
  video: 2 * 1024 * 1024 * 1024,
  captions: 2 * 1024 * 1024,
  resource: 50 * 1024 * 1024,
};

const ALLOWED: Record<keyof typeof MAX_BYTES, string[]> = {
  photo: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  pdf: ["application/pdf"],
  journal: ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain", "text/markdown", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  any: ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain", "text/markdown", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  avatar: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/quicktime", "video/webm"],
  captions: ["text/vtt", "text/plain"],
  resource: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "audio/mpeg", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
};

export function validateUpload(file: File, kind: keyof typeof MAX_BYTES): string | null {
  if (!file || file.size === 0) return "Please choose a file";
  if (file.size > MAX_BYTES[kind]) return `That file is too large (max ${Math.round(MAX_BYTES[kind] / 1024 / 1024)} MB)`;
  const type = file.type || guessType(file.name);
  if (!ALLOWED[kind].includes(type)) return `That file type is not supported (${type || "unknown"})`;
  return null;
}

export function guessType(name: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const map: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    heic: "image/heic",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    vtt: "text/vtt",
    txt: "text/plain",
    md: "text/markdown",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] ?? "";
}

/** Stores a learner's private file under <userId>/<scope>/<id>-<name>. */
export async function storeLearnerUpload(userId: string, scope: string, file: File, kind: keyof typeof MAX_BYTES): Promise<{ path: string; size: number }> {
  const error = validateUpload(file, kind);
  if (error) throw new Error(error);
  const { storage } = await getServices();
  const safeName = `${newId().slice(0, 8)}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "file"}.${(file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const path = `${userId}/${slugify(scope) || "misc"}/${safeName}`;
  const data = Buffer.from(await file.arrayBuffer());
  return storage.upload({ bucket: "learner-uploads", path, data, contentType: file.type || guessType(file.name) || "application/octet-stream" });
}

/** Stores a public asset (avatars, course thumbnails, logo). */
export async function storePublicAsset(scope: string, file: File, kind: keyof typeof MAX_BYTES): Promise<{ path: string; url: string }> {
  const error = validateUpload(file, kind);
  if (error) throw new Error(error);
  const { storage } = await getServices();
  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${slugify(scope) || "misc"}/${newId()}.${ext}`;
  const data = Buffer.from(await file.arrayBuffer());
  await storage.upload({ bucket: "public-assets", path, data, contentType: file.type || guessType(file.name) || "application/octet-stream" });
  return { path, url: storage.getPublicUrl({ bucket: "public-assets", path }) };
}

/** Admin: store a course resource or lesson video/captions in the right bucket. */
export async function storeCourseFile(courseSlug: string, folder: string, file: File, kind: "resource" | "video" | "captions"): Promise<{ path: string; size: number }> {
  const error = validateUpload(file, kind);
  if (error) throw new Error(error);
  const { storage } = await getServices();
  const bucket = kind === "resource" ? "course-resources" : "video-uploads";
  const cleanName = file.name.replace(/[^\w.\-() ]/g, "_");
  const path = `${courseSlug}/${folder.replace(/[^\w\-\/]/g, "_")}/${cleanName}`;
  const data = Buffer.from(await file.arrayBuffer());
  return storage.upload({ bucket, path, data, contentType: file.type || guessType(file.name) || "application/octet-stream" });
}

export async function signedUrlFor(bucket: "course-resources" | "learner-uploads" | "video-uploads", path: string, download?: string): Promise<string> {
  const { storage } = await getServices();
  return storage.getSignedUrl({ bucket, path, expiresInSec: 600, download });
}
