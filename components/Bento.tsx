import { BentoMotion } from "./BentoMotion";
import { vignetteFor } from "./bento/vignettes";
import { HOME_FLOW_CARDS } from "@/lib/home-flow";

type Props = {
  /** Homepage keeps the section headline; /start already has its own. */
  showHeading?: boolean;
  id?: string;
};

export function Bento({ showHeading = true, id = "why" }: Props) {
  return (
    <section id={showHeading ? id : undefined}>
      <div
        className={`mx-auto flex max-w-[1200px] flex-col gap-10 px-6 desk:px-8 ${
          showHeading ? "pt-16 pb-12 desk:pt-24" : "py-14 desk:py-20"
        }`}
      >
        {showHeading ? (
          <h2 className="m-0 max-w-[680px] text-[clamp(1.75rem,3vw,2.125rem)] leading-[1.15] font-medium tracking-[-0.03em]">
            Everything it takes to start a business,{" "}
            <br className="hidden desk:block" />
            <span className="text-muted">in one simple flow.</span>
          </h2>
        ) : null}
        <BentoMotion>
          {HOME_FLOW_CARDS.map((card, index) => {
            const body = (
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
            );
            return (
              <article key={card.title} className={`bento-reveal ${card.spanClass}`}>
                {card.href ? (
                  <a href={card.href} className="block h-full text-inherit no-underline">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </article>
            );
          })}
        </BentoMotion>
      </div>
    </section>
  );
}
