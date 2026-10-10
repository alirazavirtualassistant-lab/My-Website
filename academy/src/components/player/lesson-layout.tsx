"use client";

/**
 * Lesson page frame: the curriculum sidebar (collapsible column on xl+, a
 * "Lessons" drawer below that) beside the player column. Also mounts the
 * shared player store so sidebar checkmarks update optimistically.
 */
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ListTree, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { PlayerStoreProvider, usePlayerStore } from "./player-store";
import type { CurriculumData } from "./types";

const COLLAPSE_KEY = "cyc-curriculum-collapsed";

export interface LessonLayoutProps {
  curriculum: CurriculumData;
  currentLessonId: string;
  initialCompletedIds: string[];
  children: React.ReactNode;
}

function LessonLayout({ curriculum, currentLessonId, initialCompletedIds, children }: LessonLayoutProps) {
  return (
    <PlayerStoreProvider initialCompletedIds={initialCompletedIds} totalLessons={curriculum.totalLessons}>
      <Frame curriculum={curriculum} currentLessonId={currentLessonId}>
        {children}
      </Frame>
    </PlayerStoreProvider>
  );
}

function Frame({ curriculum, currentLessonId, children }: { curriculum: CurriculumData; currentLessonId: string; children: React.ReactNode }) {
  const { percent } = usePlayerStore();
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);

  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Compact bar: course link, progress, and the Lessons drawer below xl. */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href={curriculum.courseHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-strong underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="truncate">{curriculum.courseTitle}</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Progress value={percent} size="sm" tone="sage" className="w-28" aria-label={`Course progress ${percent}%`} />
            <span className="font-semibold text-sage-strong">{percent}%</span>
          </div>
          <Sheet open={drawer} onOpenChange={setDrawer}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="xl:hidden">
                <ListTree aria-hidden="true" />
                Lessons
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[90vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Lessons</SheetTitle>
                <SheetDescription>Jump to any open lesson.</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-6">
                <CurriculumSidebar data={curriculum} currentLessonId={currentLessonId} onNavigate={() => setDrawer(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <Button size="sm" variant="ghost" className="hidden xl:inline-flex" onClick={toggle} aria-expanded={!collapsed} aria-controls="curriculum-column">
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            {collapsed ? "Show lessons" : "Hide lessons"}
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-6", !collapsed && "xl:grid-cols-[17rem_minmax(0,1fr)]")}>
        <aside id="curriculum-column" hidden={collapsed} className={cn("hidden xl:block", collapsed && "xl:hidden")}>
          <div className="card-soft sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-3">
            <CurriculumSidebar data={curriculum} currentLessonId={currentLessonId} />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export { LessonLayout };
