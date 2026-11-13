"use client";

import { useState, useTransition } from "react";

import {
  resendConfirmation,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
} from "@/app/auth/actions";
import { BusinessTypeInput } from "@/components/forms/BusinessTypeInput";

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
  const [notice, setNotice] = useState<"signup" | "unverified" | "magic">("signup");
  const [resent, setResent] = useState(false);
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
        const fields = result as {
          email?: string;
          message?: string;
          notice?: string;
        };
        setPendingEmail(typeof fields.email === "string" ? fields.email : null);
        setNotice(
          fields.notice === "unverified" || fields.notice === "magic" || fields.notice === "signup"
            ? fields.notice
            : "signup",
        );
        setResent(false);
        setMessage(typeof fields.message === "string" ? fields.message : "Check your email.");
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
        setNotice(result.notice === "magic" ? "magic" : "signup");
        setResent(false);
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
      setResent(true);
      setMessage(result.message ?? "Confirmation email sent again.");
    });
  }

  if (pendingEmail && message) {
    const title = notice === "unverified" ? "This email isn't verified yet" : "Check your email";
    const body =
      notice === "unverified" ? (
        <>
          A confirmation link was already sent to{" "}
          <span className="font-medium text-ink">{pendingEmail}</span>. Open it before signing in.
          Check spam if it isn&apos;t in your inbox.
        </>
      ) : notice === "magic" ? (
        <>
          We sent a sign-in link to <span className="font-medium text-ink">{pendingEmail}</span>.
          Open it on this device. Check spam if it isn&apos;t in your inbox.
        </>
      ) : (
        <>
          We sent a confirmation link to <span className="font-medium text-ink">{pendingEmail}</span>.
          Open it to finish creating your account and load your list. Check spam if it isn&apos;t
          in your inbox.
        </>
      );

    return (
      <div className="flex flex-col gap-4 rounded-card border border-line bg-[#FAFBFA] p-5 text-left">
        <p className="m-0 text-[15px] font-semibold tracking-[-0.015em]">{title}</p>
        <p className="m-0 text-[14px] leading-normal text-secondary">{body}</p>
        <p className="m-0 text-[13px] text-muted">
          {notice === "magic"
            ? "The link expires after a while. Request another one if it doesn't arrive."
            : "The link expires after a while. You can resend it if needed."}
        </p>
        {notice === "magic" ? (
          <button
            type="button"
            onClick={() => {
              setPendingEmail(null);
              setMessage(null);
              setError(null);
              setResent(false);
            }}
            className="h-10 cursor-pointer rounded-control border border-line bg-white text-[13px] font-medium hover:bg-[#F4F4F2]"
          >
            Use a different email
          </button>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={pending}
            className="h-10 cursor-pointer rounded-control border border-line bg-white text-[13px] font-medium hover:bg-[#F4F4F2] disabled:opacity-60"
          >
            {pending ? "Sending…" : "Resend confirmation email"}
          </button>
        )}
        {error ? <p className="m-0 text-sm text-red-700">{error}</p> : null}
        {resent && message ? <p className="m-0 text-sm text-done">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center gap-5 border-b border-line">
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`cursor-pointer border-b-2 px-1 pb-2.5 text-sm font-medium ${
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
          className={`cursor-pointer border-b-2 px-1 pb-2.5 text-sm font-medium ${
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
              <div className="flex flex-col gap-1.5 text-left text-sm font-medium">
                <label htmlFor="signup-business-type">Business type</label>
                <BusinessTypeInput
                  id="signup-business-type"
                  name="businessType"
                  defaultValue={businessType}
                  required
                  placeholder="Cafe, consulting, retail..."
                  className="h-11 w-full rounded-control border border-[#D6D6D3] px-3 text-[15px] font-normal"
                />
              </div>
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
              placeholder="you@email.com"
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
              placeholder="you@email.com"
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
