import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, FileDown, Lock, MessageSquare, PlayCircle, Sparkles, Users } from "lucide-react";
import { getServices } from "@/services";
import { signedUrlFor } from "@/lib/usecases/uploads";
import { lessonSlug } from "@/lib/usecases/catalog";
import { formatHoursMinutes, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Illustration } from "@/components/shared/illustration";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { CourseModules, type OverviewModule } from "@/components/player/course-modules";
import { moduleArt } from "@/components/player/format";
import type { ResourceView } from "@/components/player/types";
import { buildCurriculum, courseHref, lessonHref, loadCourse, moduleUnlock, previewHref } from "./_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course } = await params;
  return { title: `Course · ${course}`, robots: { index: false } };
}

export default async function CourseOverviewPage({ params }: { params: Params }) {
  const { course: slug } = await params;
  const { course, state, courseXpEarned } = await loadCourse(slug, courseHref(slug));
  const hasAccess = state.access.allowed;
  const curriculum = buildCurriculum(course, state);
  const { storage } = await getServices();
  const currentModuleId = state.next?.moduleId ?? null;
  const completedIds = new Set(state.progress.filter((p) => p.completed_at).map((p) => p.lesson_id));

  const modules: OverviewModule[] = await Promise.all(
    state.tree.modules
      .filter((m) => m.lessons.length > 0)
      .map(async (m) => {
        const unlock = moduleUnlock(state, m);
        const canDownload = hasAccess && unlock.unlocked;
        const resources: ResourceView[] = await Promise.all(
          m.resources.map(async (r) => ({
            id: r.id,
            label: r.label,
            fileName: r.file_name,
            type: r.type,
            sizeBytes: r.size_bytes,
            url: canDownload ? await signedUrlFor("course-resources", r.file_path, r.file_name) : "#",
            scope: "module" as const,
          })),
        );
        const progress = state.summary.byModule[m.id] ?? { completed: 0, total: m.lessons.length, percent: 0 };
        return {
          id: m.id,
          code: m.code,
          kind: m.kind,
          title: m.title,
          description: m.description,
          illustration: m.illustration,
          unlocked: hasAccess ? unlock.unlocked : m.lessons.some((l) => l.is_preview),
          unlocksAt: unlock.unlocksAt,
          completed: progress.completed,
          total: progress.total,
          xpTotal: state.courseXp.byModule[m.id] ?? 0,
          defaultOpen: m.id === currentModuleId || (!currentModuleId && m.kind === "home"),
          resources,
          lessons: m.lessons.map((l) => {
            const ls = state.lessons[l.id];
            const unlocked = ls?.unlocked ?? false;
            const href = hasAccess ? lessonHref(course.slug, l) : l.is_preview ? previewHref(course.slug, l) : null;
            return {
              id: l.id,
              code: l.code,
              title: l.title,
              href: unlocked || (hasAccess && !unlocked) ? href : l.is_preview ? href : null,
              durationSec: l.duration_sec,
              completed: completedIds.has(l.id),
              unlocked,
              unlocksAt: ls?.unlocksAt ?? null,
              isPreview: l.is_preview,
              xpTotal: ls?.xpTotal ?? 0,
            };
          }),
        };
      }),
  );

  const next = state.next ? { href: lessonHref(course.slug, state.next.lesson), title: state.next.lesson.title, unlocked: state.lessons[state.next.lesson.id]?.unlocked ?? false } : null;
  const started = state.summary.completedLessons > 0 || state.progress.length > 0;
  const previews = state.tree.modules.flatMap((m) => m.lessons.filter((l) => l.is_preview));
  const totalSec = state.tree.modules.reduce((n, m) => n + m.lessons.reduce((s, l) => s + l.duration_sec, 0), 0);
  const thumbnailUrl = course.thumbnail_path ? (/^https?:\/\//i.test(course.thumbnail_path) ? course.thumbnail_path : storage.getPublicUrl({ bucket: "public-assets", path: course.thumbnail_path })) : null;
  void thumbnailUrl;

  return (
    <div className="flex flex-col gap-10">
      <header className="card-soft overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="eyebrow">My learning</p>
            <h1 className="mt-2 text-balance">{course.title}</h1>
            {course.subtitle ? <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{course.subtitle}</p> : null}
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground" aria-label="Course facts">
              <li>{pluralize(state.summary.totalLessons, "lesson")}</li>
              {totalSec > 0 ? <li>{formatHoursMinutes(totalSec)} of video</li> : null}
              <li>{state.courseXp.total} XP available</li>
            </ul>

            {hasAccess ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {state.summary.completedLessons} of {state.summary.totalLessons} lessons complete
                    </span>
                    <span className="font-semibold text-sage-strong">{state.summary.percent}%</span>
                  </div>
                  <Progress value={state.summary.percent} tone="sage" className="mt-2" aria-label={`Course progress ${state.summary.percent}%`} />
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="gold">
                      <Sparkles aria-hidden="true" />
                      {courseXpEarned} / {state.courseXp.total} XP
                    </Badge>
                    <Badge variant="rose">
                      <Award aria-hidden="true" />
                      {state.level.level.label}
                      {state.level.next ? ` · ${state.level.xpToNext} XP to ${state.level.next.label}` : " · top level"}
                    </Badge>
                    {state.streak && state.streak.current > 1 ? <Badge variant="success">{state.streak.current}-day streak</Badge> : null}
                  </div>
                </div>
                {next ? (
                  <Button asChild size="lg">
                    <Link href={next.href}>
                      {next.unlocked ? <PlayCircle aria-hidden="true" /> : <Lock aria-hidden="true" />}
                      {started ? "Continue" : "Start"}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-gold/50 bg-gold-soft/40 p-4">
                <p className="font-serif text-xl">You are not enrolled in this course yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">Enrol to open every module, download the guides, join the community and earn your certificate. The free previews below are open to you right now.</p>
                <Button asChild className="mt-3">
                  <Link href={`/courses/${course.slug}`}>
                    See the course and enrol
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}
            {next && hasAccess ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Up next: <span className="font-semibold text-foreground">{next.title}</span>
              </p>
            ) : null}
          </div>
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3">
            {hasAccess ? (
              <ProgressRing value={state.summary.percent} size="lg" tone="sage" label="Course progress" />
            ) : (
              <Illustration name={moduleArt("M0", course.illustration)} size={140} className="text-rose-strong" />
            )}
          </div>
        </div>
        {hasAccess ? (
          <nav aria-label="Course tools" className="flex flex-wrap gap-2 border-t border-border bg-cream-2/40 px-5 py-3 text-sm sm:px-8">
            <Link href={`/community/${course.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
              <MessageSquare className="size-4" aria-hidden="true" />
              Community
            </Link>
            <Link href={`/learn/${course.slug}/notes`} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
              <FileDown className="size-4" aria-hidden="true" />
              My notes
            </Link>
            {course.partner_seat_enabled ? (
              <Link href={`/learn/${course.slug}/couple`} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
                <Users className="size-4" aria-hidden="true" />
                Partner seat
              </Link>
            ) : null}
            {course.certificate_enabled ? (
              <Link href="/certificates" className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
                <Award className="size-4" aria-hidden="true" />
                Certificates
              </Link>
            ) : null}
          </nav>
        ) : null}
      </header>

      {!hasAccess && previews.length > 0 ? (
        <section aria-labelledby="previews-heading" className="card-soft p-5">
          <h2 id="previews-heading" className="font-serif text-2xl">
            Free previews
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {previews.map((l) => (
              <li key={l.id}>
                <Link href={previewHref(course.slug, l)} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
                  <PlayCircle className="size-4" aria-hidden="true" />
                  {l.title}
                  <span className="font-mono text-xs font-normal text-muted-foreground uppercase">{lessonSlug(l)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CourseModules modules={modules} hasAccess={hasAccess} />

      <MedicalDisclaimer />
      <span className="sr-only">{curriculum.totalLessons} lessons in this course</span>
    </div>
  );
}
