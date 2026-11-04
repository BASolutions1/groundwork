export const ONBOARDING_COOKIE = "gw_onboarding";

export type OnboardingPayload = {
  businessType: string;
  phone: string;
};

export function encodeOnboarding(payload: OnboardingPayload) {
  return encodeURIComponent(JSON.stringify(payload));
}

export function decodeOnboarding(raw: string | undefined | null): OnboardingPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<OnboardingPayload>;
    return {
      businessType: (parsed.businessType ?? "").trim(),
      phone: (parsed.phone ?? "").trim(),
    };
  } catch {
    return null;
  }
}

export function buildSignupHref(payload: OnboardingPayload) {
  const params = new URLSearchParams();
  if (payload.businessType) params.set("business", payload.businessType);
  if (payload.phone) params.set("phone", payload.phone);
  const query = params.toString();
  return query ? `/signup?${query}` : "/signup";
}
