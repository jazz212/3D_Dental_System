"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { fetchOperatingHours, saveOperatingHours } from "@/lib/clinicSettings";
import { formatTime } from "@/lib/appointmentTimes";

const inputClass =
  "bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F] disabled:opacity-50";

// Used until the dentist saves their own hours (the database starts empty).
const DEFAULT_HOURS = [
  { day: "Monday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
  { day: "Tuesday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
  { day: "Wednesday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
  { day: "Thursday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
  { day: "Friday", isOpen: true, openTime: "08:00", closeTime: "18:00" },
  { day: "Saturday", isOpen: false, openTime: "08:00", closeTime: "18:00" },
  { day: "Sunday", isOpen: false, openTime: "08:00", closeTime: "18:00" },
];

// Every half hour from 6:00 AM to 10:00 PM, as "HH:MM".
function buildTimeOptions() {
  const options = [];
  for (let minutes = 6 * 60; minutes <= 22 * 60; minutes += 30) {
    const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mins = String(minutes % 60).padStart(2, "0");
    options.push(`${hours}:${mins}`);
  }
  return options;
}
const TIME_OPTIONS = buildTimeOptions();

// Always show all seven days in order, even if the saved list is empty or
// missing a day; a missing day falls back to its default.
function withAllDays(savedHours) {
  return DEFAULT_HOURS.map(
    (defaultDay) =>
      savedHours.find((savedDay) => savedDay.day === defaultDay.day) || defaultDay,
  );
}

// "HH:MM" strings compare correctly as text.
function hasInvalidTimes(dayHours) {
  return dayHours.isOpen && dayHours.closeTime <= dayHours.openTime;
}

export default function OperatingHoursEditor() {
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [savedHours, setSavedHours] = useState(DEFAULT_HOURS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null); // { type, text }

  // Bumped by "Try again" to re-run the loading effect.
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadHours = async () => {
      try {
        const loadedHours = withAllDays(await fetchOperatingHours());
        if (ignore) return;
        setHours(loadedHours);
        setSavedHours(loadedHours);
      } catch {
        if (!ignore) setLoadFailed(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadHours();
    return () => {
      ignore = true;
    };
  }, [loadAttempt]);

  const retryLoad = () => {
    setIsLoading(true);
    setLoadFailed(false);
    setLoadAttempt((attempt) => attempt + 1);
  };

  const updateDay = (day, field, value) => {
    setHours((prev) =>
      prev.map((dayHours) =>
        dayHours.day === day ? { ...dayHours, [field]: value } : dayHours,
      ),
    );
    setSaveMessage(null);
  };

  const isDirty = JSON.stringify(hours) !== JSON.stringify(savedHours);
  const hasErrors = hours.some(hasInvalidTimes);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveOperatingHours(hours);
      setSavedHours(hours);
      setSaveMessage({ type: "success", text: "Hours saved." });
    } catch {
      setSaveMessage({
        type: "error",
        text: "Hours weren't saved. Check your connection and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setHours(savedHours);
    setSaveMessage(null);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="flex items-center gap-2 font-bold text-lg">
        <Clock aria-hidden="true" className="w-5 h-5 text-[#00685F]" />
        Operating Hours
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Choose which days the clinic is open and the hours your dentists
        prefer.
      </p>

      {loadFailed ? (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          Operating hours couldn&apos;t be loaded.{" "}
          <button
            type="button"
            onClick={retryLoad}
            className="underline underline-offset-2 cursor-pointer hover:text-red-800"
          >
            Try again
          </button>
        </p>
      ) : (
        // Rows stay hidden while loading so the defaults never flash up as
        // if they were the clinic's saved hours.
        !isLoading && (
          <div className="mt-2 divide-y divide-gray-200">
            {hours.map((dayHours) => (
              <DayHoursRow
                key={dayHours.day}
                dayHours={dayHours}
                disabled={isSaving}
                onChange={updateDay}
              />
            ))}
          </div>
        )
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" aria-live="polite" className="text-sm">
          {isLoading && <span className="text-gray-500">Loading hours...</span>}
          {saveMessage?.type === "success" && (
            <span className="text-[#00685F]">{saveMessage.text}</span>
          )}
          {saveMessage?.type === "error" && (
            <span className="text-red-600">{saveMessage.text}</span>
          )}
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-gray-50 enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || hasErrors || isSaving}
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-[#004d45] enabled:active:scale-[0.97] enabled:active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save hours"}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- One day: Open/Closed plus opening and closing time ---------- */
function DayHoursRow({ dayHours, disabled, onChange }) {
  const { day, isOpen, openTime, closeTime } = dayHours;
  const showTimeError = hasInvalidTimes(dayHours);
  const errorId = `${day}-hours-error`;

  return (
    <div className="py-3">
      <div className="grid grid-cols-[6rem_1fr] items-center gap-x-3 gap-y-2 sm:grid-cols-[6rem_8rem_1fr]">
        <span className="font-medium">{day}</span>
        <select
          aria-label={`${day}: open or closed`}
          value={isOpen ? "open" : "closed"}
          onChange={(e) => onChange(day, "isOpen", e.target.value === "open")}
          disabled={disabled}
          className={inputClass}
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        {isOpen && (
          <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
            <select
              aria-label={`${day} opening time`}
              value={openTime}
              onChange={(e) => onChange(day, "openTime", e.target.value)}
              disabled={disabled}
              aria-invalid={showTimeError}
              aria-describedby={showTimeError ? errorId : undefined}
              className={`${inputClass} tabular-nums`}
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
            <span className="text-gray-500">to</span>
            <select
              aria-label={`${day} closing time`}
              value={closeTime}
              onChange={(e) => onChange(day, "closeTime", e.target.value)}
              disabled={disabled}
              aria-invalid={showTimeError}
              aria-describedby={showTimeError ? errorId : undefined}
              className={`${inputClass} tabular-nums`}
            >
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {showTimeError && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          Closing time must be after opening time.
        </p>
      )}
    </div>
  );
}
