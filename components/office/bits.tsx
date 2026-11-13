"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ChoiceMenu } from "@/components/ui/popups";
import { relativeTime, STATUS_LABEL } from "@/lib/office/format";

const field =
  "w-full rounded-control border border-[#E5E5E5] bg-white px-2 py-1.5 text-[14px] font-normal text-[#111111] outline-none";

export const addButton =
  "h-9 cursor-pointer rounded-control bg-[#111111] px-3 text-[13px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60";

export const quietButton =
  "h-9 cursor-pointer rounded-control border border-[#E5E5E5] bg-white px-3 text-[13px] font-medium text-[#111111] hover:bg-[#F4F4F2] disabled:opacity-60";

export const iconButton =
  "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-control border border-[#E5E5E5] bg-white text-[13px] leading-none text-[#55555A] hover:bg-[#F4F4F2] disabled:cursor-default disabled:opacity-30";

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

export function SaveError({
  id,
  errors,
}: {
  id: string;
  errors: Record<string, string>;
}) {
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
    <ChoiceMenu
      label="Status"
      value={value}
      options={options.map((option) => ({
        value: option,
        label: STATUS_LABEL[option] ?? option,
      }))}
      onChange={onChange}
      className={`rounded-control py-[5px] pr-2.5 pl-2.5 font-mono text-[11px] leading-none ${STATUS_CLASS[value] ?? ""}`}
      renderOption={(option) => (
        <span
          className={`rounded-control px-1.5 py-0.5 font-mono text-[11px] ${STATUS_CLASS[option.value] ?? ""}`}
        >
          {option.label}
        </span>
      )}
    />
  );
}

export function Pill({ value }: { value: string }) {
  return (
    <span
      className={`rounded-control px-1.5 py-0.5 font-mono text-[11px] ${STATUS_CLASS[value] ?? ""}`}
    >
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
        {value ? (
          value
        ) : (
          <span className="font-normal text-[#55555A]">{placeholder}</span>
        )}
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

type MenuBox = { top: number; left: number; width: number; upward: boolean };

function menuBox(button: HTMLButtonElement, confirming: boolean): MenuBox {
  const rect = button.getBoundingClientRect();
  const width = confirming ? 208 : 132;
  const height = confirming ? 96 : 40;
  const upward = rect.bottom + 8 + height > window.innerHeight && rect.top > height + 8;
  const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
  return {
    top: upward ? rect.top - 6 : rect.bottom + 6,
    left,
    width,
    upward,
  };
}

export function RowMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [box, setBox] = useState<MenuBox | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setConfirm(false);
    setBox(null);
  }, []);

  function toggle() {
    if (open) {
      close();
      return;
    }
    if (buttonRef.current) setBox(menuBox(buttonRef.current, false));
    setConfirm(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function place() {
      if (buttonRef.current) setBox(menuBox(buttonRef.current, confirm));
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target))
        return;
      close();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [close, confirm, open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="More"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={toggle}
        className={`${iconButton} ${open ? "border-[#111111] text-[#111111]" : ""}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="3" cy="7" r="1.15" fill="currentColor" />
          <circle cx="7" cy="7" r="1.15" fill="currentColor" />
          <circle cx="11" cy="7" r="1.15" fill="currentColor" />
        </svg>
      </button>
      {open && box
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{
                position: "fixed",
                top: box.top,
                left: box.left,
                width: box.width,
                transform: box.upward ? "translateY(-100%)" : undefined,
              }}
              className="z-50 rounded-control border border-[#E5E5E5] bg-white p-1 shadow-[0_8px_24px_rgba(17,17,17,0.08)]"
            >
              {confirm ? (
                <div className="flex flex-col gap-2 p-1.5">
                  <p className="m-0 text-[12px] text-[#55555A]">Delete this?</p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      autoFocus
                      className="h-8 flex-1 cursor-pointer rounded-control bg-[#111111] text-[12px] font-medium text-white"
                      onClick={onDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="h-8 flex-1 cursor-pointer rounded-control border border-[#E5E5E5] bg-white text-[12px] font-medium text-[#111111] hover:bg-[#F4F4F2]"
                      onClick={() => {
                        setConfirm(false);
                        if (buttonRef.current) setBox(menuBox(buttonRef.current, false));
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  autoFocus
                  className="w-full cursor-pointer rounded-[3px] px-2 py-1.5 text-left text-[13px] font-medium hover:bg-[#F4F4F2]"
                  onClick={() => {
                    setConfirm(true);
                    if (buttonRef.current) setBox(menuBox(buttonRef.current, true));
                  }}
                >
                  Delete
                </button>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
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

  async function commit(
    id: string,
    next: T[],
    run: () => Promise<{ error: string | null }>,
  ) {
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
