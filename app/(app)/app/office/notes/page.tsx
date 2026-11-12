import { NotesBoard } from "@/components/office/NotesBoard";
import { requireFounder } from "@/lib/office/access";
import { loadNotes } from "@/lib/office/load";

export const instant = false;

export default async function NotesPage() {
  const { supabase } = await requireFounder();
  const { rows, error } = await loadNotes(supabase);
  if (error) return <p className="m-0 text-sm text-red-700">Could not load the site office.</p>;
  return <NotesBoard rows={rows} />;
}
