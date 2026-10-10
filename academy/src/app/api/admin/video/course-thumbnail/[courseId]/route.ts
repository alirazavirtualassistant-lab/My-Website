import { NextResponse, type NextRequest } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { AdminCourseError, setCourseThumbnail } from "@/lib/usecases/admin-courses";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST multipart { file } → stores the image in public-assets/thumbnails and
 * sets course.thumbnail_path. A Route Handler (not a Server Action) so the
 * upload is not capped by `serverActions.bodySizeLimit`.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!isAdminRole(session.role)) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  const { courseId } = await params;
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Please choose an image." }, { status: 400 });
  try {
    const course = await setCourseThumbnail(session.user_id, courseId, file);
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    return NextResponse.json({ ok: true, path: course.thumbnail_path });
  } catch (err) {
    const message = err instanceof AdminCourseError || (err instanceof Error && /too large|not supported|choose a file/i.test(err.message)) ? err.message : "The upload failed. Please try again.";
    if (!(err instanceof AdminCourseError)) console.error("[admin/course-thumbnail]", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
