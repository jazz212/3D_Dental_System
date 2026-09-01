import Link from "next/link";
import Footer from "@/app/components/Footer";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect personal information you provide when scheduling appointments, including your name, contact details, date of birth, and medical or dental history. This may also include insurance information, treatment records, and any correspondence you send through our website or by email.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "Your information is used to schedule and manage appointments, deliver and coordinate dental care, process billing and insurance claims, and communicate with you about your treatment. We may also use anonymized data to improve our services and patient experience.",
    ],
  },
  {
    title: "Data Storage & Security",
    body: [
      "Patient records are stored securely and access is limited to authorized clinical and administrative staff. We apply appropriate technical and organizational safeguards to protect your information against unauthorized access, alteration, disclosure, or destruction.",
    ],
  },
  {
    title: "Sharing of Information",
    body: [
      "We do not sell your personal information. We may share information with third-party providers who assist in operating our practice — such as payment processors, laboratories, or specialist referrals — only as necessary to provide care, and always under confidentiality obligations.",
    ],
  },
  {
    title: "Patient Rights",
    body: [
      "You may request access to, correction of, or a copy of your personal and health records at any time. You may also withdraw consent for non-essential communications. To exercise these rights, contact our clinic using the details below.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions about this Privacy Policy or how your information is handled, please reach out to ToothPeak Dental Clinic through our Contact Support page or by phone during clinic hours.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#1F2D28]">
      <header className="border-b border-gray-200">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link
            href="/landing"
            className="text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
          >
            ToothPeak
          </Link>

          <nav className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <Link href="/landing" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">Home</Link>
            <Link href="/services" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">Services</Link>
            <Link href="/aboutus" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">About Us</Link>
            <Link href="/appointments" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">Book Appointment</Link>
          </nav>

          <div className="hidden md:block md:w-[130px]" />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Privacy Policy</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          How ToothPeak Dental Clinic collects, uses, and protects your personal and health information.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-8 pb-20">
        <div className="space-y-10">
          {sections.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-[#1F4A3D]">{title}</h2>
              {body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}