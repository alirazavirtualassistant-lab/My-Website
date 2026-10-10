/**
 * Small, deterministic factories for domain tests. No I/O.
 */
import type {
  ActionStep,
  Course,
  CoursePackage,
  CourseTree,
  Coupon,
  Enrollment,
  Lesson,
  LessonProgress,
  LessonResource,
  Module,
  Product,
  QuizDefinition,
  QuizQuestion,
  Streak,
  Subscription,
  XpEntry,
} from "@/lib/types";

export type TreeModule = CourseTree["modules"][number];
export type TreeLesson = TreeModule["lessons"][number];

/** A fixed "now" used across tests. */
export const NOW = new Date("2026-10-10T12:00:00.000Z");
/** Enrolment start used by drip tests (9 days, 2.5 hours before NOW). */
export const STARTED_AT = "2026-10-01T09:30:00.000Z";
const T0 = "2026-09-01T00:00:00.000Z";
export const COURSE_ID = "course-baby-steps";

let counter = 0;
export function nextId(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
export function resetIds(): void {
  counter = 0;
}

export function daysAfter(iso: string | Date, days: number, extraMs = 0): Date {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return new Date(d.getTime() + extraMs);
}

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

export function makeCourse(overrides: Partial<Course> = {}): Course {
  return {
    id: COURSE_ID,
    slug: "baby-steps",
    title: "Baby Steps to Conception",
    subtitle: "Seven modules of small, repeatable steps",
    description: "",
    short_description: "",
    thumbnail_path: null,
    illustration: null,
    status: "published",
    publish_at: null,
    level: "All levels",
    language: "en",
    topics: ["nutrition"],
    badge: null,
    partner_seat_enabled: true,
    certificate_enabled: true,
    lifetime_access: true,
    access_days: null,
    what_you_learn: [],
    requirements: [],
    who_for: [],
    faq: [],
    duration_weeks: 7,
    last_updated_at: T0,
    created_at: T0,
    updated_at: T0,
    ...overrides,
  };
}

export function makeModule(overrides: Partial<Module> = {}): Module {
  const code = overrides.code ?? "M1";
  return {
    id: overrides.id ?? `mod-${code}`,
    course_id: COURSE_ID,
    code,
    kind: "core",
    title: `Module ${code}`,
    description: "",
    notes: "",
    position: 1,
    drip_days: 0,
    completion_xp: 10,
    header_image_path: null,
    illustration: null,
    required_for_certificate: true,
    created_at: T0,
    updated_at: T0,
    ...overrides,
  };
}

export function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  const id = overrides.id ?? nextId("lesson");
  return {
    id,
    module_id: overrides.module_id ?? "mod-M1",
    course_id: COURSE_ID,
    code: overrides.code ?? id,
    title: `Lesson ${id}`,
    series: null,
    description: "",
    notes: "",
    planned_video_filename: null,
    video_provider: "none",
    video_asset_id: null,
    video_playback_id: null,
    video_url: null,
    captions_path: null,
    thumbnail_path: null,
    duration_sec: 600,
    transcript: "",
    transcript_source_file: null,
    audio_slots: [],
    is_preview: false,
    is_intro: false,
    position: 0,
    drip_days_override: null,
    status: "published",
    publish_at: null,
    doctor_callout: false,
    quiz_key: null,
    created_at: T0,
    updated_at: T0,
    ...overrides,
  };
}

export function makeStep(overrides: Partial<ActionStep> = {}): ActionStep {
  const id = overrides.id ?? nextId("step");
  return {
    id,
    lesson_id: overrides.lesson_id ?? "lesson-1",
    course_id: COURSE_ID,
    label: `Step ${id}`,
    source_label: `Step ${id}`,
    kind: "consumption",
    xp: 10,
    requires_upload: false,
    upload_type: null,
    link: { type: "none" },
    position: 0,
    sub_items: null,
    created_at: T0,
    ...overrides,
  };
}

