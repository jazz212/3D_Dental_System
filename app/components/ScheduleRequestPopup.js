"use client";
import { useState, useEffect } from "react";
import { fetchBookedRanges } from "@/lib/appointments";
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
      await confirmAppointmentRequest(request, slot);
      onRequestHandled();
      onClose();
    } catch (err) {
      setError(translateRequestError(err));
      // Someone else confirmed it: refresh so it leaves the pending list.
      if (err?.code === ALREADY_HANDLED_CODE) onRequestHandled();
    } finally {
      setSubmitting(false);
    }
  };

  const patient = request.patients;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto transition duration-200 starting:opacity-0 starting:scale-95 motion-reduce:transition-none">
        <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#00685F]">Schedule request</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
          >
            &#x2715;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-6 flex flex-col gap-5">
          {/* What the patient asked for, read-only */}
          <div className="rounded-xl bg-[#F0FDFA] p-4 text-sm text-gray-700 flex flex-col gap-1">
            <p className="font-semibold text-gray-900">{patient.full_name}</p>
            <p>
              {patient.email}
              {patient.age ? ` · ${patient.age} yrs` : ""}
            </p>
            <p>
              <span className="font-semibold">Reason:</span> {request.reason}
            </p>
            <p>
              <span className="font-semibold">Preferred:</span> {request.preferred_date}
              {request.preferred_time_window ? `, ${request.preferred_time_window}` : ""}
            </p>
            {request.notes && (
              <p>
                <span className="font-semibold">Notes:</span> {request.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              min={todayString}
              value={slot.date}
              onChange={handleDateChange}
              className="w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#00685F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Start time</label>
              <select
                name="startTime"
                value={slot.startTime}
                onChange={handleTimeChange}
                disabled={!slot.date}
                className="w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#00685F] disabled:opacity-50"
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">End time</label>
              <select
                name="endTime"
                value={slot.endTime}
                onChange={handleTimeChange}
                disabled={!slot.date}
                className="w-full bg-[#F0FDFA] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#00685F] disabled:opacity-50"
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
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className={`mt-4 px-6 py-3 bg-[#00685F] hover:bg-[#00524C] text-white text-sm font-semibold rounded-xl transition-colors ${
                submitting ? "opacity-80" : ""
              }`}
            >
              {submitting ? "Confirming..." : "Confirm appointment"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-3 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
