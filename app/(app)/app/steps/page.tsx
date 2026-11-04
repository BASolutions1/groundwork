import { StepsListClient } from "@/components/app/StepsListClient";
import { normalizeUserSteps } from "@/lib/app-data";
import { requireUser } from "@/lib/auth";
import type { PlaybookStep, UserStep } from "@/lib/database.types";

export const instant = false;

export default async function StepsIndexPage() {
  const { supabase, user } = await requireUser();
  const { data: rows, error } = await supabase
    .from("user_steps")
    .select("*, playbook_steps(*)")
    .eq("user_id", user.id);

  if (error) {
    return (
      <div className="rounded-card border border-line p-6">
        <p className="m-0 text-sm text-red-700">Could not load steps.</p>
      </div>
    );
  }

  const steps = normalizeUserSteps(
    (rows ?? []) as Array<UserStep & { playbook_steps: PlaybookStep | PlaybookStep[] | null }>,
  );

  return <StepsListClient steps={steps} />;
}
