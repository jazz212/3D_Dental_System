"use client";
import { Search, Bell, CircleHelp, Menu } from "lucide-react";

export default function Navbar({ onOpenMenu }) {
  return (
    <div className="bg-white h-16 w-full flex items-center text-black gap-2 px-4 justify-between border-b border-gray-100 shadow-sm">
      {/* Phone only: the sidebar is hidden, this opens it as a drawer */}
      <button
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="md:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* flex-1 + max-w-80: fills small screens, stops at 320px on large ones */}
      <div className="relative flex-1 min-w-0 max-w-80">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#00685F]/10 focus:border-[#00685F]"
          placeholder="Search patient name or appointments"
        />
      </div>

      <div className="flex gap-2 items-center shrink-0">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors">
          <CircleHelp className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
}
