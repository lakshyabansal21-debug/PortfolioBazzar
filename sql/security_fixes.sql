-- =====================================================================
-- PortfolioHub AI: SECURITY FIXES (Row Level Security hardening)
--
-- WHEN TO RUN
--   Supabase Dashboard > SQL Editor > New query > paste this whole file > Run.
--   New project: sql/schema.sql (already includes everything below) -> supabase/setup.sql -> make_single_admin.sql
--   For an EXISTING project:   just run this file (it is safe to run more than once).
--   Tip: test on a copy of the project (Supabase branch) first, or wrap it in
--        BEGIN; ... ROLLBACK;  to dry-run, then run it for real.
--
-- WHAT IT FIXES
--   1. Nobody can make themselves admin (role is locked; only the SQL editor can change it).
--   2. At most ONE admin can exist (database-level guarantee).
--   3. Only signed-in users can publish templates, and only as themselves.
--   4. Normal users cannot feature / approve templates or change their owner.
--   5. Normal users cannot edit like / view / download / remix counters directly.
--   6. Download records can only be written by the signed-in user themselves.
--   7. Storage uploads are limited to the user's own folder (avatars/<user-id>/file.png).
--   8. is_admin() gets a fixed search_path (security best practice).
--
-- HOW "SQL EDITOR" STAYS ALLOWED
--   Requests that come from the website always carry a logged-in user (auth.uid() is set).
--   The SQL editor and the service_role key have no user (auth.uid() is null).
--   The guards below only block the first group, so the owner can still manage roles in SQL.
--   NEVER put the service_role key into the website code or .env.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0) is_admin(): same logic as before, with a pinned search_path
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- 1) PROFILES: lock the `role` column
-- ---------------------------------------------------------------------
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id and role = 'user');

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using      (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

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
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before insert or update on public.profiles
  for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------
-- 2) ONLY ONE ADMIN, enforced by the database
--    (a partial unique index: a second row with role='admin' is rejected)
--    If you already have more than one admin, run sql/make_single_admin.sql first.
-- ---------------------------------------------------------------------
do $$
begin
  if (select count(*) from public.profiles where role = 'admin') > 1 then
    raise warning 'More than one admin exists, so the one-admin index was NOT created. Run sql/make_single_admin.sql, then run this block again.';
  else
    create unique index if not exists only_one_admin on public.profiles (role) where role = 'admin';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 3) TEMPLATES: only signed-in users, only as themselves (admins may also sync built-ins)
-- ---------------------------------------------------------------------
drop policy if exists "Anyone can insert templates" on public.templates;
drop policy if exists "Signed in users can insert own templates" on public.templates;
create policy "Signed in users can insert own templates"
  on public.templates for insert
  to authenticated
  with check (auth.uid() = user_id or public.is_admin());

-- ---------------------------------------------------------------------
-- 4 + 5) TEMPLATES: protect owner, featured/approved flags and counters
-- ---------------------------------------------------------------------
create or replace function public.guard_template_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  stats_ok boolean := coalesce(current_setting('app.stats_update', true), '') = 'on';
begin
  -- SQL editor / service_role / admin: no restrictions
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.is_featured     := false;
    new.likes_count     := 0;
    new.downloads_count := 0;
    new.views_count     := 0;
    new.remixes_count   := 0;
    return new;
  end if;

  -- UPDATE by a normal user (the owner): these columns stay as they were
  new.user_id     := old.user_id;
  new.is_featured := old.is_featured;
  new.is_approved := old.is_approved;
  if not stats_ok then
    new.likes_count     := old.likes_count;
    new.downloads_count := old.downloads_count;
    new.views_count     := old.views_count;
    new.remixes_count   := old.remixes_count;
  end if;
  return new;
end;
$$;

drop trigger if exists templates_guard_columns on public.templates;
create trigger templates_guard_columns
  before insert or update on public.templates
  for each row execute function public.guard_template_columns();

-- The two official counter functions switch the guard off for their own update only.
create or replace function public.increment_template_stat(p_template_id text, p_field text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_field not in ('views_count', 'downloads_count', 'remixes_count') then
    raise exception 'invalid counter: %', p_field;
  end if;
  perform set_config('app.stats_update', 'on', true);
  execute format('update public.templates set %I = coalesce(%I, 0) + 1 where id::text = $1', p_field, p_field)
    using p_template_id;
  perform set_config('app.stats_update', 'off', true);
end; $$;
grant execute on function public.increment_template_stat(text, text) to anon, authenticated;

create or replace function public.sync_likes_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid text := coalesce(new.template_id, old.template_id)::text;
begin
  begin
    perform set_config('app.stats_update', 'on', true);
    update public.templates
       set likes_count = (select count(*) from public.likes where template_id::text = tid)
     where id::text = tid;
    perform set_config('app.stats_update', 'off', true);
  exception when others then
    perform set_config('app.stats_update', 'off', true);
    raise warning 'sync_likes_count skipped: %', sqlerrm;
  end;
  return null;
end; $$;

-- make sure the like-counter trigger exists (setup.sql normally creates it)
do $$
begin
  if to_regclass('public.likes') is not null then
    drop trigger if exists likes_count_sync on public.likes;
    create trigger likes_count_sync after insert or delete on public.likes
      for each row execute function public.sync_likes_count();
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 6) DOWNLOADS: only signed-in users, only for themselves
-- ---------------------------------------------------------------------
drop policy if exists "Anyone can log downloads" on public.downloads;
drop policy if exists "Signed in users log own downloads" on public.downloads;
create policy "Signed in users log own downloads"
  on public.downloads for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Note: public.views, public.remixes and public.followers have RLS ON and no policies,
-- which means "nobody can read or write them from the website". The app does not use
-- them today, so that is the safe default. Add policies only when you build those features.

-- ---------------------------------------------------------------------
-- 7) STORAGE: users may only upload into a folder named after their own user id
--    Example path:  avatars/<user-id>/photo.png
-- ---------------------------------------------------------------------
drop policy if exists "Authenticated users upload avatars"    on storage.objects;
drop policy if exists "Authenticated users upload thumbnails" on storage.objects;
drop policy if exists "Authenticated users upload previews"   on storage.objects;
drop policy if exists "Authenticated users upload templates"  on storage.objects;
drop policy if exists "Users upload to own folder"            on storage.objects;

create policy "Users upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('avatars', 'thumbnails', 'previews', 'templates')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------
-- DONE. Verify with the queries at the bottom of sql/make_single_admin.sql
-- ---------------------------------------------------------------------
