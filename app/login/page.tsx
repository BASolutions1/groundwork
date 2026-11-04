import Link from "next/link";
import { Suspense } from "react";

import { AuthForm } from "@/components/auth/AuthForm";

export const instant = false;

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

async function LoginBody({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next?.startsWith("/") ? params.next : "/app";

  return (
    <>
      <h1 className="m-0 text-[clamp(1.75rem,4vw,2rem)] font-medium tracking-[-0.03em]">
        Sign in
      </h1>
      <p className="mt-2 text-[15px] leading-normal text-secondary">
        Pick up your list where you left off.
      </p>
      {params.error ? (
        <p className="mt-4 text-sm text-red-700">Could not complete sign in. Try again.</p>
      ) : null}
      <div className="mt-8">
        <AuthForm mode="login" next={next} />
      </div>
    </>
  );
}

export default function LoginPage(props: Props) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6 py-16">
      <a href="/" className="mb-10 flex items-center gap-2 text-[19px] font-semibold tracking-[-0.02em]">
        <span className="inline-block size-[14px] rounded-[3px] bg-ink" />
        Groundwork
      </a>
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <LoginBody {...props} />
      </Suspense>
      <p className="mt-8 text-sm text-secondary">
        New here?{" "}
        <Link href="/signup" className="font-medium text-ink underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
