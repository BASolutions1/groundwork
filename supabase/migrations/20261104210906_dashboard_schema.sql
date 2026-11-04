-- Groundwork client dashboard schema, RLS, seed, and profile trigger.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  business_name text,
  business_type text,
  phone text,
  province text check (province is null or province ~ '^[A-Z]{2}$'),
  tier text not null default 'free',
  created_at timestamptz not null default now()
);

create table public.playbooks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  industry text not null,
  is_default boolean not null default false
);

create unique index playbooks_one_default on public.playbooks (is_default) where is_default;

create table public.playbook_steps (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.playbooks (id) on delete cascade,
  stage smallint not null check (stage between 1 and 7),
  "order" integer not null,
  slug text not null,
  title text not null,
  summary text not null,
  what_youll_do text[] not null default '{}',
  with_us boolean not null default false,
  estimated_minutes integer not null default 30,
  help_url text not null,
  unique (playbook_id, slug),
  unique (playbook_id, "order")
);

create table public.user_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  step_id uuid not null references public.playbook_steps (id) on delete cascade,
  status text not null default 'todo'
    check (status in ('todo', 'next', 'done', 'skipped')),
  done_at timestamptz,
  notes text,
  unique (user_id, step_id)
);

create index user_steps_user_status_idx on public.user_steps (user_id, status);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  role text not null unique
    check (role in ('accountant', 'insurance_broker', 'lawyer', 'bookkeeper', 'web', 'guide')),
  display_name text not null,
  region text,
  intro_blurb text not null,
  stage smallint check (stage is null or stage between 1 and 7)
);

create table public.introductions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  professional_id uuid not null references public.professionals (id) on delete cascade,
  status text not null default 'requested'
    check (status in ('requested', 'introduced', 'scheduled', 'done')),
  requested_at timestamptz not null default now(),
  scheduled_for timestamptz,
  unique (user_id, professional_id)
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.playbooks enable row level security;
alter table public.playbook_steps enable row level security;
alter table public.user_steps enable row level security;
alter table public.professionals enable row level security;
alter table public.introductions enable row level security;

-- Profiles: own rows only
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Catalog tables: authenticated read; service role writes (no write policies)
create policy "playbooks_select_authenticated" on public.playbooks
  for select to authenticated using (true);
create policy "playbook_steps_select_authenticated" on public.playbook_steps
  for select to authenticated using (true);
create policy "professionals_select_authenticated" on public.professionals
  for select to authenticated using (true);

-- User steps
create policy "user_steps_select_own" on public.user_steps
  for select to authenticated using (user_id = auth.uid());
create policy "user_steps_insert_own" on public.user_steps
  for insert to authenticated with check (user_id = auth.uid());
create policy "user_steps_update_own" on public.user_steps
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Introductions
create policy "introductions_select_own" on public.introductions
  for select to authenticated using (user_id = auth.uid());
create policy "introductions_insert_own" on public.introductions
  for insert to authenticated with check (user_id = auth.uid());
create policy "introductions_update_own" on public.introductions
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Trigger: seed user_steps from default playbook when a profile is created
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_profile_steps()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_playbook uuid;
begin
  select id into default_playbook
  from public.playbooks
  where is_default
  limit 1;

  if default_playbook is null then
    return new;
  end if;

  insert into public.user_steps (user_id, step_id, status)
  select
    new.id,
    s.id,
    case
      when s."order" = (
        select min(s2."order")
        from public.playbook_steps s2
        where s2.playbook_id = default_playbook
      ) then 'next'
      else 'todo'
    end
  from public.playbook_steps s
  where s.playbook_id = default_playbook
  order by s."order";

  return new;
end;
$$;

create trigger on_profile_created_seed_steps
  after insert on public.profiles
  for each row
  execute function public.handle_new_profile_steps();

-- ---------------------------------------------------------------------------
-- Seed: professionals
-- ---------------------------------------------------------------------------

insert into public.professionals (role, display_name, region, intro_blurb, stage) values
  ('accountant', 'Accountant', null, 'Helps with structure, filings and the judgement calls on how you set up.', 1),
  ('bookkeeper', 'Bookkeeper', null, 'Keeps the books clean once money starts moving.', 3),
  ('insurance_broker', 'Insurance broker', null, 'Figures out what coverage you need before you open or hire.', 4),
  ('lawyer', 'Lawyer', null, 'For contracts and the rare case that needs legal eyes.', null),
  ('web', 'Web', null, 'Gets you listed and findable where customers look.', 7),
  ('guide', 'Your guide', null, 'Stays with you across the whole list and steps in on the hard parts.', null);

-- ---------------------------------------------------------------------------
-- Seed: default trades playbook + steps
-- ---------------------------------------------------------------------------

