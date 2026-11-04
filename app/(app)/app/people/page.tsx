import { PeopleClient } from "@/components/app/PeopleClient";
import { requireUser } from "@/lib/auth";
import { STAGE_META } from "@/lib/database.types";

export const instant = false;

export default async function PeoplePage() {
  const { supabase, user } = await requireUser();
  const [{ data: professionals }, { data: introductions }] = await Promise.all([
    supabase.from("professionals").select("*").order("role"),
    supabase.from("introductions").select("*").eq("user_id", user.id),
  ]);

  return (
    <PeopleClient
      professionals={professionals ?? []}
      introductions={introductions ?? []}
      stageTitles={Object.fromEntries(
        Object.entries(STAGE_META).map(([key, value]) => [key, value.short]),
      )}
    />
  );
}
