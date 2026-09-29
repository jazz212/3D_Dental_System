"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Clock, ClipboardList } from "lucide-react";
import { ageFromDateOfBirth, submitAppointmentRequest } from "@/lib/appointmentRequests";
import { getLocalDateString } from "@/lib/appointmentTimes";

const TREATMENT_OPTIONS = [
  "General Checkup & Cleaning",
  "Teeth Whitening",
  "Dental Filling",
  "Root Canal Treatment",
  "Tooth Extraction",
  "Braces / Orthodontics Consultation",
  "Dental Implant Consultation",
  "Other / Not Sure",
];

const TIME_WINDOWS = [
  "Morning (9:00 AM - 11:00 AM)",
  "Midday (11:00 AM - 2:00 PM)",
  "Afternoon (2:00 PM - 5:00 PM)",
];

// Form fields in the order they appear, so a failed submit can jump to the
// first one with a problem (on a phone it may be far above the button).
const FIELD_ORDER = ["fullName", "email", "dateOfBirth", "preferredDate", "reasons"];

// The element to focus for each field; reasons focuses its first checkbox.
const FOCUS_TARGET_ID = {
  fullName: "booking-full-name",
  email: "booking-email",
  dateOfBirth: "booking-date-of-birth",
  preferredDate: "booking-preferred-date",
  reasons: "booking-reason-0",
};

const initialForm = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  preferredDate: "",
  preferredTime: "",
  reasons: [],
  notes: "",
};

