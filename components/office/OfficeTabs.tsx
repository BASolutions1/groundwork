"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app/office", label: "Overview" },
  { href: "/app/office/next-steps", label: "Next steps", count: "tasks" },
  { href: "/app/office/decisions", label: "Decisions", count: "decisions" },
  { href: "/app/office/risks", label: "Risks", count: "risks" },
  { href: "/app/office/competitors", label: "Competitors" },
  { href: "/app/office/pricing", label: "Pricing" },
  { href: "/app/office/notes", label: "Notes" },
] as const;

export function OfficeTabs({
  counts,
}: {
  counts: { tasks: number; decisions: number; risks: number };
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-[#E5E5E5]">
      {tabs.map((tab) => {
        const active =
          tab.href === "/app/office" ? pathname === tab.href : pathname.startsWith(tab.href);
        const count = "count" in tab ? counts[tab.count] : null;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 border-b-2 px-3 py-2 text-[14px] font-medium ${
              active ? "border-[#1F8A4C] text-[#111111]" : "border-transparent text-[#55555A]"
            }`}
          >
            {tab.label}
            {count !== null ? (
              <span className="ml-1.5 font-mono text-[11px] text-[#55555A]">{count}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
