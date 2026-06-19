create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) between 2 and 80),
  avatar_url text,
  reputation integer not null default 0 check (reputation >= 0),
  legal_accepted_at timestamptz,
  terms_version text,
  privacy_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists legal_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.profiles add column if not exists privacy_version text;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  university_id uuid references public.universities(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 5 and 140),
  slug text not null unique,
  description text not null check (char_length(description) between 20 and 2000),
  category_id uuid references public.categories(id) on delete set null,
  university_id uuid references public.universities(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  category_name text not null default '',
  university_name text not null default '',
  subject_name text not null default '',
  author_id uuid not null references public.profiles(id) on delete cascade,
  file_url text not null,
  storage_path text not null unique,
  file_name text not null,
  file_type text not null check (file_type in ('pdf', 'docx')),
  file_size bigint not null check (file_size > 0 and file_size <= 26214400),
  cover_image_url text,
  content_hash text,
  ownership_type text check (ownership_type is null or ownership_type in ('own_work', 'licensed', 'public_domain', 'permission')),
  source_title text,
  source_url text,
  license_name text,
  rights_confirmed_at timestamptz,
  moderation_flags text[] not null default '{}',
  moderation_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  status text not null default 'pending_review' check (status in ('draft', 'pending_review', 'published', 'rejected')),
  downloads_count integer not null default 0 check (downloads_count >= 0),
  rating_average numeric(2, 1) not null default 0 check (rating_average between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resources add column if not exists category_name text not null default '';
alter table public.resources add column if not exists university_name text not null default '';
alter table public.resources add column if not exists subject_name text not null default '';
alter table public.resources add column if not exists storage_path text;
alter table public.resources add column if not exists file_name text;
alter table public.resources add column if not exists file_type text;
alter table public.resources add column if not exists file_size bigint;
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
alter table public.resources add column if not exists status text not null default 'pending_review';
alter table public.resources add column if not exists updated_at timestamptz not null default now();

create index if not exists resources_author_id_idx on public.resources(author_id);
create index if not exists resources_status_created_at_idx on public.resources(status, created_at desc);
create index if not exists resources_slug_idx on public.resources(slug);
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
    and r.status in (''pending_review'', ''rejected'')
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
begin
  if not public.is_moderator() then
    raise exception ''Not authorized'';
  end if;

  if moderation_decision not in (''approve'', ''reject'') then
    raise exception ''Invalid moderation decision'';
  end if;

  select content_hash into current_hash
  from public.resources
  where id = target_resource_id;

  if current_hash is null then
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

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value integer not null check (value between 1 and 5),
  created_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (resource_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, legal_accepted_at, terms_version, privacy_version)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Estudiante'),
    nullif(new.raw_user_meta_data ->> 'legal_accepted_at', '')::timestamptz,
    new.raw_user_meta_data ->> 'terms_version',
    new.raw_user_meta_data ->> 'privacy_version'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.universities enable row level security;
alter table public.subjects enable row level security;
alter table public.resources enable row level security;
alter table public.ratings enable row level security;
alter table public.downloads enable row level security;
alter table public.favorites enable row level security;
alter table public.blocked_file_hashes enable row level security;
alter table public.resource_reports enable row level security;
alter table public.moderator_emails enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Categories are readable" on public.categories;
create policy "Categories are readable" on public.categories for select using (true);
drop policy if exists "Universities are readable" on public.universities;
create policy "Universities are readable" on public.universities for select using (true);
drop policy if exists "Subjects are readable" on public.subjects;
create policy "Subjects are readable" on public.subjects for select using (true);

drop policy if exists "Resources are readable" on public.resources;
drop policy if exists "Published resources are readable" on public.resources;
create policy "Published resources are readable" on public.resources for select using (status = 'published' or auth.uid() = author_id);
drop policy if exists "Authenticated users create resources" on public.resources;
create policy "Authenticated users create resources" on public.resources for insert to authenticated with check (auth.uid() = author_id and status in ('draft', 'pending_review'));
drop policy if exists "Authors update own resources" on public.resources;
create policy "Authors update own resources" on public.resources for update to authenticated using (auth.uid() = author_id) with check (auth.uid() = author_id);
drop policy if exists "Authors delete own resources" on public.resources;
create policy "Authors delete own resources" on public.resources for delete to authenticated using (auth.uid() = author_id);

drop policy if exists "Ratings are readable" on public.ratings;
create policy "Ratings are readable" on public.ratings for select using (true);
drop policy if exists "Users create own ratings" on public.ratings;
create policy "Users create own ratings" on public.ratings for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users update own ratings" on public.ratings;
create policy "Users update own ratings" on public.ratings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Downloads are readable by owner" on public.downloads;
create policy "Downloads are readable by owner" on public.downloads for select using (auth.uid() = user_id);
drop policy if exists "Anyone can register a download" on public.downloads;
create policy "Anyone can register a download" on public.downloads for insert with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Users read own favorites" on public.favorites;
create policy "Users read own favorites" on public.favorites for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users create own favorites" on public.favorites;
create policy "Users create own favorites" on public.favorites for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Users delete own favorites" on public.favorites;
create policy "Users delete own favorites" on public.favorites for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "No public read blocked hashes" on public.blocked_file_hashes;
create policy "No public read blocked hashes" on public.blocked_file_hashes for select using (false);

drop policy if exists "Anyone can report resources" on public.resource_reports;
create policy "Anyone can report resources" on public.resource_reports for insert with check (true);

drop policy if exists "Reporters read own reports" on public.resource_reports;
create policy "Reporters read own reports" on public.resource_reports for select to authenticated using (auth.uid() = reporter_id);

drop policy if exists "Moderators read moderator emails" on public.moderator_emails;
create policy "Moderators read moderator emails" on public.moderator_emails for select to authenticated using (public.is_moderator());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resources',
  'resources',
  false,
  26214400,
  array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users upload resources to own folder" on storage.objects;
create policy "Users upload resources to own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users update own resource files" on storage.objects;
create policy "Users update own resource files"
on storage.objects for update to authenticated
using (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users delete own resource files" on storage.objects;
create policy "Users delete own resource files"
on storage.objects for delete to authenticated
using (bucket_id = 'resources' and (storage.foldername(name))[1] = auth.uid()::text);

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

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
