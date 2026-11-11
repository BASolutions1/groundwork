import type { VignetteName } from "@/components/bento/vignettes";

/** Homepage bento cards — shared with /start so both surfaces stay in sync. */
export type HomeFlowCard = {
  title: string;
  description: string;
  vignette: VignetteName;
  /** Stage page when it exists; omit until that step ships. */
  href?: string;
  spanClass: string;
  surface: string;
  minHeight: number;
  paddingClass: string;
  descriptionClass: string;
  textClass: string;
};

export const HOME_FLOW_CARDS: HomeFlowCard[] = [
  {
    title: "Get registered, in the right order",
    description:
      "Name, business number, GST, WCB, insurance, licensing. Each step unlocks when the one before it is done.",
    vignette: "register",
    spanClass: "tab:col-span-2 desk:col-span-4",
    surface: "bg-card-tint",
    minHeight: 400,
    paddingClass: "px-5 pt-5 pb-5 desk:px-7 desk:pt-7 desk:pb-0",
    descriptionClass: "text-secondary",
    textClass: "max-w-[420px]",
    href: "/start/register-a-business",
  },
  {
    title: "Money, set up right",
    description:
      "Business banking, bookkeeping, taxes and remittances. No surprises in the spring.",
    vignette: "money",
    href: "/start/business-bank-account-and-bookkeeping",
    spanClass: "desk:col-span-2",
    surface: "bg-card-tint",
    minHeight: 400,
    paddingClass: "p-5 desk:p-7",
    descriptionClass: "text-secondary",
    textClass: "",
  },
  {
    title: "Estimate, invoice, get paid",
    description: "Send a proper invoice. Get paid by card or e-transfer, on time.",
    vignette: "paid",
    href: "/start/estimates-invoices-and-getting-paid",
    spanClass: "desk:col-span-2",
    surface: "bg-card-tint",
    minHeight: 380,
    paddingClass: "p-5 desk:p-7",
    descriptionClass: "text-secondary",
    textClass: "",
  },
  {
    title: "Supercharge your online presence",
    description:
      "Proven local SEO, done for you. Show up when people search, including in AI answers, so you can focus on the work.",
    vignette: "presence",
    href: "/start/get-found-online",
    spanClass: "tab:col-span-2 desk:col-span-4",
    surface: "bg-card-accent",
    minHeight: 520,
    paddingClass: "px-5 pt-5 pb-5 desk:px-7 desk:pt-7 desk:pb-0",
    descriptionClass: "text-secondary",
    textClass: "max-w-[460px]",
  },
  {
    title: "Tools that fit, all connected",
    description:
      "Estimating, invoicing, scheduling, CRM. A few good ones that talk to each other, not thirty.",
    vignette: "tools",
    href: "/start/tools-that-fit",
    spanClass: "desk:col-span-2",
    surface: "bg-card-tint",
    minHeight: 380,
    paddingClass: "px-5 pt-5 pb-5 desk:px-7 desk:pt-7 desk:pb-0",
    descriptionClass: "text-secondary",
    textClass: "",
  },
  {
    title: "Who to call",
    description:
      "Accountant, insurance, lawyer, suppliers. Vetted, local to you, and we make the introduction.",
    vignette: "network",
    href: "/start/who-to-call",
    spanClass: "desk:col-span-2",
    surface: "bg-card-tint",
    minHeight: 520,
    paddingClass: "px-5 pt-5 pb-5 desk:px-7 desk:pt-7 desk:pb-0",
    descriptionClass: "text-secondary",
    textClass: "",
  },
  {
    title: "A professional at the hard parts",
    description:
      "When a step needs judgement or a phone call, someone who's already done this picks it up with you.",
    vignette: "person",
    href: "/start/a-guide-for-the-hard-parts",
    spanClass: "desk:col-span-2",
    surface: "bg-[linear-gradient(160deg,#1C1C1E_0%,#0E0E10_100%)] text-white",
    minHeight: 380,
    paddingClass: "p-5 desk:p-7",
    descriptionClass: "text-[#A1A1A6]",
    textClass: "",
  },
];
