"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, Clock, Stethoscope, ClipboardList } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const AGE_OPTIONS = Array.from({ length: 100 }, (_, i) => i + 1); // 1-100

const initialForm = {
  fullName: "",
  email: "",
  age: "",
  dateOfBirth: "",
  preferredDate: "",
  preferredTime: "",
  reason: "",
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

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter the patient's full name.";
    if (!form.email.trim()) next.email = "Enter an email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.preferredDate) next.preferredDate = "Choose a preferred date.";
    if (!form.reason) next.reason = "Select a reason for visit.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");
    try {
      const { error } = await supabase.rpc("submit_appointment_request", {
        p_full_name: form.fullName,
        p_email: form.email,
        p_age: form.age ? Number(form.age) : null,
        p_date_of_birth: form.dateOfBirth || null,
        p_preferred_date: form.preferredDate,
        p_preferred_time_window: form.preferredTime || null,
        p_reason: form.reason,
        p_notes: form.notes || null,
      });

      if (error) throw error;

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
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
      className="rounded-2xl border border-[#E4E6E0] bg-white p-8 shadow-sm"
    >
      <style>{`
        .age-scroll::-webkit-scrollbar { width: 6px; }
        .age-scroll::-webkit-scrollbar-track { background: transparent; }
        .age-scroll::-webkit-scrollbar-thumb { background-color: #8A8D82; border-radius: 9999px; }
        .age-scroll { scrollbar-width: thin; scrollbar-color: #8A8D82 transparent; }
      `}</style>

      <SectionHeading icon={<Calendar className="h-5 w-5" />} title="Patient Information" />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.fullName}>
          <input
            type="text"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className={inputClass(!!errors.fullName)}
          />
        </Field>
        <Field label="Email Address" required error={errors.email}>
          <input
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass(!!errors.email)}
          />
        </Field>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Age">
          <AgePicker value={form.age} onChange={(v) => update("age", v)} />
        </Field>
        <Field label="Date of Birth">
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value)}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <hr className="mb-8 border-[#E4E6E0]" />

      <SectionHeading icon={<ClipboardList className="h-5 w-5" />} title="Appointment Details" />

      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Preferred Date" required error={errors.preferredDate}>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D82]" />
            <input
              type="date"
              value={form.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              className={inputClass(!!errors.preferredDate) + " pl-9"}
            />
          </div>
        </Field>
        <Field label="Preferred Time">
          <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D82]" />
            <select
              value={form.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value)}
              className={inputClass(false) + " appearance-none pl-9"}
            >
              <option value="">Select a time window</option>
              {TIME_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      <div className="mb-6">
        <Field label="Reason for Visit" required error={errors.reason}>
          <div className="relative">
            <Stethoscope className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8D82]" />
            <select
              value={form.reason}
              onChange={(e) => update("reason", e.target.value)}
              className={inputClass(!!errors.reason) + " appearance-none pl-9"}
            >
              <option value="">Select a treatment or service</option>
              {TREATMENT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      <div className="mb-8">
        <Field label="Additional Notes (optional)">
          <textarea
            rows={4}
            placeholder="Please describe any specific symptoms or concerns..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className={inputClass(false) + " resize-none"}
          />
        </Field>
      </div>

      <hr className="mb-6 border-[#E4E6E0]" />

      <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-[#8A8D82]">
          <span className="text-red-500">*</span> Indicates required field
        </p>
        <div className="flex w-full gap-3 sm:w-auto">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 rounded-lg border border-[#D8DAD2] px-5 py-2.5 text-sm font-medium text-[#33362F] hover:bg-[#F2F3EF] sm:flex-none"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex-1 rounded-lg bg-[#1F4B3F] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#173A31] disabled:opacity-60 sm:flex-none"
          >
            {status === "submitting" ? "Submitting…" : "Request Booking →"}
          </button>
        </div>
      </div>

      {status === "success" && (
        <p className="mt-4 text-sm text-[#1F4B3F]">
          Request sent. We&apos;ll email you to confirm your booking.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">
          Something went wrong sending your request.
          {errorMessage ? ` ${errorMessage}` : " Try again."}
        </p>
      )}
    </form>
  );
}

/**
 * Age field that works two ways at once:
 * - Type a number directly into the box, like a normal input.
 * - Or open the dropdown and scroll/click a value from the list.
 * Neither is required — whoever's filling the form picks whichever is easier.
 */
function AgePicker({ value, onChange, placeholder = "Select your age" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && value && listRef.current) {
      const el = listRef.current.querySelector(`[data-age="${value}"]`);
      if (el) el.scrollIntoView({ block: "center" });
    }
  }, [open, value]);

  function handleManualChange(e) {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
    onChange(digitsOnly);
  }

  function handleSelect(age) {
    onChange(String(age));
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={inputClass(false) + " flex items-center justify-between gap-2"}
        onClick={() => setOpen(true)}
      >
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={handleManualChange}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent text-sm outline-none placeholder-[#A8AB9F]"
        />
        <ChevronDown
          className={`h-4 w-4 shrink-0 cursor-pointer text-[#8A8D82] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
        />
      </div>

      {open && (
        <div
          ref={listRef}
          className="age-scroll absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-[#D8DAD2] bg-white shadow-lg"
        >
          {AGE_OPTIONS.map((age) => (
            <div
              key={age}
              data-age={age}
              onClick={() => handleSelect(age)}
              className={`cursor-pointer px-4 py-2.5 text-sm hover:bg-[#F2F3EF] ${
                String(age) === value
                  ? "bg-[#1F4B3F]/5 font-semibold text-[#1F4B3F]"
                  : "text-[#33362F]"
              }`}
            >
              {age}
            </div>
          ))}
        </div>
      )}
    </div>
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

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold tracking-wide text-[#33362F]">
        {label.toUpperCase()} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-400" : "border-[#D8DAD2]"
  } bg-white px-3.5 py-2.5 text-sm text-[#33362F] placeholder-[#A8AB9F] outline-none focus:border-[#1F4B3F] focus:ring-1 focus:ring-[#1F4B3F]`;
}
