-- Founder hub access is the email on the auth user, not a row in founders.
-- Any @basolutionsai.com address, plus Brandan.

create or replace function public.is_founder()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users
    where id = auth.uid()
      and (
        lower(split_part(email, '@', 2)) = 'basolutionsai.com'
        or lower(email) = 'brandan@griffithplaster.ca'
      )
  );
$$;

revoke all on function public.is_founder() from public;
grant execute on function public.is_founder() to authenticated;
