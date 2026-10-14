import { supabase } from "@/lib/supabase";
import { translateAppointmentError } from "@/lib/appointments";
import { describeError } from "@/lib/errorLogging";

// Set on errors we raise ourselves, so the UI can tell them apart from
// Postgres errors.
export const ALREADY_HANDLED_CODE = "REQUEST_ALREADY_HANDLED";

// Turns a confirm error into a message staff can act on.
export function translateRequestError(error) {
  if (error?.code === ALREADY_HANDLED_CODE) {
    return "Someone already handled this request. The list has been refreshed.";
  }
  return translateAppointmentError(error);
}

// Full years between a "YYYY-MM-DD" date of birth and today, or null if
// there's no date yet. Negative means the date is in the future.
// Read from the parts directly so the time zone can't shift the day.
export function ageFromDateOfBirth(dateOfBirth) {
  const [year, month, day] = (dateOfBirth || "").split("-").map(Number);
  if (!year || !month || !day) return null;

  const today = new Date();
  const hadBirthdayThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthdayThisYear ? 0 : 1);
}

// Public booking form. Runs as a signed-out visitor, so it goes through the
// SECURITY DEFINER function instead of inserting into the tables directly.
export async function submitAppointmentRequest(form) {
  const { error } = await supabase.rpc("submit_appointment_request", {
    p_full_name: form.fullName,
    p_email: form.email,
    p_age: ageFromDateOfBirth(form.dateOfBirth),
    p_date_of_birth: form.dateOfBirth,
    p_preferred_date: form.preferredDate,
    p_preferred_time_window: form.preferredTime || null,
    // Several services go in as one comma-separated string; the database
    // function checks each one against its list.
    p_reason: form.reasons.join(", "),
    p_notes: form.notes || null,
  });

  if (error) {
    console.error(
      "Could not submit appointment request. The message below says which field the database rejected:",
      describeError(error),
    );
    throw error;
  }
}

// Online requests carry the requester's details on the row itself; they
// aren't linked to a patients record.
export async function fetchPendingRequests() {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      "id, requester_full_name, requester_email, requester_age, preferred_date, preferred_time_window, reason, notes, created_at",
    )
    .eq("status", "requested")
    .order("preferred_date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error(
      "Could not load pending requests. Check you're signed in and the appointments table exists:",
      describeError(error),
    );
    throw error;
  }
  return data;
}

// SQLSTATE raised by confirm_appointment_request() when the request was no
// longer 'requested' (someone else confirmed or declined it first, or the
// caller can't see it).
const REQUEST_NOT_PENDING_SQLSTATE = "TP001";

// Books the request into appointment_details and marks it confirmed in one
// database call, so both writes succeed or fail together: an overlap or a
// request someone else already handled leaves nothing half-saved.
// Resolves to { emailSent } once the booking is saved; a failed email never
// undoes the booking.
export async function confirmAppointmentRequest(request, slot) {
  const { data: bookingId, error } = await supabase.rpc("confirm_appointment_request", {
    p_request_id: request.id,
    p_appointment_date: slot.date,
    p_start_time: slot.startTime,
    p_end_time: slot.endTime,
  });

  if (error) {
    if (error.code === REQUEST_NOT_PENDING_SQLSTATE) {
      const handledError = new Error(`Request ${request.id} was no longer pending`);
      handledError.code = ALREADY_HANDLED_CODE;
      throw handledError;
    }
    // Overlap (23P01) and bad time range (23514) pass through unchanged, so
    // translateRequestError shows the same messages as before.
    console.error(`Could not confirm request ${request.id}:`, describeError(error));
    throw error;
  }

  // Sent only after the database call succeeded, so a patient is never
  // emailed about a booking that wasn't saved.
  const emailSent = await sendConfirmationEmail(request.id, bookingId);
  return { emailSent };
}

// Never throws: the booking is already saved, so a failed email is only
// logged and reported back as false.
async function sendConfirmationEmail(requestId, bookingId) {
  try {
    const { error } = await supabase.functions.invoke("send-appointment-confirmation", {
      body: { requestId, bookingId },
    });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(
      `Appointment confirmed but the email for request ${requestId} wasn't sent. Check the send-appointment-confirmation logs in Supabase, then contact the patient directly:`,
      describeError(error),
    );
    return false;
  }
}

// Only declines rows still 'requested', so it can't overwrite a request
// someone else already scheduled or declined.
export async function declineAppointmentRequest(requestId) {
  const { data: updated, error } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .eq("status", "requested")
    .select("id");

  if (error) {
    console.error(
      `Could not decline request ${requestId}. Check you're signed in and try again:`,
      describeError(error),
    );
    throw error;
  }
  if (updated.length === 0) {
    const handledError = new Error(`Request ${requestId} was no longer pending`);
    handledError.code = ALREADY_HANDLED_CODE;
    throw handledError;
  }
}
