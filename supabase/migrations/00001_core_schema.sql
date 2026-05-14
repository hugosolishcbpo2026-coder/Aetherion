-- ============================================================================
-- AETHERION OS — CORE SCHEMA
-- Multi-tenant SaaS schema. Tenancy = organization_id on every row.
-- Designed for configurability: roles, pipelines, automations are data, not code.
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";       -- for ai_memory embeddings
create extension if not exists "pg_trgm";      -- fuzzy search

-- ============================================================================
-- ENUMS
-- ============================================================================
create type user_status as enum ('active', 'invited', 'suspended', 'archived');
create type org_plan as enum ('free', 'starter', 'pro', 'enterprise');
create type booking_status as enum ('draft', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
create type order_status as enum ('pending', 'paid', 'fulfilled', 'refunded', 'cancelled');
create type doc_status as enum ('draft', 'pending_review', 'approved', 'signed', 'archived');
create type message_channel as enum ('email', 'sms', 'whatsapp', 'in_app', 'voice');
create type task_status as enum ('todo', 'in_progress', 'blocked', 'done', 'cancelled');
create type priority_level as enum ('low', 'normal', 'high', 'urgent');
create type automation_trigger_type as enum ('event', 'schedule', 'webhook', 'manual');
create type ai_role as enum ('user', 'assistant', 'system', 'tool');

-- ============================================================================
-- ORGANIZATIONS — top-level tenancy
-- Each organization is a customer of the platform (e.g. Notaría 322, TropicCo).
-- ============================================================================
create table organizations (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  legal_name      text,
  industry        text,
  logo_url        text,
  brand_config    jsonb default '{}'::jsonb,   -- colors, fonts, theme overrides
  feature_flags   jsonb default '{}'::jsonb,   -- which modules are enabled
  settings        jsonb default '{}'::jsonb,
  plan            org_plan default 'starter',
  billing_email   text,
  country         text default 'MX',
  timezone        text default 'America/Tijuana',
  locale          text default 'es-MX',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on organizations using gin (settings);

-- ============================================================================
-- USERS — extends Supabase auth.users
-- Anything in this table is mirrored / linked to auth.users by id.
-- ============================================================================
create table users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique,
  phone           text,
  full_name       text,
  avatar_url      text,
  preferred_language text default 'es',
  status          user_status default 'active',
  last_active_at  timestamptz,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- A user can belong to many orgs (e.g. a lawyer working with multiple firms).
create table organization_members (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references users(id) on delete cascade,
  is_default      boolean default false,
  joined_at       timestamptz default now(),
  unique (organization_id, user_id)
);
create index on organization_members(user_id);
create index on organization_members(organization_id);

-- ============================================================================
-- ROLES & PERMISSIONS — data-driven, not enum-based
-- Roles are defined per organization so each tenant can customize them.
-- System roles seeded: admin, manager, employee, client, vendor, lawyer,
-- tenant, property_owner, sales_agent.
-- ============================================================================
create table user_roles (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  key             text not null,                -- e.g. 'lawyer', 'sales_agent'
  display_name    text not null,
  description     text,
  is_system       boolean default false,        -- system roles can't be deleted
  permissions     jsonb default '[]'::jsonb,    -- array of permission keys
  created_at      timestamptz default now(),
  unique (organization_id, key)
);

create table permissions (
  id              uuid primary key default uuid_generate_v4(),
  key             text unique not null,         -- e.g. 'crm.clients.read'
  category        text not null,                -- e.g. 'crm'
  description     text
);

-- Many-to-many: user ⟷ role within an org
create table user_role_assignments (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references users(id) on delete cascade,
  role_id         uuid not null references user_roles(id) on delete cascade,
  assigned_at     timestamptz default now(),
  unique (organization_id, user_id, role_id)
);
create index on user_role_assignments(user_id, organization_id);

-- ============================================================================
-- CRM CORE — clients & vendors
-- Both are "contacts" but separated for query clarity. Could be unified later.
-- ============================================================================
create table clients (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,  -- if they have portal access
  full_name       text not null,
  email           text,
  phone           text,
  company         text,
  source          text,                          -- 'website', 'referral', 'walk_in'
  tags            text[] default '{}',
  notes           text,
  custom_fields   jsonb default '{}'::jsonb,     -- configurable per org
  lifecycle_stage text,                          -- 'lead', 'prospect', 'customer', 'evangelist'
  owner_id        uuid references users(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on clients(organization_id);
create index on clients(owner_id);
create index on clients using gin (tags);
create index on clients using gin (custom_fields);
create index on clients using gin (full_name gin_trgm_ops);

create table vendors (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,
  name            text not null,
  category        text,                          -- 'plumber', 'electrician', 'translator', ...
  email           text,
  phone           text,
  rating          numeric(2,1),
  service_area    text[],
  pricing         jsonb default '{}'::jsonb,
  active          boolean default true,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on vendors(organization_id);
create index on vendors(category);

-- ============================================================================
-- PIPELINES — configurable per organization
-- Each org can define multiple pipelines (Sales, Legal Cases, Maintenance, etc.)
-- ============================================================================
create table pipelines (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  description     text,
  entity_type     text default 'client',         -- what kind of records flow through it
  is_default      boolean default false,
  archived        boolean default false,
  created_at      timestamptz default now()
);

create table pipeline_stages (
  id              uuid primary key default uuid_generate_v4(),
  pipeline_id     uuid not null references pipelines(id) on delete cascade,
  name            text not null,
  description     text,
  position        int not null,
  win_probability numeric(3,2),                  -- 0.00 - 1.00
  is_won          boolean default false,
  is_lost         boolean default false,
  color           text,
  created_at      timestamptz default now()
);
create index on pipeline_stages(pipeline_id, position);

-- A "deal" — an instance of a client in a pipeline at a stage
create table pipeline_records (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  pipeline_id     uuid not null references pipelines(id) on delete cascade,
  stage_id        uuid not null references pipeline_stages(id),
  client_id       uuid references clients(id) on delete cascade,
  title           text not null,
  value           numeric(14,2),
  currency        text default 'MXN',
  owner_id        uuid references users(id) on delete set null,
  expected_close  date,
  closed_at       timestamptz,
  custom_fields   jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on pipeline_records(pipeline_id, stage_id);
create index on pipeline_records(client_id);

-- ============================================================================
-- TASKS
-- ============================================================================
create table tasks (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title           text not null,
  description     text,
  status          task_status default 'todo',
  priority        priority_level default 'normal',
  assignee_id     uuid references users(id) on delete set null,
  created_by      uuid references users(id) on delete set null,
  due_date        timestamptz,
  completed_at    timestamptz,
  -- polymorphic relation: tasks can attach to clients, bookings, pipeline_records, etc.
  related_type    text,
  related_id      uuid,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on tasks(organization_id, status);
create index on tasks(assignee_id);
create index on tasks(related_type, related_id);

-- ============================================================================
-- ACTIVITY LOG / AUDIT
-- ============================================================================
create table activity_logs (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,
  action          text not null,                 -- 'created', 'updated', 'deleted', 'logged_in'
  entity_type     text,
  entity_id       uuid,
  changes         jsonb,
  ip_address      inet,
  user_agent      text,
  created_at      timestamptz default now()
);
create index on activity_logs(organization_id, created_at desc);
create index on activity_logs(entity_type, entity_id);

-- CRM-scoped log: communications, notes, calls, emails attached to a client
create table crm_logs (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete cascade,
  type            text not null,                 -- 'note', 'email', 'call', 'meeting', 'sms'
  subject         text,
  body            text,
  user_id         uuid references users(id) on delete set null,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on crm_logs(client_id, created_at desc);

-- ============================================================================
-- LISTINGS — marketplace items (properties, services, legal procedures)
-- ============================================================================
create table listings (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vendor_id       uuid references vendors(id) on delete set null,
  type            text not null,                 -- 'property', 'service', 'legal_procedure'
  slug            text,
  title           text not null,
  description     text,
  price           numeric(14,2),
  currency        text default 'MXN',
  pricing_model   text default 'fixed',          -- 'fixed', 'hourly', 'subscription', 'quote'
  images          text[] default '{}',
  attributes      jsonb default '{}'::jsonb,     -- bedrooms, sqm, jurisdiction, etc.
  location        jsonb,                         -- { lat, lng, address, city, ... }
  status          text default 'active',         -- 'draft', 'active', 'paused', 'archived'
  featured        boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on listings(organization_id, type, status);
create index on listings using gin (attributes);

-- ============================================================================
-- BOOKINGS
-- ============================================================================
create table bookings (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete set null,
  listing_id      uuid references listings(id) on delete set null,
  assigned_to     uuid references users(id) on delete set null,
  title           text not null,
  status          booking_status default 'pending',
  start_at        timestamptz not null,
  end_at          timestamptz,
  location        text,
  amount          numeric(14,2),
  currency        text default 'MXN',
  notes           text,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on bookings(organization_id, start_at);
create index on bookings(client_id);
create index on bookings(status);

-- ============================================================================
-- ORDERS, TRANSACTIONS, INVOICES
-- ============================================================================
create table orders (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete set null,
  listing_id      uuid references listings(id) on delete set null,
  booking_id      uuid references bookings(id) on delete set null,
  status          order_status default 'pending',
  subtotal        numeric(14,2) not null,
  tax             numeric(14,2) default 0,
  total           numeric(14,2) not null,
  currency        text default 'MXN',
  items           jsonb default '[]'::jsonb,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);

create table transactions (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  order_id        uuid references orders(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  type            text not null,                 -- 'payment', 'refund', 'payout', 'fee'
  amount          numeric(14,2) not null,
  currency        text default 'MXN',
  provider        text,                          -- 'stripe', 'mercadopago', 'cash', ...
  provider_ref    text,
  status          text default 'completed',
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on transactions(organization_id, created_at desc);

create table invoices (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete set null,
  order_id        uuid references orders(id) on delete set null,
  number          text not null,
  status          text default 'draft',          -- 'draft', 'sent', 'paid', 'overdue', 'void'
  issue_date      date default current_date,
  due_date        date,
  subtotal        numeric(14,2) not null,
  tax             numeric(14,2) default 0,
  total           numeric(14,2) not null,
  currency        text default 'MXN',
  line_items      jsonb default '[]'::jsonb,
  pdf_url         text,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  unique (organization_id, number)
);

-- ============================================================================
-- MEMBERSHIPS & SUBSCRIPTIONS
-- ============================================================================
create table membership_plans (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  description     text,
  price           numeric(14,2) not null,
  currency        text default 'MXN',
  interval        text default 'month',          -- 'month', 'year', 'one_time'
  benefits        jsonb default '[]'::jsonb,
  active          boolean default true,
  created_at      timestamptz default now()
);

create table memberships (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid not null references clients(id) on delete cascade,
  plan_id         uuid not null references membership_plans(id),
  status          text default 'active',         -- 'active', 'paused', 'cancelled', 'expired'
  started_at      timestamptz default now(),
  ends_at         timestamptz,
  cancelled_at    timestamptz,
  metadata        jsonb default '{}'::jsonb
);

create table subscriptions (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  membership_id   uuid references memberships(id) on delete cascade,
  client_id       uuid references clients(id) on delete cascade,
  provider        text,
  provider_ref    text,
  current_period_start timestamptz,
  current_period_end   timestamptz,
  cancel_at_period_end boolean default false,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);

-- ============================================================================
-- MESSAGING & NOTIFICATIONS
-- ============================================================================
create table messages (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  thread_id       uuid,                          -- group messages into conversations
  channel         message_channel default 'in_app',
  from_user_id    uuid references users(id) on delete set null,
  to_user_id      uuid references users(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  subject         text,
  body            text,
  attachments     jsonb default '[]'::jsonb,
  read_at         timestamptz,
  delivered_at    timestamptz,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on messages(thread_id);
create index on messages(to_user_id, read_at);

create table notifications (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id         uuid not null references users(id) on delete cascade,
  type            text not null,
  title           text not null,
  body            text,
  link            text,
  read_at         timestamptz,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on notifications(user_id, read_at);

-- ============================================================================
-- DOCUMENTS
-- ============================================================================
create table documents (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete set null,
  uploaded_by     uuid references users(id) on delete set null,
  name            text not null,
  description     text,
  category        text,                          -- 'id', 'contract', 'deed', 'invoice', ...
  status          doc_status default 'draft',
  storage_path    text not null,                 -- supabase storage key
  mime_type       text,
  size_bytes      bigint,
  -- polymorphic
  related_type    text,
  related_id      uuid,
  signed_at       timestamptz,
  signed_by       jsonb default '[]'::jsonb,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on documents(organization_id);
create index on documents(client_id);
create index on documents(related_type, related_id);

-- ============================================================================
-- AUTOMATIONS — data-driven workflow engine
-- An automation = trigger + conditions + actions, all configurable.
-- ============================================================================
create table automations (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  description     text,
  trigger_type    automation_trigger_type not null,
  trigger_config  jsonb not null default '{}'::jsonb,  -- event name, cron, webhook path
  conditions      jsonb default '[]'::jsonb,          -- array of {field, op, value}
  actions         jsonb not null default '[]'::jsonb, -- ordered list of action specs
  enabled         boolean default true,
  last_run_at     timestamptz,
  run_count       int default 0,
  created_by      uuid references users(id),
  created_at      timestamptz default now()
);
create index on automations(organization_id, enabled);

create table automation_runs (
  id              uuid primary key default uuid_generate_v4(),
  automation_id   uuid not null references automations(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  status          text not null,                 -- 'running', 'success', 'failed'
  trigger_payload jsonb,
  result          jsonb,
  error           text,
  duration_ms     int,
  started_at      timestamptz default now(),
  finished_at     timestamptz
);
create index on automation_runs(automation_id, started_at desc);

-- ============================================================================
-- AI SYSTEM
-- ============================================================================
create table ai_prompts (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  -- null org = system prompt template available to all
  key             text not null,                 -- 'sales_coach', 'legal_summary'
  name            text not null,
  description     text,
  system_prompt   text not null,
  model           text default 'gpt-4o-mini',
  temperature     numeric(3,2) default 0.7,
  variables       jsonb default '[]'::jsonb,     -- declared template vars
  tools           jsonb default '[]'::jsonb,     -- list of tool keys this prompt can use
  version         int default 1,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  unique (organization_id, key, version)
);

create table ai_conversations (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,
  client_id       uuid references clients(id) on delete set null,
  prompt_key      text,                          -- which assistant
  title           text,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index on ai_conversations(user_id);

create table ai_messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  role            ai_role not null,
  content         text,
  tool_calls      jsonb,
  tokens_in       int,
  tokens_out      int,
  model           text,
  created_at      timestamptz default now()
);
create index on ai_messages(conversation_id, created_at);

-- Long-term memory store — embeddings for retrieval
create table ai_memory (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  scope_type      text not null,                 -- 'org', 'user', 'client'
  scope_id        uuid,
  content         text not null,
  embedding       vector(1536),                  -- OpenAI text-embedding-3-small dim
  source_type     text,                          -- 'crm_log', 'document', 'call_transcript'
  source_id       uuid,
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);
create index on ai_memory(organization_id, scope_type, scope_id);
create index on ai_memory using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table ai_feedback (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  conversation_id uuid references ai_conversations(id) on delete cascade,
  message_id      uuid references ai_messages(id) on delete cascade,
  user_id         uuid references users(id) on delete set null,
  rating          int,                           -- -1, 0, 1
  comment         text,
  created_at      timestamptz default now()
);

-- ============================================================================
-- VOICE AI / CALLS
-- ============================================================================
create table calls (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  client_id       uuid references clients(id) on delete set null,
  user_id         uuid references users(id) on delete set null,
  direction       text,                          -- 'inbound', 'outbound'
  from_number     text,
  to_number       text,
  status          text,                          -- 'queued', 'ringing', 'in_progress', 'completed', 'failed'
  duration_seconds int,
  recording_url   text,
  provider        text,                          -- 'twilio', 'vapi', ...
  provider_ref    text,
  metadata        jsonb default '{}'::jsonb,
  started_at      timestamptz default now(),
  ended_at        timestamptz
);
create index on calls(organization_id, started_at desc);
create index on calls(client_id);

create table call_transcripts (
  id              uuid primary key default uuid_generate_v4(),
  call_id         uuid not null references calls(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  speaker         text,                          -- 'agent', 'client', 'ai'
  start_ms        int,
  end_ms          int,
  text            text not null,
  confidence      numeric(3,2),
  created_at      timestamptz default now()
);
create index on call_transcripts(call_id, start_ms);

create table call_scores (
  id              uuid primary key default uuid_generate_v4(),
  call_id         uuid not null references calls(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  -- AI-generated scoring
  overall_score   numeric(3,1),                  -- 0.0 - 10.0
  sentiment       text,
  objections      jsonb default '[]'::jsonb,
  topics          text[],
  summary         text,
  next_actions    jsonb default '[]'::jsonb,
  coaching_notes  text,
  scored_by       text default 'ai',
  metadata        jsonb default '{}'::jsonb,
  created_at      timestamptz default now()
);

-- ============================================================================
-- TRIGGERS — updated_at maintenance
-- ============================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare t text;
begin
  for t in
    select unnest(array[
      'organizations','users','clients','listings','bookings',
      'pipeline_records','ai_conversations'
    ])
  loop
    execute format(
      'create trigger trg_%I_updated before update on %I for each row execute function set_updated_at()',
      t, t
    );
  end loop;
end$$;
