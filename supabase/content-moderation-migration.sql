-- Content moderation and copyright-risk controls for KLAS.
-- Run this once in Supabase SQL editor after the base schema and RGPD migration.

alter table public.resources drop constraint if exists resources_status_check;
alter table public.resources
  add constraint resources_status_check
  check (status in ('draft', 'pending_review', 'published', 'rejected'));

alter table public.resources alter column status set default 'pending_review';
alter table public.resources add column if not exists content_hash text;
alter table public.resources add column if not exists ownership_type text;
alter table public.resources add column if not exists source_title text;
alter table public.resources add column if not exists source_url text;
alter table public.resources add column if not exists license_name text;
alter table public.resources add column if not exists rights_confirmed_at timestamptz;
alter table public.resources add column if not exists moderation_flags text[] not null default '{}';
alter table public.resources add column if not exists moderation_notes text;
alter table public.resources add column if not exists reviewed_at timestamptz;
alter table public.resources add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;

alter table public.resources drop constraint if exists resources_ownership_type_check;
alter table public.resources
  add constraint resources_ownership_type_check
  check (ownership_type is null or ownership_type in ('own_work', 'licensed', 'public_domain', 'permission'));

create index if not exists resources_content_hash_idx on public.resources(content_hash);
create index if not exists resources_pending_review_idx on public.resources(created_at desc) where status = 'pending_review';

create table if not exists public.blocked_file_hashes (
  hash text primary key,
  reason text not null default 'rights_or_safety',
  source_resource_id uuid references public.resources(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.resource_reports (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reporter_email text,
  reason text not null check (reason in ('copyright', 'privacy', 'illegal', 'spam', 'quality', 'other')),
  details text not null check (char_length(details) between 20 and 2000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'rejected')),
  resolution_notes text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create or replace function public.is_file_hash_blocked(candidate_hash text)
returns boolean
language sql
security definer
set search_path = public
as 'select exists (select 1 from public.blocked_file_hashes where hash = candidate_hash);';

revoke all on function public.is_file_hash_blocked(text) from public;
grant execute on function public.is_file_hash_blocked(text) to authenticated;

alter table public.blocked_file_hashes enable row level security;
alter table public.resource_reports enable row level security;

drop policy if exists "No public read blocked hashes" on public.blocked_file_hashes;
create policy "No public read blocked hashes" on public.blocked_file_hashes for select using (false);

drop policy if exists "Anyone can report resources" on public.resource_reports;
create policy "Anyone can report resources" on public.resource_reports for insert with check (true);

drop policy if exists "Reporters read own reports" on public.resource_reports;
create policy "Reporters read own reports" on public.resource_reports
for select to authenticated
using (auth.uid() = reporter_id);

drop policy if exists "Published resources are readable" on public.resources;
create policy "Published resources are readable" on public.resources
for select
using (status = 'published' or auth.uid() = author_id);

drop policy if exists "Authenticated users create resources" on public.resources;
create policy "Authenticated users create resources" on public.resources
for insert to authenticated
with check (auth.uid() = author_id and status in ('draft', 'pending_review'));
