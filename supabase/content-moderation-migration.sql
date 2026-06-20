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

create table if not exists public.moderator_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_moderator()
returns boolean
language sql
security definer
set search_path = public
as 'select exists (select 1 from public.moderator_emails where lower(email) = lower(coalesce(auth.jwt() ->> ''email'', '''')));';

revoke all on function public.is_moderator() from public;
grant execute on function public.is_moderator() to authenticated;

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
alter table public.moderator_emails enable row level security;

drop policy if exists "No public read blocked hashes" on public.blocked_file_hashes;
create policy "No public read blocked hashes" on public.blocked_file_hashes for select using (false);

drop policy if exists "Anyone can report resources" on public.resource_reports;
create policy "Anyone can report resources" on public.resource_reports for insert with check (true);

drop policy if exists "Reporters read own reports" on public.resource_reports;
create policy "Reporters read own reports" on public.resource_reports
for select to authenticated
using (auth.uid() = reporter_id);

drop policy if exists "Moderators read moderator emails" on public.moderator_emails;
create policy "Moderators read moderator emails" on public.moderator_emails
for select to authenticated
using (public.is_moderator());

drop policy if exists "Published resources are readable" on public.resources;
create policy "Published resources are readable" on public.resources
for select
using (status = 'published' or auth.uid() = author_id);

drop policy if exists "Authenticated users create resources" on public.resources;
create policy "Authenticated users create resources" on public.resources
for insert to authenticated
with check (auth.uid() = author_id and status in ('draft', 'pending_review'));

drop policy if exists "Published resource files can be signed" on storage.objects;
create policy "Published resource files can be signed"
on storage.objects for select
using (
  bucket_id = 'resources'
  and exists (
    select 1 from public.resources
    where resources.storage_path = storage.objects.name
      and (resources.status = 'published' or resources.author_id = auth.uid() or public.is_moderator())
  )
);

create or replace function public.moderation_queue()
returns table (
  id uuid,
  title text,
  slug text,
  description text,
  category_name text,
  university_name text,
  subject_name text,
  author_email text,
  file_name text,
  file_type text,
  file_size bigint,
  storage_path text,
  status text,
  ownership_type text,
  source_title text,
  source_url text,
  license_name text,
  moderation_flags text[],
  report_count bigint,
  created_at timestamptz
)
language sql
security definer
set search_path = public, auth
as '
  select
    r.id,
    r.title,
    r.slug,
    r.description,
    r.category_name,
    r.university_name,
    r.subject_name,
    u.email::text as author_email,
    r.file_name,
    r.file_type,
    r.file_size,
    r.storage_path,
    r.status,
    r.ownership_type,
    r.source_title,
    r.source_url,
    r.license_name,
    r.moderation_flags,
    coalesce(count(rr.id), 0)::bigint as report_count,
    r.created_at
  from public.resources r
  left join auth.users u on u.id = r.author_id
  left join public.resource_reports rr on rr.resource_id = r.id and rr.status in (''open'', ''reviewing'')
  where public.is_moderator()
    and r.status = ''pending_review''
  group by r.id, u.email
  order by r.created_at asc;
';

revoke all on function public.moderation_queue() from public;
grant execute on function public.moderation_queue() to authenticated;

create or replace function public.open_resource_reports()
returns table (
  id uuid,
  resource_id uuid,
  resource_title text,
  reporter_email text,
  reason text,
  details text,
  status text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as '
  select
    rr.id,
    rr.resource_id,
    r.title as resource_title,
    rr.reporter_email,
    rr.reason,
    rr.details,
    rr.status,
    rr.created_at
  from public.resource_reports rr
  left join public.resources r on r.id = rr.resource_id
  where public.is_moderator()
    and rr.status in (''open'', ''reviewing'')
  order by rr.created_at asc;
';

revoke all on function public.open_resource_reports() from public;
grant execute on function public.open_resource_reports() to authenticated;

create or replace function public.moderate_resource(
  target_resource_id uuid,
  moderation_decision text,
  moderation_notes_input text default null,
  block_hash boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as '
declare
  current_hash text;
  resource_exists boolean;
begin
  if not public.is_moderator() then
    raise exception ''Not authorized'';
  end if;

  if moderation_decision not in (''approve'', ''reject'') then
    raise exception ''Invalid moderation decision'';
  end if;

  select true, content_hash into resource_exists, current_hash
  from public.resources
  where id = target_resource_id;

  if resource_exists is not true then
    raise exception ''Resource not found'';
  end if;

  update public.resources
  set
    status = case when moderation_decision = ''approve'' then ''published'' else ''rejected'' end,
    moderation_notes = moderation_notes_input,
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    updated_at = now()
  where id = target_resource_id;

  if moderation_decision = ''reject'' and block_hash and current_hash is not null then
    insert into public.blocked_file_hashes (hash, reason, source_resource_id)
    values (current_hash, ''moderation_rejected'', target_resource_id)
    on conflict (hash) do nothing;
  end if;
end;
';

revoke all on function public.moderate_resource(uuid, text, text, boolean) from public;
grant execute on function public.moderate_resource(uuid, text, text, boolean) to authenticated;

create or replace function public.resolve_resource_report(
  target_report_id uuid,
  report_status text,
  resolution_notes_input text default null
)
returns void
language plpgsql
security definer
set search_path = public
as '
begin
  if not public.is_moderator() then
    raise exception ''Not authorized'';
  end if;

  if report_status not in (''resolved'', ''rejected'') then
    raise exception ''Invalid report status'';
  end if;

  update public.resource_reports
  set
    status = report_status,
    resolution_notes = resolution_notes_input,
    resolved_at = now()
  where id = target_report_id;
end;
';

revoke all on function public.resolve_resource_report(uuid, text, text) from public;
grant execute on function public.resolve_resource_report(uuid, text, text) to authenticated;
