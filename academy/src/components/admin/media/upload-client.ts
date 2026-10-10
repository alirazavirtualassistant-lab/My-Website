/**
 * Browser-side upload helpers (XMLHttpRequest so we get upload progress).
 * Used by the lesson media cards, the bulk video panel and the importer.
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  /** 0–100 */
  percent: number;
}

export interface UploadOptions {
  method?: "POST" | "PUT";
  headers?: Record<string, string>;
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
}

export class UploadError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(message: string, status: number, body: unknown = null) {
    super(message);
    this.name = "UploadError";
    this.status = status;
    this.body = body;
  }
}

function parseBody(xhr: XMLHttpRequest): unknown {
  const text = xhr.responseText;
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function messageFrom(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "error" in body && typeof (body as { error: unknown }).error === "string") return (body as { error: string }).error;
  return fallback;
}

/** Uploads `body` (FormData or a File for PUT) and resolves with the parsed JSON (or text) response. */
export function uploadWithProgress<T = unknown>(url: string, body: FormData | File | Blob, opts: UploadOptions = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method ?? "POST", url, true);
    for (const [k, v] of Object.entries(opts.headers ?? {})) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => {
      if (!opts.onProgress) return;
      const total = e.lengthComputable ? e.total : (body as Blob).size || 0;
      const loaded = e.loaded;
      opts.onProgress({ loaded, total, percent: total ? Math.min(100, Math.round((loaded / total) * 100)) : 0 });
    };
    xhr.onload = () => {
      const parsed = parseBody(xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        opts.onProgress?.({ loaded: (body as Blob).size || 0, total: (body as Blob).size || 0, percent: 100 });
        resolve(parsed as T);
      } else {
        reject(new UploadError(messageFrom(parsed, `Upload failed (${xhr.status})`), xhr.status, parsed));
      }
    };
    xhr.onerror = () => reject(new UploadError("The upload could not reach the server. Check your connection and try again.", 0));
    xhr.onabort = () => reject(new UploadError("Upload cancelled.", 0));
    if (opts.signal) {
      if (opts.signal.aborted) xhr.abort();
      else opts.signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }
    xhr.send(body);
  });
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

/** Result shape of /api/admin/video/upload/[lessonId]. */
export interface LessonMediaUploadResult {
  ok: true;
  kind: "video" | "captions" | "thumbnail" | "audio" | "resource";
  lesson_id: string;
  path: string | null;
}

/** Uploads a file for a lesson through the admin media route (mock/self-hosted mode). */
export function uploadLessonMedia(lessonId: string, kind: LessonMediaUploadResult["kind"], file: File, extra: Record<string, string> = {}, opts: UploadOptions = {}) {
  const fd = new FormData();
  fd.set("kind", kind);
  for (const [k, v] of Object.entries(extra)) fd.set(k, v);
  fd.set("file", file, file.name);
  return uploadWithProgress<LessonMediaUploadResult>(`/api/admin/video/upload/${encodeURIComponent(lessonId)}`, fd, opts);
}
