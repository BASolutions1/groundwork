"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  markStepDone,
  requestIntroduction,
  saveCompletionNote,
  saveStepNotes,
  setChecklistItem,
  skipStep,
} from "@/app/(app)/app/actions";
import {
  CompletionDialog,
  toCompletionNotice,
  type CompletionNotice,
} from "@/components/app/CompletionDialog";
import { StepChecklist } from "@/components/app/StepChecklist";
import { checkedIndexes, listIsComplete, toggleIndex } from "@/lib/completion";

type Props = {
  userStepId: string;
  status: string;
  withUs: boolean;
  notes: string | null;
  items: string[];
  checked: number[];
  completionNote: string | null;
  guideProfessionalId?: string | null;
  nextSlug?: string | null;
  prevSlug?: string | null;
};

export function StepActions({
  userStepId,
  status,
  withUs,
  notes,
  items,
  checked: initialChecked,
  completionNote,
  guideProfessionalId,
  nextSlug,
  prevSlug,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState(notes ?? "");
  const [introMessage, setIntroMessage] = useState<string | null>(null);
  const [checked, setChecked] = useState(() =>
    checkedIndexes(initialChecked, items.length),
  );
  const [localStatus, setLocalStatus] = useState(status);
  const [completionValue, setCompletionValue] = useState(completionNote ?? "");
  const [notice, setNotice] = useState<CompletionNotice | null>(null);
  const done = localStatus === "done" || localStatus === "skipped";
  const complete = listIsComplete(items.length, checked);

  function onToggle(index: number, nextChecked: boolean) {
    const previous = checked;
    const previousStatus = localStatus;
    const updated = toggleIndex(checked, index, nextChecked);
    setError(null);
    setChecked(updated);
    if (listIsComplete(items.length, updated)) setLocalStatus("done");
    else if (localStatus === "done") setLocalStatus("todo");

    startTransition(async () => {
      const result = await setChecklistItem(userStepId, index, nextChecked);
      if (result.error && !result.completed) {
        setChecked(previous);
        setLocalStatus(previousStatus);
        setError(result.error);
        return;
      }
      if (result.completionNote && result.completed)
        setCompletionValue(result.completionNote);
      const nextNotice = toCompletionNotice(result);
      if (nextNotice) setNotice(nextNotice);
      if (result.error) setError(result.error);
      router.refresh();
    });
  }

  function onDone() {
    setError(null);
    const previous = checked;
    const previousStatus = localStatus;
    setChecked(items.map((_, index) => index));
    setLocalStatus("done");
    startTransition(async () => {
      const result = await markStepDone(userStepId);
      if (result.error && !result.completed) {
        setChecked(previous);
        setLocalStatus(previousStatus);
        setError(result.error);
        return;
      }
      if (result.completionNote) setCompletionValue(result.completionNote);
      const nextNotice = toCompletionNotice(result);
      if (nextNotice) setNotice(nextNotice);
      if (result.error) setError(result.error);
      router.refresh();
    });
  }

  function onSkip() {
    setError(null);
    startTransition(async () => {
      const result = await skipStep(userStepId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setLocalStatus("skipped");
      router.refresh();
      if (nextSlug) router.push(`/app/steps/${nextSlug}`);
      else router.push("/app");
    });
  }

  function onNotesBlur() {
    void saveStepNotes(userStepId, noteValue);
  }

  function onCompletionBlur() {
    void saveCompletionNote(userStepId, completionValue);
  }

  function onRequestGuide() {
    if (!guideProfessionalId) return;
    startTransition(async () => {
      const result = await requestIntroduction(guideProfessionalId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setIntroMessage("Requested. Your guide will follow up.");
      router.refresh();
    });
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      {items.length > 0 ? (
        <section>
          <h2 className="m-0 text-[15px] font-semibold">What you&apos;ll do</h2>
          <p className="mt-1 m-0 text-[13px] text-muted">
            Tick each line. This step checks off when the list is complete.
          </p>
          <p className="mt-3 m-0 text-[12px] text-muted">
            {checked.length}/{items.length} done
          </p>
          <div className="mt-3">
            <StepChecklist
              items={items}
              checked={checked}
              disabled={pending}
              onToggle={onToggle}
            />
          </div>
        </section>
      ) : null}

      {!done ? (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onDone}
            disabled={pending}
            className="h-11 cursor-pointer rounded-control bg-ink px-5 text-[14px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {pending
              ? "Saving…"
              : complete || items.length === 0
                ? "Mark done"
                : "Mark the rest done"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            disabled={pending}
            className="cursor-pointer text-[14px] font-medium text-muted hover:text-ink"
          >
            Skip for now
          </button>
        </div>
      ) : (
        <p className="m-0 text-[14px] font-medium text-done">
          {localStatus === "skipped"
            ? "Skipped for now."
            : "Done. Checked off your list."}
        </p>
      )}

      {done && localStatus === "done" ? (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Completion note
          <textarea
            value={completionValue}
            onChange={(event) => setCompletionValue(event.target.value)}
            onBlur={onCompletionBlur}
            rows={5}
            className="rounded-control border border-[#D6D6D3] px-3 py-2 text-[14px] font-normal text-ink"
          />
        </label>
      ) : null}

      {withUs ? (
        <div className="rounded-card border border-line bg-[linear-gradient(160deg,#f4f6f2,#eaf0eb)] p-5">
          <p className="m-0 text-[14px] font-semibold">Do this with your guide</p>
          <p className="mt-1 m-0 text-[13px] text-secondary">
            Request an introduction and we will connect you.
          </p>
          <button
            type="button"
            onClick={onRequestGuide}
            disabled={pending || !guideProfessionalId}
            className="mt-3 h-10 cursor-pointer rounded-control bg-ink px-4 text-[13px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            Request introduction
          </button>
          {introMessage ? (
            <p className="mt-2 m-0 text-[13px] text-done">{introMessage}</p>
          ) : null}
        </div>
      ) : null}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Notes
        <textarea
          value={noteValue}
          onChange={(event) => setNoteValue(event.target.value)}
          onBlur={onNotesBlur}
          rows={4}
          className="rounded-control border border-[#D6D6D3] px-3 py-2 text-[14px] font-normal text-ink"
          placeholder="Anything you want to remember for this step"
        />
      </label>

      {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-5 text-[14px]">
        {prevSlug ? (
          <a
            href={`/app/steps/${prevSlug}`}
            className="font-medium text-secondary hover:text-ink"
          >
            Previous
          </a>
        ) : (
          <span className="text-muted">Previous</span>
        )}
        {nextSlug ? (
          <a
            href={`/app/steps/${nextSlug}`}
            className="font-medium text-ink hover:text-done"
          >
            Next
          </a>
        ) : (
          <span className="text-muted">Next</span>
        )}
      </div>

      {notice ? <CompletionDialog {...notice} onClose={() => setNotice(null)} /> : null}
    </div>
  );
}
