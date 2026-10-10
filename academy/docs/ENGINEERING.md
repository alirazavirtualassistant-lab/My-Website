# Engineering guide — Cradle Your Cravings Academy

Read this before writing code in `academy/`. It is the shared contract between
everyone (people and agents) working on the app in parallel.

## Stack facts (do not fight them)

- **Next.js 16.4 (App Router, Turbopack, React 19.3).** This is newer than most
  training data. Rules that matter:
  - `params` and `searchParams` are **Promises**: `const { slug } = await params`.
  - `cookies()` / `headers()` are async: `const jar = await cookies()`.
  - The request-edge file is `src/proxy.ts` (not `middleware.ts`), exporting `proxy`.
  - `cacheComponents` is **off** (see `next.config.ts`). Pages that read cookies or
    the data store are dynamic automatically. Do not add `'use cache'`.
  - Route handlers: `export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> })`.
  - Server Actions: files start with `'use server'`; keep them under
    `src/app/**/actions.ts` or `src/lib/actions/*.ts`. Always validate input with zod.
  - `next lint` is gone; run `npx eslint src` and `npx tsc --noEmit`.
  - `error.tsx` boundaries receive `{ error, retry }` (Next 16), not `reset`.
  - The root layout mounts `Toaster`, `CookieConsent`, `Analytics`, `DemoRibbon`
    once; route-group layouts only add headers/shells and `<main id="main">`.
  - `src/app/_dev/**` is a private showcase (`/_dev/ui` via the `%5Fdev` alias);
    delete both folders before launch.
  - Bundled docs: `node_modules/next/dist/docs/01-app/**` when unsure.
- **Tailwind v4** via `@tailwindcss/turbopack` (no `tailwind.config.js`). Tokens are
  CSS variables in `src/app/globals.css`, exposed as Tailwind colors:
  `bg-cream`, `text-rose-strong`, `border-line`, `bg-sage-soft`, `text-muted`,
  `bg-gold-soft`, `bg-paper`, plus shadcn-style `bg-primary`, `text-muted-foreground`,
  `bg-card`, `border-border`, etc. Fonts: `font-serif` (Cormorant Garamond) for
  headings, `font-sans` (Nunito Sans) for UI. Utility classes `.eyebrow`,
  `.gold-rule`, `.card-soft`, `.prose-cyc` exist.
- **UI primitives** live in `src/components/ui/*` (shadcn-style, built on the
  `radix-ui` package). Use them; do not install other component libraries.
- **Icons**: `lucide-react`.
- **No new npm dependencies** without noting it in your report. Everything needed
  is already installed (see `package.json`).

## Architecture

```
src/lib/config/site.ts   brand, pricing placeholders (CONFIRM WITH CYNTHIA), levels
src/lib/types.ts         domain row types (snake_case = Postgres columns)
src/lib/env.ts           env access
src/lib/utils.ts         cn(), ids, money/date formatting, slugify …
src/lib/domain/*         PURE logic, no I/O: drip, xp, levels, streaks, pricing, certificates
src/lib/auth/*           getSession(), requireUser(), requireAdmin() (server only)
src/lib/usecases/*       application services: enrol, fulfil order, mark complete, award XP …
src/services/types.ts    service interfaces (DataStore/Repo, Auth, Payments, Storage, Video, Email)
src/services/index.ts    getServices() factory — picks adapters by env
src/services/mock/*      in-memory + JSON-file adapters (demo mode)
src/services/supabase/*  Supabase DataStore + Auth + Storage
src/services/stripe/*    Stripe payments
src/services/mux/*       Mux video
src/services/resend/*    Resend email
src/emails/*             React Email templates (one file per email)
src/components/*         ui/ layout/ marketing/ player/ dashboard/ community/ admin/ account/ shared/
src/app/(marketing)      public pages
src/app/(auth)           sign-in / sign-up / reset / verify / callback
src/app/(learner)        /learn, /community, /certificates, /account
src/app/(checkout)       /cart, /checkout, /gift, /partner
src/app/admin            admin panel (role-gated in layout + proxy)
src/app/api              route handlers (webhooks, files, certificates, cron)
content/source/…         the verbatim course package (zip contents)
content/courses/<slug>/course.json   importer output (seed)
supabase/migrations      SQL schema + RLS
scripts/                 import-course.ts, seed.ts, stripe-setup.ts
tests/unit, tests/e2e    vitest, playwright
```

### Data access rules

- Always go through `getServices()` → `db.from('table')` (generic `Repo<T>`:
  `list/count/get/findOne/insert/insertMany/update/updateWhere/delete/deleteWhere/upsert`).
  Equality filters only (`where: { user_id, status: ['active','expired'] }`), plus
  `orderBy`, `limit`, `offset`, `search`. Join in code, not in the adapter.
- Server Components, Server Actions and Route Handlers only. Never import
  `@/services` from a Client Component.
- Mutations that must be atomic (fulfilment, XP awards) go in
  `src/lib/usecases/*` and run inside `db.transaction(...)`.
- Idempotency: webhook handlers check `webhook_events` by provider event id first.
- Enrollments are created **only** by the fulfilment use case (webhook path), never
  from the client redirect.

### Auth rules

- `getSession()` from `src/lib/auth/session.ts` reads cookies via the auth
  adapter. `requireUser()` redirects to `/sign-in?next=…`; `requireAdmin()` allows
  roles `admin` | `assistant` (assistant = admin minus billing/settings/team).
- Admin pages double-check role on the server (layout + each action), never trust
  the proxy alone.

### Content rules

- Course content (titles, descriptions, notes, transcripts, action-step labels,
  resources) is **verbatim** from `content/source/`. Never paraphrase it in code.
- Placeholder links in the sheet (`forms.gle/*`, `youtube.com/*`,
  `facebook.com/groups/*`) are never rendered as links.
- Marketing copy may be fresh but must only make claims the materials support.
  No invented testimonials, outcomes, or statistics.

### UX rules

- Mobile-first, WCAG 2.2 AA: visible focus, labels on inputs, `aria-*` on custom
  widgets, keyboard reachable, colour contrast using the tokens (use
  `text-rose-strong`/`text-sage-strong` for text; `rose`/`sage` are for fills).
- Every screen has empty, loading (`loading.tsx` or skeletons) and error states.
- Brand voice: warm, calm, encouraging. Never shaming about food/weight. No
  fear-based copy.
- Medical disclaimer (`site.medicalDisclaimer`) appears on course pages, checkout,
  footer, and must be accepted once before the first lesson plays.

### Verification before you report

- `npx tsc --noEmit` passes for the whole project.
- `npx eslint src --max-warnings=0` on the files you touched.
- Unit tests you add run with `npx vitest run`.
- Do not run `next build`/`next dev` concurrently with other agents unless told to
  (the `.next/` directory is shared). Prefer `tsc` + `vitest`.

### Working in parallel

- Only touch the directories you own. If you need a change in a shared file
  (`globals.css`, `layout.tsx`, `types.ts`, `services/types.ts`, `package.json`),
  describe it in your report instead of editing it.
- Put decisions and assumptions in your report; the coordinator merges them into
  `DECISIONS.md`.
