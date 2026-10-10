# Decisions log — Cradle Your Cravings Academy

Decisions made while building, so Cynthia and future developers know *why*
things are the way they are. Newest at the bottom of each section.

## Repository layout

- The platform lives in `academy/` as a standalone Next.js app. The existing
  static previews in `site/` (myersmorrison.com staging and the earlier
  Cradle Your Cravings brochure site) are left untouched; the GitHub Pages
  workflow still publishes `site/`. Vercel should be pointed at the
  `academy/` directory (Root Directory setting).
- The full course package from the zip is committed verbatim under
  `academy/content/source/Baby_Steps_Course/` (plus the original zip) so the
  importer can be re-run and the admin "bulk importer" can be demonstrated
  without external files. Script `.docx`/`.pdf` files are never served to
  learners; only `Resources/` files and `_teleprompter.txt` transcripts are.

## Stack

- Next.js 16.4 (App Router, Turbopack, React 19.3). Cache Components / PPR are
  turned off because almost every page is per-user. Pages render dynamically.
- Tailwind v4 with CSS-variable tokens (`src/app/globals.css`); shadcn-style
  primitives are hand-written on the `radix-ui` package because the shadcn
  registry was unreachable from the build network. Fonts are self-hosted via
  `@fontsource-variable` (Cormorant Garamond + Nunito Sans) so builds never
  depend on Google Fonts at build time.
- Every external dependency (Supabase, Stripe, Mux, Resend) sits behind an
  interface in `src/services/types.ts` with a mock adapter. The app runs fully
  in **demo mode** with no keys; switching `*_PROVIDER` env vars swaps adapters.
- Demo-mode data lives in a JSON file (`.data/store.json`) with write-behind
  persistence. On read-only hosts (serverless) it degrades to in-memory state.
  Demo mode is for evaluation and local development, not production.

## Content modelling

- The spreadsheet is the source of truth; the Welcome Guide and resource PDFs
  fill in what the sheet references but does not contain (pre-actions, quiz
  questions).
- Each core module starts with its `MxT0` script as a lesson titled
  "Module introduction". The brief suggested a 3-minute estimate because the
  sheet has no row for it; the scripts themselves declare "5 MIN", so the
  importer uses the script's stated runtime (editable in admin).
- "Course Home" is module `M0` with one lesson, "Welcome to Baby Steps". Its
  60-XP "Complete Pre-Actions" step is modelled with the three sub-items from
  the Welcome Guide (10 + 10 + 40 XP). The 5 XP on the Course Home row is the
  module-completion bonus for M0.
- Bonuses and Replays are two extra modules after Module 7, unlocked
  immediately and optional for the certificate. THE FIX for Cravings keeps its
  three sessions as separate lessons grouped under the series label.
- The THE FIX "Session Summaries" audio script is not a lesson; its text is
  appended to the Session 3 transcript under its own heading, and Session 3
  has an audio slot for `session summaries.mp3`.
- Placeholder links in the sheet (`forms.gle/*`, `youtube.com/*`,
  `facebook.com/groups/*`) are stripped from labels and never rendered. The
  Wellness Quiz, Gut Health Quiz, Sensitivity Quiz and Pre-Course Survey are
  native forms transcribed verbatim from the PDFs. "Introduce yourself in the
  private Facebook group" is kept as a checklist item and points to the
  in-app Introductions forum category until Cynthia confirms the group URL.
- Resource attachment rule: the sheet's RESOURCES cell wins; otherwise the
  file's `MxTy_` prefix; files referenced only by a module row (or by nothing)
  are module-level. All 54 learner files attach at least once; the importer
  fails otherwise.
- XP totals are computed from per-training values (4,085 XP incl. module
  bonuses and pre-actions). The Welcome Guide's "course goals" (50/100/150 XP)
  are implemented as milestone badges awarded on completing M1, M1–M4 and
  M1–M7. Levels: Seedling 0, Sprout 1,000, Bloom 2,500, Harvest 4,000.
- A lesson is "complete" when the learner marks it complete; XP comes from
  action steps. The certificate requires every lesson in M0–M7 to be complete.

## Commerce

- Prices are placeholders in `src/lib/config/site.ts` marked
  `CONFIRM WITH CYNTHIA`. Real prices live in Stripe; `scripts/stripe-setup.ts`
  creates test-mode products and the admin UI can edit them.
- Enrollments are created only by the fulfilment use case, which is driven by
  webhooks. The mock checkout posts to a mock webhook route that goes through
  the same code path, so demo mode exercises the real logic.
- Partner seat: each Baby Steps purchase includes one partner invite. The
  partner gets their own account, enrollment (`source = partner`) and progress,
  sharing a "couple space" page for partner exercises.
- Refunds (Stripe `charge.refunded`, full) revoke the enrollment and any
  partner enrollment that came with it.

## Trust and privacy

- Quiz/survey answers, journals, notes and uploads are private to the learner.
  Admin screens show completion status only. The Privacy Policy placeholder
  states this.
- The medical disclaimer is a config value, shown on course pages, checkout
  and the footer, and accepted once (stored on the profile) before the first
  lesson plays.
- All legal text is placeholder and tagged `[LEGAL REVIEW NEEDED]`.
