"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, ChevronDown, Clapperboard, Eye, GripVertical, LoaderCircle, Pencil, Settings2, Trash2, Video, VideoOff } from "lucide-react";
import type { LessonStatus, ModuleKind } from "@/lib/types";
import { cn, formatDuration, pluralize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toaster";
import { deleteLessonAction, deleteModuleAction, reorderCurriculumAction } from "@/app/admin/(panel)/courses/[id]/curriculum/actions";
import { AddLessonDialog } from "./add-lesson-dialog";
import { AddModuleDialog } from "./add-module-dialog";
import { ConfirmDialog } from "./confirm-dialog";
import { KIND_LABELS, ModuleSettingsForm } from "./module-settings-form";
import { StatusBadge } from "./status-badge";
import { curriculumOrder, moveLesson, moveModule, nudge } from "./reorder";

export interface TreeLessonView {
  id: string;
  code: string;
  title: string;
  status: LessonStatus;
  is_preview: boolean;
  is_intro: boolean;
  duration_sec: number;
  xp: number;
  resources: number;
  video: "none" | "processing" | "ready";
  planned_video_filename: string | null;
}

export interface TreeModuleView {
  id: string;
  code: string;
  kind: ModuleKind;
  title: string;
  description: string;
  notes: string;
  drip_days: number;
  completion_xp: number;
  required_for_certificate: boolean;
  illustration: string | null;
  lessons: TreeLessonView[];
}

const MODULE_PREFIX = "module:";
const LESSON_PREFIX = "lesson:";
const idOf = (prefix: string, id: UniqueIdentifier) => String(id).slice(prefix.length);
const isModuleId = (id: UniqueIdentifier) => String(id).startsWith(MODULE_PREFIX);
const isLessonId = (id: UniqueIdentifier) => String(id).startsWith(LESSON_PREFIX);

/**
 * Modules → lessons tree with drag-and-drop ordering (dnd-kit), inline module
 * settings, add/delete and keyboard-friendly move buttons. Every change is
 * persisted through a Server Action; the local tree updates optimistically
 * and rolls back if the save fails.
 */
function CurriculumTree({ courseId, courseSlug, initialModules }: { courseId: string; courseSlug: string; initialModules: TreeModuleView[] }) {
  const router = useRouter();
  const [modules, setModules] = React.useState(initialModules);
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const [pending, startTransition] = React.useTransition();
  const beforeDrag = React.useRef<TreeModuleView[] | null>(null);
  const [lastServer, setLastServer] = React.useState(initialModules);

  // Adopt server data after a refresh (new lesson, deleted module…) unless a drag is in flight.
  if (lastServer !== initialModules) {
    setLastServer(initialModules);
    if (!activeId) setModules(initialModules);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persist = React.useCallback(
    (next: TreeModuleView[], previous: TreeModuleView[]) => {
      startTransition(async () => {
        const result = await reorderCurriculumAction(courseId, curriculumOrder(next));
        if (result.status === "error") {
          setModules(previous);
          toast.error(result.summary?.[0] ?? "Could not save the new order.");
        } else {
          toast.success("Order saved.");
          router.refresh();
        }
      });
    },
    [courseId, router],
  );

  function onDragStart(e: DragStartEvent) {
    setActiveId(e.active.id);
    beforeDrag.current = modules;
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over || !isLessonId(active.id)) return;
    const lessonId = idOf(LESSON_PREFIX, active.id);
    const fromModule = modules.find((m) => m.lessons.some((l) => l.id === lessonId));
    if (!fromModule) return;
    if (isModuleId(over.id)) {
      const targetId = idOf(MODULE_PREFIX, over.id);
      if (targetId === fromModule.id) return;
      setModules((m) => moveLesson(m, lessonId, { type: "module", id: targetId }));
    } else if (isLessonId(over.id)) {
      const overLesson = idOf(LESSON_PREFIX, over.id);
      const toModule = modules.find((m) => m.lessons.some((l) => l.id === overLesson));
      if (!toModule || toModule.id === fromModule.id) return;
      setModules((m) => moveLesson(m, lessonId, { type: "lesson", id: overLesson }));
    }
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    const previous = beforeDrag.current ?? modules;
    beforeDrag.current = null;
    if (!over) {
      setModules(previous);
      return;
    }
    let next = modules;
    if (isModuleId(active.id) && isModuleId(over.id)) {
      next = moveModule(modules, idOf(MODULE_PREFIX, active.id), idOf(MODULE_PREFIX, over.id));
    } else if (isLessonId(active.id) && isLessonId(over.id)) {
      next = moveLesson(modules, idOf(LESSON_PREFIX, active.id), { type: "lesson", id: idOf(LESSON_PREFIX, over.id) });
    }
    if (JSON.stringify(curriculumOrder(next)) === JSON.stringify(curriculumOrder(previous))) {
      setModules(previous);
      return;
    }
    setModules(next);
    persist(next, previous);
  }

  function onDragCancel() {
    setActiveId(null);
    if (beforeDrag.current) setModules(beforeDrag.current);
    beforeDrag.current = null;
  }

  function nudgeModule(id: string, delta: -1 | 1) {
    const next = nudge(modules, id, delta);
    if (next.map((m) => m.id).join() === modules.map((m) => m.id).join()) return;
    setModules(next);
    persist(next, modules);
  }

  function nudgeLesson(moduleId: string, id: string, delta: -1 | 1) {
    const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: nudge(m.lessons, id, delta) } : m));
    if (JSON.stringify(curriculumOrder(next)) === JSON.stringify(curriculumOrder(modules))) return;
    setModules(next);
    persist(next, modules);
  }

  const existingCodes = modules.map((m) => m.code);
  const allLessonCodes = modules.flatMap((m) => m.lessons.map((l) => l.code));

  return (
    <section aria-labelledby="curriculum-title" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="curriculum-title" className="font-serif text-xl font-medium">
            Modules & lessons
          </h2>
          <p className="text-sm text-muted-foreground">Drag the handles to reorder, or use the arrow buttons. Lessons can move between modules.</p>
        </div>
        <div className="flex items-center gap-2">
          {pending ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
              <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> Saving order…
            </span>
          ) : null}
          <AddModuleDialog courseId={courseId} existingCodes={existingCodes} />
        </div>
      </div>

      {modules.length === 0 ? (
        <EmptyState icon={<Clapperboard />} title="No modules yet" description="Add a module to start building the curriculum, or import a package." />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
          <SortableContext items={modules.map((m) => `${MODULE_PREFIX}${m.id}`)} strategy={verticalListSortingStrategy}>
            <ol className="space-y-4">
              {modules.map((m, index) => (
                <ModuleRow
                  key={m.id}
                  module={m}
                  index={index}
                  count={modules.length}
                  courseId={courseId}
                  courseSlug={courseSlug}
                  allLessonCodes={allLessonCodes}
                  dragging={activeId !== null}
                  onNudge={(delta) => nudgeModule(m.id, delta)}
                  onNudgeLesson={(id, delta) => nudgeLesson(m.id, id, delta)}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}

function ModuleRow({ module: m, index, count, courseId, courseSlug, allLessonCodes, dragging, onNudge, onNudgeLesson }: { module: TreeModuleView; index: number; count: number; courseId: string; courseSlug: string; allLessonCodes: string[]; dragging: boolean; onNudge: (delta: -1 | 1) => void; onNudgeLesson: (id: string, delta: -1 | 1) => void }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: `${MODULE_PREFIX}${m.id}` });
  const style: React.CSSProperties = { transform: CSS.Translate.toString(transform), transition };
  const lessonXp = m.lessons.reduce((n, l) => n + l.xp, 0);
  const settingsId = `module-settings-${m.id}`;
  const listId = `module-lessons-${m.id}`;

  return (
    <li ref={setNodeRef} style={style} className={cn("card-soft overflow-hidden", isDragging && "opacity-70 shadow-card ring-2 ring-rose/40")}>
      <div className="flex items-start gap-2 p-3 sm:items-center sm:p-4">
        <button
          ref={setActivatorNodeRef}
          type="button"
          className="mt-1 flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-rose-soft/50 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing sm:mt-0"
          aria-label={`Drag to reorder module ${m.code}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono text-xs font-semibold text-muted-foreground">{m.code}</span>
            <h3 className="font-serif text-lg font-medium text-foreground">{m.title}</h3>
            <Badge variant={m.kind === "core" ? "rose" : m.kind === "home" ? "gold" : "muted"}>{KIND_LABELS[m.kind]}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {m.drip_days === 0 ? "Opens on enrolment" : `Opens after ${pluralize(m.drip_days, "day")}`} · {pluralize(m.lessons.length, "lesson")} · {m.completion_xp + lessonXp} XP
            {m.required_for_certificate ? " · counts toward certificate" : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${m.code} up`} disabled={index === 0 || dragging} onClick={() => onNudge(-1)}>
            <ArrowUp />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-label={`Move ${m.code} down`} disabled={index === count - 1 || dragging} onClick={() => onNudge(1)}>
            <ArrowDown />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-expanded={showSettings} aria-controls={settingsId} aria-label={`${showSettings ? "Hide" : "Show"} settings for ${m.code}`} onClick={() => setShowSettings((v) => !v)}>
            <Settings2 />
          </Button>
          <ConfirmDialog
            trigger={
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-danger" aria-label={`Delete module ${m.code}`}>
                <Trash2 />
              </Button>
            }
            title={`Delete module ${m.code}?`}
            description={m.lessons.length > 0 ? `“${m.title}” and its ${pluralize(m.lessons.length, "lesson")} will be removed, including resources, action steps and learner progress on them.` : `“${m.title}” will be removed.`}
            confirmLabel="Delete module"
            typeToConfirm={m.lessons.length > 0 ? "DELETE" : undefined}
            onConfirm={async () => {
              const res = await deleteModuleAction(m.id, courseId);
              if (res.status === "error") {
                toast.error(res.summary?.[0] ?? "Could not delete the module.");
                throw new Error("failed");
              }
              toast.success("Module deleted.");
              router.refresh();
            }}
          />
          <Button type="button" variant="ghost" size="icon" className="size-8" aria-expanded={!collapsed} aria-controls={listId} aria-label={`${collapsed ? "Expand" : "Collapse"} lessons in ${m.code}`} onClick={() => setCollapsed((v) => !v)}>
            <ChevronDown className={cn("transition-transform", collapsed && "-rotate-90")} />
          </Button>
        </div>
      </div>

      {showSettings ? (
        <div id={settingsId} className="border-t border-border bg-cream-2/40 p-4">
          <ModuleSettingsForm courseId={courseId} moduleId={m.id} values={m} onSaved={() => setShowSettings(false)} />
        </div>
      ) : null}

      <div id={listId} hidden={collapsed} className="border-t border-border">
        <SortableContext items={m.lessons.map((l) => `${LESSON_PREFIX}${l.id}`)} strategy={verticalListSortingStrategy}>
          {m.lessons.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted-foreground">No lessons yet. Drop one here or add a lesson below.</p>
          ) : (
            <ol className="divide-y divide-border">
              {m.lessons.map((l, i) => (
                <LessonRow key={l.id} lesson={l} index={i} count={m.lessons.length} courseId={courseId} courseSlug={courseSlug} dragging={dragging} onNudge={(delta) => onNudgeLesson(l.id, delta)} />
              ))}
            </ol>
          )}
        </SortableContext>
        <div className="flex justify-end border-t border-border bg-cream-2/30 px-4 py-2.5">
          <AddLessonDialog courseId={courseId} moduleId={m.id} moduleCode={m.code} moduleTitle={m.title} existingCodes={allLessonCodes} />
        </div>
      </div>
    </li>
  );
}

function LessonRow({ lesson: l, index, count, courseId, courseSlug, dragging, onNudge }: { lesson: TreeLessonView; index: number; count: number; courseId: string; courseSlug: string; dragging: boolean; onNudge: (delta: -1 | 1) => void }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: `${LESSON_PREFIX}${l.id}` });
  const style: React.CSSProperties = { transform: CSS.Translate.toString(transform), transition };
  const editHref = `/admin/courses/${courseId}/lessons/${l.id}`;
  const previewHref = `/courses/${courseSlug}/preview/${l.code.toLowerCase().replace(/_/g, "-")}`;
  return (
    <li ref={setNodeRef} style={style} className={cn("flex items-center gap-2 px-3 py-2 sm:px-4", isDragging && "bg-rose-soft/40 opacity-80")}>
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-rose-soft/50 hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing"
        aria-label={`Drag to reorder lesson ${l.code}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">{l.code}</span>
      <div className="min-w-0 flex-1">
        <Link href={editHref} className="block truncate text-sm font-semibold text-foreground hover:text-rose-strong focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          {l.title}
        </Link>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span>{formatDuration(l.duration_sec)}</span>
          <span aria-hidden="true">·</span>
          <span>{l.xp} XP</span>
          {l.resources > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{pluralize(l.resources, "resource")}</span>
            </>
          ) : null}
          {l.is_intro ? <Badge variant="muted">Intro</Badge> : null}
          {l.is_preview ? (
            <Badge variant="gold">
              <Eye /> Preview
            </Badge>
          ) : null}
        </p>
      </div>
      <span className="hidden shrink-0 sm:inline-flex">
        <StatusBadge status={l.status} />
      </span>
      <span
        className={cn("inline-flex size-7 shrink-0 items-center justify-center rounded-md", l.video === "ready" ? "bg-sage-soft text-sage-strong" : l.video === "processing" ? "bg-gold-soft text-warning" : "bg-muted-bg text-muted-foreground")}
        title={l.video === "ready" ? "Video attached" : l.video === "processing" ? "Video processing" : "No video yet"}
      >
        {l.video === "ready" ? <Video className="size-4" aria-hidden="true" /> : l.video === "processing" ? <LoaderCircle className="size-4" aria-hidden="true" /> : <VideoOff className="size-4" aria-hidden="true" />}
        <span className="sr-only">{l.video === "ready" ? "Video attached" : l.video === "processing" ? "Video processing" : "No video yet"}</span>
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={`Move ${l.code} up`} disabled={index === 0 || dragging} onClick={() => onNudge(-1)}>
          <ArrowUp />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={`Move ${l.code} down`} disabled={index === count - 1 || dragging} onClick={() => onNudge(1)}>
          <ArrowDown />
        </Button>
        {l.is_preview ? (
          <Button asChild variant="ghost" size="icon" className="size-7">
            <Link href={previewHref} target="_blank" rel="noreferrer" aria-label={`Open public preview of ${l.code} (new tab)`}>
              <Eye />
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="ghost" size="icon" className="size-7">
          <Link href={editHref} aria-label={`Edit ${l.code}`}>
            <Pencil />
          </Link>
        </Button>
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-danger" aria-label={`Delete lesson ${l.code}`}>
              <Trash2 />
            </Button>
          }
          title={`Delete lesson ${l.code}?`}
          description={`“${l.title}” will be removed with its resources, action steps, notes and any learner progress on it. There is no undo.`}
          confirmLabel="Delete lesson"
          onConfirm={async () => {
            const res = await deleteLessonAction(l.id, courseId);
            if (res.status === "error") {
              toast.error(res.summary?.[0] ?? "Could not delete the lesson.");
              throw new Error("failed");
            }
            toast.success("Lesson deleted.");
            router.refresh();
          }}
        />
      </div>
    </li>
  );
}

export { CurriculumTree };
