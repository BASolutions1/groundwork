import { Footer } from "@/components/Footer";
import { GroundworkStack } from "@/components/GroundworkStack";
import { SiteNav } from "@/components/SiteNav";
import { StartForm } from "@/components/StartForm";
import { STAGE_INDEX, STAGE_PAGES, stagePath, stepLabel } from "@/lib/stages/content";
import { startIndexBreadcrumbJsonLd } from "@/lib/stages/seo";

export function StartIndexPage() {
  const published = new Set(STAGE_PAGES.map((stage) => stage.slug));

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
                SEVEN STAGES
              </p>
              <h1 className="m-0 text-[clamp(1.85rem,4.5vw,2.75rem)] leading-[1.08] font-medium tracking-[-0.035em]">
                Start your business, step by step
              </h1>
              <p className="m-0 text-[16px] leading-[1.55] text-secondary">
                Every stage in order. A short page for each one. The dashboard and a real
                person on the hard parts.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[480px] desk:max-w-none">
              <GroundworkStack mode="page" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-14 desk:px-8 desk:py-20">
          <ol className="m-0 grid list-none gap-4 p-0 tab:grid-cols-2">
            {STAGE_INDEX.map((stage) => {
              const live = published.has(stage.slug);
              const inner = (
                <>
                  <span className="mono text-[11px] tracking-[0.12em] text-muted">
                    {stepLabel(stage.step)}
                  </span>
                  <span className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">
                    {stage.shortTitle}
                  </span>
                  <span className="mt-1.5 text-[14px] leading-[1.5] text-secondary">
                    {stage.cardDescription}
                  </span>
                </>
              );

              return (
                <li key={stage.slug}>
                  {live ? (
                    <a
                      href={stagePath(stage.slug)}
                      className="flex h-full flex-col rounded-card border border-line bg-[linear-gradient(160deg,#f4f6f2,#eaf0eb)] px-5 py-5 transition-colors hover:border-[#C9D6CC]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full flex-col rounded-card border border-line bg-white px-5 py-5 opacity-70">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <StartForm />
      </main>
      <Footer />
    </>
  );
}
