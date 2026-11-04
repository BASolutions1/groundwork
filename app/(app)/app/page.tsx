import { OverviewClient } from "@/components/app/OverviewClient";
import { daysSince, normalizeUserSteps } from "@/lib/app-data";
import { requireUser } from "@/lib/auth";
import type { PlaybookStep, Profile, UserStep } from "@/lib/database.types";

export default async function AppOverviewPage() {
  const { supabase, user } = await requireUser();

  const [{ data: profile }, { data: rows, error }, { data: professionals }, { data: introductions }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("user_steps").select("*, playbook_steps(*)").eq("user_id", user.id),
      supabase.from("professionals").select("*").order("role"),
      supabase.from("introductions").select("*").eq("user_id", user.id),
    ]);

  if (error || !profile) {
    return (
      <div className="rounded-card border border-line p-6">
        <p className="m-0 text-sm text-red-700">Could not load your dashboard. Try refreshing.</p>
      </div>
    );
  }

  const steps = normalizeUserSteps(
    (rows ?? []) as Array<UserStep & { playbook_steps: PlaybookStep | PlaybookStep[] | null }>,
  );

  return (
    <OverviewClient
      steps={steps}
      professionals={professionals ?? []}
      introductions={introductions ?? []}
      daysSinceStarted={daysSince((profile as Profile).created_at)}
    />
  );
}
