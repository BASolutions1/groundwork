import { CompetitorsBoard } from "@/components/office/CompetitorsBoard";
import { FrameworkBoard } from "@/components/office/FrameworkBoard";
import { requireFounder } from "@/lib/office/access";
import { loadCompetitors, loadFramework } from "@/lib/office/load";

export const instant = false;

export default async function CompetitorsPage() {
  const { supabase, founder } = await requireFounder();
  const [competitors, framework] = await Promise.all([
    loadCompetitors(supabase),
    loadFramework(supabase),
  ]);
  if (competitors.error) {
    return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  }
  return (
    <div className="flex flex-col gap-10">
      <CompetitorsBoard rows={competitors.rows} editorName={founder.display_name} />
      <FrameworkBoard
        rows={framework.rows}
        unavailable={Boolean(framework.error)}
        editorName={founder.display_name}
      />
    </div>
  );
}
