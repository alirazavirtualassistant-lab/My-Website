import "server-only";
import { getServices } from "@/services";
import type { DataStore } from "@/services/types";
import type {
  ActionStep,
  ActionStepCompletion,
  Badge,
  CourseTree,
  Enrollment,
  Lesson,
  LessonProgress,
  QuizResponse,
  Streak,
  XpEntry,
} from "@/lib/types";
import { newId, nowIso, todayKey } from "@/lib/utils";
import { isUnlocked, lessonDripDays, unlockDate } from "@/lib/domain/drip";
import { computeCourseXp, levelForXp, xpAwardsForStepCompletion, COURSE_GOALS, hasAward } from "@/lib/domain/xp";
import { updateStreak, streakBadgeKeys } from "@/lib/domain/streaks";
import { courseProgress, nextLesson, lessonOrder, moduleIsComplete } from "@/lib/domain/progress";
import { scoreQuiz } from "@/lib/domain/quizzes";
import { getCourseTree } from "./catalog";
import { getLearnerAccess } from "./access";
import { issueCertificateIfEligible } from "./certificates";

export interface LessonState {
  lesson: Lesson;
  moduleId: string;
  unlocked: boolean;
  unlocksAt: string | null;
  completed: boolean;
  lastPositionSec: number;
  xpEarned: number;
  xpTotal: number;
}

export interface LearnerCourseState {
  tree: CourseTree;
  enrollment: Enrollment | null;
  access: Awaited<ReturnType<typeof getLearnerAccess>>;
  progress: LessonProgress[];
  completions: ActionStepCompletion[];
  xpEntries: XpEntry[];
  xpTotal: number;
  courseXp: ReturnType<typeof computeCourseXp>;
  level: ReturnType<typeof levelForXp>;
  summary: ReturnType<typeof courseProgress>;
  lessons: Record<string, LessonState>; // by lesson id
  next: { moduleId: string; lesson: Lesson } | null;
  badges: Badge[];
  streak: Streak | null;
}

/** Everything the dashboard and player need for one learner + course, in one call. */
export async function getLearnerCourseState(userId: string, courseId: string, role?: string): Promise<LearnerCourseState | null> {
  const { db } = await getServices();
  const tree = await getCourseTree(courseId);
  if (!tree) return null;
  const now = new Date();
  const access = await getLearnerAccess(userId, courseId, role);
  const [progress, completions, xpEntries, userBadges, streak] = await Promise.all([
    db.from("lesson_progress").list({ where: { user_id: userId, course_id: courseId } }),
    db.from("action_step_completions").list({ where: { user_id: userId, course_id: courseId } }),
    db.from("xp_ledger").list({ where: { user_id: userId } }),
    db.from("user_badges").list({ where: { user_id: userId } }),
    db.from("streaks").findOne({ user_id: userId }),
  ]);
  const badgeRows = userBadges.length ? await db.from("badges").list({ where: { id: userBadges.map((b) => b.badge_id) } }) : [];
  const courseXp = computeCourseXp(tree);
  const xpTotal = xpEntries.reduce((n, e) => n + e.amount, 0);
  const level = levelForXp(xpTotal);
  const summary = courseProgress(tree, progress);
  const enrollment = access.enrollment;
  const completedByLesson = new Map(progress.filter((p) => p.completed_at).map((p) => [p.lesson_id, p]));
  const positionByLesson = new Map(progress.map((p) => [p.lesson_id, p.last_position_sec]));
  const earnedByLesson = new Map<string, number>();
  for (const e of xpEntries) {
    if (e.reason === "action_step" || e.reason === "sub_item") {
      const lessonId = e.note ?? ""; // note stores lesson id for step awards
      earnedByLesson.set(lessonId, (earnedByLesson.get(lessonId) ?? 0) + e.amount);
    }
  }
  const lessons: Record<string, LessonState> = {};
  for (const m of tree.modules) {
    for (const l of m.lessons) {
      const drip = lessonDripDays(l, m);
      const unlocked = access.via === "admin" ? true : enrollment ? isUnlocked(enrollment, drip, now) : l.is_preview;
      lessons[l.id] = {
        lesson: l,
        moduleId: m.id,
        unlocked,
        unlocksAt: enrollment && !unlocked ? unlockDate(enrollment, drip).toISOString() : null,
        completed: completedByLesson.has(l.id),
        lastPositionSec: positionByLesson.get(l.id) ?? 0,
        xpEarned: earnedByLesson.get(l.id) ?? 0,
        xpTotal: courseXp.byLesson[l.id] ?? 0,
      };
    }
  }
  const next = enrollment ? nextLesson(tree, progress, enrollment, now) : null;
  return {
    tree,
    enrollment,
    access,
    progress,
    completions,
    xpEntries,
    xpTotal,
    courseXp,
    level,
    summary,
    lessons,
    next: next ? { moduleId: next.module.id, lesson: next.lesson } : null,
    badges: badgeRows,
    streak,
  };
}

