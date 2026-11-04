"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { publishBusinessPrefill } from "@/lib/prefill";

const standby = [
  {
    id: "guide",
    className: "bg-ink text-white",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
      </svg>
    ),
  },
  {
    id: "accountant",
    className: "bg-done text-white",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    id: "broker",
    className: "bg-[#55555A] text-white",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

export function Hero() {
  const [business, setBusiness] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    publishBusinessPrefill(business);
  }

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (reduce || !desktop) return;

    const wrap = imageWrapRef.current;
    wrap?.classList.add("hero-float");

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !sectionRef.current || !stageRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(stage, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      wrap?.classList.remove("hero-float");
      revert?.();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero relative flex flex-col overflow-hidden min-[1024px]:block"
      style={
        {
          background: "#ffffff",
        } as CSSProperties
      }
    >
      <div
        ref={stageRef}
        className="hero-stage pointer-events-none relative z-0 order-2 aspect-[5/4] w-full min-[700px]:aspect-[16/11] min-[1024px]:absolute min-[1024px]:inset-0 min-[1024px]:aspect-auto"
        style={{ background: "var(--hero-studio-mid)" }}
      >
        <div ref={imageWrapRef} className="hero-laptop-wrap absolute inset-0">
          <Image
            src="/hero/laptop-v5.webp"
            alt=""
            fill
            priority
            quality={85}
            sizes="(max-width: 1023px) 100vw, 100vw"
            className="hero-laptop-img object-cover object-[82%_40%] min-[700px]:object-[75%_42%] min-[1024px]:object-[72%_40%]"
          />
        </div>
      </div>

      <div
        className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 min-[1024px]:h-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-[2] order-1 mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-6 pb-10 pt-[6.75rem] desk:px-8 min-[1024px]:min-h-[1000px] min-[1024px]:pt-[5.75rem] min-[1024px]:pb-44">
        <div className="flex max-w-[480px] min-w-0 flex-col gap-[22px] min-[1024px]:-translate-y-7 min-[1024px]:gap-[26px]">
          <h1 className="hero-title m-0 text-[clamp(2rem,6.5vw,3.875rem)] leading-[1.02] font-medium tracking-[-0.035em] text-ink">
            Start your business.
            <br />
            Know exactly what&apos;s next.
          </h1>
          <p className="m-0 text-[16px] leading-[1.55] text-secondary min-[700px]:text-[17px]">
            You can&apos;t build a house on sand. We lay the groundwork with you:
            every step in order, a real person on each one.
          </p>
          <form onSubmit={onSubmit} className="mt-1 flex flex-col gap-2.5">
            <label htmlFor="hero-business" className="text-sm font-medium">
              What kind of business are you starting?
            </label>
            <div className="flex flex-col gap-1.5 min-[480px]:flex-row">
              <input
                id="hero-business"
                name="business"
                type="text"
                value={business}
                onChange={(event) => setBusiness(event.target.value)}
                placeholder="Cafe, consulting, retail..."
                className="h-[46px] min-w-0 w-full flex-1 rounded-control border border-[#D6D6D3] bg-white/95 px-3.5 text-[15px] backdrop-blur-[2px]"
              />
              <button
                type="submit"
                className="h-[46px] shrink-0 cursor-pointer rounded-control bg-ink px-[18px] text-sm font-medium whitespace-nowrap text-white hover:bg-[#2a2a2a]"
              >
                Show my list →
              </button>
            </div>
          </form>
          <div className="flex items-center gap-3">
            <div className="flex shrink-0 -space-x-2" aria-hidden="true">
              {standby.map((person) => (
                <span
                  key={person.id}
                  className={`relative flex size-8 items-center justify-center rounded-full border-2 border-white ${person.className}`}
                >
                  {person.icon}
                </span>
              ))}
            </div>
            <p className="m-0 text-[13px] leading-snug text-secondary">
              Your guide, accountant and specialists, on standby
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
