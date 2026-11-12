import { notFound } from "next/navigation";

import { NoteEditor } from "@/components/office/NotesBoard";
import { requireFounder } from "@/lib/office/access";
import { loadNote } from "@/lib/office/load";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export default async function OfficeNotePage({ params }: Props) {
  const { slug } = await params;
  const { supabase, founder } = await requireFounder();
  const note = await loadNote(supabase, slug);
  if (!note) notFound();
  return <NoteEditor note={note} editorName={founder.display_name} />;
}
