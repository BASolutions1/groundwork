import { CompetitorsBoard } from "@/components/office/CompetitorsBoard";
import { requireFounder } from "@/lib/office/access";
import { loadCompetitors } from "@/lib/office/load";

export const instant = false;

export default async function CompetitorsPage() {
  const { supabase, founder } = await requireFounder();
  const { rows, error } = await loadCompetitors(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <CompetitorsBoard rows={rows} editorName={founder.display_name} />;
}