insert into public.playbooks (id, slug, name, industry, is_default)
values ('a0000000-0000-4000-8000-000000000001', 'trades', 'Trades starter', 'trades', true);

insert into public.playbook_steps (
  playbook_id, stage, "order", slug, title, summary, what_youll_do, with_us, estimated_minutes, help_url
) values
-- Stage 1: Register
(
  'a0000000-0000-4000-8000-000000000001', 1, 1,
  'choose-structure',
  'Choose a structure that fits how you work',
  'Sole prop or incorporation. Pick based on how you plan to operate, not what a blog says.',
  array[
    'Write down how you will invoice and hire in the first year.',
    'Compare sole prop vs incorporation on cost and paperwork.',
    'Decide with your accountant if the call is unclear.'
  ],
  true, 45, '/start/register-a-business'
),
(
  'a0000000-0000-4000-8000-000000000001', 1, 2,
  'register-business-name',
  'Register or reserve your business name',
  'If you trade under a name other than your own, register it where you work.',
  array[
    'Search whether the name is available.',
    'File the name registration for your province.',
    'Save the confirmation with your other business papers.'
  ],
  false, 40, '/start/register-a-business'
),
(
  'a0000000-0000-4000-8000-000000000001', 1, 3,
  'get-business-number',
  'Get a business number',
  'The CRA identifier for your business accounts, once structure and name are settled.',
  array[
    'Confirm which CRA accounts you need right now.',
    'Apply for the business number.',
    'Store the number somewhere you can find it.'
  ],
  true, 35, '/start/register-a-business'
),
(
  'a0000000-0000-4000-8000-000000000001', 1, 4,
  'confirm-local-requirements',
  'Confirm what else unlocks next in your province',
  'Licences and local filings vary. Check what applies before you move on.',
  array[
    'Skim the list for your province and industry.',
    'Mark anything that blocks opening or hiring.',
    'Add those items to your next few weeks.'
  ],
  true, 30, '/start/register-a-business'
),

-- Stage 2: GST/HST and taxes
(
  'a0000000-0000-4000-8000-000000000001', 2, 5,
  'decide-gst-hst',
  'Decide if you need a GST/HST account',
  'Not every new business needs one on day one. Find out where you stand.',
  array[
    'Check the small-supplier threshold against your plan.',
    'Note when you would need to register if you stay under it.',
    'Register now only if you already need to charge tax.'
  ],
  true, 30, '/start/gst-hst-and-taxes'
),
(
  'a0000000-0000-4000-8000-000000000001', 2, 6,
  'open-gst-hst',
  'Open your GST/HST account if you need one',
  'Register with the CRA and know your filing rhythm.',
  array[
    'Register the GST/HST account against your business number.',
    'Pick a filing frequency you can keep.',
    'Calendar the first filing date.'
  ],
  true, 40, '/start/gst-hst-and-taxes'
),
(
  'a0000000-0000-4000-8000-000000000001', 2, 7,
  'set-aside-tax',
  'Set money aside for tax',
  'A simple habit so spring is not a surprise.',
  array[
    'Pick a percent to set aside from each payment.',
    'Open a separate savings pocket or transfer rule.',
    'Review the amount after your first month of sales.'
  ],
  false, 20, '/start/gst-hst-and-taxes'
),

-- Stage 3: Bank and books
(
  'a0000000-0000-4000-8000-000000000001', 3, 8,
  'open-business-account',
  'Open a business bank account',
  'Keep business money separate from personal from the start.',
  array[
    'Gather ID and your registration papers.',
    'Open an account in the business name.',
    'Move only business money through it.'
  ],
  false, 60, '/start/business-bank-account-and-bookkeeping'
),
(
  'a0000000-0000-4000-8000-000000000001', 3, 9,
  'pick-bookkeeping',
  'Pick a simple bookkeeping setup',
  'One system you will actually use. Not a pile of spreadsheets.',
  array[
    'Choose software or a spreadsheet template.',
    'Connect the business bank feed if you can.',
    'Log your first week of expenses.'
  ],
  true, 45, '/start/business-bank-account-and-bookkeeping'
),
(
  'a0000000-0000-4000-8000-000000000001', 3, 10,
  'record-first-month',
  'Record your first month cleanly',
  'Income and expenses in one place, ready for tax time.',
  array[
    'Enter every invoice and receipt for the month.',
    'Reconcile against the bank account.',
    'Export or save a backup.'
  ],
  false, 50, '/start/business-bank-account-and-bookkeeping'
),

