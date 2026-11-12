"use client";

import { useState } from "react";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import {
  EditedLine,
  EditableText,
  Label,
  RowMenu,
  SaveError,
  addButton,
  quietButton,
  useRows,
} from "@/components/office/bits";
import { needsReverify, websiteHref } from "@/lib/office/format";
import type { OfficeCompetitor, OfficePatch } from "@/lib/office/types";

const FIELDS: { key: keyof OfficeCompetitor; label: string }[] = [
  { key: "what_they_are", label: "What they are" },
  { key: "who_for", label: "Who it is for" },
  { key: "core_offer", label: "Core offer" },
  { key: "tiers_prices", label: "Tiers and prices" },
  { key: "addons", label: "Add-ons and hidden costs" },
  { key: "human_involved", label: "Human involved" },
  { key: "industry_specific", label: "Industry-specific" },
  { key: "ongoing", label: "Ongoing relationship" },
  { key: "revenue_model", label: "Revenue model" },
  { key: "where_we_differ", label: "Where Groundwork differs" },
];

const BLANK: OfficePatch = {
  name: "",
  website: "",
  country: "",
  what_they_are: "",
  who_for: "",
  core_offer: "",
  tiers_prices: "",
  addons: "",
  human_involved: "",
  industry_specific: "",
  ongoing: "",
  revenue_model: "",
  where_we_differ: "",
  source: "",
  verified_on: null,
};

export function CompetitorsBoard({
  rows: initial,
  editorName,
}: {
  rows: OfficeCompetitor[];
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [draft, setDraft] = useState<OfficePatch | null>(null);
  const [draftError, setDraftError] = useState("");

  function save(row: OfficeCompetitor, patch: OfficePatch) {
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
    return commit(row.id, next as OfficeCompetitor[], () =>
      saveOffice("office_competitors", row.id, patch),
    );
  }

  async function add() {
    if (!draft || !String(draft.name ?? "").trim()) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const values: OfficePatch = { ...draft, sort };
    for (const key of Object.keys(values)) {
      if (values[key] === "") values[key] = null;
    }
    values.name = String(draft.name).trim();
    const result = await createOffice("office_competitors", values);
    if (result.error || !result.id) {
      setDraftError("Could not save. Try again.");
      return;
    }
    setDraft(null);
    setDraftError("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          type="button"
          className={addButton}
          onClick={() => {
            setDraftError("");
            setDraft(draft ? null : { ...BLANK });
          }}
        >
          {draft ? "Close" : "Add competitor"}
        </button>
      </div>
      {draft ? (
        <article className="flex flex-col gap-3 rounded-card border border-[#E5E5E5] p-4">
          <input
            autoFocus
            value={String(draft.name ?? "")}
            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
            placeholder="Name"
            aria-label="Competitor name"
            className="h-9 rounded-control border border-[#E5E5E5] px-2 text-[16px] font-semibold"
          />
          <div className="grid grid-cols-1 gap-2 tab:grid-cols-2">
            <input
              value={String(draft.website ?? "")}
              onChange={(event) => setDraft({ ...draft, website: event.target.value })}
              placeholder="Website"
              aria-label="Website"
              className="h-9 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
            />
            <input
              value={String(draft.country ?? "")}
              onChange={(event) => setDraft({ ...draft, country: event.target.value })}
              placeholder="Country"
              aria-label="Country"
              className="h-9 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
            />
          </div>
          {FIELDS.map((field) => (
            <label key={field.key} className="flex flex-col gap-1">
              <Label>{field.label}</Label>
              <textarea
                value={String(draft[field.key] ?? "")}
                onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                className="min-h-16 rounded-control border border-[#E5E5E5] px-2 py-1.5 text-[14px]"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <Label>Source</Label>
            <input
              value={String(draft.source ?? "")}
              onChange={(event) => setDraft({ ...draft, source: event.target.value })}
              className="h-9 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
            />
          </label>
          {draftError ? <p className="m-0 text-[13px] text-red-700">{draftError}</p> : null}
          <button type="button" className={quietButton} onClick={() => void add()}>
            Save competitor
          </button>
        </article>
      ) : null}
      {rows.length === 0 && !draft ? (
        <p className="m-0 text-[14px] text-[#55555A]">No competitors yet.</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 desk:grid-cols-2">
        {rows
          .slice()
          .sort((a, b) => a.sort - b.sort)
          .map((row) => (
            <article key={row.id} className="flex flex-col gap-3 rounded-card border border-[#E5E5E5] p-4">
              <div className="flex items-start justify-between gap-3">
                <EditableText
                  value={row.name}
                  onSave={(name) => save(row, { name })}
                  className="text-[16px] font-semibold"
                />
                <RowMenu
                  onDelete={() =>
                    commit(
                      row.id,
                      rows.filter((item) => item.id !== row.id),
                      () => deleteOffice("office_competitors", row.id),
                    )
                  }
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[14px]">
                <EditableText
                  value={row.country ?? ""}
                  placeholder="Country"
                  onSave={(country) => save(row, { country: country || null })}
                  className="w-auto text-[#55555A]"
                />
                <EditableText
                  value={row.website ?? ""}
                  placeholder="Website"
                  onSave={(website) => save(row, { website: website || null })}
                  className="w-auto text-[#1F8A4C]"
                />
                {row.website ? (
                  <a
                    href={websiteHref(row.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-[#1F8A4C] underline-offset-2 hover:underline"
                  >
                    Open
                  </a>
                ) : null}
              </div>
              {FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <Label>{field.label}</Label>
                  <EditableText
                    multiline
                    value={String(row[field.key] ?? "")}
                    placeholder="Add"
                    onSave={(next) => save(row, { [field.key]: next || null })}
                    className="text-[14px]"
                  />
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-2 border-t border-[#E5E5E5] pt-3 text-[13px] text-[#55555A]">
                <span>Source:</span>
                <EditableText
                  value={row.source ?? ""}
                  placeholder="Add source"
                  onSave={(source) => save(row, { source: source || null })}
                  className="w-auto"
                />
                <span>· Verified:</span>
                <input
                  type="date"
                  aria-label="Verified on"
                  value={row.verified_on ?? ""}
                  onChange={(event) => save(row, { verified_on: event.target.value || null })}
                  className="rounded-control border border-[#E5E5E5] px-1.5 py-0.5 font-mono text-[11px]"
                />
                <span>{row.verified_on ? "" : "not verified"}</span>
                {needsReverify(row.verified_on) ? (
                  <span className="rounded-control bg-[#FFF4C2] px-1.5 py-0.5 font-mono text-[11px] text-[#111111]">
                    Re-verify before any pitch
                  </span>
                ) : null}
              </div>
              <EditedLine name={row.editor_name} at={row.updated_at} />
              <SaveError id={row.id} errors={errors} />
            </article>
          ))}
      </div>
    </div>
  );
}
