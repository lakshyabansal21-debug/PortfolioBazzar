-- PortfolioHub: READ-ONLY inspection. Run this first. It changes nothing.
-- Paste the results somewhere safe; they tell you what already exists.

-- 1) Columns and types of the tables the app uses
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name in ('templates', 'likes', 'comments', 'profiles')
order by table_name, ordinal_position;

-- 2) Is row level security (RLS) on, per table?
select tablename, rowsecurity as rls_enabled
from pg_tables
where schemaname = 'public' and tablename in ('templates', 'likes', 'comments', 'profiles');

-- 3) Existing policies (who can read / write what today)
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4) Existing triggers
select event_object_table as table_name, trigger_name
from information_schema.triggers
where trigger_schema = 'public';

-- 5) Duplicate likes (the one-like-per-user index cannot be created if this returns rows)
select template_id, user_id, count(*) as copies
from public.likes
group by template_id, user_id
having count(*) > 1;
