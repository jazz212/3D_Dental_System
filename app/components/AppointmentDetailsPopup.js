"use client";
import { useState, useEffect } from "react";

export default function AppointmentDetailsPopup({ onClose, appointment }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const modalStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "scale(1)" : "scale(0.95)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time string (assuming it's in "HH:MM AM/PM" format already)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString; // Assuming it's already formatted correctly from the form
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" style={modalStyle}>
        {/* Section 1: Header — close button top-right, title below */}
        <div className="relative px-7 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &#x2715;
          </button>
          <h2 className="text-2xl font-bold text-gray-900 pr-8">
            Appointment Details
          </h2>
        </div>

        {/* Section 2: Appointment details */}
        <div className="px-7 py-4">
          <div className="space-y-4">
            {/* Patient Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Patient Name</label>
              <p className="text-base text-gray-900">{appointment.patient_name || "N/A"}</p>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Contact Number</label>
              <p className="text-base text-gray-900">{appointment.contact_number || "N/A"}</p>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-base text-gray-900">{formatDate(appointment.appointment_date)}</p>
            </div>

            {/* Start and End Time */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Time</label>
              <p className="text-base text-gray-900">
                {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
              </p>
            </div>

            {/* Service */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Service</label>
              <p className="text-base text-gray-900">{appointment.service || "N/A"}</p>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="text-base text-gray-900 whitespace-pre-line">
                {appointment.notes || "No notes"}
              </p>
            </div>

            {/* Created At (optional) */}
            <div className="flex flex-col gap-1 text-xs text-gray-400">
              <label className="text-xs font-medium text-gray-500">Created At</label>
              <p className="text-xs text-gray-400">
                {formatDate(appointment.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Footer — Close button */}
        <div className="flex items-center justify-end px-7 py-6">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}