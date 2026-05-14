# AETHERION

> The AI Business Operating System.
> A modular, AI-native SaaS platform powering CRM, bookings, marketplace, memberships, automations, voice intelligence, analytics, and more.

Built for **Notaría Pública 322** and **TropicCo Property Management** — designed to scale to any organization.

---

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **TailwindCSS** + **ShadCN UI** primitives
- **Framer Motion** + **React Three Fiber** (3D)
- **Supabase** (Postgres, Auth, Storage, Realtime, Edge Functions)
- **TypeScript** end-to-end
- Deployable to **Vercel** with zero config

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in Supabase credentials (see "Supabase setup" below)
#    NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#    SUPABASE_SERVICE_ROLE_KEY

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
aetherion/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public landing page
│   │   ├── (auth)/             # login, register, oauth callback
│   │   ├── (platform)/         # Internal app — staff dashboards
│   │   │   ├── dashboard/
│   │   │   ├── crm/{clients, pipelines, tasks}
│   │   │   ├── bookings/
│   │   │   ├── marketplace/
│   │   │   ├── memberships/
│   │   │   ├── documents/
│   │   │   ├── messages/
│   │   │   ├── automations/
│   │   │   ├── analytics/
│   │   │   ├── ai/
│   │   │   ├── vendors/
│   │   │   └── settings/
│   │   ├── (portal)/portal/    # Client-facing portal
│   │   └── api/                # Route handlers
│   │       ├── auth/callback/
│   │       ├── crm/clients/
│   │       ├── ai/chat/
│   │       ├── bookings/
│   │       └── webhooks/{twilio, stripe}
│   ├── components/
│   │   ├── ui/                 # Design system primitives
│   │   ├── layout/             # Sidebar, topbar, module-page
│   │   ├── dashboard/          # Stat cards, charts, feeds
│   │   └── marketing/          # Hero, feature grid, 3D scene
│   ├── lib/
│   │   ├── supabase/           # server/client/middleware clients
│   │   └── utils/              # cn, formatters
│   ├── modules/                # Business logic engines
│   │   ├── auth/
│   │   ├── crm/
│   │   ├── ai/
│   │   ├── voice/
│   │   ├── bookings/
│   │   ├── marketplace/
│   │   ├── memberships/
│   │   ├── automations/
│   │   ├── analytics/
│   │   ├── messaging/
│   │   └── documents/
│   ├── types/                  # TypeScript domain types
│   └── middleware.ts           # Session refresh + route protection
├── supabase/
│   └── migrations/
│       ├── 00001_core_schema.sql
│       ├── 00002_rls_policies.sql
│       └── 00003_seed_data.sql
├── public/
├── package.json
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## Architecture

Aetherion is built around the principle: **everything is data, not code.**

- **Roles, permissions, pipelines, automations, AI prompts** — all stored in the database, all overridable per organization.
- **Multi-tenant** — every row has `organization_id`. RLS enforces tenant isolation at the database layer.
- **Engine modules** — each business domain (`src/modules/*`) exposes a service object that wraps Supabase queries with validation, auditing, and tenancy context.
- **Provider-agnostic AI** — `modules/ai` exposes a `ChatRequest`/`ChatResponse` interface. OpenAI is the default; swap in Claude, Mistral, or local models without touching downstream code.
- **Configurable automation engine** — triggers and actions are JSON. Add a new action type by extending the registry in `modules/automations`.

```
┌────────────────────────────────────────────────────┐
│              AETHERION CORE                        │
├────────────────────────────────────────────────────┤
│ Auth · CRM · AI · Voice · Bookings · Marketplace   │
│ Memberships · Automations · Analytics              │
│ Messaging · Documents                              │
├────────────────────────────────────────────────────┤
│            API Layer (Next.js routes)              │
├────────────────────────────────────────────────────┤
│      Supabase (Postgres + RLS + Auth + Storage)    │
└────────────────────────────────────────────────────┘
```

---

## Supabase setup

### 1. Create a Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**. Pick a region close to your users (for Mexico → `us-west-1`).

### 2. Get your keys

In the project dashboard → **Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL` ← the Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← the `anon` public key
- `SUPABASE_SERVICE_ROLE_KEY` ← the `service_role` secret key (server-only, never expose)

Paste these into `.env.local`.

### 3. Run the migrations

You have three options.

**Option A — Supabase CLI (recommended):**
```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

**Option B — Paste into the SQL editor:**
Open **Supabase → SQL Editor → New query**. Run each migration in order:
1. `supabase/migrations/00001_core_schema.sql`
2. `supabase/migrations/00002_rls_policies.sql`
3. `supabase/migrations/00003_seed_data.sql`

