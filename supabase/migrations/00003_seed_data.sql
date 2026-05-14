-- ============================================================================
-- SEED DATA
-- - permissions catalog
-- - anchor organizations (Notaría 322, TropicCo)
-- - default system roles per anchor org
-- - default AI prompts
-- ============================================================================

insert into permissions (key, category, description) values
  -- CRM
  ('crm.clients.read',  'crm', 'View clients'),
  ('crm.clients.write', 'crm', 'Create or edit clients'),
  ('crm.clients.delete','crm', 'Delete clients'),
  ('crm.pipelines.read','crm', 'View pipelines'),
  ('crm.pipelines.write','crm','Edit pipelines'),
  ('crm.tasks.read',   'crm',  'View tasks'),
  ('crm.tasks.write',  'crm',  'Create or edit tasks'),
  -- Bookings
  ('bookings.read',    'bookings', 'View bookings'),
  ('bookings.write',   'bookings', 'Create or edit bookings'),
  ('bookings.cancel',  'bookings', 'Cancel bookings'),
  -- Marketplace / Listings
  ('listings.read',    'marketplace', 'View listings'),
  ('listings.write',   'marketplace', 'Create or edit listings'),
  -- Memberships
  ('memberships.read', 'memberships', 'View memberships'),
  ('memberships.write','memberships', 'Edit memberships'),
  -- Documents
  ('documents.read',   'documents', 'View documents'),
  ('documents.write',  'documents', 'Upload or edit documents'),
  ('documents.sign',   'documents', 'Sign documents'),
  -- Automations
  ('automations.read', 'automations', 'View automations'),
  ('automations.write','automations', 'Create or edit automations'),
  -- AI
  ('ai.use',           'ai', 'Use AI assistants'),
  ('ai.configure',     'ai', 'Configure AI prompts'),
  -- Analytics
  ('analytics.view',   'analytics', 'View dashboards'),
  -- Admin
  ('admin.users',      'admin', 'Manage users and roles'),
  ('admin.billing',    'admin', 'Manage billing'),
  ('admin.settings',   'admin', 'Manage organization settings');

-- ----------------------------------------------------------------------------
-- Anchor organizations
-- ----------------------------------------------------------------------------
insert into organizations (id, slug, name, legal_name, industry, country, timezone, locale, plan, feature_flags) values
  ('11111111-1111-1111-1111-111111111111',
   'notaria-322',
   'Notaría Pública 322',
   'Notaría Pública No. 322 del Estado de Baja California',
   'legal',
   'MX', 'America/Tijuana', 'es-MX', 'enterprise',
   '{"crm":true,"bookings":true,"documents":true,"ai":true,"automations":true,"marketplace":false,"memberships":true}'::jsonb),
  ('22222222-2222-2222-2222-222222222222',
   'tropicco',
   'TropicCo Property Management',
   'TropicCo Property Management S. de R.L.',
   'real_estate',
   'MX', 'America/Tijuana', 'es-MX', 'enterprise',
   '{"crm":true,"bookings":true,"marketplace":true,"memberships":true,"vendors":true,"ai":true,"automations":true}'::jsonb);

-- ----------------------------------------------------------------------------
-- Default system roles (per org)
-- ----------------------------------------------------------------------------
do $$
declare org_id uuid;
begin
  for org_id in select id from organizations loop
    insert into user_roles (organization_id, key, display_name, description, is_system, permissions) values
      (org_id, 'admin',          'Administrator',  'Full access to everything',            true,
        '["admin.users","admin.billing","admin.settings","crm.clients.read","crm.clients.write","crm.clients.delete","crm.pipelines.read","crm.pipelines.write","crm.tasks.read","crm.tasks.write","bookings.read","bookings.write","bookings.cancel","listings.read","listings.write","memberships.read","memberships.write","documents.read","documents.write","documents.sign","automations.read","automations.write","ai.use","ai.configure","analytics.view"]'::jsonb),
      (org_id, 'manager',        'Manager',        'Manages teams and operations',         true,
        '["crm.clients.read","crm.clients.write","crm.pipelines.read","crm.pipelines.write","crm.tasks.read","crm.tasks.write","bookings.read","bookings.write","bookings.cancel","listings.read","listings.write","memberships.read","memberships.write","documents.read","documents.write","automations.read","automations.write","ai.use","analytics.view"]'::jsonb),
      (org_id, 'employee',       'Employee',       'Day-to-day staff member',              true,
        '["crm.clients.read","crm.clients.write","crm.tasks.read","crm.tasks.write","bookings.read","bookings.write","documents.read","documents.write","ai.use"]'::jsonb),
      (org_id, 'sales_agent',    'Sales Agent',    'Sales and pipeline management',        true,
        '["crm.clients.read","crm.clients.write","crm.pipelines.read","crm.pipelines.write","crm.tasks.read","crm.tasks.write","listings.read","bookings.read","bookings.write","ai.use"]'::jsonb),
      (org_id, 'lawyer',         'Lawyer',         'Legal professional',                   true,
        '["crm.clients.read","crm.clients.write","crm.tasks.read","crm.tasks.write","documents.read","documents.write","documents.sign","ai.use"]'::jsonb),
      (org_id, 'vendor',         'Vendor',         'External vendor / contractor',         true,
        '["bookings.read","listings.read","documents.read"]'::jsonb),
      (org_id, 'property_owner', 'Property Owner', 'Owns properties managed by the org',   true,
        '["bookings.read","documents.read","analytics.view"]'::jsonb),
      (org_id, 'tenant',         'Tenant',         'Renting a property',                   true,
        '["bookings.read","documents.read"]'::jsonb),
      (org_id, 'client',         'Client',         'External client w/ portal access',     true,
        '["bookings.read","documents.read"]'::jsonb);
  end loop;
