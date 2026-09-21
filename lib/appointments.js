import { supabase } from "@/lib/supabaseClient";
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

export async function fetchAppointmentsPage(pageNumber, pageSize) {
  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("appointment_details")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      `Could not load appointments page ${pageNumber}. Check you're signed in and the table exists:`,
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
    .select("id, patient_name, contact_number, appointment_date, start_time, end_time, service, notes")
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
