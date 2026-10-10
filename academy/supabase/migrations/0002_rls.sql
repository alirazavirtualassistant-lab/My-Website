-- ============================================================================
-- Cradle Your Cravings Academy — 0002_rls.sql
--
-- Row-Level Security for every table created in 0001_schema.sql.
--
-- How the app talks to the database
--   * The Next.js server uses the SERVICE ROLE (bypasses RLS) through
--     src/services/supabase/*, and the use-case layer does its own
--     authorisation. The policies below are defence in depth for anything
--     that reaches PostgREST with the anon key + a user JWT (browser clients,
--     Supabase Studio "impersonate", future client-side reads).
--   * `anon` = not signed in; `authenticated` = signed in (auth.uid() set).
--   * Writes to commerce, XP, badges, streaks, messaging and operations
--     tables happen ONLY through the service role; users get no insert
--     policy there.
--
-- Roles
--   is_admin()        role in ('admin', 'assistant')  → read everything admin-ish,
--                     moderate content/community.
--   is_super_admin()  role = 'admin'                   → billing, settings, team
--                     (assistant = admin minus billing/settings/team).
--
-- Privacy (DECISIONS.md "Trust and privacy"): quiz/survey answers, notes,
-- journals and uploads are private to the learner. Admins see completion
-- status only (view quiz_completion_status), never the content.
--
-- Transcripts: lessons.transcript is exposed at row level to anyone who can
-- read the lesson row (preview lessons → everyone; others → enrolled). The
-- API layer additionally gates transcript access (enrolment + disclaimer),
-- so the DB does not try to hide a single column.
-- ============================================================================

-- Quiet the "policy does not exist, skipping" notices from the idempotent drops.
set client_min_messages to warning;

-- ----------------------------------------------------------------------------
-- Helper functions
-- ----------------------------------------------------------------------------

-- True for the two RLS-restricted end-user roles. Everything else (postgres,
-- service_role, supabase_admin, auth admin) is a trusted server context.
create or replace function public.is_end_user()
returns boolean
language sql
stable
as $$
  select current_user in ('anon', 'authenticated');
$$;

-- security definer: reads profiles without triggering the profiles policies
-- (which call this function → would recurse). Owner (postgres) bypasses RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role in ('admin', 'assistant') and p.deleted_at is null
       from public.profiles p
      where p.id = auth.uid()),
    false
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role = 'admin' and p.deleted_at is null
       from public.profiles p
      where p.id = auth.uid()),
    false
  );
$$;

-- Active enrolment for the calling user in the given course. Subscriptions
-- grant access through enrollment rows too (source = 'subscription'), so one
-- check covers every purchase path.
create or replace function public.has_active_enrollment(course uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from public.enrollments e
     where e.user_id = auth.uid()
       and e.course_id = course
       and e.status = 'active'
       and (e.expires_at is null or e.expires_at > now())
  );
$$;

-- Course row is visible to the public (published).
create or replace function public.course_is_public(course uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.courses c
     where c.id = course and c.status = 'published'
  );
$$;

comment on function public.is_admin() is 'auth.uid() has role admin or assistant (and is not soft-deleted).';
comment on function public.is_super_admin() is 'auth.uid() has role admin (billing / settings / team).';
comment on function public.has_active_enrollment(uuid) is 'auth.uid() has an active, unexpired enrollment in the course.';
comment on function public.course_is_public(uuid) is 'Course status is published.';

grant execute on function public.is_end_user() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_super_admin() to anon, authenticated, service_role;
grant execute on function public.has_active_enrollment(uuid) to anon, authenticated, service_role;
grant execute on function public.course_is_public(uuid) to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- Field-protection triggers (policies cannot compare OLD and NEW)
-- ----------------------------------------------------------------------------

-- profiles: a signed-in user may edit name/avatar/preferences/timezone/
-- disclaimer, but never their role, email (owned by Supabase Auth),
-- Stripe customer id, soft-delete flag or id. Role changes need a full admin.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
as $$
begin
  if not public.is_end_user() then
    return new;
  end if;
  if new.id is distinct from old.id
     or new.email is distinct from old.email
     or new.stripe_customer_id is distinct from old.stripe_customer_id
     or new.deleted_at is distinct from old.deleted_at then
    if not public.is_admin() then
      raise exception 'profiles: id, email, stripe_customer_id and deleted_at are managed by the server'
        using errcode = 'insufficient_privilege';
    end if;
  end if;
  if new.role is distinct from old.role and not public.is_super_admin() then
    raise exception 'profiles: role can only be changed by an admin'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

create or replace trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- forum_posts / forum_replies: authors may edit their text, but moderation
-- flags and denormalised counters are server/admin only. An author may hide
-- their own visible post; they may not un-hide something a moderator hid.
create or replace function public.protect_forum_fields()
returns trigger
language plpgsql
as $$
begin
  if not public.is_end_user() or public.is_admin() then
    return new;
  end if;
  if new.user_id is distinct from old.user_id
     or new.like_count is distinct from old.like_count
     or new.created_at is distinct from old.created_at then
    raise exception '%: author, counters and timestamps are managed by the server', tg_table_name
      using errcode = 'insufficient_privilege';
  end if;
  if new.status is distinct from old.status and old.status <> 'visible' then
    raise exception '%: a moderated post cannot be made visible again by its author', tg_table_name
      using errcode = 'insufficient_privilege';
  end if;
  if tg_table_name = 'forum_posts' then
    if new.pinned is distinct from old.pinned
       or new.locked is distinct from old.locked
       or new.reply_count is distinct from old.reply_count
       or new.course_id is distinct from old.course_id
       or new.category_id is distinct from old.category_id then
      raise exception 'forum_posts: pinned, locked, reply_count, course and category are managed by the server'
        using errcode = 'insufficient_privilege';
    end if;
  elsif tg_table_name = 'forum_replies' then
    if new.post_id is distinct from old.post_id then
      raise exception 'forum_replies: post_id cannot change' using errcode = 'insufficient_privilege';
    end if;
  end if;
  return new;
end;
$$;

create or replace trigger protect_forum_fields
  before update on public.forum_posts
  for each row execute function public.protect_forum_fields();

create or replace trigger protect_forum_fields
  before update on public.forum_replies
  for each row execute function public.protect_forum_fields();

-- ----------------------------------------------------------------------------
-- Enable RLS on every table (service_role bypasses; owner bypasses).
-- ----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'auth_users', 'auth_tokens',
    'courses', 'modules', 'lessons', 'lesson_resources', 'action_steps',
    'products', 'coupons', 'orders', 'checkout_sessions', 'subscriptions', 'enrollments',
    'partner_links', 'gifts',
    'lesson_progress', 'action_step_completions', 'xp_ledger', 'badges', 'user_badges', 'streaks',
    'quiz_definitions', 'quiz_responses', 'notes',
    'forum_categories', 'forum_posts', 'forum_replies', 'forum_likes', 'forum_reports',
    'certificates', 'testimonials',
    'email_events', 'broadcasts', 'audit_log', 'site_settings', 'newsletter_signups',
    'contact_messages', 'webhook_events'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ============================================================================
-- Policies. Naming: "<table>: <who> <verb>". Policies are permissive, so a
-- row is visible when ANY applicable policy passes.
-- ============================================================================

-- ---- profiles ---------------------------------------------------------------
drop policy if exists "profiles: own read" on public.profiles;
create policy "profiles: own read" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles: admin read" on public.profiles;
create policy "profiles: admin read" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "profiles: own update" on public.profiles;
create policy "profiles: own update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
  -- protected columns enforced by protect_profile_fields()

drop policy if exists "profiles: admin update" on public.profiles;
create policy "profiles: admin update" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- No insert policy: rows come from handle_new_user() / the service role.
-- No delete policy: accounts are soft-deleted (deleted_at) by the server.

-- ---- auth_users / auth_tokens (mock-mode only; nothing for end users) --------
revoke all on public.auth_users from anon, authenticated;
revoke all on public.auth_tokens from anon, authenticated;

-- ---- courses ----------------------------------------------------------------
drop policy if exists "courses: public read" on public.courses;
create policy "courses: public read" on public.courses
  for select to anon, authenticated using (status = 'published' or public.is_admin());

drop policy if exists "courses: admin write" on public.courses;
create policy "courses: admin write" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- modules ----------------------------------------------------------------
drop policy if exists "modules: public read" on public.modules;
create policy "modules: public read" on public.modules
  for select to anon, authenticated using (public.is_admin() or public.course_is_public(course_id));

drop policy if exists "modules: admin write" on public.modules;
create policy "modules: admin write" on public.modules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- lessons ----------------------------------------------------------------
-- Preview lessons of a published course: everyone. Other lessons: active
-- enrolment. Draft lessons: admins only. (Transcript column: see header.)
drop policy if exists "lessons: read" on public.lessons;
create policy "lessons: read" on public.lessons
  for select to anon, authenticated using (
    public.is_admin()
    or (
      public.course_is_public(course_id)
      and status <> 'draft'
      and (is_preview or public.has_active_enrollment(course_id))
    )
  );

drop policy if exists "lessons: admin write" on public.lessons;
create policy "lessons: admin write" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- lesson_resources -------------------------------------------------------
-- Files are served through short-lived signed URLs made by the server; the
-- row (label, path, size) is visible to enrolled learners and admins only.
drop policy if exists "lesson_resources: enrolled read" on public.lesson_resources;
create policy "lesson_resources: enrolled read" on public.lesson_resources
  for select to authenticated using (
    public.is_admin()
    or (public.course_is_public(course_id) and public.has_active_enrollment(course_id))
  );

drop policy if exists "lesson_resources: admin write" on public.lesson_resources;
create policy "lesson_resources: admin write" on public.lesson_resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- action_steps -----------------------------------------------------------
-- Visible exactly when the parent lesson is visible (the subquery runs under
-- the caller's lessons policy).
drop policy if exists "action_steps: read" on public.action_steps;
create policy "action_steps: read" on public.action_steps
  for select to anon, authenticated using (
    public.is_admin()
    or exists (select 1 from public.lessons l where l.id = action_steps.lesson_id)
  );

drop policy if exists "action_steps: admin write" on public.action_steps;
create policy "action_steps: admin write" on public.action_steps
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- products ---------------------------------------------------------------
drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products
  for select to anon, authenticated using (active or public.is_admin());

drop policy if exists "products: admin write" on public.products;
create policy "products: admin write" on public.products
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ---- coupons ----------------------------------------------------------------
-- NOTE: this intentionally exposes active coupon codes to anyone with the anon
-- key (as specified). The app validates coupons server-side; if that exposure
-- is unwanted at launch, drop "coupons: public read" and rely on the server.
drop policy if exists "coupons: public read" on public.coupons;
create policy "coupons: public read" on public.coupons
  for select to anon, authenticated using (
    public.is_admin()
    or (active and (expires_at is null or expires_at > now()))
  );

drop policy if exists "coupons: admin write" on public.coupons;
create policy "coupons: admin write" on public.coupons
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ---- orders -----------------------------------------------------------------
drop policy if exists "orders: own read" on public.orders;
create policy "orders: own read" on public.orders
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "orders: admin read" on public.orders;
create policy "orders: admin read" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "orders: admin write" on public.orders;
create policy "orders: admin write" on public.orders
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
-- Users never insert orders: the checkout + webhook path (service role) does.

-- ---- checkout_sessions (admin read; service role writes) --------------------
drop policy if exists "checkout_sessions: admin read" on public.checkout_sessions;
create policy "checkout_sessions: admin read" on public.checkout_sessions
  for select to authenticated using (public.is_admin());

-- ---- subscriptions ----------------------------------------------------------
drop policy if exists "subscriptions: own read" on public.subscriptions;
create policy "subscriptions: own read" on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "subscriptions: admin read" on public.subscriptions;
create policy "subscriptions: admin read" on public.subscriptions
  for select to authenticated using (public.is_admin());

drop policy if exists "subscriptions: admin write" on public.subscriptions;
create policy "subscriptions: admin write" on public.subscriptions
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ---- enrollments ------------------------------------------------------------
drop policy if exists "enrollments: own read" on public.enrollments;
create policy "enrollments: own read" on public.enrollments
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "enrollments: admin all" on public.enrollments;
create policy "enrollments: admin all" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Learners never insert enrollments: only the fulfilment use case does.

-- ---- partner_links ----------------------------------------------------------
drop policy if exists "partner_links: own read" on public.partner_links;
create policy "partner_links: own read" on public.partner_links
  for select to authenticated using (owner_user_id = auth.uid() or partner_user_id = auth.uid());

drop policy if exists "partner_links: admin all" on public.partner_links;
create policy "partner_links: admin all" on public.partner_links
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- gifts ------------------------------------------------------------------
drop policy if exists "gifts: own read" on public.gifts;
create policy "gifts: own read" on public.gifts
  for select to authenticated using (buyer_user_id = auth.uid() or redeemed_by_user_id = auth.uid());

drop policy if exists "gifts: admin read" on public.gifts;
create policy "gifts: admin read" on public.gifts
  for select to authenticated using (public.is_admin());

drop policy if exists "gifts: admin write" on public.gifts;
create policy "gifts: admin write" on public.gifts
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ---- lesson_progress (own: full; admin: read) --------------------------------
drop policy if exists "lesson_progress: own all" on public.lesson_progress;
create policy "lesson_progress: own all" on public.lesson_progress
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "lesson_progress: admin read" on public.lesson_progress;
create policy "lesson_progress: admin read" on public.lesson_progress
  for select to authenticated using (public.is_admin());

-- ---- action_step_completions (own: full; admin: read) ------------------------
drop policy if exists "action_step_completions: own all" on public.action_step_completions;
create policy "action_step_completions: own all" on public.action_step_completions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "action_step_completions: admin read" on public.action_step_completions;
create policy "action_step_completions: admin read" on public.action_step_completions
  for select to authenticated using (public.is_admin());

-- ---- xp_ledger / user_badges / streaks ---------------------------------------
-- DECISION: these are *awarded* by the use-case layer, so end users get READ
-- access to their own rows only; writes stay with the service role. (Giving
-- learners insert rights here would let a browser session grant itself XP.)
drop policy if exists "xp_ledger: own read" on public.xp_ledger;
create policy "xp_ledger: own read" on public.xp_ledger
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "xp_ledger: admin read" on public.xp_ledger;
create policy "xp_ledger: admin read" on public.xp_ledger
  for select to authenticated using (public.is_admin());

drop policy if exists "user_badges: own read" on public.user_badges;
create policy "user_badges: own read" on public.user_badges
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "user_badges: admin read" on public.user_badges;
create policy "user_badges: admin read" on public.user_badges
  for select to authenticated using (public.is_admin());

drop policy if exists "streaks: own read" on public.streaks;
create policy "streaks: own read" on public.streaks
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "streaks: admin read" on public.streaks;
create policy "streaks: admin read" on public.streaks
  for select to authenticated using (public.is_admin());

-- ---- badges (catalogue) -----------------------------------------------------
drop policy if exists "badges: public read" on public.badges;
create policy "badges: public read" on public.badges
  for select to anon, authenticated using (true);

drop policy if exists "badges: admin write" on public.badges;
create policy "badges: admin write" on public.badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- quiz_definitions (course content; enrolment-gated like lessons) --------
drop policy if exists "quiz_definitions: read" on public.quiz_definitions;
create policy "quiz_definitions: read" on public.quiz_definitions
  for select to authenticated using (
    public.is_admin()
    or course_id is null
    or (public.course_is_public(course_id) and public.has_active_enrollment(course_id))
  );

drop policy if exists "quiz_definitions: admin write" on public.quiz_definitions;
create policy "quiz_definitions: admin write" on public.quiz_definitions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- quiz_responses (PRIVATE: owner only; admins use quiz_completion_status) --
drop policy if exists "quiz_responses: own all" on public.quiz_responses;
create policy "quiz_responses: own all" on public.quiz_responses
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- notes (PRIVATE: owner only; no admin policy on purpose) ----------------
drop policy if exists "notes: own all" on public.notes;
create policy "notes: own all" on public.notes
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- forum_categories -------------------------------------------------------
-- DECISION: the community is part of the course, so reading requires an
-- active enrolment in that course (or admin), not just a sign-in.
drop policy if exists "forum_categories: enrolled read" on public.forum_categories;
create policy "forum_categories: enrolled read" on public.forum_categories
  for select to authenticated using (public.is_admin() or public.has_active_enrollment(course_id));

drop policy if exists "forum_categories: admin write" on public.forum_categories;
create policy "forum_categories: admin write" on public.forum_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- forum_posts ------------------------------------------------------------
drop policy if exists "forum_posts: enrolled read" on public.forum_posts;
create policy "forum_posts: enrolled read" on public.forum_posts
  for select to authenticated using (
    public.is_admin()
    or (public.has_active_enrollment(course_id) and (status = 'visible' or user_id = auth.uid()))
  );

drop policy if exists "forum_posts: own insert" on public.forum_posts;
create policy "forum_posts: own insert" on public.forum_posts
  for insert to authenticated with check (
    user_id = auth.uid()
    and public.has_active_enrollment(course_id)
    and status = 'visible'
    and pinned = false and locked = false
    and like_count = 0 and reply_count = 0
    and exists (select 1 from public.forum_categories c where c.id = category_id and c.course_id = forum_posts.course_id)
  );

drop policy if exists "forum_posts: own update" on public.forum_posts;
create policy "forum_posts: own update" on public.forum_posts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  -- moderation fields enforced by protect_forum_fields()

drop policy if exists "forum_posts: own delete" on public.forum_posts;
create policy "forum_posts: own delete" on public.forum_posts
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "forum_posts: admin all" on public.forum_posts;
create policy "forum_posts: admin all" on public.forum_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- forum_replies ----------------------------------------------------------
-- Readable when the parent post is readable (subquery runs under the caller's
-- forum_posts policy) and the reply is visible or the caller's own.
drop policy if exists "forum_replies: read" on public.forum_replies;
create policy "forum_replies: read" on public.forum_replies
  for select to authenticated using (
    public.is_admin()
    or (
      exists (select 1 from public.forum_posts p where p.id = forum_replies.post_id)
      and (status = 'visible' or user_id = auth.uid())
    )
  );

drop policy if exists "forum_replies: own insert" on public.forum_replies;
create policy "forum_replies: own insert" on public.forum_replies
  for insert to authenticated with check (
    user_id = auth.uid()
    and status = 'visible'
    and like_count = 0
    and exists (select 1 from public.forum_posts p where p.id = post_id and p.locked = false and p.status = 'visible')
  );

drop policy if exists "forum_replies: own update" on public.forum_replies;
create policy "forum_replies: own update" on public.forum_replies
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "forum_replies: own delete" on public.forum_replies;
create policy "forum_replies: own delete" on public.forum_replies
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "forum_replies: admin all" on public.forum_replies;
create policy "forum_replies: admin all" on public.forum_replies
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- forum_likes ------------------------------------------------------------
drop policy if exists "forum_likes: own read" on public.forum_likes;
create policy "forum_likes: own read" on public.forum_likes
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "forum_likes: own insert" on public.forum_likes;
create policy "forum_likes: own insert" on public.forum_likes
  for insert to authenticated with check (
    user_id = auth.uid()
    and (post_id is null or exists (select 1 from public.forum_posts p where p.id = post_id))
    and (reply_id is null or exists (select 1 from public.forum_replies r where r.id = reply_id))
  );

drop policy if exists "forum_likes: own delete" on public.forum_likes;
create policy "forum_likes: own delete" on public.forum_likes
  for delete to authenticated using (user_id = auth.uid());

drop policy if exists "forum_likes: admin all" on public.forum_likes;
create policy "forum_likes: admin all" on public.forum_likes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- forum_reports ----------------------------------------------------------
drop policy if exists "forum_reports: own read" on public.forum_reports;
create policy "forum_reports: own read" on public.forum_reports
  for select to authenticated using (reporter_user_id = auth.uid());

drop policy if exists "forum_reports: own insert" on public.forum_reports;
create policy "forum_reports: own insert" on public.forum_reports
  for insert to authenticated with check (reporter_user_id = auth.uid() and status = 'open');

drop policy if exists "forum_reports: admin all" on public.forum_reports;
create policy "forum_reports: admin all" on public.forum_reports
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- certificates -----------------------------------------------------------
drop policy if exists "certificates: own read" on public.certificates;
create policy "certificates: own read" on public.certificates
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "certificates: admin all" on public.certificates;
create policy "certificates: admin all" on public.certificates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public verification goes through the certificate_public view (below).
revoke all on public.certificates from anon;

-- ---- testimonials -----------------------------------------------------------
drop policy if exists "testimonials: read" on public.testimonials;
create policy "testimonials: read" on public.testimonials
  for select to anon, authenticated using (
    status = 'approved' or user_id = auth.uid() or public.is_admin()
  );

drop policy if exists "testimonials: own insert" on public.testimonials;
create policy "testimonials: own insert" on public.testimonials
  for insert to authenticated with check (
    user_id = auth.uid() and status = 'pending' and featured = false and reviewed_at is null
  );

drop policy if exists "testimonials: admin all" on public.testimonials;
create policy "testimonials: admin all" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- operations tables: admin read only; service role writes ---------------
drop policy if exists "email_events: admin read" on public.email_events;
create policy "email_events: admin read" on public.email_events
  for select to authenticated using (public.is_admin());

drop policy if exists "broadcasts: admin read" on public.broadcasts;
create policy "broadcasts: admin read" on public.broadcasts
  for select to authenticated using (public.is_admin());

drop policy if exists "audit_log: admin read" on public.audit_log;
create policy "audit_log: admin read" on public.audit_log
  for select to authenticated using (public.is_admin());

drop policy if exists "webhook_events: admin read" on public.webhook_events;
create policy "webhook_events: admin read" on public.webhook_events
  for select to authenticated using (public.is_admin());

drop policy if exists "contact_messages: admin read" on public.contact_messages;
create policy "contact_messages: admin read" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "newsletter_signups: admin read" on public.newsletter_signups;
create policy "newsletter_signups: admin read" on public.newsletter_signups
  for select to authenticated using (public.is_admin());

-- ---- site_settings ----------------------------------------------------------
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings: admin write" on public.site_settings;
create policy "site_settings: admin write" on public.site_settings
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- ============================================================================
-- Views that are the intended path for cross-user reads.
-- Both are SECURITY DEFINER views (security_invoker = false): they run with the
-- owner's rights, so the WHERE clause inside the view is the access control.
-- security_barrier stops leaky functions from seeing filtered rows.
-- (Supabase's advisor flags definer views in `public`; that is intended here.)
-- ============================================================================

-- Admins see WHO completed WHICH quiz and WHEN — never the answers or score.
create or replace view public.quiz_completion_status
with (security_invoker = false, security_barrier = true) as
  select r.id, r.user_id, r.quiz_key, r.course_id, r.submitted_at
    from public.quiz_responses r
   where public.is_admin() or r.user_id = auth.uid();

comment on view public.quiz_completion_status is
  'Completion status of quiz/survey submissions (no answers). Admins: all rows; learners: their own.';

revoke all on public.quiz_completion_status from public;
revoke all on public.quiz_completion_status from anon;
grant select on public.quiz_completion_status to authenticated, service_role;

-- Public certificate verification (/verify/<code>): no user ids, no emails.
create or replace view public.certificate_public
with (security_invoker = false, security_barrier = true) as
  select c.verify_code, c.learner_name, c.course_title, c.issued_at, c.revoked_at
    from public.certificates c;

comment on view public.certificate_public is
  'Public fields of certificates for /verify/<code>. Look up by verify_code.';

revoke all on public.certificate_public from public;
grant select on public.certificate_public to anon, authenticated, service_role;

-- ============================================================================
-- Table grants for anon: select only where a public-read policy exists.
-- (RLS already denies everything else; this keeps the surface explicit.)
-- ============================================================================

revoke all on all tables in schema public from anon;
grant select on
  public.courses, public.modules, public.lessons, public.action_steps,
  public.products, public.coupons, public.badges, public.testimonials, public.site_settings,
  public.certificate_public
to anon;