export function makeResource(overrides: Partial<LessonResource> = {}): LessonResource {
  const id = overrides.id ?? nextId("res");
  return {
    id,
    course_id: COURSE_ID,
    lesson_id: null,
    module_id: null,
    file_path: `courses/baby-steps/${id}.pdf`,
    label: `Resource ${id}`,
    file_name: `${id}.pdf`,
    type: "pdf",
    size_bytes: 1024,
    position: 0,
    created_at: T0,
    ...overrides,
  };
}

export function makeTreeLesson(overrides: Partial<Lesson> & { action_steps?: ActionStep[]; resources?: LessonResource[] } = {}): TreeLesson {
  const { action_steps, resources, ...rest } = overrides;
  const lesson = makeLesson(rest);
  return { ...lesson, action_steps: action_steps ?? [], resources: resources ?? [] };
}

export function makeTreeModule(overrides: Partial<Module> & { lessons?: TreeLesson[]; resources?: LessonResource[] } = {}): TreeModule {
  const { lessons, resources, ...rest } = overrides;
  const mod = makeModule(rest);
  return { ...mod, lessons: lessons ?? [], resources: resources ?? [] };
}

export function makeTree(overrides: { course?: Partial<Course>; modules?: TreeModule[] } = {}): CourseTree {
  return { course: makeCourse(overrides.course), modules: overrides.modules ?? [] };
}

export function makeEnrollment(overrides: Partial<Enrollment> = {}): Enrollment {
  return {
    id: overrides.id ?? nextId("enr"),
    user_id: "user-1",
    course_id: COURSE_ID,
    source: "purchase",
    order_id: null,
    subscription_id: null,
    started_at: STARTED_AT,
    expires_at: null,
    status: "active",
    unlock_all: false,
    partner_invites_remaining: 1,
    created_at: STARTED_AT,
    updated_at: STARTED_AT,
    ...overrides,
  };
}

export function makeProduct(overrides: Partial<Product> = {}): Product {
  const id = overrides.id ?? nextId("prod");
  return {
    id,
    type: "course",
    slug: id,
    title: `Product ${id}`,
    description: "",
    course_ids: [COURSE_ID],
    grants_all_courses: false,
    price_cents: 19700,
    sale_price_cents: null,
    sale_ends_at: null,
    currency: "USD",
    interval: null,
    installments: null,
    stripe_product_id: null,
    stripe_price_id: null,
    stripe_sale_price_id: null,
    active: true,
    is_free: false,
    created_at: T0,
    updated_at: T0,
    ...overrides,
  };
}

export function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    id: overrides.id ?? nextId("coupon"),
    code: "WELCOME10",
    kind: "percent",
    amount: 10,
    expires_at: null,
    max_uses: null,
    uses: 0,
    product_ids: [],
    stripe_coupon_id: null,
    stripe_promotion_code_id: null,
    active: true,
    created_at: T0,
    ...overrides,
  };
}

export function makeSubscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: overrides.id ?? nextId("sub"),
    user_id: "user-1",
    product_id: "prod-all-access",
    provider_subscription_id: null,
    status: "active",
    current_period_end: daysAfter(NOW, 20).toISOString(),
    cancel_at_period_end: false,
    created_at: T0,
    updated_at: T0,
    ...overrides,
  };
}

export function makeProgressRow(lessonId: string, completed = true, overrides: Partial<LessonProgress> = {}): LessonProgress {
  return {
    id: nextId("progress"),
    user_id: "user-1",
    lesson_id: lessonId,
    course_id: COURSE_ID,
    completed_at: completed ? "2026-10-05T10:00:00.000Z" : null,
    last_position_sec: 0,
    watched_sec: 0,
    updated_at: "2026-10-05T10:00:00.000Z",
    ...overrides,
  };
}

export function makeXpEntry(overrides: Partial<XpEntry> = {}): XpEntry {
  return {
    id: overrides.id ?? nextId("xp"),
    user_id: "user-1",
    course_id: COURSE_ID,
    amount: 10,
    reason: "action_step",
    ref_id: null,
    note: null,
    created_at: T0,
    ...overrides,
  };
}

