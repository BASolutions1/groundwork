import { Bento } from "@/components/Bento";
import { Footer } from "@/components/Footer";
import { GroundworkStack } from "@/components/GroundworkStack";
import { SiteNav } from "@/components/SiteNav";
import { StartForm } from "@/components/StartForm";
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

        <Bento showHeading={false} />

        <StartForm />
      </main>
      <Footer />
    </>
  );
}
