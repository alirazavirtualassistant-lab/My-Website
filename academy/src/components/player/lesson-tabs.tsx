"use client";

/**
 * The six lesson tabs. Each panel's content is rendered by the page (server)
 * and passed in; this only owns the selected tab, which it mirrors into the
 * URL hash so "#transcript" links from the coming-soon card work.
 */
import * as React from "react";
import { BookOpen, ClipboardList, FileText, FolderDown, MessageSquare, NotebookPen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LESSON_TABS = ["overview", "transcript", "resources", "steps", "notes", "discussion"] as const;
export type LessonTab = (typeof LESSON_TABS)[number];

export interface LessonTabsProps {
  overview: React.ReactNode;
  transcript: React.ReactNode;
  resources: React.ReactNode;
  steps: React.ReactNode;
  notes: React.ReactNode;
  discussion: React.ReactNode;
  counts?: Partial<Record<LessonTab, number>>;
  defaultTab?: LessonTab;
}

function isTab(v: string | null | undefined): v is LessonTab {
  return !!v && (LESSON_TABS as readonly string[]).includes(v);
}

function Count({ n }: { n?: number }) {
  if (!n) return null;
  return <span className="rounded-full bg-cream-2 px-1.5 text-[11px] font-bold text-muted-foreground">{n}</span>;
}

function LessonTabs({ overview, transcript, resources, steps, notes, discussion, counts, defaultTab = "overview" }: LessonTabsProps) {
  const [tab, setTab] = React.useState<LessonTab>(defaultTab);

  // Honour #transcript etc. on load and when a same-page anchor is clicked.
  React.useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (isTab(h)) setTab(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  function change(v: string) {
    if (!isTab(v)) return;
    setTab(v);
    try {
      window.history.replaceState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }

  return (
    <Tabs value={tab} onValueChange={change} className="gap-5">
      <TabsList aria-label="Lesson sections" className="w-full justify-start">
        <TabsTrigger value="overview">
          <BookOpen aria-hidden="true" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="transcript">
          <FileText aria-hidden="true" />
          Transcript
        </TabsTrigger>
        <TabsTrigger value="resources">
          <FolderDown aria-hidden="true" />
          Resources
          <Count n={counts?.resources} />
        </TabsTrigger>
        <TabsTrigger value="steps">
          <ClipboardList aria-hidden="true" />
          Action steps
          <Count n={counts?.steps} />
        </TabsTrigger>
        <TabsTrigger value="notes">
          <NotebookPen aria-hidden="true" />
          Notes
          <Count n={counts?.notes} />
        </TabsTrigger>
        <TabsTrigger value="discussion">
          <MessageSquare aria-hidden="true" />
          Discussion
          <Count n={counts?.discussion} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{overview}</TabsContent>
      <TabsContent value="transcript">{transcript}</TabsContent>
      <TabsContent value="resources">{resources}</TabsContent>
      <TabsContent value="steps">{steps}</TabsContent>
      <TabsContent value="notes">{notes}</TabsContent>
      <TabsContent value="discussion">{discussion}</TabsContent>
    </Tabs>
  );
}

export { LessonTabs };
