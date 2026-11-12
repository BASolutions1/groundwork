import { TasksBoard } from "@/components/office/TasksBoard";
import { requireFounder } from "@/lib/office/access";
import { loadTasks } from "@/lib/office/load";

export const instant = false;

export default async function NextStepsPage() {
  const { supabase, founder } = await requireFounder();
  const { rows, error } = await loadTasks(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <TasksBoard rows={rows} editorName={founder.display_name} />;
}
