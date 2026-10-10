import "server-only";
/**
 * Loads a certificate for the signed-in viewer. Learners only ever see their
 * own; admins and assistants may fetch any certificate (support + QA), which
 * only the PDF route makes use of.
 */
import QRCode from "qrcode";
import type { Certificate } from "@/lib/types";
import { getServices } from "@/services";
import { isAdminRole, type Session } from "@/lib/auth/session";
import { getCertificateForUser } from "@/lib/usecases/certificates";

export async function loadCertificateForViewer(id: string, session: Session, opts: { allowAdmin?: boolean } = {}): Promise<Certificate | null> {
  const own = await getCertificateForUser(id, session.user_id);
  if (own) return own;
  if (opts.allowAdmin && isAdminRole(session.role)) {
    const { db } = await getServices();
    return db.from("certificates").get(id);
  }
  return null;
}

/** PNG data URL of a QR code pointing at `url`, in the brand ink on cream. */
export async function qrDataUrlFor(url: string, width = 256): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "M",
    margin: 1,
    width,
    color: { dark: "#2e2a27", light: "#fbf6ef" },
  });
}
