export type StepStatus = "todo" | "next" | "done" | "skipped";
export type IntroStatus = "requested" | "introduced" | "scheduled" | "done";
export type ProfessionalRole =
  "accountant" | "insurance_broker" | "lawyer" | "bookkeeper" | "web" | "guide";

export type Profile = {
  id: string;
  full_name: string | null;
  business_name: string | null;
  business_type: string | null;
  phone: string | null;
  province: string | null;
  tier: string;
  created_at: string;
};

export type PlaybookStep = {
  id: string;
  playbook_id: string;
  stage: number;
  order: number;
  slug: string;
  title: string;
  summary: string;
  what_youll_do: string[];
  with_us: boolean;
  estimated_minutes: number;
  help_url: string;
};

export type UserStep = {
  id: string;
  user_id: string;
  step_id: string;
  status: StepStatus;
  done_at: string | null;
  notes: string | null;
  checklist_done: number[];
  completion_note: string | null;
};

export type Professional = {
  id: string;
  role: ProfessionalRole;
  display_name: string;
  region: string | null;
  intro_blurb: string;
  stage: number | null;
};

export type Introduction = {
  id: string;
  user_id: string;
  professional_id: string;
  status: IntroStatus;
  requested_at: string;
  scheduled_for: string | null;
};

export const STAGE_META: Record<number, { slug: string; title: string; short: string }> =
  {
    1: { slug: "register-a-business", title: "Register", short: "Register" },
    2: { slug: "gst-hst-and-taxes", title: "GST/HST and taxes", short: "Taxes" },
    3: {
      slug: "business-bank-account-and-bookkeeping",
      title: "Bank account and books",
      short: "Set up",
    },
    4: { slug: "wcb-and-insurance", title: "Insurance and coverage", short: "Insurance" },
    5: {
      slug: "estimates-invoices-and-getting-paid",
      title: "Quotes, invoices and getting paid",
      short: "Get paid",
    },
    6: { slug: "tools-that-fit", title: "Tools that fit", short: "Tools" },
    7: { slug: "get-found-online", title: "Get found online", short: "Get found" },
  };
