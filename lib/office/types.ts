export const OWNERS = ["Joel", "Matas", "Brandan", "All"] as const;

export type Owner = (typeof OWNERS)[number];

export type OfficeTable =
  | "office_tasks"
  | "office_decisions"
  | "office_risks"
  | "office_competitors"
  | "office_pricing_tiers"
  | "office_notes"
  | "office_links"
  | "office_framework"
  | "office_revenue_model"
  | "office_revenue_scenarios";

export type EditorFields = {
  updated_at: string | null;
  updated_by: string | null;
  editor_name: string | null;
};

export type OfficeTask = EditorFields & {
  id: string;
  sort: number;
  title: string;
  detail: string | null;
  status: "todo" | "doing" | "done" | "on_hold";
  owner: Owner | null;
  due_on: string | null;
};

export type OfficeDecision = EditorFields & {
  id: string;
  sort: number;
  question: string;
  why: string | null;
  owner: string | null;
  status: "open" | "decided" | "on_hold";
  decision: string | null;
  decided_on: string | null;
};

export type OfficeRisk = EditorFields & {
  id: string;
  sort: number;
  title: string;
  detail: string | null;
  severity: "low" | "medium" | "high";
  status: "open" | "watching" | "resolved";
  mitigation: string | null;
  owner: string | null;
};

export type OfficeCompetitor = EditorFields & {
  id: string;
  sort: number;
  name: string;
  website: string | null;
  country: string | null;
  what_they_are: string | null;
  who_for: string | null;
  core_offer: string | null;
  tiers_prices: string | null;
  addons: string | null;
  human_involved: string | null;
  industry_specific: string | null;
  ongoing: string | null;
  revenue_model: string | null;
  where_we_differ: string | null;
  source: string | null;
  verified_on: string | null;
};

export type OfficePricingTier = EditorFields & {
  id: string;
  sort: number;
  option: "A" | "B";
  name: string;
  included: string | null;
  who_for: string | null;
  price_cad: number | null;
  price_note: string | null;
  billing: string | null;
  anchor: string | null;
  notes: string | null;
};

export type OfficeNote = EditorFields & {
  id: string;
  sort: number;
  slug: string;
  title: string;
  body: string;
  pinned: boolean;
};

export type OfficeLink = EditorFields & {
  id: string;
  sort: number;
  label: string;
  url: string;
  note: string | null;
};

export type OfficeFramework = EditorFields & {
  id: string;
  sort: number;
  feature: string;
  is_heading: boolean;
  zenbusiness: string | null;
  doola: string | null;
  tailor_brands: string | null;
  ownr: string | null;
  groundworks: string | null;
  proposal: string | null;
};

export type OfficeRevenueModel = EditorFields & {
  id: string;
  sort: number;
  label: string;
  referral_fee_cad: number | null;
  intros_per_client: number | null;
  caveat: string | null;
};

export type OfficeRevenueScenario = EditorFields & {
  id: string;
  sort: number;
  name: string;
  free_users: number | null;
  startup_clients: number | null;
  premium_clients: number | null;
};

export type OfficeActivity = {
  id: string;
  actor_name: string | null;
  summary: string | null;
  created_at: string;
};

export type OfficePatch = Record<string, string | number | boolean | null>;