async function requireLessonAccess(db: DataStore, userId: string, lessonId: string, role?: string) {
  const lesson = await db.from("lessons").get(lessonId);
  if (!lesson) throw new Error("Lesson not found");
  const mod = await db.from("modules").get(lesson.module_id);
  if (!mod) throw new Error("Module not found");
  const access = await getLearnerAccess(userId, lesson.course_id, role);
  if (!access.allowed && !lesson.is_preview) throw new Error("Not enrolled");
  if (access.enrollment && access.via !== "admin") {
    const drip = lessonDripDays(lesson, mod);
    if (!isUnlocked(access.enrollment, drip, new Date())) throw new Error("Lesson is not unlocked yet");
  }
  return { lesson, module: mod, access };
}

export async function updateLessonPosition(userId: string, lessonId: string, positionSec: number, watchedDeltaSec = 0, role?: string) {
  const { db } = await getServices();
  const { lesson } = await requireLessonAccess(db, userId, lessonId, role);
  const repo = db.from("lesson_progress");
  const existing = await repo.findOne({ user_id: userId, lesson_id: lessonId });
  const now = nowIso();
  if (existing) {
    await repo.update(existing.id, { last_position_sec: Math.max(0, Math.floor(positionSec)), watched_sec: existing.watched_sec + Math.max(0, watchedDeltaSec), updated_at: now });
  } else {
    await repo.insert({ id: newId(), user_id: userId, lesson_id: lessonId, course_id: lesson.course_id, completed_at: null, last_position_sec: Math.max(0, Math.floor(positionSec)), watched_sec: Math.max(0, watchedDeltaSec), updated_at: now });
  }
  await touchStreak(db, userId);
}

export interface CompletionOutcome {
  lessonCompleted: boolean;
  xpAwarded: number;
  newBadges: Badge[];
  moduleCompleted: string | null; // module code
  certificateId: string | null;
  nextLesson: { moduleId: string; lesson: Lesson } | null;
}

/** Marks a lesson complete (idempotent) and runs module/goal/certificate checks. */
export async function markLessonComplete(userId: string, lessonId: string, role?: string): Promise<CompletionOutcome> {
  const { db } = await getServices();
  const { lesson, access } = await requireLessonAccess(db, userId, lessonId, role);
  return db.transaction(async (tx) => {
    const repo = tx.from("lesson_progress");
    const existing = await repo.findOne({ user_id: userId, lesson_id: lessonId });
    const now = nowIso();
    if (existing) {
      if (!existing.completed_at) await repo.update(existing.id, { completed_at: now, updated_at: now });
    } else {
      await repo.insert({ id: newId(), user_id: userId, lesson_id: lessonId, course_id: lesson.course_id, completed_at: now, last_position_sec: 0, watched_sec: 0, updated_at: now });
    }
    await touchStreak(tx, userId);
    const after = await runCompletionChecks(tx, userId, lesson.course_id, lesson.module_id);
    const tree = await getCourseTree(lesson.course_id);
    const progress = await repo.list({ where: { user_id: userId, course_id: lesson.course_id } });
    // "Continue" prefers the lesson that follows this one in course order (when it is
    // unlocked), and only then falls back to the first unlocked, incomplete lesson.
    let next: { module: { id: string }; lesson: Lesson } | null = null;
    if (tree && access.enrollment) {
      const now = new Date();
      const ordered = lessonOrder(tree);
      const idx = ordered.findIndex((o) => o.lesson.id === lessonId);
      const following = idx >= 0 ? ordered[idx + 1] : undefined;
      if (following) {
        const unlocked = access.via === "admin" || isUnlocked(access.enrollment, lessonDripDays(following.lesson, following.module), now);
        if (unlocked) next = { module: { id: following.module.id }, lesson: following.lesson };
      }
      if (!next) {
        const fallback = nextLesson(tree, progress, access.enrollment, now);
        if (fallback) next = { module: { id: fallback.module.id }, lesson: fallback.lesson };
      }
    }
    return { lessonCompleted: true, ...after, nextLesson: next ? { moduleId: next.module.id, lesson: next.lesson } : null };
  });
}

export async function unmarkLessonComplete(userId: string, lessonId: string) {
  const { db } = await getServices();
  const repo = db.from("lesson_progress");
  const existing = await repo.findOne({ user_id: userId, lesson_id: lessonId });
  if (existing?.completed_at) await repo.update(existing.id, { completed_at: null, updated_at: nowIso() });
}

/**
 * Completes an action step (or one of its sub-items) and awards XP once.
 * Upload-type steps require an upload path. Returns the outcome including any
 * module completion bonus, goal badges and certificate issuance.
 */
