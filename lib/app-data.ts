import type { PlaybookStep, Professional, UserStep } from "@/lib/database.types";
import { STAGE_META } from "@/lib/database.types";

export type UserStepRow = UserStep & {
  playbook_steps: PlaybookStep | null;
};

export function normalizeUserSteps(
  rows: Array<UserStep & { playbook_steps: PlaybookStep | PlaybookStep[] | null }>,
): UserStepRow[] {
  return rows
    .map((row) => ({
      ...row,
      playbook_steps: Array.isArray(row.playbook_steps)
        ? (row.playbook_steps[0] ?? null)
        : row.playbook_steps,
      checklist_done: Array.isArray(row.checklist_done) ? row.checklist_done : [],
      completion_note: row.completion_note ?? null,
    }))
    .filter((row) => row.playbook_steps)
    .sort((a, b) => a.playbook_steps!.order - b.playbook_steps!.order);
}

export type StageProgress = {
  stage: number;
  title: string;
  short: string;
  slug: string;
  total: number;
  done: number;
  skipped: number;
  hasNext: boolean;
  fill: "empty" | "partial" | "complete";
  steps: UserStepRow[];
};

export function stageProgress(steps: UserStepRow[]): StageProgress[] {
  return [1, 2, 3, 4, 5, 6, 7].map((stage) => {
    const stageSteps = steps.filter((row) => row.playbook_steps!.stage === stage);
    const done = stageSteps.filter((row) => row.status === "done").length;
    const skipped = stageSteps.filter((row) => row.status === "skipped").length;
    const finished = done + skipped;
    const total = stageSteps.length;
    const meta = STAGE_META[stage];
    let fill: StageProgress["fill"] = "empty";
    if (total > 0 && finished >= total) fill = "complete";
    else if (finished > 0) fill = "partial";
    return {
      stage,
      title: meta.title,
      short: meta.short,
      slug: meta.slug,
      total,
      done,
      skipped,
      hasNext: stageSteps.some((row) => row.status === "next"),
      fill,
      steps: stageSteps,
    };
  });
}

export function daysSince(iso: string) {
  const start = new Date(iso);
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function professionalsForStage(
  professionals: Professional[],
  stage: number | null,
) {
  const guide = professionals.find((p) => p.role === "guide");
  const staged = professionals.filter(
    (p) => p.stage === stage || (stage != null && p.role === "guide"),
  );
  if (staged.length >= 3) return staged.slice(0, 3);
  const extras = professionals.filter(
    (p) => !staged.some((s) => s.id === p.id) && p.role !== "guide",
  );
  const list = [...staged];
  if (guide && !list.some((p) => p.id === guide.id)) list.unshift(guide);
  while (list.length < 3 && extras.length) list.push(extras.shift()!);
  return list.slice(0, 3);
}
