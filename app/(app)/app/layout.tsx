import { requireUser } from "@/lib/auth";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopBar } from "@/components/app/AppTopBar";
import { isFounderEmail } from "@/lib/office/access";
import type { Profile, PlaybookStep, UserStep } from "@/lib/database.types";

export const instant = false;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: userSteps } = await supabase
    .from("user_steps")
    .select("*, playbook_steps(*)")
    .eq("user_id", user.id);

  const steps = (userSteps ?? []) as Array<
    UserStep & { playbook_steps: PlaybookStep | PlaybookStep[] | null }
  >;

  const normalized = steps.map((row) => ({
    ...row,
    playbook_steps: Array.isArray(row.playbook_steps)
      ? row.playbook_steps[0]
      : row.playbook_steps,
  }));

  const nextStep = normalized
    .filter((row) => row.status === "next" && row.playbook_steps)
    .sort((a, b) => (a.playbook_steps!.order ?? 0) - (b.playbook_steps!.order ?? 0))[0];

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar isFounder={isFounderEmail(user.email)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar
          profile={(profile as Profile | null) ?? null}
          nextTitle={nextStep?.playbook_steps?.title ?? null}
          nextSlug={nextStep?.playbook_steps?.slug ?? null}
        />
        <div className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-8 desk:px-8">{children}</div>
      </div>
    </div>
  );
}
