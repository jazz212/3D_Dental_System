"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <div
      className={`bg-white h-[calc(100vh-2rem)] m-2 flex flex-col p-4 gap-2 text-black rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-[width] duration-300 ease-in-out ${isOpen ? "w-64" : "w-16"}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`mb-4 w-full flex ${isOpen ? "justify-start" : "justify-center"}`}
      >
        <Menu className="w-6 h-6 text-gray-500 hover:text-[#00685F]" />
      </button>
      <Link href="/dashboard">
        <img
          src="/Logo/ToothPeakLogo.jpg"
          alt="Logo"
          className={`rounded-lg transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}
        />
      </Link>

      <div
        className={`rounded-2xl transition-all duration-100 active:scale-95 active:brightness-90 flex items-center justify-center ${
          isOpen ? "bg-[#00685F] text-white px-4 py-2 w-full" : "w-full py-2"
        }`}
      >
        <Link
          href="/dashboard/addpatient"
          className="flex items-center justify-center w-full h-full"
        >
          <div
            className={`flex items-center cursor-pointer ${isOpen ? "w-full gap-2" : "justify-center gap-0"}`}
          >
            <Plus
              className={`w-5 h-5 shrink-0 ${isOpen ? "" : "text-[#00685F]"}`}
            />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
            >
              Add New Patient
            </span>
          </div>
        </Link>
      </div>

      <Link
        href="/dashboard"
        className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
      >
        <div
          className={`flex items-center ${isOpen ? "gap-2" : "justify-center gap-0"}`}
        >
          <CalendarDays className="w-5 h-5 shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
          >
            Calendar
          </span>
        </div>
      </Link>
      <Link
        href="/dashboard/patientrecords"
        className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/patientrecords" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
      >
        <div
          className={`flex items-center ${isOpen ? "gap-2" : "justify-center gap-0"}`}
        >
          <UsersRound className="w-5 h-5 shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
          >
            Patient Records
          </span>
        </div>
      </Link>
      <Link
        href="/dashboard/settingpage"
        className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/settingpage" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
      >
        <div
          className={`flex items-center ${isOpen ? "gap-2" : "justify-center gap-0"}`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
          >
            Settings
          </span>
        </div>
      </Link>
      <button
        onClick={handleLogout}
        className="mt-auto transition-all duration-100 active:scale-95 active:brightness-90"
      >
        <div
          className={`flex items-center ${isOpen ? "gap-2" : "justify-center gap-0"}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
          >
            Logout
          </span>
        </div>
      </button>
    </div>
  );
}
