"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BUSINESS_PREFILL_EVENT, readBusinessPrefill } from "@/lib/prefill";

export function StartForm() {
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const apply = () => setBusiness(readBusinessPrefill());
    apply();
    const onPrefill = (event: Event) => {
      setBusiness((event as CustomEvent<string>).detail);
    };
    window.addEventListener(BUSINESS_PREFILL_EVENT, onPrefill);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener(BUSINESS_PREFILL_EVENT, onPrefill);
      window.removeEventListener("popstate", apply);
    };
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section id="start">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-6 px-6 py-20 text-center desk:px-8 desk:py-28">
        <h2 className="m-0 text-[clamp(2.25rem,5vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.035em]">
          Start your list.
        </h2>
        <p className="m-0 text-base leading-normal text-secondary">
          Two questions. We&apos;ll build your list and call to walk you through it. The
          first conversation is free.
        </p>
        <form onSubmit={onSubmit} className="mt-1.5 flex w-full flex-col gap-2">
          <input
            name="business"
            type="text"
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            placeholder="What kind of business?"
            className="h-12 rounded-control border border-[#D6D6D3] bg-white px-4 text-[15px]"
          />
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="h-12 rounded-control border border-[#D6D6D3] bg-white px-4 text-[15px]"
          />
          <button
            type="submit"
            className="h-12 cursor-pointer rounded-control bg-ink text-[15px] font-medium text-white hover:bg-[#2a2a2a]"
          >
            Build my list →
          </button>
        </form>
        <p className="m-0 text-xs text-muted">We only use this to call you back.</p>
      </div>
    </section>
  );
}
