-- ============================================================================
-- ROW LEVEL SECURITY
-- Principle: a user can only see rows belonging to organizations they're a member of.
-- For client-portal users, additionally restrict to their own client_id.
-- ============================================================================

-- Helper: current user's organization ids
create or replace function auth_org_ids()
returns setof uuid
language sql stable security definer as $$
  select organization_id from organization_members where user_id = auth.uid()
$$;

-- Helper: is the current user a member of this org?
create or replace function is_org_member(org uuid)
returns boolean
language sql stable security definer as $$
  select exists(
    select 1 from organization_members
    where user_id = auth.uid() and organization_id = org
  )
$$;

-- Helper: does the current user have a permission key in this org?
create or replace function has_permission(org uuid, perm text)
returns boolean
language sql stable security definer as $$
  select exists(
    select 1
    from user_role_assignments ura
    join user_roles r on r.id = ura.role_id
    where ura.user_id = auth.uid()
      and ura.organization_id = org
      and (r.permissions ? perm or r.key = 'admin')
  )
$$;

-- ============================================================================
-- Enable RLS on every tenant-scoped table
-- ============================================================================
alter table organizations enable row level security;
alter table users enable row level security;
alter table organization_members enable row level security;
alter table user_roles enable row level security;
alter table user_role_assignments enable row level security;
alter table clients enable row level security;
alter table vendors enable row level security;
alter table pipelines enable row level security;
alter table pipeline_stages enable row level security;
alter table pipeline_records enable row level security;
alter table tasks enable row level security;
alter table activity_logs enable row level security;
alter table crm_logs enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;
alter table orders enable row level security;
alter table transactions enable row level security;
alter table invoices enable row level security;
alter table membership_plans enable row level security;
alter table memberships enable row level security;
alter table subscriptions enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table documents enable row level security;
alter table automations enable row level security;
alter table automation_runs enable row level security;
alter table ai_prompts enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table ai_memory enable row level security;
alter table ai_feedback enable row level security;
alter table calls enable row level security;
alter table call_transcripts enable row level security;
alter table call_scores enable row level security;

-- ============================================================================
-- Generic policy: a user can read/write rows in their own org
-- We programmatically create a "tenant_isolation" policy on each table
-- ============================================================================
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'clients','vendors','pipelines','pipeline_stages','pipeline_records',
      'tasks','activity_logs','crm_logs','listings','bookings','orders',
      'transactions','invoices','membership_plans','memberships','subscriptions',
      'messages','documents','automations','automation_runs','ai_conversations',
      'ai_memory','ai_feedback','calls','call_transcripts','call_scores',
      'user_roles','user_role_assignments'
    ])
  loop
    execute format($f$
      create policy tenant_select on %1$I for select
        using (organization_id in (select auth_org_ids()));
      create policy tenant_insert on %1$I for insert
        with check (organization_id in (select auth_org_ids()));
      create policy tenant_update on %1$I for update
        using (organization_id in (select auth_org_ids()))
        with check (organization_id in (select auth_org_ids()));
      create policy tenant_delete on %1$I for delete
        using (organization_id in (select auth_org_ids()));
    $f$, t);
  end loop;
end$$;

-- Organizations: members can read their own org
create policy org_select on organizations for select
  using (id in (select auth_org_ids()));

-- Users: anyone can read themselves; org members can read users in shared orgs
create policy users_select_self on users for select
  using (id = auth.uid());

create policy users_select_org on users for select
  using (
    id in (
      select om.user_id from organization_members om
      where om.organization_id in (select auth_org_ids())
    )
  );

create policy users_update_self on users for update
  using (id = auth.uid()) with check (id = auth.uid());

-- Organization members: visible to org members
create policy om_select on organization_members for select
  using (organization_id in (select auth_org_ids()));

-- Notifications: user-scoped, not org-scoped
create policy notif_select on notifications for select
  using (user_id = auth.uid());
create policy notif_update on notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ai_prompts: system-wide prompts (org_id null) are readable by all
create policy aip_select on ai_prompts for select
  using (organization_id is null or organization_id in (select auth_org_ids()));
create policy aip_insert on ai_prompts for insert
  with check (organization_id in (select auth_org_ids()));
create policy aip_update on ai_prompts for update
  using (organization_id in (select auth_org_ids()))
  with check (organization_id in (select auth_org_ids()));

-- ai_messages: gated through ai_conversations
create policy aim_select on ai_messages for select
  using (
    conversation_id in (
      select id from ai_conversations
      where organization_id in (select auth_org_ids())
    )
  );
create policy aim_insert on ai_messages for insert
  with check (
    conversation_id in (
      select id from ai_conversations
      where organization_id in (select auth_org_ids())
    )
  );
