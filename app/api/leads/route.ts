import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type LeadBody = {
  businessType?: string;
  phone?: string;
  source?: string;
};

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const businessType = body.businessType?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const source = body.source?.trim() || "homepage";

  if (!businessType || !phone) {
    return NextResponse.json(
      { error: "businessType and phone are required" },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("leads").insert({
      business_type: businessType,
      phone,
      source,
    });

    if (error) {
      console.error("leads insert failed", error);
      return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
    }

    const webhook = process.env.MAKE_WEBHOOK_URL;
    if (webhook) {
      void fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessType, phone, source }),
      }).catch((err) => console.error("Make webhook failed", err));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("leads route error", err);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
}
