import { BentoMotion } from "./BentoMotion";
import { vignetteFor, type VignetteName } from "./bento/vignettes";

type Card = {
  title: string;
  description: string;
  vignette: VignetteName;
  spanClass: string;
  surface: string;
  minHeight: number;
  paddingClass: string;
  descriptionClass: string;
  textClass: string;
};

const cards: Card[] = [
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
  },
  {
    title: "Money, set up right",
    description:
      "Business banking, bookkeeping, taxes and remittances. No surprises in the spring.",
    vignette: "money",
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
    spanClass: "desk:col-span-2",
    surface: "bg-[linear-gradient(160deg,#1C1C1E_0%,#0E0E10_100%)] text-white",
    minHeight: 380,
    paddingClass: "p-5 desk:p-7",
    descriptionClass: "text-[#A1A1A6]",
    textClass: "",
  },
];

export function Bento() {
  return (
    <section id="why">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 pt-16 pb-12 desk:px-8 desk:pt-24">
        <h2 className="m-0 max-w-[680px] text-[clamp(1.75rem,3vw,2.125rem)] leading-[1.15] font-medium tracking-[-0.03em]">
          Everything it takes to start a business,{" "}
          <br className="hidden desk:block" />
          <span className="text-muted">in one simple flow.</span>
        </h2>
        <BentoMotion>
          {cards.map((card, index) => (
            <article key={card.title} className={`bento-reveal ${card.spanClass}`}>
              <div
                className={`bcard bcard-${index + 1} relative flex h-full flex-col gap-2.5 overflow-hidden rounded-card ${card.surface} ${card.paddingClass}`}
                style={{ minHeight: card.minHeight }}
              >
                <div className={`relative z-10 flex flex-col gap-1.5 ${card.textClass}`}>
                  <h3 className="m-0 text-[19px] font-semibold tracking-[-0.015em]">
                    {card.title}
                  </h3>
                  <p className={`m-0 text-[13px] leading-normal ${card.descriptionClass}`}>
                    {card.description}
                  </p>
                </div>
                {vignetteFor(card.vignette)}
              </div>
            </article>
          ))}
        </BentoMotion>
      </div>
    </section>
  );
}
