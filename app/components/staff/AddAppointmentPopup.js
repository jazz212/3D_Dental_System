"use client";
import { useState, useEffect } from "react";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import {
  fieldClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./staffStyles";
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

  const clearForm = () => {
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
  };

  return (
    <Dialog title="New appointment" onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <div className={dialogBodyClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="new-patient-name" className={labelClass}>
                Patient name
              </label>
              <input
                id="new-patient-name"
                name="patientName"
                type="text"
                placeholder="Full name"
                value={formData.patientName}
                onChange={handleChange}
                className={fieldClass(fieldErrors.patientName)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="new-contact-number" className={labelClass}>
                Contact number
              </label>
              <input
                id="new-contact-number"
                name="contactNumber"
                type="text"
                placeholder="+63 9XX XXX XXXX"
                value={formData.contactNumber}
                onChange={handleChange}
                className={fieldClass(fieldErrors.contactNumber)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="new-date" className={labelClass}>
              Date
            </label>
            <input
              id="new-date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={fieldClass(fieldErrors.date)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="new-start-time" className={labelClass}>
                Start time
              </label>
              <select
                id="new-start-time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={fieldClass(fieldErrors.startTime)}
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
            <div className="flex flex-col gap-1">
              <label htmlFor="new-end-time" className={labelClass}>
                End time
              </label>
              <select
                id="new-end-time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={fieldClass(fieldErrors.endTime)}
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
            <label className={labelClass}>
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

          <div className="flex flex-col gap-1">
            <label htmlFor="new-notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="new-notes"
              name="notes"
              rows={4}
              placeholder="Optional notes or special instructions..."
              value={formData.notes}
              onChange={handleChange}
              className={`${fieldClass(fieldErrors.notes)} resize-none`}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}
        </div>

        <div className={dialogFooterClass}>
          <button type="button" onClick={clearForm} className={secondaryButtonClass}>
            Clear
          </button>
          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? "Saving..." : success ? "Saved" : "Save appointment"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
