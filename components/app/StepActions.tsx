"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { markStepDone, requestIntroduction, saveStepNotes, skipStep } from "@/app/(app)/app/actions";

type Props = {
  userStepId: string;
  status: string;
  withUs: boolean;
  notes: string | null;
  guideProfessionalId?: string | null;
  nextSlug?: string | null;
  prevSlug?: string | null;
};

export function StepActions({
  userStepId,
  status,
  withUs,
  notes,
  guideProfessionalId,
  nextSlug,
  prevSlug,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState(notes ?? "");
  const [introMessage, setIntroMessage] = useState<string | null>(null);
  const done = status === "done" || status === "skipped";

  function onDone() {
    setError(null);
    startTransition(async () => {
      const result = await markStepDone(userStepId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
      if (nextSlug) router.push(`/app/steps/${nextSlug}`);
      else router.push("/app");
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
      router.refresh();
      if (nextSlug) router.push(`/app/steps/${nextSlug}`);
      else router.push("/app");
    });
  }

  function onNotesBlur() {
    void saveStepNotes(userStepId, noteValue);
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
      {!done ? (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onDone}
            disabled={pending}
            className="h-11 cursor-pointer rounded-control bg-ink px-5 text-[14px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Mark done"}
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
          {status === "skipped" ? "Skipped for now." : "Done."}
        </p>
      )}

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
          <a href={`/app/steps/${prevSlug}`} className="font-medium text-secondary hover:text-ink">
            Previous
          </a>
        ) : (
          <span className="text-muted">Previous</span>
        )}
        {nextSlug ? (
          <a href={`/app/steps/${nextSlug}`} className="font-medium text-ink hover:text-done">
            Next
          </a>
        ) : (
          <span className="text-muted">Next</span>
        )}
      </div>
    </div>
  );
}
