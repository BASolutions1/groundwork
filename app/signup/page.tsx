import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";

import { AuthForm } from "@/components/auth/AuthForm";
import { BrandLogo } from "@/components/BrandLogo";
import { decodeOnboarding, ONBOARDING_COOKIE } from "@/lib/onboarding";

export const instant = false;

type Props = {
  searchParams: Promise<{ business?: string; phone?: string }>;
};

async function SignupBody({ searchParams }: Props) {
  const params = await searchParams;
  const jar = await cookies();
  const fromCookie = decodeOnboarding(jar.get(ONBOARDING_COOKIE)?.value);
  const businessType = (params.business ?? fromCookie?.businessType ?? "").trim();
  const phone = (params.phone ?? fromCookie?.phone ?? "").trim();

  return (
    <>
      <h1 className="m-0 text-center text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-[-0.03em]">
        Create your list
      </h1>
      <p className="mt-2 text-center text-[15px] leading-normal text-secondary">
        {businessType
          ? `We will build your steps for a ${businessType} business.`
          : "Tell us how to reach your account, then your list is ready."}
      </p>
      <div className="mt-8">
        <AuthForm
          mode="signup"
          next="/app"
          businessType={businessType}
          phone={phone}
        />
      </div>
    </>
  );
}

export default function SignupPage(props: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 flex justify-center">
          <BrandLogo
            href="/"
            priority
            iconClassName="h-9 w-auto"
            textClassName="text-[22px] font-semibold tracking-[-0.02em] text-ink"
          />
        </div>
        <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
          <SignupBody {...props} />
        </Suspense>
        <p className="mt-8 text-center text-sm text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
