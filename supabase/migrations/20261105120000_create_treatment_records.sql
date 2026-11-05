-- Treatment Records: one row per procedure done for a patient, with what it
-- cost and what was paid. Additive only: nothing existing is changed.

create table public.treatment_records (
  id uuid primary key default gen_random_uuid(),
  -- RESTRICT: a patient with treatment (billing) history can't be deleted by
  -- accident; patients are archived instead of deleted in normal use.
  patient_id uuid not null references public.patients(id) on delete restrict,
  procedure_date date not null default current_date,
  procedure text not null check (length(btrim(procedure)) > 0),
  -- FDI numbers, the same system as the 3D chart. null = no specific tooth
  -- (e.g. cleaning).
  tooth_numbers smallint[],
  dentist text,
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  amount_paid numeric(12,2) not null default 0 check (amount_paid >= 0),
  balance numeric(12,2) generated always as (total_amount - amount_paid) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Only permanent teeth 11-18, 21-28, 31-38, 41-48: the ones the 3D chart has.
  constraint treatment_records_tooth_numbers_fdi check (
    tooth_numbers is null
    or (
      cardinality(tooth_numbers) > 0
      and tooth_numbers <@ array[
        11,12,13,14,15,16,17,18,
        21,22,23,24,25,26,27,28,
        31,32,33,34,35,36,37,38,
        41,42,43,44,45,46,47,48
      ]::smallint[]
    )
  )
);

create index treatment_records_patient_id_idx on public.treatment_records (patient_id);

-- Keeps updated_at current on every edit.
create function public.treatment_records_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger treatment_records_set_updated_at
before update on public.treatment_records
for each row execute function public.treatment_records_set_updated_at();

-- With RLS on, only rows a policy allows can be read or written.
alter table public.treatment_records enable row level security;

-- Same rules as public.patients: signed-in staff only, via public.is_staff().
create policy "Staff can view treatment records"
on public.treatment_records for select to authenticated
using (public.is_staff());

create policy "Staff can insert treatment records"
on public.treatment_records for insert to authenticated
with check (public.is_staff());

create policy "Staff can update treatment records"
on public.treatment_records for update to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "Staff can delete treatment records"
on public.treatment_records for delete to authenticated
using (public.is_staff());
