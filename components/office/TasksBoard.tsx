"use client";

import { useState } from "react";

import {
  createOffice,
  deleteOffice,
  saveOffice,
  swapTaskSort,
} from "@/app/(app)/app/office/actions";
import {
  EditedLine,
  EditableText,
  RowMenu,
  SaveError,
  StatusSelect,
  iconButton,
  quietButton,
  useRows,
} from "@/components/office/bits";
import { ChoiceMenu, DateField } from "@/components/ui/popups";
import type { OfficeTask, Owner } from "@/lib/office/types";
import { OWNERS } from "@/lib/office/types";

const GROUPS = [
  { status: "doing", label: "Doing" },
  { status: "todo", label: "To do" },
  { status: "on_hold", label: "On hold" },
  { status: "done", label: "Done" },
] as const;

const FILTERS = [
  { id: "everyone", label: "All" },
  { id: "Joel", label: "Joel" },
  { id: "Matas", label: "Matas" },
  { id: "Brandan", label: "Brandan" },
] as const;

export function TasksBoard({
  rows: initial,
  editorName,
}: {
  rows: OfficeTask[];
  editorName: string;
}) {
  const { rows, errors, commit } = useRows(initial);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("everyone");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [doneOpen, setDoneOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState<Owner>(
    OWNERS.includes(editorName as Owner) ? (editorName as Owner) : "Joel",
  );

  function stamp(row: OfficeTask, patch: Partial<OfficeTask>): OfficeTask {
    return {
      ...row,
      ...patch,
      updated_at: new Date().toISOString(),
      editor_name: editorName,
    };
  }

  function save(row: OfficeTask, patch: Partial<OfficeTask>) {
    const next = rows.map((item) => (item.id === row.id ? stamp(row, patch) : item));
    return commit(row.id, next, () => saveOffice("office_tasks", row.id, patch));
  }

  function move(row: OfficeTask, direction: -1 | 1, group: OfficeTask[]) {
    const index = group.findIndex((item) => item.id === row.id);
    const neighbor = group[index + direction];
    if (!neighbor) return;
    const next = rows.map((item) => {
      if (item.id === row.id) return stamp(item, { sort: neighbor.sort });
      if (item.id === neighbor.id) return stamp(item, { sort: row.sort });
      return item;
    });
    return commit(row.id, next, () => swapTaskSort(row.id, neighbor.id));
  }

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    const todos = rows.filter((row) => row.status === "todo");
    const sort = todos.length ? Math.min(...todos.map((row) => row.sort)) - 1 : 0;
    const id = `new-${crypto.randomUUID()}`;
    const created: OfficeTask = {
      id,
      sort,
      title: nextTitle,
      detail: null,
      status: "todo",
      owner,
      due_on: null,
      updated_at: new Date().toISOString(),
      updated_by: null,
      editor_name: editorName,
    };
    setTitle("");
    await commit(id, [created, ...rows], () =>
      createOffice("office_tasks", { title: nextTitle, owner, status: "todo", sort }),
    );
  }

  const visible = rows.filter((row) => filter === "everyone" || row.owner === filter);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={`shrink-0 cursor-pointer rounded-control px-2.5 py-1 text-[13px] font-medium ${
              filter === chip.id
                ? "bg-[#111111] text-white"
                : "border border-[#E5E5E5] text-[#55555A]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="m-0 text-[14px] text-[#55555A]">No steps yet.</p>
      ) : null}

      {GROUPS.map((group) => {
        const items = visible
          .filter((row) => row.status === group.status)
          .sort((a, b) => a.sort - b.sort);
        if (group.status !== "todo" && items.length === 0) return null;
        const collapsed = group.status === "done" && !doneOpen;
        return (
          <section key={group.status} className="flex flex-col gap-1">
            {group.status === "done" ? (
              <button
                type="button"
                onClick={() => setDoneOpen((value) => !value)}
                className="m-0 cursor-pointer text-left font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase"
              >
                {doneOpen ? "Hide" : "Show"} done · {items.length}
              </button>
            ) : (
              <p className="m-0 font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
                {group.label}
              </p>
            )}
            {group.status === "todo" ? (
              <form onSubmit={add} className="flex flex-col gap-2 py-2 tab:flex-row">
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Add a step"
                  aria-label="Step title"
                  className="h-9 min-w-0 flex-1 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
                />
                <ChoiceMenu
                  label="Owner"
                  value={owner}
                  onChange={(next) => setOwner(next as Owner)}
                  options={OWNERS.map((name) => ({ value: name, label: name }))}
                  className="h-9 rounded-control border border-[#E5E5E5] bg-white px-2 text-[13px]"
                />
                <button type="submit" className={quietButton}>
                  Add step
                </button>
              </form>
            ) : null}
            {collapsed
              ? null
              : items.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex items-start gap-2 border-b border-[#E5E5E5] py-3"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={row.status === "done"}
                      aria-label={`Mark ${row.title} done`}
                      onChange={() =>
                        save(row, { status: row.status === "done" ? "todo" : "done" })
                      }
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="min-w-[12rem] flex-1">
                          <EditableText
                            value={row.title}
                            onSave={(next) => save(row, { title: next })}
                            className="font-medium"
                          />
                        </div>
                        <ChoiceMenu
                          label="Owner"
                          value={row.owner ?? "All"}
                          onChange={(next) => save(row, { owner: next as Owner })}
                          options={OWNERS.map((name) => ({ value: name, label: name }))}
                          className="rounded-control border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[11px]"
                        />
                        <StatusSelect
                          value={row.status}
                          options={["doing", "todo", "on_hold", "done"]}
                          onChange={(status) =>
                            save(row, { status: status as OfficeTask["status"] })
                          }
                        />
                        <DateField
                          label="Due date"
                          value={row.due_on}
                          onChange={(due_on) => save(row, { due_on })}
                        />
                      </div>
                      {open[row.id] ? (
                        <EditableText
                          multiline
                          value={row.detail ?? ""}
                          placeholder="Add detail"
                          onSave={(detail) => save(row, { detail: detail || null })}
                          className="text-[14px] text-[#55555A]"
                        />
                      ) : null}
                      <EditedLine name={row.editor_name} at={row.updated_at} />
                      <SaveError id={row.id} errors={errors} />
                    </div>
                    <button
                      type="button"
                      aria-label={open[row.id] ? "Hide detail" : "Show detail"}
                      onClick={() =>
                        setOpen((current) => ({ ...current, [row.id]: !current[row.id] }))
                      }
                      className={iconButton}
                    >
                      {open[row.id] ? "▾" : "▸"}
                    </button>
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => move(row, -1, items)}
                      className={iconButton}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={index === items.length - 1}
                      onClick={() => move(row, 1, items)}
                      className={iconButton}
                    >
                      ↓
                    </button>
                    <RowMenu
                      onDelete={() =>
                        commit(
                          row.id,
                          rows.filter((item) => item.id !== row.id),
                          () => deleteOffice("office_tasks", row.id),
                        )
                      }
                    />
                  </div>
                ))}
          </section>
        );
      })}
    </div>
  );
}
