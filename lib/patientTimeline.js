import { getLocalDateString } from "@/lib/appointmentTimes";

// Statuses that mean a visit is still going to happen.
const UPCOMING_STATUSES = ["requested", "confirmed"];

// Exams and images are saved with a timestamp, not linked to an appointment,
// so they are matched to a visit by the calendar day they were recorded on.
function toDay(timestamp) {
  return getLocalDateString(new Date(timestamp));
}

function getOrCreateDay(daysByDate, date) {
  if (!daysByDate.has(date)) {
    daysByDate.set(date, { date, visits: [], exams: [], images: [] });
  }
  return daysByDate.get(date);
}

// Builds the patient page's timeline:
// - upcoming: visits still to come (requested or confirmed, after today),
//   soonest first, shown pinned above the timeline;
// - days: every other date with a visit, an exam or an image, newest
//   first, each holding everything that happened on it.
export function buildPatientTimeline(appointments, examinations, images, today) {
  const upcoming = appointments
    .filter(
      (appointment) =>
        // Strictly after today: today's visit stays on the timeline, next to
        // the exam and images recorded during it.
        appointment.appointment_date > today && UPCOMING_STATUSES.includes(appointment.status),
    )
    .sort((a, b) =>
      `${a.appointment_date} ${a.start_time}`.localeCompare(`${b.appointment_date} ${b.start_time}`),
    );

  const daysByDate = new Map();
  for (const appointment of appointments) {
    if (upcoming.includes(appointment)) continue;
    getOrCreateDay(daysByDate, appointment.appointment_date).visits.push(appointment);
  }
  for (const exam of examinations) {
    getOrCreateDay(daysByDate, toDay(exam.created_at)).exams.push(exam);
  }
  for (const image of images) {
    getOrCreateDay(daysByDate, toDay(image.created_at)).images.push(image);
  }

  // "YYYY-MM-DD" strings sort correctly as text.
  const days = [...daysByDate.values()].sort((a, b) => b.date.localeCompare(a.date));
  for (const day of days) {
    day.visits.sort((a, b) => a.start_time.localeCompare(b.start_time));
  }
  return { upcoming, days };
}
