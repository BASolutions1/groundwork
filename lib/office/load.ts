import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  OfficeActivity,
  OfficeCompetitor,
  OfficeDecision,
  OfficeLink,
  OfficeNote,
  OfficePricingTier,
  OfficeRisk,
  OfficeTask,
} from "@/lib/office/types";

type Row = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value : null;
}

function num(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function editor(row: Row, names: Map<string, string>) {
  const updatedBy = text(row.updated_by);
  return {
    updated_at: text(row.updated_at),
    updated_by: updatedBy,
    editor_name: updatedBy ? (names.get(updatedBy) ?? null) : null,
  };
}

async function founderNames(supabase: SupabaseClient) {
  const { data } = await supabase.from("founders").select("user_id, display_name");
  return new Map(
    (data ?? []).map((row) => [row.user_id as string, row.display_name as string]),
  );
}

function task(row: Row, names: Map<string, string>): OfficeTask {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    title: text(row.title) ?? "",
    detail: text(row.detail),
    status: row.status as OfficeTask["status"],
    owner: (text(row.owner) as OfficeTask["owner"]) ?? null,
    due_on: text(row.due_on),
    ...editor(row, names),
  };
}

function decision(row: Row, names: Map<string, string>): OfficeDecision {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    question: text(row.question) ?? "",
    why: text(row.why),
    owner: text(row.owner),
    status: row.status as OfficeDecision["status"],
    decision: text(row.decision),
    decided_on: text(row.decided_on),
    ...editor(row, names),
  };
}

function risk(row: Row, names: Map<string, string>): OfficeRisk {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    title: text(row.title) ?? "",
    detail: text(row.detail),
    severity: row.severity as OfficeRisk["severity"],
    status: row.status as OfficeRisk["status"],
    mitigation: text(row.mitigation),
    owner: text(row.owner),
    ...editor(row, names),
  };
}

function competitor(row: Row, names: Map<string, string>): OfficeCompetitor {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    name: text(row.name) ?? "",
    website: text(row.website),
    country: text(row.country),
    what_they_are: text(row.what_they_are),
    who_for: text(row.who_for),
    core_offer: text(row.core_offer),
    tiers_prices: text(row.tiers_prices),
    addons: text(row.addons),
    human_involved: text(row.human_involved),
    industry_specific: text(row.industry_specific),
    ongoing: text(row.ongoing),
    revenue_model: text(row.revenue_model),
    where_we_differ: text(row.where_we_differ),
    source: text(row.source),
    verified_on: text(row.verified_on),
    ...editor(row, names),
  };
}

function tier(row: Row, names: Map<string, string>): OfficePricingTier {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    option: row.option as OfficePricingTier["option"],
    name: text(row.name) ?? "",
    included: text(row.included),
    who_for: text(row.who_for),
    price_cad: num(row.price_cad),
    price_note: text(row.price_note),
    billing: text(row.billing),
    anchor: text(row.anchor),
    notes: text(row.notes),
    ...editor(row, names),
  };
}

function note(row: Row, names: Map<string, string>): OfficeNote {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    slug: text(row.slug) ?? "",
    title: text(row.title) ?? "",
    body: text(row.body) ?? "",
    pinned: Boolean(row.pinned),
    ...editor(row, names),
  };
}

function link(row: Row, names: Map<string, string>): OfficeLink {
  return {
    id: String(row.id),
    sort: num(row.sort) ?? 0,
    label: text(row.label) ?? "",
    url: text(row.url) ?? "",
    note: text(row.note),
    ...editor(row, names),
  };
}

async function rows(supabase: SupabaseClient, table: string) {
  const names = await founderNames(supabase);
  const { data, error } = await supabase.from(table).select("*").order("sort");
  return { names, data: (data ?? []) as Row[], error: error?.message ?? null };
}

export async function officeCounts(supabase: SupabaseClient) {
  const [tasks, decisions, risks] = await Promise.all([
    supabase.from("office_tasks").select("status"),
    supabase.from("office_decisions").select("status"),
    supabase.from("office_risks").select("status"),
  ]);
  const taskRows = tasks.data ?? [];
  const decisionRows = decisions.data ?? [];
  const riskRows = risks.data ?? [];
  return {
    tasks: taskRows.filter((row) => row.status === "todo" || row.status === "doing").length,
    decisions: decisionRows.filter((row) => row.status === "open").length,
    risks: riskRows.filter((row) => row.status === "open").length,
  };
}

export async function loadOverview(supabase: SupabaseClient) {
  const names = await founderNames(supabase);
  const [tasks, decisions, risks, notes, links, activity] = await Promise.all([
    supabase.from("office_tasks").select("*").order("sort"),
    supabase.from("office_decisions").select("*").order("sort"),
    supabase.from("office_risks").select("id, severity, status"),
    supabase.from("office_notes").select("*").order("sort"),
    supabase.from("office_links").select("*").order("sort"),
    supabase.from("office_activity").select("id, actor_name, summary, created_at").order("created_at", { ascending: false }).limit(15),
  ]);
  const error = tasks.error || decisions.error || risks.error || notes.error || links.error || activity.error;
  return {
    error: error?.message ?? null,
    tasks: ((tasks.data ?? []) as Row[]).map((row) => task(row, names)),
    decisions: ((decisions.data ?? []) as Row[]).map((row) => decision(row, names)),
    risks: (risks.data ?? []) as Pick<OfficeRisk, "id" | "severity" | "status">[],
    notes: ((notes.data ?? []) as Row[])
      .map((row) => note(row, names))
      .filter((row) => row.pinned),
    links: ((links.data ?? []) as Row[]).map((row) => link(row, names)),
    activity: (activity.data ?? []) as OfficeActivity[],
  };
}

export async function loadTasks(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_tasks");
  return { error, rows: data.map((row) => task(row, names)) };
}

export async function loadDecisions(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_decisions");
  return { error, rows: data.map((row) => decision(row, names)) };
}

export async function loadRisks(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_risks");
  return { error, rows: data.map((row) => risk(row, names)) };
}

export async function loadCompetitors(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_competitors");
  return { error, rows: data.map((row) => competitor(row, names)) };
}

export async function loadPricing(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_pricing_tiers");
  return { error, rows: data.map((row) => tier(row, names)) };
}

export async function loadNotes(supabase: SupabaseClient) {
  const { names, data, error } = await rows(supabase, "office_notes");
  const notes = data
    .map((row) => note(row, names))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.sort - b.sort);
  return { error, rows: notes };
}

export async function loadNote(supabase: SupabaseClient, slug: string) {
  const names = await founderNames(supabase);
  const { data, error } = await supabase.from("office_notes").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return note(data as Row, names);
}
