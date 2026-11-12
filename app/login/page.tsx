import Link from "next/link";
import { Suspense } from "react";

import { AuthForm } from "@/components/auth/AuthForm";
import { BrandLogo } from "@/components/BrandLogo";

export const instant = false;

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

async function LoginBody({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/app";

  return (
    <>
      <h1 className="m-0 text-center text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-[-0.03em]">
        Sign in
      </h1>
      <p className="mt-2 text-center text-[15px] leading-normal text-secondary">
        Pick up your list where you left off.
      </p>
      {params.error ? (
        <p className="mt-4 text-center text-sm text-red-700">
          That link is invalid or has expired. Sign in below, and resend the confirmation if your email still isn&apos;t verified.
        </p>
      ) : null}
      <div className="mt-8">
        <AuthForm mode="login" next={next} />
      </div>
    </>
  );
}

export default function LoginPage(props: Props) {
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
          <LoginBody {...props} />
        </Suspense>
        <p className="mt-8 text-center text-sm text-secondary">
          New here?{" "}
          <Link href="/signup" className="font-medium text-ink underline-offset-2 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
