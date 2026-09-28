"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { fetchOperatingHours, saveOperatingHours } from "@/lib/clinicSettings";
import { formatTime } from "@/lib/appointmentTimes";

const inputClass =
  "bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F] disabled:opacity-50";
const primaryButtonClass =
  "bg-[#00685F] px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-[#004d45] enabled:active:scale-[0.97] enabled:active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "bg-white border border-gray-300 rounded-lg px-4 py-2 cursor-pointer transition-all duration-150 ease-smooth enabled:hover:bg-gray-50 enabled:active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] disabled:cursor-not-allowed disabled:text-gray-400";
// Summary and editor swap in place; this fades the new one in.
const fadeInClass =
  "transition-opacity duration-200 ease-smooth starting:opacity-0 motion-reduce:transition-none";

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

// Date.getDay() numbers the week from Sunday (0).
const DAY_NAMES_FROM_SUNDAY = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
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

function describeHours(dayHours) {
  if (!dayHours.isOpen) return "Closed";
  return `${formatTime(dayHours.openTime)} – ${formatTime(dayHours.closeTime)}`;
}

// Joins neighbouring days that share the same hours, so a normal week reads
// as two lines ("Mon – Fri", "Sat – Sun") instead of seven.
function groupDaysWithSameHours(hours) {
  const groups = [];
  for (const dayHours of hours) {
    const text = describeHours(dayHours);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.text === text) {
      lastGroup.days.push(dayHours.day);
    } else {
      groups.push({ text, isOpen: dayHours.isOpen, days: [dayHours.day] });
    }
  }
  return groups;
}

// ["Monday"] -> "Monday"; ["Monday", ..., "Friday"] -> "Mon – Fri"
function describeDayRange(days) {
  if (days.length === 1) return days[0];
  return `${days[0].slice(0, 3)} – ${days[days.length - 1].slice(0, 3)}`;
}

