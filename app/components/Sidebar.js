import Link from "next/link";
export default function Sidebar() {
  return (
    <div className="bg-white h-screen flex flex-col p-4 w-64 gap-2 text-black border-r border-gray-500 overflow-hidden">
      <img src="/Logo/ToothPeakLogo.jpg" className="rounded-lg" />
      <div className="bg-[#00685F] px-4 py-2 text-white rounded-lg">
        <button type="button" className="w-full">
          New Appointment
        </button>
      </div>
      <Link href="/calendar">Calendar</Link>
      <Link href="/patient">Patient Records</Link>
      <Link href="/settings">Setttings</Link>
      <Link href="/logout" className="mt-auto">
        Logout
      </Link>
    </div>
  );
}
