import Image from "next/image";

import { signOut } from "@/app/auth/actions";
import { BrandLogo } from "@/components/BrandLogo";
import { AppNavLinks } from "@/components/app/AppNavLinks";

export function AppSidebar({ isFounder = false }: { isFounder?: boolean }) {
  return (
    <aside className="sticky top-0 flex h-screen w-[232px] shrink-0 flex-col border-r border-line bg-white">
      <div className="flex items-center px-5 pt-6 pb-5">
        <BrandLogo
          href="/app"
          iconClassName="h-7 w-auto"
          textClassName="text-[17px] font-semibold tracking-[-0.02em] text-ink"
        />
      </div>
      <AppNavLinks isFounder={isFounder} />
      <div className="border-t border-line p-4">
        <div className="rounded-card border border-line bg-[linear-gradient(160deg,#f4f6f2,#eaf0eb)] p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex size-8 shrink-0 overflow-hidden rounded-full bg-white">
              <Image
                src="/brand/logo-icon.png"
                alt=""
                width={93}
                height={112}
                className="size-full object-contain p-1.5"
              />
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
