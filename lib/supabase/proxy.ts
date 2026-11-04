import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function publicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const env = publicEnv();
  // Without Supabase env (e.g. Vercel missing vars), never block the site.
  if (!env) {
    if (request.nextUrl.pathname.startsWith("/app")) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(login);
    }
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    });

    // Refresh the session. Do not use getSession() for auth checks.
    const { data } = await supabase.auth.getClaims();
    const claims = data?.claims;
    const path = request.nextUrl.pathname;

    if (!claims && path.startsWith("/app")) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", path);
      const redirect = NextResponse.redirect(login);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie.name, cookie.value);
      });
      return redirect;
    }

    if (claims && (path === "/login" || path === "/signup")) {
      const app = request.nextUrl.clone();
      app.pathname = "/app";
      app.search = "";
      const redirect = NextResponse.redirect(app);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie.name, cookie.value);
      });
      return redirect;
    }

    return supabaseResponse;
  } catch (error) {
    console.error("supabase proxy error", error);
    return NextResponse.next({ request });
  }
}
