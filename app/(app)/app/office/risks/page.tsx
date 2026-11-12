import { RisksBoard } from "@/components/office/RisksBoard";
import { requireFounder } from "@/lib/office/access";
import { loadRisks } from "@/lib/office/load";

export const instant = false;

export default async function RisksPage() {
  const { supabase, founder } = await requireFounder();
  const { rows, error } = await loadRisks(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <RisksBoard rows={rows} editorName={founder.display_name} />;
}
