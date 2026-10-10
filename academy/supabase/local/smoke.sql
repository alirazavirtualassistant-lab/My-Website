-- ============================================================================
-- Smoke test for the migrations, run by scripts/db-check.ts against a fresh
-- local database that already has shim.sql + migrations + seed.sql applied.
--
-- Every block raises NOTICE 'PASS: …' or EXCEPTION 'FAIL: …'. Nothing here is
-- ever applied to a real Supabase project.
--
-- Fixed ids used throughout:
--   learner A   11111111-1111-4111-8111-111111111111
--   learner B   22222222-2222-4222-8222-222222222222
--   admin  C    33333333-3333-4333-8333-333333333333
--   course (published) aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa
--   course (draft)     bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb
--   module M1          cccccccc-cccc-4ccc-8ccc-cccccccccccc
--   lesson preview     dddddddd-dddd-4ddd-8ddd-dddddddddddd
--   lesson gated       eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee
--   lesson draft       ffffffff-ffff-4fff-8fff-ffffffffffff
-- ============================================================================

set client_min_messages to notice;

-- ----------------------------------------------------------------------------
-- 1. auth.users insert → profiles row via handle_new_user()
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  v_name text;
  v_role text;
  v_email text;
  v_avatar text;
begin
  insert into auth.users (id, email, raw_user_meta_data) values
    ('11111111-1111-4111-8111-111111111111', 'Learner.A@Example.com',
     '{"name": "Learner A", "avatar": "https://example.com/a.png"}'),
    ('22222222-2222-4222-8222-222222222222', 'learner.b@example.com', '{}'),
    ('33333333-3333-4333-8333-333333333333', 'admin@example.com',
     '{"full_name": "Cynthia", "role": "admin"}');

  select count(*) into n from public.profiles
   where id in ('11111111-1111-4111-8111-111111111111',
                '22222222-2222-4222-8222-222222222222',
                '33333333-3333-4333-8333-333333333333');
  if n <> 3 then
    raise exception 'FAIL: handle_new_user created % profile rows, expected 3', n;
  end if;

  select name, role, email, avatar_url into v_name, v_role, v_email, v_avatar
    from public.profiles where id = '11111111-1111-4111-8111-111111111111';
  if v_name <> 'Learner A' or v_role <> 'learner' or v_email <> 'learner.a@example.com'
     or v_avatar <> 'https://example.com/a.png' then
    raise exception 'FAIL: profile A fields wrong: name=% role=% email=% avatar=%', v_name, v_role, v_email, v_avatar;
  end if;

  select name into v_name from public.profiles where id = '22222222-2222-4222-8222-222222222222';
  if v_name <> 'learner.b' then
    raise exception 'FAIL: profile B fallback name wrong: %', v_name;
  end if;

  select name, role into v_name, v_role from public.profiles where id = '33333333-3333-4333-8333-333333333333';
  if v_name <> 'Cynthia' then
    raise exception 'FAIL: full_name metadata not used: %', v_name;
  end if;
  if v_role <> 'learner' then
    raise exception 'FAIL: role was taken from client metadata (%). It must always default to learner.', v_role;
  end if;

  raise notice 'PASS: auth.users insert creates profiles (name/avatar from metadata, email lower-cased, role never from metadata)';

  -- Email sync trigger
  update auth.users set email = 'Learner.A2@example.com' where id = '11111111-1111-4111-8111-111111111111';
  select email into v_email from public.profiles where id = '11111111-1111-4111-8111-111111111111';
  if v_email <> 'learner.a2@example.com' then
    raise exception 'FAIL: profiles.email not synced from auth.users: %', v_email;
  end if;
  raise notice 'PASS: auth.users email change syncs profiles.email';

  -- Server-side promotion (service context: no RLS, trigger allows it)
  update public.profiles set role = 'admin' where id = '33333333-3333-4333-8333-333333333333';
end;
$$;

