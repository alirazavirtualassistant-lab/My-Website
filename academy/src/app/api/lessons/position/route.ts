import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateLessonPosition } from "@/lib/usecases/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  lessonId: z.string().min(1).max(80),
  positionSec: z.number().min(0).max(60 * 60 * 24),
  watchedDeltaSec: z.number().min(0).max(120).default(0),
});

/**
 * Playback-position ping for `navigator.sendBeacon` on page hide/unload (the
 * in-page pings use the Server Action). Body: JSON { lessonId, positionSec,
 * watchedDeltaSec }. Always answers 204 so beacons never surface errors.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return new NextResponse(null, { status: 204 });
  let body: unknown = null;
  try {
    const text = await req.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 204 });
  try {
    await updateLessonPosition(session.user_id, parsed.data.lessonId, parsed.data.positionSec, parsed.data.watchedDeltaSec, session.role);
  } catch {
    // Locked or inaccessible lessons are ignored silently.
  }
  return new NextResponse(null, { status: 204 });
}
