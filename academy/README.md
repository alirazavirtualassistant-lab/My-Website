# Cradle Your Cravings Academy

A single-instructor online course platform for **Cynthia Myers Morrison, EdD**
under the **Cradle Your Cravings** brand. First course: **Baby Steps: Your
Health Journey Toward Conception** (7 modules + 2 bonuses + 2 replays,
59 lessons, 54 downloadable resources, ~10.5 hours of planned video).

- Browse → preview → buy → learn in a player with transcript, resources,
  action steps (XP), notes, discussion → certificate.
- Runs **without any third-party keys** in demo mode (mock adapters). Swap in
  Supabase, Stripe, Mux and Resend by changing environment variables.
- Admin panel for Cynthia and an assistant: courses CMS, bulk importer,
  products & pricing, coupons, students, community moderation, testimonials,
  email broadcasts, site settings, team.

See also: [`ADMIN_GUIDE.md`](./ADMIN_GUIDE.md) (non-technical),
[`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md), [`DECISIONS.md`](./DECISIONS.md),
[`docs/ENGINEERING.md`](./docs/ENGINEERING.md).

---

## Quick start (demo mode, no keys)

```bash
cd academy
cp .env.example .env.local      # defaults = demo mode
npm install
npm run import:course           # (already committed) regenerates content/courses/baby-steps/course.json
npm run dev                     # http://localhost:3000
```

On first boot in demo mode the app seeds the Baby Steps course and these
accounts (`DEMO_MODE=true`):

| Role      | Email                                   | Password          |
| --------- | --------------------------------------- | ----------------- |
| Admin     | `cynthia@demo.cradleyourcravings.com`   | `Admin!demo1`     |
| Assistant | `assistant@demo.cradleyourcravings.com` | `Assist!demo1`    |
| Learner   | `learner@demo.cradleyourcravings.com`   | `BabySteps!demo1` |
| Partner   | `partner@demo.cradleyourcravings.com`   | `Partner!demo1`   |

The demo learner is already enrolled in Baby Steps with some progress. The
mock checkout at `/checkout` lets you "pay" with a test button; emails that
would have been sent appear at `/dev/mailbox` and under Admin → Emails.

Demo-mode data is stored in `.data/store.json` (git-ignored). Delete it to
reset, or use Admin → Settings → "Reset demo data".

## Scripts

| Command                 | What it does                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Dev server (Turbopack)                                            |
| `npm run build` / `start` | Production build / serve                                        |
| `npm run check`         | typecheck + lint + unit tests                                     |
| `npm run test`          | Vitest unit tests (drip, XP, pricing, importer, webhooks, …)      |
| `npm run test:e2e`      | Playwright end-to-end (sign-up → buy → learn → certificate)       |
| `npm run import:course` | Parse the course zip/xlsx into `content/courses/baby-steps/`      |
| `npm run seed`          | Push the course package + products + settings into Supabase       |
| `npm run stripe:setup`  | Create Stripe test-mode products and prices                        |

## Configuration

All settings are environment variables; see [`.env.example`](./.env.example).
Each provider is independent:

| Variable            | Values              | Notes                                   |
| ------------------- | ------------------- | --------------------------------------- |
| `BACKEND_PROVIDER`  | `mock` / `supabase` | database, auth, file storage            |
| `PAYMENTS_PROVIDER` | `mock` / `stripe`   | checkout, portal, webhooks              |
| `VIDEO_PROVIDER`    | `mock` / `mux`      | signed playback, direct uploads         |
| `EMAIL_PROVIDER`    | `mock` / `resend`   | transactional email                     |
| `DEMO_MODE`         | `true` / `false`    | seeds demo data, shows the demo ribbon  |

### Supabase

1. Create a project. In **SQL editor** run the files in `supabase/migrations/`
   in order (`0001_schema.sql`, `0002_rls.sql`, `0003_storage.sql`), or use
   the Supabase CLI: `supabase db push`.
2. **Authentication → Providers**: enable Email (with confirmations) and
   Google (paste the OAuth client ID/secret; add
   `https://<your-domain>/auth/callback` as a redirect URL in both Google and
   Supabase).
3. Copy the project URL, anon key and service-role key into `.env.local`,
   set `BACKEND_PROVIDER=supabase`.
4. Seed the course: `npm run seed` (uploads the 54 resources to the
   `course-resources` bucket and inserts the curriculum, products, badges and
   default settings).

### Stripe

1. `STRIPE_SECRET_KEY` (test mode first), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. `npm run stripe:setup` creates the products/prices and prints their IDs;
   the admin Products page also creates prices on save.
3. Webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   locally; in production add an endpoint for `checkout.session.completed`,
   `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `charge.refunded` and set
   `STRIPE_WEBHOOK_SECRET`.
4. Enable **Stripe Tax** in the dashboard and set `STRIPE_TAX_ENABLED=true` to
   collect tax. Configure the **Customer Portal** (Settings → Billing →
   Customer portal) so learners can manage cards and cancel.
5. Set `PAYMENTS_PROVIDER=stripe`.

### Mux

1. Create an access token (read/write) and a **signing key** (for signed
   playback URLs). Set `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`,
   `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_KEY_PRIVATE` (base64 PEM as shown in the
   Mux dashboard).
2. Add a webhook for `video.asset.ready` / `video.asset.errored` pointing at
   `https://<domain>/api/webhooks/mux`; set `MUX_WEBHOOK_SECRET`.
3. Set `VIDEO_PROVIDER=mux`. Admin uploads go directly to Mux.

### Resend

1. Verify your sending domain, create an API key: `RESEND_API_KEY`,
   `EMAIL_FROM`.
2. Set `EMAIL_PROVIDER=resend`.

### Analytics (optional)

`NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` + `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, or
`posthog` + `NEXT_PUBLIC_POSTHOG_KEY`. Scripts load only after cookie consent
and never on lesson pages.

## Deploying to Vercel

1. Import the GitHub repository in Vercel. Set **Root Directory** to
   `academy`. Framework preset: Next.js.
2. Add every variable from `.env.example` in **Settings → Environment
   Variables** (production values; `DEMO_MODE=false`).
3. **Cron**: add a Vercel Cron job hitting `/api/cron/daily` once a day with
   header `Authorization: Bearer <CRON_SECRET>` (drip-unlock emails, weekly
   nudges, abandoned-cart reminders).
4. Deploy. Then create the first admin at `/admin/register` with
   `ADMIN_SETUP_CODE`.

### Custom domain

In Vercel → **Domains** add `academy.cradleyourcravings.com` (or the apex) and
create the CNAME/A records it shows at your DNS provider. Set
`NEXT_PUBLIC_SITE_URL=https://academy.cradleyourcravings.com` and update the
Stripe/Mux webhook URLs and Supabase/Google OAuth redirect URLs to the new
domain.

## Project structure

See [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) for the architecture, the
service contracts and the rules used while building.

## Tests

- Unit (Vitest): drip logic, XP totals, pricing/coupons, quiz scoring,
  importer against the real package, webhook idempotency, adapters.
- E2E (Playwright, demo mode): public pages, sign-up, mock checkout,
  player, completing a lesson, certificate, admin basics. Run
  `npm run build && npm run test:e2e`.
