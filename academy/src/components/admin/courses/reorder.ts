/**
 * Pure ordering helpers shared by the curriculum tree, the resources card and
 * the action-steps card. No React, no I/O.
 */

/** Moves the item at `from` to `to` (clamped), returning a new array. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || from >= items.length) return [...items];
  const target = Math.max(0, Math.min(items.length - 1, to));
  if (from === target) return [...items];
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(target, 0, item);
  return next;
}

/** Moves the item with `id` one step up (-1) or down (+1). */
export function nudge<T extends { id: string }>(items: T[], id: string, delta: -1 | 1): T[] {
  const from = items.findIndex((i) => i.id === id);
  if (from < 0) return [...items];
  return moveItem(items, from, from + delta);
}

/** Rewrites `position` to match array order. */
export function renumber<T extends { position: number }>(items: T[]): T[] {
  return items.map((item, position) => (item.position === position ? item : { ...item, position }));
}

export interface TreeModule<L extends { id: string }> {
  id: string;
  lessons: L[];
}

/** The payload the curriculum action persists: module order + lesson ids per module. */
export function curriculumOrder<L extends { id: string }>(modules: TreeModule<L>[]): Array<{ module_id: string; lesson_ids: string[] }> {
  return modules.map((m) => ({ module_id: m.id, lesson_ids: m.lessons.map((l) => l.id) }));
}

/**
 * Applies a drag result to the tree. Lessons can move within a module or into
 * another module (dropping on a lesson inserts before it; dropping on the
 * module container appends). Returns the same reference when nothing changes.
 */
export function moveLesson<L extends { id: string }, M extends TreeModule<L>>(modules: M[], lessonId: string, over: { type: "lesson"; id: string } | { type: "module"; id: string }): M[] {
  const fromIndex = modules.findIndex((m) => m.lessons.some((l) => l.id === lessonId));
  if (fromIndex < 0) return modules;
  const fromModule = modules[fromIndex];
  const lesson = fromModule.lessons.find((l) => l.id === lessonId)!;
  const toIndex = over.type === "module" ? modules.findIndex((m) => m.id === over.id) : modules.findIndex((m) => m.lessons.some((l) => l.id === over.id));
  if (toIndex < 0) return modules;
  if (over.type === "lesson" && over.id === lessonId) return modules;

  const next = modules.map((m) => ({ ...m, lessons: [...m.lessons] })) as M[];
  next[fromIndex].lessons = next[fromIndex].lessons.filter((l) => l.id !== lessonId);
  const target = next[toIndex];
  if (over.type === "module") {
    target.lessons.push(lesson);
  } else {
    const overIndex = target.lessons.findIndex((l) => l.id === over.id);
    const sameModule = fromIndex === toIndex;
    const originalFrom = fromModule.lessons.findIndex((l) => l.id === lessonId);
    const originalOver = fromModule.lessons.findIndex((l) => l.id === over.id);
    // Dragging downwards within a module lands after the hovered item (dnd-kit arrayMove semantics).
    const insertAt = sameModule && originalFrom < originalOver ? overIndex + 1 : overIndex;
    target.lessons.splice(Math.max(0, insertAt), 0, lesson);
  }
  return next;
}

/** Reorders modules by id, keeping lessons attached. */
export function moveModule<M extends { id: string }>(modules: M[], activeId: string, overId: string): M[] {
  const from = modules.findIndex((m) => m.id === activeId);
  const to = modules.findIndex((m) => m.id === overId);
  if (from < 0 || to < 0 || from === to) return modules;
  return moveItem(modules, from, to);
}

/** Minutes and seconds ↔ total seconds, for the duration fields. */
export function splitDuration(sec: number): { minutes: number; seconds: number } {
  const total = Math.max(0, Math.round(sec));
  return { minutes: Math.floor(total / 60), seconds: total % 60 };
}

export function joinDuration(minutes: number, seconds: number): number {
  const m = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
  const s = Number.isFinite(seconds) ? Math.max(0, Math.min(59, Math.floor(seconds))) : 0;
  return m * 60 + s;
}
