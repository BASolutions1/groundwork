import Image from "next/image";
import type { ReactNode } from "react";
import { vignetteFor } from "@/components/bento/vignettes";
import { Footer } from "@/components/Footer";
import { BusinessQuestionForm } from "@/components/forms/BusinessQuestionForm";
import { SiteNav } from "@/components/SiteNav";
import { StartForm } from "@/components/StartForm";
import { getAdjacentStages, stagePath, stepLabel } from "@/lib/stages/content";
import { stageBreadcrumbJsonLd, stageFaqJsonLd } from "@/lib/stages/seo";
import type { StageContent } from "@/lib/stages/types";
import { StageProgressStack, stackIndexForStep } from "./StageProgressStack";

function StageSectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-4 desk:w-[min(100%,300px)]">
      <span
        className="hidden h-14 w-[2px] shrink-0 rounded-full bg-done desk:block"
        aria-hidden="true"
      />
      <div>
        <h2 className="m-0 text-[clamp(1.35rem,2.5vw,1.625rem)] font-medium tracking-[-0.025em]">
          {children}
        </h2>
        <span
          className="mt-4 block h-[2px] w-12 rounded-full bg-done desk:hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function StageBreadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-[13px] text-muted">
        <li>
          <a href="/" className="hover:text-ink">
            Home
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <a href="/start" className="hover:text-ink">
            Start
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-ink" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function StageHeroCopy({ stage }: { stage: StageContent }) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <p className="mono m-0 text-[11px] tracking-[0.14em] text-muted">
        {stage.eyebrow ?? stepLabel(stage.step)}
      </p>
      <h1 className="m-0 text-[clamp(1.75rem,3.6vw,2.85rem)] leading-[1.06] font-medium tracking-[-0.035em]">
        {stage.h1}
      </h1>
      <p className="m-0 text-[16px] leading-[1.55] text-secondary">{stage.heroLead}</p>
      <BusinessQuestionForm idPrefix={`stage-${stage.slug}`} />
    </div>
  );
}

function HeroArtwork({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      quality={90}
      sizes="100vw"
      className="object-cover object-top [mask-image:linear-gradient(to_bottom,#000_0%,#000_84%,#000000b3_93%,#0000_100%)] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_84%,#000000b3_93%,#0000_100%)] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%]"
    />
  );
}

