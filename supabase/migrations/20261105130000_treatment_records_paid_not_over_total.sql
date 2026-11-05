-- A payment larger than the procedure's total is a typing mistake: it would
-- show a negative balance and reduce the patient's total balance owed.
-- The table was empty when this was added, so no existing row breaks it.
alter table public.treatment_records
  add constraint treatment_records_paid_not_over_total
  check (amount_paid <= total_amount);
