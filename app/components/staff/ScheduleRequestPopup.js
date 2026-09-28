"use client";
import { useState, useEffect } from "react";
import { fetchBookedRanges } from "@/lib/appointments";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import {
  fieldClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./staffStyles";
import {
  ALREADY_HANDLED_CODE,
  confirmAppointmentRequest,
  translateRequestError,
} from "@/lib/appointmentRequests";
import {
  START_TIME_OPTIONS,
  END_TIME_OPTIONS,
  getLocalDateString,
  isStartSlotTaken,
  isEndSlotTaken,
} from "@/lib/appointmentTimes";

export default function ScheduleRequestPopup({ request, onClose, onRequestHandled }) {
  const todayString = getLocalDateString(new Date());
  // A preferred date that has already passed can't be booked, so start blank.
  const [slot, setSlot] = useState({
    date: request.preferred_date >= todayString ? request.preferred_date : "",
    startTime: "",
    endTime: "",
  });
  // Same pattern as AddAppointmentPopup: ranges from a previously picked
  // date are ignored instead of reset inside the effect.
  const [booked, setBooked] = useState({ date: "", ranges: [] });
  const bookedRanges = booked.date === slot.date ? booked.ranges : [];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // The booking is saved but the email failed: keep the popup open with a
  // warning instead of closing, and stop it from being confirmed twice.
  const [emailFailed, setEmailFailed] = useState(false);

  useEffect(() => {
    if (!slot.date) return;

    const loadBookedRanges = async () => {
      try {
        const ranges = await fetchBookedRanges(slot.date, null);
        setBooked({ date: slot.date, ranges });
      } catch {
        // Already logged in lib; the database constraint still blocks overlaps.
      }
    };

    loadBookedRanges();
  }, [slot.date]);

  // Times picked for one day mean nothing on another, so a new date clears them.
  const handleDateChange = (e) => {
    setSlot({ date: e.target.value, startTime: "", endTime: "" });
    setError(null);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setSlot((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slot.date || !slot.startTime || !slot.endTime) {
      setError("Pick a date, start time and end time.");
      return;
    }
    if (isStartSlotTaken(slot.startTime, bookedRanges)) {
      setError("This start time is inside another appointment.");
      return;
    }
    if (isEndSlotTaken(slot.endTime, slot.startTime, bookedRanges)) {
      setError("End time must be after the start and can't run into another appointment.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const { emailSent } = await confirmAppointmentRequest(request, slot);
      onRequestHandled();
      if (emailSent) {
        onClose();
      } else {
        setEmailFailed(true);
      }
    } catch (err) {
      setError(translateRequestError(err));
      // Someone else confirmed it: refresh so it leaves the pending list.
      if (err?.code === ALREADY_HANDLED_CODE) onRequestHandled();
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Dialog title="Schedule request" onClose={onClose} wide>
      <form onSubmit={handleSubmit}>
        <div className={dialogBodyClass}>
          {/* What the patient asked for, read-only */}
          <div className="rounded-lg border border-gray-200 bg-[#F0FDFA] p-4 text-sm text-gray-700 flex flex-col gap-1">
            <p className="font-semibold text-gray-900">{request.requester_full_name}</p>
            <p>
              {request.requester_email}
              {request.requester_age ? ` · ${request.requester_age} yrs` : ""}
            </p>
            <p>
              <span className="font-medium text-gray-900">Reason:</span> {request.reason}
            </p>
            <p>
              <span className="font-medium text-gray-900">Preferred:</span> {request.preferred_date}
              {request.preferred_time_window ? `, ${request.preferred_time_window}` : ""}
            </p>
            {request.notes && (
              <p>
                <span className="font-medium text-gray-900">Notes:</span> {request.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="schedule-date" className={labelClass}>
              Date
            </label>
            <input
              id="schedule-date"
              type="date"
              min={todayString}
              value={slot.date}
              onChange={handleDateChange}
              className={fieldClass()}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="schedule-start-time" className={labelClass}>
                Start time
              </label>
              <select
                id="schedule-start-time"
                name="startTime"
                value={slot.startTime}
                onChange={handleTimeChange}
                disabled={!slot.date}
                className={fieldClass()}
              >
                <option value="">Select start time</option>
                {START_TIME_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={isStartSlotTaken(option.value, bookedRanges)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="schedule-end-time" className={labelClass}>
                End time
              </label>
              <select
                id="schedule-end-time"
                name="endTime"
                value={slot.endTime}
                onChange={handleTimeChange}
                disabled={!slot.date}
                className={fieldClass()}
              >
                <option value="">Select end time</option>
                {END_TIME_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={isEndSlotTaken(option.value, slot.startTime, bookedRanges)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}

          {emailFailed && (
            <p role="alert" className="text-sm text-amber-800 bg-amber-50 p-3 rounded">
              Confirmed, but the email couldn&apos;t be sent — contact the patient
              directly at {request.requester_email}.
            </p>
          )}
        </div>

        <div className={dialogFooterClass}>
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            {emailFailed ? "Close" : "Cancel"}
          </button>
          {!emailFailed && (
            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? "Confirming..." : "Confirm appointment"}
            </button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
