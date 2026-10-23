# Groundwork

Marketing site for Groundwork, a Canada-wide guide for people starting a business. One page: the story, the list, and an intake form. No account, no dashboard.

The intake form is on the page and can prefill a business type from the hero field. It does not submit yet.

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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only inserts into `leads` |
| `MAKE_WEBHOOK_URL` | Make.com scenario that receives the same payload |

The service role key stays on the server. Do not prefix it with `NEXT_PUBLIC_`.

### Database

In the Supabase SQL editor, or with the Supabase CLI, run `supabase/migrations/001_leads.sql`.

That creates `public.leads` (`business_type`, `phone`, `source`, `created_at`), turns on row level security, and grants nothing to the anon or authenticated roles. Inserts are meant to go through the service role, which bypasses row level security.

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
