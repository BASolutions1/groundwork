"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

import { markStepDone, setChecklistItem } from "@/app/(app)/app/actions";
import {
  CompletionDialog,
  toCompletionNotice,
  type CompletionNotice,
} from "@/components/app/CompletionDialog";
import { StageBlockIcon } from "@/components/app/StageBlockIcon";
import { StepChecklist } from "@/components/app/StepChecklist";
import { stageProgress, type UserStepRow } from "@/lib/app-data";
import { checkedIndexes, listIsComplete, toggleIndex } from "@/lib/completion";

type Props = {
  steps: UserStepRow[];
};

export function StepsListClient({ steps }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Record<number, boolean>>(() =>
    Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [n, true])),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<CompletionNotice | null>(null);
  const [checkOpen, setCheckOpen] = useState<Record<string, boolean>>({});
  const [optimisticSteps, setOptimistic] = useOptimistic(
    steps,
    (
      current,
      update: { id: string; status?: UserStepRow["status"]; checklist_done?: number[] },
    ) => {
      const next = current.map((row) =>
        row.id === update.id ? { ...row, ...update } : row,
      );
      if (next.some((row) => row.status === "next")) return next;
      const candidate = next
        .filter((row) => row.status === "todo")
        .sort((a, b) => a.playbook_steps!.order - b.playbook_steps!.order)[0];
      if (!candidate) return next;
      return next.map((row) =>
        row.id === candidate.id ? { ...row, status: "next" } : row,
      );
    },
  );

  const stages = stageProgress(optimisticSteps);

  function toggle(stage: number) {
    setOpen((prev) => ({ ...prev, [stage]: !prev[stage] }));
  }

  function showResult(result: Awaited<ReturnType<typeof markStepDone>>) {
    const nextNotice = toCompletionNotice(result);
    if (nextNotice) setNotice(nextNotice);
    if (result.error) setError(result.error);
    else setError(null);
    if (!result.error || result.completed) router.refresh();
  }

  function onTick(row: UserStepRow) {
    if (row.status === "done" || pending) return;
    const items = row.playbook_steps?.what_youll_do ?? [];
    setError(null);
    startTransition(async () => {
      setOptimistic({
        id: row.id,
        status: "done",
        checklist_done: items.map((_, index) => index),
      });
      showResult(await markStepDone(row.id));
    });
  }

  function onToggle(row: UserStepRow, index: number, nextChecked: boolean) {
    if (pending) return;
    const items = row.playbook_steps?.what_youll_do ?? [];
    const updated = toggleIndex(
      checkedIndexes(row.checklist_done, items.length),
      index,
      nextChecked,
    );
    const finished = listIsComplete(items.length, updated);
    setError(null);
    startTransition(async () => {
      setOptimistic({
        id: row.id,
        checklist_done: updated,
        status: finished ? "done" : row.status === "done" ? "todo" : row.status,
      });
      showResult(await setChecklistItem(row.id, index, nextChecked));
    });
  }

  function checklistVisible(row: UserStepRow) {
    if (row.id in checkOpen) return checkOpen[row.id];
    const items = row.playbook_steps?.what_youll_do ?? [];
    const checked = checkedIndexes(row.checklist_done, items.length);
    if (row.status === "next") return true;
    return checked.length > 0 && checked.length < items.length;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
          Steps
        </h1>
        <p className="mt-2 m-0 text-[15px] text-secondary">
          Work them in order. Tick the checklist and the row checks itself off.
        </p>
        {error ? <p className="mt-3 m-0 text-sm text-red-700">{error}</p> : null}
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
                const items = row.playbook_steps?.what_youll_do ?? [];
                const checked = checkedIndexes(row.checklist_done, items.length);
                const showChecks = items.length > 0 && checklistVisible(row);
                return (
                  <li
                    key={row.id}
                    className={
                      isNext
                        ? "bg-white outline outline-1 outline-ink -outline-offset-1"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-3 px-4 py-3.5">
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
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
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
                        {done && row.completion_note ? (
                          <p className="mt-1 mb-0 line-clamp-2 whitespace-pre-wrap text-[12px] text-muted">
                            {row.completion_note}
                          </p>
                        ) : null}
                      </div>
                      {items.length > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setCheckOpen((current) => ({
                              ...current,
                              [row.id]: !checklistVisible(row),
                            }))
                          }
                          className="shrink-0 cursor-pointer text-[12px] font-medium text-muted hover:text-ink"
                        >
                          {showChecks
                            ? "Hide"
                            : `Checklist ${checked.length}/${items.length}`}
                        </button>
                      ) : null}
                      {isNext ? (
                        <span className="shrink-0 rounded-pill border border-ink px-2 py-0.5 text-[10px] font-semibold">
                          next
                        </span>
                      ) : null}
                    </div>
                    {showChecks ? (
                      <div className="px-4 pb-3.5 pl-12">
                        <StepChecklist
                          items={items}
                          checked={checked}
                          disabled={pending}
                          onToggle={(index, nextChecked) =>
                            onToggle(row, index, nextChecked)
                          }
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ))}
      {notice ? <CompletionDialog {...notice} onClose={() => setNotice(null)} /> : null}
    </div>
  );
}
