-- Removes the table rights the signed-out (anon) role still holds.
--
-- Supabase grants anon full rights on new tables by default; only row-level
-- security has been stopping visitors from reading or changing them. The
-- public site never touches a table directly: booking goes through the
-- SECURITY DEFINER function submit_appointment_request, which runs as its
-- owner, so it keeps working. With these rights gone, one wrong policy can
-- no longer expose staff or clinical data.
--
-- Checked on 2026-11-05: no policy names anon or public, and the only public
-- function anon can execute is submit_appointment_request (left as it is).
-- Signed-in staff use the authenticated role, which this doesn't change.
--
-- Tables created later still get anon rights by Supabase's defaults; revoke
-- them in that table's migration if it isn't meant to be public.

begin;

revoke all on all tables in schema public from anon;

commit;