end$$;

-- ----------------------------------------------------------------------------
-- Default pipelines (one per anchor org)
-- ----------------------------------------------------------------------------
-- Notaría: legal cases pipeline
with p as (
  insert into pipelines (organization_id, name, description, entity_type, is_default)
  values ('11111111-1111-1111-1111-111111111111', 'Casos Notariales', 'Procedimientos legales y trámites', 'client', true)
  returning id
)
insert into pipeline_stages (pipeline_id, name, position, color)
  select p.id, s.name, s.pos, s.color from p,
  (values
    ('Consulta inicial', 1, '#A1A1AA'),
    ('Documentación', 2, '#D4A574'),
    ('Revisión legal', 3, '#E8C99B'),
    ('Firma', 4, '#4ADE80'),
    ('Archivado', 5, '#52525B')
  ) as s(name, pos, color);

-- TropicCo: sales pipeline
with p as (
  insert into pipelines (organization_id, name, description, entity_type, is_default)
  values ('22222222-2222-2222-2222-222222222222', 'Sales Pipeline', 'Property sales and rentals', 'client', true)
  returning id
)
insert into pipeline_stages (pipeline_id, name, position, color, win_probability, is_won, is_lost)
  select p.id, s.name, s.pos, s.color, s.prob, s.won, s.lost from p,
  (values
    ('Lead', 1, '#A1A1AA', 0.10, false, false),
    ('Qualified', 2, '#D4A574', 0.30, false, false),
    ('Viewing', 3, '#E8C99B', 0.50, false, false),
    ('Offer', 4, '#F4E5CC', 0.75, false, false),
    ('Closed Won', 5, '#4ADE80', 1.00, true, false),
    ('Closed Lost', 6, '#F87171', 0.00, false, true)
  ) as s(name, pos, color, prob, won, lost);

-- ----------------------------------------------------------------------------
-- Default AI prompts (system-wide, organization_id null)
-- ----------------------------------------------------------------------------
insert into ai_prompts (organization_id, key, name, description, system_prompt, model, temperature, variables) values
  (null, 'website_concierge', 'Website Concierge',
   'Public-facing AI assistant for the marketing site',
   'You are the AI concierge for {{organization_name}}. Be warm, concise, and helpful. Guide visitors to book a consultation when appropriate. Reply in the visitor''s language; default to Spanish for Mexico.',
   'gpt-4o-mini', 0.7, '["organization_name"]'::jsonb),
  (null, 'crm_copilot', 'CRM Copilot',
   'Inside-app assistant for staff working in the CRM',
   'You are an internal CRM copilot. Summarize client activity, draft follow-ups, and suggest next actions. Be direct and operational — staff time is valuable.',
   'gpt-4o', 0.5, '[]'::jsonb),
  (null, 'sales_coach', 'Sales Coach',
   'Reviews call transcripts and coaches sales agents',
   'You are a sales coach. Review the provided call transcript. Identify objections, missed opportunities, sentiment shifts, and concrete coaching points. Be candid but constructive.',
   'gpt-4o', 0.4, '["transcript"]'::jsonb),
  (null, 'legal_drafter', 'Legal Drafter',
   'Drafts and reviews Mexican legal procedures',
   'Eres un asistente legal especializado en derecho mexicano, particularmente en derecho notarial de Baja California. Redacta y revisa documentos con precisión. Cita los artículos aplicables. Si no estás seguro, indícalo explícitamente.',
   'gpt-4o', 0.3, '["document_type","client_context"]'::jsonb),
  (null, 'property_advisor', 'Property Advisor',
   'Real-estate matching and advice',
   'You are a property advisor for TropicCo. Match clients to listings based on stated criteria. Surface tradeoffs honestly. Reply in the client''s language.',
   'gpt-4o-mini', 0.6, '["client_preferences","available_listings"]'::jsonb),
  (null, 'voice_realtime', 'Voice Real-Time Agent',
   'Low-latency voice agent for inbound/outbound calls',
   'You are a real-time voice agent. Keep replies under two sentences. Confirm key details. If unsure, offer to transfer to a human.',
   'gpt-4o-realtime-preview', 0.7, '["agent_role"]'::jsonb);
