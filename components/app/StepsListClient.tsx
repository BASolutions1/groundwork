"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

import { markStepDone } from "@/app/(app)/app/actions";
import { StageBlockIcon } from "@/components/app/StageBlockIcon";
import { stageProgress, type UserStepRow } from "@/lib/app-data";

type Props = {
  steps: UserStepRow[];
};

export function StepsListClient({ steps }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Record<number, boolean>>(() =>
    Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [n, true])),
  );
  const [pending, startTransition] = useTransition();
  const [optimisticSteps, setOptimistic] = useOptimistic(
    steps,
    (current, update: { id: string; status: UserStepRow["status"] }) =>
      current.map((row) => (row.id === update.id ? { ...row, status: update.status } : row)),
  );

  const stages = stageProgress(optimisticSteps);

  function toggle(stage: number) {
    setOpen((prev) => ({ ...prev, [stage]: !prev[stage] }));
  }

  function onTick(row: UserStepRow) {
    if (row.status === "done" || pending) return;
    startTransition(async () => {
      setOptimistic({ id: row.id, status: "done" });
      const result = await markStepDone(row.id);
      if (!result.error) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
          Steps
        </h1>
        <p className="mt-2 m-0 text-[15px] text-secondary">
          Work them in order. Tick a row when it is done.
        </p>
      </div>

      {stages.map((stage) => (
        <section
          key={stage.stage}
          id={`stage-${stage.stage}`}
          className="overflow-hidden rounded-card border border-line"
        >
          <button
            type="button"
            onClick={() => toggle(stage.stage)}
            className="flex w-full cursor-pointer items-center gap-2.5 bg-[#FAFBFA] px-4 py-3.5 text-left"
          >
            <StageBlockIcon fill={stage.fill} active={stage.hasNext} />
            <span className="text-[14px] font-semibold tracking-[-0.015em]">
              {stage.stage} {stage.title}
            </span>
            <span className="ml-auto text-[12px] text-muted">
              {stage.done}/{stage.total}
            </span>
          </button>
          {open[stage.stage] ? (
            <ul className="m-0 list-none divide-y divide-line p-0">
              {stage.steps.map((row) => {
                const done = row.status === "done" || row.status === "skipped";
                const isNext = row.status === "next";
                return (
                  <li
                    key={row.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${
                      isNext ? "bg-white outline outline-1 outline-ink -outline-offset-1" : ""
                    }`}
                  >
                    <button
                      type="button"
                      aria-label={done ? "Completed" : "Mark done"}
                      onClick={() => onTick(row)}
                      disabled={done || pending}
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                        done
                          ? "border-done bg-done text-white"
                          : "border-[#C9C9C6] bg-white hover:border-ink"
                      }`}
                    >
                      {done ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path
                            d="M20 6 9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </button>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/app/steps/${row.playbook_steps!.slug}`}
                        className={`text-[14px] font-medium ${
                          done ? "text-muted line-through" : "text-ink hover:text-done"
                        }`}
                      >
                        {row.playbook_steps!.title}
                      </Link>
                      {row.playbook_steps!.with_us ? (
                        <span className="ml-2 rounded-[3px] bg-ink px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          with us
                        </span>
                      ) : null}
                    </div>
                    {isNext ? (
                      <span className="shrink-0 rounded-pill border border-ink px-2 py-0.5 text-[10px] font-semibold">
                        next
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
