"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Check } from "lucide-react";

// Helper function — converts "9:00 AM" style string to total minutes from midnight
function toMinutes(time) {
  const [hourMin, period] = time.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export default function EditAppointment({ onClose, onSave, appointment }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    patientName: appointment?.patient_name || "",
    contactNumber: appointment?.contact_number || "",
    date: appointment?.appointment_date || "",
    startTime: appointment?.start_time || "",
    endTime: appointment?.end_time || "",
    service: appointment?.service || "",
    notes: appointment?.notes || "",
  });
  const [bookedTimes, setBookedTimes] = useState({});

  // Fetch booked times for the selected date (excluding current appointment when editing)
  useEffect(() => {
    if (!formData.date) {
      setBookedTimes({});
      return;
    }

    const fetchBookedTimes = async () => {
      try {
        let query = supabase
          .from("appointment_details")
          .select("start_time, end_time, id")
          .eq("appointment_date", formData.date);

        // Exclude current appointment when editing ONLY if it's on the same date
        if (appointment?.id && appointment?.appointment_date === formData.date) {
          query = query.neq("id", appointment.id);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Convert to an object with booked times as keys for quick lookup
        const timesMap = {};
        data.forEach(appt => {
          if (appt.start_time) timesMap[appt.start_time] = true;
          if (appt.end_time) timesMap[appt.end_time] = true;
        });
        setBookedTimes(timesMap);
      } catch (err) {
        console.error("Error fetching booked times:", err);
        setBookedTimes({});
      }
    };

    fetchBookedTimes();
  }, [formData.date, appointment?.id, appointment?.appointment_date]);

  // Helper function to check if a time is booked for the selected date
  const isTimeBooked = (time) => {
    return bookedTimes[time] || false;
  };
  const [fieldErrors, setFieldErrors] = useState({
    patientName: false,
    contactNumber: false,
    date: false,
    startTime: false,
    endTime: false,
    service: false,
    notes: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const modalStyle = {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "scale(1)" : "scale(0.95)",
    transition: "opacity 0.2s ease, transform 0.2s ease",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Clear field errors at start of submit; will set if invalid
    setFieldErrors({
      patientName: false,
      contactNumber: false,
      date: false,
      startTime: false,
      endTime: false,
      service: false,
      notes: false,
    });

    // Validation
    let isValid = true;
    if (!formData.patientName.trim()) {
      setFieldErrors((prev) => ({ ...prev, patientName: true }));
      isValid = false;
    }
    if (!formData.date) {
      setFieldErrors((prev) => ({ ...prev, date: true }));
      isValid = false;
    }
    if (!formData.startTime) {
      setFieldErrors((prev) => ({ ...prev, startTime: true }));
      isValid = false;
    }
    else if (isTimeBooked(formData.startTime) && appointment && !(formData.date === appointment.appointment_date && formData.startTime === appointment.start_time)) {
      setFieldErrors((prev) => ({ ...prev, startTime: true }));
      setError("This start time is already booked for the selected date");
      isValid = false;
    }
    if (!formData.endTime) {
      setFieldErrors((prev) => ({ ...prev, endTime: true }));
      isValid = false;
    }
    else if (isTimeBooked(formData.endTime) && appointment && !(formData.date === appointment.appointment_date && formData.endTime === appointment.end_time)) {
      setFieldErrors((prev) => ({ ...prev, endTime: true }));
      setError("This end time is already booked for the selected date");
      isValid = false;
    }

    // Validate start time is before end time
    if (isValid && formData.startTime && formData.endTime) {
      const startMinutes = toMinutes(formData.startTime);
      const endMinutes = toMinutes(formData.endTime);
      if (startMinutes >= endMinutes) {
        setFieldErrors((prev) => ({ ...prev, startTime: true, endTime: true }));
        setError("Start time must be before end time");
        isValid = false;
      }
    }

    if (!isValid) {
      setSubmitting(false);
      return;
    }

    try {
      const { error: supabaseError } = await supabase
        .from("appointment_details")
        .update({
          patient_name: formData.patientName.trim(),
          contact_number: formData.contactNumber.trim(),
          appointment_date: formData.date,
          start_time: formData.startTime,
          end_time: formData.endTime,
          service: formData.service,
          notes: formData.notes.trim(),
        })
        .eq("id", appointment.id);

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      // Notify parent that an appointment was updated
      if (onSave) {
        onSave();
      }
      // Close after a short delay to show success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Failed to update appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form when appointment prop changes
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patient_name || "",
        contactNumber: appointment.contact_number || "",
        date: appointment.appointment_date || "",
        startTime: appointment.start_time || "",
        endTime: appointment.end_time || "",
        service: appointment.service || "",
        notes: appointment.notes || "",
      });
    }
  }, [appointment]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden" style={modalStyle}>
        {/* Section 1: Header — icon + title + close button */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-[#00685F]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <h2 className="text-2xl font-bold text-[#00685F]">
              Edit appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &#x2715;
          </button>
        </div>

        {/* Section 2: Form fields */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">
          {/* Patient name + Contact number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Patient name
              </label>
              <input
                name="patientName"
                type="text"
                placeholder="Full name"
                value={formData.patientName}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.patientName ? "border-red-500" : ""}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Contact number
              </label>
              <input
                name="contactNumber"
                type="text"
                placeholder="+63 9XX XXX XXXX"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.contactNumber ? "border-red-500" : ""}`}
              />
            </div>
          </div>

          {/* Date — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.date ? "border-red-500" : ""}`}
            />
          </div>

          {/* Start time + End time side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Start time
              </label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.startTime ? "border-red-500" : ""} ${isTimeBooked(formData.startTime) ? "text-gray-400 cursor-not-allowed" : ""}`}
              >
                <option value="">Select start time</option>
                <option value="8:00 AM" disabled={isTimeBooked("8:00 AM")}>8:00 AM</option>
                <option value="8:30 AM" disabled={isTimeBooked("8:30 AM")}>8:30 AM</option>
                <option value="9:00 AM" disabled={isTimeBooked("9:00 AM")}>9:00 AM</option>
                <option value="9:30 AM" disabled={isTimeBooked("9:30 AM")}>9:30 AM</option>
                <option value="10:00 AM" disabled={isTimeBooked("10:00 AM")}>10:00 AM</option>
                <option value="10:30 AM" disabled={isTimeBooked("10:30 AM")}>10:30 AM</option>
                <option value="11:00 AM" disabled={isTimeBooked("11:00 AM")}>11:00 AM</option>
                <option value="1:00 PM" disabled={isTimeBooked("1:00 PM")}>1:00 PM</option>
                <option value="1:30 PM" disabled={isTimeBooked("1:30 PM")}>1:30 PM</option>
                <option value="2:00 PM" disabled={isTimeBooked("2:00 PM")}>2:00 PM</option>
                <option value="2:30 PM" disabled={isTimeBooked("2:30 PM")}>2:30 PM</option>
                <option value="3:00 PM" disabled={isTimeBooked("3:00 PM")}>3:00 PM</option>
                <option value="3:30 PM" disabled={isTimeBooked("3:30 PM")}>3:30 PM</option>
                <option value="4:00 PM" disabled={isTimeBooked("4:00 PM")}>4:00 PM</option>
                <option value="4:30 PM" disabled={isTimeBooked("4:30 PM")}>4:30 PM</option>
                <option value="5:00 PM" disabled={isTimeBooked("5:00 PM")}>5:00 PM</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                End time
              </label>
              <select
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.endTime ? "border-red-500" : ""} ${isTimeBooked(formData.endTime) ? "text-gray-400 cursor-not-allowed" : ""}`}
              >
                <option value="">Select end time</option>
                <option value="8:30 AM">8:30 AM</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="9:30 AM">9:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM" disabled={isTimeBooked("11:30 AM")}>11:30 AM</option>
                <option value="12:00 PM" disabled={isTimeBooked("12:00 PM")}>12:00 PM</option>
                <option value="1:00 PM" disabled={isTimeBooked("1:00 PM")}>1:00 PM</option>
                <option value="1:30 PM">1:30 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="2:30 PM">2:30 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="3:30 PM">3:30 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="4:30 PM">4:30 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
            </div>
          </div>

          {/* Service dropdown — half width */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Service
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.service ? "border-red-500" : ""}`}
              >
                <option value="">Select service</option>
                <option value="Dental cleaning">Dental cleaning</option>
                <option value="X-ray / Radiograph">X-ray / Radiograph</option>
                <option value="Tooth filling">Tooth filling</option>
                <option value="Tooth extraction">Tooth extraction</option>
                <option value="Root canal treatment">
                  Root canal treatment
                </option>
                <option value="Crown placement">Crown placement</option>
                <option value="Orthodontic adjustment">
                  Orthodontic adjustment
                </option>
                <option value="Teeth whitening">Teeth whitening</option>
                <option value="Consultation">Consultation</option>
                <option value="Fluoride treatment">Fluoride treatment</option>
                <option value="Dental implant">Dental implant</option>
              </select>
            </div>
          </div>

          {/* Notes textarea — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Optional notes or special instructions..."
              value={formData.notes}
              onChange={handleChange}
              className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.notes ? "border-red-500" : ""}`}
            />
          </div>

          {/* Section 3: Footer — Save appointment + Clear */}
          <div className="flex items-center gap-3 px-7 py-5 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3 bg-[#00685F] hover:bg-[#00524C] text-white text-sm font-semibold rounded-xl transition-colors ${
                submitting ? "opacity-80" : ""
              }`}
            >
              {submitting ? "Saving..." : "Save changes"}
              {success && !submitting && (
                <Check className="ml-2 w-4 h-4 text-green-500" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Status messages */}
          {error && (
            <p className=" mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}