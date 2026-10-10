import { NextResponse, type NextRequest } from "next/server";
import { getSession, isAdminRole } from "@/lib/auth/session";
import { ImportError } from "@/lib/importer";
import { logAudit } from "@/lib/usecases/users";
import { createImportSession, parseUploadedPackage } from "@/app/admin/(panel)/importer/_lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const MAX_ZIP_BYTES = 500 * 1024 * 1024;
const MAX_SHEET_BYTES = 20 * 1024 * 1024;

/**
 * POST multipart { zip, sheet? } → parses the course package and stores it as
 * a pending import session. Answers { importId } or { error, problems[] }.
 * A Route Handler because package zips are far larger than the Server Action
 * body limit.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!isAdminRole(session.role)) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart upload." }, { status: 400 });
  }
  const zip = form.get("zip");
  if (!(zip instanceof File) || zip.size === 0) return NextResponse.json({ error: "Please choose the course package (.zip)." }, { status: 400 });
  if (!/\.zip$/i.test(zip.name)) return NextResponse.json({ error: "The package must be a .zip file." }, { status: 400 });
  if (zip.size > MAX_ZIP_BYTES) return NextResponse.json({ error: "That zip is larger than 500 MB." }, { status: 400 });
  const sheetFile = form.get("sheet");
  let sheet: { name: string; data: Buffer } | null = null;
  if (sheetFile instanceof File && sheetFile.size > 0) {
    if (!/\.xlsx$/i.test(sheetFile.name)) return NextResponse.json({ error: "The course sheet must be an .xlsx workbook." }, { status: 400 });
    if (sheetFile.size > MAX_SHEET_BYTES) return NextResponse.json({ error: "That workbook is larger than 20 MB." }, { status: 400 });
    sheet = { name: sheetFile.name, data: Buffer.from(await sheetFile.arrayBuffer()) };
  }
  const zipData = Buffer.from(await zip.arrayBuffer());
  try {
    const result = await parseUploadedPackage(zipData, zip.name, sheet);
    const created = await createImportSession({ actorId: session.user_id, result, source: { kind: "zip", zip_name: zip.name, sheet_name: sheet?.name ?? null }, zip: zipData, sheet });
    await logAudit(session.user_id, "import.parsed", "import_session", created.id, { zip: zip.name, sheet: sheet?.name ?? null, lessons: result.pkg.stats.lesson_count, warnings: result.warnings.length });
    return NextResponse.json({ ok: true, importId: created.id, warnings: result.warnings.length });
  } catch (err) {
    if (err instanceof ImportError) return NextResponse.json({ error: "The package has problems that need fixing before it can be imported.", problems: err.problems }, { status: 422 });
    console.error("[admin/importer] parse failed", err);
    return NextResponse.json({ error: "The package could not be read. Please check the zip and try again." }, { status: 500 });
  }
}
