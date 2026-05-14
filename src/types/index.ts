// ============================================================================
// AETHERION — CORE DOMAIN TYPES
// Hand-authored shapes. Regenerate database.types.ts from Supabase for the
// raw row types; these types compose them for the app layer.
// ============================================================================

export type UUID = string;
export type Timestamp = string;

export type OrgPlan = 'free' | 'starter' | 'pro' | 'enterprise';
export type UserStatus = 'active' | 'invited' | 'suspended' | 'archived';

export type SystemRoleKey =
  | 'admin'
  | 'manager'
  | 'employee'
  | 'sales_agent'
  | 'lawyer'
  | 'vendor'
  | 'property_owner'
  | 'tenant'
  | 'client';

export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';

export interface Organization {
  id: UUID;
  slug: string;
  name: string;
  legal_name: string | null;
  industry: string | null;
  logo_url: string | null;
  brand_config: Record<string, unknown>;
  feature_flags: Record<string, boolean>;
  settings: Record<string, unknown>;
  plan: OrgPlan;
  country: string;
  timezone: string;
  locale: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface User {
  id: UUID;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  status: UserStatus;
  last_active_at: Timestamp | null;
  metadata: Record<string, unknown>;
}

export interface UserRole {
  id: UUID;
  organization_id: UUID;
  key: string;
  display_name: string;
  description: string | null;
  is_system: boolean;
  permissions: string[];
}

export interface Client {
  id: UUID;
  organization_id: UUID;
  user_id: UUID | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  tags: string[];
  notes: string | null;
  custom_fields: Record<string, unknown>;
  lifecycle_stage: string | null;
  owner_id: UUID | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Pipeline {
  id: UUID;
  organization_id: UUID;
  name: string;
  description: string | null;
  entity_type: string;
  is_default: boolean;
  archived: boolean;
}

export interface PipelineStage {
  id: UUID;
  pipeline_id: UUID;
  name: string;
  position: number;
  win_probability: number | null;
  is_won: boolean;
  is_lost: boolean;
  color: string | null;
}

export interface Booking {
  id: UUID;
  organization_id: UUID;
  client_id: UUID | null;
  listing_id: UUID | null;
  assigned_to: UUID | null;
  title: string;
  status: BookingStatus;
  start_at: Timestamp;
  end_at: Timestamp | null;
  location: string | null;
  amount: number | null;
  currency: string;
  notes: string | null;
  metadata: Record<string, unknown>;
}

export interface Task {
  id: UUID;
  organization_id: UUID;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignee_id: UUID | null;
  due_date: Timestamp | null;
  related_type: string | null;
  related_id: UUID | null;
}

export interface AIPrompt {
  id: UUID;
  organization_id: UUID | null;
  key: string;
  name: string;
  description: string | null;
  system_prompt: string;
  model: string;
  temperature: number;
  variables: string[];
  tools: string[];
  version: number;
  is_active: boolean;
}

export interface AIConversation {
  id: UUID;
  organization_id: UUID;
  user_id: UUID | null;
  client_id: UUID | null;
  prompt_key: string | null;
  title: string | null;
}

export interface AIMessage {
  id: UUID;
  conversation_id: UUID;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  tool_calls: unknown | null;
  tokens_in: number | null;
  tokens_out: number | null;
  model: string | null;
  created_at: Timestamp;
}

// Automation engine — actions & conditions are plain JSON, so they're
// configurable at runtime without code changes.
export type AutomationTriggerType = 'event' | 'schedule' | 'webhook' | 'manual';

export interface AutomationCondition {
  field: string;
  op: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: unknown;
}

export interface AutomationAction {
  type: string; // 'send_email', 'create_task', 'webhook', 'ai_complete', ...
  params: Record<string, unknown>;
}

export interface Automation {
  id: UUID;
  organization_id: UUID;
  name: string;
  description: string | null;
  trigger_type: AutomationTriggerType;
  trigger_config: Record<string, unknown>;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
  last_run_at: Timestamp | null;
  run_count: number;
}
