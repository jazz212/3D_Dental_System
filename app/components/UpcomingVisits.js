"use client";
import { formatTime, getLocalDateString } from "@/lib/appointmentTimes";

function getDayLabel(dateString, todayString, tomorrowString) {
  if (dateString === todayString) return "Today";
  if (dateString === tomorrowString) return "Tomorrow";
  // "T00:00" makes the browser read the date as local time, not UTC.
  return new Date(`${dateString}T00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Turns a flat list into [{ date, visits: [...] }, ...]. The query already
// filtered to today onward and sorted by date and time.
function groupVisitsByDay(visits) {
  const days = [];
  for (const appt of visits) {
    const lastDay = days[days.length - 1];
    if (lastDay && lastDay.date === appt.appointment_date) {
      lastDay.visits.push(appt);
    } else {
      days.push({ date: appt.appointment_date, visits: [appt] });
    }
  }
  return days;
}

export default function UpcomingVisits({ visits, loading, onSelectVisit }) {
  const now = new Date();
  const todayString = getLocalDateString(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowString = getLocalDateString(tomorrow);

  const days = groupVisitsByDay(visits);

  return (
    <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 self-stretch flex flex-col">
      <h2 className="font-bold text-lg mb-4">Upcoming Visits</h2>

      {/* basis-0 keeps the list from adding its height to the row, so the
          panel matches the calendar column and long lists scroll instead */}
      <div className="grow basis-0 min-h-0 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-gray-500">Loading visits...</p>
        ) : days.length === 0 ? (
          <p className="text-sm text-gray-500">
            No visits booked. Add one with Add Appointment.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {days.map((day) => {
              const isToday = day.date === todayString;
              return (
                <section key={day.date}>
                  <h3
                    className={`text-sm font-semibold mb-1 ${
                      isToday ? "text-[#00685F]" : "text-gray-800"
                    }`}
                  >
                    {getDayLabel(day.date, todayString, tomorrowString)}
                  </h3>

                  <ol>
                    {day.visits.map((appt) => (
                      <li key={appt.id} className="flex">
                        <span className="w-16 shrink-0 pt-2 pr-3 text-right text-xs tabular-nums text-gray-500">
                          {formatTime(appt.start_time)}
                        </span>

                        <button
                          onClick={() => onSelectVisit(appt)}
                          className="relative flex-1 min-w-0 border-l-2 border-[#CCE3E0] pl-4 py-2 text-left rounded-r-lg cursor-pointer hover:bg-[#F0FDFA] focus-visible:outline-2 focus-visible:outline-[#00685F]"
                        >
                          {/* Solid dot = today, hollow dot = later day */}
                          <span
                            className={`absolute -left-1.25 top-3.5 w-2 h-2 rounded-full border-2 border-[#00685F] ${
                              isToday ? "bg-[#00685F]" : "bg-white"
                            }`}
                          />
                          <span className="block text-sm font-medium text-gray-800 truncate">
                            {appt.patient_name}
                          </span>
                          <span className="block text-xs text-gray-500 truncate">
                            {appt.service}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
