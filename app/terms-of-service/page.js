import Link from "next/link";
import Footer from "@/app/components/Footer";

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing this website or booking an appointment with ToothPeak Dental Clinic, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.",
    ],
  },
  {
    title: "Appointment Booking Policy",
    body: [
      "Appointments may be requested through our website, by phone, or in person. A requested appointment is not confirmed until you receive confirmation from our staff. Please arrive on time; late arrivals may result in a shortened appointment or rescheduling.",
    ],
  },
  {
    title: "Cancellation Policy",
    body: [
      "We kindly request at least 24 hours' notice if you need to cancel or reschedule an appointment. This allows us to offer the time to other patients. Repeated missed appointments or late cancellations may affect your ability to book future appointments.",
    ],
  },
  {
    title: "Account Responsibility",
    body: [
      "If you create an account or submit information through our website, you are responsible for maintaining the accuracy and confidentiality of that information. Please notify us promptly of any unauthorized use or changes to your details.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Information provided on this website is for general guidance only and does not constitute professional dental advice. All clinical decisions remain with your dentist. To the fullest extent permitted by law, ToothPeak Dental Clinic is not liable for decisions made based on website content without a consultation.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may update these Terms of Service from time to time. Any changes will be posted on this page, and continued use of our services after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
];

export default function TermsOfService() {
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
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Terms of Service</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          The terms governing your use of ToothPeak Dental Clinic&apos;s website and services.
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