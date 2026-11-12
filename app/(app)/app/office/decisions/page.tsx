import { DecisionsBoard } from "@/components/office/DecisionsBoard";
import { requireFounder } from "@/lib/office/access";
import { loadDecisions } from "@/lib/office/load";

export const instant = false;

export default async function DecisionsPage() {
  const { supabase, founder } = await requireFounder();
  const { rows, error } = await loadDecisions(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <DecisionsBoard rows={rows} editorName={founder.display_name} />;
}
