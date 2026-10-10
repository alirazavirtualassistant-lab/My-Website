-- ============================================================================
-- Local-Postgres shim for the Supabase-only objects our migrations rely on.
--
-- Supabase provides the `auth` and `storage` schemas, auth.uid(), and the
-- anon / authenticated / service_role roles. A plain Postgres (the throwaway
-- instance scripts/db-check.ts targets) has none of them, so this file creates
-- minimal stand-ins. It is NEVER applied to a real Supabase project.
-- ============================================================================

-- Roles are cluster-wide; create them only when missing.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    -- Supabase's service_role bypasses RLS; mirror that.
    create role service_role nologin bypassrls;
  end if;
end;
$$;

-- auth schema -----------------------------------------------------------------
create schema if not exists auth;

create table if not exists auth.users (
  id                 uuid primary key default gen_random_uuid(),
  email              text,
  raw_user_meta_data jsonb,
  created_at         timestamptz not null default now()
);

-- Supabase's auth.uid() reads the JWT claims; locally we read a GUC that the
-- smoke test sets with set_config('request.jwt.claim.sub', '<uuid>', true).
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create or replace function auth.role()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.role', true), '');
$$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant execute on function auth.role() to anon, authenticated, service_role;

-- storage schema --------------------------------------------------------------
create schema if not exists storage;

create table if not exists storage.buckets (
  id     text primary key,
  name   text not null,
  public boolean not null default false
);

create table if not exists storage.objects (
  id         uuid primary key default gen_random_uuid(),
  bucket_id  text references storage.buckets (id),
  name       text,
  owner      uuid,
  created_at timestamptz not null default now()
);

grant usage on schema storage to anon, authenticated, service_role;
grant all on storage.buckets, storage.objects to service_role;
grant select, insert, update, delete on storage.buckets, storage.objects to anon, authenticated;
