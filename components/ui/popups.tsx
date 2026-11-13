"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Anchor = {
  top: number;
  left: number;
  width: number;
  upward: boolean;
  maxHeight: number;
};

function readAnchor(
  button: HTMLElement,
  minWidth: number,
  estimatedHeight: number,
): Anchor {
  const rect = button.getBoundingClientRect();
  const width = Math.min(Math.max(rect.width, minWidth), window.innerWidth - 16);
  const roomBelow = window.innerHeight - rect.bottom;
  const upward = roomBelow < estimatedHeight && rect.top > roomBelow;
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - 8 - width);
  const space = (upward ? rect.top : roomBelow) - 16;
  return {
    top: upward ? rect.top - 6 : rect.bottom + 6,
    left,
    width,
    upward,
    maxHeight: Math.max(140, Math.min(320, space)),
  };
}

function useAnchoredMenu(minWidth: number, estimatedHeight: number) {
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<Anchor | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setBox(null);
  }, []);

  const openMenu = useCallback(() => {
    if (buttonRef.current)
      setBox(readAnchor(buttonRef.current, minWidth, estimatedHeight));
    setOpen(true);
  }, [estimatedHeight, minWidth]);

  useEffect(() => {
    if (!open) return;
    function place() {
      if (buttonRef.current)
        setBox(readAnchor(buttonRef.current, minWidth, estimatedHeight));
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target))
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
  }, [close, estimatedHeight, minWidth, open]);

  return { open, box, buttonRef, panelRef, openMenu, close };
}