export default function AppointmentForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleReason(treatment) {
    update(
      "reasons",
      form.reasons.includes(treatment)
        ? form.reasons.filter((r) => r !== treatment)
        : [...form.reasons, treatment],
    );
  }

  // Age is never typed in; it always comes from the date of birth, so the two can't disagree.
  const age = ageFromDateOfBirth(form.dateOfBirth);

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter the patient's full name.";
    if (!form.email.trim()) next.email = "Enter an email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.dateOfBirth) next.dateOfBirth = "Enter the patient's date of birth.";
    else if (age === null || age < 0) next.dateOfBirth = "Date of birth can't be in the future.";
    // Same 1-120 range the database accepts.
    else if (age < 1) next.dateOfBirth = "Patient must be at least 1 year old.";
    else if (age > 120) next.dateOfBirth = "Check the date of birth.";
    if (!form.preferredDate) next.preferredDate = "Choose a preferred date.";
    if (form.reasons.length === 0) next.reasons = "Select at least one reason for visit.";
    setErrors(next);
    return next;
  }

  function focusFirstError(foundErrors) {
    const firstField = FIELD_ORDER.find((field) => foundErrors[field]);
    const element = firstField && document.getElementById(FOCUS_TARGET_ID[firstField]);
    if (!element) return;
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      focusFirstError(foundErrors);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      await submitAppointmentRequest(form);

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      // Already logged in lib.
      setErrorMessage(err?.message || "");
      setStatus("error");
    }
  }

  function handleClear() {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    setErrorMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#E4E6E0] bg-white p-5 shadow-sm sm:p-8"
    >
      <SectionHeading icon={<Calendar className="h-5 w-5" />} title="Patient Information" />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full name" htmlFor="booking-full-name" required error={errors.fullName}>
          <input
            id="booking-full-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            maxLength={100}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            aria-invalid={!!errors.fullName}
            className={inputClass(!!errors.fullName)}
          />
        </Field>
        <Field label="Email address" htmlFor="booking-email" required error={errors.email}>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            maxLength={254}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Age" htmlFor="booking-age">
          <input
            id="booking-age"
            type="text"
            readOnly
            tabIndex={-1}
            aria-readonly="true"
            placeholder="Calculated from date of birth"
            value={age !== null && age >= 0 ? age : ""}
            className={inputClass(false) + " cursor-not-allowed bg-[#F2F3EF] text-[#8A8D82]"}
          />
        </Field>
        <Field label="Date of birth" htmlFor="booking-date-of-birth" required error={errors.dateOfBirth}>
          <input
            id="booking-date-of-birth"
            type="date"
            autoComplete="bday"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            aria-invalid={!!errors.dateOfBirth}
            className={inputClass(!!errors.dateOfBirth)}
          />
        </Field>
      </div>

      <hr className="mb-8 border-[#E4E6E0]" />

      <SectionHeading icon={<ClipboardList className="h-5 w-5" />} title="Appointment Details" />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="booking-preferred-date" required error={errors.preferredDate}>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D82]" />
            <input
              id="booking-preferred-date"
              type="date"
              // No past dates: a request is always for a visit still to come.
              // Set when the picker opens, in the browser: the server runs in
              // UTC, so between midnight and 8 AM here its "today" is yesterday.
              onFocus={(e) => {
                e.target.min = getLocalDateString(new Date());
              }}
              value={form.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              aria-invalid={!!errors.preferredDate}
              className={inputClass(!!errors.preferredDate) + " pl-9"}
            />
          </div>
        </Field>
        <Field label="Preferred time" htmlFor="booking-preferred-time">
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D82]" />
            <select
              id="booking-preferred-time"
              value={form.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
              className={inputClass(false) + " appearance-none pl-9 pr-9"}
            >
              <option value="">Select a time window</option>
              {TIME_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            {/* appearance-none removes the browser's arrow, so draw one to
                show this is a dropdown, not a text box. */}
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B5F55]" />
          </div>
        </Field>
      </div>

      {/* A group of checkboxes gets a fieldset + legend instead of a label, so
          screen readers announce the question before each option. */}
      <fieldset className="mb-6">
        <legend className="mb-2 block text-sm font-medium text-[#33362F]">
          Reason for visit (select all that apply) <span className="text-red-500">*</span>
        </legend>
        <div
          className={`grid grid-cols-1 gap-1 rounded-lg border p-2 sm:grid-cols-2 ${
            errors.reasons ? "border-red-400" : "border-[#D8DAD2]"
          }`}
        >
          {TREATMENT_OPTIONS.map((t, index) => (
            // Each row is at least 44px tall so it's easy to tap on a phone.
            <label
              key={t}
              htmlFor={`booking-reason-${index}`}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-base text-[#33362F] hover:bg-[#F2F3EF]"
            >
              <input
                id={`booking-reason-${index}`}
                type="checkbox"
                checked={form.reasons.includes(t)}
                onChange={() => toggleReason(t)}
                className="h-5 w-5 shrink-0 cursor-pointer accent-[#1F4B3F]"
              />
              {t}
            </label>
          ))}
        </div>
        {errors.reasons && (
          <p role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.reasons}
          </p>
        )}
      </fieldset>

      <div className="mb-8">
        <Field label="Additional notes (optional)" htmlFor="booking-notes">
          <textarea
            id="booking-notes"
            rows={4}
            placeholder="Please describe any specific symptoms or concerns..."
            maxLength={1000}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={inputClass(false) + " resize-none"}
          />
        </Field>
      </div>

      <hr className="mb-6 border-[#E4E6E0]" />

      {/* The one main action is full width on phones. "Clear form" is a quiet
          text button kept away from it, because a mis-tap wipes the form. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4 sm:justify-start">
          <p className="text-sm text-[#5B5F55]">
            <span className="text-red-500">*</span> Required
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="min-h-11 rounded-md px-2 text-sm font-medium text-[#5B5F55] underline underline-offset-4 hover:text-[#1F4B3F]"
          >
            Clear form
          </button>
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="min-h-12 w-full rounded-lg bg-[#1F4B3F] px-6 text-base font-semibold text-white hover:bg-[#173A31] disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Submitting…" : "Request Booking →"}
        </button>
      </div>

      {status === "success" && (
        <p role="status" className="mt-4 text-base font-medium text-[#1F4B3F]">
          Request sent. We&apos;ll email you to confirm your booking.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Something went wrong sending your request.
          {errorMessage ? ` ${errorMessage}` : " Try again."}
        </p>
      )}
    </form>
  );
}

function SectionHeading({ icon, title }) {
  return (
    <div className="mb-5 flex items-center gap-2 border-b border-[#E4E6E0] pb-4">
      <span className="text-[#1F4B3F]">{icon}</span>
      <h2 className="text-lg font-semibold text-[#1F4B3F]">{title}</h2>
    </div>
  );
}

// htmlFor ties the label to its input, so tapping the label focuses the
// field and screen readers read the label out.
function Field({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#33362F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-400" : "border-[#D8DAD2]"
  } bg-white px-3.5 py-2.5 text-base text-[#33362F] placeholder-[#8A8D82] outline-none focus:border-[#1F4B3F] focus:ring-1 focus:ring-[#1F4B3F]`;
}
