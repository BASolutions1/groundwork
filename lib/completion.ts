export type RecommendedStep = {
  slug: string;
  title: string;
  summary: string;
  stage: number;
  estimatedMinutes: number;
  withUs: boolean;
};

export type ComingStep = {
  slug: string;
  title: string;
};

export type CompletionPayload = {
  error: string | null;
  completed?: boolean;
  stepId?: string;
  stepTitle?: string;
  completionNote?: string | null;
  recommended?: RecommendedStep | null;
  alsoComing?: ComingStep[];
};

export function checkedIndexes(done: number[] | null | undefined, count: number) {
  return [
    ...new Set(
      (done ?? []).filter(
        (index) => Number.isInteger(index) && index >= 0 && index < count,
      ),
    ),
  ].sort((a, b) => a - b);
}

export function toggleIndex(done: number[], index: number, checked: boolean) {
  const next = new Set(done);
  if (checked) next.add(index);
  else next.delete(index);
  return [...next].sort((a, b) => a - b);
}

export function listIsComplete(count: number, checked: number[]) {
  return count > 0 && checked.length === count;
}

export function formatFinishedOn(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Winnipeg",
  }).format(date);
}

export function buildCompletionNote(
  items: string[],
  checked: number[],
  finishedAt = new Date(),
) {
  const lines = checked
    .filter((index) => items[index])
    .map((index) => `- ${items[index]}`);
  const date = formatFinishedOn(finishedAt);
  if (lines.length === 0) return `Finished ${date}.`;
  return `Finished ${date}.\n\nChecked off:\n${lines.join("\n")}`;
}
