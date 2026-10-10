import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { getCurrentUser, requireUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/ui/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";
import { loadDashboard } from "@/components/dashboard/dashboard-data";
import {
  BadgeGrid,
  ContinueHero,
  CourseProgressCard,
  DashboardEmpty,
  DashboardStats,
  RecommendedCourse,
  SectionHeading,
  UnlockTimeline,
} from "@/components/dashboard";
import { CertificateCard } from "@/components/certificates/certificate-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My Learning", robots: { index: false, follow: false } };

function firstNameOf(name: string | null | undefined, fallback = "there"): string {
  const first = (name ?? "").trim().split(/\s+/)[0];
  return first || fallback;
}

/** The learner's home: continue, progress, XP/level/streak, unlocks, badges, certificates. */
export default async function LearnPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const session = await requireUser("/learn");
  const [{ denied }, me] = await Promise.all([searchParams, getCurrentUser()]);
  const firstName = firstNameOf(me?.profile.name, firstNameOf(session.email.split("@")[0]));
  const timeZone = me?.profile.timezone ?? null;
  const data = await loadDashboard(session.user_id, session.role, timeZone);
  const { overview, courses, continuePick, unlocks, certificates, recommended, previews } = data;
  const now = new Date();
  const slugByCourseId = new Map(courses.map((c) => [c.course.id, c.course.slug]));

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="My learning"
        title={courses.length ? `Welcome back, ${firstName}` : `Hello, ${firstName}`}
        description={courses.length ? "One small step today is plenty. Here is where you are." : "Your progress, XP and next steps will gather here."}
        actions={
          courses.length ? (
            <Button asChild variant="outline">
              <Link href="/courses">Browse courses</Link>
            </Button>
          ) : null
        }
      />

      {denied === "1" ? (
        <Alert variant="info">
          <Info aria-hidden="true" />
          <AlertTitle>That page is for the Academy team</AlertTitle>
          <AlertDescription>No harm done — you are back on your learning home.</AlertDescription>
        </Alert>
      ) : null}

      {courses.length === 0 ? (
        <DashboardEmpty firstName={firstName} previews={previews} />
      ) : (
        <>
          {continuePick ? <ContinueHero pick={continuePick} now={now} timeZone={timeZone} /> : null}

          <DashboardStats level={overview.level} streak={overview.streak} certificateCount={certificates.length} badgeCount={overview.earnedBadgeCount} />

          <section aria-labelledby="courses-heading" className="grid gap-5">
            <SectionHeading id="courses-heading" eyebrow="Your courses" title={courses.length === 1 ? "Your course" : "Your courses"} />
            <div className="grid gap-5 md:grid-cols-2">
              {courses.map(({ course, state, courseXpEarned, nextUnlock, certificate }) => (
                <CourseProgressCard
                  key={course.id}
                  course={course}
                  percent={state.summary.percent}
                  completedLessons={state.summary.completedLessons}
                  totalLessons={state.summary.totalLessons}
                  xpEarned={courseXpEarned}
                  xpTotal={state.courseXp.total}
                  nextUnlock={nextUnlock}
                  hasCertificate={!!certificate}
                  viaAdmin={state.access.via === "admin"}
                />
              ))}
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <UnlockTimeline items={unlocks} showCourse={courses.length > 1} />
            <section aria-labelledby="certificates-heading" className="card-soft flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 id="certificates-heading" className="text-lg">
                  Certificates
                </h3>
                {certificates.length ? (
                  <Link href="/certificates" className="text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
                    See all
                  </Link>
                ) : null}
              </div>
              {certificates.length ? (
                <div className="grid gap-3">
                  {certificates.slice(0, 2).map((cert) => (
                    <CertificateCard key={cert.id} certificate={cert} compact courseSlug={slugByCourseId.get(cert.course_id) ?? null} className="p-4 shadow-none" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  size="sm"
                  icon={<Illustration name="harvest" className="text-rose-strong" />}
                  title="Your certificate is on its way"
                  description="Finish Course Home and Modules 1–7 and your Certificate of Completion will appear here, ready to download and share."
                  action={
                    <Button asChild variant="outline" size="sm">
                      <Link href="/certificates">
                        See what counts
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  }
                />
              )}
            </section>
          </div>

          <section aria-labelledby="badges-heading" className="grid gap-5">
            <SectionHeading
              id="badges-heading"
              eyebrow="Badges"
              title="Milestones"
              description={`${overview.earnedBadgeCount} of ${overview.badges.length} earned — they mark the path, not the pace.`}
            />
            <BadgeGrid items={overview.badges} />
          </section>

          <section aria-labelledby="recommended-heading" className="grid gap-5">
            <SectionHeading id="recommended-heading" eyebrow="What's next" title="Recommended next course" />
            <RecommendedCourse course={recommended[0] ?? null} />
          </section>
        </>
      )}
    </div>
  );
}
