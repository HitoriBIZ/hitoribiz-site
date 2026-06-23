-- HitoriBIZ Newsletter Phase 2 Supabase schema
-- Run this in the Supabase SQL editor before enabling the public subscribe form.

create extension if not exists pgcrypto;

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  company_name text not null default '',
  interests text[] not null default '{}',
  status text not null default 'active'
    check (status in ('active', 'unsubscribed', 'bounced', 'inactive')),
  consent_source text not null,
  consent_at timestamptz not null,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriber_tags (
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (subscriber_id, tag_id)
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  preview_text text not null default '',
  body text not null,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  sender_name text not null,
  reply_to text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaign_tags (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, tag_id)
);

create table if not exists public.campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  unsubscribed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  unique (campaign_id, subscriber_id)
);

create table if not exists public.unsubscribe_tokens (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.subscribers(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  subscriber_id uuid references public.subscribers(id) on delete set null,
  event_type text not null,
  url text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscribers_set_updated_at on public.subscribers;
create trigger subscribers_set_updated_at
before update on public.subscribers
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_updated_at on public.tags;
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

create index if not exists subscribers_status_idx on public.subscribers(status);
create index if not exists campaigns_status_scheduled_at_idx
  on public.campaigns(status, scheduled_at);
create index if not exists campaign_recipients_campaign_status_idx
  on public.campaign_recipients(campaign_id, status);
create index if not exists email_events_campaign_type_created_at_idx
  on public.email_events(campaign_id, event_type, created_at);

alter table public.subscribers enable row level security;
alter table public.tags enable row level security;
alter table public.subscriber_tags enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_tags enable row level security;
alter table public.campaign_recipients enable row level security;
alter table public.unsubscribe_tokens enable row level security;
alter table public.email_events enable row level security;
