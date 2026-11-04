import type { StagePartIcon } from "@/lib/stages/types";

const common = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

export function StagePartIconView({ name }: { name: StagePartIcon }) {
  switch (name) {
    case "structure":
      return (
        <svg {...common}>
          <path d="M4 20V10l8-6 8 6v10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "name":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h10M4 17h7" />
        </svg>
      );
    case "number":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      );
    case "tax":
      return (
        <svg {...common}>
          <path d="M12 3v18M7 8h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
        </svg>
      );
    case "bank":
      return (
        <svg {...common}>
          <path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M4 18h16M12 4 3 10h18L12 4Z" />
        </svg>
      );
    case "books":
      return (
        <svg {...common}>
          <path d="M4 5h7v14H4zM13 5h7v14h-7z" />
          <path d="M7 9h1M16 9h1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
        </svg>
      );
    case "invoice":
      return (
        <svg {...common}>
          <path d="M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21V3Z" />
          <path d="M10 8h4M10 12h4M10 16h2" />
        </svg>
      );
    case "tools":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4L15 12l-2.3-2.3 1.9-3.4Z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "review":
      return (
        <svg {...common}>
          <path d="m12 3 2.2 4.5L19 8.2l-3.5 3.4.8 4.9L12 14.2 7.7 16.5l.8-4.9L5 8.2l4.8-.7L12 3Z" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
        </svg>
      );
    case "check":
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
      );
  }
}
