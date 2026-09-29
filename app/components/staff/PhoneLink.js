import { toTelLink } from "@/lib/clinicContact";

// A phone number that calls when tapped (on a phone) and stays plain text
// when there's nothing valid to dial. min-h-11 on touch screens keeps it a
// comfortable tap target.
export default function PhoneLink({ number, fallback = "—" }) {
  if (!number) return fallback;
  const href = toTelLink(number);
  if (!href) return number;
  return (
    <a
      href={href}
      className="inline-flex items-center pointer-coarse:min-h-11 text-[#00685F] underline underline-offset-4 hover:text-[#004D45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
    >
      {number}
    </a>
  );
}
