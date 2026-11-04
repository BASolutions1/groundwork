type Props = {
  fill: "empty" | "partial" | "complete";
  active?: boolean;
  className?: string;
};

/** Flat front-view block, same proportions language as the stack. */
export function StageBlockIcon({ fill, active = false, className = "" }: Props) {
  const body =
    fill === "complete" ? "#1F8A4C" : fill === "partial" ? "#9FD9B5" : "#FFFFFF";
  const edge = active ? "#111111" : fill === "empty" ? "#C9C9C6" : "#1F8A4C";

  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      className={className}
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="14"
        rx="2"
        fill={body}
        stroke={edge}
        strokeWidth="1.5"
      />
      {fill === "partial" ? (
        <rect x="1.75" y="8" width="14.5" height="6.25" rx="1" fill="#1F8A4C" />
      ) : null}
    </svg>
  );
}
