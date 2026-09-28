"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UsersRound,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

// One entry per page. Labels match each page's title.
const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/patient-records", label: "Patient Records", icon: UsersRound },
  { href: "/dashboard/add-patient", label: "Add Patient", icon: UserPlus },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const itemBaseClass =
  "flex items-center rounded-lg px-3 py-2 transition-colors duration-150 ease-smooth focus-visible:outline-2 focus-visible:outline-[#00685F]";
const iconButtonClass =
  "rounded-lg p-1.5 text-gray-500 cursor-pointer hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-[#00685F]";

// Desktop: sits beside the page and can collapse to icons (isOpen).
// Phone: hidden off-screen, slides in as a drawer when mobileOpen is true.
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

  // Overview is exact; the others also stay active on their sub-pages
  // (e.g. a single patient's record under /dashboard/patient-records/...).
  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

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
      <nav
        aria-label="Staff navigation"
        className={`bg-white fixed inset-y-0 left-0 z-40 h-[calc(100dvh-1rem)] m-2 flex flex-col p-3 gap-1 rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-[width,translate,visibility] duration-300 ease-in-out w-64 md:static md:z-auto md:h-[calc(100vh-2rem)] md:translate-x-0 md:visible ${
          isOpen ? "md:w-64" : "md:w-16"
        } ${
          // Phone only; md:translate-x-0 / md:visible cancel this on desktop.
          // invisible = closed drawer's links can't be reached with Tab.
          mobileOpen ? "translate-x-0 visible" : "-translate-x-[110%] invisible"
        }`}
      >
        <div className={`mb-3 flex ${showLabels ? "justify-start" : "justify-center"}`}>
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className={`${iconButtonClass} md:hidden`}
          >
            <X className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isOpen}
            className={`${iconButtonClass} hidden md:block`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <Link
          href="/dashboard"
          onClick={onMobileClose}
          tabIndex={showLabels ? undefined : -1}
          className={`mb-4 rounded-lg transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-[#00685F] ${
            showLabels ? "opacity-100" : "opacity-0 invisible"
          }`}
        >
          <img
            src="/Logo/ToothPeakLogo.jpg"
            alt="ToothPeak Dental Clinic"
            className="rounded-lg"
          />
        </Link>

        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            showLabel={showLabels}
            onNavigate={onMobileClose}
          />
        ))}

        <button
          type="button"
          onClick={handleLogout}
          title={showLabels ? undefined : "Logout"}
          className={`${itemBaseClass} mt-auto cursor-pointer text-gray-700 hover:bg-gray-100 ${
            showLabels ? "gap-3" : "justify-center"
          }`}
        >
          <LogOut aria-hidden="true" className="w-5 h-5 shrink-0" />
          <NavLabel show={showLabels}>Logout</NavLabel>
        </button>
      </nav>
    </>
  );
}

/* ---------- One sidebar link: icon plus a label that hides when collapsed ---------- */
function NavItem({ item, isActive, showLabel, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      // Collapsed to icons: the tooltip names the page.
      title={showLabel ? undefined : item.label}
      className={`${itemBaseClass} ${showLabel ? "gap-3" : "justify-center"} ${
        isActive
          ? "bg-[#F0FDFA] font-medium text-[#00685F]"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon aria-hidden="true" className="w-5 h-5 shrink-0" />
      <NavLabel show={showLabel}>{item.label}</NavLabel>
    </Link>
  );
}

// Slides the label shut instead of removing it, so collapsing animates.
function NavLabel({ show, children }) {
  return (
    <span
      className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
        show ? "opacity-100 max-w-40" : "opacity-0 max-w-0"
      }`}
    >
      {children}
    </span>
  );
}
