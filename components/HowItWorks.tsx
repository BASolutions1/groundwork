"use client";

import { useEffect, useRef } from "react";
import { ChaosDesk } from "./how/ChaosDesk";

export function HowItWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const visible = (selector: string) =>
          gsap.utils.toArray<HTMLElement>(selector).filter((el) => {
            return getComputedStyle(el).display !== "none";
          });

        const bits = visible(".scatter");
        bits.forEach((el) => {
          gsap.set(el, {
            rotation: Number(el.dataset.rot),
            opacity: Number(el.dataset.fade),
          });
        });

        const left = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
          onComplete: () => {
            gsap.utils.shuffle(bits.slice()).slice(0, 3).forEach((el) => {
              gsap.to(el, {
                y: gsap.utils.random(1, 2) * (Math.random() < 0.5 ? -1 : 1),
                duration: gsap.utils.random(2.6, 3.8),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              });
            });
          },
        });

        const order = gsap.utils.shuffle(bits.slice());
        let at = 0;
        order.forEach((el) => {
          const rest = Number(el.dataset.rot);
          left.from(
            el,
            {
              y: -30,
              rotation: rest + gsap.utils.random(-10, 10),
              opacity: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            at,
          );
          at += gsap.utils.random(0.03, 0.08);
        });

        const rows = visible(".step-row");
        const ticks = visible(".step-tick");
        const chip = root.querySelector<HTMLElement>(".next-chip");
        gsap.set(ticks, { scale: 0, opacity: 0 });

        const right = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        });
        right.from(rows, {
          y: 18,
          opacity: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        });
        right.to(ticks, {
          scale: 1,
          opacity: 1,
          duration: 0.32,
          stagger: 0.1,
          ease: "back.out(1.7)",
        });
        if (chip) {
          right.to(chip, {
            scale: 1.045,
            duration: 0.28,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
            transformOrigin: "left center",
          });
        }
      }, root);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section id="how">
      <div className="mx-auto flex max-w-[1000px] flex-col gap-10 px-6 pt-12 pb-8 desk:px-8 desk:pb-12">
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 text-[clamp(1.75rem,3vw,2.125rem)] leading-[1.15] font-medium tracking-[-0.03em]">
            A search tells you what exists.{" "}
            <br className="hidden tab:block" />
            <span className="text-muted">Groundwork tells you what&apos;s next.</span>
          </h2>
          <p className="m-0 max-w-[520px] text-sm leading-[1.6] text-secondary">
            Tell us what you&apos;re starting and where you&apos;re at. You get the steps in
            order, the templates for each one, and a name to call when you get stuck.
          </p>
        </div>

        <div className="flex flex-col">
        <div ref={rootRef} className="relative grid grid-cols-1 desk:grid-cols-2">
          <div className="flex flex-col gap-4 overflow-x-clip bg-[#F4F4F2] p-6 pb-6 desk:p-7 desk:pb-7">
            <div className="flex gap-1.5">
              <span className="tag">On your own</span>
              <span className="tag text-[#B4531F]">
                <span className="mr-[5px] inline-block size-1.5 rounded-full bg-[#B4531F]" />
                Scattered
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="m-0 text-lg font-semibold tracking-[-0.01em]">
                Everything, all at once.
              </h3>
              <p className="m-0 text-xs text-muted">
                No order. No deadlines.{" "}
                <span className="mono mono-literal text-[10px]">fifty tabs</span> open.
              </p>
            </div>
            <ChaosDesk />
          </div>

          <div className="pointer-events-none relative z-20 h-8 desk:absolute desk:inset-y-0 desk:left-1/2 desk:h-auto desk:w-0">
            <div className="absolute top-1/2 right-6 left-6 h-px -translate-y-1/2 bg-[#C8C8C4] desk:inset-y-8 desk:right-auto desk:left-1/2 desk:h-auto desk:w-px desk:translate-y-0" />
            <div className="absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white">
              <svg
                className="rotate-90 desk:rotate-0"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </div>
          </div>

          <div className="relative flex flex-col gap-4 bg-[#E7F2EA] p-6 desk:p-8">
            <div className="flex gap-1.5">
              <span className="tag">Groundwork</span>
              <span className="tag text-done">
                <span className="mr-[5px] inline-block size-1.5 rounded-full bg-done" />
                In order
              </span>
            </div>
            <div className="flex max-w-[280px] flex-col gap-1">
              <h3 className="m-0 text-lg font-semibold tracking-[-0.01em]">One step at a time.</h3>
              <p className="m-0 text-xs leading-[1.5] text-secondary">
                Ordered by what has to happen first. A professional at the hard parts.
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-3 rounded-card border border-[#D6E7DB] bg-white p-5 desk:p-6">
              <div className="step-row flex items-center gap-2.5 text-sm">
                <span>Next step:</span>
                <span className="next-chip rounded-control bg-[#E7F2EA] px-2 py-[3px] text-[13px] font-semibold text-ink">
                  Open a GST account
                </span>
              </div>
              <div className="step-row row text-muted">
                <span className="step-tick inline-flex">
                  <Check />
                </span>
                <span className="line-through">Register the name</span>
                <span className="mono ml-auto">done</span>
              </div>
              <div className="step-row row text-muted">
                <span className="step-tick inline-flex">
                  <Check />
                </span>
                <span className="line-through">Business number</span>
                <span className="mono ml-auto">done</span>
              </div>
              <div className="step-row row" style={{ borderColor: "#111111" }}>
                <span className="size-3.5 shrink-0 rounded-full border-[1.5px] border-ink" />
                GST account
                <span className="mono ml-auto text-ink">this week</span>
              </div>
              <div className="step-row row">
                <span className="size-3.5 shrink-0 rounded-full border-[1.5px] border-[#C9C9C6]" />
                WCB
                <span className="mono ml-auto">week 2</span>
              </div>
              <div className="step-row row">
                <span className="size-3.5 shrink-0 rounded-full border-[1.5px] border-[#C9C9C6]" />
                Get insured
                <span className="rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  with us
                </span>
                <span className="mono ml-auto">week 2</span>
              </div>
              <div className="step-row mt-1 flex items-center gap-2.5 border-t border-[#ECEEEA] pt-3.5">
                <span className="size-6 shrink-0 rounded-full bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)]" />
                <span className="min-w-0 text-[12px] leading-snug font-medium">
                  Brandan checked your GST form
                </span>
                <span className="mono mono-literal ml-auto shrink-0 text-[10px]">today</span>
              </div>
            </div>
            <div className="absolute top-5 right-4 flex size-10 items-center justify-center rounded-[10px] bg-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.35)] tab:top-24 tab:size-11 desk:top-28 desk:right-[18px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 desk:grid-cols-2" aria-hidden="true">
          <div className="hidden h-24 bg-gradient-to-b from-[#F4F4F2] to-white desk:block" />
          <div className="h-20 bg-gradient-to-b from-[#E7F2EA] to-white desk:h-24" />
        </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-done">
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
