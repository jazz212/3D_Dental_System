-- Allow patients younger than 1 year old (age 0) to be booked and recorded.
--
-- The age columns stay as whole years: they feed the patient list's
-- age-group filter. The app now always fills them from the date of birth
-- and shows the finer age ("8 months") from the date of birth itself.
-- A generated column can't replace them, because Postgres only allows
-- immutable expressions there and age depends on current_date.

begin;

-- 1. Check constraints: "age > 0" becomes "age >= 0".
alter table public.patients
  drop constraint if exists patients_age_check;
alter table public.patients
  add constraint patients_age_check
  check (age is null or (age >= 0 and age <= 120));

alter table public.appointments
  drop constraint if exists appointments_requester_age_check;
alter table public.appointments
  add constraint appointments_requester_age_check
  check (requester_age is null or (requester_age >= 0 and requester_age <= 120));

-- 2. Public booking function: accept age 0 and reject a future date of
--    birth. Everything else is unchanged from the live definition.
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
begin
  if p_full_name is null or btrim(p_full_name) = '' then
    raise exception 'Full name is required';
  end if;

  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'A valid email address is required';
  end if;

  if p_age is not null and (p_age < 0 or p_age > 120) then
    raise exception 'Age must be between 0 and 120';
  end if;

  -- current_date is the server's (UTC) date, so this only catches dates
  -- clearly in the future; the form checks against the visitor's own date.
  if p_date_of_birth is not null and p_date_of_birth > current_date + 1 then
    raise exception 'Date of birth can''t be in the future';
  end if;

  if p_preferred_date is null or p_preferred_date < current_date then
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

  -- No patients row here: staff create patients deliberately.
  insert into public.appointments (
    requester_full_name, requester_email, requester_age, requester_date_of_birth,
    preferred_date, preferred_time_window, reason, notes, status
  )
  values (
    btrim(p_full_name),
    lower(btrim(p_email)),
    p_age,
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
