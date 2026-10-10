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

## Domain logic (drip, XP, streaks, quizzes, pricing)

- Drip boundary: content opens at exactly `started_at + N days` (inclusive);
  `expires_at` is exclusive. A revoked or expired enrollment stays locked even
  with `unlock_all`. "Opens today / tomorrow" wording uses calendar days in the
  learner's timezone when known (UTC otherwise).
- Step XP with sub-items: the step's XP is the inclusive total; each sub-item
  awards once (`ref_id = "<stepId>:<key>"`), the remainder awards when all
  sub-items are done. For the 60-XP pre-actions step (10 + 10 + 40) the
  remainder is zero.
- Only published lessons count for progress, ordering and certificate
  eligibility; scheduled lessons count once their publish date passes.
- Quiz scoring: scale and yes/no items are always required on summed quizzes;
  the Elimination Guide's family-history item scores 3 for "yes". Section
  scores exist for every section; the band texts are verbatim from the PDFs.
- Pricing: USD is exact; other display currencies round to whole units using
  the placeholder rates in `site.ts`. For payment plans `price_cents` is the
  per-instalment charge. Coupons never discount below zero.
- Access: subscription access is status-only (`active` or `trialing`);
  `past_due` is denied. A partner-seat learner cannot invite another partner.
- Level thresholds (Seedling 0 / Sprout 1,000 / Bloom 2,500 / Harvest 4,000)
  are set against 4,085 course XP plus 300 XP of course-goal bonuses.

## Database and RLS

- Enum-like columns are `text` with CHECK constraints; arrays are `text[]`;
  structured fields are `jsonb`. `quiz_responses` keeps retake history (the
  survey is revisited in Module 7).
- `handle_new_user()` never takes `role` from sign-up metadata; the first admin
  is created via `/admin/register` with the setup code (or by updating the
  row).
- Learners cannot write `xp_ledger`, `user_badges` or `streaks` directly (the
  server awards XP); forum reading requires an active enrollment in that
  course; billing, settings and team writes require the owner role
  (`admin`), while `assistant` can read everything and moderate content.
- Admins see `quiz_completion_status` (who completed what, when), never the
  answers; notes and learner uploads are invisible to admins by policy.
- Local validation: `scripts/db-check.ts` applies the migrations twice to a
  throwaway Postgres (with shims for `auth.uid()` and storage tables) and runs
  a 23-check RLS smoke test.

## Adapters

- Mock checkout sessions keep their amounts/mode as extra JSON only in mock
  mode; on Supabase the amounts come from the linked order.
- Stripe: promo-code entry and a server-applied coupon are mutually exclusive
  (Stripe rule); a coupon without a Stripe promotion code is applied as a
  one-off `amount_off` coupon equal to the server-side discount so Stripe
  charges exactly the quoted total. Stripe v23 field changes are handled
  (subscription period end from items, invoice subscription from `parent`).
- Mux playback tokens are RS256 JWTs valid for two hours; webhooks are
  verified with the `mux-signature` header (5-minute tolerance).
- `sendTemplate(name, to, props)` never throws; every email (mock or Resend)
  is recorded in `email_events`, and job emails carry a `job_key` so the daily
  cron is idempotent.

## App shell

- The root layout mounts the toaster, cookie consent, analytics loader and
  demo ribbon once; route-group layouts add only their header/shell.
- Error boundaries use Next 16's `retry`. The temporary UI showcase route used
  during the build was removed before the production build (it could not be
  prerendered).
- Admin pages live under the `src/app/admin/(panel)` route group so that
  `/admin/register` (first-admin bootstrap) stays outside the role gate.

## Learner experience

- The free-preview lessons (M0 and M1T1 by default) are public pages with the
  transcript and action steps but locked downloads; non-preview lessons are
  never rendered publicly.
- A locked lesson URL renders a "Module N opens on <date>" screen inside the
  player (not a 404) so the curriculum and unlock dates stay visible.
- Quizzes are routes (`/learn/<course>/<lesson>/quiz/<key>`) rather than
  modals: keyboard-native, deep-linkable, and comfortable for 27 questions.
- "Mark complete & continue" prefers the next lesson in order when it is
  unlocked and falls back to the first unlocked incomplete lesson.
- Sub-items of a step award XP individually; the step remainder awards when
  all sub-items are done. Un-ticking a step removes its XP.
- Notes are saved explicitly (Ctrl/⌘+Enter or the button) and can be exported
  as Markdown per course. Anonymous forum posts hide the author's name from
  members, never from moderators, and the UI says so.
- The disclaimer gate is shown once, before the first lesson, and stored on
  the profile.

## Commerce

- Quantity is always one per product at checkout (digital goods); a coupon that
  cannot be applied blocks checkout with a clear message rather than silently
  charging full price. The cart is cleared on the success page, which polls the
  order status briefly to cover the webhook-vs-redirect race.
- Gifts never enrol the buyer; the recipient redeems a token link on their own
  account. A partner invite is a token link too; the partner's drip clock is
  the owner's enrollment date so both see the same unlocks.
- The mock checkout page posts to a mock webhook that runs the same fulfilment
  code as Stripe; admin pages can also simulate refund and subscription events.

## Admin

- Admin pages live under the `(panel)` route group; `/admin/register` stays
  outside the role gate for first-admin bootstrap. Assistants see everything
  except Products, Coupons, Settings and Team.
- Uploads (video, captions, thumbnails, audio, resources, importer packages)
  go through route handlers, not Server Actions, to avoid the 1 MB action
  body limit. In mock mode videos are stored locally and played with the
  HTML5 player; in Mux mode the browser uploads directly to Mux.
- Drip is expressed as days after enrollment (`drip_days` on modules,
  optional per-lesson override). A fixed-calendar unlock date is not stored.
- "Ban" is implemented as removing all of a member's posts; a true ban flag
  would need a `banned_at` column (noted for a follow-up).
- Deleting a lesson removes learner progress for it; deleting a course with
  active enrollments requires an explicit force and is audited.
- The admin drop-off chart is scoped to the course with the most active
  enrollments so lesson codes stay unique.

## Testing and hardening (found by the production e2e run)

- Sign-out: Next.js re-serialises `cookies()` mutations made in a Route
  Handler and drops `Max-Age=0`, leaving an empty `cyc_session=` cookie that
  the edge proxy read as "signed in" (redirect loop between `/sign-in` and
  `/learn`). The cleared cookie now also carries `Expires=epoch`, and the
  proxy ignores empty cookie values.
- Real 404s: `loading.tsx` files were removed from the root and marketing
  segments so `notFound()` for unknown course/blog/preview slugs returns a
  404 status instead of a streamed 200 shell. Learner, checkout and admin
  segments keep their skeletons.
- Playwright runs against `next start` (port 3100, throwaway `.data-e2e`)
  with `actionTimeout`/`navigationTimeout` set so a missing element fails
  fast instead of consuming the whole test timeout. `PW_CHROMIUM` points the
  runner at a pre-installed browser in sandboxes without network access.
