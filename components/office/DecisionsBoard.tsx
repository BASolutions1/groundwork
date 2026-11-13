"use client";

import { useState } from "react";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import {
  EditedLine,
  EditableText,
  RowMenu,
  SaveError,
  StatusSelect,
  useRows,
} from "@/components/office/bits";
import { ChoiceMenu, ConfirmDialog } from "@/components/ui/popups";
import { todayISO } from "@/lib/office/format";
import type { OfficeDecision } from "@/lib/office/types";
import { OWNERS } from "@/lib/office/types";

const FILTERS = [
  { id: "open", label: "Open" },
  { id: "decided", label: "Decided" },
  { id: "on_hold", label: "On hold" },
] as const;

export function DecisionsBoard({
  rows: initial,
  editorName,
}: {
  rows: OfficeDecision[];
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [picked, setPicked] = useState<string[]>(["open", "on_hold"]);
  const [showAll, setShowAll] = useState(false);
  const [question, setQuestion] = useState("");
  const [ask, setAsk] = useState<{ row: OfficeDecision; text: string } | null>(null);

  function save(row: OfficeDecision, patch: Partial<OfficeDecision>) {
    const next = rows.map((item) =>
      item.id === row.id
        ? {
            ...item,
            ...patch,
            updated_at: new Date().toISOString(),
            editor_name: editorName,
          }
        : item,
    );
    return commit(row.id, next, () => saveOffice("office_decisions", row.id, patch));
  }

  function saveDecision(row: OfficeDecision, text: string) {
    if (text.trim() && row.status === "open") {
      setAsk({ row, text });
      return;
    }
    return save(row, { decision: text });
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const nextQuestion = question.trim();
    if (!nextQuestion) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeDecision = {
      id,
      sort,
      question: nextQuestion,
      why: null,
      owner: OWNERS.includes(editorName as (typeof OWNERS)[number]) ? editorName : "All",
      status: "open",
      decision: null,
      decided_on: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setQuestion("");
    await commit(id, [...rows, created], () =>
      createOffice("office_decisions", {
        question: nextQuestion,
        owner: created.owner,
        status: "open",
        sort,
      }),
    );
  }

  const visible = rows
    .filter((row) => showAll || picked.includes(row.status))
    .sort((a, b) => a.sort - b.sort);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((chip) => {
          const active = !showAll && picked.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setShowAll(false);
                setPicked((current) => {
                  const base = showAll ? [] : current;
                  return base.includes(chip.id)
                    ? base.filter((item) => item !== chip.id)
                    : [...base, chip.id];
                });
              }}
              className={`shrink-0 cursor-pointer rounded-control px-2.5 py-1 text-[13px] font-medium ${
                active
                  ? "bg-[#111111] text-white"
                  : "border border-[#E5E5E5] text-[#55555A]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className={`shrink-0 cursor-pointer rounded-control px-2.5 py-1 text-[13px] font-medium ${
            showAll ? "bg-[#111111] text-white" : "border border-[#E5E5E5] text-[#55555A]"
          }`}
        >
          All
        </button>
      </div>

      <form onSubmit={add} className="flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Add a decision"
          aria-label="Decision question"
          className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
        />
      </form>

      {visible.length === 0 ? (
        <p className="m-0 text-[14px] text-[#55555A]">No decisions in this view.</p>
      ) : null}

      {visible.map((row) => (
        <article
          key={row.id}
          className="flex flex-col gap-3 rounded-card border border-[#E5E5E5] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="m-0 font-mono text-[11px] text-[#55555A]">{row.sort}</p>
            <RowMenu
              onDelete={() =>
                commit(
                  row.id,
                  rows.filter((item) => item.id !== row.id),
                  () => deleteOffice("office_decisions", row.id),
                )
              }
            />
          </div>
          <EditableText
            value={row.question}
            onSave={(next) => save(row, { question: next })}
            className="text-[16px] font-semibold"
          />
          <EditableText
            multiline
            value={row.why ?? ""}
            placeholder="Why it matters"
            onSave={(why) => save(row, { why: why || null })}
            className="text-[14px] text-[#55555A]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <ChoiceMenu
              label="Owner"
              value={row.owner ?? "All"}
              onChange={(owner) => save(row, { owner })}
              options={OWNERS.map((name) => ({ value: name, label: name }))}
              className="rounded-control border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[11px]"
            />
            <StatusSelect
              value={row.status}
              options={["open", "decided", "on_hold"]}
              onChange={(status) => {
                const patch: Partial<OfficeDecision> = {
                  status: status as OfficeDecision["status"],
                };
                if (status === "decided" && !row.decided_on)
                  patch.decided_on = todayISO();
                return save(row, patch);
              }}
            />
            {row.decided_on ? (
              <span className="font-mono text-[11px] text-[#55555A]">
                Decided {row.decided_on}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="m-0 font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
              Decision
            </p>
            <EditableText
              multiline
              value={row.decision ?? ""}
              placeholder="Write the decision"
              onSave={(text) => saveDecision(row, text)}
              className="text-[15px]"
              inputClassName="min-h-24 w-full rounded-control border border-[#E5E5E5] px-2 py-1.5 text-[15px]"
            />
          </div>
          <EditedLine name={row.editor_name} at={row.updated_at} />
          <SaveError id={row.id} errors={errors} />
        </article>
      ))}
      {ask ? (
        <ConfirmDialog
          title="Mark as decided?"
          body="OK marks this decision decided and dates it today. Cancel keeps it open."
          onConfirm={() => {
            void save(ask.row, {
              decision: ask.text,
              status: "decided",
              decided_on: todayISO(),
            });
            setAsk(null);
          }}
          onCancel={() => {
            void save(ask.row, { decision: ask.text });
            setAsk(null);
          }}
        />
      ) : null}
    </div>
  );
}
