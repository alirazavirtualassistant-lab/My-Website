import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getServices } from "@/services";
import { findLessonBySlug } from "@/lib/usecases/catalog";
import { getQuizResponses } from "@/lib/usecases/progress";
import { listNotes } from "@/lib/usecases/notes";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Button } from "@/components/ui/button";
import { QuizForm } from "@/components/player/quiz-form";
import { REFLECTION_PREFIX, SurveyReview } from "@/components/player/survey-review";
import { latestQuizResultAction } from "../../actions";
import { courseHref, lessonHref, loadCourse } from "../../../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string; lesson: string; quizKey: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { quizKey } = await params;
  return { title: quizKey.replace(/-/g, " "), robots: { index: false } };
}

export default async function LessonQuizPage({ params }: { params: Params }) {
  const { course: slug, lesson: lessonParam, quizKey } = await params;
  const path = `/learn/${slug}/${lessonParam}/quiz/${quizKey}`;
  const { session, course, state } = await loadCourse(slug, path);
  const found = findLessonBySlug(state.tree, lessonParam);
  if (!found) notFound();
  const { lesson } = found;
  const ls = state.lessons[lesson.id];
  const back = lessonHref(course.slug, lesson);
  if (!state.access.allowed && !lesson.is_preview) redirect(`/courses/${course.slug}`);
  if (!ls.unlocked) redirect(back);

  const { db } = await getServices();
  const def = await db.from("quiz_definitions").findOne({ key: quizKey });
  if (!def || (def.course_id && def.course_id !== course.id)) notFound();

  // Which action step does this quiz complete?
  const completionByStep = new Map(state.completions.map((c) => [c.step_id, c]));
  const linked = lesson.action_steps.find((s) => "quiz_key" in s.link && s.link.quiz_key === def.key);
  const fallback = !linked && lesson.quiz_key === def.key ? lesson.action_steps.find((s) => s.link.type === "none" && /survey|quiz/i.test(s.label)) : undefined;
  const stepRow = linked ?? fallback ?? null;
  let step: { id: string; label: string; subItemKey: string | null; completed: boolean } | null = null;
  if (stepRow) {
    const c = completionByStep.get(stepRow.id);
    const subItem = stepRow.sub_items?.find((s) => s.key === "survey" || /survey|quiz/i.test(s.label)) ?? null;
    const subKey = linked && subItem ? subItem.key : null;
    step = {
      id: stepRow.id,
      label: stepRow.label,
      subItemKey: subKey,
      completed: !!c?.completed_at || (!!subKey && (c?.sub_items_done ?? []).includes(subKey)),
    };
  }

  const isReview = lesson.code.toUpperCase() === "M7T5" && def.key === "pre-course-survey";
  const previous = state.access.allowed ? await latestQuizResultAction({ quizKey: def.key }) : null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href={courseHref(course.slug)} className="hover:text-rose-strong hover:underline underline-offset-4">
              {course.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={back} className="hover:text-rose-strong hover:underline underline-offset-4">
              {lesson.title}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground/80">
            {def.title}
          </li>
        </ol>
      </nav>

      <header>
        <p className="eyebrow">
          {lesson.code} · {def.scoring.kind === "sum" ? "Quiz" : "Survey"}
        </p>
        <h1 className="mt-2 text-balance">{def.title}</h1>
        {def.intro ? <p className="mt-3 max-w-2xl text-base leading-relaxed whitespace-pre-line text-muted-foreground">{def.intro}</p> : null}
        {step ? <p className="mt-3 text-sm text-muted-foreground">Linked step: <span className="font-semibold text-foreground">{step.label}</span></p> : null}
      </header>

      {isReview ? (
        <ReviewMode userId={session.user_id} lessonId={lesson.id} courseId={course.id} questions={def.questions} back={back} />
      ) : state.access.allowed ? (
        <QuizForm quiz={{ key: def.key, title: def.title, intro: def.intro, questions: def.questions, scoring: def.scoring, confirmation: def.confirmation }} lessonId={lesson.id} lessonHref={back} step={step} previous={previous} />
      ) : (
        <div className="card-soft p-6">
          <p className="font-serif text-xl">This {def.scoring.kind === "sum" ? "quiz" : "survey"} is part of the full course.</p>
          <p className="mt-1 text-sm text-muted-foreground">Enrol to take it, see your result and earn the step XP.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/courses/${course.slug}`}>See the course and enrol</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={back}>
                <ArrowLeft aria-hidden="true" />
                Back to the lesson
              </Link>
            </Button>
          </div>
        </div>
      )}

      <MedicalDisclaimer variant="inline" />
    </div>
  );
}

async function ReviewMode({ userId, lessonId, courseId, questions, back }: { userId: string; lessonId: string; courseId: string; questions: Array<{ key: string; text: string }>; back: string }) {
  const [[latest], notes] = await Promise.all([getQuizResponses(userId, "pre-course-survey"), listNotes(userId, lessonId)]);
  const items = latest ? questions.map((q) => ({ key: q.key, question: q.text, answer: latest.answers[q.key] === null || latest.answers[q.key] === undefined ? "" : String(latest.answers[q.key]) })) : [];
  const existing = notes.find((n) => n.body.startsWith(REFLECTION_PREFIX));
  return (
    <div className="flex flex-col gap-6">
      <SurveyReview items={items} submittedAt={latest?.submitted_at ?? null} lessonId={lessonId} courseId={courseId} existing={existing ? { id: existing.id, body: existing.body } : null} surveyHref={null} />
      {!latest ? (
        <p className="text-sm text-muted-foreground">
          The survey itself lives on the Course Home lesson:{" "}
          <Link href={back.replace(/\/[^/]+$/, "/m0") + "/quiz/pre-course-survey"} className="font-semibold text-rose-strong underline underline-offset-4">
            answer it there
          </Link>
          , then come back to reflect.
        </p>
      ) : null}
      <Button asChild variant="outline" className="w-fit">
        <Link href={back}>
          <ArrowLeft aria-hidden="true" />
          Back to the lesson
        </Link>
      </Button>
    </div>
  );
}
