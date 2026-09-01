import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import CalendarView from "./CalendarView";
import Link from "next/link";
export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const visits = [
    { time: "2:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "3:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "4:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "5:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
  ];
  const pages = [1, 2, 3];

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Overview</h1>
          <p className="text-gray-500">Today is {today}</p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/dashboard/addpatient"
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-100 active:scale-95 active:brightness-90"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Patient
            </div>
          </Link>

          <Link
            href=""
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Appointment
            </div>
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-8">
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              TODAY'S EXPECTED VISITS
            </div>
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              PENDING APPOINTMENTS
            </div>
          </div>

          <CalendarView />
        </div>

        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 self-stretch">
          <h2 className="font-bold text-lg mb-4">Upcoming Visits</h2>
          <div className="flex flex-col gap-4">
            {visits.map((visit) => (
              <div key={visit.time} className="flex gap-2 items-stretch">
                <div className="flex flex-col items-center">
                  <p className="text-sm">{visit.time}</p>
                  <div className="w-3 h-3 rounded-full bg-[#00685F] mt-1 shrink-0"></div>
                  <div className="w-px bg-gray-300 grow"></div>
                </div>

                <div className="bg-gray-200 rounded-lg border border-gray-500 p-4 mb-4">
                  <p>{visit.patient}</p>
                  <p>{visit.Appointment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6">
        <h2 className="font-bold text-lg">All Appointments</h2>

        <select className="border border-gray-300 rounded-lg px-3 py-2 bg-[#00685F] text-white">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Patient Name
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Date
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Time
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Service
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Status
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b border-gray-200">Juan Dela Cruz</td>
              <td className="p-3 border-b border-gray-200">Jan 1, 2026</td>
              <td className="p-3 border-b border-gray-200">9:00 AM</td>
              <td className="p-3 border-b border-gray-200">Dental Cleaning</td>
              <td className="p-3 border-b border-gray-200">
                <span className="bg-orange-700 text-white px-3 py-1 rounded-full text-sm">
                  Pending
                </span>
              </td>
              <td className="p-3 border-b border-gray-200 flex gap-2">
                <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" />
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">Maria Santos</td>
              <td className="p-3 border-b border-gray-200">Jan 2, 2026</td>
              <td className="p-3 border-b border-gray-200">10:00 AM</td>
              <td className="p-3 border-b border-gray-200">Root Canal</td>
              <td className="p-3 border-b border-gray-200">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  Cancelled
                </span>
              </td>
              <td className="p-3 border-b border-gray-200 flex gap-2">
                <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" />
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">Pedro Reyes</td>
              <td className="p-3 border-b border-gray-200">Jan 3, 2026</td>
              <td className="p-3 border-b border-gray-200">11:00 AM</td>
              <td className="p-3 border-b border-gray-200">Tooth Filling</td>
              <td className="p-3 border-b border-gray-200">
                <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                  Confirmed
                </span>
              </td>
              <td className="p-3 border-b border-gray-200 flex gap-2">
                <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" />
              </td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">Ana Garcia</td>
              <td className="p-3 border-b border-gray-200">Jan 4, 2026</td>
              <td className="p-3 border-b border-gray-200">1:00 PM</td>
              <td className="p-3 border-b border-gray-200">Consultation</td>
              <td className="p-3 border-b border-gray-200 ">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  Cancelled
                </span>
              </td>
              <td className="p-3 border-b border-gray-200 flex gap-2">
                <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" />
                <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing 1-4 of 4 patients
                  </p>

                  <div className="flex gap-2 items-center">
                    <button className="px-3 py-1 border border-gray-300 rounded items-center">
                      {"<"}
                    </button>

                    {pages.map((page) => (
                      <button
                        key={page}
                        className="px-3 py-1 border border-gray-300 rounded items-center"
                      >
                        {page}
                      </button>
                    ))}

                    <button className="px-3 py-1 border border-gray-300 rounded items-center">
                      {">"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
