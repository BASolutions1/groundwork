"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  decodeOnboarding,
  encodeOnboarding,
  ONBOARDING_COOKIE,
  type OnboardingPayload,
} from "@/lib/onboarding";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

function emailSendError(error: { message: string; code?: string }) {
  const message = error.message.toLowerCase();
  const limited = error.code === "over_email_send_rate_limit" || message.includes("rate limit");
  if (limited && message.includes("after")) {
    return "Wait a minute before sending another email.";
  }
  if (limited) {
    return "The email could not be sent. This project's mailer only allows a few messages an hour. Wait and try again.";
  }
  if (error.code === "email_address_not_authorized" || message.includes("not authorized")) {
    return "This project can't email that address yet. The built-in mailer only delivers to team addresses until a custom sender is connected.";
  }
  return error.message;
}

async function persistOnboarding(payload: OnboardingPayload) {
  const jar = await cookies();
  jar.set(ONBOARDING_COOKIE, encodeOnboarding(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

async function readOnboardingFromCookie(): Promise<OnboardingPayload> {
  const jar = await cookies();
  return (
    decodeOnboarding(jar.get(ONBOARDING_COOKIE)?.value) ?? {
      businessType: "",
      phone: "",
    }
  );
}

export async function ensureProfile(overrides?: Partial<OnboardingPayload>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not signed in" };
  }

  const onboarding = await readOnboardingFromCookie();
  const meta = user.user_metadata ?? {};
  const businessType = (
    overrides?.businessType ||
    onboarding.businessType ||
    meta.business_type ||
    ""
  )
    .toString()
    .trim();
  const phone = (overrides?.phone || onboarding.phone || meta.phone || "")
    .toString()
    .trim();

  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (!existing) {
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      business_type: businessType || null,
      phone: phone || null,
    });
    if (error) {
      return { error: error.message };
    }
  } else if (businessType || phone) {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...(businessType ? { business_type: businessType } : {}),
        ...(phone ? { phone } : {}),
      })
      .eq("id", user.id);
    if (error) {
      return { error: error.message };
    }
  }

  const jar = await cookies();
  jar.delete(ONBOARDING_COOKIE);

  if (businessType && phone) {
    try {
      const admin = createAdminClient();
      await admin.from("leads").insert({
        business_type: businessType,
        phone,
        source: "signup",
      });
    } catch {
      // Lead capture is best-effort.
    }
  }

  return { error: null };
}

export async function signUpWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const businessType = String(formData.get("businessType") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  await persistOnboarding({ businessType, phone });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteOrigin()}/auth/callback?next=/app`,
      data: {
        business_type: businessType || null,
        phone: phone || null,
      },
    },
  });

  if (error) {
    return { error: emailSendError(error) };
  }

  // Existing account: Supabase returns an empty identities list and does not send mail.
  if (data.user && data.user.identities?.length === 0) {
    return {
      error: "An account with this email already exists. Sign in instead. If it was never confirmed, sign in with your password to resend the link.",
    };
  }

  // Confirm email is on: no session until they click the link.
  if (!data.session) {
    return {
      error: null,
      needsConfirm: true,
      notice: "signup" as const,
      email,
      message:
        "Check your email for a confirmation link. After you confirm, you will land in your list.",
    };
  }

  // Confirm email is off in the project: continue straight in.
  const profile = await ensureProfile({ businessType, phone });
  if (profile.error) {
    return { error: profile.error };
  }

  redirect("/app");
}

export async function resendConfirmation(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${siteOrigin()}/auth/callback?next=/app`,
    },
  });

  if (error) {
    return { error: emailSendError(error) };
  }

  return {
    error: null,
    message: "Confirmation email sent again. Check your inbox, and spam if it isn't there.",
  };
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/app") || "/app";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        error: null,
        needsConfirm: true,
        notice: "unverified" as const,
        email,
        message: "This email isn't verified yet. Check your inbox for the confirmation link, or resend it.",
      };
    }
    return { error: emailSendError(error) };
  }

  const profile = await ensureProfile();
  if (profile.error) {
    return { error: profile.error };
  }

  redirect(next.startsWith("/") ? next : "/app");
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "/app") || "/app";
  const businessType = String(formData.get("businessType") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email) {
    return { error: "Email is required." };
  }

  if (businessType || phone) {
    await persistOnboarding({ businessType, phone });
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true,
      data: {
        business_type: businessType || null,
        phone: phone || null,
      },
    },
  });

  if (error) {
    return { error: emailSendError(error) };
  }

  return {
    error: null,
    needsConfirm: true,
    notice: "magic" as const,
    email,
    message: "Check your email for the magic link.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
