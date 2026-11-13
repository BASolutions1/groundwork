"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { isFounderEmail } from "@/lib/office/access";
import type { OfficePatch, OfficeTable } from "@/lib/office/types";

const PATHS = [
  "/app/office",
  "/app/office/next-steps",
  "/app/office/decisions",
  "/app/office/risks",
  "/app/office/competitors",
  "/app/office/pricing",
  "/app/office/notes",
];

const COLUMNS: Record<OfficeTable, string[]> = {
  office_tasks: ["title", "detail", "status", "owner", "due_on", "sort"],
  office_decisions: ["question", "why", "owner", "status", "decision", "decided_on", "sort"],
  office_risks: ["title", "detail", "severity", "status", "mitigation", "owner", "sort"],
  office_competitors: [
    "name",
    "website",
    "country",
    "what_they_are",
    "who_for",
    "core_offer",
    "tiers_prices",
    "addons",
    "human_involved",
    "industry_specific",
    "ongoing",
    "revenue_model",
    "where_we_differ",
    "source",
    "verified_on",
    "sort",
  ],
  office_pricing_tiers: [
    "option",
    "name",
    "included",
    "who_for",
    "price_cad",
    "price_note",
    "billing",
    "anchor",
    "notes",
    "sort",
  ],
  office_notes: ["title", "body", "pinned", "sort"],
  office_links: ["label", "url", "note", "sort"],
};

const ENUMS: Record<string, Record<string, readonly string[]>> = {
  office_tasks: {
    status: ["todo", "doing", "done", "on_hold"],
    owner: ["Joel", "Matas", "Brandan", "All"],
  },
  office_decisions: {
    status: ["open", "decided", "on_hold"],
    owner: ["Joel", "Matas", "Brandan", "All"],
  },
  office_risks: {
    severity: ["low", "medium", "high"],
    status: ["open", "watching", "resolved"],
    owner: ["Joel", "Matas", "Brandan", "All"],
  },
  office_pricing_tiers: { option: ["A", "B"] },
};

const NAME: Record<OfficeTable, string> = {
  office_tasks: "title",
  office_decisions: "question",
  office_risks: "title",
  office_competitors: "name",
  office_pricing_tiers: "name",
  office_notes: "title",
  office_links: "label",
};

const ENTITY: Record<OfficeTable, string> = {
  office_tasks: "task",
  office_decisions: "decision",
  office_risks: "risk",
  office_competitors: "competitor",
  office_pricing_tiers: "pricing tier",
  office_notes: "note",
  office_links: "link",
};

const REQUIRED: Record<OfficeTable, string[]> = {
  office_tasks: ["title"],
  office_decisions: ["question"],
  office_risks: ["title"],
  office_competitors: ["name"],
  office_pricing_tiers: ["option", "name"],
  office_notes: ["title"],
  office_links: ["label", "url"],
};

const DATES = new Set(["due_on", "decided_on", "verified_on"]);
const REQUIRED_TEXT = new Set(["title", "question", "name", "label", "url", "option"]);

type Result = { error: string | null; id?: string; slug?: string };

const fail: Result = { error: "Could not save. Try again." };

function revalidateOffice(slug?: string) {
  for (const path of PATHS) revalidatePath(path);
  if (slug) revalidatePath(`/app/office/notes/${slug}`);
}

function slugify(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "note";
}

function sanitize(table: OfficeTable, input: OfficePatch) {
  const out: OfficePatch = {};
  for (const key of COLUMNS[table]) {
    if (!(key in input)) continue;
    const value = input[key];
    const allowed = ENUMS[table]?.[key];
    if (allowed) {
      if (value === null && key === "owner") {
        out[key] = null;
        continue;
      }
      if (typeof value !== "string" || !allowed.includes(value)) return null;
      out[key] = value;
      continue;
    }
    if (key === "sort" || key === "price_cad") {
      if (value === null || value === "") {
        if (key === "sort") return null;
        out[key] = null;
        continue;
      }
      const parsed = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(parsed)) return null;
      out[key] = key === "sort" ? Math.round(parsed) : parsed;
      continue;
    }
    if (key === "pinned") {
      out[key] = Boolean(value);
      continue;
    }
    if (DATES.has(key)) {
      if (value === null || value === "") {
        out[key] = null;
        continue;
      }
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
      out[key] = value;
      continue;
    }
    if (value === null) {
      if (REQUIRED_TEXT.has(key)) return null;
      out[key] = null;
      continue;
    }
    if (typeof value !== "string") return null;
    if (REQUIRED_TEXT.has(key) && !value.trim()) return null;
    out[key] = value;
  }
  return out;
}

function summaryFor(
  table: OfficeTable,
  action: "created" | "updated" | "deleted",
  name: string,
  patch: OfficePatch,
  previousStatus?: string,
) {
  const entity = ENTITY[table];
  if (action === "created") return `added ${entity} '${name}'`;
  if (action === "deleted") return `deleted ${entity} '${name}'`;
  if (table === "office_tasks" && patch.status === "done" && previousStatus !== "done") {
    return `marked '${name}' done`;
  }
  if (table === "office_decisions") {
    if (patch.status === "decided") return `decided '${name}'`;
    return `edited decision '${name}'`;
  }
  const keys = Object.keys(patch);
  if (keys.length === 1 && keys[0] === "sort") return `reordered '${name}'`;
  if (keys.length === 1 && keys[0] === "status") {
    return `set ${entity} '${name}' to ${String(patch.status).replace(/_/g, " ")}`;
  }
  return `edited ${entity} '${name}'`;
}

