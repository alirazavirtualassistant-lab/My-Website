import * as React from "react";
import Link from "next/link";
import { Award, ShieldAlert } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { certificateLinks } from "./certificate-links";
import { CertificatePreview } from "./certificate-preview";
import { CertificateActions } from "./certificate-actions";

export interface CertificateCardProps extends React.ComponentProps<"article"> {
  certificate: Certificate;
  /** Course slug for the "back to course" link (optional). */
  courseSlug?: string | null;
  /** Hide the thumbnail (dashboard summary rows). */
  compact?: boolean;
}

/** One earned certificate: thumbnail, course, issued date and the three actions. */
function CertificateCard({ certificate, courseSlug, compact = false, className, ...props }: CertificateCardProps) {
  const links = certificateLinks(certificate);
  const revoked = !!certificate.revoked_at;
  return (
    <article className={cn("card-soft flex flex-col gap-4 p-4 sm:p-5", className)} aria-labelledby={`cert-${certificate.id}`} {...props}>
      {!compact ? (
        <Link href={links.detailPath} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Open certificate for ${certificate.course_title}`}>
          <CertificatePreview
            compact
            learnerName={certificate.learner_name}
            courseTitle={certificate.course_title}
            issuedAt={certificate.issued_at}
            certificateId={certificate.id}
            verifyCode={certificate.verify_code}
            verifyUrl={links.verifyUrl}
            revoked={revoked}
          />
        </Link>
      ) : null}
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", revoked ? "bg-warning-soft text-warning" : "bg-gold-soft text-warning")}>
          {revoked ? <ShieldAlert className="size-5" /> : <Award className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`cert-${certificate.id}`} className="text-lg leading-tight">
            <Link href={links.detailPath} className="rounded-sm hover:text-rose-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {certificate.course_title}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Issued <time dateTime={certificate.issued_at}>{formatDate(certificate.issued_at)}</time>
            <span aria-hidden="true"> · </span>
            <span className="font-mono text-xs tracking-wider">{certificate.verify_code}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {revoked ? <Badge variant="muted">Revoked {formatDate(certificate.revoked_at, { month: "short", day: "numeric", year: "numeric" })}</Badge> : <Badge variant="success">Verified</Badge>}
            {courseSlug ? (
              <Link href={`/learn/${courseSlug}`} className="text-xs font-semibold text-rose-strong underline-offset-4 hover:underline">
                Back to course
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <CertificateActions size="sm" pdfPath={links.pdfPath} linkedInUrl={links.linkedInUrl} verifyUrl={links.verifyUrl} verifyPath={links.verifyPath} revoked={revoked} />
    </article>
  );
}

export { CertificateCard };
