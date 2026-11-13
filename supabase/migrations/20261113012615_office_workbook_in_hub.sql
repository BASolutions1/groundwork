-- Competitor framework and revenue scenarios from the workbook.
-- The Google Sheet link stays. This is the copy founders edit in the hub.

create table public.office_framework (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  feature text not null,
  is_heading boolean not null default false,
  zenbusiness text,
  doola text,
  tailor_brands text,
  ownr text,
  groundworks text,
  proposal text
);

create table public.office_revenue_model (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  label text not null default 'Revenue assumptions',
  referral_fee_cad numeric,
  intros_per_client numeric,
  caveat text
);

create table public.office_revenue_scenarios (
  id uuid primary key default gen_random_uuid(),
  sort int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users (id),
  name text not null,
  free_users numeric,
  startup_clients numeric,
  premium_clients numeric
);

create trigger office_framework_touch
  before insert or update on public.office_framework
  for each row execute function public.touch_office_row();
create trigger office_revenue_model_touch
  before insert or update on public.office_revenue_model
  for each row execute function public.touch_office_row();
create trigger office_revenue_scenarios_touch
  before insert or update on public.office_revenue_scenarios
  for each row execute function public.touch_office_row();

alter table public.office_framework enable row level security;
alter table public.office_revenue_model enable row level security;
alter table public.office_revenue_scenarios enable row level security;

create policy "founders all office_framework" on public.office_framework
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_revenue_model" on public.office_revenue_model
  for all using (public.is_founder()) with check (public.is_founder());
create policy "founders all office_revenue_scenarios" on public.office_revenue_scenarios
  for all using (public.is_founder()) with check (public.is_founder());

revoke all on table public.office_framework from anon, authenticated;
revoke all on table public.office_revenue_model from anon, authenticated;
revoke all on table public.office_revenue_scenarios from anon, authenticated;

grant select, insert, update, delete on table public.office_framework to authenticated;
grant select, insert, update, delete on table public.office_revenue_model to authenticated;
grant select, insert, update, delete on table public.office_revenue_scenarios to authenticated;

insert into public.office_framework (
  sort, feature, is_heading, zenbusiness, doola, tailor_brands, ownr, groundworks, proposal
) values
  (1, $$Getting legal$$, true, null, null, null, null, null, null),
  (2, $$Registration / formation$$, false, $$Y$$, $$Y$$, $$Y$$, $$Y$$, $$?$$, $$Refer + guide$$),
  (3, $$Business number / tax ID$$, false, $$Add-on$$, $$Y$$, $$Y$$, $$Y$$, $$?$$, $$Guide$$),
  (4, $$Registered agent / compliance filings$$, false, $$Add-on$$, $$Y$$, $$Add-on$$, $$Y$$, $$?$$, $$Refer$$),
  (5, $$GST/HST guidance$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Y$$),
  (6, $$Money$$, true, null, null, null, null, null, null),
  (7, $$Bookkeeping$$, false, $$N$$, $$Y (tiers)$$, $$N$$, $$N$$, $$?$$, $$Refer + guide$$),
  (8, $$Tax filing$$, false, $$N$$, $$Y (tiers)$$, $$N$$, $$N$$, $$?$$, $$Refer$$),
  (9, $$Bank account setup help$$, false, $$Partner$$, $$Y (US)$$, $$N$$, $$RBC tie-in$$, $$?$$, $$Guide + refer$$),
  (10, $$Insurance and WCB guidance$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Y + refer$$),
  (11, $$Estimates, invoices, contracts templates$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Y$$),
  (12, $$Tools and presence$$, true, null, null, null, null, null, null),
  (13, $$Tool recommendations (apps)$$, false, $$N$$, $$N$$, $$N$$, $$Partner perks$$, $$?$$, $$Y$$),
  (14, $$Website and listing$$, false, $$Premium tier$$, $$N$$, $$Y$$, $$Partner discount$$, $$Y?$$, $$Y via BAS$$),
  (15, $$SEO / online presence (done for you)$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$Y?$$, $$Y via BAS$$),
  (16, $$People and relationship$$, true, null, null, null, null, null, null),
  (17, $$Industry-specific playbook$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$Contractors$$, $$Y (trades first)$$),
  (18, $$A person who has run the business$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Y (core)$$),
  (19, $$Introductions to vetted professionals$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Y (core)$$),
  (20, $$Ongoing guidance after launch$$, false, $$N$$, $$Partial$$, $$N$$, $$N$$, $$?$$, $$Y (subscription)$$),
  (21, $$Investor / funding connections$$, false, $$N$$, $$N$$, $$N$$, $$N$$, $$?$$, $$Later$$),
  (22, $$Dashboard with ordered steps$$, false, $$Y (compliance)$$, $$Y$$, $$Y$$, $$Y (minute book)$$, $$?$$, $$Y (core)$$);

