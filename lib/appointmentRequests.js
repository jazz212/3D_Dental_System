import { supabase } from "@/lib/supabase";
import { translateAppointmentError } from "@/lib/appointments";

// Set on errors we raise ourselves, so the UI can tell them apart from
// Postgres errors.
export const ALREADY_HANDLED_CODE = "REQUEST_ALREADY_HANDLED";

// Supabase errors are plain objects, which the Next.js error overlay shows as
// "{}". Spell out the fields as text so the real Postgres message is visible.
function describeError(error) {
  if (!error) return String(error);
  const parts = [error.message || String(error)];
  if (error.code) parts.push(`code: ${error.code}`);
  if (error.details) parts.push(`details: ${error.details}`);
  if (error.hint) parts.push(`hint: ${error.hint}`);
  return parts.join(" | ");
}

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

// Books the request into appointment_details, then marks it confirmed.
// These are two separate requests, so if the second one fails we delete the
// booking again; otherwise the slot would stay taken while the request still
// shows as pending.
// Resolves to { emailSent } once both writes succeed; a failed email never
// undoes the booking.
export async function confirmAppointmentRequest(request, slot) {
  const { data: booking, error: insertError } = await supabase
    .from("appointment_details")
    .insert({
      patient_name: request.requester_full_name,
      appointment_date: slot.date,
      start_time: slot.startTime,
      end_time: slot.endTime,
      service: request.reason,
      notes: request.notes,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error(`Could not book request ${request.id}:`, describeError(insertError));
    throw insertError;
  }

  // Only flip rows still 'requested', so two staff confirming the same
  // request can't both succeed.
  const { data: updated, error: updateError } = await supabase
    .from("appointments")
    .update({ status: "confirmed" })
    .eq("id", request.id)
    .eq("status", "requested")
    .select("id");

  if (updateError || updated.length === 0) {
    await undoBooking(booking.id, request.id);

    if (updateError) {
      console.error(`Could not mark request ${request.id} as confirmed:`, describeError(updateError));
      throw updateError;
    }
    const handledError = new Error(`Request ${request.id} was no longer pending`);
    handledError.code = ALREADY_HANDLED_CODE;
    throw handledError;
  }

  // Sent only now, so a patient is never emailed about a booking we undid above.
  const emailSent = await sendConfirmationEmail(request.id, booking.id);
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

async function undoBooking(bookingId, requestId) {
  const { error } = await supabase
    .from("appointment_details")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(
      `Booked ${bookingId} but request ${requestId} is still pending, and the booking couldn't be removed. Delete it from All Appointments before confirming again:`,
      describeError(error),
    );
  }
}
