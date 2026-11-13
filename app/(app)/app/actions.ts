"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  buildCompletionNote,
  checkedIndexes,
  listIsComplete,
  toggleIndex,
  type ComingStep,
  type CompletionPayload,
  type RecommendedStep,
} from "@/lib/completion";

type StepRecord = {
  order: number;
  slug: string;
  title: string;
  summary: string;
  stage: number;
  estimated_minutes: number;
  with_us: boolean;
  what_youll_do: string[] | null;
};

type OwnedStep = {
  id: string;
  status: string;
  done_at: string | null;
  checklist_done: number[] | null;
  completion_note: string | null;
  step: StepRecord;
};

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function schemaError(message: string) {
  if (message.includes("checklist_done") || message.includes("completion_note")) {
    return "Checklist saving is not on the database yet. Apply the latest migration, then try again.";
  }
  return message;
}

async function revalidateApp() {
  revalidatePath("/app");
  revalidatePath("/app/steps");
  revalidatePath("/app/people");
  revalidatePath("/app/settings");
}

async function loadOwnedStep(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
  userStepId: string,
): Promise<{ ok: false; error: string } | { ok: true; row: OwnedStep }> {
  const { data, error } = await supabase
    .from("user_steps")
    .select(
      "id, status, done_at, checklist_done, completion_note, playbook_steps(order, slug, title, summary, stage, estimated_minutes, with_us, what_youll_do)",
    )
    .eq("id", userStepId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return { ok: false, error: schemaError(error?.message ?? "Step not found") };

  const step = one(data.playbook_steps as StepRecord | StepRecord[] | null);
  if (!step) return { ok: false, error: "Step not found" };

  return {
    ok: true,
    row: {
      id: data.id as string,
      status: data.status as string,
      done_at: (data.done_at as string | null) ?? null,
      checklist_done: (data.checklist_done as number[] | null) ?? [],
      completion_note: (data.completion_note as string | null) ?? null,
      step,
    },
  };
}

async function promoteNext(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
) {
  const { data: remaining, error } = await supabase
    .from("user_steps")
    .select("id, status, playbook_steps(order)")
    .eq("user_id", userId);

  if (error) return error.message;

  const rows = (remaining ?? []).map((row) => {
    const step = one(
      row.playbook_steps as { order?: number } | { order?: number }[] | null,
    );
    return {
      id: row.id as string,
      status: row.status as string,
      order: step?.order ?? 9999,
    };
  });

  if (rows.some((row) => row.status === "next")) return null;

  const candidate = rows
    .filter((row) => row.status === "todo")
    .sort((a, b) => a.order - b.order)[0];
  if (!candidate) return null;

  const { error: updateError } = await supabase
    .from("user_steps")
    .update({ status: "next" })
    .eq("id", candidate.id)
    .eq("user_id", userId);

  return updateError?.message ?? null;
}

async function loadSuggestions(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
): Promise<{ recommended: RecommendedStep | null; alsoComing: ComingStep[] }> {
  const { data } = await supabase
    .from("user_steps")
    .select(
      "id, status, playbook_steps(slug, title, summary, stage, order, estimated_minutes, with_us)",
    )
    .eq("user_id", userId);

  const open = (data ?? [])
    .map((row) => {
      const step = one(row.playbook_steps as StepRecord | StepRecord[] | null);
      if (!step) return null;
      return { status: row.status as string, step };
    })
    .filter((row): row is { status: string; step: StepRecord } => row !== null)
    .filter((row) => row.status === "next" || row.status === "todo")
    .sort((a, b) => a.step.order - b.step.order);

  const picked = open.find((row) => row.status === "next") ?? open[0] ?? null;
  const recommended = picked
    ? {
        slug: picked.step.slug,
        title: picked.step.title,
        summary: picked.step.summary,
        stage: picked.step.stage,
        estimatedMinutes: picked.step.estimated_minutes,
        withUs: picked.step.with_us,
      }
    : null;

  const alsoComing = open
    .filter((row) => row.step.slug !== recommended?.slug)
    .slice(0, 2)
    .map((row) => ({ slug: row.step.slug, title: row.step.title }));

  return { recommended, alsoComing };
}

function completionResult(
  row: OwnedStep,
  note: string | null,
  suggestions: { recommended: RecommendedStep | null; alsoComing: ComingStep[] },
): CompletionPayload {
  return {
    error: null,
    completed: true,
    stepId: row.id,
    stepTitle: row.step.title,
    completionNote: note,
    recommended: suggestions.recommended,
    alsoComing: suggestions.alsoComing,
  };
}

async function revalidateStep(slug: string | undefined, extraSlug?: string | null) {
  await revalidateApp();
  if (slug) revalidatePath(`/app/steps/${slug}`);
  if (extraSlug) revalidatePath(`/app/steps/${extraSlug}`);
}

export async function markStepDone(userStepId: string): Promise<CompletionPayload> {
  const { supabase, user } = await requireUser();
  const loaded = await loadOwnedStep(supabase, user.id, userStepId);
  if (!loaded.ok) return { error: loaded.error };

  const { row } = loaded;
  if (row.status === "done") return { error: null, completed: false };

  const items = row.step.what_youll_do ?? [];
  const finishedAt = new Date();
  const allChecked = items.map((_, index) => index);
  const completionNote =
    row.completion_note ?? buildCompletionNote(items, allChecked, finishedAt);

  const { error } = await supabase
    .from("user_steps")
    .update({
      status: "done",
      done_at: finishedAt.toISOString(),
      checklist_done: allChecked,
      completion_note: completionNote,
    })
    .eq("id", userStepId)
    .eq("user_id", user.id);

  if (error) return { error: schemaError(error.message) };

  const promoteError = await promoteNext(supabase, user.id);
  const suggestions = await loadSuggestions(supabase, user.id);
  await revalidateStep(row.step.slug, suggestions.recommended?.slug);
  const result = completionResult(row, completionNote, suggestions);
  if (promoteError) return { ...result, error: promoteError };
  return result;
}

export async function setChecklistItem(
  userStepId: string,
  index: number,
  checked: boolean,
): Promise<CompletionPayload> {
  const { supabase, user } = await requireUser();
  if (!Number.isInteger(index) || index < 0 || index > 23) {
    return { error: "That line is not on this step." };
  }

  const loaded = await loadOwnedStep(supabase, user.id, userStepId);
  if (!loaded.ok) return { error: loaded.error };

  const { row } = loaded;
  const items = row.step.what_youll_do ?? [];
  if (index >= items.length) return { error: "That line is not on this step." };

  const nextChecked = toggleIndex(
    checkedIndexes(row.checklist_done, items.length),
    index,
    checked,
  );
  const finished = listIsComplete(items.length, nextChecked);
  const wasDone = row.status === "done";
  const finishedAt = new Date();

  let status = row.status;
  let doneAt = row.done_at;
  let completionNote = row.completion_note;
  let justCompleted = false;

  if (finished && status !== "done") {
    status = "done";
    doneAt = finishedAt.toISOString();
    justCompleted = true;
    if (!completionNote)
      completionNote = buildCompletionNote(items, nextChecked, finishedAt);
  } else if (!finished && status === "done") {
    status = "todo";
    doneAt = null;
  }

  const { error } = await supabase
    .from("user_steps")
    .update({
      checklist_done: nextChecked,
      status,
      done_at: doneAt,
      completion_note: completionNote,
    })
    .eq("id", userStepId)
    .eq("user_id", user.id);

  if (error) return { error: schemaError(error.message) };

  let promoteError: string | null = null;
  if (justCompleted || wasDone) promoteError = await promoteNext(supabase, user.id);

  const suggestions = await loadSuggestions(supabase, user.id);
  await revalidateStep(row.step.slug, suggestions.recommended?.slug);

  if (!justCompleted) return { error: promoteError, completed: false };
  const result = completionResult(row, completionNote, suggestions);
  if (promoteError) return { ...result, error: promoteError };
  return result;
}

export async function saveCompletionNote(userStepId: string, note: string) {
  const { supabase, user } = await requireUser();
  const trimmed = note.trim();
  if (trimmed.length > 4000)
    return { error: "Keep the completion note under 4000 characters." };

  const { error } = await supabase
    .from("user_steps")
    .update({ completion_note: trimmed || null })
    .eq("id", userStepId)
    .eq("user_id", user.id);

  if (error) return { error: schemaError(error.message) };
  revalidatePath("/app");
  revalidatePath("/app/steps");
  return { error: null };
}

export async function skipStep(userStepId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("user_steps")
    .update({ status: "skipped", done_at: new Date().toISOString() })
    .eq("id", userStepId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  const { data: remaining } = await supabase
    .from("user_steps")
    .select("id, status, playbook_steps(order)")
    .eq("user_id", user.id);

  const rows = (remaining ?? []).map((row) => {
    const step = Array.isArray(row.playbook_steps)
      ? row.playbook_steps[0]
      : row.playbook_steps;
    return {
      id: row.id as string,
      status: row.status as string,
      order: step?.order ?? 9999,
    };
  });

  if (!rows.some((row) => row.status === "next")) {
    const candidate = rows
      .filter((row) => row.status === "todo")
      .sort((a, b) => a.order - b.order)[0];
    if (candidate) {
      await supabase
        .from("user_steps")
        .update({ status: "next" })
        .eq("id", candidate.id)
        .eq("user_id", user.id);
    }
  }

  await revalidateApp();
  return { error: null };
}

export async function saveStepNotes(userStepId: string, notes: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("user_steps")
    .update({ notes })
    .eq("id", userStepId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function requestIntroduction(professionalId: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("introductions").upsert(
    {
      user_id: user.id,
      professional_id: professionalId,
      status: "requested",
      requested_at: new Date().toISOString(),
    },
    { onConflict: "user_id,professional_id" },
  );
  if (error) return { error: error.message };
  revalidatePath("/app/people");
  revalidatePath("/app");
  return { error: null };
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireUser();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const businessType = String(formData.get("businessType") ?? "").trim();
  const province = String(formData.get("province") ?? "")
    .trim()
    .toUpperCase();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      business_name: businessName || null,
      business_type: businessType || null,
      province: province || null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/app/settings");
  revalidatePath("/app");
  return { error: null };
}
