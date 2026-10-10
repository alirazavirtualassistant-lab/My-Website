-- ============================================================================
-- Cradle Your Cravings Academy — 0001_schema.sql
--
-- One table per key of the `Tables` map in src/lib/types.ts. Table and column
-- names match the TypeScript row types exactly (snake_case), so the same row
-- shapes flow through the mock store and the Supabase adapter without mapping.
--
-- Conventions
--   * uuid primary keys, default gen_random_uuid() (core since Postgres 13).
--   * ISODate columns are timestamptz (PostgREST returns ISO-8601 strings).
--   * Object / array-of-object columns are jsonb; string arrays are text[].
--   * Enum-like text columns carry CHECK constraints instead of enum types so
--     a new value is an ALTER TABLE, not a type migration.
--   * Integer money (cents) and counters.
--   * `updated_at` is maintained by the shared set_updated_at() trigger.
--   * Row-Level Security is enabled in 0002_rls.sql; storage in 0003_storage.sql.
--
-- Plain SQL only (no psql meta-commands). Targets Supabase Postgres 15+.
-- ============================================================================

-- Quiet the "already exists, skipping" notices when the file is re-applied.
set client_min_messages to warning;

-- ----------------------------------------------------------------------------
-- Shared trigger: keep updated_at current on every UPDATE.
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'BEFORE UPDATE trigger function: stamps updated_at = now().';

-- ============================================================================
-- Identity
-- ============================================================================

-- profiles: one row per Supabase Auth user (profiles.id = auth.users.id).
-- Created automatically by handle_new_user() below; the app may also upsert
-- it by id (the Supabase auth adapter does this on first sight of a user).
create table if not exists public.profiles (
  id                     uuid primary key references auth.users (id) on delete cascade,
  email                  text not null,
  name                   text not null default '',
  avatar_url             text,
  role                   text not null default 'learner'
                         check (role in ('learner', 'admin', 'assistant')),
  -- Marketing + progress nudges; billing emails always send.
  email_preferences      jsonb not null default
                         '{"progress_nudges": true, "drip_unlocks": true, "newsletter": true, "community": true}'::jsonb,
  disclaimer_accepted_at timestamptz,
  stripe_customer_id     text,
  timezone               text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  deleted_at             timestamptz
);

comment on table public.profiles is
  'Public profile for every auth.users row. role is only ever changed by an admin or the service role.';

create unique index if not exists profiles_email_lower_key on public.profiles (lower(email));
create index if not exists profiles_role_idx on public.profiles (role) where deleted_at is null;
create unique index if not exists profiles_stripe_customer_id_key
  on public.profiles (stripe_customer_id) where stripe_customer_id is not null;

-- auth_users / auth_tokens: credential tables used ONLY by the mock (demo)
-- backend. In Supabase mode, Supabase Auth owns credentials, sessions and
-- tokens, so these two tables exist purely so the schema matches the TS
-- `Tables` map. They stay empty and are not reachable by anon/authenticated.
create table if not exists public.auth_users (
  id                uuid primary key,                 -- same id as profiles.id
  email             text not null,
  password_hash     text,
  email_verified_at timestamptz,
  providers         text[] not null default '{}',     -- 'password' | 'magic_link' | 'google'
  created_at        timestamptz not null default now()
);

comment on table public.auth_users is
  'Mock-mode credential record. Supabase Auth owns credentials; this table stays empty in Supabase mode.';

create unique index if not exists auth_users_email_lower_key on public.auth_users (lower(email));

create table if not exists public.auth_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid,
  email      text not null,
  kind       text not null
             check (kind in ('magic_link', 'verify_email', 'password_reset', 'set_password')),
  token_hash text not null,
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.auth_tokens is
  'Mock-mode one-time tokens. Supabase Auth owns these in Supabase mode; this table stays empty.';

create unique index if not exists auth_tokens_token_hash_key on public.auth_tokens (token_hash);
create index if not exists auth_tokens_email_kind_idx on public.auth_tokens (email, kind);

-- ============================================================================
-- Course content
-- ============================================================================