export function makeStreak(overrides: Partial<Streak> = {}): Streak {
  return {
    id: overrides.id ?? nextId("streak"),
    user_id: "user-1",
    current: 1,
    longest: 1,
    last_active_date: "2026-10-09",
    updated_at: T0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// The course tree with the sheet's XP numbers
// ---------------------------------------------------------------------------

export interface ModuleSpec {
  code: string;
  kind: Module["kind"];
  position: number;
  drip_days: number;
  completion_xp: number;
  required: boolean;
  /** step XP per lesson, in order (lesson 0 is the MxT0 intro) */
  lessonXp: number[];
}

/**
 * Module shape from the Baby Steps sheet: M1 460, M2 690, M3 510, M4 600,
 * M5 600, M6 530, M7 530, Bonus 50, Replay 50, Course Home 65 → 4085 XP.
 */
export const SHEET_MODULES: ModuleSpec[] = [
  { code: "M0", kind: "home", position: 0, drip_days: 0, completion_xp: 5, required: true, lessonXp: [60] },
  { code: "M1", kind: "core", position: 1, drip_days: 0, completion_xp: 10, required: true, lessonXp: [75, 75, 75, 75, 75, 75] },
  { code: "M2", kind: "core", position: 2, drip_days: 7, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 80, 80, 80, 80, 60, 60] },
  { code: "M3", kind: "core", position: 3, drip_days: 14, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 80, 60, 60, 60] },
  { code: "M4", kind: "core", position: 4, drip_days: 21, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 80, 70, 70, 70, 60] },
  { code: "M5", kind: "core", position: 5, drip_days: 28, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 80, 70, 70, 70, 60] },
  { code: "M6", kind: "core", position: 6, drip_days: 35, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 70, 70, 70, 70] },
  { code: "M7", kind: "core", position: 7, drip_days: 42, completion_xp: 10, required: true, lessonXp: [80, 80, 80, 70, 70, 70, 70] },
  { code: "BONUS", kind: "bonus", position: 8, drip_days: 0, completion_xp: 0, required: false, lessonXp: [20, 10, 10, 10] },
  { code: "REPLAY", kind: "replay", position: 9, drip_days: 0, completion_xp: 0, required: false, lessonXp: [25, 25] },
];

export const SHEET_XP_BY_MODULE: Record<string, number> = {
  M0: 65,
  M1: 460,
  M2: 690,
  M3: 510,
  M4: 600,
  M5: 600,
  M6: 530,
  M7: 530,
  BONUS: 50,
  REPLAY: 50,
};
export const SHEET_TOTAL_XP = 4085;

/** The Course Home "Complete Pre-Actions" step: 60 XP split 10 / 10 / 40 across three sub items. */
export function makePreActionsStep(lessonId: string): ActionStep {
  return makeStep({
    id: `${lessonId}-pre-actions`,
    lesson_id: lessonId,
    label: "Complete Pre-Actions",
    kind: "implementation",
    xp: 60,
    sub_items: [
      { key: "introduce", label: "Introduce yourself in the private group", xp: 10 },
      { key: "whitelist", label: "Whitelist support@cradleyourcravings.com", xp: 10 },
      { key: "survey", label: "Complete the pre-course survey", xp: 40 },
    ],
  });
}

/** Steps summing to `xp`: a 50 XP consumption step plus the remainder as an implementation step. */
export function stepsForXp(xp: number, lessonId: string): ActionStep[] {
  if (xp > 50) {
    return [
      makeStep({ id: `${lessonId}-s0`, lesson_id: lessonId, xp: 50, position: 0, kind: "consumption" }),
      makeStep({ id: `${lessonId}-s1`, lesson_id: lessonId, xp: xp - 50, position: 1, kind: "implementation" }),
    ];
  }
  return [makeStep({ id: `${lessonId}-s0`, lesson_id: lessonId, xp, position: 0 })];
}

