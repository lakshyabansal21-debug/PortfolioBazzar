-- =====================================================================
-- PortfolioHub: SAFE optional Supabase setup
--
-- Design rules of this script:
--   * It never changes a table that already exists (no new policies, no RLS change on it).
--   * Every step checks first and skips with a NOTICE if something is missing or in the way.
--   * The like counter trigger can never block a like (errors inside it are swallowed).
--   * Safe to run more than once.
--
-- HOW TO RUN SAFELY
--   1. Run check.sql first and look at the results.
--   2. Dry run: put   begin;   on the first line and   rollback;   on the last line,
--      run it, read the NOTICE messages, then remove those two lines to apply it for real.
--   3. Best of all: try it on a copy of your project first (Supabase branch / second project).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) COMMENTS: created only if the table does not exist yet
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.comments') is null then
    create table public.comments (
      id          uuid primary key default gen_random_uuid(),
      template_id text not null,   -- text, so built-in ids like 'tmpl-minimal-01' work too
      user_id     uuid references auth.users(id) on delete set null,
      user_name   text not null default 'Anonymous',
      user_avatar text,
      content     text not null check (char_length(content) between 1 and 2000),
      rating      int  check (rating between 1 and 5),
      created_at  timestamptz not null default now()
    );
    create index comments_template_idx on public.comments (template_id, created_at desc);

    alter table public.comments enable row level security;
    create policy "comments are public"         on public.comments for select using (true);
    create policy "signed in users can comment" on public.comments for insert to authenticated with check (auth.uid() = user_id);
    create policy "authors can delete comments" on public.comments for delete to authenticated using (auth.uid() = user_id);
    raise notice 'comments: table created';
  else
    raise notice 'comments: table already exists, left untouched';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2) LIKES: created only if the table does not exist yet
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.likes') is null then
    create table public.likes (
      id          uuid primary key default gen_random_uuid(),
      template_id text not null,
      user_id     uuid not null references auth.users(id) on delete cascade,
      created_at  timestamptz not null default now()
    );
    create unique index likes_one_per_user on public.likes (template_id, user_id);

    alter table public.likes enable row level security;
    create policy "likes are public"         on public.likes for select using (true);
    create policy "users like as themselves" on public.likes for insert to authenticated with check (auth.uid() = user_id);
    create policy "users remove own likes"   on public.likes for delete to authenticated using (auth.uid() = user_id);
    raise notice 'likes: table created';
  else
    raise notice 'likes: table already exists, structure and policies left untouched';
  end if;
end $$;

-- 2b) One like per user per template, only if the existing data allows it
do $$
begin
  if to_regclass('public.likes') is not null
     and to_regclass('public.likes_one_per_user') is null
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'likes' and column_name = 'template_id')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'likes' and column_name = 'user_id')
  then
    if exists (select 1 from public.likes group by template_id, user_id having count(*) > 1) then
      raise notice 'likes: duplicate likes found, unique index skipped (clean the duplicates first)';
    else
      create unique index likes_one_per_user on public.likes (template_id, user_id);
      raise notice 'likes: unique index created';
    end if;
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 3) Keep templates.likes_count equal to the real number of likes.
--    The function swallows its own errors, so it can never block a like.
-- ---------------------------------------------------------------------
create or replace function public.sync_likes_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid text := coalesce(new.template_id, old.template_id)::text;
begin
  begin
    perform set_config('app.stats_update', 'on', true);   -- lets the counter guard (sql/security_fixes.sql) pass
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

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'likes_count')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'id')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'likes' and column_name = 'template_id')
  then
    drop trigger if exists likes_count_sync on public.likes;
    create trigger likes_count_sync after insert or delete on public.likes
      for each row execute function public.sync_likes_count();
    raise notice 'likes: counter trigger created';
  else
    raise notice 'likes: counter trigger skipped (templates.likes_count or likes.template_id not found)';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 4) View / download / remix counters (called by the app with supabase.rpc)
--    It is a new function, so it does not touch any existing data or policy.
-- ---------------------------------------------------------------------
create or replace function public.increment_template_stat(p_template_id text, p_field text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_field not in ('views_count', 'downloads_count', 'remixes_count') then
    raise exception 'invalid counter: %', p_field;
  end if;
  perform set_config('app.stats_update', 'on', true);   -- lets the counter guard (sql/security_fixes.sql) pass
  execute format('update public.templates set %I = coalesce(%I, 0) + 1 where id::text = $1', p_field, p_field)
    using p_template_id;
  perform set_config('app.stats_update', 'off', true);
end; $$;
grant execute on function public.increment_template_stat(text, text) to anon, authenticated;

-- NOTE: the stricter rules for `templates` and `profiles` (nobody can make themselves admin,
-- only one admin, owners cannot feature/approve) live in sql/security_fixes.sql.
-- Run that file AFTER this one.
