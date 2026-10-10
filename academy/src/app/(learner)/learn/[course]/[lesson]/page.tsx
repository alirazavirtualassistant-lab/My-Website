import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, Lock } from "lucide-react";
import { getServices } from "@/services";
import { getCurrentUser, isAdminRole } from "@/lib/auth/session";
import { findLessonBySlug, lessonSlug } from "@/lib/usecases/catalog";
import { categoryForLesson, presentAuthor } from "@/lib/usecases/community";
import { listNotes } from "@/lib/usecases/notes";
import { getQuizResponses } from "@/lib/usecases/progress";
import { signedUrlFor } from "@/lib/usecases/uploads";
import { adjacentLessons } from "@/lib/domain/progress";
import { humanizeUnlock } from "@/lib/domain/drip";
import { formatDate, formatDuration, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
import { Illustration } from "@/components/shared/illustration";
import { ActionSteps } from "@/components/player/action-steps";
import { AudioSlots, type AudioSlotView } from "@/components/player/audio-slots";
import { ComingSoonCard } from "@/components/player/coming-soon-card";
import { DisclaimerGate } from "@/components/player/disclaimer-gate";
import { DiscussionPanel } from "@/components/player/discussion-panel";
import { isAbsoluteUrl, moduleArt, moduleDisplayName } from "@/components/player/format";
import { LessonLayout } from "@/components/player/lesson-layout";
import { LessonTabs } from "@/components/player/lesson-tabs";
import { MarkComplete } from "@/components/player/mark-complete";
import { NotesPanel } from "@/components/player/notes-panel";
import { ResourceList } from "@/components/player/resource-list";
import { REFLECTION_PREFIX, SurveyReview } from "@/components/player/survey-review";
import { TranscriptPanel } from "@/components/player/transcript-panel";
import { VideoArea } from "@/components/player/video-area";
import type { ActionStepView, DiscussionPostView, NoteView, ResourceView } from "@/components/player/types";
import { buildCurriculum, completedLessonIds, courseHref, lessonHref, loadCourse } from "../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course, lesson } = await params;
  return { title: `${lesson.toUpperCase()} · ${course}`, robots: { index: false } };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { course: slug, lesson: lessonParam } = await params;
  const path = `/learn/${slug}/${lessonParam}`;
  const { session, course, state } = await loadCourse(slug, path);
  const found = findLessonBySlug(state.tree, lessonParam);
  if (!found) notFound();
  const { module, lesson } = found;
  // Canonical slug (ids and odd casing redirect to the clean URL).
  if (lessonParam !== lessonSlug(lesson)) redirect(lessonHref(course.slug, lesson));
  const ls = state.lessons[lesson.id];
  const hasAccess = state.access.allowed;
  if (!hasAccess && !lesson.is_preview) redirect(`/courses/${course.slug}`);

  const curriculum = buildCurriculum(course, state);
  const completed = completedLessonIds(state);
  const adjacent = adjacentLessons(state.tree, lesson.id);
  const prev = adjacent.prev ? { href: lessonHref(course.slug, adjacent.prev.lesson), title: adjacent.prev.lesson.title, unlocked: state.lessons[adjacent.prev.lesson.id]?.unlocked ?? false } : null;
  const nextState = adjacent.next ? state.lessons[adjacent.next.lesson.id] : null;
  const next = adjacent.next ? { href: lessonHref(course.slug, adjacent.next.lesson), title: adjacent.next.lesson.title, unlocked: nextState?.unlocked ?? false, unlocksAt: nextState?.unlocksAt ?? null } : null;
  const nextHref = next?.unlocked ? next.href : null;

  if (!ls.unlocked) {
    const unlockAt = ls.unlocksAt ? new Date(ls.unlocksAt) : null;
    const resume = state.next ? lessonHref(course.slug, state.next.lesson) : null;
    return (
      <LessonLayout curriculum={curriculum} currentLessonId={lesson.id} initialCompletedIds={completed}>
        <EmptyState
          icon={<Illustration name={moduleArt(module.code, module.illustration)} className="text-rose-strong" />}
          title={unlockAt ? `${moduleDisplayName(module)} opens on ${formatDate(unlockAt.toISOString())}` : hasAccess ? "This lesson isn't open yet" : "Enrol to open this lesson"}
          description={
            unlockAt
              ? `${lesson.title} ${humanizeUnlock(unlockAt, new Date())}. The course is paced on purpose: one module a week gives each baby step time to settle before the next.`
              : hasAccess
                ? "Check back soon, or carry on with what is open now."
                : "Everything in this course opens the moment you enrol."
          }
          action={
            <>
              {resume && resume !== path ? (
                <Button asChild>
                  <Link href={resume}>Continue where you left off</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href={courseHref(course.slug)}>
                  <ArrowLeft aria-hidden="true" />
                  Course overview
                </Link>
              </Button>
              {!hasAccess ? (
                <Button asChild>
                  <Link href={`/courses/${course.slug}`}>See the course and enrol</Link>
                </Button>
              ) : null}
            </>
          }
          className="py-16"
        />
      </LessonLayout>
    );
  }

  const [me, { video, storage, db }] = await Promise.all([getCurrentUser(), getServices()]);
  const isAdmin = isAdminRole(session.role);
  const needsDisclaimer = !!me && !me.profile.disclaimer_accepted_at;
  const defaultName = me?.profile.name ?? "";

  const playback = await video.getPlayback({
    provider: lesson.video_provider,
    playback_id: lesson.video_playback_id,
    video_url: lesson.video_url,
    captions_path: lesson.captions_path,
    thumbnail_path: lesson.thumbnail_path,
    user_id: session.user_id,
  });
  const thumbnailUrl = lesson.thumbnail_path ? (isAbsoluteUrl(lesson.thumbnail_path) ? lesson.thumbnail_path : storage.getPublicUrl({ bucket: "public-assets", path: lesson.thumbnail_path })) : null;

  const audioSlots: AudioSlotView[] = await Promise.all(
    lesson.audio_slots.map(async (s) => ({
      key: s.key,
      label: s.label,
      url: s.file_path ? (isAbsoluteUrl(s.file_path) ? s.file_path : await signedUrlFor("course-resources", s.file_path)) : null,
    })),
  );

  const toResource = async (r: (typeof lesson.resources)[number], scope: "lesson" | "module"): Promise<ResourceView> => ({
    id: r.id,
    label: r.label,
    fileName: r.file_name,
    type: r.type,
    sizeBytes: r.size_bytes,
    url: hasAccess ? await signedUrlFor("course-resources", r.file_path, r.file_name) : "#",
    scope,
  });
  const resources: ResourceView[] = [...(await Promise.all(lesson.resources.map((r) => toResource(r, "lesson")))), ...(await Promise.all(module.resources.map((r) => toResource(r, "module"))))];

  // Action steps + completions + linked quizzes/forum.
  const completionByStep = new Map(state.completions.map((c) => [c.step_id, c]));
  const quizKeys = Array.from(new Set(lesson.action_steps.map((s) => ("quiz_key" in s.link ? s.link.quiz_key : null)).filter((k): k is string => !!k).concat(lesson.quiz_key ? [lesson.quiz_key] : [])));
  const [quizDefs, category] = await Promise.all([
    quizKeys.length ? db.from("quiz_definitions").list({ where: { key: quizKeys } }) : Promise.resolve([]),
    categoryForLesson(course.id, module.id),
  ]);
  const quizTitle = (key: string) => quizDefs.find((q) => q.key === key)?.title ?? null;
  const quizHrefFor = (key: string) => `${lessonHref(course.slug, lesson)}/quiz/${key}`;
  const forumHref = category ? `/community/${course.slug}/new?category=${encodeURIComponent(category.slug)}&lesson=${encodeURIComponent(lesson.code)}` : `/community/${course.slug}/new?lesson=${encodeURIComponent(lesson.code)}`;
  const linkedQuizKeys = new Set(lesson.action_steps.map((s) => ("quiz_key" in s.link ? s.link.quiz_key : null)).filter(Boolean));
  // A lesson-level quiz that no step links to (M7T5 "Review Survey & Adjust Goals") attaches to the first matching step.
  const reviewStep = lesson.quiz_key && !linkedQuizKeys.has(lesson.quiz_key) ? (lesson.action_steps.find((s) => s.link.type === "none" && /survey|quiz/i.test(s.label)) ?? null) : null;
  const reviewStepId: string | null = reviewStep?.id ?? null;
  const steps: ActionStepView[] = await Promise.all(
    lesson.action_steps.map(async (s) => {
      const c = completionByStep.get(s.id) ?? null;
      let quizHref: string | null = null;
      let title: string | null = null;
      if ("quiz_key" in s.link) {
        quizHref = quizHrefFor(s.link.quiz_key);
        title = quizTitle(s.link.quiz_key);
      } else if (s.id === reviewStepId && lesson.quiz_key) {
        quizHref = quizHrefFor(lesson.quiz_key);
        title = quizTitle(lesson.quiz_key);
      }
      const uploadPath = c?.upload_path ?? null;
      return {
        id: s.id,
        label: s.label,
        kind: s.kind,
        xp: s.xp,
        requiresUpload: s.requires_upload,
        uploadType: s.upload_type,
        link: s.link,
        subItems: s.sub_items,
        completed: !!c?.completed_at,
        subItemsDone: c?.sub_items_done ?? [],
        uploadPath,
        uploadFileName: uploadPath ? uploadPath.split("/").pop()?.replace(/^[0-9a-f]{8}-/, "") ?? null : null,
        uploadUrl: uploadPath ? await signedUrlFor("learner-uploads", uploadPath) : null,
        quizHref,
        quizTitle: title,
        forumHref: s.link.type === "forum" ? forumHref : null,
      };
    }),
  );

  // Notes, discussion.
  const [noteRows, postRows] = await Promise.all([
    listNotes(session.user_id, lesson.id),
    db.from("forum_posts").list({ where: { lesson_id: lesson.id, course_id: course.id, status: "visible" }, orderBy: ["created_at", "desc"], limit: 6 }),
  ]);
  const notes: NoteView[] = noteRows.map((n) => ({ id: n.id, body: n.body, positionSec: n.position_sec, createdAt: n.created_at, updatedAt: n.updated_at }));
  const authorIds = Array.from(new Set(postRows.map((p) => p.user_id)));
  const authors = authorIds.length ? await db.from("profiles").list({ where: { id: authorIds } }) : [];
  const posts: DiscussionPostView[] = postRows.map((p) => {
    const author = presentAuthor(
      authors.find((a) => a.id === p.user_id),
      p.anonymous,
      session.user_id,
      isAdmin,
    );
    return { id: p.id, title: p.title, excerpt: truncate(p.body, 160), authorName: author.name, isInstructor: author.is_instructor, replyCount: p.reply_count, likeCount: p.like_count, createdAt: p.created_at, href: `/community/${course.slug}/post/${p.id}` };
  });

  // M7T5: review the pre-course survey.
  let surveyReview: React.ReactNode = null;
  if (reviewStepId && lesson.quiz_key === "pre-course-survey" && lesson.code.toUpperCase() === "M7T5") {
    const def = quizDefs.find((q) => q.key === "pre-course-survey");
    const [latest] = await getQuizResponses(session.user_id, "pre-course-survey");
    const items = def && latest ? def.questions.map((q) => ({ key: q.key, question: q.text, answer: latest.answers[q.key] === null || latest.answers[q.key] === undefined ? "" : String(latest.answers[q.key]) })) : [];
    const existing = noteRows.find((n) => n.body.startsWith(REFLECTION_PREFIX));
    surveyReview = (
      <SurveyReview items={items} submittedAt={latest?.submitted_at ?? null} lessonId={lesson.id} courseId={course.id} existing={existing ? { id: existing.id, body: existing.body } : null} surveyHref={quizHrefFor("pre-course-survey")} />
    );
  }

  const art = moduleArt(module.code, module.illustration);
  const eyebrow = `${module.code} · ${lesson.code}${lesson.series ? ` · ${lesson.series}` : ""}`;

  return (
    <LessonLayout curriculum={curriculum} currentLessonId={lesson.id} initialCompletedIds={completed}>
      {needsDisclaimer ? <DisclaimerGate /> : null}
      <article className="flex flex-col gap-6">
        {playback.kind === "none" ? (
          <ComingSoonCard title={lesson.title} durationSec={lesson.duration_sec} thumbnailUrl={thumbnailUrl} illustration={art} plannedFileName={lesson.planned_video_filename} showPlannedFileName={isAdmin} transcriptHref="#transcript" />
        ) : (
          <VideoArea playback={playback} lessonId={lesson.id} lessonTitle={lesson.title} startSec={ls.lastPositionSec} nextHref={nextHref} userId={session.user_id} />
        )}

        <AudioSlots slots={audioSlots} />

        <header className="flex flex-col gap-3">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="text-balance">{lesson.title}</h1>
          {lesson.description ? <p className="max-w-2xl text-lg text-muted-foreground">{lesson.description}</p> : null}
          <ul className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="Lesson facts">
            {lesson.duration_sec > 0 ? <li>{formatDuration(lesson.duration_sec)}</li> : null}
            {ls.xpTotal > 0 ? (
              <li>
                <Badge variant="gold">
                  {ls.xpEarned} / {ls.xpTotal} XP
                </Badge>
              </li>
            ) : null}
            {lesson.is_preview ? <li><Badge variant="success">Free preview</Badge></li> : null}
            {!hasAccess ? <li><Badge variant="muted">Preview mode</Badge></li> : null}
          </ul>
          {hasAccess ? <MarkComplete lessonId={lesson.id} nextHref={nextHref} courseHref={courseHref(course.slug)} className="mt-1" /> : (
            <Button asChild className="w-fit">
              <Link href={`/courses/${course.slug}`}>Enrol to track progress and earn XP</Link>
            </Button>
          )}
        </header>

        {lesson.doctor_callout ? <Callout /> : null}

        <nav aria-label="Lesson navigation" className="flex flex-wrap items-center justify-between gap-2 text-sm">
          {prev ? (
            <Link href={prev.href} className="inline-flex max-w-full items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
              <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            next.unlocked ? (
              <Link href={next.href} className="inline-flex max-w-full items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
                <span className="truncate">{next.title}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            ) : (
              <span className="inline-flex max-w-full items-center gap-1.5 text-muted-foreground">
                {next.unlocksAt ? <CalendarClock className="size-4 shrink-0" aria-hidden="true" /> : <Lock className="size-4 shrink-0" aria-hidden="true" />}
                <span className="truncate">
                  {next.title} · {next.unlocksAt ? humanizeUnlock(new Date(next.unlocksAt), new Date()) : hasAccess ? "locked" : "enrol to open"}
                </span>
              </span>
            )
          ) : null}
        </nav>

        <LessonTabs
          counts={{ resources: resources.length, steps: steps.length, notes: notes.length, discussion: posts.length }}
          overview={
            <div className="flex flex-col gap-5">
              {lesson.description ? <p className="prose-cyc text-base leading-relaxed">{lesson.description}</p> : null}
              {lesson.notes ? (
                <aside aria-label="Lesson notes" className="rounded-lg border border-border bg-cream-2/60 p-4 text-sm leading-relaxed text-foreground/90">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Notes from Cynthia</p>
                  <p className="mt-1 whitespace-pre-line">{lesson.notes}</p>
                </aside>
              ) : null}
              {lesson.is_intro && module.description ? (
                <section aria-labelledby="module-about" className="card-soft flex gap-4 p-4">
                  <Illustration name={art} size={56} className="hidden shrink-0 text-rose-strong sm:block" />
                  <div>
                    <p className="eyebrow">{moduleDisplayName(module)}</p>
                    <h2 id="module-about" className="mt-1 font-serif text-xl">
                      {module.title}
                    </h2>
                    <p className="mt-1 text-sm text-foreground/90">{module.description}</p>
                    {module.notes ? <p className="mt-2 text-sm text-muted-foreground">{module.notes}</p> : null}
                  </div>
                </section>
              ) : null}
              {!lesson.description && !lesson.notes && !(lesson.is_intro && module.description) ? <p className="text-sm text-muted-foreground">Press play, or read the transcript. Everything you need is in this lesson.</p> : null}
            </div>
          }
          transcript={<TranscriptPanel transcript={lesson.transcript} lessonTitle={lesson.title} lessonCode={lesson.code} />}
          resources={<ResourceList resources={resources} unlocked={hasAccess} lockedNote="Enrol to download" />}
          steps={
            hasAccess ? (
              <ActionSteps steps={steps} courseId={course.id} defaultName={defaultName} xpEarned={ls.xpEarned} xpTotal={ls.xpTotal} extras={reviewStepId && surveyReview ? { [reviewStepId]: surveyReview } : undefined} />
            ) : (
              <EmptyState size="sm" title="Action steps are part of the full course" description="Enrol to tick off steps, upload your work and earn XP." action={<Button asChild size="sm"><Link href={`/courses/${course.slug}`}>See the course</Link></Button>} />
            )
          }
          notes={<NotesPanel lessonId={lesson.id} courseId={course.id} courseSlug={course.slug} initialNotes={notes} />}
          discussion={
            hasAccess ? (
              <DiscussionPanel posts={posts} newPostHref={`/community/${course.slug}/new?lesson=${encodeURIComponent(lesson.code)}${category ? `&category=${encodeURIComponent(category.slug)}` : ""}`} communityHref={`/community/${course.slug}`} />
            ) : (
              <EmptyState size="sm" title="The community opens with enrolment" description="Learners share wins, questions and encouragement on every lesson." />
            )
          }
        />
      </article>
    </LessonLayout>
  );
}
