"use client";

import { useState, useTransition } from "react";

import {
  resendConfirmation,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
} from "@/app/auth/actions";

type Props = {
  mode: "login" | "signup";
  next?: string;
  businessType?: string;
  phone?: string;
};

export function AuthForm({
  mode,
  next = "/app",
  businessType = "",
  phone = "",
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"password" | "magic">("password");

  function onPassword(formData: FormData) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result =
        mode === "signup"
          ? await signUpWithPassword(formData)
          : await signInWithPassword(formData);
      if (!result) return;
      if (result.error) {
        setError(result.error);
        return;
      }
      if ("needsConfirm" in result && result.needsConfirm) {
        setPendingEmail(
          "email" in result && typeof result.email === "string" ? result.email : null,
        );
        setMessage(
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Check your email.",
        );
      }
    });
  }

  function onMagic(formData: FormData) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await signInWithMagicLink(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.needsConfirm) {
        setPendingEmail(result.email ?? null);
        setMessage(result.message ?? "Check your email.");
      }
    });
  }

  function onResend() {
    if (!pendingEmail) return;
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", pendingEmail);
      const result = await resendConfirmation(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage(result.message ?? "Confirmation email sent again.");
    });
  }

  if (pendingEmail && message) {
    return (
      <div className="flex flex-col gap-4 rounded-card border border-line bg-[#FAFBFA] p-5 text-left">
        <p className="m-0 text-[15px] font-semibold tracking-[-0.015em]">Check your email</p>
        <p className="m-0 text-[14px] leading-normal text-secondary">
          We sent a confirmation link to <span className="font-medium text-ink">{pendingEmail}</span>.
          Open it to finish creating your account and load your list.
        </p>
        <p className="m-0 text-[13px] text-muted">
          The link expires after a while. You can resend it if needed.
        </p>
        <button
          type="button"
          onClick={onResend}
          disabled={pending}
          className="h-10 cursor-pointer rounded-control border border-line bg-white text-[13px] font-medium hover:bg-[#F4F4F2] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Resend confirmation email"}
        </button>
        {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="m-0 text-sm text-done">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 border-b border-line">
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`cursor-pointer border-b-2 px-1 pb-2 text-sm font-medium ${
            tab === "password"
              ? "border-ink text-ink"
              : "border-transparent text-muted"
          }`}
        >
          Email and password
        </button>
        <button
          type="button"
          onClick={() => setTab("magic")}
          className={`cursor-pointer border-b-2 px-1 pb-2 text-sm font-medium ${
            tab === "magic" ? "border-ink text-ink" : "border-transparent text-muted"
          }`}
        >
          Magic link
        </button>
      </div>

      {tab === "password" ? (
        <form action={onPassword} className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />
          {mode === "signup" ? (
            <>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Business type
                <input
                  name="businessType"
                  defaultValue={businessType}
                  required
                  className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
                  placeholder="Cafe, consulting, retail..."
                />
              </label>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Phone
                <input
                  name="phone"
                  type="tel"
                  defaultValue={phone}
                  className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
                  placeholder="Phone number"
                />
              </label>
            </>
          ) : null}
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-1 h-11 cursor-pointer rounded-control bg-ink text-[15px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {pending
              ? "Working…"
              : mode === "signup"
                ? "Create account →"
                : "Sign in →"}
          </button>
        </form>
      ) : (
        <form action={onMagic} className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="businessType" value={businessType} />
          <input type="hidden" name="phone" value={phone} />
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-11 rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-1 h-11 cursor-pointer rounded-control bg-ink text-[15px] font-medium text-white hover:bg-[#2a2a2a] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Email me a link →"}
          </button>
        </form>
      )}

      {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="m-0 text-sm text-done">{message}</p> : null}
    </div>
  );
}
