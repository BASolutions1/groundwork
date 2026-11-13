"use client";

import { useState } from "react";

import { createOffice, saveOffice } from "@/app/(app)/app/office/actions";
import { EditableText, SaveError, quietButton, useRows } from "@/components/office/bits";
import type { OfficeFramework, OfficePatch } from "@/lib/office/types";

const COLUMNS = [
  ["zenbusiness", "ZenBusiness"],
  ["doola", "doola"],
  ["tailor_brands", "Tailor Brands"],
  ["ownr", "Ownr"],
  ["groundworks", "GroundWorks"],
  ["proposal", "Groundwork"],
] as const;

function tone(value: string) {
  const text = value.trim().toLowerCase();
  if (text.startsWith("y")) return "text-[#1F8A4C]";
  if (text === "n") return "text-[#8A8A8E]";
  if (text.startsWith("?")) return "text-[#8A8A8E]";
  return "text-[#111111]";
}

export function FrameworkBoard({
  rows: initial,
  unavailable,
  editorName,
}: {
  rows: OfficeFramework[];
  unavailable: boolean;
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [feature, setFeature] = useState("");

  function save(row: OfficeFramework, patch: OfficePatch) {
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
    return commit(row.id, next as OfficeFramework[], () =>
      saveOffice("office_framework", row.id, patch),
    );
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const name = feature.trim();
    if (!name) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeFramework = {
      id,
      sort,
      feature: name,
      is_heading: false,
      zenbusiness: null,
      doola: null,
      tailor_brands: null,
      ownr: null,
      groundworks: null,
      proposal: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setFeature("");
    await commit(id, [...rows, created], () =>
      createOffice("office_framework", { feature: name, is_heading: false, sort }),
    );
  }

  if (unavailable) {
    return (
      <p className="m-0 text-[14px] text-[#55555A]">
        The feature matrix is not on the database yet. Apply the latest migration, then
        refresh.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="m-0 text-[16px] font-semibold">What each offer includes</h2>
        <p className="mt-1 mb-0 text-[14px] text-[#55555A]">
          Y means included in at least one tier. Add-on is an extra charge. N is not
          offered. ? is unknown. The last column is the Groundwork proposal.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              <th className="py-2 pr-3 font-mono text-[11px] font-normal tracking-[0.06em] text-[#55555A] uppercase">
                Feature
              </th>
              {COLUMNS.map(([, label]) => (
                <th
                  key={label}
                  className="py-2 pr-3 font-mono text-[11px] font-normal tracking-[0.06em] text-[#55555A] uppercase"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows
              .slice()
              .sort((a, b) => a.sort - b.sort)
              .map((row) =>
                row.is_heading ? (
                  <tr key={row.id}>
                    <th
                      colSpan={COLUMNS.length + 1}
                      className="pt-4 pb-1 text-left text-[13px] font-semibold"
                    >
                      <EditableText
                        value={row.feature}
                        onSave={(next) => save(row, { feature: next })}
                        className="font-semibold"
                      />
                    </th>
                  </tr>
                ) : (
                  <tr key={row.id} className="border-b border-[#E5E5E5]">
                    <th className="py-2 pr-3 text-left align-top font-medium">
                      <EditableText
                        value={row.feature}
                        onSave={(next) => save(row, { feature: next })}
                      />
                      <SaveError id={row.id} errors={errors} />
                    </th>
                    {COLUMNS.map(([key]) => {
                      const value = row[key] ?? "";
                      return (
                        <td
                          key={key}
                          className={`py-2 pr-3 align-top ${key === "proposal" ? "bg-[#F4F9F5]" : ""}`}
                        >
                          <EditableText
                            value={value}
                            placeholder="—"
                            onSave={(next) => save(row, { [key]: next || null })}
                            className={tone(value)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>
      <form onSubmit={add} className="flex gap-2">
        <input
          value={feature}
          onChange={(event) => setFeature(event.target.value)}
          placeholder="Add a feature"
          aria-label="Feature name"
          className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
        />
        <button type="submit" className={quietButton}>
          Add feature
        </button>
      </form>
    </section>
  );
}
