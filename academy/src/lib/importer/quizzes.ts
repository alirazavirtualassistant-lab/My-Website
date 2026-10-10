import type { QuizDefinition, QuizQuestion } from "@/lib/types";

/**
 * Native in-app forms, transcribed VERBATIM from the course PDFs (the sheet's
 * forms.gle placeholders are replaced by these). Question and band texts are
 * the PDF's words; `source_file` is package-relative and is prefixed with the
 * course slug by the importer so it matches the resource's storage path.
 *
 * Fresh (non-PDF) text is limited to the confirmation lines of the two
 * Module 2 quizzes, which have no Google-Form build sheet in the PDFs.
 */

export type QuizSeed = Omit<QuizDefinition, "id" | "course_id">;

const SCALE_1_4 = ["1 = rarely or never", "2 = sometimes", "3 = most days", "4 = nearly always"];
const SCALE_0_3 = ["0 = never", "1 = sometimes", "2 = often", "3 = most days"];

const PILLAR_BANDS = [
  { min: 5, max: 9, label: "seedling", text: "this is a pillar to strengthen first; the module for it will feel like relief" },
  { min: 10, max: 14, label: "growing", text: "real habits are there; consistency is the work" },
  { min: 15, max: 20, label: "rooted", text: "a strength you can lean on and share" },
];

function scale(key: string, text: string, section: string, labels = SCALE_1_4, min = 1, max = 4): QuizQuestion {
  return { key, type: "scale", text, min, max, labels, section };
}

const WELLNESS_SECTIONS: Array<{ key: string; label: string; items: string[] }> = [
  {
    key: "nutrition",
    label: "Nutrition",
    items: [
      "I ate vegetables at two or more meals a day",
      "I ate protein (eggs, fish, beans, lentils, meat, dairy, nuts) at breakfast",
      "I went a whole day without sugary drinks (soda, sweet coffee, juice, energy drinks)",
      "My energy stayed steady through the afternoon",
      "I felt in charge of my food choices rather than pulled by cravings",
    ],
  },
  {
    key: "movement",
    label: "Movement",
    items: [
      "I walked or moved for at least 20 minutes",
      "I did something that gently challenged my muscles (stairs, carrying, squats, yoga)",
      "I stood up and moved at least once every hour I was sitting",
      "Movement felt like something I enjoyed rather than a punishment",
      "I stopped exercising before I felt exhausted or depleted",
    ],
  },
  {
    key: "stress",
    label: "Stress and sleep",
    items: [
      "I slept 7–9 hours",
      "I had at least 10 minutes of quiet, screen-free time each day",
      "I could name what I was feeling instead of just feeling \"stressed\"",
      "I fell asleep within about 30 minutes of turning the light off",
      "I felt hopeful more often than anxious about conception",
    ],
  },
  {
    key: "toxins",
    label: "Toxins and environment",
    items: [
      "I stored and reheated food in glass or steel rather than plastic",
      "I read the ingredient list of at least one personal-care or cleaning product",
      "I drank filtered water or knew what was in my tap water",
      "I opened windows or otherwise aired my home",
      "I avoided smoking, vaping and second-hand smoke; alcohol was minimal or none",
    ],
  },
  {
    key: "connection",
    label: "Connection",
    items: [
      "I talked with my partner or support person about how I'm really doing",
      "I felt listened to without being fixed or judged",
      "We shared at least one meal a day without screens",
      "I asked for help when I needed it",
      "I felt we were on the same team about this journey",
    ],
  },
];

let wellnessIndex = 0;
const wellnessQuestions: QuizQuestion[] = WELLNESS_SECTIONS.flatMap((s) =>
  s.items.map((text) => scale(`q${++wellnessIndex}`, text, s.key)),
);

