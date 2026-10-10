/**
 * Single source of truth for brand + commercial configuration.
 * Anything marked CONFIRM WITH CYNTHIA is a placeholder she sets before launch.
 */
export const site = {
  name: "Cradle Your Cravings Academy", // CONFIRM WITH CYNTHIA — site title
  brand: "Cradle Your Cravings",
  tagline: "Science-backed. Heart-led. One baby step at a time.",
  description:
    "Online courses by Cynthia Myers Morrison, EdD. Prepare for conception and family wellness with small, repeatable steps grounded in named sources and delivered with grace over guilt.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: "support@cradleyourcravings.com", // CONFIRM WITH CYNTHIA
  adminNotificationEmail:
    process.env.ADMIN_NOTIFICATION_EMAIL ?? "support@cradleyourcravings.com", // CONFIRM WITH CYNTHIA
  fromEmail: process.env.EMAIL_FROM ?? "Cradle Your Cravings <hello@cradleyourcravings.com>", // CONFIRM WITH CYNTHIA
  mainSite: "https://www.myersmorrison.com",
  social: {
    linkedin: "https://www.linkedin.com/in/cynthiamyersmorrison",
    instagram: "https://www.instagram.com/cindyjmm",
    facebook: "https://www.facebook.com/cynthia.myersmorrison",
  },
  instructor: {
    name: "Cynthia Myers Morrison, EdD",
    shortName: "Cynthia",
    credentials: "EdD, FAP, SUGAR™ C&L",
    title: "Food Addiction Professional, Author, Genogram Practitioner, Speaker",
    bio:
      "Cynthia Myers Morrison, EdD, is a food addiction professional with more than twenty-five years of experience and a doctorate in education. She walked her own road with food and cravings before helping others feel at home in their bodies again. She is the author of THE FIX for Cravings (with David Wolfe) and co-author of We Eat Rainbows and We Are 1 Family.",
    books: [
      { title: "THE FIX for Cravings", with: "David Wolfe" },
      { title: "We Eat Rainbows", with: "other Food Addiction Professionals" },
      { title: "We Are 1 Family", with: "Victoria Erynn" },
    ],
  },
  signatureQuote:
    "Your body is forgiving. It's been waiting for you to show up, not to be perfect.",
  promises: [
    {
      key: "science",
      title: "Science-backed",
      body: "Every claim is tied to a named source.",
    },
    {
      key: "heart",
      title: "Heart-led",
      body: "Grace over guilt, always.",
    },
    {
      key: "steps",
      title: "Baby steps",
      body: "Small, repeatable actions rather than grand overhauls.",
    },
  ],
  /** Topic filters used by the catalog. Courses are tagged with these keys. */
  topics: [
    { key: "nutrition", label: "Nutrition" },
    { key: "movement", label: "Movement" },
    { key: "stress", label: "Stress & Emotions" },
    { key: "detox", label: "Detox" },
    { key: "relationships", label: "Relationships" },
    { key: "cravings", label: "Cravings" },
  ] as const,
  levels: ["Beginner", "All levels", "Intermediate"] as const,
  refundDays: 14, // CONFIRM WITH CYNTHIA
  currency: "USD",
  /** Display-only currency conversion (USD base). Stripe charges in USD. */
  displayCurrencies: [
    { code: "USD", rate: 1, symbol: "$" },
    { code: "EUR", rate: 0.92, symbol: "€" }, // placeholder rates — display only
    { code: "GBP", rate: 0.79, symbol: "£" },
    { code: "CAD", rate: 1.36, symbol: "CA$" },
    { code: "AUD", rate: 1.52, symbol: "A$" },
  ],
  medicalDisclaimer:
    "This course is educational and is not medical advice, diagnosis, or treatment. Always consult your physician or a qualified healthcare provider before changing your diet, exercise, supplements, or fertility care.", // [LEGAL REVIEW NEEDED]
  analytics: {
    provider: (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none") as
      | "none"
      | "plausible"
      | "posthog",
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  },
} as const;

export type TopicKey = (typeof site.topics)[number]["key"];

/**
 * Commercial placeholders. All amounts are in cents (USD).
 * CONFIRM WITH CYNTHIA before launch. In Stripe mode, the real prices live in
 * Stripe and are mirrored into the products table by scripts/stripe-setup.ts.
 */
export const pricing = {
  babySteps: {
    oneTimeCents: 19700, // CONFIRM WITH CYNTHIA — $197
    saleCents: null as number | null, // e.g. 14700 for a launch sale
    saleEndsAt: null as string | null, // ISO date
    paymentPlan: { installments: 3, amountCents: 6900 }, // CONFIRM WITH CYNTHIA — 3 × $69
  },
  allAccess: {
    monthlyCents: 2900, // CONFIRM WITH CYNTHIA — $29/mo
    annualCents: 24900, // CONFIRM WITH CYNTHIA — $249/yr
  },
  bundles: [] as Array<{ slug: string; title: string; courseSlugs: string[]; cents: number }>,
} as const;

/** XP levels. Thresholds reflect the Baby Steps total of ~4,385 XP. */
export const xpLevels = [
  { key: "seedling", label: "Seedling", minXp: 0 },
  { key: "sprout", label: "Sprout", minXp: 1000 },
  { key: "bloom", label: "Bloom", minXp: 2500 },
  { key: "harvest", label: "Harvest", minXp: 4000 },
] as const;

export type LevelKey = (typeof xpLevels)[number]["key"];
