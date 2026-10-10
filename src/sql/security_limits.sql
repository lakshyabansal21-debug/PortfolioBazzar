-- Run in the Supabase SQL editor AFTER sql/security_fixes.sql (existing projects). Already included in sql/schema.sql for new projects.
-- ---------------------------------------------------------------------
-- 8) TEMPLATES: size limits (stops oversized uploads; 1 MB per code column)
--    NOT VALID = existing rows are not re-checked, new/updated rows are.
-- ---------------------------------------------------------------------
alter table public.templates drop constraint if exists templates_code_size_chk;
alter table public.templates add constraint templates_code_size_chk
  check (
    length(coalesce(html_code, '')) <= 1048576 and
    length(coalesce(css_code,  '')) <= 1048576 and
    length(coalesce(js_code,   '')) <= 1048576 and
    length(coalesce(title, '')) <= 200 and
    length(coalesce(description, '')) <= 2000
  ) not valid;

-- ---------------------------------------------------------------------
-- 9) Per-user publish rate limit: max 20 new templates per hour (admins exempt)
-- ---------------------------------------------------------------------
create or replace function public.limit_template_publish_rate()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if (select count(*) from public.templates
         where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 20 then
      raise exception 'Too many templates published. Please try again later.';
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists templates_publish_rate on public.templates;
create trigger templates_publish_rate before insert on public.templates
  for each row execute function public.limit_template_publish_rate();

-- ---------------------------------------------------------------------
-- DONE. Verify with the queries at the bottom of sql/make_single_admin.sql
-- ---------------------------------------------------------------------