-- Stage 4: Insurance
(
  'a0000000-0000-4000-8000-000000000001', 4, 11,
  'list-coverage-needs',
  'List the coverage you may need',
  'Before you open, hire or take clients, know what gaps matter.',
  array[
    'Note whether you work on client sites, hire, or drive for work.',
    'List liability, property and any trade-specific cover.',
    'Flag anything a client contract already requires.'
  ],
  true, 25, '/start/wcb-and-insurance'
),
(
  'a0000000-0000-4000-8000-000000000001', 4, 12,
  'check-workers-coverage',
  'Check workers coverage requirements',
  'If you hire or subcontract, confirm what your province expects.',
  array[
    'Confirm whether you need workers coverage before you hire.',
    'Register if it applies.',
    'Keep the account number with your other filings.'
  ],
  true, 40, '/start/wcb-and-insurance'
),
(
  'a0000000-0000-4000-8000-000000000001', 4, 13,
  'get-insured',
  'Get insured',
  'Talk to a broker and put a policy in place before the first job.',
  array[
    'Share how you work with a broker.',
    'Compare quotes on the cover you actually need.',
    'Bind a policy and save the certificate.'
  ],
  true, 60, '/start/wcb-and-insurance'
),

-- Stage 5: Getting paid
(
  'a0000000-0000-4000-8000-000000000001', 5, 14,
  'write-quote-template',
  'Write a clear quote template',
  'Scope, price and terms in one place so clients know what they are buying.',
  array[
    'List what is included and what is not.',
    'Add payment terms and a deposit if you use one.',
    'Save a template you can reuse.'
  ],
  false, 35, '/start/estimates-invoices-and-getting-paid'
),
(
  'a0000000-0000-4000-8000-000000000001', 5, 15,
  'set-up-invoicing',
  'Set up invoicing',
  'Send proper invoices and get paid by card or e-transfer without chasing.',
  array[
    'Pick how you will send invoices.',
    'Add your business details and tax fields.',
    'Send a test invoice to yourself.'
  ],
  false, 40, '/start/estimates-invoices-and-getting-paid'
),
(
  'a0000000-0000-4000-8000-000000000001', 5, 16,
  'collect-first-payment',
  'Collect your first payment cleanly',
  'A path from done work to money in the business account.',
  array[
    'Agree how the client will pay before you start.',
    'Send the invoice the day the work wraps.',
    'Confirm the payment lands in the business account.'
  ],
  false, 25, '/start/estimates-invoices-and-getting-paid'
),

-- Stage 6: Tools
(
  'a0000000-0000-4000-8000-000000000001', 6, 17,
  'pick-core-tools',
  'Pick a few tools that fit',
  'Estimating, invoicing, scheduling, CRM. A small set that talks to each other.',
  array[
    'List the jobs you do every week.',
    'Choose one tool per job, not three.',
    'Cancel anything you are not opening.'
  ],
  true, 40, '/start/tools-that-fit'
),
(
  'a0000000-0000-4000-8000-000000000001', 6, 18,
  'connect-tools',
  'Connect the tools you kept',
  'Fewer tabs. Shared clients and invoices where it helps.',
  array[
    'Connect bank and invoicing if they integrate.',
    'Turn on the notifications you will act on.',
    'Write down the login places in one note.'
  ],
  false, 45, '/start/tools-that-fit'
),
(
  'a0000000-0000-4000-8000-000000000001', 6, 19,
  'drop-the-rest',
  'Drop the tools you do not need',
  'A pile of unused subscriptions is not a system.',
  array[
    'Review every subscription on the business card.',
    'Cancel what you have not opened in a month.',
    'Keep the receipt of cancellation.'
  ],
  false, 20, '/start/tools-that-fit'
),

-- Stage 7: Get found
(
  'a0000000-0000-4000-8000-000000000001', 7, 20,
  'claim-listings',
  'Claim your core listings',
  'Show up where people already search for a business like yours.',
  array[
    'Claim Google Business Profile if it fits.',
    'Check any trade or directory listings you need.',
    'Match name, phone and address everywhere.'
  ],
  true, 50, '/start/get-found-online'
),
(
  'a0000000-0000-4000-8000-000000000001', 7, 21,
  'ask-for-reviews',
  'Ask for a few early reviews',
  'Proof from real clients beats a polished empty page.',
  array[
    'Pick three clients who would vouch for you.',
    'Ask with a direct link to the listing.',
    'Reply to each review once it lands.'
  ],
  false, 30, '/start/get-found-online'
),
(
  'a0000000-0000-4000-8000-000000000001', 7, 22,
  'simple-online-home',
  'Put up a simple online home',
  'A clear page so people can find what you do and how to reach you.',
  array[
    'Write what you do in one short paragraph.',
    'Add contact details and a service area.',
    'Publish and link it from your listings.'
  ],
  true, 60, '/start/get-found-online'
);
