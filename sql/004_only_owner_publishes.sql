-- =====================================================================
-- PortfolioHub: 004_only_owner_publishes.sql
-- Nobody can publish a copy of someone else's template to the public catalog.
-- (Changing or deleting another person's template is already owner / admin only
--  through the policies in schema.sql. This closes the "upload it again" way.)
--
-- Run ONCE in the Supabase SQL editor. Safe to run again.
-- A private copy (is_public = false) is always allowed; admins are never blocked.
-- =====================================================================
create or replace function public.block_duplicate_templates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  norm text := regexp_replace(lower(coalesce(new.html_code, '')), '\s+', '', 'g');
begin
  if auth.uid() is null or public.is_admin() then
    return new;                                   -- SQL editor / admin
  end if;
  if coalesce(new.is_public, true) = false or length(norm) = 0 then
    return new;                                   -- private copy, or nothing to compare
  end if;
  if exists (
    select 1 from public.templates t
     where t.id is distinct from new.id
       and t.user_id is distinct from new.user_id
       and regexp_replace(lower(coalesce(t.html_code, '')), '\s+', '', 'g') = norm
  ) then
    raise exception 'This template is the same as an existing one. Only its owner can publish it.';
  end if;
  return new;
end;
$$;

drop trigger if exists templates_block_duplicates on public.templates;
create trigger templates_block_duplicates
  before insert on public.templates
  for each row execute function public.block_duplicate_templates();

-- CHECK: select tgname from pg_trigger where tgrelid = 'public.templates'::regclass and not tgisinternal;
