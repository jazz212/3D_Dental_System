"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about-us" },
  { label: "Book Appointment", href: "/appointments" },
];

// The current page's link stays underlined; the others grow an underline
// on hover.
const activeLinkClass =
  "relative text-[15px] font-medium text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1F4A3D]";
const inactiveLinkClass =
  "relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full";

// Shared by every public page. It reads the URL to know which link is
// current, so pages don't pass anything in.
export default function PublicHeader() {
  const pathname = usePathname();
  // Phones get a menu button instead of the row of links, which doesn't fit.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Escape closes the phone menu, like any other pop-over.
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMenuOpen]);

  return (
    // Sticky so the menu (and Book Appointment) is always one tap away,
    // even deep in the Services list or the booking form.
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 md:py-5">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
        >
          ToothPeak
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2"
        >
          {navLinks.map(({ label, href }) => {
            const isCurrent = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? activeLinkClass : inactiveLinkClass}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Balances the logo's width so the centered nav stays centered */}
        <div className="hidden md:block md:w-[130px]" />

        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          aria-expanded={isMenuOpen}
          aria-controls="phone-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-[#1F4A3D] hover:bg-[#EDEFEE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4A3D] md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <PhoneMenu pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
}

// The phone menu: every page as a large tap target, with booking as the
// one filled button so it stands out.
function PhoneMenu({ pathname, onNavigate }) {
  const pageLinks = navLinks.filter((link) => link.href !== "/appointments");

  return (
    <nav
      id="phone-menu"
      aria-label="Main"
      className="border-t border-gray-200 bg-white px-5 pb-5 transition-opacity duration-200 ease-smooth starting:opacity-0 motion-reduce:transition-none md:hidden"
    >
      <ul className="divide-y divide-gray-100">
        {pageLinks.map(({ label, href }) => {
          const isCurrent = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex min-h-12 items-center text-base ${
                  isCurrent ? "font-semibold text-[#1F4A3D]" : "font-medium text-[#1F2D28]"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        href="/appointments"
        onClick={onNavigate}
        className="mt-3 flex min-h-12 items-center justify-center rounded-md bg-[#1F4A3D] px-6 text-base font-semibold text-white hover:bg-[#163a2f]"
      >
        Book Appointment
      </Link>
    </nav>
  );
}
