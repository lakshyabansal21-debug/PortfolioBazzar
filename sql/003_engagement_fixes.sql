-- =====================================================================
-- PortfolioHub: 003_engagement_fixes.sql
-- Fixes: saved (favourites), likes, views, downloads.
--
-- Run ONCE in the Supabase SQL editor, AFTER sql/schema.sql (or after 002_privacy_and_comments.sql
-- on an existing project). Safe to run again: every step checks first.
-- Dry run: put  begin;  on the first line and  rollback;  on the last line, read the NOTICEs,
-- then remove both lines to apply it for real.
--
-- What it does
--   1. FAVOURITES  : the `favorites` table + policies, so stars follow the account to any device.
--   2. LIKES       : policies + a counter trigger so templates.likes_count is always the real number.
--   3. VIEWS/DOWNLOADS : record_template_event() counts one view / download per person per template
--                        per day (no more +1 per refresh or per script call).
--   4. PRIVACY     : the download log is visible to its owner only (it was readable by everyone).
--   5. OPTIONAL    : (a) replace demo like-numbers by real ones, (b) tag templates by the tech they use.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) FAVOURITES
-- ---------------------------------------------------------------------
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  created_at  timestamptz not null default now(),
  unique (user_id, template_id)
);

-- Built-in templates (tmpl-...) may not exist in the cloud `templates` table, and a foreign key
-- would reject them. Drop any foreign key that points template_id at templates.
do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
    where c.conrelid = 'public.favorites'::regclass
      and c.contype = 'f'
      and a.attname = 'template_id'
  loop
    execute format('alter table public.favorites drop constraint %I', r.conname);
    raise notice 'favorites: dropped foreign key % on template_id', r.conname;
  end loop;
end $$;

-- The app saves with ON CONFLICT (user_id, template_id): make sure that unique key exists.
create unique index if not exists favorites_user_template_uq on public.favorites (user_id, template_id);
create index if not exists idx_favorites_user on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;

drop policy if exists "Users can view own favorites"   on public.favorites;
drop policy if exists "Users can manage own favorites" on public.favorites;
drop policy if exists "Users can remove own favorites" on public.favorites;
drop policy if exists "favorites select own"           on public.favorites;
drop policy if exists "favorites insert own"           on public.favorites;
drop policy if exists "favorites delete own"           on public.favorites;

create policy "favorites select own" on public.favorites for select to authenticated using (auth.uid() = user_id);
create policy "favorites insert own" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "favorites delete own" on public.favorites for delete to authenticated using (auth.uid() = user_id);

grant select, insert, delete on public.favorites to authenticated;


-- ---------------------------------------------------------------------
-- 2) LIKES: policies + counter trigger
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.likes') is null then
    raise notice 'likes: table not found. Run sql/schema.sql (or supabase/setup.sql) first. Skipping step 2.';
    return;
  end if;

  alter table public.likes enable row level security;

  drop policy if exists "Likes viewable by everyone"      on public.likes;
  drop policy if exists "likes are public"                on public.likes;
  drop policy if exists "Authenticated users can like"    on public.likes;
  drop policy if exists "users like as themselves"        on public.likes;
  drop policy if exists "Users can remove their own likes" on public.likes;
  drop policy if exists "users remove own likes"          on public.likes;

  create policy "likes are public"         on public.likes for select using (true);
  create policy "users like as themselves" on public.likes for insert to authenticated with check (auth.uid() = user_id);
  create policy "users remove own likes"   on public.likes for delete to authenticated using (auth.uid() = user_id);

  if not exists (select 1 from pg_indexes where schemaname = 'public' and tablename = 'likes'
                 and indexdef ilike '%unique%' and indexdef ilike '%template_id%' and indexdef ilike '%user_id%')
     and not exists (select 1 from public.likes group by template_id, user_id having count(*) > 1) then
    create unique index likes_one_per_user on public.likes (template_id, user_id);
  end if;
end $$;

-- Keeps templates.likes_count equal to the real number of rows in `likes`.
-- It swallows its own errors, so it can never block a like.
create or replace function public.sync_likes_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare tid text := coalesce(new.template_id, old.template_id)::text;
begin
  begin
    perform set_config('app.stats_update', 'on', true);   -- lets the counter guard (security_fixes.sql) pass
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
  if to_regclass('public.likes') is not null then
    drop trigger if exists likes_count_sync on public.likes;
    create trigger likes_count_sync after insert or delete on public.likes
      for each row execute function public.sync_likes_count();
    raise notice 'likes: counter trigger installed';
  end if;
end $$;


-- ---------------------------------------------------------------------
-- 3) VIEWS + DOWNLOADS: one count per person per template per day
-- ---------------------------------------------------------------------
create table if not exists public.template_hits (
  template_id text        not null,
  kind        text        not null check (kind in ('view', 'download')),
  viewer      text        not null,                       -- 'u:<user id>' or 'ip:<hash>'
  day         date        not null default ((now() at time zone 'utc')::date),
  created_at  timestamptz not null default now(),
  primary key (template_id, kind, viewer, day)
);
alter table public.template_hits enable row level security;   -- no policies: only the function below can touch it
revoke all on public.template_hits from anon, authenticated;

