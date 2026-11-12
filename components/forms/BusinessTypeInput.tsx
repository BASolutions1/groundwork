"use client";

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { businessTypesStartingWith } from "@/lib/business-types";

type Props = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  "aria-label"?: string;
};

export function BusinessTypeInput({
  id,
  name,
  value,
  defaultValue = "",
  onChange,
  placeholder,
  required,
  className = "",
  wrapperClassName = "",
  "aria-label": ariaLabel,
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-options`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuBox, setMenuBox] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    upward: boolean;
  } | null>(null);

  const text = value ?? internal;
  const matches = businessTypesStartingWith(text);
  const showList = open && matches.length > 0;
  const activeId = showList ? `${listId}-${activeIndex}` : undefined;

  useLayoutEffect(() => {
    if (!showList) return;
    const input = inputRef.current;
    if (!input) return;

    function place() {
      const field = inputRef.current;
      if (!field) return;
      const rect = field.getBoundingClientRect();
      const roomBelow = window.innerHeight - rect.bottom;
      const roomAbove = rect.top;
      const upward = roomBelow < 160 && roomAbove > roomBelow;
      const maxHeight = Math.min(208, Math.max(96, (upward ? roomAbove : roomBelow) - 12));
      const width = Math.max(rect.width, Math.min(260, window.innerWidth - 16));
      const left = Math.min(rect.left, Math.max(8, window.innerWidth - 8 - width));
      setMenuBox({
        top: upward ? rect.top - 4 : rect.bottom + 4,
        left,
        width,
        maxHeight,
        upward,
      });
    }

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [showList, text]);

  function setText(next: string) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function choose(option: string) {
    setText(option);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!matches.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (open ? (index + 1) % matches.length : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        open ? (index - 1 + matches.length) % matches.length : matches.length - 1,
      );
      return;
    }

    if (event.key === "Enter" && open) {
      event.preventDefault();
      const option = matches[activeIndex] ?? matches[0];
      if (option) choose(option);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${wrapperClassName}`}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="text"
        required={required}
        role="combobox"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={activeId}
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          setActiveIndex(0);
          setOpen(businessTypesStartingWith(next).length > 0);
        }}
        onKeyDown={onKeyDown}
        className={className}
      />
      {showList && menuBox
        ? createPortal(
            <ul
              id={listId}
              role="listbox"
              style={{
                position: "fixed",
                top: menuBox.top,
                left: menuBox.left,
                width: menuBox.width,
                maxHeight: menuBox.maxHeight,
                transform: menuBox.upward ? "translateY(-100%)" : undefined,
              }}
              className="z-50 m-0 list-none overflow-y-auto rounded-control border border-[#D6D6D3] bg-white p-1 shadow-[0_8px_24px_rgba(17,17,17,0.08)]"
            >
              {matches.map((option, index) => {
                const selected = index === activeIndex;
                return (
                  <li key={option} role="presentation">
                    <button
                      id={`${listId}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => choose(option)}
                      className={`w-full cursor-pointer rounded-[3px] px-3 py-2 text-left text-[15px] font-normal ${
                        selected ? "bg-[#F4F6F2] text-ink" : "text-ink hover:bg-[#F7F7F5]"
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
