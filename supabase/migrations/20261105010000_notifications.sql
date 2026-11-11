-- Staff notification center (the bell in the dashboard header).
-- Safe to run more than once. Creates new objects only; no existing table,
-- column, policy or trigger is changed.
--
-- Real schema this builds on:
--   appointments        = online requests: requester_full_name, patient_id,
--                         preferred_date, preferred_time_window, status
--                         ('requested' -> 'confirmed' | 'cancelled').
--   appointment_details = calendar bookings: patient_name, patient_id,
--                         appointment_date, start_time, status.
--
-- Event notifications come from triggers, so bookings from any source are
-- covered:
--   new_booking: a row inserted into appointments.
--   cancelled:   an appointments row, or a calendar booking in
--                appointment_details, moved to 'cancelled'.
-- Time-based ones come from refresh_notifications(p_today), which the bell
-- calls on load (no pg_cron needed); once per day each:
--   pending_reminder: requests waiting more than 24 hours.
--   visits_tomorrow:  confirmed calendar bookings on p_today + 1.
--
-- Read state is shared by all staff.

begin;

-- 1. Table -----------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null
    check (type in ('new_booking', 'cancelled', 'pending_reminder', 'visits_tomorrow')),
  title text not null,
  message text not null,
  -- The online request it is about; deleted with it.
  appointment_id uuid references public.appointments(id) on delete cascade,
  -- The calendar booking it is about (cancelled visits); deleted with it.
  booking_id uuid references public.appointment_details(id) on delete cascade,
  -- visits_tomorrow: the day the visits are on.
  target_date date,
  -- One notification per event or per day, e.g. 'new_booking:<id>' or
  -- 'visits_tomorrow:2026-11-06'. Inserts use ON CONFLICT DO NOTHING on it.
  dedupe_key text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Indexes ---------------------------------------------------------------

create unique index if not exists notifications_dedupe_key_idx
  on public.notifications (dedupe_key);
create index if not exists notifications_is_read_idx
  on public.notifications (is_read);
create index if not exists notifications_created_at_idx
  on public.notifications (created_at desc);
create index if not exists notifications_appointment_id_idx
  on public.notifications (appointment_id);
create index if not exists notifications_booking_id_idx
  on public.notifications (booking_id);

-- 3. Access: staff may read and flip is_read; anon gets nothing. Rows are
--    created only by the SECURITY DEFINER functions below.

alter table public.notifications enable row level security;

revoke all on public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;
grant update (is_read) on public.notifications to authenticated;

drop policy if exists "Staff can view notifications" on public.notifications;
create policy "Staff can view notifications"
  on public.notifications for select
  to authenticated
  using (public.is_staff());

drop policy if exists "Staff can mark notifications read" on public.notifications;
create policy "Staff can mark notifications read"
  on public.notifications for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- 4. Triggers on appointments (online requests) ------------------------------

-- INSERT: "Maria Santos booked Nov 12, Morning".
-- UPDATE to cancelled: "Maria Santos's request for Nov 12 was cancelled".
-- The name comes from the linked patient when there is one, else from the
-- request itself (online requests usually have no patient yet).
create or replace function public.notify_appointment_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_name text;
  v_window text := nullif(split_part(coalesce(new.preferred_time_window, ''), ' (', 1), '');