create table if not exists public.courses (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null,
  title                text not null,
  subtitle             text not null default '',
  description          text not null default '',      -- long description (markdown allowed)
  short_description    text not null default '',      -- catalog card
  thumbnail_path       text,                          -- storage path in public-assets or null
  illustration         text,                          -- key of a built-in line-art illustration
  status               text not null default 'draft'
                       check (status in ('draft', 'published', 'scheduled', 'archived')),
  publish_at           timestamptz,
  level                text not null default 'All levels',
  language             text not null default 'en',
  topics               text[] not null default '{}',  -- TopicKey[]
  badge                text check (badge in ('bestseller', 'new')),
  partner_seat_enabled boolean not null default false,
  certificate_enabled  boolean not null default true,
  lifetime_access      boolean not null default true,
  access_days          integer check (access_days is null or access_days > 0),
  what_you_learn       text[] not null default '{}',
  requirements         text[] not null default '{}',
  who_for              text[] not null default '{}',
  faq                  jsonb not null default '[]'::jsonb,   -- [{q, a}]
  duration_weeks       integer check (duration_weeks is null or duration_weeks >= 0),
  last_updated_at      timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint courses_slug_key unique (slug)
);

create index if not exists courses_status_idx on public.courses (status);

create table if not exists public.modules (
  id                       uuid primary key default gen_random_uuid(),
  course_id                uuid not null references public.courses (id) on delete cascade,
  code                     text not null,                 -- M0, M1..M7, BONUS, REPLAY
  kind                     text not null default 'core'
                           check (kind in ('home', 'core', 'bonus', 'replay')),
  title                    text not null,
  description              text not null default '',
  notes                    text not null default '',
  position                 integer not null default 0,
  drip_days                integer not null default 0 check (drip_days >= 0),  -- 0 = immediately
  completion_xp            integer not null default 0 check (completion_xp >= 0),
  header_image_path        text,
  illustration             text,
  required_for_certificate boolean not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),
  constraint modules_course_id_code_key unique (course_id, code)
);

create index if not exists modules_course_id_position_idx on public.modules (course_id, position);

create table if not exists public.lessons (
  id                     uuid primary key default gen_random_uuid(),
  module_id              uuid not null references public.modules (id) on delete cascade,
  course_id              uuid not null references public.courses (id) on delete cascade,
  code                   text not null,                   -- M1T1, M1T0, BONUS_T2a, REPLAY_T1 ...
  title                  text not null,
  series                 text,                            -- e.g. "THE FIX for Cravings"
  description            text not null default '',
  notes                  text not null default '',
  planned_video_filename text,
  video_provider         text not null default 'none'
                         check (video_provider in ('none', 'mux', 'url')),
  video_asset_id         text,                            -- mux asset id
  video_playback_id      text,                            -- mux playback id (signed)
  video_url              text,                            -- storage path or https url
  captions_path          text,                            -- WebVTT storage path
  thumbnail_path         text,
  duration_sec           integer not null default 0 check (duration_sec >= 0),
  -- Teleprompter text, verbatim. Exposed at row level to enrolled learners;
  -- the API layer additionally gates it (see 0002_rls.sql).
  transcript             text not null default '',
  transcript_source_file text,
  audio_slots            jsonb not null default '[]'::jsonb,   -- [{key, label, file_path}]
  is_preview             boolean not null default false,
  is_intro               boolean not null default false,       -- MxT0 module introduction
  position               integer not null default 0,
  drip_days_override     integer check (drip_days_override is null or drip_days_override >= 0),
  status                 text not null default 'published'
                         check (status in ('draft', 'published', 'scheduled')),
  publish_at             timestamptz,
  doctor_callout         boolean not null default false,
  quiz_key               text,                            -- native in-app form attached to this lesson
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint lessons_course_id_code_key unique (course_id, code)
);

create index if not exists lessons_module_id_position_idx on public.lessons (module_id, position);
create index if not exists lessons_course_id_idx on public.lessons (course_id);
create index if not exists lessons_quiz_key_idx on public.lessons (quiz_key) where quiz_key is not null;

