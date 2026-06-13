alter table public.profiles add column if not exists legal_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.profiles add column if not exists privacy_version text;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as 'begin
  insert into public.profiles (id, full_name, legal_accepted_at, terms_version, privacy_version)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> ''full_name'', ''Estudiante''),
    nullif(new.raw_user_meta_data ->> ''legal_accepted_at'', '''')::timestamptz,
    new.raw_user_meta_data ->> ''terms_version'',
    new.raw_user_meta_data ->> ''privacy_version''
  )
  on conflict (id) do nothing;
  return new;
end;';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as 'begin
  if auth.uid() is null then
    raise exception ''Not authenticated'';
  end if;
  delete from auth.users where id = auth.uid();
end;';

revoke all on function public.delete_my_account() from public;
grant execute on function public.delete_my_account() to authenticated;
