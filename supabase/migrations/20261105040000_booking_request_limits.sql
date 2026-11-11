-- Spam limits for online booking requests, and the age worked out by the
-- database instead of trusted from the browser.
--
-- Anyone can call submit_appointment_request without signing in, so a script
-- could fill Pending Requests (and the notification bell) with junk. The
-- booking form has a hidden honeypot field, but a script that calls the
-- function directly skips the form, so the limits live here:
--   * at most 3 requests per email address per hour;
--   * at most 30 requests from everyone per hour (a small clinic gets far
--     fewer; when it's hit, real patients are told to call instead).
--
-- The age is now worked out from the date of birth on the clinic's date, so
-- requester_age can't disagree with requester_date_of_birth. p_age is still
-- accepted (the signature is unchanged) and used only when there's no date
-- of birth.
--
-- Run after 20261105030000_booking_dates_manila_time.sql: this replaces the
-- same function and keeps the Manila date and the 0-120 age range.
-- Adds one index; no table, column, policy or trigger is changed.

begin;

-- Makes the per-email count cheap.
create index if not exists idx_appointments_requester_email_created_at
  on public.appointments (requester_email, created_at);

create or replace function public.submit_appointment_request(
  p_full_name text,
  p_email text,
  p_age integer,
  p_date_of_birth date,
  p_preferred_date date,
  p_preferred_time_window text,
  p_reason text,
  p_notes text
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_appointment_id uuid;
  v_clinic_today date := (now() at time zone 'Asia/Manila')::date;
  v_email text := lower(btrim(p_email));
  v_age integer;
begin
  if p_full_name is null or btrim(p_full_name) = '' then
    raise exception 'Full name is required';
  end if;

  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'A valid email address is required';
  end if;

  if p_date_of_birth is not null and p_date_of_birth > v_clinic_today then
    raise exception 'Date of birth can''t be in the future';
  end if;

  v_age := case
    when p_date_of_birth is not null
      then extract(year from age(v_clinic_today, p_date_of_birth))::integer
    else p_age
  end;

  if v_age is not null and (v_age < 0 or v_age > 120) then
    raise exception 'Age must be between 0 and 120';
  end if;

  if p_preferred_date is null or p_preferred_date < v_clinic_today then
    raise exception 'Preferred date must be today or a future date';
  end if;

  -- p_reason may hold several services joined by ', '; every one must be valid.
  if p_reason is null or btrim(p_reason) = '' or exists (
    select 1
    from unnest(string_to_array(p_reason, ', ')) as r(item)
    where r.item not in (
      'General Checkup & Cleaning',
      'Teeth Whitening',
      'Dental Filling',
      'Root Canal Treatment',
      'Tooth Extraction',
      'Braces / Orthodontics Consultation',
      'Dental Implant Consultation',
      'Other / Not Sure'
    )
  ) then
    raise exception 'Invalid reason for visit';
  end if;

  if p_preferred_time_window is not null and p_preferred_time_window not in (
    'Morning (9:00 AM - 11:00 AM)',
    'Midday (11:00 AM - 2:00 PM)',
    'Afternoon (2:00 PM - 5:00 PM)'
  ) then
    raise exception 'Invalid preferred time window';
  end if;

  -- Checked last, so a typo in another field doesn't use up an attempt.
  -- These messages are shown on the booking form as they are.
  if (
    select count(*) from public.appointments
    where requester_email = v_email
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'We already have several requests from this email. Please wait for our reply, or call the clinic.';
  end if;

  if (
    select count(*) from public.appointments
    where created_at > now() - interval '1 hour'
  ) >= 30 then
    raise exception 'We''re receiving a lot of requests right now. Please call the clinic to book.';
  end if;

  -- No patients row here: staff create patients deliberately.
  insert into public.appointments (
    requester_full_name, requester_email, requester_age, requester_date_of_birth,
    preferred_date, preferred_time_window, reason, notes, status
  )
  values (
    btrim(p_full_name),
    v_email,
    v_age,
    p_date_of_birth,
    p_preferred_date,
    p_preferred_time_window,
    p_reason,
    nullif(btrim(coalesce(p_notes, '')), ''),
    'requested'
  )
  returning id into v_appointment_id;

  return v_appointment_id;
end;
$function$;

commit;
