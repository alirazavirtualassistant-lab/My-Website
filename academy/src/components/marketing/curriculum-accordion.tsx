import * as React from "react";
import Link from "next/link";
import { FileText, Lock, PlayCircle } from "lucide-react";
import type { CourseTree } from "@/lib/types";
import { lessonSlug } from "@/lib/usecases/catalog";
import { cn, formatDuration, formatHoursMinutes, pluralize } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Illustration } from "@/components/shared/illustration";
import { moduleIllustration } from "./course-illustration";

type TreeModule = CourseTree["modules"][number];
type TreeLesson = TreeModule["lessons"][number];

export interface CurriculumAccordionProps extends Omit<React.ComponentProps<"div">, "children"> {
  tree: CourseTree;
  /** `preview` = the core modules only, with lesson titles (home page). `full` = everything, with durations, locks and resources. */
  variant?: "preview" | "full";
  /** Course slug for preview-lesson links. */
  courseSlug: string;
  /** When the viewer is enrolled, lesson rows link into the player instead of showing locks. */
  enrolled?: boolean;
}

const moduleDuration = (m: TreeModule) => m.lessons.reduce((n, l) => n + l.duration_sec, 0);

function ModuleSummary({ module }: { module: TreeModule }) {
  const secs = moduleDuration(module);
  return (
    <span className="mt-1 block text-xs font-normal text-muted-foreground">
      {pluralize(module.lessons.length, "lesson")}
      {secs > 0 ? ` · ${formatHoursMinutes(secs)}` : ""}
      {module.drip_days > 0 ? ` · opens day ${module.drip_days}` : module.kind === "core" || module.kind === "home" ? " · opens on enrolment" : " · available from day one"}
    </span>
  );
}

function LessonRow({ lesson, courseSlug, enrolled, full }: { lesson: TreeLesson; courseSlug: string; enrolled: boolean; full: boolean }) {
  const previewHref = `/courses/${courseSlug}/preview/${lessonSlug(lesson)}`;
  const learnHref = `/learn/${courseSlug}/${lessonSlug(lesson)}`;
  const linked = enrolled || lesson.is_preview;
  const icon = linked ? <PlayCircle className="size-4 text-rose-strong" aria-hidden="true" /> : <Lock className="size-4 text-muted-foreground" aria-hidden="true" />;
  const title = (
    <span className="min-w-0 flex-1">
      <span className={cn("block", lesson.is_intro && "text-muted-foreground")}>{lesson.title}</span>
      {full && lesson.series ? <span className="mt-0.5 block text-xs text-muted-foreground">{lesson.series}</span> : null}
    </span>
  );
  return (
    <li className="flex items-start gap-3 py-2.5 text-sm">
      <span className="mt-0.5 shrink-0">{icon}</span>
      {linked ? (
        <Link href={enrolled ? learnHref : previewHref} className="min-w-0 flex-1 rounded-sm text-foreground underline-offset-4 hover:text-rose-strong hover:underline">
          {title}
          {!enrolled && lesson.is_preview ? <span className="sr-only"> (free preview)</span> : null}
        </Link>
      ) : (
        <span className="min-w-0 flex-1">
          {title}
          <span className="sr-only"> (locked until you enrol)</span>
        </span>
      )}
      {full ? (
        <span className="flex shrink-0 items-center gap-2">
          {!enrolled && lesson.is_preview ? <Badge variant="success">Preview</Badge> : null}
          {lesson.resources.length > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={pluralize(lesson.resources.length, "resource")}>
              <FileText className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{pluralize(lesson.resources.length, "resource")}</span>
              <span aria-hidden="true">{lesson.resources.length}</span>
            </span>
          ) : null}
          {lesson.duration_sec > 0 ? <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(lesson.duration_sec)}</span> : null}
        </span>
      ) : null}
    </li>
  );
}

function ModuleItem({ module, courseSlug, enrolled, full, label }: { module: TreeModule; courseSlug: string; enrolled: boolean; full: boolean; label?: string }) {
  return (
    <AccordionItem value={module.id}>
      <AccordionTrigger className="items-center gap-4">
        <span className="flex min-w-0 items-center gap-3">
          <Illustration name={moduleIllustration(module.code, module.illustration)} size={40} className="hidden text-rose-strong sm:block" />
          <span className="min-w-0">
            {label ? <span className="eyebrow block text-[0.62rem]">{label}</span> : null}
            <span className="block font-serif text-lg font-medium sm:text-xl">{module.title}</span>
            <ModuleSummary module={module} />
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {module.description ? <p className="mb-3 text-base leading-relaxed text-foreground/85">{module.description}</p> : null}
        <ul className="divide-y divide-border rounded-lg border border-border bg-cream-2/40 px-4">
          {module.lessons.map((l) => (
            <LessonRow key={l.id} lesson={l} courseSlug={courseSlug} enrolled={enrolled} full={full} />
          ))}
        </ul>
        {full && module.resources.length > 0 ? (
          <div className="mt-3 text-sm">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Module resources</p>
            <ul className="mt-1.5 space-y-1">
              {module.resources.map((r) => (
                <li key={r.id} className="inline-flex items-center gap-2">
                  <FileText className="size-3.5 text-rose-strong" aria-hidden="true" />
                  <span>{r.label}</span>
                  <span className="text-xs text-muted-foreground uppercase">{r.type}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}

/** Modules → lessons, as a multi-open accordion. Content is rendered verbatim. */
function CurriculumAccordion({ tree, variant = "full", courseSlug, enrolled = false, className, ...props }: CurriculumAccordionProps) {
  const full = variant === "full";
  const core = tree.modules.filter((m) => m.kind === "core").slice(0, full ? undefined : 7);
  const home = tree.modules.filter((m) => m.kind === "home");
  const bonus = tree.modules.filter((m) => m.kind === "bonus");
  const replay = tree.modules.filter((m) => m.kind === "replay");
  const first = (full ? home[0] ?? core[0] : core[0])?.id;
  const coreLabel = (i: number) => `Module ${i + 1}`;

  return (
    <div data-slot="curriculum" className={cn("rounded-lg border border-border bg-card px-5 shadow-soft sm:px-6", className)} {...props}>
      <Accordion type="multiple" defaultValue={first ? [first] : []}>
        {full ? home.map((m) => <ModuleItem key={m.id} module={m} courseSlug={courseSlug} enrolled={enrolled} full label="Start here" />) : null}
        {core.map((m, i) => (
          <ModuleItem key={m.id} module={m} courseSlug={courseSlug} enrolled={enrolled} full={full} label={coreLabel(i)} />
        ))}
        {full ? bonus.map((m) => <ModuleItem key={m.id} module={m} courseSlug={courseSlug} enrolled={enrolled} full label="Bonus trainings" />) : null}
        {full ? replay.map((m) => <ModuleItem key={m.id} module={m} courseSlug={courseSlug} enrolled={enrolled} full label="Group coaching replays" />) : null}
      </Accordion>
    </div>
  );
}

export { CurriculumAccordion };
