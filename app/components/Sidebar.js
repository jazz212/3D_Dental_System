"use client";
import { usePathname } from "next/navigation";
import { CalendarDays, UsersRound, Settings, LogOut, Plus } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="bg-white h-screen flex flex-col p-4 w-64 gap-2 text-black border-r border-gray-500 overflow-hidden">
      <img src="/Logo/ToothPeakLogo.jpg" className="rounded-lg" />
      <div className="bg-[#00685F] px-4 py-2 text-white rounded-lg  transition-all duration-100 active:scale-95 active:brightness-90">
        <Link href="/dashboard/addpatient">
          <div className="flex items-center gap-2 w-full cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Patient
          </div>
        </Link>
      </div>

      <Link
        href="/dashboard"
        className={`px-3 py-2  rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 " />
          Calendar
        </div>
      </Link>
      <Link
        href="/dashboard/patientrecords"
        className={`px-3 py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/patientrecords" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div className="flex items-center gap-2">
          <UsersRound className="w-4 h-4 " />
          Patient Records
        </div>
      </Link>
      <Link
        href="/settings"
        className={`px-3 py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/settings" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 " />
          Settings
        </div>
      </Link>
      <Link
        href="/login"
        className="mt-auto transition-all duration-100 active:scale-95 active:brightness-90"
      >
        <div className="flex items-center gap-2">
          <LogOut className="w-4 h-4 " />
          Logout
        </div>
      </Link>
    </div>
  );
}
