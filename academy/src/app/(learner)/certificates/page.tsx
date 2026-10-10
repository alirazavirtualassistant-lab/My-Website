import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { listCertificatesForUser } from "@/lib/usecases/certificates";
import { listLearnerCourses } from "@/lib/usecases/access";
import { getCourseById } from "@/lib/usecases/catalog";
import { getLearnerCourseState } from "@/lib/usecases/progress";
import { certificateRequirements } from "@/lib/domain/certificates";
import { pluralize } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Progress } from "@/components/ui/progress";
import { Illustration } from "@/components/shared/illustration";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { CertificateCard } from "@/components/certificates/certificate-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Certificates", robots: { index: false, follow: false } };

/** Earned certificates plus progress towards the ones still in reach. */
export default async function CertificatesPage() {
  const session = await requireUser("/certificates");
  const [certificates, enrolled] = await Promise.all([listCertificatesForUser(session.user_id), listLearnerCourses(session.user_id)]);
  const certifiedCourseIds = new Set(certificates.map((c) => c.course_id));

  // Courses that can still earn a certificate, with how far along they are.
  const pending = enrolled.filter(({ course }) => course.certificate_enabled && !certifiedCourseIds.has(course.id));
  const pendingStates = await Promise.all(pending.map(({ course }) => getLearnerCourseState(session.user_id, course.id, session.role)));
  const inProgress = pending.flatMap(({ course }, i) => {
    const state = pendingStates[i];
    if (!state) return [];
    const req = certificateRequirements(state.tree, state.progress);
    return [{ course, req }];
  });

  // Slugs for "back to course" links (enrolled first, then a lookup for older certificates).
  const slugByCourseId = new Map(enrolled.map(({ course }) => [course.id, course.slug]));
  await Promise.all(
    certificates
      .filter((c) => !slugByCourseId.has(c.course_id))
      .map(async (c) => {
        const course = await getCourseById(c.course_id);
        if (course) slugByCourseId.set(course.id, course.slug);
      }),
  );

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Certificates"
        title="Your certificates"
        description="Each one is issued when you complete Course Home and Modules 1–7. Download the PDF, add it to LinkedIn, or share a verify link anyone can check."
      />

      {certificates.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} courseSlug={slugByCourseId.get(cert.course_id) ?? null} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Illustration name="harvest" className="text-rose-strong" />}
          title="No certificates yet"
          description={
            inProgress.length
              ? "You are on your way. Finish the required modules below and your Certificate of Completion will be issued automatically."
              : "Join a course and complete its required modules to earn a Certificate of Completion."
          }
          action={
            <Button asChild>
              <Link href={inProgress.length ? "/learn" : "/courses"}>
                {inProgress.length ? "Back to learning" : "Browse courses"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      )}

      {inProgress.length ? (
        <section aria-labelledby="in-progress-heading" className="grid gap-5">
          <SectionHeading id="in-progress-heading" eyebrow="In progress" title="What counts towards a certificate" description="Bonus and replay lessons are optional — only Course Home and Modules 1–7 are required." />
          <ul className="grid gap-4">
            {inProgress.map(({ course, req }) => {
              const pct = req.requiredTotal > 0 ? Math.round((100 * req.requiredCompleted) / req.requiredTotal) : 0;
              const left = Math.max(0, req.requiredTotal - req.requiredCompleted);
              return (
                <li key={course.id} className="card-soft p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg">{course.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                        {req.requiredCompleted} of {req.requiredTotal} required lessons complete
                        {left > 0 ? ` · ${pluralize(left, "lesson")} to go` : ""}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link href={`/learn/${course.slug}`}>
                        Continue
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                  <Progress value={pct} tone="sage" className="mt-4" aria-label={`${course.title}: ${pct}% of required lessons complete`} />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
