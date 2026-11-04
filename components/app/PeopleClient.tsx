"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { requestIntroduction } from "@/app/(app)/app/actions";
import type { Introduction, Professional } from "@/lib/database.types";

const ROLE_STAGE_COPY: Record<string, string> = {
  accountant: "Wired to Register",
  bookkeeper: "Wired to Set up",
  insurance_broker: "Wired to Insurance",
  web: "Wired to Get found",
  guide: "Wired to all stages",
  lawyer: "On call when needed",
};

type Props = {
  professionals: Professional[];
  introductions: Introduction[];
  stageTitles: Record<string, string>;
};

export function PeopleClient({ professionals, introductions }: Props) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const introById = new Map(introductions.map((item) => [item.professional_id, item]));

  function onRequest(id: string) {
    setPendingId(id);
    startTransition(async () => {
      await requestIntroduction(id);
      router.refresh();
      setPendingId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
          People
        </h1>
        <p className="mt-2 m-0 max-w-[36rem] text-[15px] text-secondary">
          Roles you can call on. Status moves from not yet to requested, introduced, then
          scheduled.
        </p>
      </div>

      <div className="grid gap-4 tab:grid-cols-2">
        {professionals.map((person) => {
          const intro = introById.get(person.id);
          const status = intro?.status ?? "not yet";
          return (
            <article
              key={person.id}
              className="flex flex-col gap-3 rounded-card border border-line p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="m-0 text-[17px] font-semibold tracking-[-0.015em]">
                    {person.display_name}
                  </h2>
                  <p className="mt-1 m-0 text-[12px] text-muted">
                    {ROLE_STAGE_COPY[person.role] ?? "On your list"}
                  </p>
                </div>
                <span className="rounded-pill border border-line px-2 py-0.5 text-[10px] font-medium text-secondary">
                  {status}
                </span>
              </div>
              <p className="m-0 text-[13px] leading-normal text-secondary">{person.intro_blurb}</p>
              {status === "not yet" ? (
                <button
                  type="button"
                  onClick={() => onRequest(person.id)}
                  disabled={pending && pendingId === person.id}
                  className="mt-auto h-10 cursor-pointer rounded-control bg-ink text-[13px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
                >
                  {pending && pendingId === person.id ? "Requesting…" : "Request introduction"}
                </button>
              ) : (
                <p className="mt-auto m-0 text-[12px] text-done">Introduction {status}</p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
