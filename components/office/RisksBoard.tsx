"use client";

import { Fragment, useState } from "react";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import {
  EditedLine,
  EditableText,
  RowMenu,
  SaveError,
  StatusSelect,
  iconButton,
  useRows,
} from "@/components/office/bits";
import { ChoiceMenu } from "@/components/ui/popups";
import type { OfficeRisk } from "@/lib/office/types";
import { OWNERS } from "@/lib/office/types";

const SEVERITY = ["high", "medium", "low"];

function rank(row: OfficeRisk) {
  return row.status === "resolved" ? 1 : 0;
}

export function RisksBoard({
  rows: initial,
  editorName,
}: {
  rows: OfficeRisk[];
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [title, setTitle] = useState("");

  const ordered = rows.slice().sort((a, b) => {
    return (
      rank(a) - rank(b) ||
      SEVERITY.indexOf(a.severity) - SEVERITY.indexOf(b.severity) ||
      a.sort - b.sort
    );
  });

  function save(row: OfficeRisk, patch: Partial<OfficeRisk>) {
    const next = rows.map((item) =>
      item.id === row.id
        ? {
            ...item,
            ...patch,
            updated_at: new Date().toISOString(),
            editor_name: editorName,
          }
        : item,
    );
    return commit(row.id, next, () => saveOffice("office_risks", row.id, patch));
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const sort = rows.reduce((max, row) => Math.max(max, row.sort), 0) + 1;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeRisk = {
      id,
      sort,
      title: nextTitle,
      detail: null,
      severity: "medium",
      status: "open",
      mitigation: null,
      owner: editorName,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setTitle("");
    await commit(id, [...rows, created], () =>
      createOffice("office_risks", {
        title: nextTitle,
        severity: "medium",
        status: "open",
        sort,
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={add}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a risk"
          aria-label="Risk title"
          className="h-9 w-full rounded-control border border-[#E5E5E5] px-2 text-[14px]"
        />
      </form>
      {ordered.length === 0 ? (
        <p className="m-0 text-[14px] text-[#55555A]">No risks yet.</p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#E5E5E5] font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
              <th className="py-2 pr-3 font-normal">Title</th>
              <th className="py-2 pr-3 font-normal">Severity</th>
              <th className="py-2 pr-3 font-normal">Status</th>
              <th className="py-2 pr-3 font-normal">Owner</th>
              <th className="py-2 pr-3 font-normal">Mitigation</th>
              <th className="py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {ordered.map((row) => (
              <Fragment key={row.id}>
                <tr className={row.status === "resolved" ? "text-[#55555A]" : ""}>
                  <td className="border-b border-[#E5E5E5] py-3 pr-3 align-top">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        aria-label={open[row.id] ? "Hide detail" : "Show detail"}
                        onClick={() =>
                          setOpen((current) => ({
                            ...current,
                            [row.id]: !current[row.id],
                          }))
                        }
                        className={iconButton}
                      >
                        {open[row.id] ? "▾" : "▸"}
                      </button>
                      <EditableText
                        value={row.title}
                        onSave={(next) => save(row, { title: next })}
                      />
                    </div>
                  </td>
                  <td className="border-b border-[#E5E5E5] py-3 pr-3 align-top">
                    <StatusSelect
                      value={row.severity}
                      options={SEVERITY}
                      onChange={(severity) =>
                        save(row, { severity: severity as OfficeRisk["severity"] })
                      }
                    />
                  </td>
                  <td className="border-b border-[#E5E5E5] py-3 pr-3 align-top">
                    <StatusSelect
                      value={row.status}
                      options={["open", "watching", "resolved"]}
                      onChange={(status) =>
                        save(row, { status: status as OfficeRisk["status"] })
                      }
                    />
                  </td>
                  <td className="border-b border-[#E5E5E5] py-3 pr-3 align-top">
                    <ChoiceMenu
                      label="Owner"
                      value={row.owner ?? ""}
                      onChange={(owner) => save(row, { owner: owner || null })}
                      placeholder="None"
                      options={[
                        { value: "", label: "None" },
                        ...OWNERS.map((name) => ({ value: name, label: name })),
                      ]}
                      className="rounded-control border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[11px]"
                    />
                  </td>
                  <td className="border-b border-[#E5E5E5] py-3 pr-3 align-top">
                    <EditableText
                      multiline
                      value={row.mitigation ?? ""}
                      placeholder="Add mitigation"
                      onSave={(mitigation) =>
                        save(row, { mitigation: mitigation || null })
                      }
                    />
                  </td>
                  <td className="border-b border-[#E5E5E5] py-3 align-top">
                    <RowMenu
                      onDelete={() =>
                        commit(
                          row.id,
                          rows.filter((item) => item.id !== row.id),
                          () => deleteOffice("office_risks", row.id),
                        )
                      }
                    />
                  </td>
                </tr>
                {open[row.id] ? (
                  <tr className={row.status === "resolved" ? "text-[#55555A]" : ""}>
                    <td colSpan={6} className="border-b border-[#E5E5E5] py-3">
                      <div className="flex flex-col gap-2 pl-6">
                        <EditableText
                          multiline
                          value={row.detail ?? ""}
                          placeholder="Add detail"
                          onSave={(detail) => save(row, { detail: detail || null })}
                        />
                        <EditedLine name={row.editor_name} at={row.updated_at} />
                        <SaveError id={row.id} errors={errors} />
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
