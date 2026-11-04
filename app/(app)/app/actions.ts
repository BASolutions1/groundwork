"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";

async function revalidateApp() {
  revalidatePath("/app");
  revalidatePath("/app/steps");
  revalidatePath("/app/people");
  revalidatePath("/app/settings");
}

export async function markStepDone(userStepId: string) {
  const { supabase, user } = await requireUser();

  const { data: current, error: currentError } = await supabase
    .from("user_steps")
    .select("id, step_id, status, playbook_steps(order, slug)")
    .eq("id", userStepId)
    .eq("user_id", user.id)
    .single();

  if (currentError || !current) {
    return { error: currentError?.message ?? "Step not found" };
  }

  const { error } = await supabase
    .from("user_steps")
    .update({ status: "done", done_at: new Date().toISOString() })
    .eq("id", userStepId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  // Promote the lowest-order todo to next, if none is next already.
  const { data: remaining } = await supabase
    .from("user_steps")
    .select("id, status, playbook_steps(order)")
    .eq("user_id", user.id);

  const rows = (remaining ?? []).map((row) => {
    const step = Array.isArray(row.playbook_steps)
      ? row.playbook_steps[0]
      : row.playbook_steps;
    return { id: row.id as string, status: row.status as string, order: step?.order ?? 9999 };
  });

  const hasNext = rows.some((row) => row.status === "next");
  if (!hasNext) {
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
  const slug = Array.isArray(current.playbook_steps)
    ? current.playbook_steps[0]?.slug
    : (current.playbook_steps as { slug?: string } | null)?.slug;
  if (slug) revalidatePath(`/app/steps/${slug}`);
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
    return { id: row.id as string, status: row.status as string, order: step?.order ?? 9999 };
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
  const province = String(formData.get("province") ?? "").trim().toUpperCase();

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
