"use client";

import { useEffect, useRef, useState } from "react";

import { relativeTime, STATUS_LABEL } from "@/lib/office/format";

const field =
  "w-full rounded-control border border-[#E5E5E5] bg-white px-2 py-1.5 text-[14px] font-normal text-[#111111] outline-none";

export const addButton =
  "h-9 cursor-pointer rounded-control bg-[#111111] px-3 text-[13px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60";

export const quietButton =
  "h-9 cursor-pointer rounded-control border border-[#E5E5E5] bg-white px-3 text-[13px] font-medium text-[#111111] hover:bg-[#F4F4F2] disabled:opacity-60";

const STATUS_CLASS: Record<string, string> = {
  todo: "border border-[#E5E5E5] bg-white text-[#111111]",
  open: "border border-[#E5E5E5] bg-white text-[#111111]",
  low: "border border-[#E5E5E5] bg-white text-[#111111]",
  doing: "border border-transparent bg-[#E7F2EA] text-[#0E3D22]",
  watching: "border border-transparent bg-[#E7F2EA] text-[#0E3D22]",
  done: "border border-transparent bg-[#1F8A4C] text-white",
  decided: "border border-transparent bg-[#1F8A4C] text-white",
  resolved: "border border-transparent bg-[#1F8A4C] text-white",
  on_hold: "border border-transparent bg-[#FFF4C2] text-[#111111]",
  medium: "border border-transparent bg-[#E5E5E5] text-[#111111]",
  high: "border border-transparent bg-[#111111] text-white",
};

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
      {children}
    </p>
  );
}

export function SaveError({ id, errors }: { id: string; errors: Record<string, string> }) {
  if (!errors[id]) return null;
  return <p className="m-0 text-[13px] text-red-700">Could not save. Try again.</p>;
}

export function EditedLine({ name, at }: { name: string | null; at: string | null }) {
  const [when, setWhen] = useState("");

  useEffect(() => {
    if (at) setWhen(relativeTime(at));
  }, [at]);

  if (!name || !at) return null;
  return (
    <p className="m-0 font-mono text-[11px] text-[#55555A]">
      Edited by {name}
      {when ? ` · ${when}` : ""}
    </p>
  );
}

export function When({ at }: { at: string }) {
  const [when, setWhen] = useState("");
  useEffect(() => setWhen(relativeTime(at)), [at]);
  return <>{when}</>;
}

export function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label="Status"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`cursor-pointer rounded-control px-1.5 py-0.5 font-mono text-[11px] ${STATUS_CLASS[value] ?? ""}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {STATUS_LABEL[option] ?? option}
        </option>
      ))}
    </select>
  );
}

export function Pill({ value }: { value: string }) {
  return (
    <span className={`rounded-control px-1.5 py-0.5 font-mono text-[11px] ${STATUS_CLASS[value] ?? ""}`}>
      {STATUS_LABEL[value] ?? value}
    </span>
  );
}

export function EditableText({
  value,
  onSave,
  multiline = false,
  placeholder = "Add",
  className = "",
  inputClassName = field,
}: {
  value: string;
  onSave: (next: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const skip = useRef(false);
  const lock = useRef(false);

  useEffect(() => setDraft(value), [value]);

  function commit() {
    if (lock.current || skip.current) {
      skip.current = false;
      return;
    }
    lock.current = true;
    const next = draft;
    setEditing(false);
    if (next !== value) onSave(next);
    lock.current = false;
  }

  function cancel() {
    skip.current = true;
    setDraft(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className={`block w-full cursor-text text-left whitespace-pre-wrap ${className}`}
      >
        {value ? value : <span className="font-normal text-[#55555A]">{placeholder}</span>}
      </button>
    );
  }

  if (multiline) {
    return (
      <textarea
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Escape") cancel();
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            commit();
          }
        }}
        className={inputClassName}
      />
    );
  }

  return (
    <input
      autoFocus
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Escape") cancel();
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
      }}
      className={inputClassName}
    />
  );
}

export function RowMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (confirm) {
    return (
      <span className="inline-flex items-center gap-2 text-[12px]">
        <span className="text-[#55555A]">Delete this?</span>
        <button type="button" className="cursor-pointer font-medium" onClick={onDelete}>
          Delete
        </button>
        <button
          type="button"
          className="cursor-pointer text-[#55555A]"
          onClick={() => {
            setConfirm(false);
            setOpen(false);
          }}
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <button
        type="button"
        aria-label="More"
        onClick={() => setOpen((value) => !value)}
        className="cursor-pointer px-1.5 text-[16px] leading-none text-[#55555A]"
      >
        ...
      </button>
      {open ? (
        <button
          type="button"
          className="cursor-pointer text-[12px] font-medium"
          onClick={() => setConfirm(true)}
        >
          Delete
        </button>
      ) : null}
    </span>
  );
}

export function useRows<T extends { id: string }>(initial: T[]) {
  const [rows, setRows] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ref = useRef(initial);

  useEffect(() => {
    ref.current = initial;
    setRows(initial);
  }, [initial]);

  function replace(next: T[]) {
    ref.current = next;
    setRows(next);
  }

  async function commit(id: string, next: T[], run: () => Promise<{ error: string | null }>) {
    const previous = ref.current;
    replace(next);
    setErrors((current) => ({ ...current, [id]: "" }));
    try {
      const result = await run();
      if (result.error) throw new Error(result.error);
    } catch {
      replace(previous);
      setErrors((current) => ({ ...current, [id]: "Could not save. Try again." }));
    }
  }

  return { rows, errors, commit };
}
