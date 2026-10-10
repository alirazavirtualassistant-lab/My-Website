# Supabase schema, RLS, storage and seed

Everything the Supabase backend (`BACKEND_PROVIDER=supabase`) needs. The row
shapes are the `Tables` map in `src/lib/types.ts`; the SQL here mirrors it
column for column (a unit test, `tests/unit/sql/migrations.test.ts`, checks that).

```
supabase/
  migrations/0001_schema.sql   tables, constraints, indexes, updated_at + auth triggers
  migrations/0002_rls.sql      RLS helper functions, policies, privacy views, grants
  migrations/0003_storage.sql  buckets + storage.objects policies
  seed/seed.sql                badges + default site_settings (static, idempotent)
  seed/fixture-course.json     tiny CoursePackage for seed self-tests
  local/shim.sql               stand-ins for Supabase-only objects (local Postgres only)
  local/smoke.sql              RLS smoke test run by scripts/db-check.ts
scripts/seed.ts                content + products + files → Supabase (service role)
scripts/db-check.ts            applies everything to a throwaway local Postgres
```

## Apply to a Supabase project

1. Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`
   (migrations run in file order). Or paste the three files, in order, into
   the SQL editor.
2. `supabase/seed/seed.sql` — run once (or point `[db.seed] sql_paths` at it).
3. Content + products + files:

   ```sh
   # .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
   npm run import:course            # writes content/courses/baby-steps/course.json
   npx tsx scripts/seed.ts --dry-run
   npx tsx scripts/seed.ts          # add --status draft to seed unpublished
   ```

   Re-running is safe: lessons/modules are keyed by code, action steps keep
   their ids (matched by `source_label`) so learner progress survives,
   products and admin-edited settings are never overwritten.

4. Create the first admin: sign up normally, then in the SQL editor
   `update public.profiles set role = 'admin' where email = '…';`
   (role is never taken from sign-up metadata).

## Validate locally (no Supabase needed)

```sh
npx tsx scripts/db-check.ts            # 127.0.0.1:5433, user postgres
npx tsx scripts/db-check.ts --host localhost --port 5432 --password secret
```

It recreates database `cyc_check`, applies `local/shim.sql`, every migration
(twice, to prove idempotency), `seed.sql`, then `local/smoke.sql`, which
inserts an `auth.users` row, checks the profile trigger, and runs queries
under `set local role authenticated|anon` with `request.jwt.claim.sub` set to
verify the policies. The vitest suite runs the same check when a local
Postgres answers, and skips otherwise.

## Access model (summary)

| Who | Can |
| --- | --- |
| anon | read published courses/modules, preview lessons + their action steps, active products & coupons, badges, approved testimonials, site settings, `certificate_public` |
| learner | + own profile (not role/email), own progress/completions/notes/quiz responses/uploads, own orders/subscriptions/enrollments/gifts/partner links, gated lessons/resources/quizzes/forum of courses they are enrolled in |
| assistant | everything admin reads + content/community moderation; **not** billing (products, coupons, orders, subscriptions, gifts), settings or roles |
| admin | all of the above + billing, settings, roles |
| nobody but the owner | notes, quiz answers, learner uploads (admins only see `quiz_completion_status`) |
| service role (the app server) | everything — all commerce, XP, badge, streak, messaging and operations writes go through it |
