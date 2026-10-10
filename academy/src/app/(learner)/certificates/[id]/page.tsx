import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getCourseById } from "@/lib/usecases/catalog";
import { formatDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { loadCertificateForViewer, qrDataUrlFor } from "@/components/certificates/certificate-data";
import { certificateLinks } from "@/components/certificates/certificate-links";
import { CertificatePreview } from "@/components/certificates/certificate-preview";
import { CertificateActions } from "@/components/certificates/certificate-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Certificate", robots: { index: false, follow: false } };

/** Large on-screen rendition of one certificate with download / share / verify actions. Not yours → 404. */
export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUser(`/certificates/${id}`);
  const cert = await loadCertificateForViewer(id, session);
  if (!cert) notFound();
  const links = certificateLinks(cert);
  const [qr, course] = await Promise.all([qrDataUrlFor(links.verifyUrl, 240), getCourseById(cert.course_id)]);
  const revoked = !!cert.revoked_at;

  return (
    <div className="grid gap-8">
      <Link href="/certificates" className="inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-rose-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" aria-hidden="true" />
        All certificates
      </Link>

      <PageHeader
        eyebrow="Certificate of Completion"
        title={cert.course_title}
        description={
          <>
            Issued to {cert.learner_name} on <time dateTime={cert.issued_at}>{formatDate(cert.issued_at)}</time>.
          </>
        }
        actions={
          revoked ? (
            <Badge variant="muted">
              <ShieldAlert aria-hidden="true" /> Revoked
            </Badge>
          ) : (
            <Badge variant="success">
              <ShieldCheck aria-hidden="true" /> Verified
            </Badge>
          )
        }
      />

      {revoked ? (
        <Alert variant="warning">
          <ShieldAlert aria-hidden="true" />
          <AlertTitle>This certificate was revoked on {formatDate(cert.revoked_at)}</AlertTitle>
          <AlertDescription>It no longer verifies. If you think this is a mistake, please get in touch and we will look into it.</AlertDescription>
        </Alert>
      ) : null}

      <CertificatePreview
        learnerName={cert.learner_name}
        courseTitle={cert.course_title}
        issuedAt={cert.issued_at}
        certificateId={cert.id}
        verifyCode={cert.verify_code}
        verifyUrl={links.verifyUrl}
        qrDataUrl={qr}
        revoked={revoked}
        className="max-w-4xl"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,22rem)]">
        <section aria-labelledby="share-heading" className="card-soft p-5 sm:p-6">
          <h2 id="share-heading" className="text-xl">
            Download and share
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">The PDF is A4 landscape and prints beautifully. The verify link works for anyone, with no sign-in.</p>
          <CertificateActions className="mt-4" pdfPath={links.pdfPath} linkedInUrl={links.linkedInUrl} verifyUrl={links.verifyUrl} verifyPath={links.verifyPath} revoked={revoked} />
        </section>
        <section aria-labelledby="details-heading" className="card-soft p-5 sm:p-6">
          <h2 id="details-heading" className="text-xl">
            Details
          </h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <div>
              <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Verify code</dt>
              <dd className="mt-0.5 font-mono text-base font-semibold tracking-[0.2em] text-foreground">{cert.verify_code}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Certificate ID</dt>
              <dd className="mt-0.5 font-mono text-xs break-all text-foreground">{cert.id}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Verify link</dt>
              <dd className="mt-0.5 break-all">
                <Link href={links.verifyPath} className="text-rose-strong underline-offset-4 hover:underline">
                  {links.verifyUrl}
                </Link>
              </dd>
            </div>
            {course ? (
              <div>
                <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Course</dt>
                <dd className="mt-0.5">
                  <Link href={`/learn/${course.slug}`} className="text-rose-strong underline-offset-4 hover:underline">
                    Back to {course.title}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      </div>
    </div>
  );
}
