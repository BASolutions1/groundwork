import { Fragment } from "react";

import { formatCad } from "@/lib/office/format";
import {
  PRICING_FEATURES,
  tierIncludes,
  type PricingSide,
} from "@/lib/office/pricing-features";
import type { OfficePricingTier } from "@/lib/office/types";

function Mark({ on }: { on: boolean }) {
  if (!on) {
    return (
      <span className="text-[#C8C8C4]" aria-label="Not included">
        —
      </span>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      role="img"
      aria-label="Included"
      className="inline-block"
    >
      <path
        d="M3.5 8.2 6.4 11.1 12.5 4.8"
        fill="none"
        stroke="#1F8A4C"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingMatrix({
  side,
  title,
  tiers,
}: {
  side: PricingSide;
  title: string;
  tiers: OfficePricingTier[];
}) {
  const columns = tiers.slice().sort((a, b) => a.sort - b.sort);
  const features = PRICING_FEATURES.map((feature, index) => ({
    feature,
    showGroup: index === 0 || feature.group !== PRICING_FEATURES[index - 1].group,
  }));

  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="m-0 text-[16px] font-semibold">{title}</h2>
        <p className="mt-1 mb-0 text-[14px] text-[#55555A]">
          A check is included. Paid tiers keep what Free includes. Growth and Membership
          are the stay-on offers, so they do not repeat the launch list.
        </p>
      </div>
      {columns.length === 0 ? (
        <p className="m-0 text-[14px] text-[#55555A]">No tiers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="sticky left-0 z-10 bg-white py-3 pr-4 text-left align-bottom font-mono text-[11px] font-normal tracking-[0.06em] text-[#55555A] uppercase">
                  Feature
                </th>
                {columns.map((tier) => (
                  <th
                    key={tier.id}
                    className="min-w-[148px] px-3 py-3 text-left align-bottom font-normal"
                  >
                    <div className="text-[14px] font-semibold tracking-normal text-[#111111] normal-case">
                      {tier.name}
                    </div>
                    <div className="mt-1 font-mono text-[13px] font-medium tracking-normal text-[#111111] normal-case">
                      {tier.price_cad === null
                        ? tier.price_note || "Price not set"
                        : formatCad(tier.price_cad)}
                    </div>
                    {tier.price_cad !== null && tier.price_note ? (
                      <div className="font-mono text-[11px] tracking-normal text-[#55555A] normal-case">
                        {tier.price_note}
                      </div>
                    ) : null}
                    {tier.billing ? (
                      <div className="mt-1 text-[12px] tracking-normal text-[#55555A] normal-case">
                        {tier.billing}
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#E5E5E5]">
                <th className="sticky left-0 z-10 bg-white py-3 pr-4 text-left align-top font-medium">
                  Who it is for
                </th>
                {columns.map((tier) => (
                  <td
                    key={tier.id}
                    className="px-3 py-3 align-top text-[12px] leading-snug text-[#55555A]"
                  >
                    {tier.who_for || "—"}
                  </td>
                ))}
              </tr>
              {features.map(({ feature, showGroup }) => {
                return (
                  <Fragment key={feature.label}>
                    {showGroup ? (
                      <tr>
                        <th
                          colSpan={columns.length + 1}
                          className="pt-4 pb-1 text-left text-[13px] font-semibold"
                        >
                          {feature.group}
                        </th>
                      </tr>
                    ) : null}
                    <tr className="border-b border-[#E5E5E5]">
                      <th className="sticky left-0 z-10 bg-white py-2.5 pr-4 text-left align-middle font-medium">
                        {feature.label}
                      </th>
                      {columns.map((tier) => (
                        <td
                          key={tier.id}
                          className="px-3 py-2.5 text-center align-middle"
                        >
                          <Mark on={tierIncludes(side, tier.name, feature)} />
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