export function StagePage({ stage }: { stage: StageContent }) {
  const { prev, next } = getAdjacentStages(stage.slug);
  const heroImage = stage.heroImage;
  const copyOnRight = stage.heroAlign === "right";

  return (
    <>
      {heroImage ? (
        <div className="relative overflow-hidden bg-white">
          <SiteNav overlay />
          {/*
            The artwork is 16:9 and full-bleed. The hero stays at least that
            tall, so a wide window shows the whole stack instead of cropping it.
            Copy sits in the empty side once the window is wide enough.
          */}
          <section className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[16/9] w-full min-[680px]:block">
              <HeroArtwork src={heroImage} />
            </div>
            <div className="relative z-[2] mx-auto flex w-full max-w-[1200px] flex-col px-6 pt-32 pb-10 min-[680px]:min-h-[56.25vw] min-[900px]:justify-center min-[900px]:px-8 min-[900px]:pt-24 min-[900px]:pb-14">
              <div
                className={`flex w-full max-w-[500px] flex-col gap-5 ${
                  copyOnRight
                    ? "min-[680px]:ml-auto min-[680px]:w-[min(500px,46%)] min-[680px]:max-w-[min(500px,46%)]"
                    : "min-[680px]:w-[min(500px,46%)] min-[680px]:max-w-[min(500px,46%)]"
                }`}
              >
                <StageBreadcrumb title={stage.shortTitle} />
                <StageHeroCopy stage={stage} />
              </div>
            </div>
            <div className="relative aspect-[16/9] w-full min-[680px]:hidden">
              <HeroArtwork src={heroImage} />
            </div>
          </section>
        </div>
      ) : (
        <>
          <SiteNav />
          <div className="border-b border-line">
            <div className="mx-auto max-w-[1200px] px-6 pt-5 desk:px-8">
              <StageBreadcrumb title={stage.shortTitle} />
            </div>
            <section>
              <div className="mx-auto grid max-w-[1200px] gap-8 px-6 pt-6 pb-12 desk:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] desk:items-end desk:gap-10 desk:px-8 desk:pt-8 desk:pb-14">
                <StageHeroCopy stage={stage} />
                <StageProgressStack
                  activeIndex={stackIndexForStep(stage.step)}
                  className="hidden w-full justify-self-center tab:block desk:justify-self-end"
                />
              </div>
            </section>
          </div>
        </>
      )}

      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stageFaqJsonLd(stage)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(stageBreadcrumbJsonLd(stage)),
          }}
        />

        <section className="mx-auto max-w-[1200px] px-6 py-12 desk:px-8 desk:py-16">
          <div className="flex flex-col gap-8 desk:flex-row desk:items-center desk:gap-16">
            <StageSectionHeading>{stage.headings.what}</StageSectionHeading>
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {stage.whatThisStepIs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="m-0 text-[16px] leading-[1.65] text-secondary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-[#FAFBFA]">
          <div className="mx-auto max-w-[1200px] px-6 py-14 desk:px-8 desk:py-20">
            <div className="mb-10 flex flex-col gap-2 desk:mb-14 desk:flex-row desk:items-end desk:justify-between">
              <p className="mono m-0 text-[11px] tracking-[0.14em] text-muted">
                The parts in order
              </p>
              <p className="m-0 max-w-[28rem] text-[14px] leading-snug text-secondary desk:text-right">
                A map of the step. Not the full guide.
              </p>
            </div>
            <ol className="stage-parts m-0 grid list-none gap-0 p-0 desk:grid-cols-2">
              {stage.parts.map((part, index) => {
                const n = String(index + 1);
                const last = index === stage.parts.length - 1;
                const evenCount = stage.parts.length % 2 === 0;
                const inLastRow = evenCount ? index >= stage.parts.length - 2 : last;
                return (
                  <li
                    key={part.label}
                    className={`relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-line py-8 desk:gap-x-7 desk:px-8 desk:py-11 desk:odd:border-r ${
                      last ? "border-b-0" : ""
                    } ${inLastRow ? "desk:border-b-0" : ""} ${
                      !evenCount && last ? "desk:col-span-2" : ""
                    }`}
                  >
                    <span
                      className="shrink-0 font-[family-name:var(--font-jetbrains)] text-[12px] font-medium tracking-[0.12em] text-done uppercase"
                      aria-hidden
                    >
                      {n}
                    </span>
                    <p className="m-0 text-[clamp(1.15rem,2vw,1.35rem)] leading-[1.35] font-medium tracking-[-0.025em] text-ink">
                      {part.label}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-12 desk:px-8 desk:py-16">
          <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
            <h2 className="m-0 text-[clamp(1.35rem,2.5vw,1.625rem)] font-medium tracking-[-0.025em]">
              {stage.headings.stuck}
            </h2>
            <ul className="m-0 mt-8 flex w-full list-none flex-col gap-0 p-0">
              {stage.stuck.map((item, index) => (
                <li
                  key={item}
                  className={`py-5 text-[16px] leading-[1.55] text-secondary ${
                    index < stage.stuck.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[linear-gradient(160deg,#f4f6f2,#eaf0eb)]">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-6 py-14 desk:flex-row desk:items-center desk:gap-16 desk:px-8 desk:py-20">
            <StageSectionHeading>{stage.headings.how}</StageSectionHeading>
            <div className="grid min-w-0 flex-1 gap-8 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[900px]:items-center">
              <div className="order-2 flex flex-col gap-5 min-[900px]:order-1">
                <div>
                  <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">
                    The dashboard
                  </p>
                  <p className="m-0 mt-1.5 text-[15px] leading-[1.55] text-secondary">
                    {stage.how.dashboard}
                  </p>
                </div>
                <div>
                  <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">You</p>
                  <p className="m-0 mt-1.5 text-[15px] leading-[1.55] text-secondary">
                    {stage.how.you}
                  </p>
                </div>
                <div>
                  <p className="mono m-0 flex items-center gap-2 text-[10px] tracking-[0.12em] text-muted">
                    {stage.how.withUsRole}
                    <span className="rounded-[3px] bg-ink px-[5px] py-0.5 text-[9px] font-semibold tracking-normal text-white normal-case">
                      with us
                    </span>
                  </p>
                  <p className="m-0 mt-1.5 text-[15px] leading-[1.55] text-secondary">
                    {stage.how.person}
                  </p>
                </div>
              </div>
              <div className="relative order-1 min-w-0 min-[900px]:order-2">
                {vignetteFor(stage.vignette, "stage")}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 py-14 desk:px-8 desk:py-20">
          <div className="mb-10 text-center desk:mb-12">
            <h2 className="m-0 text-[clamp(1.35rem,2.5vw,1.625rem)] font-medium tracking-[-0.025em]">
              {stage.headings.faq}
            </h2>
          </div>
          <div className="grid gap-8 desk:grid-cols-3 desk:gap-10">
            {stage.faq.map((item) => (
              <div key={item.question} className="border-t border-line pt-5">
                <h3 className="m-0 text-[16px] font-semibold tracking-[-0.015em]">
                  {item.question}
                </h3>
                <p className="m-0 mt-3 text-[14px] leading-[1.6] text-secondary">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
          <p className="m-0 mx-auto mt-12 max-w-[36rem] text-center text-[12px] leading-normal text-muted">
            Groundwork guides and refers. We do not give legal, tax or accounting advice.
            A qualified professional confirms the specifics for your situation.
          </p>
        </section>

        <StartForm />

        <nav aria-label="Stage navigation" className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-10 desk:flex-row desk:items-center desk:justify-between desk:px-8">
            <div className="flex flex-col gap-2">
              {prev ? (
                <a
                  href={stagePath(prev.slug)}
                  className="text-[15px] font-medium text-secondary hover:text-ink"
                >
                  Previous: {prev.shortTitle}
                </a>
              ) : (
                <span className="text-[15px] text-muted">Previous: —</span>
              )}
              {next ? (
                <a
                  href={stagePath(next.slug)}
                  className="text-[15px] font-medium text-ink hover:text-done"
                >
                  Next: {next.shortTitle}
                </a>
              ) : (
                <span className="text-[15px] text-muted">Next: —</span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="/start"
                className="text-[13px] font-medium text-muted hover:text-ink"
              >
                All stages
              </a>
              <a href="/" className="text-[13px] font-medium text-muted hover:text-ink">
                Homepage
              </a>
            </div>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  );
}
