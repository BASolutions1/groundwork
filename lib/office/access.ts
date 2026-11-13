import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";

export function isFounderEmail(email: string | null | undefined) {
  const value = email?.trim().toLowerCase() ?? "";
  const domain = value.split("@")[1] ?? "";
  return domain === "basolutionsai.com" || value === "brandan@griffithplaster.ca";
}

export async function requireFounder() {
  const { supabase, user } = await requireUser();
  if (!isFounderEmail(user.email)) notFound();

  const { data } = await supabase
    .from("founders")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    founder: {
      user_id: user.id,
      display_name:
        (data?.display_name as string | undefined) ||
        user.email?.split("@")[0] ||
        "Founder",
    },
  };
}
