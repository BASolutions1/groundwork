import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";

export async function requireFounder() {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("founders")
    .select("user_id, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) notFound();

  return {
    supabase,
    user,
    founder: data as { user_id: string; display_name: string },
  };
}
