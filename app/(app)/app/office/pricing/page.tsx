import { PricingBoard } from "@/components/office/PricingBoard";
import { requireFounder } from "@/lib/office/access";
import { loadPricing } from "@/lib/office/load";

export const instant = false;

export default async function PricingPage() {
  const { supabase, founder } = await requireFounder();
  const { rows, error } = await loadPricing(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <PricingBoard rows={rows} editorName={founder.display_name} />;
}
