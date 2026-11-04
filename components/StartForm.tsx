"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { BUSINESS_PREFILL_EVENT, readBusinessPrefill } from "@/lib/prefill";
import { buildSignupHref } from "@/lib/onboarding";

export function StartForm() {
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;

    const businessType = business.trim();
    const phoneValue = phone.trim();
    if (!businessType || !phoneValue) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          phone: phoneValue,
          source: "homepage",
        }),
      });
      if (!response.ok) throw new Error("request failed");
      router.push(buildSignupHref({ businessType, phone: phoneValue }));
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="start">
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-6 px-6 py-20 text-center desk:px-8 desk:py-28">
        <h2 className="m-0 text-[clamp(2.25rem,5vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.035em]">
          Start your list.
        </h2>
        <p className="m-0 text-base leading-normal text-secondary">
          Two questions. We build your list and call to walk you through it. The first
          conversation is free.
        </p>
        <form onSubmit={onSubmit} className="mt-1.5 flex w-full flex-col gap-2">
          <input
            name="business"
            type="text"
            required
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            placeholder="What kind of business?"
            className="h-12 rounded-control border border-[#D6D6D3] bg-white px-4 text-[15px]"
          />
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="h-12 rounded-control border border-[#D6D6D3] bg-white px-4 text-[15px]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="h-12 cursor-pointer rounded-control bg-ink text-[15px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {status === "loading" ? "Starting…" : "Build my list →"}
          </button>
          {status === "error" ? (
            <p className="m-0 text-xs text-red-700">
              Something went wrong. Try again in a moment.
            </p>
          ) : null}
        </form>
        <p className="m-0 text-xs text-muted">We only use this to call you back.</p>
      </div>
    </section>
  );
}
