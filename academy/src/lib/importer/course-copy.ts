import { site } from "@/lib/config/site";
import type { CoursePackage } from "@/lib/types";

/**
 * Everything the course package needs that is NOT in the spreadsheet:
 * verbatim text lifted from the Welcome Guide, plus the small amount of fresh
 * marketing copy the catalogue needs (marked FRESH). Keep this file the only
 * place such copy lives so it is easy to review with Cynthia.
 */

export const DEFAULT_COURSE_SLUG = "baby-steps";
export const COURSE_TITLE = "Baby Steps: Your Health Journey Toward Conception";
/** FRESH marketing line. */
export const COURSE_SUBTITLE =
  "A 12-week, science-backed, heart-led journey of small steps for couples and individuals preparing for conception.";

/** Course Home lesson (the sheet's Course Home row has no training name). Description is FRESH. */
export const HOME_LESSON = {
  title: "Welcome to Baby Steps",
  description: "Welcome video from Cynthia + pre-course survey",
} as const;

export const INTRO_LESSON_TITLE = "Module introduction";
export const BONUS_MODULE_TITLE = "Bonuses";
export const REPLAY_MODULE_TITLE = "Replays";

/** Used when neither the sheet nor the transcript header states a runtime. */
export const FALLBACK_DURATION_SEC = 180;

export const PRE_ACTIONS_STEP_LABEL = "Complete Pre-Actions";

/** Verbatim from Welcome_Guide.pdf, "Before you begin: three pre-actions (60 XP)". */
export const PRE_ACTION_SUB_ITEMS: Array<{ key: string; label: string; xp: number }> = [
  {
    key: "introduce",
    label:
      "Introduce yourself in the private Facebook group: who you are, where you're starting, and one hope for this journey",
    xp: 10,
  },
  {
    key: "whitelist",
    label: "Whitelist support@cradleyourcravings.com in your email contacts so lesson reminders and replies reach you",
    xp: 10,
  },
  {
    key: "survey",
    label:
      "Complete the pre-course survey — four questions: your BIG WHY, your current support, your heartfelt goals, and what you will do, be and change to reach them",
    xp: 40,
  },
];

/** Lessons that carry a native form even when no action step links to it (M2T4 keeps its "Add 1 Probiotic Food" step as-is). */
export const LESSON_QUIZ_KEYS: Record<string, string> = {
  M0: "pre-course-survey",
  M1T1: "wellness-quiz",
  M2T4: "gut-health-quiz",
  M2T6: "sensitivity-quiz",
  M7T5: "pre-course-survey",
};

export const DOCTOR_CALLOUT_CODES = ["M2T6", "M2T7", "M4T5", "M7T3"];
export const PREVIEW_LESSON_CODES = ["M0", "M1T1"];

/** Verbatim from Welcome_Guide.pdf, "A note from Cynthia". */
export const WELCOME_NOTE_FROM_CYNTHIA =
  "Welcome. Whether you arrived here full of hope, worn down by waiting, or somewhere in between, you are in the right place. This course is built on three promises: science-backed (every claim is tied to a named source), heart-led (grace over guilt, always), and baby steps (small, repeatable actions rather than grand overhauls). You do not have to be perfect here. You have to keep showing up.";

export interface CourseCopyInput {
  slug: string;
  /** Course Home SHORT DESCRIPTION, verbatim. */
  homeShortDescription: string;
  /** M1..M7 in order: verbatim titles and SHORT DESCRIPTIONs. */
  coreModules: Array<{ code: string; title: string; description: string; drip_days: number }>;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function buildCourseRecord(input: CourseCopyInput): CoursePackage["course"] {
  const titles = input.coreModules.map((m) => m.title);
  // FRESH paragraph; module titles are verbatim from the sheet.
  const overview = `Over twelve weeks you will move through seven modules — ${joinList(titles)} — followed by two bonus trainings and two group-coaching replays. Each training pairs a short video from Cynthia with a downloadable resource and a few small action steps, so you can practise rather than just watch.`;
  const dripList = input.coreModules
    .map((m) => `${m.title} ${m.drip_days === 0 ? "opens the day you enrol" : `opens after ${m.drip_days} days`}`)
    .join("; ");

  return {
    slug: input.slug,
    title: COURSE_TITLE,
    subtitle: COURSE_SUBTITLE,
    description: `${WELCOME_NOTE_FROM_CYNTHIA}\n\n${overview}`,
    short_description: input.homeShortDescription,
    thumbnail_path: null,
    illustration: "family",
    status: "published",
    publish_at: null,
    level: "All levels",
    language: "English",
    topics: ["nutrition", "movement", "stress", "detox", "relationships", "cravings"],
    badge: "new",
    partner_seat_enabled: true,
    certificate_enabled: true,
    lifetime_access: true,
    access_days: null,
    what_you_learn: input.coreModules.map((m) => m.description),
    // FRESH, supported by the Welcome Guide's "What to have on hand".
    requirements: [
      "A notebook or journal (paper or digital)",
      "A water bottle you like",
      "Thirty quiet minutes, two or three times a week",
      "If you have a partner, an agreed 15-minute check-in slot each week (optional)",
    ],
    // FRESH, supported by the course materials.
    who_for: [
      "Couples and individuals preparing for conception",
      "Anyone tired of waiting who would rather spend the months before a pregnancy preparing",
      "Solo learners — partner exercises include a solo version",
      "Partners who want to be involved, with their own seat and progress",
    ],
    // FRESH; answers only make claims the materials support. Refund window is a placeholder (site.refundDays).
    faq: [
      {
        q: "Do I need my partner to take the course?",
        a: "No. Baby Steps is written for couples and for individuals: partner exercises include a solo version, and if you do have a partner they can join with the partner seat included in your enrolment.",
      },
      {
        q: "Is this medical advice?",
        a: "No. The course is educational and is not medical advice, diagnosis or treatment. Please involve your doctor, midwife or a registered dietitian before changing supplements, starting an elimination diet, beginning a new exercise programme or trying any detox practice.",
      },
      {
        q: "When do the modules open?",
        a: `The modules open one at a time over about 12 weeks so you have time to practise: ${dripList}. Bonuses and replays are available from day one.`,
      },
      {
        q: "What if I'm already pregnant or in fertility treatment?",
        a: "You are welcome here, and the course stays educational rather than medical care. Please talk with your doctor or clinic before changing your diet, supplements, exercise or detox practices, and follow their guidance first.",
      },
      {
        q: "How long do I have access?",
        a: "Lifetime access is included: you can return to any training, resource or replay whenever you like.",
      },
      {
        q: "What is the refund policy?",
        a: `If Baby Steps isn't right for you, email ${site.supportEmail} within ${site.refundDays} days of purchase for a full refund.`,
      },
    ],
    duration_weeks: 12,
  };
}

/** FRESH one-line descriptions for the forum categories (UI copy, not course content). */
export const FORUM_CATEGORY_COPY = {
  general: { title: "General", description: "Questions, encouragement and conversation that belong to the whole journey." },
  introductions: {
    title: "Introductions",
    description: "Say hello: who you are, where you're starting, and one hope for this journey.",
  },
  module: (title: string) => `Shares, questions and action-step posts for ${title}.`,
  bonuses: { title: "Bonuses", description: "Conversation about A Dozen Habits and THE FIX for Cravings." },
  replays: { title: "Replays", description: "Insights and questions from the group coaching replays." },
  alumni: { title: "Alumni Group", description: "For learners who have completed the course and want to keep going together." },
} as const;
