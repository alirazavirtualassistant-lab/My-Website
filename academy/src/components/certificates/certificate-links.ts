/**
 * URLs around a certificate: the public verify page, the PDF download and the
 * LinkedIn "Add to profile" deep link. Pure; safe for client components.
 */
import type { Certificate } from "@/lib/types";
import { site } from "@/lib/config/site";
import { linkedInAddToProfileUrl } from "@/lib/domain/certificates";

/** The issuing organisation as it should appear on LinkedIn. */
export const CERTIFICATE_ORGANIZATION = "Cradle Your Cravings Academy";

export function verifyPathFor(code: string): string {
  return `/verify/${encodeURIComponent(code)}`;
}

export function verifyUrlFor(code: string, baseUrl: string = site.url): string {
  return `${baseUrl.replace(/\/+$/, "")}${verifyPathFor(code)}`;
}

export function certificatePathFor(id: string): string {
  return `/certificates/${encodeURIComponent(id)}`;
}

export function certificatePdfPathFor(id: string): string {
  return `/api/certificates/${encodeURIComponent(id)}/pdf`;
}

/**
 * LinkedIn "Add to profile" link. The credential id shown on LinkedIn is the
 * public verify code (it is what the verify URL is keyed by), and the
 * certificate URL is the public verify page so recruiters land on a page that
 * works without signing in.
 */
export function linkedInUrlFor(cert: Pick<Certificate, "course_title" | "issued_at" | "verify_code">, baseUrl: string = site.url): string {
  const issued = new Date(cert.issued_at);
  const valid = Number.isFinite(issued.getTime());
  return linkedInAddToProfileUrl({
    name: cert.course_title,
    organizationName: CERTIFICATE_ORGANIZATION,
    issueYear: valid ? issued.getUTCFullYear() : new Date().getUTCFullYear(),
    issueMonth: valid ? issued.getUTCMonth() + 1 : new Date().getUTCMonth() + 1,
    certUrl: verifyUrlFor(cert.verify_code, baseUrl),
    certId: cert.verify_code,
  });
}

export interface CertificateLinks {
  verifyPath: string;
  verifyUrl: string;
  pdfPath: string;
  detailPath: string;
  linkedInUrl: string;
}

export function certificateLinks(cert: Pick<Certificate, "id" | "course_title" | "issued_at" | "verify_code">, baseUrl: string = site.url): CertificateLinks {
  return {
    verifyPath: verifyPathFor(cert.verify_code),
    verifyUrl: verifyUrlFor(cert.verify_code, baseUrl),
    pdfPath: certificatePdfPathFor(cert.id),
    detailPath: certificatePathFor(cert.id),
    linkedInUrl: linkedInUrlFor(cert, baseUrl),
  };
}