-- ----------------------------------------------------------------------------
-- 2. Seed content as the server would (no RLS for the owner)
-- ----------------------------------------------------------------------------
do $$
begin
  insert into public.courses (id, slug, title, status, created_at, updated_at)
  values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'smoke-course', 'Smoke course', 'published',
          '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z'),
         ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'smoke-draft', 'Smoke draft', 'draft',
          '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z');

  insert into public.modules (id, course_id, code, kind, title, position, completion_xp)
  values ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'M1', 'core', 'Module 1', 1, 10);

  insert into public.lessons (id, module_id, course_id, code, title, is_preview, status, transcript)
  values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'M1T0', 'Preview lesson', true, 'published', 'preview transcript'),
         ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'M1T1', 'Gated lesson', false, 'published', 'gated transcript'),
         ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'M1T2', 'Draft lesson', false, 'draft', 'draft transcript');

  insert into public.lesson_resources (course_id, lesson_id, module_id, file_path, label, file_name, type)
  values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', null,
          'smoke-course/M1T1_Worksheet.pdf', 'Worksheet', 'M1T1_Worksheet.pdf', 'pdf'),
         ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', null, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
          'smoke-course/M1_Guide.pdf', 'Module guide', 'M1_Guide.pdf', 'pdf');

  insert into public.action_steps (lesson_id, course_id, label, source_label, kind, xp, position)
  values ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Watch', 'Watch', 'consumption', 5, 0),
         ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Do it', 'Do it', 'implementation', 20, 0);

  insert into public.quiz_definitions (key, course_id, title)
  values ('smoke-quiz', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Smoke quiz');

  insert into public.forum_categories (course_id, module_id, slug, title)
  values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'module-1', 'Module 1');

  -- B is enrolled; A is not (yet)
  insert into public.enrollments (user_id, course_id, source, status)
  values ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'purchase', 'active');

  -- Private learner content for A and B
  insert into public.notes (user_id, lesson_id, course_id, body)
  values ('11111111-1111-4111-8111-111111111111', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'A private note'),
         ('22222222-2222-4222-8222-222222222222', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'B private note');

  insert into public.quiz_responses (user_id, quiz_key, course_id, answers, score)
  values ('11111111-1111-4111-8111-111111111111', 'smoke-quiz', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '{"q1": 3}', 3),
         ('22222222-2222-4222-8222-222222222222', 'smoke-quiz', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '{"q1": 5}', 5);

  insert into public.xp_ledger (user_id, course_id, amount, reason, ref_id)
  values ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 20, 'action_step', 'x');

  insert into public.certificates (user_id, course_id, verify_code, learner_name, course_title)
  values ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'SMOKE12345', 'Learner B', 'Smoke course');

  insert into public.testimonials (user_id, course_id, author_name, body, status)
  values ('22222222-2222-4222-8222-222222222222', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Learner B', 'Approved words', 'approved'),
         ('11111111-1111-4111-8111-111111111111', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Learner A', 'Pending words', 'pending');

  insert into public.email_events ("to", template, subject, provider, status)
  values ('learner.b@example.com', 'welcome', 'Welcome', 'mock', 'sent');

  insert into storage.objects (bucket_id, name)
  values ('course-resources', 'smoke-course/M1T1_Worksheet.pdf'),
         ('public-assets', 'logo.png'),
         ('learner-uploads', '22222222-2222-4222-8222-222222222222/journal.txt');

  raise notice 'PASS: server-side content inserts (all constraints satisfied)';
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. Learner A (signed in, NOT enrolled)
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  v text;
  caught boolean;
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  set local role authenticated;

  if auth.uid() <> '11111111-1111-4111-8111-111111111111' then
    raise exception 'FAIL: auth.uid() shim not working';
  end if;

  -- notes: only own
  select count(*) into n from public.notes;
  if n <> 1 then raise exception 'FAIL: learner sees % notes, expected only their own (1)', n; end if;
  select count(*) into n from public.notes where user_id = '22222222-2222-4222-8222-222222222222';
  if n <> 0 then raise exception 'FAIL: learner can read another user''s notes'; end if;
  raise notice 'PASS: learner cannot read another user''s notes';

  -- profiles: only own
  select count(*) into n from public.profiles;
  if n <> 1 then raise exception 'FAIL: learner sees % profiles, expected 1', n; end if;

  -- courses: published only
  select count(*) into n from public.courses where slug = 'smoke-course';
  if n <> 1 then raise exception 'FAIL: learner cannot read the published course'; end if;
  select count(*) into n from public.courses where slug = 'smoke-draft';
  if n <> 0 then raise exception 'FAIL: learner can read a draft course'; end if;
  raise notice 'PASS: learner can read a published course but not a draft one';

  -- lessons: preview only without enrolment
  select count(*) into n from public.lessons;
  if n <> 1 then raise exception 'FAIL: unenrolled learner sees % lessons, expected 1 (preview only)', n; end if;
  select count(*) into n from public.lessons where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
  if n <> 0 then raise exception 'FAIL: unenrolled learner can read a non-preview lesson'; end if;
  raise notice 'PASS: learner cannot read a non-preview lesson without an enrollment (preview lesson is visible)';

  select count(*) into n from public.lesson_resources;
  if n <> 0 then raise exception 'FAIL: unenrolled learner sees % lesson_resources', n; end if;
  select count(*) into n from public.action_steps;
  if n <> 1 then raise exception 'FAIL: unenrolled learner sees % action steps, expected 1 (preview lesson)', n; end if;
  select count(*) into n from public.forum_categories;
  if n <> 0 then raise exception 'FAIL: unenrolled learner sees forum categories'; end if;
  select count(*) into n from public.quiz_definitions;
  if n <> 0 then raise exception 'FAIL: unenrolled learner sees course quiz definitions'; end if;
  raise notice 'PASS: resources, action steps, forum categories and quizzes are enrolment-gated';

  -- own private rows & views
  select count(*) into n from public.quiz_responses;
  if n <> 1 then raise exception 'FAIL: learner sees % quiz responses, expected 1', n; end if;
  select count(*) into n from public.quiz_completion_status;
  if n <> 1 then raise exception 'FAIL: learner sees % quiz_completion_status rows, expected 1', n; end if;
  select count(*) into n from public.certificates;
  if n <> 0 then raise exception 'FAIL: learner A sees % certificates (has none)', n; end if;
  select count(*) into n from public.certificate_public where verify_code = 'SMOKE12345';
  if n <> 1 then raise exception 'FAIL: certificate_public view not readable'; end if;
  select count(*) into n from public.testimonials;
  if n <> 2 then raise exception 'FAIL: learner sees % testimonials, expected 2 (approved + own pending)', n; end if;
  select count(*) into n from public.badges;
  if n <> 12 then raise exception 'FAIL: learner sees % badges, expected 12 from seed.sql', n; end if;
  raise notice 'PASS: own quiz responses, public certificate view, approved+own testimonials, badge catalogue';

  -- own profile update OK; role change blocked
  update public.profiles set name = 'Learner A (edited)' where id = auth.uid();
  select name into v from public.profiles where id = auth.uid();
  if v <> 'Learner A (edited)' then raise exception 'FAIL: learner cannot update own name'; end if;

  caught := false;
  begin
    update public.profiles set role = 'admin' where id = auth.uid();
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner changed their own role'; end if;

  caught := false;
  begin
    update public.profiles set email = 'hacker@example.com' where id = auth.uid();
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner changed their own email directly'; end if;
  raise notice 'PASS: learner can edit own profile but not role/email';

  -- writes that must be refused
  caught := false;
  begin
    insert into public.xp_ledger (user_id, amount, reason) values (auth.uid(), 1000, 'admin_adjustment');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner inserted into xp_ledger'; end if;

  caught := false;
  begin
    insert into public.notes (user_id, lesson_id, course_id, body)
    values ('22222222-2222-4222-8222-222222222222', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
            'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'forged');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner inserted a note as another user'; end if;

  caught := false;
  begin
    insert into public.enrollments (user_id, course_id, source) values (auth.uid(), 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'free');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner self-enrolled'; end if;
  raise notice 'PASS: learner cannot write xp_ledger, forge notes or self-enrol';

  -- own note insert OK
  insert into public.notes (user_id, lesson_id, course_id, body)
  values (auth.uid(), 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'second note');
  select count(*) into n from public.notes;
  if n <> 2 then raise exception 'FAIL: own note insert not visible'; end if;

  -- storage: own prefix only
  insert into storage.objects (bucket_id, name) values ('learner-uploads', '11111111-1111-4111-8111-111111111111/photo.jpg');
  caught := false;
  begin
    insert into storage.objects (bucket_id, name) values ('learner-uploads', '22222222-2222-4222-8222-222222222222/photo.jpg');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner uploaded into another user''s prefix'; end if;
  select count(*) into n from storage.objects where bucket_id = 'learner-uploads';
  if n <> 1 then raise exception 'FAIL: learner sees % learner-uploads objects, expected 1', n; end if;
  select count(*) into n from storage.objects where bucket_id = 'course-resources';
  if n <> 0 then raise exception 'FAIL: learner can list course-resources objects directly'; end if;
  select count(*) into n from storage.objects where bucket_id = 'public-assets';
  if n <> 1 then raise exception 'FAIL: learner cannot read public-assets'; end if;
  caught := false;
  begin
    insert into storage.objects (bucket_id, name) values ('video-uploads', 'x.mp4');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner uploaded into video-uploads'; end if;
  raise notice 'PASS: storage — own learner-uploads prefix only; course-resources hidden; public-assets readable; video-uploads refused';
end;
$$;

-- ----------------------------------------------------------------------------
-- 4. Enrol A, then check gated content + forum behaviour
-- ----------------------------------------------------------------------------
insert into public.enrollments (id, user_id, course_id, source, status)
values ('99999999-9999-4999-8999-999999999999', '11111111-1111-4111-8111-111111111111',
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'purchase', 'active');

do $$
declare
  n int;
  caught boolean;
  post_id uuid;
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
  set local role authenticated;

  select count(*) into n from public.lessons;
  if n <> 2 then raise exception 'FAIL: enrolled learner sees % lessons, expected 2 (draft hidden)', n; end if;
  select count(*) into n from public.lesson_resources;
  if n <> 2 then raise exception 'FAIL: enrolled learner sees % resources, expected 2', n; end if;
  select count(*) into n from public.action_steps;
  if n <> 2 then raise exception 'FAIL: enrolled learner sees % action steps, expected 2', n; end if;
  select count(*) into n from public.quiz_definitions;
  if n <> 1 then raise exception 'FAIL: enrolled learner sees % quiz definitions, expected 1', n; end if;
  select count(*) into n from public.enrollments;
  if n <> 1 then raise exception 'FAIL: learner sees % enrollments, expected own 1', n; end if;
  raise notice 'PASS: after enrolment the gated lesson, resources, steps and quizzes are readable (draft lesson still hidden)';

  -- forum
  select count(*) into n from public.forum_categories;
  if n <> 1 then raise exception 'FAIL: enrolled learner sees % forum categories', n; end if;

  insert into public.forum_posts (category_id, course_id, user_id, title, body)
  select c.id, c.course_id, auth.uid(), 'Hello', 'First post'
    from public.forum_categories c where c.slug = 'module-1'
  returning id into post_id;

  caught := false;
  begin
    insert into public.forum_posts (category_id, course_id, user_id, title, body, pinned)
    select c.id, c.course_id, auth.uid(), 'Sneaky', 'pinned', true
      from public.forum_categories c where c.slug = 'module-1';
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner created a pinned post'; end if;

  update public.forum_posts set title = 'Hello (edited)' where id = post_id;
  caught := false;
  begin
    update public.forum_posts set like_count = 999 where id = post_id;
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: learner changed like_count on own post'; end if;

  insert into public.forum_replies (post_id, user_id, body) values (post_id, auth.uid(), 'reply');
  insert into public.forum_likes (user_id, post_id) values (auth.uid(), post_id);
  insert into public.forum_reports (reporter_user_id, post_id, reason) values (auth.uid(), post_id, 'test');
  raise notice 'PASS: forum — enrolled learner can post/reply/like/report; moderation fields are protected';

  -- action step completion + progress (own)
  insert into public.lesson_progress (user_id, lesson_id, course_id, completed_at)
  values (auth.uid(), 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', now());
  insert into public.action_step_completions (user_id, step_id, lesson_id, course_id, completed_at)
  select auth.uid(), s.id, s.lesson_id, s.course_id, now()
    from public.action_steps s where s.lesson_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
  raise notice 'PASS: learner records own lesson_progress and action_step_completions';
end;
$$;

-- Expired enrolment → gated content disappears again
update public.enrollments set expires_at = now() - interval '1 day' where id = '99999999-9999-4999-8999-999999999999';
do $$
declare n int;
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
  set local role authenticated;
  select count(*) into n from public.lessons;
  if n <> 1 then raise exception 'FAIL: expired enrolment still sees % lessons', n; end if;
  raise notice 'PASS: an expired enrolment no longer unlocks gated lessons';
end;
$$;
update public.enrollments set expires_at = null where id = '99999999-9999-4999-8999-999999999999';

-- ----------------------------------------------------------------------------
-- 5. Admin C
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  caught boolean;
begin
  perform set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
  set local role authenticated;

  if not public.is_admin() or not public.is_super_admin() then
    raise exception 'FAIL: is_admin()/is_super_admin() false for admin';
  end if;

  select count(*) into n from public.profiles;
  if n <> 3 then raise exception 'FAIL: admin sees % profiles, expected 3', n; end if;
  select count(*) into n from public.lessons;
  if n <> 3 then raise exception 'FAIL: admin sees % lessons, expected 3 (incl. draft)', n; end if;
  select count(*) into n from public.courses;
  if n <> 2 then raise exception 'FAIL: admin sees % courses, expected 2', n; end if;
  select count(*) into n from public.enrollments;
  if n <> 2 then raise exception 'FAIL: admin sees % enrollments, expected 2', n; end if;
  select count(*) into n from public.lesson_progress;
  if n <> 1 then raise exception 'FAIL: admin sees % lesson_progress rows, expected 1', n; end if;
  select count(*) into n from public.email_events;
  if n <> 1 then raise exception 'FAIL: admin sees % email_events, expected 1', n; end if;
  select count(*) into n from public.forum_reports;
  if n <> 1 then raise exception 'FAIL: admin sees % forum reports, expected 1', n; end if;
  raise notice 'PASS: admin reads profiles, all content, enrollments, progress, operations tables';

  -- privacy: NO notes / quiz answers, only completion status
  select count(*) into n from public.notes;
  if n <> 0 then raise exception 'FAIL: admin can read learner notes (% rows)', n; end if;
  select count(*) into n from public.quiz_responses;
  if n <> 0 then raise exception 'FAIL: admin can read quiz answers (% rows)', n; end if;
  select count(*) into n from public.quiz_completion_status;
  if n <> 2 then raise exception 'FAIL: admin sees % quiz_completion_status rows, expected 2', n; end if;
  select count(*) into n from storage.objects where bucket_id = 'learner-uploads';
  if n <> 0 then raise exception 'FAIL: admin can list learner uploads'; end if;
  raise notice 'PASS: admin cannot read notes, quiz answers or learner uploads; sees quiz completion status only';

  -- admin writes
  update public.site_settings set site_name = 'Smoke Academy' where id = 'default';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL: admin could not update site_settings'; end if;
  update public.profiles set role = 'assistant' where id = '22222222-2222-4222-8222-222222222222';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL: admin could not change a role'; end if;
  update public.forum_posts set pinned = true where title = 'Hello (edited)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL: admin could not pin a post'; end if;
  insert into storage.objects (bucket_id, name) values ('video-uploads', 'lesson.mp4');
  insert into storage.objects (bucket_id, name) values ('public-assets', 'thumb.png');
  raise notice 'PASS: admin updates settings, roles, moderates posts, writes video-uploads/public-assets';
end;
$$;

-- ----------------------------------------------------------------------------
-- 6. Assistant B (admin minus billing/settings/team)
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  caught boolean;
begin
  perform set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
  set local role authenticated;

  if not public.is_admin() or public.is_super_admin() then
    raise exception 'FAIL: assistant role helpers wrong';
  end if;
  select count(*) into n from public.profiles;
  if n <> 3 then raise exception 'FAIL: assistant sees % profiles, expected 3', n; end if;

  update public.site_settings set site_name = 'Nope' where id = 'default';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL: assistant updated site_settings'; end if;

  caught := false;
  begin
    update public.profiles set role = 'admin' where id = '11111111-1111-4111-8111-111111111111';
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: assistant changed a role'; end if;

  select count(*) into n from public.notes;
  if n <> 1 then raise exception 'FAIL: assistant sees % notes, expected only own (1)', n; end if;
  raise notice 'PASS: assistant reads like an admin but cannot change settings or roles, and sees only own notes';
end;
$$;

-- ----------------------------------------------------------------------------
-- 7. Anonymous visitor
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  caught boolean;
begin
  perform set_config('request.jwt.claim.sub', '', true);
  set local role anon;

  select count(*) into n from public.courses;
  if n <> 1 then raise exception 'FAIL: anon sees % courses, expected 1', n; end if;
  select count(*) into n from public.lessons;
  if n <> 1 then raise exception 'FAIL: anon sees % lessons, expected 1 (preview)', n; end if;
  select count(*) into n from public.certificate_public where verify_code = 'SMOKE12345';
  if n <> 1 then raise exception 'FAIL: anon cannot verify a certificate'; end if;
  select count(*) into n from public.testimonials;
  if n <> 1 then raise exception 'FAIL: anon sees % testimonials, expected 1 approved', n; end if;
  select count(*) into n from public.site_settings;
  if n <> 1 then raise exception 'FAIL: anon cannot read site_settings'; end if;
  select count(*) into n from storage.objects where bucket_id = 'public-assets';
  if n <> 2 then raise exception 'FAIL: anon sees % public-assets objects, expected 2', n; end if;
  select count(*) into n from storage.objects where bucket_id <> 'public-assets';
  if n <> 0 then raise exception 'FAIL: anon sees private storage objects'; end if;

  caught := false;
  begin
    select count(*) into n from public.profiles;
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: anon has select on profiles'; end if;

  caught := false;
  begin
    select count(*) into n from public.certificates;
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: anon has select on certificates (must use certificate_public)'; end if;

  caught := false;
  begin
    select count(*) into n from public.notes;
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: anon has select on notes'; end if;

  caught := false;
  begin
    insert into public.newsletter_signups (email) values ('x@example.com');
  exception when insufficient_privilege then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: anon inserted newsletter_signups'; end if;

  raise notice 'PASS: anon reads published course/preview lesson/approved testimonials/settings/public certificate view and nothing private';
end;
$$;

-- ----------------------------------------------------------------------------
-- 8. Constraints & triggers (server context)
-- ----------------------------------------------------------------------------
do $$
declare
  n int;
  caught boolean;
  ts timestamptz;
begin
  -- updated_at trigger
  update public.courses set title = 'Smoke course (edited)' where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  select updated_at into ts from public.courses where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  if ts <= '2020-01-01T00:00:00Z'::timestamptz then raise exception 'FAIL: set_updated_at did not fire'; end if;
  raise notice 'PASS: set_updated_at trigger';

  -- webhook idempotency
  insert into public.webhook_events (id, provider, type) values ('evt_1', 'stripe', 'checkout.session.completed');
  caught := false;
  begin
    insert into public.webhook_events (id, provider, type) values ('evt_1', 'stripe', 'checkout.session.completed');
  exception when unique_violation then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: duplicate webhook event accepted'; end if;

  -- unique lower(email) on profiles (via auth trigger)
  caught := false;
  begin
    insert into auth.users (id, email) values ('44444444-4444-4444-8444-444444444444', 'LEARNER.B@EXAMPLE.COM');
  exception when unique_violation then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: duplicate email (case-insensitive) accepted'; end if;

  -- lesson_progress unique (user, lesson)
  caught := false;
  begin
    insert into public.lesson_progress (user_id, lesson_id, course_id)
    values ('11111111-1111-4111-8111-111111111111', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  exception when unique_violation then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: duplicate lesson_progress accepted'; end if;

  -- quiz retakes allowed (history kept)
  insert into public.quiz_responses (user_id, quiz_key, course_id, answers)
  values ('11111111-1111-4111-8111-111111111111', 'smoke-quiz', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '{"q1": 4}');
  select count(*) into n from public.quiz_responses where user_id = '11111111-1111-4111-8111-111111111111';
  if n <> 2 then raise exception 'FAIL: quiz retake not stored'; end if;

  -- forum_likes needs exactly one target
  caught := false;
  begin
    insert into public.forum_likes (user_id) values ('11111111-1111-4111-8111-111111111111');
  exception when check_violation then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: forum_like without target accepted'; end if;

  -- enum-like check
  caught := false;
  begin
    update public.profiles set role = 'superuser' where id = '11111111-1111-4111-8111-111111111111';
  exception when check_violation then
    caught := true;
  end;
  if not caught then raise exception 'FAIL: invalid role accepted'; end if;

  -- cascade: deleting the auth user removes profile + learner rows
  delete from auth.users where id = '11111111-1111-4111-8111-111111111111';
  select count(*) into n from public.notes where user_id = '11111111-1111-4111-8111-111111111111';
  if n <> 0 then raise exception 'FAIL: notes survived auth.users delete'; end if;
  select count(*) into n from public.profiles where id = '11111111-1111-4111-8111-111111111111';
  if n <> 0 then raise exception 'FAIL: profile survived auth.users delete'; end if;

  raise notice 'PASS: webhook idempotency, unique lower(email), unique lesson_progress, quiz retakes kept, forum_like target check, role check, auth cascade';
end;
$$;

do $$
begin
  raise notice 'SMOKE TEST PASSED';
end;
$$;
