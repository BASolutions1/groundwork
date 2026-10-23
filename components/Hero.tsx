"use client";

import { useState, type FormEvent } from "react";
import { HeroSequence } from "./HeroSequence";
import { publishBusinessPrefill } from "@/lib/prefill";

export function Hero() {
  const [business, setBusiness] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    publishBusinessPrefill(business);
  }

  return (
    <section id="top">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-6 py-10 tab:gap-10 tab:py-12 desk:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] desk:gap-12 desk:px-8 desk:py-20">
        <div className="flex min-w-0 flex-col gap-[26px]">
          <h1 className="hero-title m-0 text-[clamp(2rem,7.2vw,3.875rem)] leading-[1.02] font-medium tracking-[-0.035em]">
            Start your business.
            <br />
            Know exactly
            <br />
            what&apos;s next.
          </h1>
          <p className="m-0 max-w-[420px] text-[17px] leading-[1.55] text-secondary">
            Every step to get a new business running, in the right order, with someone
            who&apos;s already done it.
          </p>
          <form onSubmit={onSubmit} className="mt-1.5 flex max-w-[480px] flex-col gap-2.5">
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
                className="h-[46px] min-w-0 w-full flex-1 rounded-control border border-[#D6D6D3] bg-white px-3.5 text-[15px]"
              />
              <button
                type="submit"
                className="h-[46px] shrink-0 cursor-pointer rounded-control bg-ink px-[18px] text-sm font-medium whitespace-nowrap text-white hover:bg-[#2a2a2a]"
              >
                Show my list →
              </button>
            </div>
          </form>
        </div>
        <HeroSequence />
      </div>
    </section>
  );
}