export function makeSheetTree(courseOverrides: Partial<Course> = {}): CourseTree {
  const modules: TreeModule[] = SHEET_MODULES.map((spec) => {
    const moduleId = `mod-${spec.code}`;
    const lessons = spec.lessonXp.map((xp, i) => {
      const lessonId = `${spec.code}T${i}`;
      const steps = spec.code === "M0" ? [makePreActionsStep(lessonId)] : stepsForXp(xp, lessonId);
      return makeTreeLesson({ id: lessonId, code: lessonId, module_id: moduleId, position: i, is_intro: i === 0 && spec.kind === "core", action_steps: steps });
    });
    return makeTreeModule({
      id: moduleId,
      code: spec.code,
      kind: spec.kind,
      position: spec.position,
      drip_days: spec.drip_days,
      completion_xp: spec.completion_xp,
      required_for_certificate: spec.required,
      lessons,
    });
  });
  return makeTree({ course: courseOverrides, modules });
}

/** Progress rows completing every lesson in the modules that pass `filter` (default: all). */
export function completeModules(tree: CourseTree, filter: (m: TreeModule) => boolean = () => true): LessonProgress[] {
  return tree.modules.filter(filter).flatMap((m) => m.lessons.map((l) => makeProgressRow(l.id)));
}

export function completeLessons(tree: CourseTree, lessonIds: string[]): LessonProgress[] {
  const wanted = new Set(lessonIds);
  return tree.modules.flatMap((m) => m.lessons.filter((l) => wanted.has(l.id)).map((l) => makeProgressRow(l.id)));
}

export function moduleByCode(tree: CourseTree, code: string): TreeModule {
  const mod = tree.modules.find((m) => m.code === code);
  if (!mod) throw new Error(`No module ${code} in fixture tree`);
  return mod;
}

/** Turns an importer package (no ids) into a CourseTree with deterministic ids. */
export function treeFromPackage(pkg: CoursePackage): CourseTree {
  const course = makeCourse({ ...pkg.course, id: COURSE_ID, created_at: T0, updated_at: T0, last_updated_at: T0 });
  const modules: TreeModule[] = pkg.modules.map((m) => {
    const moduleId = `mod-${m.code}`;
    const lessons: TreeLesson[] = m.lessons.map((l) => {
      const { resources, action_steps, ...lessonRest } = l;
      const lessonId = `lesson-${l.code}`;
      return {
        ...lessonRest,
        id: lessonId,
        module_id: moduleId,
        course_id: COURSE_ID,
        created_at: T0,
        updated_at: T0,
        resources: resources.map((r, i) => ({ ...r, id: `${lessonId}-r${i}`, course_id: COURSE_ID, lesson_id: lessonId, module_id: null, created_at: T0 })),
        action_steps: action_steps.map((s, i) => ({ ...s, id: `${lessonId}-s${i}`, lesson_id: lessonId, course_id: COURSE_ID, created_at: T0 })),
      };
    });
    const { resources, lessons: _lessons, ...moduleRest } = m;
    void _lessons;
    return {
      ...moduleRest,
      id: moduleId,
      course_id: COURSE_ID,
      created_at: T0,
      updated_at: T0,
      lessons,
      resources: resources.map((r, i) => ({ ...r, id: `${moduleId}-r${i}`, course_id: COURSE_ID, lesson_id: null, module_id: moduleId, created_at: T0 })),
    };
  });
  return { course, modules };
}

// ---------------------------------------------------------------------------
// Quizzes (shapes mirror the real forms)
// ---------------------------------------------------------------------------

const SECTION_BANDS = [
  { min: 5, max: 9, label: "seedling", text: "a pillar to strengthen first" },
  { min: 10, max: 14, label: "growing", text: "real habits are there" },
  { min: 15, max: 20, label: "rooted", text: "a strength you can lean on" },
];

