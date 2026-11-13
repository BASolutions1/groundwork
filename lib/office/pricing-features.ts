export type PricingSide = "A" | "B";

export type PricingFeature = {
  group: string;
  label: string;
  included: Record<PricingSide, readonly string[]>;
};

const freeA = [
  "Free: Your list",
  "Startup Consulting",
  "Premium Consulting",
  "Full Startup Assistance",
] as const;
const startA = [
  "Startup Consulting",
  "Premium Consulting",
  "Full Startup Assistance",
] as const;
const premiumA = ["Premium Consulting", "Full Startup Assistance"] as const;
const fullA = ["Full Startup Assistance"] as const;
const growthA = ["Growth (later)"] as const;

const freeB = [
  "Free: Your list",
  "Startup Launch",
  "Premium Launch",
  "Full Startup Assistance",
] as const;
const startB = ["Startup Launch", "Premium Launch", "Full Startup Assistance"] as const;
const premiumB = ["Premium Launch", "Full Startup Assistance"] as const;
const fullB = ["Full Startup Assistance"] as const;
const growthB = ["Growth (later)"] as const;

export const PRICING_FEATURES: PricingFeature[] = [
  {
    group: "Getting set up",
    label: "Intake, ordered list, templates, and tool picks",
    included: { A: freeA, B: freeB },
  },
  {
    group: "Getting set up",
    label: "Dashboard",
    included: { A: freeA, B: [...freeB, "Membership"] },
  },
  {
    group: "A person with you",
    label: "Guide call at each stage",
    included: { A: startA, B: startB },
  },
  {
    group: "A person with you",
    label: "Introductions to accountant, insurance, and bank",
    included: { A: startA, B: [...startB, "Membership"] },
  },
  {
    group: "A person with you",
    label: "First estimate and invoice reviewed",
    included: { A: startA, B: startB },
  },
  {
    group: "A person with you",
    label: "Check-ins",
    included: { A: premiumA, B: ["Membership"] },
  },
  {
    group: "A person with you",
    label: "Priority access",
    included: { A: premiumA, B: premiumB },
  },
  {
    group: "Handled for you",
    label: "Done-with-you registration and set up",
    included: { A: premiumA, B: premiumB },
  },
  {
    group: "Handled for you",
    label: "Online presence set up",
    included: { A: premiumA, B: premiumB },
  },
  {
    group: "Full launch",
    label: "Business plan, financing prep, and branding",
    included: { A: fullA, B: fullB },
  },
  {
    group: "Full launch",
    label: "Every introduction followed through",
    included: { A: fullA, B: fullB },
  },
  {
    group: "After launch",
    label: "Ongoing advisory",
    included: { A: growthA, B: growthB },
  },
  {
    group: "After launch",
    label: "Specialist introductions",
    included: { A: growthA, B: growthB },
  },
  {
    group: "After launch",
    label: "Investor connections",
    included: { A: growthA, B: growthB },
  },
];

export function tierIncludes(
  side: PricingSide,
  tierName: string,
  feature: PricingFeature,
) {
  return feature.included[side].includes(tierName);
}