export async function completeActionStep(
  userId: string,
  stepId: string,
  opts: { subItemKey?: string; uploadPath?: string | null; role?: string } = {},
): Promise<CompletionOutcome & { stepCompleted: boolean; subItemsDone: string[] }> {
  const { db } = await getServices();
  const step = await db.from("action_steps").get(stepId);
  if (!step) throw new Error("Action step not found");
  const { lesson } = await requireLessonAccess(db, userId, step.lesson_id, opts.role);
  if (step.requires_upload && !opts.uploadPath && !opts.subItemKey) {
    const existing = await db.from("action_step_completions").findOne({ user_id: userId, step_id: stepId });
    if (!existing?.upload_path) throw new Error("This step needs an upload before it can be marked complete");
  }
  return db.transaction(async (tx) => {
    const repo = tx.from("action_step_completions");
    const now = nowIso();
    let row = await repo.findOne({ user_id: userId, step_id: stepId });
    if (!row) {
      row = await repo.insert({ id: newId(), user_id: userId, step_id: stepId, lesson_id: step.lesson_id, course_id: step.course_id, upload_path: opts.uploadPath ?? null, sub_items_done: [], completed_at: null, created_at: now });
    } else if (opts.uploadPath) {
      row = await repo.update(row.id, { upload_path: opts.uploadPath });
    }
    let subItemsDone = [...row.sub_items_done];
    if (opts.subItemKey && step.sub_items?.some((s) => s.key === opts.subItemKey) && !subItemsDone.includes(opts.subItemKey)) {
      subItemsDone.push(opts.subItemKey);
    }
    const allSubsDone = !step.sub_items || step.sub_items.every((s) => subItemsDone.includes(s.key));
    const stepCompleted = opts.subItemKey ? allSubsDone : true;
    if (stepCompleted && step.sub_items) subItemsDone = step.sub_items.map((s) => s.key);
    await repo.update(row.id, { sub_items_done: subItemsDone, completed_at: stepCompleted ? (row.completed_at ?? now) : null });

    // XP: award each sub item once and the step remainder once
    const ledger = tx.from("xp_ledger");
    const existingEntries = await ledger.list({ where: { user_id: userId } });
    const awards = xpAwardsForStepCompletion(step, subItemsDone, stepCompleted);
    let xpAwarded = 0;
    for (const a of awards) {
      if (hasAward(existingEntries, a.reason, a.ref_id)) continue;
      await ledger.insert({ id: newId(), user_id: userId, course_id: step.course_id, amount: a.amount, reason: a.reason, ref_id: a.ref_id, note: step.lesson_id, created_at: now });
      xpAwarded += a.amount;
    }
    await touchStreak(tx, userId);
    const after = await runCompletionChecks(tx, userId, step.course_id, lesson.module_id);
    return { stepCompleted, subItemsDone, lessonCompleted: false, ...after, xpAwarded: after.xpAwarded + xpAwarded, nextLesson: null };
  });
}

/** Unticks a single sub-item: removes its XP and the step's remainder, and re-opens the step. */
export async function uncompleteSubItem(userId: string, stepId: string, subItemKey: string) {
  const { db } = await getServices();
  await db.transaction(async (tx) => {
    const row = await tx.from("action_step_completions").findOne({ user_id: userId, step_id: stepId });
    if (!row) return;
    const remaining = row.sub_items_done.filter((k) => k !== subItemKey);
    await tx.from("action_step_completions").update(row.id, { sub_items_done: remaining, completed_at: null });
    const ledger = tx.from("xp_ledger");
    const entries = await ledger.list({ where: { user_id: userId, reason: ["action_step", "sub_item"] } });
    for (const e of entries) if (e.ref_id === stepId || e.ref_id === `${stepId}:${subItemKey}`) await ledger.delete(e.id);
  });
}

/** Removes a completion (and its XP) when the learner unticks a step. */
export async function uncompleteActionStep(userId: string, stepId: string) {
  const { db } = await getServices();
  await db.transaction(async (tx) => {
    const row = await tx.from("action_step_completions").findOne({ user_id: userId, step_id: stepId });
    if (!row) return;
    await tx.from("action_step_completions").update(row.id, { completed_at: null, sub_items_done: [] });
    const ledger = tx.from("xp_ledger");
    const entries = await ledger.list({ where: { user_id: userId, reason: ["action_step", "sub_item"] } });
    for (const e of entries) if (e.ref_id === stepId || e.ref_id?.startsWith(stepId + ":")) await ledger.delete(e.id);
  });
}

