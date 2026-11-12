-- Site office seed. Text is the working copy for Joel, Matas, and Brandan.

insert into public.office_links (sort, label, url) values
  (1, $$Live site$$, $$https://groundwork-tau-jet.vercel.app$$),
  (2, $$Competitor and pricing workbook$$, $$https://docs.google.com/spreadsheets/d/1pp0Um8sfqDA_YuFIoLBkuQVbQy0r7KU4ce7GRraDPqc/edit$$);

insert into public.office_tasks (sort, title, status, owner, detail) values
  (1, $$Dashboard: migrations, auth and RLS$$, 'doing', 'Joel', null),
  (2, $$Dashboard: overview with the stack progress widget$$, 'todo', 'Joel', null),
  (3, $$Dashboard: step pages, People, Settings$$, 'todo', 'Joel', null),
  (4, $$Stage pages: add stage block to hero, breadcrumbs, answer the query in the first paragraph, remove the "days to operating" placeholder$$, 'todo', 'Joel', null),
  (5, $$Choose the /start index layout$$, 'todo', 'All', $$Five layouts are mocked.$$),
  (6, $$Hero tweaks: trim sub to two lines, role icons for avatars, nudge text up, check bottom edge$$, 'todo', 'Joel', null),
  (7, $$Re-verify every competitor price on the vendor's own site$$, 'todo', 'Matas', $$Current prices come from review sites.$$),
  (8, $$Find the GroundWorks (US) platform Brandan mentioned$$, 'todo', 'Brandan', $$Need the link. The one on the Canadian register is a foundation repair contractor.$$),
  (9, $$Draft what each service package includes$$, 'todo', 'All', null),
  (10, $$Draft the first trades playbook steps (20 to 25)$$, 'todo', 'Brandan', null),
  (11, $$Strategy call$$, 'todo', 'All', $$Week of 16 Nov 2026.$$),
  (12, $$Trademark agent clearance opinion on a two-word mark$$, 'on_hold', 'Joel', $$Waiting on the name decision.$$),
  (13, $$Buy the domain$$, 'on_hold', 'Joel', $$Waiting on the name decision.$$),
  (14, $$Final logo$$, 'on_hold', 'All', $$Branding decisions wait for Brandan.$$),
  (15, $$Assistant in the dashboard$$, 'todo', 'Joel', $$Designed, not built. Starts after the dashboard is in.$$);

insert into public.office_decisions (sort, question, why, owner, status) values
  (1, $$What does Free include, exactly?$$, $$It is the acquisition funnel. Too generous and nobody pays; too thin and nobody signs up.$$, 'All', 'open'),
  (2, $$Launch package then annual Membership (Option B), or monthly subscription (Option A)?$$, $$Every competitor is annual recurring. The guide's time is heaviest in the first 90 days.$$, 'Brandan', 'open'),
  (3, $$Do we take referral fees from accountants, brokers, lawyers?$$, $$Affects pricing, trust, and what we disclose to clients.$$, 'All', 'open'),
  (4, $$Do we refer registration to Ownr or do it ourselves?$$, $$Ownr owns the filing lane in Canada and is bank-backed. Competing there is expensive.$$, 'Joel', 'open'),
  (5, $$Name: which two-word mark and domain, and when do we get a trademark agent's clearance opinion?$$, $$A Class 35 application for Groundwork is ahead of us. The bare word is likely off the table. Spoken brand, logo and site stay.$$, 'All', 'on_hold'),
  (6, $$Who is the public face?$$, $$The whole pitch is "someone who has done it".$$, 'Brandan', 'on_hold'),
  (7, $$Playbooks beyond trades: who writes them?$$, $$The expansion path depends on finding one person per industry.$$, 'All', 'open'),
  (8, $$Which tools do we recommend, and do we take referral fees on them?$$, $$Tool picks are part of Free. Same trust and disclosure question as professional referrals.$$, 'All', 'open'),
  (9, $$When does the investor angle become active?$$, $$Naming it too early sets an expectation we cannot meet yet.$$, 'Brandan', 'open'),
  (10, $$Homepage form: create the account right away, or collect email first?$$, $$Right now it creates the account. Email-first asks for less up front.$$, 'Joel', 'open'),
  (11, $$Roles, ownership, and how Groundwork relates to our other businesses$$, $$Needed before incorporating, opening a payment account or filing the trademark.$$, 'All', 'on_hold');

insert into public.office_risks (sort, title, severity, status, owner, detail, mitigation) values
  (1, $$Name conflict in Class 35$$, 'high', 'open', 'Joel', $$CIPO application 2474171 "Groundwork" (staffing and recruiting, filed 2026-05-08) is ahead of us. Registered mark 1751481 also covers Class 35.$$, $$Operate under a two-word mark, keep services narrow (no recruiting or HR), get a clearance opinion before any brand spend.$$),
  (2, $$Ownership and roles undecided$$, 'high', 'open', 'All', $$Blocks incorporation, the payment account and the trademark filing.$$, $$On the agenda for the call the week of 16 Nov.$$),
  (3, $$The guide's time does not scale$$, 'high', 'open', 'Brandan', $$The product is a person. One guide can only carry so many clients.$$, $$Define hours per client per tier before pricing. Recruit one guide per playbook.$$),
  (4, $$Competitor prices are second-hand$$, 'medium', 'open', 'Matas', $$All figures come from 2026 review sites.$$, $$Re-verify on vendor sites before any pitch.$$),
  (5, $$No retention data$$, 'medium', 'open', 'All', $$Option A beats Option B only if clients stay on monthly for about seven months or more. We do not know.$$, $$Track it from the first ten clients.$$),
  (6, $$Guidance read as advice$$, 'medium', 'open', 'All', $$We guide and refer. We do not give legal, tax or accounting advice.$$, $$One clear line on relevant pages and in the assistant's rules. Professionals give the advice.$$),
  (7, $$Referral fees and trust$$, 'medium', 'open', 'All', $$Undisclosed fees would undercut the "someone on your side" pitch.$$, $$Decide yes or no, and disclose if yes.$$),
  (8, $$Province rules differ$$, 'medium', 'open', 'Joel', $$Registration, GST/HST and workers compensation vary by province. A wrong step damages trust.$$, $$Province notes per step, reviewed by a professional before launch.$$),
  (9, $$Dependence on Ownr for filing$$, 'low', 'watching', 'Joel', $$If we refer registration out, that block is outside our control.$$, $$Keep the step generic so the referral can change.$$);

insert into public.office_competitors (
  sort, name, website, country, what_they_are, who_for, core_offer, tiers_prices, addons,
  human_involved, industry_specific, ongoing, revenue_model, where_we_differ, source, verified_on
) values
  (1, $$ZenBusiness$$, $$www.zenbusiness.com$$, $$US$$, $$Online formation and compliance platform$$, $$First-time LLC owners$$, $$Form the entity, then keep it compliant: annual reports, registered agent, dashboard$$, $$Starter: $0 + state fees. Pro: ~$199/yr. Premium: ~$349/yr$$, $$Registered agent $199/yr, not in any plan. EIN fee. Plans auto-renew$$, $$No. AI guide and support staff only$$, $$No$$, $$Compliance only. No advice, no network$$, $$Free front door, annual subscription, add-on upsell$$, $$We add the order beyond filing, a person who has run the business, and a network$$, $$llccompass.com$$, null),
  (2, $$doola$$, $$www.doola.com$$, $$US$$, $$Formation plus bookkeeping and tax, strong with non-US founders$$, $$Founders, including international$$, $$Formation, EIN, registered agent, US address. Higher tiers add bookkeeping and tax filing$$, $$Starter: $297/yr. Tax and Compliance: $1,999/yr. Business-in-a-Box: $2,999/yr$$, $$State fees extra. Annual billing only$$, $$Partly. Top tier includes a dedicated bookkeeper$$, $$No$$, $$Bookkeeping and filings. Finance only$$, $$Annual tiers. People are the premium tier$$, $$Evidence people pay about $3k a year for a human attached to their business. We offer a founder-guide, not only a bookkeeper$$, $$llcstarters.com$$, null),
  (3, $$Tailor Brands$$, $$www.tailorbrands.com$$, $$US$$, $$Branding tools that added formation$$, $$First-time founders who want a logo and site too$$, $$Formation bundled with AI logo, website, social templates$$, $$Lite: $0 + state fees. Essential: $199/yr. Elite: $249/yr$$, $$Registered agent $199/yr, must be added at purchase$$, $$No$$, $$No$$, $$Branding tools and compliance reminders$$, $$Annual subscription plus add-ons$$, $$We do online presence with real people, inside a wider startup plan$$, $$startupowl.com$$, null),
  (4, $$Ownr (RBC)$$, $$www.ownr.co$$, $$Canada$$, $$Canadian registration and incorporation platform$$, $$Canadians registering a sole prop or incorporating$$, $$Register or incorporate, minute book, annual filings, partner perks$$, $$Sole prop: from $49 CAD. Incorporation: $499 to $699 CAD one-time. Annual plans: $199 to $599 CAD. $300 off with an RBC business account$$, $$Discount tied to opening an RBC account. Limited provinces. No legal advice$$, $$No$$, $$No$$, $$Compliance renewals only$$, $$One-time filing fee plus annual plans. Bank acquisition funnel$$, $$They own Canadian filing. We refer to them for that block and own everything around it$$, $$dupple.com$$, null),
  (5, $$GroundWorks (US)$$, null, $$US$$, $$Per Brandan: all-in-one management platform for contractors and service businesses (web, marketing, scheduling, invoicing, AI automation)$$, $$Established contractors$$, $$Unknown. Needs link$$, $$Unknown. Needs link$$, $$Unknown$$, $$Unknown$$, $$Yes (contractors)$$, $$Unknown$$, $$Unknown$$, $$Different model: serves businesses already running$$, $$Brandan to send link$$, null);

insert into public.office_pricing_tiers (
  sort, option, name, price_cad, price_note, billing, included, who_for, anchor, notes
) values
  (1, 'A', $$Free: Your list$$, 0, null, $$Free$$, $$Intake, ordered list for your industry, templates, tool picks, dashboard access$$, $$Anyone starting a business$$, $$Competitor free tiers$$, $$Cost: software only$$),
  (2, 'A', $$Startup Consulting$$, 149, $$per month$$, $$Monthly, cancel anytime$$, $$Everything in Free, plus a guide call at each stage, introductions to accountant, insurance broker and bank, first estimate and invoice reviewed$$, $$Someone who will do the work with a person checking it$$, $$doola Starter $297/yr, ZenBusiness Pro $199/yr (no human in either)$$, $$Placeholder$$),
  (3, 'A', $$Premium Consulting$$, 499, $$per month$$, $$Monthly for 3 months, then Startup rate$$, $$Everything above, plus done-with-you registration and set up, online presence set up for you, monthly check-in, priority access$$, $$Someone who wants it handled and to stay guided$$, $$doola Business-in-a-Box $2,999/yr$$, $$Placeholder. This is the margin tier$$),
  (4, 'A', $$Full Startup Assistance$$, null, $$TBD$$, $$One-time package$$, $$Full launch package, business plan, financing prep, branding, every introduction made and followed through$$, $$Someone who wants a team$$, $$No direct comparable$$, $$Priced per engagement$$),
  (5, 'A', $$Growth (later)$$, null, $$TBD$$, $$Monthly$$, $$Ongoing advisory, specialist introductions, investor connections$$, $$Launched clients who stay$$, null, $$Only once the first ten are launched$$),
  (6, 'B', $$Free: Your list$$, 0, null, $$Free$$, $$Same as Option A$$, $$Anyone starting a business$$, $$Competitor free tiers$$, $$Cost: software only$$),
  (7, 'B', $$Startup Launch$$, 447, $$one-time$$, $$One-time, covers 90 days$$, $$First 90 days. A guide call at each stage, introductions, first estimate and invoice reviewed$$, $$Someone who will do the work with a person checking it$$, $$doola Starter $297/yr, ZenBusiness Pro $199/yr$$, $$Placeholder: 3 months of the Option A Startup rate$$),
  (8, 'B', $$Premium Launch$$, 1497, $$one-time$$, $$One-time, covers 90 days$$, $$Everything in Startup Launch, plus done-with-you registration and set up, online presence set up for you, priority access$$, $$Someone who wants it handled$$, $$doola Business-in-a-Box $2,999/yr$$, $$Placeholder: 3 months of the Option A Premium rate$$),
  (9, 'B', $$Membership$$, 599, $$per year$$, $$Annual, renews$$, $$After the 90 days: dashboard and list stay live, access to your guide, check-ins, introductions as you grow. Inclusions to decide$$, $$Launched clients who stay$$, $$Ownr annual plans $199 to $599 CAD$$, $$Placeholder only$$),
  (10, 'B', $$Full Startup Assistance$$, null, $$TBD$$, $$One-time package, Membership after$$, $$Same as Option A$$, $$Someone who wants a team$$, $$No direct comparable$$, $$Priced per engagement$$),
  (11, 'B', $$Growth (later)$$, null, $$TBD$$, $$Annual, higher Membership tier$$, $$Same as Option A$$, $$Launched clients who stay$$, null, $$Only once the first ten are launched$$);

insert into public.office_notes (sort, slug, title, pinned, body) values
  (1, $$what-groundwork-is$$, $$What Groundwork is$$, true, $$"Start your business. Know exactly what's next." A startup guidance platform plus real professional support. A short online intake organizes the person's situation, they get a step-by-step list in the right order in a dashboard, and a real person who has run that kind of business, plus a vetted network, steps in for the parts that need judgement, introductions or doing. The people, the experience and the network are the product. Any industry from day one; guidance is organized as industry playbooks, trades first. Canada-wide, virtual first. Long-term relationship, not a one-time launch.$$),
  (2, $$who-it-is-for$$, $$Who it is for$$, false, $$People who hate their job and want to start something, and people who have been sitting on an idea for a while. Both want simplicity and someone to ask.$$),
  (3, $$where-we-differ$$, $$Where we differ$$, true, $$1. Every competitor runs a cheap or free front door and makes money on annual renewals and add-ons. 2. None includes a person who has run the kind of business you are starting. 3. doola charges about $3,000 a year for its tier with a dedicated human, which is evidence people pay for a person. 4. Ownr owns Canadian registration; refer, do not compete. 5. Nobody is industry-specific. All of this needs re-verifying before any pitch.$$),
  (4, $$name-and-trademark$$, $$Name and trademark$$, true, $$Checked on CIPO 4 Nov 2026. 2474171 "Groundwork", Class 35, formalized, filed 2026-05-08 by a staffing and recruiting firm: same word, same class, ahead of us. 1751481 GROUNDWORK registered in 30/35/40/43. Several live GROUNDWORKS marks in construction trades. Plan: keep "Groundwork" as the spoken brand, register and operate as a two-word mark, get a trademark agent's clearance opinion, file the word mark in 35 and 42 and the block logo as a design mark, describe services narrowly. Do not buy a domain until the two-word name is chosen. Avoid "groundworks" anything.$$),
  (5, $$working-rules$$, $$Working rules for public copy$$, false, $$Canadian spelling. Plain, direct language. No invented statistics or claims. People first; the online intake is a tool, not the pitch. Never name a city or province. Roles only, no real professionals' names. We guide and refer; we do not give legal, tax or accounting advice.$$);
