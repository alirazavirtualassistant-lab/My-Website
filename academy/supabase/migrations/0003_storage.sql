-- ============================================================================
-- Cradle Your Cravings Academy — 0003_storage.sql
--
-- Storage buckets + storage.objects policies. Bucket names match the `Bucket`
-- type in src/services/types.ts exactly.
--
--   course-resources  private  Learner-facing course files (PDF/XLSX/MP3…).
--                              Served ONLY through short-lived signed URLs
--                              that the server creates with the service role,
--                              so there is deliberately NO select policy for
--                              anon/authenticated.
--   learner-uploads   private  Action-step uploads, journals. Objects live
--                              under "<auth.uid()>/…"; owners may read, add,
--                              replace and delete their own prefix. No admin
--                              policy on purpose (uploads are private).
--   public-assets     public   Course thumbnails, logo, OG images. Anyone can
--                              read; admins write.
--   video-uploads     private  Self-hosted lesson video sources. Admins only.
--
-- Supabase's `postgres` role may create policies on storage.objects, and RLS
-- is already enabled there; the ALTER below is a harmless no-op on Supabase
-- and makes the local validator behave the same way.
-- ============================================================================

set client_min_messages to warning;

insert into storage.buckets (id, name, public)
values
  ('course-resources', 'course-resources', false),
  ('learner-uploads',  'learner-uploads',  false),
  ('public-assets',    'public-assets',    true),
  ('video-uploads',    'video-uploads',    false)
on conflict (id) do update set
  name   = excluded.name,
  public = excluded.public;

-- Size limits / MIME allow-lists are left at the project defaults here so the
-- same SQL works on every plan; tune them in the dashboard (Storage → bucket)
-- or add `file_size_limit` / `allowed_mime_types` to the insert above.

alter table storage.objects enable row level security;

-- Helper: first path segment of an object name ("<uid>/photo.jpg" → "<uid>").
-- Supabase ships storage.foldername(); split_part keeps this file portable.
create or replace function public.storage_owner_prefix(object_name text)
returns text
language sql
immutable
as $$
  select split_part(coalesce(object_name, ''), '/', 1);
$$;

grant execute on function public.storage_owner_prefix(text) to anon, authenticated, service_role;

-- ---- course-resources: service role only (signed URLs) ----------------------
-- (no policies: anon/authenticated cannot list, read, write or delete)

-- ---- learner-uploads: owner prefix only -------------------------------------
drop policy if exists "learner-uploads: own read" on storage.objects;
create policy "learner-uploads: own read" on storage.objects
  for select to authenticated using (
    bucket_id = 'learner-uploads'
    and public.storage_owner_prefix(name) = auth.uid()::text
  );

drop policy if exists "learner-uploads: own insert" on storage.objects;
create policy "learner-uploads: own insert" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'learner-uploads'
    and public.storage_owner_prefix(name) = auth.uid()::text
  );

drop policy if exists "learner-uploads: own update" on storage.objects;
create policy "learner-uploads: own update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'learner-uploads'
    and public.storage_owner_prefix(name) = auth.uid()::text
  )
  with check (
    bucket_id = 'learner-uploads'
    and public.storage_owner_prefix(name) = auth.uid()::text
  );

drop policy if exists "learner-uploads: own delete" on storage.objects;
create policy "learner-uploads: own delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'learner-uploads'
    and public.storage_owner_prefix(name) = auth.uid()::text
  );

-- ---- public-assets: public read, admin write --------------------------------
drop policy if exists "public-assets: public read" on storage.objects;
create policy "public-assets: public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'public-assets');

drop policy if exists "public-assets: admin insert" on storage.objects;
create policy "public-assets: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'public-assets' and public.is_admin());

drop policy if exists "public-assets: admin update" on storage.objects;
create policy "public-assets: admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'public-assets' and public.is_admin())
  with check (bucket_id = 'public-assets' and public.is_admin());

drop policy if exists "public-assets: admin delete" on storage.objects;
create policy "public-assets: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'public-assets' and public.is_admin());

-- ---- video-uploads: admin only ----------------------------------------------
drop policy if exists "video-uploads: admin all" on storage.objects;
create policy "video-uploads: admin all" on storage.objects
  for all to authenticated
  using (bucket_id = 'video-uploads' and public.is_admin())
  with check (bucket_id = 'video-uploads' and public.is_admin());
