"use client";
import { formatTime } from "@/lib/appointmentTimes";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import { secondaryButtonClass } from "./staffStyles";
import PhoneLink from "./PhoneLink";

// "T00:00" reads the date as local time; a bare date is parsed as UTC.
function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(`${dateString}T00:00`).toLocaleDateString(undefined, options);
}

export default function AppointmentDetailsPopup({ onClose, appointment }) {
  const details = [
    { label: "Patient name", value: appointment.patient_name || "N/A" },
    { label: "Contact number", value: <PhoneLink number={appointment.contact_number} fallback="N/A" /> },
    { label: "Date", value: formatDate(appointment.appointment_date) },
    {
      label: "Time",
      value: `${formatTime(appointment.start_time)} – ${formatTime(appointment.end_time)}`,
    },
    { label: "Service", value: appointment.service || "N/A" },
    { label: "Notes", value: appointment.notes || "No notes" },
  ];

  return (
    <Dialog title="Appointment details" onClose={onClose}>
      <div className={dialogBodyClass}>
        <dl className="divide-y divide-gray-200">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="grid grid-cols-1 gap-1 py-3 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-4"
            >
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="whitespace-pre-line">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-gray-500">
          Created {formatDate(appointment.created_at)}
        </p>
      </div>

      <div className={dialogFooterClass}>
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Close
        </button>
      </div>
    </Dialog>
  );
}
