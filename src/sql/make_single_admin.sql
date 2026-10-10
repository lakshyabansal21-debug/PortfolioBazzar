-- =====================================================================
-- PortfolioHub AI: make ONE person the admin (and nobody else)
--
-- HOW TO USE
--   1. The person must first create an account on your site (sign up or Google sign-in)
--      and confirm the email, so a row exists in auth.users / public.profiles.
--   2. Replace  you@example.com  below with that exact email.
--   3. Supabase Dashboard > SQL Editor > paste > Run.
--   4. Sign out and sign in again on the site: the "Admin" button appears in the top bar.
--
-- WHY IT HAS TO BE DONE HERE
--   After sql/security_fixes.sql, the website itself can never change roles.
--   Only the SQL editor (owner of the project) can, so nobody can promote themselves.
-- =====================================================================

-- STEP A: remove admin from everyone (needed before moving admin to a different person,
--         because the database allows only one admin at a time)
update public.profiles set role = 'user' where role = 'admin';

-- STEP B: make exactly one confirmed account the admin
update public.profiles
   set role = 'admin'
 where id = (
         select id from auth.users
          where lower(email) = lower('you@example.com')   -- <<< CHANGE THIS EMAIL
            and email_confirmed_at is not null
          limit 1
       );

-- STEP C: check the result. You should see exactly ONE row, with your email.
select id, email, username, role from public.profiles where role = 'admin';

-- =====================================================================
-- TO REMOVE ALL ADMINS (nobody is admin):
--   update public.profiles set role = 'user' where role = 'admin';
--
-- TO MOVE ADMIN TO ANOTHER PERSON:
--   run this whole file again with the new email (Step A removes the old admin first).
-- =====================================================================


-- =====================================================================
-- VERIFICATION QUERIES (read-only, run any time)
-- =====================================================================

-- 1) RLS is ON for every table (rls_enabled should be true everywhere)
select tablename, rowsecurity as rls_enabled
  from pg_tables
 where schemaname = 'public'
 order by tablename;

-- 2) All policies
select tablename, policyname, cmd, roles, qual, with_check
  from pg_policies
 where schemaname in ('public', 'storage')
 order by tablename, policyname;

-- 3) The guard triggers and the one-admin index exist
select event_object_table as table_name, trigger_name
  from information_schema.triggers
 where trigger_schema = 'public' and trigger_name in ('profiles_guard_role', 'templates_guard_columns', 'likes_count_sync');

select indexname, indexdef from pg_indexes where schemaname = 'public' and indexname = 'only_one_admin';

-- 4) How many admins exist (must be 0 or 1)
select count(*) as admin_count from public.profiles where role = 'admin';
