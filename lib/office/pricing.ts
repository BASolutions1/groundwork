import { formatCount } from "@/lib/office/format";

export type PricingSeed = {
  option: "A" | "B";
  name: string;
  price_cad: number | null;
};

function priceOf(tiers: PricingSeed[], option: "A" | "B", name: string) {
  const row = tiers.find((tier) => tier.option === option && tier.name === name);
  return row?.price_cad ?? null;
}

function money(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return formatCount(value);
}

function months(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "—";
  return (Math.round(value * 10) / 10).toFixed(1);
}

export function pricingComparison(tiers: PricingSeed[]) {
  const startup = priceOf(tiers, "A", "Startup Consulting");
  const premium = priceOf(tiers, "A", "Premium Consulting");
  const startupLaunch = priceOf(tiers, "B", "Startup Launch");
  const premiumLaunch = priceOf(tiers, "B", "Premium Launch");
  const membership = priceOf(tiers, "B", "Membership");

  const sum = (left: number | null, right: number | null) =>
    left === null || right === null ? null : left + right;
  const startupBoth = sum(startupLaunch, membership);
  const premiumBoth = sum(premiumLaunch, membership);
  const startupMonths =
    startup === null || startup === 0 || startupBoth === null ? null : startupBoth / startup;
  const premiumMonths =
    startup === null ||
    startup === 0 ||
    premium === null ||
    premiumLaunch === null ||
    membership === null
      ? null
      : 3 + (premiumLaunch + membership - 3 * premium) / startup;

  return {
    startup: [
      money(startup === null ? null : startup * 3),
      money(startup === null ? null : startup * 12),
      money(startupLaunch),
      money(startupBoth),
      months(startupMonths),
    ],
    premium: [
      money(premium === null ? null : premium * 3),
      money(premium === null || startup === null ? null : premium * 3 + startup * 9),
      money(premiumLaunch),
      money(premiumBoth),
      months(premiumMonths),
    ],
  };
}

export const COMPARISON_COLUMNS = [
  "Client",
  "A, cancels after 3 months",
  "A, stays 12 months",
  "B, Launch only",
  "B, Launch + Membership",
  "Months on monthly to match B",
];
