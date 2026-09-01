import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Contact Support", href: "/contact-support" },
  { label: "Location", href: "/location" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#EDEFEE] px-8 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <Link
          href="/landing"
          className="text-lg font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
        >
          ToothPeak
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-[#1F2D28] underline decoration-transparent underline-offset-4 transition-all duration-200 hover:text-[#1F4A3D] hover:decoration-[#1F4A3D]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <span className="text-sm text-gray-500">
          © 2026 ToothPeak Dental Clinic. Precision Care, Natural Smiles.
        </span>
      </div>
    </footer>
  );
}