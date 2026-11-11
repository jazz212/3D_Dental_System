-- Display details for the account menu (avatar in the dashboard header).
--
-- public.staff only records who is staff (user_id, added_at); there is no
-- name, role or photo anywhere. This adds them in a new table instead of
-- changing public.staff. Safe to run more than once.
--
-- Rows are filled in by an admin (SQL Editor or Table Editor); staff can
-- read only their own row and cannot change it, so nobody can promote
-- themselves to "dentist". Until a row exists the menu shows the email
-- and "Staff".

begin;

create table if not exists public.staff_profiles (
  user_id uuid primary key references public.staff(user_id) on delete cascade,
  full_name text check (full_name is null or char_length(btrim(full_name)) between 1 and 100),
  role text not null default 'staff' check (role in ('dentist', 'staff')),
  -- Optional photo; any https image URL (for example a Supabase Storage
  -- public URL).
  avatar_url text check (avatar_url is null or avatar_url ~ '^https://'),
  created_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;

revoke all on public.staff_profiles from anon, authenticated;
grant select on public.staff_profiles to authenticated;

drop policy if exists "Staff can view their own profile" on public.staff_profiles;
create policy "Staff can view their own profile"
  on public.staff_profiles for select
  to authenticated
  using (user_id = auth.uid() and public.is_staff());

notify pgrst, 'reload schema';

commit;

-- Then add each staff member, for example:
--
-- insert into public.staff_profiles (user_id, full_name, role)
-- select id, 'Feliza Joy Taroy', 'dentist' from auth.users where email = 'dentist@example.com'
-- on conflict (user_id) do update set full_name = excluded.full_name, role = excluded.role;
