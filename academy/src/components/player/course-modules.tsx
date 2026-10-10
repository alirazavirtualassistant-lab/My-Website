import * as React from "react";
import Link from "next/link";
import { ChevronDown, CircleCheck, Lock, PlayCircle, Sparkles } from "lucide-react";
import { cn, formatDate, formatDuration, pluralize } from "@/lib/utils";
import { humanizeUnlock } from "@/lib/domain/drip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Illustration } from "@/components/shared/illustration";
import { moduleArt, moduleDisplayName } from "./format";
import { ResourceList } from "./resource-list";
import type { ResourceView } from "./types";

export interface OverviewLesson {
  id: string;
  code: string;
  title: string;
  href: string | null;
  durationSec: number;
  completed: boolean;
  unlocked: boolean;
  unlocksAt: string | null;
  isPreview: boolean;
  xpTotal: number;
}

export interface OverviewModule {
  id: string;
  code: string;
  kind: "home" | "core" | "bonus" | "replay";
  title: string;
  description: string;
  illustration: string | null;
  unlocked: boolean;
  unlocksAt: string | null;
  completed: number;
  total: number;
  xpTotal: number;
  lessons: OverviewLesson[];
  resources: ResourceView[];
  /** Open the <details> by default (current module). */
  defaultOpen: boolean;
}

/** One expandable module card. Native <details> so it works without JS and is keyboard-native. */
function ModuleCard({ module, hasAccess }: { module: OverviewModule; hasAccess: boolean }) {
  const now = new Date();
  const art = moduleArt(module.code, module.illustration);
  const pct = module.total > 0 ? Math.round((100 * module.completed) / module.total) : 0;
  const done = module.total > 0 && module.completed === module.total;
  const phrase = module.unlocksAt ? humanizeUnlock(new Date(module.unlocksAt), now) : null;
  return (
    <details open={module.defaultOpen || undefined} className="card-soft group overflow-hidden">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-4 marker:content-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:p-5 [&::-webkit-details-marker]:hidden">
        <div aria-hidden="true" className={cn("hidden size-16 shrink-0 items-center justify-center rounded-lg sm:flex", module.unlocked ? "bg-rose-soft/60" : "bg-cream-2")}>
          <Illustration name={art} size={52} className={module.unlocked ? "text-rose-strong" : "text-muted-foreground"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{module.kind === "core" ? moduleDisplayName(module) : module.code}</span>
            {done ? <Badge variant="success">Complete</Badge> : null}
            {!module.unlocked ? (
              <Badge variant="muted">
                <Lock aria-hidden="true" />
                {phrase ?? (hasAccess ? "Locked" : "Enrol to open")}
              </Badge>
            ) : null}
          </p>
          <h3 className="mt-1 font-serif text-2xl leading-tight">{module.title}</h3>
          {module.description ? <p className="mt-1 text-sm text-muted-foreground">{module.description}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{pluralize(module.total, "lesson")}</span>
            {module.xpTotal > 0 ? <span>{module.xpTotal} XP</span> : null}
            {module.unlocksAt ? <span>Opens {formatDate(module.unlocksAt)}</span> : null}
            {module.unlocked && module.total > 0 ? (
              <span className="flex min-w-32 flex-1 items-center gap-2">
                <Progress value={pct} size="sm" tone="sage" className="max-w-40" aria-label={`${moduleDisplayName(module)} ${pct}% complete`} />
                <span className="font-semibold text-sage-strong">
                  {module.completed}/{module.total}
                </span>
              </span>
            ) : null}
          </div>
        </div>
        <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-border px-4 py-4 sm:px-5">
        <ol className="divide-y divide-border">
          {module.lessons.map((l) => {
            const lessonPhrase = l.unlocksAt ? humanizeUnlock(new Date(l.unlocksAt), now) : null;
            const inner = (
              <>
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {l.completed ? <CircleCheck className="size-5 text-sage-strong" /> : l.unlocked ? <PlayCircle className="size-5 text-rose-strong" /> : <Lock className="size-5 text-muted-foreground" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">
                    {l.title}
                    {l.completed ? <span className="sr-only"> (completed)</span> : null}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                    <span className="font-mono uppercase">{l.code}</span>
                    {l.durationSec > 0 ? <span>{formatDuration(l.durationSec)}</span> : null}
                    {l.xpTotal > 0 ? <span>{l.xpTotal} XP</span> : null}
                    {l.isPreview ? (
                      <span className="inline-flex items-center gap-1 text-warning">
                        <Sparkles className="size-3" aria-hidden="true" />
                        free preview
                      </span>
                    ) : null}
                    {!l.unlocked && lessonPhrase ? <span>{lessonPhrase}</span> : null}
                    {!l.unlocked && !lessonPhrase && !hasAccess && !l.isPreview ? <span>enrol to open</span> : null}
                  </span>
                </span>
              </>
            );
            return (
              <li key={l.id}>
                {l.href ? (
                  <Link href={l.href} className="flex items-start gap-3 rounded-md px-1 py-3 hover:bg-rose-soft/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-start gap-3 px-1 py-3 opacity-75">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
        {module.resources.length > 0 ? (
          <div className="mt-4 rounded-lg bg-cream-2/50 p-3">
            <p className="eyebrow mb-1">Module resources</p>
            <ResourceList resources={module.resources} unlocked={module.unlocked && hasAccess} lockedNote={hasAccess ? (phrase ?? "Locked") : "Enrol to download"} grouped={false} />
          </div>
        ) : null}
      </div>
    </details>
  );
}

/** Core modules, then bonuses and replays under their own headings. */
function CourseModules({ modules, hasAccess }: { modules: OverviewModule[]; hasAccess: boolean }) {
  const main = modules.filter((m) => m.kind === "home" || m.kind === "core");
  const bonus = modules.filter((m) => m.kind === "bonus");
  const replay = modules.filter((m) => m.kind === "replay");
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="modules-heading" className="flex flex-col gap-4">
        <h2 id="modules-heading" className="font-serif text-3xl">
          Your path
        </h2>
        {main.map((m) => (
          <ModuleCard key={m.id} module={m} hasAccess={hasAccess} />
        ))}
      </section>
      {bonus.length > 0 ? (
        <section aria-labelledby="bonus-heading" className="flex flex-col gap-4">
          <div>
            <h2 id="bonus-heading" className="font-serif text-3xl">
              Bonuses
            </h2>
            <p className="text-sm text-muted-foreground">Extra trainings you can open any time.</p>
          </div>
          {bonus.map((m) => (
            <ModuleCard key={m.id} module={m} hasAccess={hasAccess} />
          ))}
        </section>
      ) : null}
      {replay.length > 0 ? (
        <section aria-labelledby="replay-heading" className="flex flex-col gap-4">
          <div>
            <h2 id="replay-heading" className="font-serif text-3xl">
              Replays
            </h2>
            <p className="text-sm text-muted-foreground">Group coaching sessions, recorded for you.</p>
          </div>
          {replay.map((m) => (
            <ModuleCard key={m.id} module={m} hasAccess={hasAccess} />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export { CourseModules, ModuleCard };