create table if not exists public.lesson_resources (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses (id) on delete cascade,
  lesson_id  uuid references public.lessons (id) on delete cascade,
  module_id  uuid references public.modules (id) on delete cascade,   -- module-level when lesson_id is null
  file_path  text not null,                                            -- storage path in course-resources bucket
  label      text not null,
  file_name  text not null,
  type       text not null default 'other'
             check (type in ('pdf', 'xlsx', 'mp3', 'docx', 'image', 'other')),
  size_bytes integer not null default 0 check (size_bytes >= 0),
  position   integer not null default 0,
  created_at timestamptz not null default now(),
  -- A resource hangs off a lesson or a module, never neither.
  constraint lesson_resources_owner_check check (lesson_id is not null or module_id is not null)
);

create index if not exists lesson_resources_course_id_idx on public.lesson_resources (course_id);
create index if not exists lesson_resources_lesson_id_idx on public.lesson_resources (lesson_id);
create index if not exists lesson_resources_module_id_idx on public.lesson_resources (module_id);

create table if not exists public.action_steps (
  id              uuid primary key default gen_random_uuid(),
  lesson_id       uuid not null references public.lessons (id) on delete cascade,
  course_id       uuid not null references public.courses (id) on delete cascade,
  label           text not null,                  -- display label (placeholder links stripped)
  source_label    text not null,                  -- verbatim sheet text
  kind            text not null default 'implementation'
                  check (kind in ('consumption', 'implementation', 'optional', 'rare')),
  xp              integer not null default 0 check (xp >= 0),
  requires_upload boolean not null default false,
  upload_type     text check (upload_type in ('photo', 'pdf', 'journal', 'any')),
  link            jsonb not null default '{"type": "none"}'::jsonb,   -- ActionLink
  position        integer not null default 0,
  sub_items       jsonb,                           -- [{key, label, xp}] | null
  created_at      timestamptz not null default now()
);

create index if not exists action_steps_lesson_id_position_idx on public.action_steps (lesson_id, position);
create index if not exists action_steps_course_id_idx on public.action_steps (course_id);

-- ============================================================================
-- Commerce
-- ============================================================================

create table if not exists public.products (
  id                   uuid primary key default gen_random_uuid(),
  type                 text not null
                       check (type in ('course', 'bundle', 'subscription', 'payment_plan')),
  slug                 text not null,
  title                text not null,
  description          text not null default '',
  course_ids           text[] not null default '{}',   -- course uuids granted (empty + grants_all_courses for subscriptions)
  grants_all_courses   boolean not null default false,
  price_cents          integer not null check (price_cents >= 0),
  sale_price_cents     integer check (sale_price_cents is null or sale_price_cents >= 0),
  sale_ends_at         timestamptz,
  currency             text not null default 'USD',
  interval             text check (interval in ('month', 'year')),   -- subscriptions / payment plans
  installments         integer check (installments is null or installments > 1),
  stripe_product_id    text,
  stripe_price_id      text,
  stripe_sale_price_id text,
  active               boolean not null default true,
  is_free              boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint products_slug_key unique (slug)
);

create index if not exists products_active_idx on public.products (active);

create table if not exists public.coupons (
  id                        uuid primary key default gen_random_uuid(),
  code                      text not null,                 -- uppercase
  kind                      text not null check (kind in ('percent', 'fixed')),
  amount                    integer not null check (amount > 0),   -- percent (1-100) or cents
  expires_at                timestamptz,
  max_uses                  integer check (max_uses is null or max_uses > 0),
  uses                      integer not null default 0 check (uses >= 0),
  product_ids               text[] not null default '{}', -- empty = all products
  stripe_coupon_id          text,
  stripe_promotion_code_id  text,
  active                    boolean not null default true,
  created_at                timestamptz not null default now(),
  constraint coupons_code_key unique (code),
  constraint coupons_percent_range_check check (kind <> 'percent' or amount <= 100)
);

