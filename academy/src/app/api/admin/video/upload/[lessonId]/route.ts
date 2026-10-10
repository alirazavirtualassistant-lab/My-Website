import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession, isAdminRole } from "@/lib/auth/session";
import {
  AdminCourseError,
  addLessonResource,
  setLessonCaptions,
  setLessonThumbnail,
  storeLessonVideo,
  uploadAudioSlot,
} from "@/lib/usecases/admin-courses";
import { getServices } from "@/services";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const kindSchema = z.enum(["video", "captions", "thumbnail", "audio", "resource"]);

/**
 * Lesson media uploads (multipart). Fields:
 *   kind   video | captions | thumbnail | audio | resource   (default video)
 *   file   the file
 *   slot   audio slot key (kind=audio)
 *   label  resource label (kind=resource, optional)
 *
 * `video` is the mock-mode direct upload target handed out by
 * VideoProvider.createDirectUpload; the file lands in the video-uploads bucket
 * and the lesson switches to provider "url". A Route Handler (not a Server
 * Action) so uploads are not capped by `serverActions.bodySizeLimit`.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!isAdminRole(session.role)) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  const { lessonId } = await params;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart upload." }, { status: 400 });
  }
  const kind = kindSchema.safeParse(form.get("kind") ?? "video");
  if (!kind.success) return NextResponse.json({ error: "Unknown upload kind." }, { status: 400 });
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Please choose a file." }, { status: 400 });

  try {
    const { db } = await getServices();
    const before = await db.from("lessons").get(lessonId);
    if (!before) return NextResponse.json({ error: "That lesson no longer exists." }, { status: 404 });
    let path: string | null = null;
    switch (kind.data) {
      case "video": {
        const lesson = await storeLessonVideo(session.user_id, lessonId, file);
        path = lesson.video_url;
        break;
      }
      case "captions": {
        const lesson = await setLessonCaptions(session.user_id, lessonId, file);
        path = lesson.captions_path;
        break;
      }
      case "thumbnail": {
        const lesson = await setLessonThumbnail(session.user_id, lessonId, file);
        path = lesson.thumbnail_path;
        break;
      }
      case "audio": {
        const slot = z.string().min(1).max(60).safeParse(form.get("slot"));
        if (!slot.success) return NextResponse.json({ error: "Missing audio slot." }, { status: 400 });
        const lesson = await uploadAudioSlot(session.user_id, lessonId, slot.data, file);
        path = lesson.audio_slots.find((s) => s.key === slot.data)?.file_path ?? null;
        break;
      }
      case "resource": {
        const label = z.string().max(200).optional().safeParse(form.get("label") ?? undefined);
        const row = await addLessonResource(session.user_id, lessonId, file, label.success ? label.data : undefined);
        path = row.file_path;
        break;
      }
    }
    revalidatePath(`/admin/courses/${before.course_id}/lessons/${lessonId}`);
    revalidatePath(`/admin/courses/${before.course_id}/curriculum`);
    revalidatePath("/learn", "layout");
    return NextResponse.json({ ok: true, kind: kind.data, lesson_id: lessonId, path });
  } catch (err) {
    const known = err instanceof AdminCourseError || (err instanceof Error && /too large|not supported|choose a file/i.test(err.message));
    if (!known) console.error("[admin/video upload]", err);
    return NextResponse.json({ error: known ? (err as Error).message : "The upload failed. Please try again." }, { status: known ? 400 : 500 });
  }
}
