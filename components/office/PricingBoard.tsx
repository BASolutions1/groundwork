"use client";

import { useState } from "react";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import {
  EditedLine,
  EditableText,
  Label,
  RowMenu,
  SaveError,
  useRows,
} from "@/components/office/bits";
import { PricingMatrix } from "@/components/office/PricingMatrix";
import { formatCad } from "@/lib/office/format";
import { COMPARISON_COLUMNS, pricingComparison } from "@/lib/office/pricing";
import type { OfficePatch, OfficePricingTier } from "@/lib/office/types";

const COLUMNS = [
  { option: "A" as const, title: "Option A: monthly subscription" },
  { option: "B" as const, title: "Option B: Launch package, then annual Membership" },
];

function PriceField({
  tier,
  onSave,
}: {
  tier: OfficePricingTier;
  onSave: (price: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    tier.price_cad === null ? "" : String(tier.price_cad),
  );

  if (!editing) {
    const label =
      tier.price_cad === null
        ? tier.price_note || "Add price"
        : formatCad(tier.price_cad);
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(tier.price_cad === null ? "" : String(tier.price_cad));
          setEditing(true);
        }}
        className="cursor-text text-left text-[22px] font-semibold"
      >
        {label}
      </button>
    );
  }

  return (
    <input
      autoFocus
      inputMode="decimal"
      value={draft}
      aria-label="Price in CAD"
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        setEditing(false);
        const trimmed = draft.trim();
        onSave(trimmed === "" ? null : Number(trimmed));
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
        if (event.key === "Escape") {
          setDraft(tier.price_cad === null ? "" : String(tier.price_cad));
          setEditing(false);
        }
      }}
      className="h-9 w-full rounded-control border border-[#E5E5E5] px-2 text-[18px] font-semibold"
    />
  );
}

export function PricingBoard({
  rows: initial,
  editorName,
}: {
  rows: OfficePricingTier[];
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [names, setNames] = useState<Record<string, string>>({ A: "", B: "" });
  const comparison = pricingComparison(rows);

  function save(row: OfficePricingTier, patch: OfficePatch) {
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
    return commit(row.id, next as OfficePricingTier[], () =>
      saveOffice("office_pricing_tiers", row.id, patch),
    );
  }

  async function add(option: "A" | "B", event: React.FormEvent) {
    event.preventDefault();
    const name = names[option].trim();
    if (!name) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficePricingTier = {
      id,
      sort,
      option,
      name,
      included: null,
      who_for: null,
      price_cad: null,
      price_note: null,
      billing: null,
      anchor: null,
      notes: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setNames((current) => ({ ...current, [option]: "" }));
    await commit(id, [...rows, created], () =>
      createOffice("office_pricing_tiers", { option, name, sort }),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 rounded-card bg-[#FFF4C2] px-4 py-3 text-[14px] text-[#111111]">
        All prices are placeholders, not research. Nothing here is agreed.
      </p>
      {COLUMNS.map((column) => (
        <PricingMatrix
          key={column.option}
          side={column.option}
          title={column.title}
          tiers={rows.filter((row) => row.option === column.option)}
        />
      ))}
      <details className="rounded-card border border-[#E5E5E5]">
        <summary className="cursor-pointer list-none px-4 py-3 text-[14px] font-medium [&::-webkit-details-marker]:hidden">
          Edit tier details
        </summary>
        <div className="grid grid-cols-1 gap-6 border-t border-[#E5E5E5] p-4 desk:grid-cols-2">
          {COLUMNS.map((column) => {
            const tiers = rows
              .filter((row) => row.option === column.option)
              .sort((a, b) => a.sort - b.sort);
            return (
              <section key={column.option} className="flex flex-col gap-3">
                <h2 className="m-0 text-[16px] font-semibold">{column.title}</h2>
                {tiers.length === 0 ? (
                  <p className="m-0 text-[14px] text-[#55555A]">No tiers yet.</p>
                ) : null}
                {tiers.map((tier) => (
                  <article
                    key={tier.id}
                    className="flex flex-col gap-2 rounded-card border border-[#E5E5E5] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <EditableText
                        value={tier.name}
                        onSave={(name) => save(tier, { name })}
                        className="text-[16px] font-semibold"
                      />
                      <RowMenu
                        onDelete={() =>
                          commit(
                            tier.id,
                            rows.filter((item) => item.id !== tier.id),
                            () => deleteOffice("office_pricing_tiers", tier.id),
                          )
                        }
                      />
                    </div>
                    <PriceField
                      tier={tier}
                      onSave={(price_cad) => save(tier, { price_cad })}
                    />
                    {tier.price_cad !== null || tier.price_note ? (
                      <EditableText
                        value={tier.price_note ?? ""}
                        placeholder="Price note"
                        onSave={(price_note) =>
                          save(tier, { price_note: price_note || null })
                        }
                        className="text-[13px] text-[#55555A]"
                      />
                    ) : (
                      <EditableText
                        value=""
                        placeholder="Price note"
                        onSave={(price_note) =>
                          save(tier, { price_note: price_note || null })
                        }
                        className="text-[13px] text-[#55555A]"
                      />
                    )}
                    <Field
                      label="Billing"
                      value={tier.billing}
                      onSave={(billing) => save(tier, { billing })}
                    />
                    <Field
                      label="Included"
                      value={tier.included}
                      onSave={(included) => save(tier, { included })}
                    />
                    <Field
                      label="Who it is for"
                      value={tier.who_for}
                      onSave={(who_for) => save(tier, { who_for })}
                    />
                    <Field
                      label="Market anchor"
                      value={tier.anchor}
                      onSave={(anchor) => save(tier, { anchor })}
                    />
                    <Field
                      label="Notes"
                      value={tier.notes}
                      onSave={(notes) => save(tier, { notes })}
                    />
                    <EditedLine name={tier.editor_name} at={tier.updated_at} />
                    <SaveError id={tier.id} errors={errors} />
                  </article>
                ))}
                <form
                  onSubmit={(event) => add(column.option, event)}
                  className="flex gap-2"
                >
                  <input
                    value={names[column.option]}
                    onChange={(event) =>
                      setNames((current) => ({
                        ...current,
                        [column.option]: event.target.value,
                      }))
                    }
                    placeholder="Add a tier"
                    aria-label={`Add ${column.title} tier`}
                    className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
                  />
                </form>
              </section>
            );
          })}
        </div>
      </details>
      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[16px] font-semibold">What a client pays</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {COMPARISON_COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="py-2 pr-3 font-mono text-[11px] font-normal tracking-[0.06em] text-[#55555A] uppercase"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Startup", comparison.startup],
                  ["Premium", comparison.premium],
                ] as const
              ).map(([label, cells]) => (
                <tr key={label} className="border-b border-[#E5E5E5]">
                  <th className="py-3 pr-3 text-left font-medium">{label}</th>
                  {cells.map((cell, index) => (
                    <td
                      key={COMPARISON_COLUMNS[index + 1]}
                      className="py-3 pr-3 font-mono text-[13px]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string | null;
  onSave: (next: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <EditableText
        multiline
        value={value ?? ""}
        placeholder="Add"
        onSave={(next) => onSave(next || null)}
        className="text-[14px]"
      />
    </div>
  );
}
