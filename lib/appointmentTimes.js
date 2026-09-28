// Clinic slots. Values are 24-hour "HH:MM" because that's what the
// Postgres `time` column accepts; labels are what staff read.
export const START_TIME_OPTIONS = [
  { value: "08:00", label: "8:00 AM" },
  { value: "08:30", label: "8:30 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
];

export const END_TIME_OPTIONS = [
  { value: "08:30", label: "8:30 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "09:30", label: "9:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:30", label: "1:30 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "14:30", label: "2:30 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "15:30", label: "3:30 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "16:30", label: "4:30 PM" },
  { value: "17:00", label: "5:00 PM" },
];

// "13:30:00" or "13:30" -> 810
export function timeToMinutes(timeText) {
  const [hours, minutes] = timeText.split(":").map(Number);
  return hours * 60 + minutes;
}

// "13:30:00" -> "1:30 PM"
export function formatTime(timeText) {
  if (!timeText) return "";
  const [hours, minutes] = timeText.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// The database sends "13:30:00" but the dropdowns use "13:30".
export function toSlotValue(timeText) {
  return timeText ? timeText.slice(0, 5) : "";
}

// Build "YYYY-MM-DD" from the local clock. toISOString() uses UTC, which
// reports yesterday's date before 8 AM in UTC+8.
export function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Two spans overlap when each starts before the other ends. Matches the
// database's '[)' rule, so back-to-back bookings are allowed.
export function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

// A start slot is taken if it falls inside any existing booking.
export function isStartSlotTaken(slotValue, bookedRanges) {
  const slotMinutes = timeToMinutes(slotValue);
  return bookedRanges.some(
    (range) => slotMinutes >= range.startMinutes && slotMinutes < range.endMinutes,
  );
}

// An end slot is unusable if it's not after the chosen start, or if the
// span from start to this end would cover an existing booking.
export function isEndSlotTaken(slotValue, startValue, bookedRanges) {
  const endMinutes = timeToMinutes(slotValue);
  if (!startValue) {
    return bookedRanges.some(
      (range) => endMinutes > range.startMinutes && endMinutes <= range.endMinutes,
    );
  }
  const startMinutes = timeToMinutes(startValue);
  if (endMinutes <= startMinutes) return true;
  return bookedRanges.some((range) =>
    rangesOverlap(startMinutes, endMinutes, range.startMinutes, range.endMinutes),
  );
}
