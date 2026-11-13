"use client";

type Props = {
  items: string[];
  checked: number[];
  disabled?: boolean;
  onToggle: (index: number, checked: boolean) => void;
};

export function StepChecklist({ items, checked, disabled, onToggle }: Props) {
  const done = new Set(checked);

  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
      {items.map((item, index) => {
        const on = done.has(index);
        return (
          <li key={`${index}-${item}`}>
            <button
              type="button"
              role="checkbox"
              aria-checked={on}
              disabled={disabled}
              onClick={() => onToggle(index, !on)}
              className="flex w-full cursor-pointer items-start gap-2.5 text-left disabled:cursor-wait"
            >
              <span
                className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border ${
                  on ? "border-done bg-done text-white" : "border-[#C9C9C6] bg-white"
                }`}
              >
                {on ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span
                className={`text-[14px] leading-normal ${on ? "text-muted line-through" : "text-secondary"}`}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
