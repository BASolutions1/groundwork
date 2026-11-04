# Groundwork

Marketing site for Groundwork, a Canada-wide guide for people starting a business. One page: the story, the list, and an intake form. No account, no dashboard.

The intake form is on the page and can prefill a business type from the hero field. Submissions go to `public.leads` via `/api/leads`.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, GSAP with ScrollTrigger. Package manager is pnpm. Hosting target is Vercel.

## Set up

Requires Node.js 20 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Name | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public client key (preferred) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy public key (optional if publishable is set) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only inserts into `leads` |
| `NEXT_PUBLIC_SITE_URL` | App origin for auth email redirects (local: `http://localhost:3000`) |
| `MAKE_WEBHOOK_URL` | Make.com scenario that receives the same payload |

The service role key stays on the server. Do not prefix it with `NEXT_PUBLIC_`.

### Auth (email confirmation)

Signup and magic link use Supabase Auth email. Until a Groundwork sending domain is ready, keep the default Supabase mailer.

In the Supabase dashboard for this project:

1. **Authentication → Providers → Email**: enabled. Turn **Confirm email** on.
2. **Authentication → URL configuration**:
   - Site URL: `http://localhost:3000` (or your Vercel URL in production)
   - Redirect URLs: `http://localhost:3000/auth/callback` and your production `/auth/callback`
3. Optional later: **Project Settings → Authentication → SMTP** for a custom from-address once the domain is chosen.

Flow: signup → confirmation email → `/auth/callback` → profile + seeded list → `/app`.

### Database

Run the migrations in `supabase/migrations/` (leads, then dashboard schema). Dashboard tables are RLS-scoped so users only see their own rows.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm format
pnpm build
```

## Deploy

1. Push the repo to GitHub.
2. Import the project in Vercel. Framework preset is Next.js. Install command is `pnpm install`.
3. Add the four environment variables from `.env.example` in the Vercel project settings.
4. Deploy. Vercel runs `pnpm build`.

Hero photos live in `public/hero`. The layout reference is `reference/homepage.html`.
