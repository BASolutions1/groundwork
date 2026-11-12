"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createOffice, deleteOffice, saveOffice } from "@/app/(app)/app/office/actions";
import { EditableText, EditedLine, RowMenu, SaveError, useRows } from "@/components/office/bits";
import type { OfficeNote } from "@/lib/office/types";

export function NotesBoard({ rows: initial }: { rows: OfficeNote[] }) {
  const router = useRouter();
  const { rows, errors, commit } = useRows(initial);
  const [title, setTitle] = useState("");
  const [asking, setAsking] = useState(false);
  const [formError, setFormError] = useState("");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;
    setFormError("");
    const result = await createOffice("office_notes", { title: nextTitle, body: "", pinned: false });
    if (result.error || !result.slug) {
      setFormError("Could not save. Try again.");
      return;
    }
    router.push(`/app/office/notes/${result.slug}`);
  }

  return (
    <div className="flex flex-col gap-4">
      {asking ? (
        <form onSubmit={add} className="flex flex-col gap-2">
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
            aria-label="Note title"
            className="h-9 rounded-control border border-[#E5E5E5] px-2 text-[14px]"
          />
          {formError ? <p className="m-0 text-[13px] text-red-700">{formError}</p> : null}
        </form>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setAsking(true)}
            className="h-9 cursor-pointer rounded-control bg-[#111111] px-3 text-[13px] font-medium text-white"
          >
            New note
          </button>
        </div>
      )}
      {rows.length === 0 ? <p className="m-0 text-[14px] text-[#55555A]">No notes yet.</p> : null}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows
          .slice()
          .sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.sort - b.sort)
          .map((note) => (
          <li key={note.id} className="rounded-card border border-[#E5E5E5] p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/app/office/notes/${note.slug}`} className="font-medium hover:underline">
                {note.title}
              </Link>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 font-mono text-[11px] text-[#55555A]">
                  <input
                    type="checkbox"
                    checked={note.pinned}
                    onChange={(event) =>
                      commit(
                        note.id,
                        rows.map((item) =>
                          item.id === note.id ? { ...item, pinned: event.target.checked } : item,
                        ),
                        () => saveOffice("office_notes", note.id, { pinned: event.target.checked }),
                      )
                    }
                  />
                  Pinned
                </label>
                <RowMenu
                  onDelete={() =>
                    commit(
                      note.id,
                      rows.filter((item) => item.id !== note.id),
                      () => deleteOffice("office_notes", note.id),
                    )
                  }
                />
              </div>
            </div>
            <EditedLine name={note.editor_name} at={note.updated_at} />
            <SaveError id={note.id} errors={errors} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NoteEditor({ note, editorName }: { note: OfficeNote; editorName: string }) {
  const { rows, errors, commit } = useRows([note]);
  const current = rows[0] ?? note;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current.body);
  const skip = useRef(false);

  function save(patch: Partial<OfficeNote>) {
    return commit(
      current.id,
      [{ ...current, ...patch, updated_at: new Date().toISOString(), editor_name: editorName }],
      () => saveOffice("office_notes", current.id, patch),
    );
  }

  function commitBody() {
    if (skip.current) {
      skip.current = false;
      return;
    }
    setEditing(false);
    if (draft !== current.body) void save({ body: draft });
  }

  return (
    <article className="flex flex-col gap-4">
      <EditableText
        value={current.title}
        onSave={(title) => save({ title })}
        className="text-[28px] font-semibold"
      />
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          aria-label="Note"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitBody}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              skip.current = true;
              setDraft(current.body);
              setEditing(false);
            }
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
          className="min-h-[320px] w-full rounded-control border border-[#E5E5E5] p-3 font-mono text-[13px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setDraft(current.body);
            setEditing(true);
          }}
          className="cursor-text text-left text-[15px] whitespace-pre-wrap"
        >
          {current.body || <span className="text-[#55555A]">Write the note</span>}
        </button>
      )}
      <div>
        <button
          type="button"
          onClick={() => {
            setDraft(current.body);
            setEditing(true);
          }}
          className="h-9 cursor-pointer rounded-control border border-[#E5E5E5] bg-white px-3 text-[13px] font-medium"
        >
          Edit
        </button>
      </div>
      <EditedLine name={current.editor_name} at={current.updated_at} />
      <SaveError id={current.id} errors={errors} />
    </article>
  );
}