async function runCompletionChecks(tx: DataStore, userId: string, courseId: string, moduleId: string): Promise<Omit<CompletionOutcome, "lessonCompleted" | "nextLesson">> {
  const tree = await getCourseTree(courseId);
  if (!tree) return { xpAwarded: 0, newBadges: [], moduleCompleted: null, certificateId: null };
  const now = nowIso();
  const progress = await tx.from("lesson_progress").list({ where: { user_id: userId, course_id: courseId } });
  const ledger = tx.from("xp_ledger");
  const entries = await ledger.list({ where: { user_id: userId } });
  const badgesRepo = tx.from("badges");
  const userBadgesRepo = tx.from("user_badges");
  const existingUserBadges = await userBadgesRepo.list({ where: { user_id: userId } });
  const newBadges: Badge[] = [];
  let xpAwarded = 0;
  let moduleCompleted: string | null = null;

  const award = async (badgeKey: string) => {
    const badge = await badgesRepo.findOne({ key: badgeKey });
    if (!badge) return;
    if (existingUserBadges.some((ub) => ub.badge_id === badge.id)) return;
    await userBadgesRepo.insert({ id: newId(), user_id: userId, badge_id: badge.id, course_id: courseId, awarded_at: now });
    newBadges.push(badge);
    if (badge.xp_bonus > 0 && !hasAward(entries, "course_goal", badge.key)) {
      await ledger.insert({ id: newId(), user_id: userId, course_id: courseId, amount: badge.xp_bonus, reason: "course_goal", ref_id: badge.key, note: null, created_at: now });
      xpAwarded += badge.xp_bonus;
    }
  };

  // Module completion bonus
  for (const m of tree.modules) {
    if (m.lessons.length === 0) continue;
    if (!moduleIsComplete(m, progress)) continue;
    if (!hasAward(entries, "module_complete", m.id)) {
      if (m.completion_xp > 0) {
        await ledger.insert({ id: newId(), user_id: userId, course_id: courseId, amount: m.completion_xp, reason: "module_complete", ref_id: m.id, note: null, created_at: now });
        xpAwarded += m.completion_xp;
      } else {
        // record a zero entry so we do not re-check; keeps ledger idempotent
        await ledger.insert({ id: newId(), user_id: userId, course_id: courseId, amount: 0, reason: "module_complete", ref_id: m.id, note: null, created_at: now });
      }
      if (m.id === moduleId) moduleCompleted = m.code;
      if (m.kind === "core") await award(`module:${m.code}`);
    }
  }

  // Course goals (Welcome Guide): minimum after M1, target after M1–M4, stretch after M1–M7
  const coreDone = (codes: string[]) => codes.every((c) => tree.modules.some((m) => m.code === c && m.lessons.length > 0 && moduleIsComplete(m, progress)));
  for (const goal of COURSE_GOALS) {
    if (coreDone(goal.requires_modules)) await award(goal.badge_key);
  }

  // Streak badges
  const streak = await tx.from("streaks").findOne({ user_id: userId });
  if (streak) for (const key of streakBadgeKeys(streak.current)) await award(key);

  const certificate = await issueCertificateIfEligible(tx, userId, courseId, tree, progress);
  return { xpAwarded, newBadges, moduleCompleted, certificateId: certificate?.id ?? null };
}

export async function touchStreak(db: DataStore, userId: string, timeZone?: string | null) {
  const repo = db.from("streaks");
  const existing = await repo.findOne({ user_id: userId });
  const key = todayKey(new Date(), timeZone ?? undefined);
  const next = updateStreak(existing, key);
  if (existing) {
    if (existing.current !== next.current || existing.last_active_date !== next.last_active_date) await repo.update(existing.id, { ...next, updated_at: nowIso() });
  } else {
    await repo.insert({ ...next, id: newId(), user_id: userId, updated_at: nowIso() });
  }
}

export async function submitQuizResponse(userId: string, quizKey: string, answers: Record<string, string | number | null>): Promise<QuizResponse & { band: string | null }> {
  const { db } = await getServices();
  const def = await db.from("quiz_definitions").findOne({ key: quizKey });
  if (!def) throw new Error("Quiz not found");
  const scored = scoreQuiz(def, answers);
  if (scored.missing_required.length) throw new Error("Please answer every required question");
  const row: QuizResponse = {
    id: newId(),
    user_id: userId,
    quiz_key: quizKey,
    course_id: def.course_id,
    answers,
    score: scored.score,
    section_scores: scored.section_scores,
    submitted_at: nowIso(),
  };
  await db.from("quiz_responses").insert(row);
  await touchStreak(db, userId);
  return { ...row, band: scored.band?.label ?? null };
}

export async function getQuizResponses(userId: string, quizKey: string): Promise<QuizResponse[]> {
  const { db } = await getServices();
  return db.from("quiz_responses").list({ where: { user_id: userId, quiz_key: quizKey }, orderBy: ["submitted_at", "desc"] });
}

export function orderedLessons(tree: CourseTree) {
  return lessonOrder(tree);
}

export type { ActionStep };
