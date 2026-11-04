"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { publishBusinessPrefill, readBusinessPrefill } from "@/lib/prefill";
import { buildSignupHref } from "@/lib/onboarding";

type Props = {
  idPrefix?: string;
  buttonLabel?: string;
  className?: string;
  /** Force input and button stacked (useful in narrow columns). */
  stacked?: boolean;
};

export function BusinessQuestionForm({
  idPrefix = "stage",
  buttonLabel = "Show my list →",
  className = "",
  stacked = false,
}: Props) {
  const router = useRouter();
  const [business, setBusiness] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBusiness(readBusinessPrefill());
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const businessType = business.trim();
    if (!businessType || loading) return;

    publishBusinessPrefill(businessType);
    setLoading(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          phone: "",
          source: "show-my-list",
        }),
      });
      router.push(buildSignupHref({ businessType, phone: "" }));
    } catch {
      setLoading(false);
    }
  }

  const inputId = `${idPrefix}-business`;

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-3 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium">
        What kind of business are you starting?
      </label>
      <div
        className={
          stacked
            ? "flex w-full flex-col gap-2"
            : "flex w-full flex-col gap-2 min-[480px]:flex-row"
        }
      >
        <input
          id={inputId}
          name="business"
          type="text"
          required
          value={business}
          onChange={(event) => setBusiness(event.target.value)}
          placeholder="Cafe, consulting, retail..."
          className="box-border h-12 min-h-12 w-full min-w-0 flex-1 rounded-control border border-[#C9C9C6] bg-white px-4 text-[15px] leading-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="box-border h-12 min-h-12 shrink-0 cursor-pointer rounded-control bg-ink px-5 text-[15px] font-medium leading-none whitespace-nowrap text-white hover:bg-[#2a2a2a] disabled:opacity-60"
        >
          {loading ? "Starting…" : buttonLabel}
        </button>
      </div>
    </form>
  );
}
