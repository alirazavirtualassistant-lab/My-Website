-- ============================================================================
-- Cradle Your Cravings Academy — static seed (badges + default site settings)
--
-- Safe to run repeatedly. Course content, products and files are seeded by
-- `npm run seed` (scripts/seed.ts), which also re-applies this badge list.
-- Supabase CLI runs this automatically on `supabase db reset` when
-- config.toml points `[db.seed] sql_paths` at it.
-- ============================================================================

-- Badges -----------------------------------------------------------------------
-- module:M1..M7  awarded when every lesson of a core module is complete.
--                xp_bonus = 0: the XP for finishing a module is the module's
--                own completion_xp (10), not the badge.
-- goal:*         the Welcome Guide's course goals (50 / 100 / 150 XP), awarded
--                after M1, M1–M4 and M1–M7 respectively (DECISIONS.md).
-- streak:*       7- and 30-day activity streaks.
insert into public.badges (key, title, description, icon, xp_bonus)
values
  ('module:M1', 'Module 1 complete', 'Every lesson in Module 1 finished.', 'leaf', 0),
  ('module:M2', 'Module 2 complete', 'Every lesson in Module 2 finished.', 'leaf', 0),
  ('module:M3', 'Module 3 complete', 'Every lesson in Module 3 finished.', 'leaf', 0),
  ('module:M4', 'Module 4 complete', 'Every lesson in Module 4 finished.', 'leaf', 0),
  ('module:M5', 'Module 5 complete', 'Every lesson in Module 5 finished.', 'leaf', 0),
  ('module:M6', 'Module 6 complete', 'Every lesson in Module 6 finished.', 'leaf', 0),
  ('module:M7', 'Module 7 complete', 'Every lesson in Module 7 finished.', 'leaf', 0),
  ('goal:minimum', 'Minimum goal',
   'Identify your personal health barriers (such as cravings) and set your first wellness habits.',
   'sprout', 50),
  ('goal:target', 'Target goal',
   'Reach a solid pre-conception baseline for you and your partner, including balanced nutrition and lower stress.',
   'flower', 100),
  ('goal:stretch', 'Stretch goal',
   'Reduce toxins, build strong family bonds, and prepare a multi-generational legacy of health with sustained vitality.',
   'sun', 150),
  ('streak:7', '7-day streak', 'Showed up seven days in a row.', 'flame', 0),
  ('streak:30', '30-day streak', 'Showed up thirty days in a row.', 'flame', 0)
on conflict (key) do update set
  title       = excluded.title,
  description = excluded.description,
  icon        = excluded.icon,
  xp_bonus    = excluded.xp_bonus;

-- Site settings ----------------------------------------------------------------
-- Inserted once; never overwrites what an admin changed in the dashboard.
-- Legal texts are placeholders here; scripts/seed.ts fills missing slugs from
-- src/content/legal/*.md. [LEGAL REVIEW NEEDED]
insert into public.site_settings (
  id, site_name, logo_path, support_email, disclaimer_text, colors, legal,
  abandoned_cart_emails, weekly_nudges, testimonials_enabled
)
values (
  'default',
  'Cradle Your Cravings Academy',                                   -- CONFIRM WITH CYNTHIA
  null,
  'support@cradleyourcravings.com',                                 -- CONFIRM WITH CYNTHIA
  'This course is educational and is not medical advice, diagnosis, or treatment. Always consult your physician or a qualified healthcare provider before changing your diet, exercise, supplements, or fertility care.',
  null,
  jsonb_build_object(
    'terms',              E'# Terms of Service\n\n[LEGAL REVIEW NEEDED]',
    'privacy',            E'# Privacy Policy\n\n[LEGAL REVIEW NEEDED]',
    'refund-policy',      E'# Refund Policy\n\n[LEGAL REVIEW NEEDED]',
    'medical-disclaimer', E'# Medical Disclaimer\n\n[LEGAL REVIEW NEEDED]',
    'cookie-policy',      E'# Cookie Policy\n\n[LEGAL REVIEW NEEDED]'
  ),
  true,
  true,
  true
)
on conflict (id) do nothing;
