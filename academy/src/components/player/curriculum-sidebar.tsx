"use client";

/**
 * Course curriculum navigation used in the desktop sidebar and the mobile
 * "Lessons" drawer. A <nav> of modules → lessons with checkmarks, durations,
 * lock icons and unlock dates; the current lesson carries aria-current.
 */
import * as React from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, Lock, PlayCircle, Sparkles } from "lucide-react";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { humanizeUnlock } from "@/lib/domain/drip";
import { Progress } from "@/components/ui/progress";
import { usePlayerStore } from "./player-store";
import type { CurriculumData, SidebarModule } from "./types";

export interface CurriculumSidebarProps {
  data: CurriculumData;
  currentLessonId: string;
  /** Called after a lesson link is activated (closes the mobile drawer). */
  onNavigate?: () => void;
  className?: string;
}

function CurriculumSidebar({ data, currentLessonId, onNavigate, className }: CurriculumSidebarProps) {
  const { completedIds, percent } = usePlayerStore();
  const completedCount = data.modules.reduce((n, m) => n + m.lessons.filter((l) => completedIds.has(l.id)).length, 0);
  const now = new Date();
  const currentModuleId = data.modules.find((m) => m.lessons.some((l) => l.id === currentLessonId))?.id ?? null;
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => Object.fromEntries(data.modules.map((m) => [m.id, m.id === currentModuleId || m.kind === "home"])));

  React.useEffect(() => {
    if (currentModuleId) setOpen((prev) => (prev[currentModuleId] ? prev : { ...prev, [currentModuleId]: true }));
  }, [currentModuleId]);

  return (
    <nav aria-label="Course curriculum" className={cn("flex flex-col", className)}>
      <div className="px-1 pb-4">
        <Link href={data.courseHref} className="font-serif text-lg leading-tight font-medium text-foreground hover:text-rose-strong">
          {data.courseTitle}
        </Link>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedCount} of {data.totalLessons} lessons
          </span>
          <span className="font-semibold text-sage-strong">{percent}%</span>
        </div>
        <Progress value={percent} size="sm" tone="sage" className="mt-1.5" aria-label={`Course progress ${percent}%`} />
      </div>
      <ul className="flex flex-col gap-1">
        {data.modules.map((m) => (
          <ModuleGroup
            key={m.id}
            module={m}
            open={!!open[m.id]}
            onToggle={() => setOpen((prev) => ({ ...prev, [m.id]: !prev[m.id] }))}
            currentLessonId={currentLessonId}
            completedIds={completedIds}
            now={now}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}

function ModuleGroup({
  module,
  open,
  onToggle,
  currentLessonId,
  completedIds,
  now,
  onNavigate,
}: {
  module: SidebarModule;
  open: boolean;
  onToggle: () => void;
  currentLessonId: string;
  completedIds: ReadonlySet<string>;
  now: Date;
  onNavigate?: () => void;
}) {
  const panelId = `curriculum-${module.id}`;
  const done = module.lessons.filter((l) => completedIds.has(l.id)).length;
  const allDone = module.lessons.length > 0 && done === module.lessons.length;
  const unlockPhrase = module.unlocksAt ? humanizeUnlock(new Date(module.unlocksAt), now) : null;
  return (
    <li className="rounded-lg">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-rose-soft/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{module.code}</span>
          <span className={cn("block text-sm leading-snug font-semibold", allDone ? "text-sage-strong" : "text-foreground")}>{module.title}</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {module.unlocked ? (
              <>
                {done}/{module.lessons.length} done
              </>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Lock className="size-3" aria-hidden="true" />
                {unlockPhrase ?? "locked"}
                {module.unlocksAt ? <span className="sr-only"> ({formatDate(module.unlocksAt)})</span> : null}
              </span>
            )}
          </span>
        </span>
        {allDone ? <CircleCheck className="mt-1 size-4 shrink-0 text-sage-strong" aria-label="Module complete" /> : null}
      </button>
      <ul id={panelId} hidden={!open} className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-border pl-2">
        {module.lessons.map((l) => {
          const current = l.id === currentLessonId;
          const completed = completedIds.has(l.id);
          const phrase = l.unlocksAt ? humanizeUnlock(new Date(l.unlocksAt), now) : null;
          const inner = (
            <>
              <span className="mt-0.5 shrink-0" aria-hidden="true">
                {completed ? (
                  <CircleCheck className="size-4 text-sage-strong" />
                ) : !l.unlocked ? (
                  <Lock className="size-4 text-muted-foreground" />
                ) : current ? (
                  <PlayCircle className="size-4 text-rose-strong" />
                ) : (
                  <span className="block size-4 rounded-full border border-border" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm leading-snug", current ? "font-semibold text-rose-strong" : "text-foreground/90")}>
                  {l.title}
                  {completed ? <span className="sr-only"> (completed)</span> : null}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
                  <span className="font-mono uppercase">{l.code}</span>
                  {l.durationSec > 0 ? <span>{formatDuration(l.durationSec)}</span> : null}
                  {l.isPreview ? (
                    <span className="inline-flex items-center gap-0.5 text-warning">
                      <Sparkles className="size-3" aria-hidden="true" />
                      preview
                    </span>
                  ) : null}
                  {!l.unlocked && phrase ? <span>{phrase}</span> : null}
                </span>
              </span>
            </>
          );
          const base = "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors";
          return (
            <li key={l.id}>
              {l.unlocked ? (
                <Link
                  href={l.href}
                  aria-current={current ? "page" : undefined}
                  onClick={onNavigate}
                  className={cn(base, current ? "bg-rose-soft/60" : "hover:bg-rose-soft/40", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none")}
                >
                  {inner}
                </Link>
              ) : (
                <Link
                  href={l.href}
                  aria-current={current ? "page" : undefined}
                  aria-disabled="true"
                  onClick={onNavigate}
                  className={cn(base, "opacity-70 hover:bg-rose-soft/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none")}
                  title={l.unlocksAt ? `Opens ${formatDate(l.unlocksAt)}` : "Locked"}
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export { CurriculumSidebar };
