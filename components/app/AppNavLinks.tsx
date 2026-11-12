"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/app", label: "Overview", match: (path: string) => path === "/app" },
  {
    href: "/app/steps",
    label: "Steps",
    match: (path: string) => path.startsWith("/app/steps"),
  },
  {
    href: "/app/people",
    label: "People",
    match: (path: string) => path.startsWith("/app/people"),
  },
  {
    href: "/app/settings",
    label: "Settings",
    match: (path: string) => path.startsWith("/app/settings"),
  },
];

export function AppNavLinks({ isFounder = false }: { isFounder?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="App">
      {nav.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-control px-3 py-2 text-[14px] font-medium ${
              active
                ? "bg-[#F0F4F1] text-ink"
                : "text-secondary hover:bg-[#F4F4F2] hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      {isFounder ? (
        <div className="mt-3 border-t border-[#E5E5E5] pt-3">
          <p className="m-0 px-3 pb-1 font-mono text-[11px] tracking-[0.06em] text-[#55555A] uppercase">
            Internal
          </p>
          <Link
            href="/app/office"
            aria-current={pathname.startsWith("/app/office") ? "page" : undefined}
            className={`block rounded-control px-3 py-2 text-[14px] font-medium ${
              pathname.startsWith("/app/office")
                ? "bg-[#F0F4F1] text-ink"
                : "text-secondary hover:bg-[#F4F4F2] hover:text-ink"
            }`}
          >
            Site office
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
