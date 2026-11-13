import { PricingBoard } from "@/components/office/PricingBoard";
import { RevenueBoard } from "@/components/office/RevenueBoard";
import { requireFounder } from "@/lib/office/access";
import { loadPricing, loadRevenue } from "@/lib/office/load";

export const instant = false;

export default async function PricingPage() {
  const { supabase, founder } = await requireFounder();
  const [pricing, revenue] = await Promise.all([
    loadPricing(supabase),
    loadRevenue(supabase),
  ]);
  if (pricing.error) {
    return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  }
  return (
    <div className="flex flex-col gap-10">
      <PricingBoard rows={pricing.rows} editorName={founder.display_name} />
      <RevenueBoard
        model={revenue.model}
        scenarios={revenue.scenarios}
        tiers={pricing.rows}
        unavailable={Boolean(revenue.error)}
        editorName={founder.display_name}
      />
    </div>
  );
}