begin
  select p.full_name into v_name from public.patients p where p.id = new.patient_id;
  v_name := coalesce(v_name, new.requester_full_name);

  if tg_op = 'INSERT' then
    insert into public.notifications (type, title, message, appointment_id, dedupe_key)
    values (
      'new_booking',
      'New online booking',
      v_name || ' booked ' || to_char(new.preferred_date, 'Mon FMDD') || coalesce(', ' || v_window, ''),
      new.id,
      'new_booking:' || new.id
    )
    on conflict (dedupe_key) do nothing;
  elsif new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    insert into public.notifications (type, title, message, appointment_id, dedupe_key)
    values (
      'cancelled',
      'Request cancelled',
      v_name || '''s request for ' || to_char(new.preferred_date, 'Mon FMDD') || ' was cancelled',
      new.id,
      'appointment_cancelled:' || new.id
    )
    on conflict (dedupe_key) do nothing;
  end if;
  return null;
end;
$function$;

drop trigger if exists trg_notify_appointment_insert on public.appointments;
create trigger trg_notify_appointment_insert
  after insert on public.appointments
  for each row execute function public.notify_appointment_change();

drop trigger if exists trg_notify_appointment_cancelled on public.appointments;
create trigger trg_notify_appointment_cancelled
  after update of status on public.appointments
  for each row
  when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
  execute function public.notify_appointment_change();

-- 5. Trigger on appointment_details (calendar bookings) ---------------------
-- Visits on the calendar are cancelled here, not in appointments.
-- "Cancelled: Juan Dela Cruz, Nov 12, 10:00 AM".

create or replace function public.notify_booking_cancelled()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_name text;
begin
  select p.full_name into v_name from public.patients p where p.id = new.patient_id;

  insert into public.notifications (type, title, message, booking_id, dedupe_key)
  values (
    'cancelled',
    'Appointment cancelled',
    'Cancelled: ' || coalesce(v_name, new.patient_name)
      || ', ' || to_char(new.appointment_date, 'Mon FMDD')
      || ', ' || to_char(new.start_time, 'FMHH12:MI AM'),
    new.id,
    'booking_cancelled:' || new.id
  )
  on conflict (dedupe_key) do nothing;
  return null;
end;
$function$;

drop trigger if exists trg_notify_booking_cancelled on public.appointment_details;
create trigger trg_notify_booking_cancelled
  after update of status on public.appointment_details
  for each row
  when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
  execute function public.notify_booking_cancelled();

-- Trigger functions are never called directly.
revoke all on function public.notify_appointment_change() from public, anon, authenticated;
revoke all on function public.notify_booking_cancelled() from public, anon, authenticated;

-- 6. Daily reminders ----------------------------------------------------------
-- Called by the bell with the browser's own date, because the database runs
-- in UTC and the clinic does not. Staff only. Running it twice on the same
-- day adds nothing (dedupe_key).

create or replace function public.refresh_notifications(p_today date)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_pending integer;
  v_tomorrow integer;
begin
  if not public.is_staff() then
    raise exception 'Only staff can refresh notifications';
  end if;
  if p_today is null or p_today not between current_date - 1 and current_date + 1 then
    raise exception 'p_today must be today''s date';
  end if;

  select count(*) into v_pending
  from public.appointments
  where status = 'requested' and created_at < now() - interval '24 hours';

  if v_pending > 0 then
    insert into public.notifications (type, title, message, dedupe_key)
    values (
      'pending_reminder',
      'Awaiting confirmation',
      v_pending || case when v_pending = 1 then ' request is' else ' requests are' end
        || ' still awaiting confirmation',
      'pending_reminder:' || p_today
    )
    on conflict (dedupe_key) do nothing;
  end if;

  select count(*) into v_tomorrow
  from public.appointment_details
  where appointment_date = p_today + 1 and status = 'confirmed';

  if v_tomorrow > 0 then
    insert into public.notifications (type, title, message, target_date, dedupe_key)
    values (
      'visits_tomorrow',
      'Visits tomorrow',
      v_tomorrow || case when v_tomorrow = 1 then ' visit' else ' visits' end || ' tomorrow',
      p_today + 1,
      'visits_tomorrow:' || (p_today + 1)
    )
    on conflict (dedupe_key) do nothing;
  end if;
end;
$function$;

revoke all on function public.refresh_notifications(date) from public, anon;
grant execute on function public.refresh_notifications(date) to authenticated;

-- 7. Realtime: live updates for the bell. Realtime applies the SELECT policy
--    above, so only signed-in staff receive changes.

do $publication$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$publication$;

-- 8. Let the API see the new table and function right away (fixes PGRST205
--    and PGRST202 without waiting for the schema cache).
notify pgrst, 'reload schema';

commit;
