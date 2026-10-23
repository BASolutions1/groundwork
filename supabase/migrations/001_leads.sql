-- Homepage intake. The app inserts with the service role, which bypasses RLS.
-- Anonymous and signed-in clients have no policies, so they cannot read or write.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_type text not null,
  phone text not null,
  source text not null default 'homepage',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
