"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="border-b border-gray-200">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <Link
          href="/"
          className="text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
        >
          ToothPeak
        </Link>

        <nav className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
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
      </div>
    </header>
  );
}
