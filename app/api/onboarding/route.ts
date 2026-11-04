import { NextResponse } from "next/server";

import { encodeOnboarding, ONBOARDING_COOKIE } from "@/lib/onboarding";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: { businessType?: string; phone?: string; source?: string };
  try {
    body = (await request.json()) as {
      businessType?: string;
      phone?: string;
      source?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const businessType = body.businessType?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const source = body.source?.trim() || "homepage";

  if (!businessType) {
    return NextResponse.json({ error: "businessType is required" }, { status: 400 });
  }

  if (phone) {
    try {
      const supabase = createAdminClient();
      await supabase.from("leads").insert({
        business_type: businessType,
        phone,
        source,
      });
    } catch (err) {
      console.error("lead insert during onboarding", err);
    }
  }

  const response = NextResponse.json({ ok: true, href: "/signup" });
  response.cookies.set({
    name: ONBOARDING_COOKIE,
    value: encodeOnboarding({ businessType, phone }),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