function Chevron({
  direction,
  size = 10,
}: {
  direction: "down" | "left" | "right";
  size?: number;
}) {
  const rotate = direction === "left" ? 90 : direction === "right" ? -90 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      aria-hidden="true"
      className="shrink-0"
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <path
        d="M2 3.5 5 6.5 8 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const panelClass =
  "z-50 rounded-card border border-[#E5E5E5] bg-white p-1 shadow-[0_8px_24px_rgba(17,17,17,0.08)]";

export type MenuOption = { value: string; label: string };

export function ChoiceMenu({
  label,
  value,
  options,
  onChange,
  className = "",
  placeholder = "Select",
  full = false,
  name,
  renderOption,
}: {
  label: string;
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  full?: boolean;
  name?: string;
  renderOption?: (option: MenuOption) => React.ReactNode;
}) {
  const listId = useId();
  const { open, box, buttonRef, panelRef, openMenu, close } = useAnchoredMenu(168, 220);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const current = options.find((option) => option.value === value);

  function choose(next: string) {
    onChange(next);
    close();
    buttonRef.current?.focus();
  }

  return (
    <>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          setActive(selectedIndex);
          openMenu();
        }}
        className={`inline-flex cursor-pointer items-center ${full ? "w-full justify-between" : "gap-3.5"} ${className}`}
      >
        <span className={current ? "" : "text-[#8A8A8E]"}>
          {current?.label || placeholder}
        </span>
        <Chevron direction="down" size={8} />
      </button>
      {open && box
        ? createPortal(
            <div
              ref={panelRef}
              id={listId}
              role="listbox"
              aria-label={label}
              tabIndex={-1}
              autoFocus
              onKeyDown={(event) => {
                function move(next: number) {
                  setActive(next);
                  const item =
                    panelRef.current?.querySelectorAll<HTMLButtonElement>(
                      '[role="option"]',
                    )[next];
                  item?.scrollIntoView({ block: "nearest" });
                }
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  move(Math.min(options.length - 1, active + 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  move(Math.max(0, active - 1));
                }
                if (event.key === "Enter") {
                  event.preventDefault();
                  const option = options[active];
                  if (option) choose(option.value);
                }
              }}
              style={{
                position: "fixed",
                top: box.top,
                left: box.left,
                width: box.width,
                maxHeight: box.maxHeight,
                transform: box.upward ? "translateY(-100%)" : undefined,
              }}
              className={`${panelClass} overflow-y-auto`}
            >
              {options.map((option, index) => {
                const selected = option.value === value;
                return (
                  <button
                    key={option.value || "empty"}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option.value)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-2 py-1.5 text-left text-[13px] ${
                      index === active ? "bg-[#F4F6F2]" : "hover:bg-[#F7F7F5]"
                    }`}
                  >
                    {renderOption ? renderOption(option) : option.label}
                    {selected ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path
                          d="M2 6.2 4.6 8.8 10 3.2"
                          fill="none"
                          stroke="#1F8A4C"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span className="size-3 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseISODate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function toISODate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function CalendarPanel({
  label,
  value,
  cursor,
  box,
  panelRef,
  onShift,
  onPick,
}: {
  label: string;
  value: string | null;
  cursor: { year: number; month: number };
  box: Anchor;
  panelRef: React.RefObject<HTMLDivElement | null>;
  onShift: (amount: number) => void;
  onPick: (next: string | null) => void;
}) {
  const today = toISODate(new Date());
  const days = monthDays(cursor.year, cursor.month);
  const heading = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      style={{
        position: "fixed",
        top: box.top,
        left: box.left,
        width: Math.max(box.width, 280),
        transform: box.upward ? "translateY(-100%)" : undefined,
      }}
      className={`${panelClass} p-3`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onShift(-1)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-control border border-[#E5E5E5] bg-white hover:bg-[#F4F4F2]"
        >
          <Chevron direction="left" />
        </button>
        <p className="m-0 text-[13px] font-medium">{heading}</p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onShift(1)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-control border border-[#E5E5E5] bg-white hover:bg-[#F4F4F2]"
        >
          <Chevron direction="right" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="py-1 font-mono text-[10px] tracking-[0.04em] text-[#8A8A8E] uppercase"
          >
            {day}
          </span>
        ))}
        {days.map((day) => {
          const iso = toISODate(day);
          const inMonth = day.getMonth() === cursor.month;
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onPick(iso)}
              className={`h-8 cursor-pointer rounded-control text-[13px] ${
                selected
                  ? "bg-[#111111] font-medium text-white"
                  : iso === today
                    ? "border border-[#1F8A4C] text-[#111111] hover:bg-[#F4F6F2]"
                    : inMonth
                      ? "text-[#111111] hover:bg-[#F4F6F2]"
                      : "text-[#8A8A8E] hover:bg-[#F7F7F5]"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-[#E5E5E5] pt-2">
        <button
          type="button"
          onClick={() => onPick(today)}
          className="cursor-pointer text-[13px] font-medium text-[#1F8A4C]"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onPick(null)}
          className="cursor-pointer text-[13px] font-medium text-[#55555A] disabled:opacity-40"
          disabled={!value}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function DateField({
  label,
  value,
  onChange,
  className = "rounded-control border border-[#E5E5E5] bg-white px-1.5 py-0.5 font-mono text-[11px] text-[#55555A]",
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}) {
  const { open, box, buttonRef, panelRef, openMenu, close } = useAnchoredMenu(280, 320);
  const [cursor, setCursor] = useState({ year: 2026, month: 0 });

  function pick(next: string | null) {
    onChange(next);
    close();
    buttonRef.current?.focus();
  }

  function shift(amount: number) {
    const next = new Date(cursor.year, cursor.month + amount, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  }

  const shown = value
    ? parseISODate(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Add date";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          const base = value ? parseISODate(value) : new Date();
          setCursor({ year: base.getFullYear(), month: base.getMonth() });
          openMenu();
        }}
        className={`inline-flex cursor-pointer items-center gap-3.5 ${className}`}
      >
        <span className={value ? "" : "text-[#8A8A8E]"}>{shown}</span>
        <Chevron direction="down" size={8} />
      </button>
      {open && box
        ? createPortal(
            <CalendarPanel
              label={label}
              value={value}
              cursor={cursor}
              box={box}
              panelRef={panelRef}
              onShift={shift}
              onPick={pick}
            />,
            document.body,
          )
        : null}
    </>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancelRef.current();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#111111]/40 p-4 tab:items-center">
      <div className="absolute inset-0" onClick={onCancel} />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative z-10 w-full max-w-[400px] rounded-card border border-[#E5E5E5] bg-white p-5"
      >
        <h2
          id="confirm-title"
          className="m-0 text-[18px] font-semibold tracking-[-0.02em]"
        >
          {title}
        </h2>
        {body ? (
          <p className="mt-2 m-0 text-[14px] leading-normal text-[#55555A]">{body}</p>
        ) : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 cursor-pointer rounded-control border border-[#E5E5E5] bg-white px-4 text-[14px] font-medium hover:bg-[#F4F4F2]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className="h-10 cursor-pointer rounded-control bg-[#111111] px-4 text-[14px] font-medium text-white hover:bg-[#2a2a2a]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
