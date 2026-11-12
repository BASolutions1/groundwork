import { OverviewBoard } from "@/components/office/OverviewBoard";
import { requireFounder } from "@/lib/office/access";
import { loadOverview } from "@/lib/office/load";

export const instant = false;

export default async function OfficePage() {
  const { supabase, founder } = await requireFounder();
  const data = await loadOverview(supabase);
  if (data.error) {
    return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  }

  return (
    <OverviewBoard
      tasks={data.tasks}
      decisions={data.decisions}
      risks={data.risks}
      notes={data.notes}
      links={data.links}
      activity={data.activity}
      editorName={founder.display_name}
    />
  );
}
