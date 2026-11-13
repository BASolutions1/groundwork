"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { saveCompletionNote } from "@/app/(app)/app/actions";
import type { ComingStep, CompletionPayload, RecommendedStep } from "@/lib/completion";

export type CompletionNotice = {
  stepId: string;
  stepTitle: string;
  completionNote: string;
  recommended: RecommendedStep | null;
  alsoComing: ComingStep[];
};

export function toCompletionNotice(result: CompletionPayload): CompletionNotice | null {
  if (!result.completed || !result.stepId || !result.stepTitle) return null;
  return {
    stepId: result.stepId,
    stepTitle: result.stepTitle,
    completionNote: result.completionNote ?? "",
    recommended: result.recommended ?? null,
    alsoComing: result.alsoComing ?? [],
  };
}

type Props = CompletionNotice & {
  onClose: () => void;
};

export function CompletionDialog({
  stepId,
  stepTitle,
  completionNote,
  recommended,
  alsoComing,
  onClose,
}: Props) {
  const [note, setNote] = useState(completionNote);
  const [noteError, setNoteError] = useState<string | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  async function persist() {
    const result = await saveCompletionNote(stepId, note);
    if (result.error) setNoteError(result.error);
  }

  function close() {
    void persist();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#111111]/40 p-4 tab:items-center">
      <div className="absolute inset-0" onClick={close} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="completion-title"
        className="relative z-10 w-full max-w-[460px] rounded-card border border-line bg-white p-5 desk:p-6"
      >
        <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">DONE</p>
        <h2
          id="completion-title"
          className="mt-2 m-0 text-[20px] font-semibold tracking-[-0.02em]"
        >
          {stepTitle}
        </h2>
        <p className="mt-2 m-0 text-[14px] leading-normal text-secondary">
          Checked off on your list. The note below is saved with this step.
        </p>

        <label className="mt-4 flex flex-col gap-1.5 text-[13px] font-medium">
          Completion note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={() => void persist()}
            rows={5}
            className="rounded-control border border-[#D6D6D3] px-3 py-2 text-[14px] font-normal text-ink"
          />
        </label>
        {noteError ? <p className="mt-2 m-0 text-sm text-red-700">{noteError}</p> : null}

        {recommended ? (
          <div className="mt-5 rounded-card border border-ink p-4">
            <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">
              RECOMMENDED NEXT
            </p>
            <h3 className="mt-2 m-0 text-[16px] font-semibold tracking-[-0.015em]">
              {recommended.title}
            </h3>
            <p className="mt-1.5 m-0 text-[13px] leading-normal text-secondary">
              {recommended.summary}
            </p>
            <p className="mt-2 m-0 text-[12px] text-muted">
              About {recommended.estimatedMinutes} minutes
              {recommended.withUs ? " · your guide can do this with you" : ""}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/app/steps/${recommended.slug}`}
                autoFocus
                onClick={() => void persist()}
                className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-[14px] font-medium text-white hover:bg-[#2a2a2a]"
              >
                Do this next
              </Link>
              <button
                type="button"
                onClick={close}
                className="cursor-pointer text-[14px] font-medium text-muted hover:text-ink"
              >
                Stay here
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <p className="m-0 text-[14px] text-secondary">
              That was the last step on your list.
            </p>
            <Link
              href="/app"
              onClick={() => void persist()}
              className="inline-flex h-10 items-center rounded-control bg-ink px-4 text-[14px] font-medium text-white hover:bg-[#2a2a2a]"
            >
              Back to overview
            </Link>
          </div>
        )}

        {alsoComing.length > 0 ? (
          <div className="mt-4">
            <p className="mono m-0 text-[10px] tracking-[0.12em] text-muted">
              ALSO COMING UP
            </p>
            <ul className="mt-2 m-0 list-none p-0">
              {alsoComing.map((step) => (
                <li key={step.slug} className="border-b border-line py-2 text-[14px]">
                  <Link
                    href={`/app/steps/${step.slug}`}
                    onClick={() => void persist()}
                    className="font-medium text-ink hover:text-done"
                  >
                    {step.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
