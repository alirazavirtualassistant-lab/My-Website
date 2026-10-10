import * as React from "react";
import Link from "next/link";
import { FileText, Lock, PlayCircle, Video } from "lucide-react";
import type { CourseTree, Lesson, LessonResource } from "@/lib/types";
import { lessonSlug } from "@/lib/usecases/catalog";
import { cn, formatDuration, pluralize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Illustration, type IllustrationName } from "@/components/shared/illustration";
import { isStageDirection, parseTranscript } from "./transcript";

type TreeLesson = CourseTree["modules"][number]["lessons"][number];

/**
 * Simplified stand-in for the player: a direct https video when one exists,
 * otherwise a calm "coming soon" card that points to the transcript.
 */
function VideoOrComingSoon({ lesson, illustration, className }: { lesson: Pick<Lesson, "title" | "video_provider" | "video_url" | "captions_path" | "duration_sec">; illustration: IllustrationName; className?: string }) {
  const direct = lesson.video_provider === "url" && lesson.video_url && /^https?:\/\//i.test(lesson.video_url) ? lesson.video_url : null;
  if (direct) {
    return (
      <div className={cn("overflow-hidden rounded-lg border border-border bg-ink shadow-card", className)}>
        <video controls preload="metadata" className="aspect-video w-full" src={direct} aria-label={`${lesson.title} video`}>
          {lesson.captions_path && /^https?:\/\//i.test(lesson.captions_path) ? <track kind="captions" src={lesson.captions_path} srcLang="en" label="English" default /> : null}
          Your browser does not support embedded video.
        </video>
      </div>
    );
  }
  return (
    <div
      role="note"
      aria-label="Video coming soon"
      className={cn("flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gold/60 bg-gold-soft/40 p-6 text-center", className)}
    >
      <Illustration name={illustration} size={120} className="text-rose-strong" />
      <p className="inline-flex items-center gap-2 font-serif text-2xl font-medium">
        <Video className="size-5 text-rose-strong" aria-hidden="true" />
        Video coming soon
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Cynthia is recording this {lesson.duration_sec > 0 ? `${formatDuration(lesson.duration_sec)} ` : ""}training. Read the transcript below in the meantime; it is the full script, word for word.
      </p>
      <a href="#transcript" className="text-sm font-semibold text-rose-strong underline underline-offset-4">
        Read the transcript
      </a>
    </div>
  );
}

/** Verbatim transcript with section markers turned into headings. */
function TranscriptView({ transcript, className }: { transcript: string; className?: string }) {
  const parsed = parseTranscript(transcript);
  if (!transcript.trim()) {
    return <p className={cn("text-sm text-muted-foreground", className)}>The transcript for this lesson has not been added yet.</p>;
  }
  return (
    <div id="transcript" className={cn("prose-cyc max-w-none", className)}>
      {parsed.title ? <p className="eyebrow">{parsed.title}</p> : null}
      {parsed.sections.map((s, i) => (
        <section key={i} aria-label={s.heading ?? undefined}>
          {s.heading ? <h3 className="transcript-heading">{s.heading}</h3> : null}
          {s.paragraphs.map((p, j) =>
            isStageDirection(p) ? (
              <p key={j} className="transcript-line text-sm text-muted-foreground italic">
                {p}
              </p>
            ) : (
              <p key={j} className="transcript-line">
                {p}
              </p>
            ),
          )}
        </section>
      ))}
    </div>
  );
}

/** Resources listed without download links; enrolling unlocks them. */
function LockedResources({ resources, courseSlug, className }: { resources: LessonResource[]; courseSlug: string; className?: string }) {
  if (resources.length === 0) return null;
  return (
    <div className={cn("card-soft p-5", className)}>
      <h2 className="font-serif text-xl font-medium">Lesson resources</h2>
      <p className="mt-1 text-sm text-muted-foreground">{pluralize(resources.length, "download")} come with this lesson. Enrol to download them.</p>
      <ul className="mt-3 divide-y divide-border">
        {resources.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-2.5 text-sm">
            <FileText className="size-4 shrink-0 text-rose-strong" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{r.label}</span>
              <span className="block text-xs text-muted-foreground uppercase">{r.type}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" />
              Enrol to download
            </span>
          </li>
        ))}
      </ul>
      <Button asChild size="sm" className="mt-4">
        <Link href={`/courses/${courseSlug}#enrol`}>Enrol to unlock</Link>
      </Button>
    </div>
  );
}

/** Other free previews in the same course. */
function MorePreviews({ tree, current, className }: { tree: CourseTree; current: string; className?: string }) {
  const previews: TreeLesson[] = tree.modules.flatMap((m) => m.lessons.filter((l) => l.is_preview && l.id !== current));
  if (previews.length === 0) return null;
  return (
    <div className={className}>
      <h2 className="font-serif text-xl font-medium">More free previews</h2>
      <ul className="mt-3 space-y-2">
        {previews.map((l) => (
          <li key={l.id}>
            <Link href={`/courses/${tree.course.slug}/preview/${lessonSlug(l)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
              <PlayCircle className="size-4" aria-hidden="true" />
              {l.title}
              {l.duration_sec > 0 ? <span className="font-normal text-muted-foreground">· {formatDuration(l.duration_sec)}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { VideoOrComingSoon, TranscriptView, LockedResources, MorePreviews };
