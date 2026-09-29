import Link from "next/link";

// The main pages come first: on phones the footer is the second place to
// find them, after the header menu.
const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Us", href: "/about-us" },
  { label: "Book Appointment", href: "/appointments" },
  { label: "Location", href: "/location" },
  { label: "Contact Support", href: "/contact-support" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

// min-h-11 makes each link a comfortable tap target on phones (44px).
const footerLinkClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-[#1F2D28] underline decoration-transparent underline-offset-4 transition-all duration-200 hover:text-[#1F4A3D] hover:decoration-[#1F4A3D]";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#EDEFEE] px-5 py-8 sm:px-8">
      {/* Stacked and centred at every width: with every page linked, a side-by-side
          row squeezed the links onto two uneven lines on desktop. */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-lg font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
        >
          ToothPeak
        </Link>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6">
          {footerLinks.map(({ label, href }) => (
            <Link key={label} href={href} className={footerLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-1">
          <span className="text-center text-sm text-gray-700">
            © 2026 ToothPeak Dental Clinic. Precision Care, Natural Smiles.
          </span>
          {/* "/" is the public website, so staff need a way in from here.
              Kept apart from the patient links so patients don't mistake it
              for something meant for them. */}
          <Link href="/login" className={footerLinkClass}>
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
