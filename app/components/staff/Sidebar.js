"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  UsersRound,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// Desktop: sits beside the page and can collapse to icons (isOpen).
// Phone: hidden off-screen, slides in as a drawer when mobileOpen is true.
// Animation timing is the original: 300ms ease-in-out for everything.
export default function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  // The phone drawer is always full width, so it always shows labels.
  const showLabels = isOpen || mobileOpen;
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <>
      {/* Phone only: tapping the dimmed page closes the drawer */}
      <div
        onClick={onMobileClose}
        aria-hidden="true"
        className={`fixed inset-0 z-30 bg-black/40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`bg-white fixed inset-y-0 left-0 z-40 h-[calc(100dvh-1rem)] m-2 flex flex-col p-4 gap-2 text-black rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-[width,translate,visibility] duration-300 ease-in-out w-64 md:static md:z-auto md:h-[calc(100vh-2rem)] md:translate-x-0 md:visible ${
          isOpen ? "md:w-64" : "md:w-16"
        } ${
          // Phone only; md:translate-x-0 / md:visible cancel this on desktop.
          // invisible = closed drawer's links can't be reached with Tab.
          mobileOpen ? "translate-x-0 visible" : "-translate-x-[110%] invisible"
        }`}
      >
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          className="mb-4 w-full flex justify-start md:hidden"
        >
          <X className="w-6 h-6 text-gray-500 hover:text-[#00685F]" />
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`mb-4 w-full hidden md:flex ${isOpen ? "justify-start" : "justify-center"}`}
        >
          <Menu className="w-6 h-6 text-gray-500 hover:text-[#00685F]" />
        </button>
        <Link href="/dashboard" onClick={onMobileClose}>
          <img
            src="/Logo/ToothPeakLogo.jpg"
            alt="Logo"
            className={`rounded-lg transition-opacity duration-300 ${showLabels ? "opacity-100" : "opacity-0 invisible"}`}
          />
        </Link>

        <div
          className={`rounded-2xl transition-all duration-100 active:scale-95 active:brightness-90 flex items-center justify-center ${
            showLabels ? "bg-[#00685F] text-white px-4 py-2 w-full" : "w-full py-2"
          }`}
        >
          <Link
            href="/dashboard/add-patient"
            onClick={onMobileClose}
            className="flex items-center justify-center w-full h-full"
          >
            <div
              className={`flex items-center cursor-pointer ${showLabels ? "w-full gap-2" : "justify-center gap-0"}`}
            >
              <Plus
                className={`w-5 h-5 shrink-0 ${showLabels ? "" : "text-[#00685F]"}`}
              />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${showLabels ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
              >
                Add New Patient
              </span>
            </div>
          </Link>
        </div>

        <Link
          href="/dashboard"
          onClick={onMobileClose}
          className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
        >
          <div
            className={`flex items-center ${showLabels ? "gap-2" : "justify-center gap-0"}`}
          >
            <CalendarDays className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${showLabels ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
            >
              Calendar
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard/patient-records"
          onClick={onMobileClose}
          className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/patient-records" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
        >
          <div
            className={`flex items-center ${showLabels ? "gap-2" : "justify-center gap-0"}`}
          >
            <UsersRound className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${showLabels ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
            >
              Patient Records
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard/settings"
          onClick={onMobileClose}
          className={`px-3 py-2 rounded-xl transition-all duration-100 active:scale-95 active:brightness-90 ${pathname === "/dashboard/settings" ? "bg-[#F0FDFA] text-[#00685F]" : "text-black hover:bg-[#F0FDFA]"}`}
        >
          <div
            className={`flex items-center ${showLabels ? "gap-2" : "justify-center gap-0"}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${showLabels ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
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
            className={`flex items-center ${showLabels ? "gap-2" : "justify-center gap-0"}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${showLabels ? "opacity-100 max-w-40" : "opacity-0 max-w-0"}`}
            >
              Logout
            </span>
          </div>
        </button>
      </div>
    </>
  );
}
