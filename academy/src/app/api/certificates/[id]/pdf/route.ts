/**
 * GET /api/certificates/[id]/pdf — the certificate as an A4 landscape PDF.
 * The signed-in owner (or an admin/assistant) may download it; anyone else
 * gets a 404 so certificate ids do not leak. Revoked certificates are 410.
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/usecases/catalog";
import { loadCertificateForViewer, qrDataUrlFor } from "@/components/certificates/certificate-data";
import { verifyUrlFor } from "@/components/certificates/certificate-links";
import { attachmentDisposition, certificateFilename } from "@/components/certificates/certificate-filename";
import { renderCertificatePdf } from "@/components/certificates/certificate-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser(`/certificates/${id}`);
  const cert = await loadCertificateForViewer(id, session, { allowAdmin: true });
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  if (cert.revoked_at) return NextResponse.json({ error: "This certificate has been revoked" }, { status: 410 });

  const course = await getCourseById(cert.course_id);
  const verifyUrl = verifyUrlFor(cert.verify_code);
  const qrDataUrl = await qrDataUrlFor(verifyUrl, 512);
  const pdf = await renderCertificatePdf({
    certificateId: cert.id,
    verifyCode: cert.verify_code,
    verifyUrl,
    learnerName: cert.learner_name,
    courseTitle: cert.course_title,
    issuedAt: cert.issued_at,
    qrDataUrl,
  });
  const filename = certificateFilename(course?.slug ?? cert.course_title);
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      "Content-Disposition": attachmentDisposition(filename),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
