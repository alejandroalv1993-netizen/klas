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
  status text not null default 'published' check (status in ('draft', 'published', 'rejected')),
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
alter table public.resources add column if not exists status text not null default 'published';
alter table public.resources add column if not exists updated_at timestamptz not null default now();

create index if not exists resources_author_id_idx on public.resources(author_id);
create index if not exists resources_status_created_at_idx on public.resources(status, created_at desc);
create index if not exists resources_slug_idx on public.resources(slug);

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
create policy "Authenticated users create resources" on public.resources for insert to authenticated with check (auth.uid() = author_id);
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
      and (resources.status = 'published' or resources.author_id = auth.uid())
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
