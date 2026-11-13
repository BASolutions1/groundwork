import Link from "next/link";
import { notFound } from "next/navigation";

import { StepActions } from "@/components/app/StepActions";
import { normalizeUserSteps } from "@/lib/app-data";
import { requireUser } from "@/lib/auth";
import type { PlaybookStep, UserStep } from "@/lib/database.types";
import { STAGE_META } from "@/lib/database.types";

type Props = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export default async function StepPage({ params }: Props) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();

  const [{ data: rows }, { data: guide }] = await Promise.all([
    supabase.from("user_steps").select("*, playbook_steps(*)").eq("user_id", user.id),
    supabase.from("professionals").select("id").eq("role", "guide").maybeSingle(),
  ]);

  const steps = normalizeUserSteps(
    (rows ?? []) as Array<
      UserStep & { playbook_steps: PlaybookStep | PlaybookStep[] | null }
    >,
  );

  const index = steps.findIndex((row) => row.playbook_steps!.slug === slug);
  if (index < 0) notFound();

  const current = steps[index];
  const step = current.playbook_steps!;
  const prev = index > 0 ? steps[index - 1] : null;
  const next = index < steps.length - 1 ? steps[index + 1] : null;
  const stage = STAGE_META[step.stage];

  return (
    <div className="mx-auto max-w-[720px]">
      <p className="m-0 text-[13px] text-muted">
        <Link href="/app/steps" className="hover:text-ink">
          Steps
        </Link>
        {" / "}
        <span>{stage?.short ?? `Stage ${step.stage}`}</span>
        {" / "}
        <span className="text-ink">{step.title}</span>
      </p>
      <h1 className="mt-4 m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
        {step.title}
      </h1>
      <p className="mt-3 m-0 text-[15px] leading-normal text-secondary">{step.summary}</p>
      <p className="mt-2 m-0 text-[13px] text-muted">
        About {step.estimated_minutes} minutes
      </p>

      <StepActions
        key={current.id}
        userStepId={current.id}
        status={current.status}
        withUs={step.with_us}
        notes={current.notes}
        items={step.what_youll_do ?? []}
        checked={current.checklist_done ?? []}
        completionNote={current.completion_note}
        guideProfessionalId={guide?.id ?? null}
        prevSlug={prev?.playbook_steps?.slug ?? null}
        nextSlug={next?.playbook_steps?.slug ?? null}
      />

      <p className="mt-10 m-0 text-[12px] text-muted">
        Groundwork guides and refers. We do not give legal, tax or accounting advice.
      </p>
      <p className="mt-3 m-0 text-[13px]">
        <Link
          href={step.help_url}
          className="font-medium text-ink underline-offset-2 hover:underline"
        >
          Read more about this stage
        </Link>
      </p>
    </div>
  );
}