export const WELLNESS_QUIZ: QuizSeed = {
  key: "wellness-quiz",
  title: "Family Wellness Quiz",
  intro:
    "This is a starting line, not a grade. Answer honestly for the last two weeks, not your best week ever. If you have a partner, each of you completes your own copy; compare afterwards and notice where you are strong for each other.\n\nScoring: 1 = rarely or never · 2 = sometimes · 3 = most days · 4 = nearly always",
  questions: [
    ...wellnessQuestions,
    { key: "strongest", type: "short", text: "Your strongest pillar", required: false, section: "baseline" },
    { key: "neglected", type: "short", text: "Your most neglected pillar", required: false, section: "baseline" },
  ],
  scoring: {
    kind: "sum",
    sections: WELLNESS_SECTIONS.map((s) => ({ key: s.key, label: s.label, bands: PILLAR_BANDS })),
  },
  confirmation:
    "Your baseline is saved. Mark the Wellness Quiz complete in the course for 50 XP, then journal your baseline for 30 XP.",
  source_file: "01_Module_1_Foundations_of_Family_Wellness/Resources/M1T1_Self-Assessment.pdf",
};

const GUT_ITEMS = [
  "Bloating or a distended belly after meals",
  "Bowel movements slower than once a day, or straining",
  "Loose or urgent bowel movements",
  "Reflux, heartburn or burping",
  "Strong sugar or refined-carbohydrate cravings",
  "Tiredness or fog within an hour of eating",
  "Skin flare-ups (acne, eczema, rashes)",
  "Frequent colds or slow recovery",
  "Gas that is frequent or uncomfortable",
  "Low mood or irritability that tracks with digestion",
  "Antibiotic courses in the last year (0 = none, 1 = one, 2 = two, 3 = three+)",
  "Fewer than 15 different plant foods in a typical week",
];

export const GUT_HEALTH_QUIZ: QuizSeed = {
  key: "gut-health-quiz",
  title: "Gut Health Quiz",
  intro:
    "Symptom quiz (take it before you change anything; 40 XP with the food add)\n\nFor the last month: 0 = never · 1 = sometimes · 2 = often · 3 = most days\n\nNot a diagnosis. See your doctor promptly for: blood in stool, unexplained weight loss, severe or persistent pain, symptoms that are worsening, or a family history of bowel disease or celiac disease.",
  questions: GUT_ITEMS.map((text, i) =>
    scale(`q${i + 1}`, text, "symptoms", i === 10 ? ["0 = none", "1 = one", "2 = two", "3 = three+"] : SCALE_0_3, 0, 3),
  ),
  scoring: {
    kind: "sum",
    bands: [
      { min: 0, max: 8, label: "settled", text: "maintain: variety and one fermented food" },
      { min: 9, max: 18, label: "unsettled", text: "this module's practice will likely help; track for two weeks" },
      { min: 19, max: 36, label: "strained", text: "do the practice and book a conversation with your doctor" },
    ],
  },
  // Fresh line (the PDF has no form confirmation); grounded in its "re-take the quiz in two weeks and compare" instruction.
  confirmation:
    "Your answers are saved. Add one probiotic food this week, keep the 7-day digestion journal, and re-take the quiz in two weeks to compare.",
  source_file: "02_Module_2_Nutrition_for_Optimal_Fertility/Resources/M2T4_Gut_Health_Quiz.pdf",
};

const SENSITIVITY_ITEMS = [
  "Bloating, cramping or gas within 2–3 hours of eating",
  "Diarrhoea, constipation or alternating",
  "Reflux or nausea after certain meals",
  "Fatigue or brain fog after eating",
  "Headaches or migraines that seem food-linked",
  "Skin: eczema, hives, itching, acne flares",
  "Mouth ulcers, or tingling of lips/mouth after eating",
  "Joint aches or stiffness without injury",
  "Unexplained iron deficiency, anaemia or low vitamin D",
  "Irregular cycles, or unexplained fertility difficulty",
];