insert into public.office_revenue_model (sort, referral_fee_cad, intros_per_client, caveat)
values (
  1,
  100,
  1,
  $$Client counts are illustrative, not forecasts. Referral fee depends on partner agreements. No churn, no cost side, no taxes. Subscription uses the Option A Startup Consulting and Premium Consulting prices. Replace with real numbers after the first ten clients.$$
);

insert into public.office_revenue_scenarios (sort, name, free_users, startup_clients, premium_clients) values
  (1, $$First ten (month 3)$$, 40, 7, 3),
  (2, $$Traction (month 6)$$, 150, 20, 8),
  (3, $$Scale (month 12)$$, 500, 50, 20);

-- Bring competitor cards in line with the workbook, matched by name.
update public.office_competitors set
  human_involved = $$No. Velo AI guide and support staff only$$
where name = $$ZenBusiness$$;

update public.office_competitors set
  addons = $$State fees extra. Starter rose from $197 to $297 in 2024. Annual billing only$$,
  where_we_differ = $$Proof people pay ~$3k/yr for a human attached to their business. We offer a founder-guide, not only a bookkeeper$$
where name = $$doola$$;

update public.office_competitors set
  core_offer = $$Formation bundled with AI logo, website, social templates. AI co-founder (Navi)$$,
  addons = $$Registered agent $199/yr, must be added at purchase. SaaS-style renewal$$,
  where_we_differ = $$We do online presence through BAS with real people, inside a wider startup plan$$
where name = $$Tailor Brands$$;

update public.office_competitors set
  core_offer = $$Register or incorporate, minute book, annual filings. Partner perks: FreshBooks, Tailor Brands discount, Jobber, Telus$$,
  tiers_prices = $$Sole prop: from $49 CAD. Incorporation: $499 to $699 CAD one-time. Annual plans: $199 to $599 CAD. $300 off with an RBC business account$$,
  addons = $$Discount tied to opening an RBC account. Canada only, limited provinces. No legal advice$$
where name = $$Ownr (RBC)$$;

update public.office_competitors set
  where_we_differ = $$Different model: serves businesses already running. Name conflict to check for trademark$$
where name = $$GroundWorks (US)$$;

update public.office_links
set note = $$Copied into Competitors and Pricing. This link is the original file.$$
where label = $$Competitor and pricing workbook$$;

update public.office_pricing_tiers set
  anchor = $$ZenBusiness Starter $0. Tailor Brands Lite $0$$,
  notes = $$Cost: software only. Goal: the first ten clients and an email list$$
where option = 'A' and name = $$Free: Your list$$;

update public.office_pricing_tiers set
  notes = $$Placeholder. Guide time about 2 hours a month. Referral fees may offset that$$
where option = 'A' and name = $$Startup Consulting$$;

update public.office_pricing_tiers set
  included = $$Everything above, plus done-with-you registration and set up, online presence set up by BAS, monthly check-in, priority access$$,
  anchor = $$doola Business-in-a-Box $2,999/yr (dedicated bookkeeper)$$,
  notes = $$Placeholder. This is the margin tier. Cost is guide time plus BAS delivery$$
where option = 'A' and name = $$Premium Consulting$$;
