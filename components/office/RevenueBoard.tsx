"use client";

import { useState } from "react";

import { createOffice, saveOffice } from "@/app/(app)/app/office/actions";
import { EditableText, SaveError, quietButton, useRows } from "@/components/office/bits";
import { formatCad, formatCount } from "@/lib/office/format";
import { scenarioMoney } from "@/lib/office/pricing";
import type {
  OfficePricingTier,
  OfficeRevenueModel,
  OfficeRevenueScenario,
} from "@/lib/office/types";

function money(value: number | null) {
  return value === null ? "—" : formatCad(value);
}

function count(value: number | null) {
  return value === null ? "—" : formatCount(value);
}

function NumberCell({
  value,
  label,
  onSave,
}: {
  value: number | null;
  label: string;
  onSave: (next: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value === null ? "" : String(value));

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value === null ? "" : String(value));
          setEditing(true);
        }}
        className="cursor-text font-mono text-[13px]"
      >
        {count(value)}
      </button>
    );
  }

  return (
    <input
      autoFocus
      inputMode="decimal"
      aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => {
        setEditing(false);
        const trimmed = draft.trim();
        const parsed = Number(trimmed);
        onSave(trimmed === "" ? null : Number.isFinite(parsed) ? parsed : value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.currentTarget.blur();
        if (event.key === "Escape") setEditing(false);
      }}
      className="h-8 w-20 rounded-control border border-[#E5E5E5] px-1.5 font-mono text-[13px]"
    />
  );
}

export function RevenueBoard({
  model,
  scenarios: initial,
  tiers,
  unavailable,
  editorName,
}: {
  model: OfficeRevenueModel | null;
  scenarios: OfficeRevenueScenario[];
  tiers: OfficePricingTier[];
  unavailable: boolean;
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [liveModel, setLiveModel] = useState(model);
  const [name, setName] = useState("");
  const startup = tiers.find(
    (tier) => tier.option === "A" && tier.name === "Startup Consulting",
  );
  const premium = tiers.find(
    (tier) => tier.option === "A" && tier.name === "Premium Consulting",
  );

  function saveScenario(
    row: OfficeRevenueScenario,
    patch: Partial<OfficeRevenueScenario>,
  ) {
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
    return commit(row.id, next, () =>
      saveOffice("office_revenue_scenarios", row.id, patch),
    );
  }

  function saveModel(patch: Partial<OfficeRevenueModel>) {
    if (!liveModel) return;
    setLiveModel({ ...liveModel, ...patch });
    return saveOffice("office_revenue_model", liveModel.id, patch);
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    if (!nextName) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeRevenueScenario = {
      id,
      sort,
      name: nextName,
      free_users: null,
      startup_clients: null,
      premium_clients: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setName("");
    await commit(id, [...rows, created], () =>
      createOffice("office_revenue_scenarios", { name: nextName, sort }),
    );
  }

  if (unavailable) {
    return (
      <p className="m-0 text-[14px] text-[#55555A]">
        The revenue scenarios are not on the database yet. Apply the latest migration,
        then refresh.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="m-0 text-[16px] font-semibold">Revenue scenarios</h2>
        <p className="mt-1 mb-0 text-[14px] text-[#55555A]">
          Illustrative monthly figures in CAD. Subscription uses the Option A Startup
          Consulting and Premium Consulting prices. Counts are inputs. The money columns
          are calculated.
        </p>
      </div>
      {liveModel ? (
        <div className="flex flex-wrap gap-6 text-[14px]">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
              Referral fee, CAD
            </span>
            <NumberCell
              value={liveModel.referral_fee_cad}
              label="Referral fee"
              onSave={(referral_fee_cad) => void saveModel({ referral_fee_cad })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
              Introductions per paying client
            </span>
            <NumberCell
              value={liveModel.intros_per_client}
              label="Introductions per paying client"
              onSave={(intros_per_client) => void saveModel({ intros_per_client })}
            />
          </label>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              {[
                "Scenario",
                "Free users",
                "Startup clients",
                "Premium clients",
                "Subscription / month",
                "Referral / month",
                "Total / month",
                "Total / year",
              ].map((column) => (
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
            {rows
              .slice()
              .sort((a, b) => a.sort - b.sort)
              .map((row) => {
                const figures = scenarioMoney({
                  startupPrice: startup?.price_cad ?? null,
                  premiumPrice: premium?.price_cad ?? null,
                  referralFee: liveModel?.referral_fee_cad ?? null,
                  introsPerClient: liveModel?.intros_per_client ?? null,
                  startupClients: row.startup_clients,
                  premiumClients: row.premium_clients,
                });
                return (
                  <tr key={row.id} className="border-b border-[#E5E5E5]">
                    <th className="py-3 pr-3 text-left font-medium">
                      <EditableText
                        value={row.name}
                        onSave={(next) => saveScenario(row, { name: next })}
                      />
                      <SaveError id={row.id} errors={errors} />
                    </th>
                    <td className="py-3 pr-3">
                      <NumberCell
                        value={row.free_users}
                        label={`${row.name} free users`}
                        onSave={(free_users) => saveScenario(row, { free_users })}
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <NumberCell
                        value={row.startup_clients}
                        label={`${row.name} startup clients`}
                        onSave={(startup_clients) =>
                          saveScenario(row, { startup_clients })
                        }
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <NumberCell
                        value={row.premium_clients}
                        label={`${row.name} premium clients`}
                        onSave={(premium_clients) =>
                          saveScenario(row, { premium_clients })
                        }
                      />
                    </td>
                    <td className="py-3 pr-3 font-mono text-[13px]">
                      {money(figures.subscription)}
                    </td>
                    <td className="py-3 pr-3 font-mono text-[13px]">
                      {money(figures.referral)}
                    </td>
                    <td className="py-3 pr-3 font-mono text-[13px]">
                      {money(figures.total)}
                    </td>
                    <td className="py-3 pr-3 font-mono text-[13px]">
                      {money(figures.year)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {liveModel?.caveat ? (
        <p className="m-0 text-[13px] text-[#55555A]">{liveModel.caveat}</p>
      ) : null}
      <form onSubmit={add} className="flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Add a scenario"
          aria-label="Scenario name"
          className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
        />
        <button type="submit" className={quietButton}>
          Add scenario
        </button>
      </form>
    </section>
  );
}