export const WELLNESS_SECTIONS = ["nutrition", "movement", "stress", "toxins", "connection"] as const;

/** 25 scale questions (1–4) in five sections of five, plus two short answers. */
export function makeWellnessQuiz(): QuizDefinition {
  const questions: QuizQuestion[] = [];
  let n = 0;
  for (const section of WELLNESS_SECTIONS) {
    for (let i = 0; i < 5; i++) {
      n += 1;
      questions.push({ key: `q${n}`, type: "scale", text: `${section} ${i + 1}`, min: 1, max: 4, labels: ["Rarely", "Sometimes", "Often", "Always"], section });
    }
  }
  questions.push({ key: "strongest", type: "short", text: "Your strongest pillar", required: false, section: "baseline" });
  questions.push({ key: "neglected", type: "short", text: "Your most neglected pillar", required: false, section: "baseline" });
  return {
    id: "quiz-wellness",
    key: "wellness-quiz",
    course_id: COURSE_ID,
    title: "Family Wellness Quiz",
    intro: "",
    questions,
    scoring: { kind: "sum", sections: WELLNESS_SECTIONS.map((key) => ({ key, label: key, bands: SECTION_BANDS })) },
    confirmation: "Thank you.",
    source_file: null,
  };
}

/** 11 scale questions (0–3), one yes/no worth 3 and a required=false choice; bands 0–8 / 9–18 / 19–36. */
export function makeSensitivityQuiz(): QuizDefinition {
  const questions: QuizQuestion[] = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({ key: `q${i}`, type: "scale", text: `symptom ${i}`, min: 0, max: 3, labels: ["Never", "Sometimes", "Often", "Daily"], section: "symptoms" });
  }
  questions.push({ key: "q11", type: "yesno", text: "A first-degree relative with celiac disease, IBD or a food allergy", yes_value: 3, section: "symptoms" });
  questions.push({ key: "q12", type: "scale", text: "Symptoms improve when I skip a particular food", min: 0, max: 3, labels: ["Never", "Sometimes", "Often", "Daily"], section: "symptoms" });
  questions.push({ key: "suspect_food", type: "choice", text: "My suspect food (one only)", options: ["gluten", "dairy", "eggs", "other"], required: false, section: "suspect" });
  return {
    id: "quiz-sensitivity",
    key: "sensitivity-quiz",
    course_id: COURSE_ID,
    title: "Sensitivity Quiz",
    intro: "",
    questions,
    scoring: {
      kind: "sum",
      bands: [
        { min: 0, max: 8, label: "low likelihood of a food driver", text: "look at sleep, stress and sugar first" },
        { min: 9, max: 18, label: "keep the diary", text: "keep the diary for a week" },
        { min: 19, max: 36, label: "see your doctor", text: "keep the diary and see your doctor before any elimination" },
      ],
    },
    confirmation: "Thank you.",
    source_file: null,
  };
}

/** Unscored survey: four required paragraphs, one optional, one required choice. */
export function makeSurvey(): QuizDefinition {
  return {
    id: "quiz-survey",
    key: "pre-course-survey",
    course_id: COURSE_ID,
    title: "Baby Steps Pre-Course Survey",
    intro: "",
    questions: [
      { key: "a", type: "paragraph", text: "What is your BIG WHY?", required: true },
      { key: "b", type: "paragraph", text: "What support do you currently have?", required: true },
      { key: "c", type: "paragraph", text: "What are your heartfelt goals?", required: true },
      { key: "d", type: "paragraph", text: "What will you DO, BE and CHANGE?", required: true },
      { key: "e", type: "paragraph", text: "Anything for Cynthia to know?", required: false },
      { key: "f", type: "choice", text: "Are you completing the course with a partner?", options: ["Yes, together", "Yes, but they are less involved", "No, on my own", "Other"], required: true },
    ],
    scoring: { kind: "none" },
    confirmation: "Thank you.",
    source_file: null,
  };
}
