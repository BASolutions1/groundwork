import type { Metadata } from "next";

import { OfficeTabs } from "@/components/office/OfficeTabs";
import { requireFounder } from "@/lib/office/access";
import { officeCounts } from "@/lib/office/load";

export const instant = false;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function OfficeLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireFounder();
  const counts = await officeCounts(supabase);

  return (
    <div>
      <h1 className="m-0 text-[28px] font-semibold text-[#111111]">Founder hub</h1>
      <p className="mt-1 mb-6 text-[14px] text-[#55555A]">
        Internal. Only founders can see this.
      </p>
      <OfficeTabs counts={counts} />
      <div className="pt-6">{children}</div>
    </div>
  );
}