**Option C — psql:**
```bash
psql "$DATABASE_URL" < supabase/migrations/00001_core_schema.sql
psql "$DATABASE_URL" < supabase/migrations/00002_rls_policies.sql
psql "$DATABASE_URL" < supabase/migrations/00003_seed_data.sql
```

### 4. Enable extensions

The schema requires `uuid-ossp`, `pgcrypto`, `vector` (for AI embeddings), and `pg_trgm`. Run this once in the SQL editor:

```sql
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";
create extension if not exists "pg_trgm";
```

### 5. Configure auth providers

In **Supabase → Authentication → Providers**:
- **Email**: enable (default)
- **Phone** (OTP via SMS): enable and connect Twilio
- **Google**: enable, paste client ID + secret
- **Microsoft (Azure)**: enable, paste tenant + client ID + secret

Set the **Site URL** to your Vercel URL and add `https://your-domain.vercel.app/api/auth/callback` to the redirect allow-list.

### 6. Create storage bucket

In **Storage → New bucket**: name it `documents`, mark it private. The document engine uses signed URLs.

---

## Deploy to Vercel

### One-click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:YOUR-USERNAME/aetherion.git
git push -u origin main

# 2. Import on Vercel
# vercel.com → New Project → Import from GitHub → select repo

# 3. Add environment variables
# Paste the same vars from .env.local into Vercel's project settings
```

Vercel will detect Next.js automatically and deploy on every push.

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | From Supabase API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Server-only — bypass RLS |
| `OPENAI_API_KEY` | for AI features | [platform.openai.com](https://platform.openai.com) |
| `ANTHROPIC_API_KEY` | optional | If using Claude provider |
| `DEEPGRAM_API_KEY` | for Voice AI | [deepgram.com](https://deepgram.com) |
| `ELEVENLABS_API_KEY` | for Voice AI | [elevenlabs.io](https://elevenlabs.io) |
| `TWILIO_ACCOUNT_SID` | for SMS/voice | [twilio.com](https://twilio.com) |
| `TWILIO_AUTH_TOKEN` | for SMS/voice | |
| `TWILIO_PHONE_NUMBER` | for SMS/voice | |
| `RESEND_API_KEY` | for email | [resend.com](https://resend.com) |
| `NEXT_PUBLIC_APP_URL` | ✅ in prod | `https://your-domain.com` |

---

## Anchor organizations

The seed migration creates two ready-to-use organizations:

| Slug | Name | Industry |
|---|---|---|
| `notaria-322` | Notaría Pública 322 | Legal |
| `tropicco` | TropicCo Property Management | Real Estate |

Both come pre-configured with default pipelines, system roles, and feature flags. Add users via Supabase Auth, then assign them to one of these orgs via `organization_members`.

---

## Default AI prompts

Six assistants are seeded out of the box:

- `website_concierge` — public-site chat assistant
- `crm_copilot` — internal assistant for staff
- `sales_coach` — analyzes call transcripts
- `legal_drafter` — drafts and reviews Mexican legal procedures
- `property_advisor` — real estate matching
- `voice_realtime` — low-latency voice agent

Per-organization overrides: insert a new row in `ai_prompts` with the same `key` and a non-null `organization_id`.

---

## Adding a new automation action

```ts
// src/modules/automations/actions/custom.ts
import { registerAction } from '@/modules/automations';

registerAction('post_to_slack', async (params, ctx) => {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    body: JSON.stringify({ text: params.message }),
  });
  return { ok: true };
});
```

Then reference it in your automation's `actions` array:
```json
{ "type": "post_to_slack", "params": { "message": "New client signed up!" } }
```

---

## What's NOT done yet

Being honest — this is a strong foundation, not a finished product. Before going live, your developer will need to:

- [ ] Run `npm install` and resolve any peer dependency warnings
- [ ] Wire actual data fetching on the dashboard widgets (currently mock data)
- [ ] Build out CRUD UIs for each module (the placeholder pages have empty-state cards)
- [ ] Implement provider adapters for messaging (Resend, Twilio, WhatsApp)
- [ ] Implement Stripe / MercadoPago checkout for memberships and bookings
- [ ] Wire the Twilio + Deepgram pipeline for voice AI
- [ ] Add tests (Vitest recommended)
- [ ] Add error boundaries and proper loading states
- [ ] Generate Supabase types: `npm run db:types`

---

## Scripts

```bash
npm run dev          # Local dev with Turbopack
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (no emit)
npm run format       # Prettier
npm run db:push      # Push migrations via Supabase CLI
npm run db:types     # Regenerate src/types/database.types.ts from local DB
```

---

## License

Proprietary. Built for Notaría Pública 322 and TropicCo Property Management.