export default function OperatingHoursEditor() {
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [savedHours, setSavedHours] = useState(DEFAULT_HOURS);
  // False until the dentist has saved hours at least once, so the summary
  // never presents the defaults as the clinic's real hours.
  const [hasSavedHours, setHasSavedHours] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null); // { type, text }
  // Bumped by "Try again" to re-run the loading effect.
  const [loadAttempt, setLoadAttempt] = useState(0);
  // Switching modes removes the button that was just pressed, so focus is
  // moved on purpose: into the editor when it opens, back to "Edit hours"
  // when it closes. Skipped on first render so the page doesn't grab focus.
  const editButtonRef = useRef(null);
  const firstFieldRef = useRef(null);
  const hasSwitchedModeRef = useRef(false);

  useEffect(() => {
    if (!hasSwitchedModeRef.current) return;
    if (isEditing) {
      firstFieldRef.current?.focus();
    } else {
      editButtonRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    let ignore = false;

    const loadHours = async () => {
      try {
        const storedHours = await fetchOperatingHours();
        if (ignore) return;
        const loadedHours = withAllDays(storedHours);
        setHours(loadedHours);
        setSavedHours(loadedHours);
        setHasSavedHours(storedHours.length > 0);
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
  };

  const isDirty = JSON.stringify(hours) !== JSON.stringify(savedHours);
  const hasErrors = hours.some(hasInvalidTimes);

  const startEditing = () => {
    hasSwitchedModeRef.current = true;
    setSaveMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setHours(savedHours);
    setSaveMessage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await saveOperatingHours(hours);
      setSavedHours(hours);
      setHasSavedHours(true);
      setIsEditing(false);
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

  const showEditButton = !isEditing && !isLoading && !loadFailed;

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg">Operating Hours</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Choose which days the clinic is open and the hours your dentists prefer."
              : "When the clinic is open each week."}
          </p>
        </div>
        {showEditButton && (
          <button
            ref={editButtonRef}
            type="button"
            onClick={startEditing}
            className={`${secondaryButtonClass} flex items-center gap-2`}
          >
            <Pencil aria-hidden="true" className="w-4 h-4 text-[#00685F]" />
            Edit hours
          </button>
        )}
      </div>

      {/* Always mounted, so screen readers announce text as it appears */}
      <p role="status" aria-live="polite" className="text-sm empty:hidden mt-2">
        {isLoading && <span className="text-gray-500">Loading hours...</span>}
        {saveMessage?.type === "success" && (
          <span className="text-gray-600">{saveMessage.text}</span>
        )}
      </p>

      {loadFailed && (
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
      )}

      {!isLoading && !loadFailed && !isEditing && (
        <div key="summary" className={fadeInClass}>
          {!hasSavedHours && (
            <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
              These are suggested hours and haven&apos;t been saved yet. Press
              Edit hours to set the clinic&apos;s real hours.
            </p>
          )}
          <HoursSummary hours={savedHours} showToday={hasSavedHours} />
        </div>
      )}

      {!isLoading && !loadFailed && isEditing && (
        <div key="editor" className={fadeInClass}>
          {/* Reads the week back as it's edited, in the same words as the summary */}
          <p className="mt-4 rounded-lg bg-[#F0FDFA] px-3 py-2 text-sm text-[#004D45]">
            {groupDaysWithSameHours(hours)
              .map((group) => `${describeDayRange(group.days)}: ${group.text}`)
              .join(" · ")}
          </p>

          <div className="mt-2 divide-y divide-gray-200">
            {hours.map((dayHours, index) => (
              <DayHoursRow
                key={dayHours.day}
                firstFieldRef={index === 0 ? firstFieldRef : undefined}
                dayHours={dayHours}
                disabled={isSaving}
                onChange={updateDay}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p role="alert" className="text-sm text-red-600">
              {saveMessage?.type === "error" && saveMessage.text}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={(hasSavedHours && !isDirty) || hasErrors || isSaving}
                className={primaryButtonClass}
              >
                {isSaving ? "Saving..." : "Save hours"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Read-only week: grouped days, today highlighted ---------- */
// showToday is off until real hours are saved: highlighting "Today" on
// suggested hours would state an opening time the clinic never set.
function HoursSummary({ hours, showToday }) {
  const today = showToday ? DAY_NAMES_FROM_SUNDAY[new Date().getDay()] : null;

  return (
    <dl className="mt-4 flex flex-col gap-1">
      {groupDaysWithSameHours(hours).map((group) => {
        const includesToday = group.days.includes(today);
        return (
          <div
            key={group.days[0]}
            className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg px-3 py-3 ${
              includesToday ? "bg-[#F0FDFA]" : ""
            }`}
          >
            <dt className="text-lg font-medium">
              {describeDayRange(group.days)}
              {includesToday && (
                <span className="ml-2 text-sm font-medium text-[#00685F]">
                  Today
                </span>
              )}
            </dt>
            <dd
              className={`text-lg tabular-nums ${
                group.isOpen ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {group.text}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ---------- One day in edit mode: Open/Closed plus opening and closing time ---------- */
function DayHoursRow({ dayHours, disabled, onChange, firstFieldRef }) {
  const { day, isOpen, openTime, closeTime } = dayHours;
  const showTimeError = hasInvalidTimes(dayHours);
  const errorId = `${day}-hours-error`;

  // Three columns only from xl: below that the panel is too narrow for the
  // day, status and both time dropdowns, so the times take their own line.
  return (
    <div className="py-3">
      <div className="grid grid-cols-[6rem_1fr] items-center gap-x-3 gap-y-2 xl:grid-cols-[6rem_8rem_1fr]">
        <span className="font-medium">{day}</span>
        <select
          ref={firstFieldRef}
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
          <div className="col-span-2 flex items-center gap-2 xl:col-span-1">
            <select
              aria-label={`${day} opening time`}
              value={openTime}
              onChange={(e) => onChange(day, "openTime", e.target.value)}
              disabled={disabled}
              aria-invalid={showTimeError}
              aria-describedby={showTimeError ? errorId : undefined}
              className={`${inputClass} min-w-0 tabular-nums`}
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
              className={`${inputClass} min-w-0 tabular-nums`}
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