create or replace function public.record_template_event(p_template_id text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_headers  json;
  v_viewer   text;
  v_ip       text;
  v_rows     int;
  v_uid      uuid := auth.uid();
begin
  if p_kind not in ('view', 'download') then
    raise exception 'invalid kind: %', p_kind;
  end if;
  if p_template_id is null or length(p_template_id) > 200 then
    return;
  end if;
  -- only real templates are counted (also stops anyone filling the hits table with random ids)
  if not exists (select 1 from public.templates where id = p_template_id) then
    return;
  end if;

  -- who is this? the signed-in user, otherwise a hash of IP + browser
  if v_uid is not null then
    v_viewer := 'u:' || v_uid::text;
  else
    begin
      v_headers := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
    exception when others then
      v_headers := '{}'::json;
    end;
    v_ip := trim(split_part(coalesce(v_headers->>'x-forwarded-for', v_headers->>'cf-connecting-ip', 'unknown'), ',', 1));
    v_viewer := 'ip:' || md5(v_ip || '|' || coalesce(v_headers->>'user-agent', ''));
  end if;

  insert into public.template_hits (template_id, kind, viewer)
  values (p_template_id, p_kind, v_viewer)
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    return;   -- already counted today
  end if;

  perform set_config('app.stats_update', 'on', true);   -- lets the counter guard pass for this update only
  if p_kind = 'view' then
    update public.templates set views_count = coalesce(views_count, 0) + 1 where id = p_template_id;
  else
    update public.templates set downloads_count = coalesce(downloads_count, 0) + 1 where id = p_template_id;
    -- signed-in downloads are also logged for the person's own Activity list
    if v_uid is not null and to_regclass('public.downloads') is not null then
      begin
        insert into public.downloads (user_id, template_id) values (v_uid, p_template_id);
      exception when others then
        raise warning 'download log skipped: %', sqlerrm;
      end;
    end if;
  end if;
  perform set_config('app.stats_update', 'off', true);
end;
$$;

revoke all on function public.record_template_event(text, text) from public;
grant execute on function public.record_template_event(text, text) to anon, authenticated;

-- The old open counter function let anyone add unlimited views / downloads.
-- It now only counts remixes, and only for signed-in users.
create or replace function public.increment_template_stat(p_template_id text, p_field text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'sign in required';
  end if;
  if p_field <> 'remixes_count' then
    raise exception 'use record_template_event() for views and downloads';
  end if;
  perform set_config('app.stats_update', 'on', true);
  update public.templates set remixes_count = coalesce(remixes_count, 0) + 1 where id = p_template_id;
  perform set_config('app.stats_update', 'off', true);
end; $$;
revoke all on function public.increment_template_stat(text, text) from public, anon;
grant execute on function public.increment_template_stat(text, text) to authenticated;


-- ---------------------------------------------------------------------
-- 4) PRIVACY: the download log was readable by everyone (it lists who downloaded what).
--    From now on a person can read their own rows only.
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.downloads') is not null then
    alter table public.downloads enable row level security;
    drop policy if exists "Downloads viewable by everyone" on public.downloads;
    drop policy if exists "downloads select own"           on public.downloads;
    create policy "downloads select own" on public.downloads for select to authenticated using (auth.uid() = user_id);
    grant select on public.downloads to authenticated;
  end if;
end $$;


-- =====================================================================
-- 5) OPTIONAL: run these two blocks on purpose, one at a time.
-- =====================================================================

-- 5a) Replace demo numbers by real ones.
--     If a template shows e.g. 4120 stars but nobody really liked it, the first real like would
--     jump the number to 1. Run this once so the numbers always match the `likes` table.
--     (Views / downloads are NOT touched; they simply continue from their current value.)
--
-- update public.templates t
--    set likes_count = (select count(*) from public.likes l where l.template_id = t.id);

-- 5b) Tag templates by the tech their code uses, so searching "tailwind" finds them.
--     New uploads are tagged automatically by the website; this does the same for rows already stored.
--
-- do $$
-- declare pair text[];
-- begin
--   foreach pair slice 1 in array array[
--     array['Tailwind',  '(cdn\.tailwindcss\.com|tailwindcss|@tailwind )'],
--     array['Bootstrap', '(bootstrap(\.min)?\.(css|js)|cdn\.jsdelivr\.net/npm/bootstrap)'],
--     array['React',     '(react(\.production|\.development)?(\.min)?\.js|react-dom|ReactDOM)'],
--     array['Vue',       '(vue(\.global)?(\.prod)?(\.min)?\.js|createApp\()'],
--     array['Alpine.js', '(alpinejs|x-data=)'],
--     array['GSAP',      '(gsap(\.min)?\.js|TweenMax|ScrollTrigger)'],
--     array['Three.js',  '(three(\.module)?(\.min)?\.js|THREE\.)'],
--     array['jQuery',    '(jquery(\.min)?\.js|\$\(document\))']
--   ]
--   loop
--     update public.templates
--        set tags = array_append(coalesce(tags, array[]::text[]), pair[1])
--      where not (pair[1] = any (coalesce(tags, array[]::text[])))
--        and (coalesce(html_code, '') || ' ' || coalesce(css_code, '') || ' ' || coalesce(js_code, '')) ~* pair[2];
--   end loop;
-- end $$;


-- =====================================================================
-- CHECK (read-only). Expected: favorites has 3 policies, likes trigger exists, function exists.
-- =====================================================================
-- select policyname, cmd from pg_policies where schemaname = 'public' and tablename in ('favorites', 'likes', 'downloads') order by tablename, policyname;
-- select tgname from pg_trigger where tgrelid = 'public.likes'::regclass and not tgisinternal;
-- select proname from pg_proc where proname in ('record_template_event', 'increment_template_stat', 'sync_likes_count');
