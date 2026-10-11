-- =====================================================================
-- PortfolioHub: privacy + comments patch for an EXISTING Supabase project
--
-- Run this AFTER the older files (supabase/setup.sql, sql/security_fixes.sql, sql/security_limits.sql).
-- A NEW project does not need it: sql/schema.sql already contains everything in here.
-- Safe to run more than once. It was written carefully but has NOT been run against a real
-- database by the author: do a dry run first (put BEGIN; on the first line and ROLLBACK; on the last,
-- run it, read the messages, then remove those two lines and run it for real).
--
-- WHAT IT DOES
--   1. comments get a `rating` column (star ratings were being dropped).
--   2. New accounts no longer get a stock profile photo (the site draws an initials avatar instead).
--   3. Normal users can no longer change a profile's ban flag or counters (admins still can).
--   4. set_site_admin('email') to choose the one admin.
--   5. Other people's email addresses are no longer readable through the public API.
--
-- IMPORTANT: deploy the new website code first. It reads profiles with explicit columns, which
-- step 5 requires (select('*') on profiles would fail afterwards).
-- =====================================================================

alter table public.comments add column if not exists rating int check (rating between 1 and 5);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INTEGER := 1;
BEGIN
  -- Extract base username from metadata or email prefix
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    NULLIF(TRIM(split_part(NEW.email, '@', 1)), ''),
    'user'
  );
  final_username := base_username;

  -- Ensure unique username across profiles
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || '_' || floor(random() * 9000 + 1000)::text;
    suffix := suffix + 1;
    IF suffix > 10 THEN
      final_username := base_username || '_' || replace(gen_random_uuid()::text, '-', '');
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (
    id,
    username,
    email,
    full_name,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    final_username,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', final_username),
    NEW.raw_user_meta_data->>'avatar_url',   -- no stock photo: the site draws an initials avatar
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() is null for the SQL editor / service_role: those are allowed.
  if auth.uid() is not null then
    if tg_op = 'INSERT' and new.role is distinct from 'user' then
      raise exception 'Not allowed: new accounts always start as a normal user.' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and new.role is distinct from old.role then
      raise exception 'Not allowed: roles can only be changed from the SQL editor.' using errcode = '42501';
    end if;
    -- ban flag and counters: only an admin may change them (everyone else's edits are ignored)
    if tg_op = 'UPDATE' and not public.is_admin() then
      new.is_banned       := old.is_banned;
      new.total_downloads := old.total_downloads;
      new.total_likes     := old.total_likes;
    end if;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 10) CHOOSE THE ONE ADMIN with a single command (SQL editor only)
--       SELECT public.set_site_admin('you@example.com');
--     The person must have signed up and signed in once. Running it again with another
--     email moves the admin role. The website itself can never call this.
-- ---------------------------------------------------------------------
create or replace function public.set_site_admin(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare target uuid;
begin
  if auth.uid() is not null then
    raise exception 'set_site_admin can only be run from the Supabase SQL editor';
  end if;
  select id into target from auth.users where lower(email) = lower(trim(p_email));
  if target is null then
    raise exception 'No account with email %. Sign up on the website first.', p_email;
  end if;
  update public.profiles set role = 'user' where role = 'admin' and id <> target;
  update public.profiles set role = 'admin' where id = target;
  if not found then
    raise exception 'That account has no profile row yet. Sign in on the website once, then run this again.';
  end if;
  return p_email || ' is now the admin';
end;
$$;
revoke all on function public.set_site_admin(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 11) PRIVACY: profiles are readable by everyone, which also exposed every user's email address.
--     Hide the email column. (The website never needs other people's emails; a signed-in user
--     already has their own email from the login session.)
--     Table-level SELECT must be removed first, because a column grant cannot override it.
-- ---------------------------------------------------------------------
revoke select on public.profiles from anon, authenticated;
grant select (id, username, full_name, avatar_url, bio, role, is_banned, total_downloads, total_likes,
              website, github, linkedin, created_at, updated_at)
  on public.profiles to anon, authenticated;
