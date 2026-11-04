import { Footer } from "@/components/Footer";
import { GroundworkStack } from "@/components/GroundworkStack";
import { SiteNav } from "@/components/SiteNav";
import { StartForm } from "@/components/StartForm";
import { vignetteFor } from "@/components/bento/vignettes";
import { HOME_FLOW_CARDS } from "@/lib/home-flow";
import { startIndexBreadcrumbJsonLd } from "@/lib/stages/seo";

export function StartIndexPage() {
  return (
    <>
      <SiteNav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(startIndexBreadcrumbJsonLd()),
          }}
        />

        <section className="border-b border-line">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-6 pt-12 pb-14 desk:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] desk:gap-12 desk:px-8 desk:pt-16 desk:pb-20">
            <div className="flex max-w-[520px] flex-col gap-5">
              <p className="mono m-0 text-[11px] tracking-[0.14em] text-muted">
                FIVE STAGES
              </p>
              <h1 className="m-0 text-[clamp(1.85rem,4.5vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.035em]">
                Start your business, step by step
              </h1>
              <p className="m-0 text-[16px] leading-[1.55] text-secondary">
                Register to grow, in order. Short pages underneath for the work inside
                each stage. The dashboard and a real person on the hard parts.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[480px] desk:max-w-none">
              <GroundworkStack mode="page" face="left" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-14 desk:px-8 desk:py-20">
          <div className="grid grid-cols-1 gap-3 tab:grid-cols-2 desk:grid-cols-6 desk:gap-4">
            {HOME_FLOW_CARDS.map((card, index) => {
              const body = (
                <div
                  className={`relative flex h-full flex-col gap-2.5 overflow-hidden rounded-card ${card.surface} ${card.paddingClass}`}
                  style={{ minHeight: Math.min(card.minHeight, 360) }}
                >
                  <div className={`relative z-10 flex flex-col gap-1.5 ${card.textClass}`}>
                    <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">
                      {String(index + 1).padStart(2, "0")} / 07
                    </p>
                    <h2 className="m-0 text-[19px] font-semibold tracking-[-0.015em]">
                      {card.title}
                    </h2>
                    <p className={`m-0 text-[13px] leading-normal ${card.descriptionClass}`}>
                      {card.description}
                    </p>
                  </div>
                  {vignetteFor(card.vignette)}
                </div>
              );

              return (
                <article key={card.title} className={card.spanClass}>
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
          </div>
        </section>

        <StartForm />
      </main>
      <Footer />
    </>
  );
}
