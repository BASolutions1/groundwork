import type { StageContent } from "./types";

/** Index order for all seven stages. Full page content ships per stage as reviewed. */
export const STAGE_INDEX: {
  slug: string;
  step: number;
  shortTitle: string;
  cardDescription: string;
}[] = [
  {
    slug: "register-a-business",
    step: 1,
    shortTitle: "Register a business",
    cardDescription: "Name, structure, business number. The first legal steps, in order.",
  },
  {
    slug: "gst-hst-and-taxes",
    step: 2,
    shortTitle: "GST/HST and taxes",
    cardDescription: "Whether you need a GST number, and how to set money aside.",
  },
  {
    slug: "business-bank-account-and-bookkeeping",
    step: 3,
    shortTitle: "Bank account and books",
    cardDescription: "Separate business money, open an account, keep simple books.",
  },
  {
    slug: "wcb-and-insurance",
    step: 4,
    shortTitle: "Insurance and coverage",
    cardDescription: "What coverage you may need before you open, hire or take clients.",
  },
  {
    slug: "estimates-invoices-and-getting-paid",
    step: 5,
    shortTitle: "Quotes, invoices and getting paid",
    cardDescription: "Send a clear quote, invoice properly, get paid without chasing.",
  },
  {
    slug: "tools-that-fit",
    step: 6,
    shortTitle: "Tools that fit",
    cardDescription: "A few apps that talk to each other, not a pile of tabs.",
  },
  {
    slug: "get-found-online",
    step: 7,
    shortTitle: "Get found online",
    cardDescription: "Listings, reviews and a simple site so people can find you.",
  },
];

export const STAGE_PAGES: StageContent[] = [
  {
    slug: "register-a-business",
    step: 1,
    shortTitle: "Register a business",
    cardDescription: "Name, structure, business number. The first legal steps, in order.",
    h1: "How to register a business in Canada",
    heroLead:
      "Name, structure and a business number, in the right order, with someone who has done this before.",
    heroImage: "/hero/stack-hero-01-register.png",
    metaDescription:
      "How to register a business in Canada: name, structure and business number, in order, with a real person on the hard parts.",
    primaryQuery: "how to register a business in Canada",
    secondaryQueries: [
      "business number",
      "register a business name",
      "sole proprietorship vs incorporation",
    ],
    whatThisStepIs: [
      "To register a business in Canada you choose a structure, register the name, and get a business number; the exact forms vary by province.",
      "The dashboard asks where you are and adjusts the list. You do not need every form at once, just the next one, then the one after that.",
    ],
    parts: [
      { icon: "structure", label: "Choose a structure that fits how you work" },
      { icon: "name", label: "Register or reserve your business name" },
      { icon: "number", label: "Get a business number when you are ready" },
      { icon: "check", label: "Confirm what else unlocks next in your province" },
    ],
    stuck: [
      "Spending weeks comparing sole prop and incorporation with no clear next move.",
      "Registering a name in the wrong place, then starting over.",
      "Paying for a GST account you didn't need yet.",
    ],
    how: {
      dashboard:
        "Your list shows each registration step in order, with the ones that wait greyed out until the one before is done.",
      you: "You answer a few questions about where you are and what you are starting. Then you work the next item on the list.",
      person:
        "Your guide stays with you on the judgement calls, and an accountant joins when structure or filings need a second set of eyes.",
      withUsRole: "your guide",
    },
    vignette: "register",
    faq: [
      {
        question: "What is a business number, and when do I get one?",
        answer:
          "A business number is the identifier the CRA uses for your business accounts. On Groundwork it sits on your list after name and structure are settled, so you are not applying for accounts you do not need yet. An accountant confirms which ones apply to you.",
      },
      {
        question: "Do I need to register a business name?",
        answer:
          "If you operate under a name other than your own legal name, you usually need to register that trade name where you work. The dashboard flags whether a name search or registration is next for your province, and your guide walks you through the form.",
      },
      {
        question: "Sole proprietorship or incorporation?",
        answer:
          "Sole prop is simpler to start; incorporation adds formality and cost. Groundwork does not decide for you. It lays out what each path involves, then an accountant helps you pick based on how you plan to operate.",
      },
    ],
    headings: {
      what: "What this step is",
      stuck: "Where people get stuck",
      how: "How Groundwork handles it",
      faq: "Questions people ask",
    },
  },
];

export function getStageBySlug(slug: string): StageContent | undefined {
  return STAGE_PAGES.find((stage) => stage.slug === slug);
}

export function getAdjacentStages(slug: string) {
  const index = STAGE_INDEX.findIndex((stage) => stage.slug === slug);
  if (index < 0) return { prev: null, next: null };
  return {
    prev: index > 0 ? STAGE_INDEX[index - 1] : null,
    next: index < STAGE_INDEX.length - 1 ? STAGE_INDEX[index + 1] : null,
  };
}

export function stagePath(slug: string) {
  return `/start/${slug}`;
}

export function stepLabel(step: number) {
  return `STEP ${step} OF 7`;
}
