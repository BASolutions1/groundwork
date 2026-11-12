"use client";

import Link from "next/link";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import {
  EditableText,
  Label,
  RowMenu,
  SaveError,
  When,
  useRows,
} from "@/components/office/bits";
import type {
  OfficeActivity,
  OfficeDecision,
  OfficeLink,
  OfficeNote,
  OfficeRisk,
  OfficeTask,
} from "@/lib/office/types";

type Props = {
  tasks: OfficeTask[];
  decisions: OfficeDecision[];
  risks: Pick<OfficeRisk, "id" | "severity" | "status">[];
  notes: OfficeNote[];
  links: OfficeLink[];
  activity: OfficeActivity[];
  editorName: string;
};

export function OverviewBoard({
  tasks: initialTasks,
  decisions,
  risks,
  notes,
  links: initialLinks,
  activity,
  editorName,
}: Props) {
  const tasks = useRows(initialTasks);
  const links = useRows(initialLinks);

  const openTasks = tasks.rows.filter((row) => row.status === "todo" || row.status === "doing");
  const doing = tasks.rows.filter((row) => row.status === "doing").sort((a, b) => a.sort - b.sort);
  const todo = tasks.rows.filter((row) => row.status === "todo").sort((a, b) => a.sort - b.sort);
  const upNext = [...doing, ...todo].slice(0, 5);
  const heldTasks = tasks.rows.filter((row) => row.status === "on_hold");
  const heldDecisions = decisions.filter((row) => row.status === "on_hold");
  const openDecisions = decisions.filter((row) => row.status === "open").length;
  const openRisks = risks.filter((row) => row.status === "open");
  const highRisks = openRisks.filter((row) => row.severity === "high").length;

  function markDone(row: OfficeTask) {
    const next = tasks.rows.map((item) =>
      item.id === row.id
        ? { ...item, status: "done" as const, updated_at: new Date().toISOString(), editor_name: editorName }
        : item,
    );
    return tasks.commit(row.id, next, () => saveOffice("office_tasks", row.id, { status: "done" }));
  }

  async function addLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const label = String(data.get("label") ?? "").trim();
    const url = String(data.get("url") ?? "").trim();
    if (!label || !url) return;
    const sort = links.rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeLink = {
      id,
      sort,
      label,
      url,
      note: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    form.reset();
    await links.commit(id, [...links.rows, created], () =>
      createOffice("office_links", { label, url, sort }),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 desk:grid-cols-3">
        <Link href="/app/office/next-steps" className="rounded-card border border-[#E5E5E5] p-4">
          <Label>Next steps</Label>
          <p className="mt-2 mb-0 text-[28px] font-semibold">{openTasks.length}</p>
        </Link>
        <Link href="/app/office/decisions" className="rounded-card border border-[#E5E5E5] p-4">
          <Label>Open decisions</Label>
          <p className="mt-2 mb-0 text-[28px] font-semibold">{openDecisions}</p>
        </Link>
        <Link href="/app/office/risks" className="rounded-card border border-[#E5E5E5] p-4">
          <Label>Open risks</Label>
          <p className="mt-2 mb-0 text-[28px] font-semibold">{openRisks.length}</p>
          <p className="mt-1 mb-0 font-mono text-[11px] text-[#55555A]">{highRisks} high</p>
        </Link>
      </div>

      <section className="rounded-card border border-[#E5E5E5] border-l-[3px] border-l-[#FFF4C2] p-4">
        <h2 className="m-0 text-[16px] font-semibold">On hold until Brandan is back</h2>
        {heldTasks.length + heldDecisions.length === 0 ? (
          <p className="mt-3 mb-0 text-[14px] text-[#55555A]">Nothing is on hold.</p>
        ) : (
          <ul className="mt-3 mb-0 flex list-none flex-col gap-2 p-0 text-[14px]">
            {heldTasks.map((row) => (
              <li key={row.id}>
                <Link href="/app/office/next-steps" className="hover:underline">
                  {row.title}
                </Link>
              </li>
            ))}
            {heldDecisions.map((row) => (
              <li key={row.id}>
                <Link href="/app/office/decisions" className="hover:underline">
                  {row.question}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[16px] font-semibold">Up next</h2>
        {upNext.length === 0 ? (
          <p className="m-0 text-[14px] text-[#55555A]">Nothing queued.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {upNext.map((row) => (
              <li key={row.id} className="flex items-center gap-3 border-b border-[#E5E5E5] py-2.5">
                <input
                  type="checkbox"
                  aria-label={`Mark ${row.title} done`}
                  onChange={() => markDone(row)}
                />
                <span className="min-w-0 flex-1 text-[14px]">{row.title}</span>
                {row.owner ? (
                  <span className="rounded-control border border-[#E5E5E5] px-1.5 py-0.5 font-mono text-[11px]">
                    {row.owner}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <SaveError id={upNext[0]?.id ?? ""} errors={tasks.errors} />
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[16px] font-semibold">Pinned notes</h2>
        {notes.length === 0 ? (
          <p className="m-0 text-[14px] text-[#55555A]">No pinned notes.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {notes.map((note) => (
              <li key={note.id}>
                <Link href={`/app/office/notes/${note.slug}`} className="text-[14px] font-medium hover:underline">
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 text-[16px] font-semibold">Links</h2>
        {links.rows.length === 0 ? <p className="m-0 text-[14px] text-[#55555A]">No links yet.</p> : null}
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {links.rows.map((link) => (
            <li key={link.id} className="flex flex-col gap-1 border-b border-[#E5E5E5] pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <EditableText
                    value={link.label}
                    onSave={(label) =>
                      links.commit(
                        link.id,
                        links.rows.map((item) => (item.id === link.id ? { ...item, label } : item)),
                        () => saveOffice("office_links", link.id, { label }),
                      )
                    }
                    className="font-medium"
                  />
                  <EditableText
                    value={link.url}
                    onSave={(url) =>
                      links.commit(
                        link.id,
                        links.rows.map((item) => (item.id === link.id ? { ...item, url } : item)),
                        () => saveOffice("office_links", link.id, { url }),
                      )
                    }
                    className="text-[13px] text-[#1F8A4C]"
                  />
                  <EditableText
                    value={link.note ?? ""}
                    placeholder="Add a note"
                    onSave={(note) =>
                      links.commit(
                        link.id,
                        links.rows.map((item) =>
                          item.id === link.id ? { ...item, note: note || null } : item,
                        ),
                        () => saveOffice("office_links", link.id, { note: note || null }),
                      )
                    }
                    className="text-[13px] text-[#55555A]"
                  />
                </div>
                <RowMenu
                  onDelete={() =>
                    links.commit(
                      link.id,
                      links.rows.filter((item) => item.id !== link.id),
                      () => deleteOffice("office_links", link.id),
                    )
                  }
                />
              </div>
              <SaveError id={link.id} errors={links.errors} />
            </li>
          ))}
        </ul>
        <form onSubmit={addLink} className="flex flex-col gap-2 tab:flex-row">
          <input
            name="label"
            required
            placeholder="Label"
            aria-label="Link label"
            className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
          />
          <input
            name="url"
            required
            type="url"
            placeholder="https://"
            aria-label="Link URL"
            className="h-9 min-w-0 flex-[2] rounded-control border border-[#E5E5E5] px-2 text-[14px]"
          />
          <button
            type="submit"
            className="h-9 cursor-pointer rounded-control bg-[#111111] px-3 text-[13px] font-medium text-white"
          >
            Add link
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-[16px] font-semibold">Recent changes</h2>
        {activity.length === 0 ? (
          <p className="m-0 text-[14px] text-[#55555A]">No changes yet.</p>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[14px]">
            {activity.map((item) => (
              <li key={item.id}>
                {item.actor_name} {item.summary}
                <span className="text-[#55555A]">
                  {" "}
                  · <When at={item.created_at} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
