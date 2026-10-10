import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { getCertificateByVerifyCode } from "@/lib/usecases/certificates";
import { isValidVerifyCode, normalizeVerifyCode } from "@/lib/domain/certificates";
import { site } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { certificateLinks } from "@/components/certificates/certificate-links";
import { CertificatePreview } from "@/components/certificates/certificate-preview";

export const dynamic = "force-dynamic";

function codeFromParam(raw: string): string {
  try {
    return normalizeVerifyCode(decodeURIComponent(raw));
  } catch {
    return normalizeVerifyCode(raw);
  }
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Verify certificate ${codeFromParam(code)}`,
    description: `Check whether a Cradle Your Cravings Academy certificate is genuine.`,
    robots: { index: false, follow: false },
  };
}

/** Public, no sign-in: valid / revoked / not-found states for a certificate verify code. */
export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = codeFromParam(raw);
  const cert = isValidVerifyCode(code) ? await getCertificateByVerifyCode(code) : null;
  const revoked = !!cert?.revoked_at;
  const status: "valid" | "revoked" | "missing" = cert ? (revoked ? "revoked" : "valid") : "missing";

  return (
    <Section spacing="md">
      <Container size="md">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Certificate verification</p>
          <h1 className="mt-2 text-balance">
            {status === "valid" ? "This certificate is genuine" : status === "revoked" ? "This certificate was revoked" : "We couldn't find that certificate"}
          </h1>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Code <span className="font-mono font-semibold tracking-[0.2em] text-foreground">{code || "—"}</span>
          </p>

          <div className="card-soft mt-8 p-5 sm:p-7">
            {cert ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  {revoked ? (
                    <Badge variant="muted" className="text-sm">
                      <ShieldAlert aria-hidden="true" /> Revoked
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-sm">
                      <ShieldCheck aria-hidden="true" /> Verified
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">Issued by {site.name}</span>
                </div>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Learner</dt>
                    <dd className="mt-0.5 font-serif text-2xl text-foreground">{cert.learner_name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Completed on</dt>
                    <dd className="mt-0.5 text-lg text-foreground">
                      <time dateTime={cert.issued_at}>{formatDate(cert.issued_at)}</time>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Course</dt>
                    <dd className="mt-0.5 text-lg text-foreground">{cert.course_title}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Certificate ID</dt>
                    <dd className="mt-0.5 font-mono text-xs break-all text-foreground">{cert.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Instructor</dt>
                    <dd className="mt-0.5 text-foreground">{site.instructor.name}</dd>
                  </div>
                </dl>
                {revoked ? (
                  <p className="mt-5 rounded-lg border border-warning/30 bg-warning-soft p-4 text-sm text-foreground">
                    This certificate was withdrawn on {formatDate(cert.revoked_at)} and should not be relied upon. If you are the holder and believe this is a mistake, please{" "}
                    <Link href="/contact" className="font-semibold text-rose-strong underline-offset-4 hover:underline">
                      contact us
                    </Link>
                    .
                  </p>
                ) : null}
                <CertificatePreview
                  className="mt-6"
                  learnerName={cert.learner_name}
                  courseTitle={cert.course_title}
                  issuedAt={cert.issued_at}
                  certificateId={cert.id}
                  verifyCode={cert.verify_code}
                  verifyUrl={certificateLinks(cert).verifyUrl}
                  revoked={revoked}
                />
              </>
            ) : (
              <div className="flex flex-col items-start gap-4 sm:flex-row">
                <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-soft/70 text-rose-strong">
                  <ShieldQuestion className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">No certificate matches this code.</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Codes are 10 characters: letters and numbers, never 0, O, 1 or I.</li>
                    <li>Check for a typo, or ask the certificate holder to copy the link from their certificate page.</li>
                    <li>Certificates that were withdrawn show as revoked rather than missing.</li>
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/contact">Contact support</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/courses">
                        Explore the courses
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Certificates are issued automatically when a learner completes every required lesson of a course. Verification pages are public and not indexed by search engines.
          </p>
        </div>
      </Container>
    </Section>
  );
}
