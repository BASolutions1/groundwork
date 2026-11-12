"use client";

import { useState, useTransition } from "react";

import { updateProfile } from "@/app/(app)/app/actions";
import { BusinessTypeInput } from "@/components/forms/BusinessTypeInput";
import type { Profile } from "@/lib/database.types";
import { PROVINCES } from "@/lib/provinces";

type Props = {
  profile: Profile;
  email: string;
};

export function SettingsForm({ profile, email }: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage("Saved.");
    });
  }

  return (
    <div className="flex max-w-[520px] flex-col gap-6">
      <div>
        <h1 className="m-0 text-[clamp(1.6rem,3vw,2rem)] font-medium tracking-[-0.03em]">
          Settings
        </h1>
        <p className="mt-2 m-0 text-[15px] text-secondary">Your account and business details.</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-pill border border-line px-2.5 py-1 text-[11px] font-medium text-secondary">
          Free
        </span>
        <button
          type="button"
          className="cursor-pointer rounded-control border border-line px-3 py-1.5 text-[12px] font-medium text-muted"
        >
          Upgrade
        </button>
      </div>

      <form action={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Email
          <input
            value={email}
            readOnly
            className="h-11 rounded-control border border-[#D6D6D3] bg-[#F7F7F5] px-3 text-[15px] font-normal text-muted"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Name
          <input
            name="fullName"
            defaultValue={profile.full_name ?? ""}
            className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Business name
          <input
            name="businessName"
            defaultValue={profile.business_name ?? ""}
            className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
          />
        </label>
        <div className="flex flex-col gap-1.5 text-sm font-medium">
          <label htmlFor="settings-business-type">Business type</label>
          <BusinessTypeInput
            id="settings-business-type"
            name="businessType"
            defaultValue={profile.business_type ?? ""}
            className="h-11 w-full rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
          />
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Province
          <select
            name="province"
            defaultValue={profile.province ?? ""}
            className="h-11 rounded-control border border-[#D6D6D3] bg-white px-3 text-[15px] font-normal"
          >
            <option value="">Select</option>
            {PROVINCES.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 h-11 cursor-pointer rounded-control bg-ink text-[14px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>

      {message ? <p className="m-0 text-sm text-done">{message}</p> : null}
      {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
