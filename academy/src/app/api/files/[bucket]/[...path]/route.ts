import { NextResponse, type NextRequest } from "next/server";
import { getServices } from "@/services";
import type { Bucket } from "@/services/types";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKETS: Bucket[] = ["course-resources", "learner-uploads", "public-assets", "video-uploads"];

/**
 * Serves files for the mock storage adapter. Private buckets require a valid
 * signed URL (10-minute expiry by default); learner uploads additionally
 * require the signed-in owner (or an admin). In Supabase mode files are served
 * by Supabase's own signed URLs and this route is unused.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ bucket: string; path: string[] }> }) {
  const { bucket, path: segments } = await params;
  if (!BUCKETS.includes(bucket as Bucket)) return NextResponse.json({ error: "Unknown bucket" }, { status: 404 });
  const path = segments.map(decodeURIComponent).join("/");
  if (path.includes("..")) return NextResponse.json({ error: "Bad path" }, { status: 400 });
  const { storage } = await getServices();
  if (storage.kind !== "mock") return NextResponse.json({ error: "Not available" }, { status: 404 });
  const { verifySignedPath } = await import("@/services/mock/storage");
  const url = req.nextUrl;

  if (bucket !== "public-assets") {
    const exp = Number(url.searchParams.get("exp"));
    const sig = url.searchParams.get("sig") ?? "";
    const ok = await verifySignedPath({ bucket: bucket as Bucket, path, exp, sig, now: Date.now() });
    if (!ok) return NextResponse.json({ error: "This link has expired. Please reopen the lesson to get a fresh one." }, { status: 403 });
    if (bucket === "learner-uploads") {
      const session = await getSession();
      const owner = path.split("/")[0];
      if (!session || (session.user_id !== owner && session.role !== "admin" && session.role !== "assistant")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }
  const file = await storage.read({ bucket: bucket as Bucket, path });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const download = url.searchParams.get("download");
  const headers: Record<string, string> = {
    "Content-Type": file.contentType,
    "Content-Length": String(file.data.byteLength),
    "Cache-Control": bucket === "public-assets" ? "public, max-age=31536000, immutable" : "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (download) headers["Content-Disposition"] = `attachment; filename="${download.replace(/[^\w.\- ()]/g, "_")}"`;
  // Range support for video/audio scrubbing
  const range = req.headers.get("range");
  if (range && (file.contentType.startsWith("video/") || file.contentType.startsWith("audio/"))) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (match) {
      const size = file.data.byteLength;
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? Math.min(parseInt(match[2], 10), size - 1) : size - 1;
      if (start <= end && start < size) {
        const chunk = file.data.subarray(start, end + 1);
        return new NextResponse(new Uint8Array(chunk), {
          status: 206,
          headers: { ...headers, "Content-Length": String(chunk.byteLength), "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes" },
        });
      }
    }
  }
  return new NextResponse(new Uint8Array(file.data), { status: 200, headers: { ...headers, "Accept-Ranges": "bytes" } });
}