export const SENSITIVITY_QUIZ: QuizSeed = {
  key: "sensitivity-quiz",
  title: "Sensitivity Quiz",
  intro:
    "For the last month: 0 = never · 1 = sometimes · 2 = often · 3 = most days\n\nAny \"yes\" on item 7 with swelling or breathing difficulty is an allergy warning: see a doctor urgently and do not self-test.",
  questions: [
    ...SENSITIVITY_ITEMS.map((text, i) => scale(`q${i + 1}`, text, "symptoms", SCALE_0_3, 0, 3)),
    {
      key: "q11",
      type: "yesno",
      text: "A first-degree relative with celiac disease, IBD or food allergy",
      yes_value: 3,
      section: "symptoms",
    },
    scale("q12", "Symptoms improve when I skip a particular food", "symptoms", SCALE_0_3, 0, 3),
    {
      key: "suspect_food",
      type: "choice",
      text: "My suspect food (one only)",
      options: [
        "gluten (doctor + celiac test first)",
        "dairy",
        "eggs",
        "soy",
        "corn",
        "high-FODMAP foods (with a dietitian)",
        "added sugar",
        "alcohol",
        "caffeine",
        "other",
      ],
      required: false,
      section: "suspect",
    },
  ],
  scoring: {
    kind: "sum",
    bands: [
      { min: 0, max: 8, label: "low likelihood of a food driver", text: "look at sleep, stress and sugar first" },
      { min: 9, max: 18, label: "keep the diary", text: "keep the diary for a week; a single-food trial may be worthwhile" },
      { min: 19, max: 36, label: "see your doctor", text: "keep the diary and see your doctor before any elimination" },
    ],
  },
  // Fresh line (the PDF has no form confirmation); grounded in Parts 2 and 5 of the Elimination Guide.
  confirmation:
    "Your answers are saved. Keep the 7-day food and symptom diary before removing anything, and bring this page to your doctor conversation.",
  source_file: "02_Module_2_Nutrition_for_Optimal_Fertility/Resources/M2T6_Elimination_Guide.pdf",
};

export const PRE_COURSE_SURVEY: QuizSeed = {
  key: "pre-course-survey",
  title: "Baby Steps Pre-Course Survey",
  intro:
    "Before we begin, take five unhurried minutes to answer these four questions. There are no wrong answers. Your responses are private to Cynthia and the support team, and you will come back to them in Module 7 to see how far you have travelled.",
  questions: [
    {
      key: "a",
      type: "paragraph",
      text: "What is your BIG WHY for this conception journey? Write it the way you would say it to someone you trust.",
      required: true,
    },
    {
      key: "b",
      type: "paragraph",
      text: "What support do you currently have? (partner, family, friends, medical team, community, none yet)",
      required: true,
    },
    {
      key: "c",
      type: "paragraph",
      text: "What are your heartfelt goals for the next 90 days, for your body, your relationship and your home?",
      required: true,
    },
    {
      key: "d",
      type: "paragraph",
      text: "What will you DO, BE and CHANGE to accomplish them? (one line for each if it helps)",
      required: true,
    },
    {
      key: "e",
      type: "paragraph",
      text: "Is there anything you would like Cynthia to know before you start? (optional: health context, past attempts, worries)",
      required: false,
    },
    {
      key: "f",
      type: "choice",
      text: "Are you completing the course with a partner?",
      options: ["Yes, together", "Yes, but they are less involved", "No, on my own", "Other"],
      required: true,
    },
  ],
  scoring: { kind: "none" },
  confirmation:
    "Thank you. Your answers are saved. Mark \"Complete the pre-course survey\" as done in the course to claim your 40 XP, then open Module 1.",
  source_file: "00_Course_Home/Resources/Pre-Course_Survey_and_Welcome_Audio.pdf",
};

export const QUIZ_DEFINITIONS: QuizSeed[] = [WELLNESS_QUIZ, GUT_HEALTH_QUIZ, SENSITIVITY_QUIZ, PRE_COURSE_SURVEY];
