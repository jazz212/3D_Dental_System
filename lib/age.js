// Age is always worked out from the date of birth, by calendar month and
// day (never days / 365), so it stays right after birthdays and leap years.
// Dates are "YYYY-MM-DD" strings read from their parts, so the time zone
// can't shift the day. `today` is a Date and defaults to now; tests pass
// a fixed one.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysInMonth(year, month) {
  // Day 0 of the next month is the last day of this one.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

// { year, month, day } for a real calendar date, or null for "", a
// half-typed value or an impossible date like 2025-02-30.
function parseDate(text) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text || "");
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

function todayParts(today) {
  return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
}

function isAfter(a, b) {
  if (a.year !== b.year) return a.year > b.year;
  if (a.month !== b.month) return a.month > b.month;
  return a.day > b.day;
}

export function isValidDate(dateOfBirth) {
  return parseDate(dateOfBirth) !== null;
}

export function isFutureDate(dateOfBirth, today = new Date()) {
  const birth = parseDate(dateOfBirth);
  return birth !== null && isAfter(birth, todayParts(today));
}

// Whole months lived, or null for a missing, invalid or future date.
// A month is complete on the same day number, or on the month's last day
// when it is shorter: 31 Jan turns 1 month on 28 Feb, and a 29 Feb
// birthday counts on 28 Feb in non-leap years.
function ageInMonths(dateOfBirth, today) {
  const birth = parseDate(dateOfBirth);
  const now = todayParts(today);
  if (!birth || isAfter(birth, now)) return null;

  let months = (now.year - birth.year) * 12 + (now.month - birth.month);
  const anniversaryDay = Math.min(birth.day, daysInMonth(now.year, now.month));
  if (now.day < anniversaryDay) months -= 1;
  return months;
}

// Whole years, for the integer age columns and the age-group filter.
// Null for a missing, invalid or future date.
export function ageInYears(dateOfBirth, today = new Date()) {
  const months = ageInMonths(dateOfBirth, today);
  return months === null ? null : Math.floor(months / 12);
}

function plural(count, unit) {
  return `${count} ${unit}${count === 1 ? "" : "s"}`;
}

// "12 days", "8 months", "2 years 3 months", "45 years". Empty string for
// a missing, invalid or future date.
export function formatAge(dateOfBirth, today = new Date()) {
  const months = ageInMonths(dateOfBirth, today);
  if (months === null) return "";

  if (months === 0) {
    const birth = parseDate(dateOfBirth);
    const now = todayParts(today);
    const days = Math.round(
      (Date.UTC(now.year, now.month - 1, now.day) - Date.UTC(birth.year, birth.month - 1, birth.day)) /
        MS_PER_DAY,
    );
    return plural(days, "day");
  }
  if (months < 12) return plural(months, "month");

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years >= 18 || remainingMonths === 0) return plural(years, "year");
  return `${plural(years, "year")} ${plural(remainingMonths, "month")}`;
}

// For saved rows: the age from the birth date when there is one, else the
// whole-year age typed in before birth dates were required. Empty string
// when neither is known.
export function formatStoredAge(dateOfBirth, storedAge) {
  const formatted = formatAge(dateOfBirth);
  if (formatted) return formatted;
  return storedAge === null || storedAge === undefined ? "" : plural(storedAge, "year");
}
