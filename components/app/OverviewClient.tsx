"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore, useTransition } from "react";

import { setChecklistItem } from "@/app/(app)/app/actions";
import {
  CompletionDialog,
  toCompletionNotice,
  type CompletionNotice,
} from "@/components/app/CompletionDialog";
import { DashboardStack } from "@/components/app/DashboardStack";
import { StageBlockIcon } from "@/components/app/StageBlockIcon";
import { StepChecklist } from "@/components/app/StepChecklist";
import { professionalsForStage, stageProgress, type UserStepRow } from "@/lib/app-data";
import { checkedIndexes, toggleIndex } from "@/lib/completion";
import type { Introduction, Professional } from "@/lib/database.types";

const DISMISS_KEY = "groundwork-dismissed-completion";
const DISMISS_EVENT = "groundwork-completion-dismiss";

function subscribeDismiss(onStoreChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(DISMISS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function readDismissed() {
  return window.localStorage.getItem(DISMISS_KEY) ?? "";
}

function pendingDismissed() {
  return "pending";
}

type Props = {
  steps: UserStepRow[];
  professionals: Professional[];
  introductions: Introduction[];
  daysSinceStarted: number;
};

export function OverviewClient({
  steps,
  professionals,
  introductions,
  daysSinceStarted,
}: Props) {
  const router = useRouter();
  const [hoverStage, setHoverStage] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [checkError, setCheckError] = useState<string | null>(null);
  const [notice, setNotice] = useState<CompletionNotice | null>(null);
  const [draft, setDraft] = useState<{ id: string; key: string; checked: number[] } | null>(
    null,
  );
  const dismissedId = useSyncExternalStore(subscribeDismiss, readDismissed, pendingDismissed);
  const stages = useMemo(() => stageProgress(steps), [steps]);
  const next =
    steps.find((row) => row.status === "next") ??
    steps.find((row) => row.status === "todo");
  const upcoming = steps
    .filter((row) => row.status === "todo" || row.status === "next")
    .slice(0, 3);
  const doneCount = steps.filter((row) => row.status === "done").length;
  const currentStage = next?.playbook_steps?.stage ?? 1;
  const people = professionalsForStage(professionals, currentStage);
  const introByProfessional = new Map(
    introductions.map((item) => [item.professional_id, item.status]),
  );
  const progressPct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const latestDone = [...steps]
    .filter((row) => row.status === "done" && row.done_at && row.completion_note)
    .sort((a, b) => (b.done_at ?? "").localeCompare(a.done_at ?? ""))[0];
  const nextItems = next?.playbook_steps?.what_youll_do ?? [];
  const serverChecked = checkedIndexes(next?.checklist_done, nextItems.length);
  const serverKey = serverChecked.join(",");
  const shownChecked =
    draft && draft.id === next?.id && draft.key === serverKey ? draft.checked : serverChecked;

  function dismissBanner() {
    if (!latestDone) return;
    window.localStorage.setItem(DISMISS_KEY, latestDone.id);
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }

  function onToggle(index: number, nextChecked: boolean) {
    if (!next || pending) return;
    const updated = toggleIndex(shownChecked, index, nextChecked);
    setDraft({ id: next.id, key: serverKey, checked: updated });
    setCheckError(null);
    startTransition(async () => {
      const result = await setChecklistItem(next.id, index, nextChecked);
      if (result.error && !result.completed) {
        setDraft(null);
        setCheckError(result.error);
        return;
      }
      const nextNotice = toCompletionNotice(result);
      if (nextNotice) setNotice(nextNotice);
      if (result.error) setCheckError(result.error);
      router.refresh();
    });
  }

  const showBanner =
    dismissedId !== "pending" &&
    latestDone &&
    dismissedId !== latestDone.id &&
    notice?.stepId !== latestDone.id;

  function scrollToStage(stage: number) {
    document.getElementById(`stage-${stage}`)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
          Overview
        </h1>
        <p className="mt-1.5 m-0 text-[15px] text-secondary">
          Where you are on the list.
        </p>
      </div>

      {showBanner && latestDone?.playbook_steps ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line bg-[#F4F9F5] px-4 py-3">
          <p className="m-0 min-w-0 flex-1 text-[14px]">
            <span className="font-medium">
              Finished {latestDone.playbook_steps.title}.
            </span>{" "}
            {next?.playbook_steps ? (
              <Link
                href={`/app/steps/${next.playbook_steps.slug}`}
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                Next: {next.playbook_steps.title}
              </Link>
            ) : (
              <span>That was the last step.</span>
            )}
          </p>
          <button
            type="button"
            onClick={dismissBanner}
            className="cursor-pointer text-[13px] font-medium text-muted hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="grid items-start gap-7 desk:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.85fr)] desk:gap-8">
        <div className="flex min-w-0 flex-col gap-7">
          <section className="overflow-hidden rounded-card border border-line bg-white">
            <div className="flex items-baseline justify-between gap-3 px-5 pt-4 pb-1">
              <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">STACK</p>
              <p className="m-0 text-[12px] text-muted">
                {doneCount}/{steps.length} done · click a stage
              </p>
            </div>
            <div className="px-3 pt-1 pb-1">
              <DashboardStack
                stages={stages}
                highlightStage={hoverStage}
                onHoverStage={setHoverStage}
                onSelectStage={scrollToStage}
              />
            </div>
          </section>

          {next?.playbook_steps ? (
            <section className="rounded-card border border-ink bg-white p-5 desk:p-6">
              <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">UP NEXT</p>
              <h2 className="mt-2 m-0 text-[20px] font-semibold tracking-[-0.02em]">
                {next.playbook_steps.title}
              </h2>
              <p className="mt-2 m-0 text-[14px] leading-normal text-secondary">
                {next.playbook_steps.summary}
              </p>
              {nextItems.length > 0 ? (
                <div className="mt-4">
                  <p className="m-0 text-[13px] text-muted">
                    Tick each line. This step checks off when the list is complete.
                  </p>
                  <p className="mt-3 m-0 text-[12px] text-muted">
                    {shownChecked.length}/{nextItems.length} done
                  </p>
                  <div className="mt-3">
                    <StepChecklist
                      items={nextItems}
                      checked={shownChecked}
                      disabled={pending}
                      onToggle={onToggle}
                    />
                  </div>
                  {checkError ? (
                    <p className="mt-3 m-0 text-sm text-red-700">{checkError}</p>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={`/app/steps/${next.playbook_steps.slug}`}
                  className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-[14px] font-medium text-white hover:bg-[#2a2a2a]"
                >
                  Start →
                </Link>
                <span className="text-[12px] text-muted">
                  About {next.playbook_steps.estimated_minutes} minutes
                </span>
                {next.playbook_steps.with_us ? (
                  <span className="rounded-[3px] bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    with us
                  </span>
                ) : null}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="m-0 text-[15px] font-semibold tracking-[-0.015em]">
              Coming up
            </h2>
            <ul className="mt-3 m-0 list-none divide-y divide-line border-y border-line p-0">
              {upcoming.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link
                      href={`/app/steps/${row.playbook_steps!.slug}`}
                      className="truncate text-[14px] font-medium text-ink hover:text-done"
                    >
                      {row.playbook_steps!.title}
                    </Link>
                    <p className="m-0 mt-0.5 text-[12px] text-muted">
                      Stage {row.playbook_steps!.stage}
                    </p>
                  </div>
                  {row.status === "next" ? (
                    <span className="shrink-0 rounded-pill border border-ink px-2 py-0.5 text-[10px] font-semibold">
                      next
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-2.5">
            <h2 className="m-0 text-[15px] font-semibold tracking-[-0.015em]">Stages</h2>
            {stages.map((stage) => (
              <div
                key={stage.stage}
                id={`stage-${stage.stage}`}
                className={`rounded-card border px-4 py-3.5 ${
                  hoverStage === stage.stage
                    ? "border-done bg-[#F4F9F5]"
                    : "border-line bg-white"
                }`}
                onMouseEnter={() => setHoverStage(stage.stage)}
                onMouseLeave={() => setHoverStage(null)}
              >
                <div className="flex items-center gap-2.5">
                  <StageBlockIcon fill={stage.fill} active={stage.hasNext} />
                  <p className="m-0 text-[14px] font-semibold tracking-[-0.015em]">
                    {stage.stage} {stage.title}
                  </p>
                  <span className="ml-auto text-[12px] text-muted">
                    {stage.done}/{stage.total}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </div>

        <aside className="flex flex-col gap-4 desk:sticky desk:top-6">
          <section className="rounded-card border border-line p-5">
            <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">PROGRESS</p>
            <p className="mt-2 m-0 text-[22px] font-semibold tracking-[-0.02em]">
              {doneCount} of {steps.length}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-[#ECECEA]">
              <div
                className="h-full rounded-pill bg-done transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 m-0 text-[12px] text-muted">{progressPct}% complete</p>
          </section>

          <section className="rounded-card border border-line p-5">
            <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">PEOPLE</p>
            <ul className="mt-3 m-0 flex list-none flex-col gap-3 p-0">
              {people.map((person) => {
                const status = introByProfessional.get(person.id) ?? "not yet";
                return (
                  <li key={person.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="m-0 text-[14px] font-medium">{person.display_name}</p>
                      <p className="m-0 mt-0.5 text-[12px] text-muted">
                        {person.intro_blurb}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-pill border border-line px-2 py-0.5 text-[10px] font-medium text-secondary">
                      {status === "not yet" ? "not yet" : status}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/app/people"
              className="mt-4 inline-block text-[13px] font-medium text-ink underline-offset-2 hover:underline"
            >
              See all people
            </Link>
          </section>

          <section className="rounded-card border border-line p-5">
            <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">DAY</p>
            <p className="mt-2 m-0 text-[22px] font-semibold tracking-[-0.02em]">
              {daysSinceStarted}
            </p>
            <p className="mt-1 m-0 text-[12px] text-muted">since you started</p>
          </section>
        </aside>
      </div>
      {notice ? <CompletionDialog {...notice} onClose={() => setNotice(null)} /> : null}
    </div>
  );
}