async function gate() {
  const { supabase, user } = await requireUser();
  if (!isFounderEmail(user.email)) return null;
  const { data } = await supabase
    .from("founders")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();
  const name =
    (typeof data?.display_name === "string" && data.display_name) ||
    user.email?.split("@")[0] ||
    "Founder";
  return { supabase, user, name };
}

async function logChange(
  ctx: NonNullable<Awaited<ReturnType<typeof gate>>>,
  row: {
    entity: string;
    entityId: string;
    action: "created" | "updated" | "deleted";
    summary: string;
  },
) {
  await ctx.supabase.from("office_activity").insert({
    actor: ctx.user.id,
    actor_name: ctx.name,
    entity: row.entity,
    entity_id: row.entityId,
    action: row.action,
    summary: row.summary,
  });
}

async function nextSort(ctx: NonNullable<Awaited<ReturnType<typeof gate>>>, table: OfficeTable) {
  const { data } = await ctx.supabase
    .from(table)
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1);
  return (Number(data?.[0]?.sort) || 0) + 1;
}

async function uniqueSlug(
  ctx: NonNullable<Awaited<ReturnType<typeof gate>>>,
  base: string,
) {
  let slug = base;
  for (let n = 2; n < 50; n += 1) {
    const { data } = await ctx.supabase
      .from("office_notes")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

export async function saveOffice(table: OfficeTable, id: string, patch: OfficePatch): Promise<Result> {
  const ctx = await gate();
  if (!ctx) return fail;
  const clean = sanitize(table, patch);
  if (!clean || Object.keys(clean).length === 0) return fail;

  const { data: existing, error: readError } = await ctx.supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (readError || !existing) return fail;

  const { error } = await ctx.supabase.from(table).update(clean).eq("id", id);
  if (error) return fail;

  const name = String(clean[NAME[table]] ?? existing[NAME[table]] ?? "Untitled");
  await logChange(ctx, {
    entity: ENTITY[table],
    entityId: id,
    action: "updated",
    summary: summaryFor(table, "updated", name, clean, existing.status as string | undefined),
  });
  revalidateOffice(table === "office_notes" ? (existing.slug as string) : undefined);
  return { error: null };
}

export async function createOffice(table: OfficeTable, values: OfficePatch): Promise<Result> {
  const ctx = await gate();
  if (!ctx) return fail;
  const clean = sanitize(table, values);
  if (!clean) return fail;
  for (const key of REQUIRED[table]) {
    if (typeof clean[key] !== "string" || !String(clean[key]).trim()) return fail;
  }
  if (clean.sort === undefined) clean.sort = await nextSort(ctx, table);

  const extra: OfficePatch = {};
  let slug: string | undefined;
  if (table === "office_notes") {
    const title = String(clean.title).trim();
    slug = await uniqueSlug(ctx, slugify(title));
    clean.title = title;
    clean.body = typeof clean.body === "string" ? clean.body : "";
    extra.slug = slug;
  }

  const insert = { ...clean, ...extra };
  const { data, error } = await ctx.supabase.from(table).insert(insert).select("id").maybeSingle();
  if (error || !data) return fail;

  const name = String(clean[NAME[table]]);
  await logChange(ctx, {
    entity: ENTITY[table],
    entityId: data.id as string,
    action: "created",
    summary: summaryFor(table, "created", name, clean),
  });
  revalidateOffice(slug);
  return { error: null, id: data.id as string, slug };
}

export async function deleteOffice(table: OfficeTable, id: string): Promise<Result> {
  const ctx = await gate();
  if (!ctx) return fail;
  const { data: existing, error: readError } = await ctx.supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (readError || !existing) return fail;

  const { error } = await ctx.supabase.from(table).delete().eq("id", id);
  if (error) return fail;

  const name = String(existing[NAME[table]] ?? "Untitled");
  await logChange(ctx, {
    entity: ENTITY[table],
    entityId: id,
    action: "deleted",
    summary: summaryFor(table, "deleted", name, {}),
  });
  revalidateOffice(table === "office_notes" ? (existing.slug as string) : undefined);
  return { error: null };
}

export async function swapTaskSort(id: string, neighborId: string): Promise<Result> {
  const ctx = await gate();
  if (!ctx) return fail;
  const { data, error } = await ctx.supabase
    .from("office_tasks")
    .select("id, title, status, sort")
    .in("id", [id, neighborId]);
  if (error || !data || data.length !== 2) return fail;
  const current = data.find((row) => row.id === id);
  const neighbor = data.find((row) => row.id === neighborId);
  if (!current || !neighbor || current.status !== neighbor.status) return fail;

  const first = await ctx.supabase.from("office_tasks").update({ sort: neighbor.sort }).eq("id", current.id);
  if (first.error) return fail;
  const second = await ctx.supabase.from("office_tasks").update({ sort: current.sort }).eq("id", neighbor.id);
  if (second.error) {
    await ctx.supabase.from("office_tasks").update({ sort: current.sort }).eq("id", current.id);
    return fail;
  }

  await logChange(ctx, {
    entity: "task",
    entityId: current.id,
    action: "updated",
    summary: `reordered '${current.title}'`,
  });
  revalidateOffice();
  return { error: null };
}
