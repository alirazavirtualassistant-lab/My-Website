import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { requireUser, isAdminRole } from "@/lib/auth/session";
import { getServices } from "@/services";
import { listLearnerCourses } from "@/lib/usecases/access";
import { listPublishedCourses } from "@/lib/usecases/catalog";
import { formatDate, pluralize } from "@/lib/utils";
import type { Course } from "@/lib/types";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration, isIllustrationName } from "@/components/shared/illustration";
import { communityHref } from "@/components/community/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Community", robots: { index: false, follow: false } };

interface CommunityCourseCard {
  course: Course;
  postCount: number;
  lastActivityAt: string | null;
  viaAdmin: boolean;
}

/** /community — one card per course the member belongs to. */
export default async function CommunityIndexPage() {
  const session = await requireUser("/community");
  const enrolled = await listLearnerCourses(session.user_id);
  const enrolledIds = new Set(enrolled.map((e) => e.course.id));
  const courses: CommunityCourseCard[] = enrolled.map(({ course }) => ({ course, postCount: 0, lastActivityAt: null, viaAdmin: false }));

  // Team members can visit every published community for QA, even without an enrolment.
  if (isAdminRole(session.role)) {
    for (const course of await listPublishedCourses()) {
      if (!enrolledIds.has(course.id)) courses.push({ course, postCount: 0, lastActivityAt: null, viaAdmin: true });
    }
  }

  if (courses.length > 0) {
    const { db } = await getServices();
    const posts = await db.from("forum_posts").list({ where: { course_id: courses.map((c) => c.course.id), status: "visible" } });
    for (const card of courses) {
      const mine = posts.filter((p) => p.course_id === card.course.id);
      card.postCount = mine.length;
      card.lastActivityAt = mine.reduce<string | null>((acc, p) => (!acc || p.updated_at > acc ? p.updated_at : acc), null);
    }
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Community"
        title={courses.length === 1 ? "Your community" : "Your communities"}
        description="A warm, simple place to share what is working, ask what is not, and cheer each other on."
      />

      {courses.length === 0 ? (
        <EmptyState
          icon={<Illustration name="family" className="text-rose-strong" />}
          title="Your community opens with your first course"
          description="Every course has its own forum where members share wins, questions and encouragement. Enrol and you are warmly welcome."
          action={
            <Button asChild>
              <Link href="/courses">
                Browse courses
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2" aria-label="Course communities">
          {courses.map(({ course, postCount, lastActivityAt, viaAdmin }) => (
            <li key={course.id}>
              <article aria-labelledby={`community-${course.id}`} className="card-soft group relative flex h-full gap-4 p-5 transition-colors hover:border-rose/50 focus-within:border-rose/60 sm:p-6">
                <div className="hidden size-20 shrink-0 rounded-lg bg-cream-2/70 p-2 text-rose-strong sm:block">
                  <Illustration name={isIllustrationName(course.illustration) ? course.illustration : "family"} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="eyebrow">Course community</p>
                    {viaAdmin ? (
                      <Badge variant="muted">
                        <ShieldCheck aria-hidden="true" />
                        Team access
                      </Badge>
                    ) : null}
                  </div>
                  <h2 id={`community-${course.id}`} className="font-serif text-2xl leading-snug font-medium">
                    <Link href={communityHref(course.slug)} className="after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2">
                      {course.title}
                    </Link>
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{course.subtitle}</p>
                  <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="size-3.5" aria-hidden="true" />
                      {pluralize(postCount, "post")}
                    </span>
                    {lastActivityAt ? <span>Last activity {formatDate(lastActivityAt, { month: "short", day: "numeric" })}</span> : <span>Quiet so far — say hello</span>}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-strong">
                    Open community
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
