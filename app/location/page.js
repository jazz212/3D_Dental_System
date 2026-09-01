import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import Footer from "@/app/components/Footer";

const locationDetails = [
  {
    icon: MapPin,
    label: "Address",
    value:
      "FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway, cor. Airborne St., Maharlika East, Tagaytay City.",
  },
  { icon: Phone, label: "Phone", value: "0966 990 8551" },
  { icon: Clock, label: "Clinic Hours", value: "Tue – Sat, 9:00 AM – 5:00 PM" },
];

export default function Location() {
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
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Location</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Find us in the heart of Tagaytay — convenient access with ample parking for a seamless visit.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#1F4A3D]">ToothPeak Dental Clinic</h2>

            <div className="mt-8 space-y-6">
              {locationDetails.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-[#1F4A3D]" />
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-100">
            <p className="text-sm text-gray-400">Map coming soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}