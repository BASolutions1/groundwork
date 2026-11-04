import Link from "next/link";

import type { Profile } from "@/lib/database.types";

type Props = {
  profile: Profile | null;
  nextTitle: string | null;
  nextSlug: string | null;
};

export function AppTopBar({ profile, nextTitle, nextSlug }: Props) {
  const business =
    profile?.business_name?.trim() ||
    profile?.business_type?.trim() ||
    "Your business";

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-3.5 desk:px-8">
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="m-0 truncate text-[15px] font-semibold tracking-[-0.015em]">{business}</p>
          {profile?.province ? (
            <span className="shrink-0 rounded-pill border border-line px-2 py-0.5 text-[11px] font-medium text-secondary">
              {profile.province}
            </span>
          ) : null}
        </div>
        {nextTitle && nextSlug ? (
          <Link
            href={`/app/steps/${nextSlug}`}
            className="inline-flex max-w-[55%] shrink-0 items-center rounded-pill bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white hover:bg-[#2a2a2a]"
          >
            <span className="truncate">Next: {nextTitle}</span>
          </Link>
        ) : (
          <span className="shrink-0 rounded-pill bg-[#F4F4F2] px-3.5 py-1.5 text-[12px] font-medium text-muted">
            List complete
          </span>
        )}
      </div>
    </header>
  );
}
