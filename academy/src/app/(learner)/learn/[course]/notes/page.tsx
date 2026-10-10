import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, NotebookPen } from "lucide-react";
import { listAllNotes } from "@/lib/usecases/notes";
import { formatDate, pluralize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NotesExportButton } from "@/components/player/notes-export-button";
import { positionLabel } from "@/components/player/transcript-utils";
import { courseHref, lessonHref, loadCourse } from "../_lib/load";

export const dynamic = "force-dynamic";

type Params = Promise<{ course: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { course } = await params;
  return { title: `My notes · ${course}`, robots: { index: false } };
}

export default async function CourseNotesPage({ params }: { params: Params }) {
  const { course: slug } = await params;
  const { session, course, state } = await loadCourse(slug, `/learn/${slug}/notes`);
  const notes = await listAllNotes(session.user_id, course.id);
  const lessonsInOrder = state.tree.modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));
  const groups = lessonsInOrder
    .map(({ module, lesson }) => ({ module, lesson, notes: notes.filter((n) => n.lesson_id === lesson.id) }))
    .filter((g) => g.notes.length > 0);
  const orphaned = notes.filter((n) => !lessonsInOrder.some((x) => x.lesson.id === n.lesson_id));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href={courseHref(course.slug)} className="inline-flex items-center gap-1.5 font-semibold text-rose-strong underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          {course.title}
        </Link>
      </nav>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">My notes</p>
          <h1 className="mt-2">Everything you wrote down</h1>
          <p className="mt-2 text-muted-foreground">
            {pluralize(notes.length, "note")} across {pluralize(groups.length, "lesson")}. Private to you.
          </p>
        </div>
        <NotesExportButton courseSlug={course.slug} disabled={notes.length === 0} />
      </header>

      {notes.length === 0 ? (
        <EmptyState
          icon={<NotebookPen />}
          title="No notes yet"
          description="Open any lesson and use the Notes tab. Notes added while a video plays remember the moment you wrote them."
          action={
            <Button asChild>
              <Link href={state.next ? lessonHref(course.slug, state.next.lesson) : courseHref(course.slug)}>Open a lesson</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map(({ module, lesson, notes: ns }) => (
            <section key={lesson.id} aria-labelledby={`notes-${lesson.id}`} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={`notes-${lesson.id}`} className="font-serif text-2xl">
                  <span className="mr-2 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {module.code} · {lesson.code}
                  </span>
                  {lesson.title}
                </h2>
                <Link href={`${lessonHref(course.slug, lesson)}#notes`} className="text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
                  Open lesson
                </Link>
              </div>
              <ul className="flex flex-col gap-3">
                {ns.map((n) => {
                  const stamp = positionLabel(n.position_sec);
                  return (
                    <li key={n.id} className="card-soft p-4">
                      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(n.created_at, { month: "short", day: "numeric", year: "numeric" })}</span>
                        {stamp ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2 py-0.5 font-semibold">
                            <Clock className="size-3" aria-hidden="true" />
                            {stamp}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{n.body}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {orphaned.length > 0 ? (
            <section aria-labelledby="notes-other" className="flex flex-col gap-3">
              <h2 id="notes-other" className="font-serif text-2xl">
                Other notes
              </h2>
              <ul className="flex flex-col gap-3">
                {orphaned.map((n) => (
                  <li key={n.id} className="card-soft p-4">
                    <p className="text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{n.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
