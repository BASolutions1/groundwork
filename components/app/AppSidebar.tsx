import Link from "next/link";

import { signOut } from "@/app/auth/actions";

const nav = [
  { href: "/app", label: "Overview" },
  { href: "/app/steps", label: "Steps" },
  { href: "/app/people", label: "People" },
  { href: "/app/settings", label: "Settings" },
];

export function AppSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[232px] shrink-0 flex-col border-r border-line bg-white">
      <div className="px-5 pt-6 pb-5">
        <Link
          href="/app"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-ink"
        >
          <span className="inline-block size-[12px] rounded-[3px] bg-ink" />
          Groundwork
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="App">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-control px-3 py-2 text-[14px] font-medium text-secondary hover:bg-[#F4F4F2] hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <div className="rounded-card border border-line bg-[linear-gradient(160deg,#f4f6f2,#eaf0eb)] p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#9FD9B5,#1F8A4C)] text-[11px] font-semibold text-white">
              G
            </span>
            <div className="min-w-0">
              <p className="m-0 text-[13px] font-semibold tracking-[-0.01em]">Your guide</p>
              <p className="m-0 text-[11px] text-muted">On the hard parts</p>
            </div>
          </div>
          <a
            href="mailto:hello@groundwork.ca?subject=Help%20with%20my%20list"
            className="mt-3 flex h-9 items-center justify-center rounded-control bg-ink text-[12px] font-medium text-white hover:bg-[#2a2a2a]"
          >
            Message
          </a>
        </div>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="w-full cursor-pointer rounded-control px-2 py-1.5 text-left text-[12px] text-muted hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
