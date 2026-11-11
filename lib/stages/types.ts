import type { VignetteName } from "@/components/bento/vignettes";

export type StagePartIcon =
  | "name"
  | "number"
  | "structure"
  | "tax"
  | "bank"
  | "books"
  | "shield"
  | "invoice"
  | "tools"
  | "search"
  | "review"
  | "web"
  | "check";

export type StageContent = {
  slug: string;
  step: number;
  /** Short label for cards and nav. */
  shortTitle: string;
  /** Card blurb on /start. */
  cardDescription: string;
  /** H1 and primary query, plain words. */
  h1: string;
  /** Replaces "STEP n OF 7" when the page sits beside the numbered sequence. */
  eyebrow?: string;
  /** One sentence under the H1. */
  heroLead: string;
  /** Full-bleed hero background. Drop the full-res file in /public. */
  heroImage?: string;
  /**
   * Which side the copy sits on. Match the empty side of the artwork.
   * Left: stack on the right. Right: stack on the left.
   */
  heroAlign?: "left" | "right";
  metaDescription: string;
  primaryQuery: string;
  secondaryQueries: string[];
  whatThisStepIs: string[];
  parts: { icon: StagePartIcon; label: string }[];
  stuck: string[];
  how: {
    dashboard: string;
    you: string;
    person: string;
    /** Role shown with the with-us tag, e.g. "your guide". */
    withUsRole: string;
  };
  vignette: VignetteName;
  faq: { question: string; answer: string }[];
  /** Natural-language H2s. */
  headings: {
    what: string;
    stuck: string;
    how: string;
    faq: string;
  };
};
