"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  UsersRound,
  Settings,
  LogOut,
  Plus,
  Menu,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={`bg-white h-screen flex flex-col p-4 gap-2 text-black border-r border-gray-500 overflow-hidden transition-all duration-300 ${isOpen ? "w-64" : "w-16"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`mb-4 w-full flex ${isOpen ? "justify-start" : "justify-center"}`}
      >
        <Menu className="w-6 h-6 text-gray-500 hover:text-[#00685F]" />
      </button>
      <Link href="/dashboard">
        {isOpen && <img src="/Logo/ToothPeakLogo.jpg" className="rounded-lg" />}
      </Link>

      <div
        className={`rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 flex items-center justify-center ${
          isOpen ? "bg-[#00685F] text-white px-4 py-2 w-full" : "w-full py-2"
        }`}
      >
        <Link
          href="/dashboard/addpatient"
          className="flex items-center justify-center w-full h-full"
        >
          <div
            className={`flex items-center cursor-pointer ${isOpen ? "w-full gap-2" : "justify-center"}`}
          >
            <Plus
              className={`w-5 h-5 shrink-0 ${isOpen ? "" : "text-[#00685F]"}`}
            />
            {isOpen && <span>Add New Patient</span>}
          </div>
        </Link>
      </div>

      <Link
        href="/dashboard"
        className={`px-3 py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div
          className={`flex items-center gap-2 ${isOpen ? "" : "justify-center"}`}
        >
          <CalendarDays className="w-5 h-5 shrink-0" />
          {isOpen && <span>Calendar</span>}
        </div>
      </Link>
      <Link
        href="/dashboard/patientrecords"
        className={`px-3 py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/patientrecords" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div
          className={`flex items-center gap-2 ${isOpen ? "" : "justify-center"}`}
        >
          <UsersRound className="w-5 h-5 shrink-0" />
          {isOpen && <span>Patient Records</span>}
        </div>
      </Link>
      <Link
        href="/dashboard/settingpage"
        className={`px-3 py-2 rounded-lg transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/settingpage" ? "bg-[#00685F] text-white" : "text-black"}`}
      >
        <div
          className={`flex items-center gap-2 ${isOpen ? "" : "justify-center"}`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {isOpen && <span>Settings</span>}
        </div>
      </Link>
      <Link
        href="/login"
        className="mt-auto transition-all duration-100 active:scale-95 active:brightness-90"
      >
        <div
          className={`flex items-center gap-2 ${isOpen ? "" : "justify-center"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span>Logout</span>}
        </div>
      </Link>
    </div>
  );
}
