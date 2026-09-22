import { supabase } from "@/lib/supabase";
import { timeToMinutes } from "@/lib/appointmentTimes";

// Postgres error codes raised by the constraints on appointment_details.
const OVERLAP_ERROR_CODE = "23P01";
const CHECK_ERROR_CODE = "23514";

// Turns a database error into a message staff can act on.
export function translateAppointmentError(error) {
  if (error?.code === OVERLAP_ERROR_CODE) {
    return "That time overlaps another appointment. Pick a different slot.";
  }
  if (error?.code === CHECK_ERROR_CODE) {
    return "End time must be after start time.";
  }
  return "Appointment wasn't saved. Check your connection and try again.";
}

function buildAppointmentRow(formData) {
  return {
    patient_name: formData.patientName.trim(),
    contact_number: formData.contactNumber.trim(),
    appointment_date: formData.date,
    start_time: formData.startTime,
    end_time: formData.endTime,
    service: formData.service,
    notes: formData.notes.trim(),
  };
}

// Pass a status ("confirmed", ...) to show only that status; null shows all.
export async function fetchAppointmentsPage(pageNumber, pageSize, status) {
  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("appointment_details")
    .select("*", { count: "exact" });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      `Could not load appointments page ${pageNumber} (status: ${status || "all"}). Check you're signed in and the table exists:`,
      error,
    );
    throw error;
  }
  return { appointments: data, total: count || 0 };
}

// Its own query (not the table's current page) so the panel always shows
// the next visits in date order, whatever page the table is on.
export async function fetchUpcomingVisits(todayString, limit) {
  const { data, error } = await supabase
    .from("appointment_details")
    .select("id, patient_name, contact_number, appointment_date, start_time, end_time, service, notes, status")
    .gte("appointment_date", todayString)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(
      "Could not load upcoming visits. Check you're signed in:",
      error,
    );
    throw error;
  }
  return data;
}

// Returns the booked spans on a date as minutes, for disabling taken slots.
// Pass the appointment being edited as excludeId so it doesn't block itself.
export async function fetchBookedRanges(date, excludeId) {
  let query = supabase
    .from("appointment_details")
    .select("id, start_time, end_time")
    .eq("appointment_date", date);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    console.error(
      `Could not load booked times for ${date}; slots will look free but the database still blocks overlaps:`,
      error,
    );
    throw error;
  }
  return data.map((appointment) => ({
    startMinutes: timeToMinutes(appointment.start_time),
    endMinutes: timeToMinutes(appointment.end_time),
  }));
}

export async function createAppointment(formData) {
  const { error } = await supabase
    .from("appointment_details")
    .insert(buildAppointmentRow(formData));

  if (error) {
    console.error("Could not create appointment:", error);
    throw error;
  }
}

export async function updateAppointment(appointmentId, formData) {
  const { error } = await supabase
    .from("appointment_details")
    .update(buildAppointmentRow(formData))
    .eq("id", appointmentId);

  if (error) {
    console.error(`Could not update appointment ${appointmentId}:`, error);
    throw error;
  }
}

// Set on errors we raise ourselves when the row's status changed before
// ours was applied, so the UI can tell it apart from Postgres errors.
export const STATUS_ALREADY_CHANGED_CODE = "STATUS_ALREADY_CHANGED";

// Which statuses each quick action may start from. Mirrors the
// guard_appointment_status trigger, which rejects any other change.
export const STATUS_ACTION_FROM = {
  no_show: ["confirmed"],
  cancelled: ["requested", "confirmed"],
};

// Only updates the row if it's still in an allowed status, so it can't
// overwrite a change someone else just made.
export async function changeAppointmentStatus(appointmentId, newStatus) {
  const { data: updated, error } = await supabase
    .from("appointment_details")
    .update({ status: newStatus })
    .eq("id", appointmentId)
    .in("status", STATUS_ACTION_FROM[newStatus])
    .select("id");

  if (error) {
    console.error(
      `Could not set appointment ${appointmentId} to ${newStatus}. Check you're signed in:`,
      error,
    );
    throw error;
  }
  if (updated.length === 0) {
    const changedError = new Error(`Appointment ${appointmentId} status had already changed`);
    changedError.code = STATUS_ALREADY_CHANGED_CODE;
    throw changedError;
  }
}

export async function deleteAppointment(appointmentId) {
  const { error } = await supabase
    .from("appointment_details")
    .delete()
    .eq("id", appointmentId);

  if (error) {
    console.error(
      `Could not delete appointment ${appointmentId}. Check you're signed in:`,
      error,
    );
    throw error;
  }
}
