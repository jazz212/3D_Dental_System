"use client";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import {
  createAppointment,
  fetchBookedRanges,
  translateAppointmentError,
} from "@/lib/appointments";
import {
  START_TIME_OPTIONS,
  END_TIME_OPTIONS,
  isStartSlotTaken,
  isEndSlotTaken,
} from "@/lib/appointmentTimes";

const SERVICE_OPTIONS = [
  "Dental cleaning",
  "X-ray / Radiograph",
  "Tooth filling",
  "Tooth extraction",
  "Root canal treatment",
  "Crown placement",
  "Orthodontic adjustment",
  "Teeth whitening",
  "Consultation",
  "Fluoride treatment",
  "Dental implant",
];

export default function NewAppointment({ onClose, onAppointmentAdded }) {
  const [formData, setFormData] = useState({
    patientName: "",
    contactNumber: "",
    date: "",
    startTime: "",
    endTime: "",
    services: [],
    notes: "",
  });
  // Remember which date the ranges belong to, so ranges from a previously
  // picked date are ignored instead of reset inside the effect.
  const [booked, setBooked] = useState({ date: "", ranges: [] });
  const bookedRanges = booked.date === formData.date ? booked.ranges : [];

  useEffect(() => {
    if (!formData.date) return;

    const loadBookedRanges = async () => {
      try {
        const ranges = await fetchBookedRanges(formData.date, null);
        setBooked({ date: formData.date, ranges });
      } catch {
        // Already logged in lib; the database constraint still blocks overlaps.
      }
    };

    loadBookedRanges();
  }, [formData.date]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
    setError(null);
    setSuccess(false);
  };

  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
    setFieldErrors((prev) => ({ ...prev, service: false }));
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
    else if (isStartSlotTaken(formData.startTime, bookedRanges)) {
      setFieldErrors((prev) => ({ ...prev, startTime: true }));
      setError("This start time is inside another appointment.");
      isValid = false;
    }
    if (!formData.endTime) {
      setFieldErrors((prev) => ({ ...prev, endTime: true }));
      isValid = false;
    }
    else if (isEndSlotTaken(formData.endTime, formData.startTime, bookedRanges)) {
      setFieldErrors((prev) => ({ ...prev, endTime: true }));
      setError("End time must be after the start and can't run into another appointment.");
      isValid = false;
    }
    if (formData.services.length === 0) {
      setFieldErrors((prev) => ({ ...prev, service: true }));
      isValid = false;
    }

    if (!isValid) {
      setSubmitting(false);
      return;
    }

    try {
      // Several services are saved as one comma-separated value, the same
      // way online requests store them.
      await createAppointment({ ...formData, service: formData.services.join(", ") });

      setSuccess(true);
      // Notify parent that an appointment was added
      if (onAppointmentAdded) {
        onAppointmentAdded();
      }
      // Optionally reset form
      setFormData({
        patientName: "",
        contactNumber: "",
        date: "",
        startTime: "",
        endTime: "",
        services: [],
        notes: "",
      });
      // Clear field errors after successful submit
      setFieldErrors({
        patientName: false,
        contactNumber: false,
        date: false,
        startTime: false,
        endTime: false,
        service: false,
        notes: false,
      });
      // Close after a short delay to show success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(translateAppointmentError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto transition duration-200 starting:opacity-0 starting:scale-95 motion-reduce:transition-none">
        {/* Section 1: Header — icon + title + close button */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-gray-100">
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
              New appointment
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
        <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
          {/* Patient name + Contact number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Start time
              </label>
              <select
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.startTime ? "border-red-500" : ""}`}
              >
                <option value="">Select start time</option>
                {START_TIME_OPTIONS.map((slot) => (
                  <option
                    key={slot.value}
                    value={slot.value}
                    disabled={isStartSlotTaken(slot.value, bookedRanges)}
                  >
                    {slot.label}
                  </option>
                ))}
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
                className={`w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-[#00685F]/10 focus:border-[#00685F] ${fieldErrors.endTime ? "border-red-500" : ""}`}
              >
                <option value="">Select end time</option>
                {END_TIME_OPTIONS.map((slot) => (
                  <option
                    key={slot.value}
                    value={slot.value}
                    disabled={isEndSlotTaken(slot.value, formData.startTime, bookedRanges)}
                  >
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services — tick all that apply */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Services (select all that apply)
            </label>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-1 bg-[#F0FDFA] border rounded-xl p-3 ${fieldErrors.service ? "border-red-500" : "border-gray-300"}`}
            >
              {SERVICE_OPTIONS.map((service) => (
                <label
                  key={service}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-900 cursor-pointer hover:bg-white"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => toggleService(service)}
                    className="w-4 h-4 shrink-0 cursor-pointer accent-[#00685F]"
                  />
                  {service}
                </label>
              ))}
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
          <div className="flex items-center gap-3 px-5 sm:px-7 py-5 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3 bg-[#00685F] hover:bg-[#00524C] text-white text-sm font-semibold rounded-xl transition-colors ${
                submitting ? "opacity-80" : ""
              }`}
            >
              {submitting ? "Saving..." : "Save appointment"}
              {success && !submitting && (
                <Check className="ml-2 w-4 h-4 text-green-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  patientName: "",
                  contactNumber: "",
                  date: "",
                  startTime: "",
                  endTime: "",
                  services: [],
                  notes: "",
                });
                setError(null);
                setSuccess(false);
              }}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear
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