create table if not exists public.orders (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid references public.profiles (id) on delete set null,
  email                      text not null,
  items                      jsonb not null default '[]'::jsonb,   -- [{product_id, title, unit_cents, quantity}]
  subtotal_cents             integer not null default 0 check (subtotal_cents >= 0),
  discount_cents             integer not null default 0 check (discount_cents >= 0),
  tax_cents                  integer not null default 0 check (tax_cents >= 0),
  total_cents                integer not null default 0 check (total_cents >= 0),
  currency                   text not null default 'USD',
  coupon_code                text,
  status                     text not null default 'pending'
                             check (status in ('pending', 'paid', 'refunded', 'partially_refunded', 'failed')),
  provider                   text not null check (provider in ('stripe', 'mock')),
  provider_session_id        text,                 -- checkout session id
  provider_payment_intent_id text,
  provider_subscription_id   text,
  provider_event_ids         text[] not null default '{}',   -- processed webhook event ids (idempotency)
  gift                       jsonb,                -- {recipient_email, recipient_name, message} | null
  refunded_cents             integer not null default 0 check (refunded_cents >= 0),
  created_at                 timestamptz not null default now(),
  paid_at                    timestamptz,
  updated_at                 timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_email_lower_idx on public.orders (lower(email));
create index if not exists orders_status_created_at_idx on public.orders (status, created_at desc);
create index if not exists orders_provider_session_id_idx
  on public.orders (provider_session_id) where provider_session_id is not null;
create index if not exists orders_provider_payment_intent_id_idx
  on public.orders (provider_payment_intent_id) where provider_payment_intent_id is not null;
create index if not exists orders_provider_subscription_id_idx
  on public.orders (provider_subscription_id) where provider_subscription_id is not null;

create table if not exists public.checkout_sessions (
  id          uuid primary key default gen_random_uuid(),
  provider    text not null check (provider in ('mock', 'stripe')),
  user_id     uuid references public.profiles (id) on delete set null,
  email       text,
  items       jsonb not null default '[]'::jsonb,     -- [{product_id, quantity}]
  coupon_code text,
  gift        jsonb,
  success_url text not null,
  cancel_url  text not null,
  status      text not null default 'open' check (status in ('open', 'complete', 'expired')),
  order_id    uuid references public.orders (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists checkout_sessions_user_id_idx on public.checkout_sessions (user_id);
create index if not exists checkout_sessions_status_created_at_idx on public.checkout_sessions (status, created_at);

create table if not exists public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.profiles (id) on delete cascade,
  product_id               uuid not null references public.products (id) on delete restrict,
  provider_subscription_id text,
  status                   text not null default 'active'
                           check (status in ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete')),
  current_period_end       timestamptz,
  cancel_at_period_end     boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create unique index if not exists subscriptions_provider_subscription_id_key
  on public.subscriptions (provider_subscription_id) where provider_subscription_id is not null;

create table if not exists public.enrollments (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references public.profiles (id) on delete cascade,
  course_id                 uuid not null references public.courses (id) on delete cascade,
  source                    text not null
                            check (source in ('purchase', 'subscription', 'gift', 'comp', 'partner', 'free')),
  order_id                  uuid references public.orders (id) on delete set null,
  subscription_id           uuid references public.subscriptions (id) on delete set null,
  started_at                timestamptz not null default now(),   -- drip clock starts here
  expires_at                timestamptz,
  status                    text not null default 'active'
                            check (status in ('active', 'revoked', 'expired')),
  unlock_all                boolean not null default false,       -- admin override of drip
  partner_invites_remaining integer not null default 0 check (partner_invites_remaining >= 0),
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Not unique: a revoked/expired enrollment may be followed by a fresh one and
-- the fulfilment use case re-uses an existing *active* row itself.
create index if not exists enrollments_user_id_course_id_idx on public.enrollments (user_id, course_id);
create index if not exists enrollments_course_id_status_idx on public.enrollments (course_id, status);
create index if not exists enrollments_order_id_idx on public.enrollments (order_id) where order_id is not null;
create index if not exists enrollments_subscription_id_idx
  on public.enrollments (subscription_id) where subscription_id is not null;

create table if not exists public.partner_links (
  id              uuid primary key default gen_random_uuid(),
  owner_user_id   uuid not null references public.profiles (id) on delete cascade,
  partner_user_id uuid references public.profiles (id) on delete set null,
  course_id       uuid not null references public.courses (id) on delete cascade,
  invite_email    text not null,
  token_hash      text not null,
  status          text not null default 'pending'
                  check (status in ('pending', 'accepted', 'revoked')),
  created_at      timestamptz not null default now(),
  accepted_at     timestamptz,
  constraint partner_links_token_hash_key unique (token_hash)
);

create index if not exists partner_links_owner_user_id_idx on public.partner_links (owner_user_id);
create index if not exists partner_links_partner_user_id_idx on public.partner_links (partner_user_id);
create index if not exists partner_links_invite_email_lower_idx on public.partner_links (lower(invite_email));

create table if not exists public.gifts (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders (id) on delete cascade,
  product_id          uuid not null references public.products (id) on delete restrict,
  buyer_user_id       uuid references public.profiles (id) on delete set null,
  buyer_email         text not null,
  recipient_email     text not null,
  recipient_name      text not null default '',
  message             text not null default '',
  token_hash          text not null,
  status              text not null default 'pending'
                      check (status in ('pending', 'redeemed', 'canceled')),
  redeemed_by_user_id uuid references public.profiles (id) on delete set null,
  redeemed_at         timestamptz,
  created_at          timestamptz not null default now(),
  constraint gifts_token_hash_key unique (token_hash)
);

create index if not exists gifts_order_id_idx on public.gifts (order_id);
create index if not exists gifts_recipient_email_lower_idx on public.gifts (lower(recipient_email));
create index if not exists gifts_buyer_user_id_idx on public.gifts (buyer_user_id);

-- ============================================================================
-- Learning progress
-- ============================================================================

create table if not exists public.lesson_progress (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  lesson_id         uuid not null references public.lessons (id) on delete cascade,
  course_id         uuid not null references public.courses (id) on delete cascade,
  completed_at      timestamptz,
  last_position_sec integer not null default 0 check (last_position_sec >= 0),
  watched_sec       integer not null default 0 check (watched_sec >= 0),
  updated_at        timestamptz not null default now(),
  constraint lesson_progress_user_id_lesson_id_key unique (user_id, lesson_id)
);

create index if not exists lesson_progress_user_id_course_id_idx on public.lesson_progress (user_id, course_id);

create table if not exists public.action_step_completions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  step_id        uuid not null references public.action_steps (id) on delete cascade,
  lesson_id      uuid not null references public.lessons (id) on delete cascade,
  course_id      uuid not null references public.courses (id) on delete cascade,
  upload_path    text,                                   -- learner-uploads/<uid>/...
  sub_items_done text[] not null default '{}',
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  constraint action_step_completions_user_id_step_id_key unique (user_id, step_id)
);

create index if not exists action_step_completions_user_id_course_id_idx
  on public.action_step_completions (user_id, course_id);
create index if not exists action_step_completions_user_id_lesson_id_idx
  on public.action_step_completions (user_id, lesson_id);

create table if not exists public.xp_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  course_id  uuid references public.courses (id) on delete set null,
  amount     integer not null,
  reason     text not null
             check (reason in ('action_step', 'sub_item', 'lesson_complete', 'module_complete', 'course_goal', 'admin_adjustment')),
  ref_id     text,                                       -- step id / module id / goal key
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists xp_ledger_user_id_course_id_idx on public.xp_ledger (user_id, course_id);
create index if not exists xp_ledger_user_id_reason_ref_id_idx on public.xp_ledger (user_id, reason, ref_id);

create table if not exists public.badges (
  id          uuid primary key default gen_random_uuid(),
  key         text not null,                             -- module:M1, goal:minimum, streak:7 ...
  title       text not null,
  description text not null default '',
  icon        text not null default 'award',
  xp_bonus    integer not null default 0 check (xp_bonus >= 0),
  constraint badges_key_key unique (key)
);

create table if not exists public.user_badges (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  badge_id   uuid not null references public.badges (id) on delete cascade,
  course_id  uuid references public.courses (id) on delete set null,
  awarded_at timestamptz not null default now(),
  -- One award per badge per course (course_id null counts as a value, PG15+).
  constraint user_badges_user_id_badge_id_course_id_key unique nulls not distinct (user_id, badge_id, course_id)
);

create index if not exists user_badges_user_id_idx on public.user_badges (user_id);

create table if not exists public.streaks (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  current          integer not null default 0 check (current >= 0),
  longest          integer not null default 0 check (longest >= 0),
  last_active_date date not null,                        -- YYYY-MM-DD
  updated_at       timestamptz not null default now(),
  constraint streaks_user_id_key unique (user_id)        -- one streak row per learner
);

-- ============================================================================
-- Quizzes & notes (learner-private content)
-- ============================================================================

create table if not exists public.quiz_definitions (
  id           uuid primary key default gen_random_uuid(),
  key          text not null,                            -- wellness-quiz, gut-health-quiz, ...
  course_id    uuid references public.courses (id) on delete set null,
  title        text not null,
  intro        text not null default '',
  questions    jsonb not null default '[]'::jsonb,       -- QuizQuestion[]
  scoring      jsonb not null default '{"kind": "none"}'::jsonb,
  confirmation text not null default '',
  source_file  text,
  constraint quiz_definitions_key_key unique (key)
);

create index if not exists quiz_definitions_course_id_idx on public.quiz_definitions (course_id);

create table if not exists public.quiz_responses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  quiz_key       text not null,
  course_id      uuid references public.courses (id) on delete set null,
  answers        jsonb not null default '{}'::jsonb,     -- {question_key: value}
  score          integer,
  section_scores jsonb,                                  -- {section_key: score} | null
  submitted_at   timestamptz not null default now()
);

-- Deliberately NOT unique: learners may retake a quiz (the Welcome Guide has
-- them revisit the pre-course survey in Module 7), so every submission is
-- kept and the newest one wins (order by submitted_at desc).
create index if not exists quiz_responses_user_id_quiz_key_course_id_idx
  on public.quiz_responses (user_id, quiz_key, course_id, submitted_at desc);

create table if not exists public.notes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id) on delete cascade,
  course_id    uuid not null references public.courses (id) on delete cascade,
  body         text not null default '',
  position_sec integer check (position_sec is null or position_sec >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists notes_user_id_lesson_id_idx on public.notes (user_id, lesson_id);
create index if not exists notes_user_id_course_id_idx on public.notes (user_id, course_id);

-- ============================================================================
-- Community
-- ============================================================================

create table if not exists public.forum_categories (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses (id) on delete cascade,
  module_id   uuid references public.modules (id) on delete set null,
  slug        text not null,
  title       text not null,
  description text not null default '',
  position    integer not null default 0,
  constraint forum_categories_course_id_slug_key unique (course_id, slug)
);

create index if not exists forum_categories_course_id_position_idx on public.forum_categories (course_id, position);

create table if not exists public.forum_posts (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  lesson_id   uuid references public.lessons (id) on delete set null,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  body        text not null default '',
  image_path  text,
  anonymous   boolean not null default false,
  pinned      boolean not null default false,
  locked      boolean not null default false,
  like_count  integer not null default 0 check (like_count >= 0),
  reply_count integer not null default 0 check (reply_count >= 0),
  status      text not null default 'visible'
              check (status in ('visible', 'hidden', 'removed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists forum_posts_category_id_created_at_idx on public.forum_posts (category_id, created_at desc);
create index if not exists forum_posts_course_id_idx on public.forum_posts (course_id);
create index if not exists forum_posts_lesson_id_idx on public.forum_posts (lesson_id) where lesson_id is not null;
create index if not exists forum_posts_user_id_idx on public.forum_posts (user_id);
create index if not exists forum_posts_status_idx on public.forum_posts (status);

create table if not exists public.forum_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.forum_posts (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  body       text not null,
  anonymous  boolean not null default false,
  like_count integer not null default 0 check (like_count >= 0),
  status     text not null default 'visible'
             check (status in ('visible', 'hidden', 'removed')),
  created_at timestamptz not null default now()
);

create index if not exists forum_replies_post_id_created_at_idx on public.forum_replies (post_id, created_at);
create index if not exists forum_replies_user_id_idx on public.forum_replies (user_id);

create table if not exists public.forum_likes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  post_id    uuid references public.forum_posts (id) on delete cascade,
  reply_id   uuid references public.forum_replies (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- Exactly one target.
  constraint forum_likes_target_check check ((post_id is null) <> (reply_id is null))
);

create unique index if not exists forum_likes_user_id_post_id_key
  on public.forum_likes (user_id, post_id) where post_id is not null;
create unique index if not exists forum_likes_user_id_reply_id_key
  on public.forum_likes (user_id, reply_id) where reply_id is not null;

create table if not exists public.forum_reports (
  id               uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.profiles (id) on delete cascade,
  post_id          uuid references public.forum_posts (id) on delete cascade,
  reply_id         uuid references public.forum_replies (id) on delete cascade,
  reason           text not null default '',
  status           text not null default 'open'
                   check (status in ('open', 'resolved', 'dismissed')),
  created_at       timestamptz not null default now(),
  resolved_at      timestamptz,
  constraint forum_reports_target_check check ((post_id is null) <> (reply_id is null))
);

create index if not exists forum_reports_status_created_at_idx on public.forum_reports (status, created_at desc);
create index if not exists forum_reports_reporter_user_id_idx on public.forum_reports (reporter_user_id);

-- ============================================================================
-- Certificates & testimonials
-- ============================================================================

create table if not exists public.certificates (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  course_id    uuid not null references public.courses (id) on delete cascade,
  issued_at    timestamptz not null default now(),
  verify_code  text not null,                            -- short public code
  learner_name text not null,
  course_title text not null,
  revoked_at   timestamptz,
  constraint certificates_verify_code_key unique (verify_code)
);

-- Not unique on (user_id, course_id): the use case re-uses an existing row,
-- and a revoked certificate may be followed by a re-issue.
create index if not exists certificates_user_id_course_id_idx on public.certificates (user_id, course_id);

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles (id) on delete set null,
  course_id   uuid references public.courses (id) on delete set null,
  author_name text not null,
  author_role text,
  body        text not null,
  rating      integer check (rating is null or (rating between 1 and 5)),
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists testimonials_status_featured_idx on public.testimonials (status, featured);
create index if not exists testimonials_user_id_idx on public.testimonials (user_id);
create index if not exists testimonials_course_id_idx on public.testimonials (course_id);

-- ============================================================================
-- Messaging, operations, settings
-- ============================================================================

create table if not exists public.email_events (
  id                  uuid primary key default gen_random_uuid(),
  "to"                text not null,                     -- "to" is a reserved word: always quote it in SQL
  template            text not null,
  subject             text not null,
  payload             jsonb not null default '{}'::jsonb,
  html                text,
  provider            text not null check (provider in ('mock', 'resend')),
  provider_message_id text,
  status              text not null default 'queued' check (status in ('sent', 'failed', 'queued')),
  error               text,
  created_at          timestamptz not null default now()
);

create index if not exists email_events_to_lower_idx on public.email_events (lower("to"));
create index if not exists email_events_template_created_at_idx on public.email_events (template, created_at desc);
create index if not exists email_events_created_at_idx on public.email_events (created_at desc);

create table if not exists public.broadcasts (
  id         uuid primary key default gen_random_uuid(),
  subject    text not null,
  body       text not null default '',                   -- markdown
  audience   text not null default 'all' check (audience in ('all', 'course', 'incomplete')),
  course_id  uuid references public.courses (id) on delete set null,
  sent_count integer not null default 0 check (sent_count >= 0),
  status     text not null default 'draft' check (status in ('draft', 'sent')),
  -- Plain uuid (no FK): keeps the history even if the author's account is deleted.
  created_by uuid not null,
  created_at timestamptz not null default now(),
  sent_at    timestamptz
);

create index if not exists broadcasts_status_created_at_idx on public.broadcasts (status, created_at desc);

create table if not exists public.audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id) on delete set null,
  action        text not null,
  target_type   text not null,
  target_id     text,
  meta          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists audit_log_created_at_idx on public.audit_log (created_at desc);
create index if not exists audit_log_target_idx on public.audit_log (target_type, target_id);
create index if not exists audit_log_actor_user_id_idx on public.audit_log (actor_user_id);

-- Single-row settings table: id is always 'default'.
create table if not exists public.site_settings (
  id                    text primary key default 'default' check (id = 'default'),
  site_name             text not null default 'Cradle Your Cravings Academy',
  logo_path             text,
  support_email         text not null default 'support@cradleyourcravings.com',
  disclaimer_text       text not null default '',
  colors                jsonb,                           -- {token: value} | null
  legal                 jsonb not null default '{}'::jsonb,   -- {slug: markdown}
  abandoned_cart_emails boolean not null default true,
  weekly_nudges         boolean not null default true,
  testimonials_enabled  boolean not null default true,
  updated_at            timestamptz not null default now()
);

create table if not exists public.newsletter_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text not null default 'site',
  created_at timestamptz not null default now()
);

-- Not unique: the app treats repeat sign-ups as harmless; dedupe at send time.
create index if not exists newsletter_signups_email_lower_idx on public.newsletter_signups (lower(email));

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

-- Webhook idempotency: id IS the provider's event id (text, e.g. "evt_…").
-- Being the primary key it is unique on its own; provider is recorded so
-- the pair (provider, id) is unambiguous when mock and Stripe share a table.
create table if not exists public.webhook_events (
  id           text primary key,
  provider     text not null check (provider in ('stripe', 'mock')),
  type         text not null,
  processed_at timestamptz not null default now()
);

create index if not exists webhook_events_provider_type_idx on public.webhook_events (provider, type, processed_at desc);

-- ============================================================================
-- updated_at triggers
-- ============================================================================

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'courses', 'modules', 'lessons', 'products', 'orders', 'subscriptions',
    'enrollments', 'lesson_progress', 'streaks', 'notes', 'forum_posts', 'site_settings'
  ]
  loop
    execute format(
      'create or replace trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t
    );
  end loop;
end;
$$;

-- ============================================================================
-- Supabase Auth → profiles
-- ============================================================================

-- Creates the profile row when Supabase Auth inserts a user. Reads only
-- name/avatar from raw_user_meta_data; role is NEVER taken from metadata
-- (clients can set metadata at sign-up). security definer + fixed search_path
-- because the auth admin role that fires this has no rights on public.profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  display_name text;
  avatar text;
begin
  display_name := nullif(trim(coalesce(meta ->> 'name', meta ->> 'full_name', '')), '');
  if display_name is null then
    -- Fall back to the local part of the email ("jane.doe" → "jane.doe").
    display_name := coalesce(split_part(coalesce(new.email, ''), '@', 1), '');
  end if;
  avatar := nullif(trim(coalesce(meta ->> 'avatar', meta ->> 'avatar_url', meta ->> 'picture', '')), '');

  insert into public.profiles (id, email, name, avatar_url)
  values (new.id, lower(coalesce(new.email, '')), display_name, avatar)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync when Supabase Auth changes a user's email.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email and new.email is not null then
    update public.profiles set email = lower(new.email) where id = new.id;
  end if;
  return new;
end;
$$;

create or replace trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- ============================================================================
-- Grants. Supabase's default privileges normally cover these; stating them
-- makes the schema self-contained (and lets the local validator behave like
-- the real thing). RLS (0002) decides which rows each role actually sees.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant execute on all functions in schema public to anon, authenticated, service_role;
