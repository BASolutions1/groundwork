import { SettingsForm } from "@/components/app/SettingsForm";
import { requireUser } from "@/lib/auth";
import type { Profile } from "@/lib/database.types";

export const instant = false;

export default async function SettingsPage() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="rounded-card border border-line p-6">
        <p className="m-0 text-sm text-red-700">Could not load settings.</p>
      </div>
    );
  }

  return <SettingsForm profile={profile as Profile} email={user.email ?? ""} />;
}
