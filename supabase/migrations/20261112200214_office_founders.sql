-- Site office. Founders are listed by hand. Do not add a founder flag to profiles:
-- users can update their own profile row.

create table public.founders (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

alter table public.founders enable row level security;

-- Security definer so the policy can see founders without recursing through RLS.
-- The body only answers whether auth.uid() is in the table.
create or replace function public.is_founder()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.founders where user_id = auth.uid());
$$;

revoke all on function public.is_founder() from public;
grant execute on function public.is_founder() to authenticated;

create policy "founders read founders" on public.founders
  for select using (public.is_founder());

revoke all on table public.founders from anon, authenticated;
grant select on table public.founders to authenticated;

-- ---------------------------------------------------------------------------
-- Shared columns: id, sort, created_at, updated_at, updated_by
-- ---------------------------------------------------------------------------

create or replace function public.touch_office_row()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

revoke all on function public.touch_office_row() from public;
grant execute on function public.touch_office_row() to authenticated;

create table public.office_tasks (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  title text not null,
  detail text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done', 'on_hold')),
  owner text check (owner in ('Joel', 'Matas', 'Brandan', 'All')),
  due_on date
);

create table public.office_decisions (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  question text not null,
  why text,
  owner text,
  status text not null default 'open' check (status in ('open', 'decided', 'on_hold')),
  decision text,
  decided_on date
);

create table public.office_risks (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  title text not null,
  detail text,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'watching', 'resolved')),
  mitigation text,
  owner text
);

create table public.office_competitors (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  name text not null,
  website text,
  country text,
  what_they_are text,
  who_for text,
  core_offer text,
  tiers_prices text,
  addons text,
  human_involved text,
  industry_specific text,
  ongoing text,
  revenue_model text,
  where_we_differ text,
  source text,
  verified_on date
);

create table public.office_pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  option text not null check (option in ('A', 'B')),
  name text not null,
  included text,
  who_for text,
  price_cad numeric,
  price_note text,
  billing text,
  anchor text,
  notes text
);

create table public.office_notes (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  slug text unique not null,
  title text not null,
  body text not null default '',
  pinned boolean default false
);

create table public.office_links (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  label text not null,
  url text not null,
  note text
);

create table public.office_activity (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  actor uuid,
  actor_name text,
  entity text,
  entity_id uuid,
  action text check (action in ('created', 'updated', 'deleted')),
  summary text
);

create trigger office_tasks_touch
  before insert or update on public.office_tasks
  for each row execute function public.touch_office_row();
create trigger office_decisions_touch
  before insert or update on public.office_decisions
  for each row execute function public.touch_office_row();
create trigger office_risks_touch
  before insert or update on public.office_risks
  for each row execute function public.touch_office_row();
create trigger office_competitors_touch
  before insert or update on public.office_competitors
  for each row execute function public.touch_office_row();
create trigger office_pricing_tiers_touch
  before insert or update on public.office_pricing_tiers
  for each row execute function public.touch_office_row();
create trigger office_notes_touch
  before insert or update on public.office_notes
  for each row execute function public.touch_office_row();
create trigger office_links_touch
  before insert or update on public.office_links
  for each row execute function public.touch_office_row();
create trigger office_activity_touch
  before insert or update on public.office_activity
  for each row execute function public.touch_office_row();

alter table public.office_tasks enable row level security;
alter table public.office_decisions enable row level security;
alter table public.office_risks enable row level security;
alter table public.office_competitors enable row level security;
alter table public.office_pricing_tiers enable row level security;
alter table public.office_notes enable row level security;
alter table public.office_links enable row level security;
alter table public.office_activity enable row level security;

create policy "founders all office_tasks" on public.office_tasks
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_decisions" on public.office_decisions
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_risks" on public.office_risks
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_competitors" on public.office_competitors
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_pricing_tiers" on public.office_pricing_tiers
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_notes" on public.office_notes
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_links" on public.office_links
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_activity" on public.office_activity
  for all using (public.is_founder()) with check (public.is_founder());

revoke all on table public.office_tasks from anon, authenticated;
revoke all on table public.office_decisions from anon, authenticated;
revoke all on table public.office_risks from anon, authenticated;
revoke all on table public.office_competitors from anon, authenticated;
revoke all on table public.office_pricing_tiers from anon, authenticated;
revoke all on table public.office_notes from anon, authenticated;
revoke all on table public.office_links from anon, authenticated;
revoke all on table public.office_activity from anon, authenticated;

grant select, insert, update, delete on table public.office_tasks to authenticated;
grant select, insert, update, delete on table public.office_decisions to authenticated;
grant select, insert, update, delete on table public.office_risks to authenticated;
grant select, insert, update, delete on table public.office_competitors to authenticated;
grant select, insert, update, delete on table public.office_pricing_tiers to authenticated;
grant select, insert, update, delete on table public.office_notes to authenticated;
grant select, insert, update, delete on table public.office_links to authenticated;
grant select, insert, update, delete on table public.office_activity to authenticated;

-- Add founders by hand in the SQL editor. There is no insert policy.
-- insert into public.founders (user_id, display_name)
-- select id, 'Joel' from auth.users where email = 'joel@basolutionsai.com';
-- repeat for Matas and Brandan with their signup emails
