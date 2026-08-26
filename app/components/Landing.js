"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldPlus, Sparkles, Scan, PenTool } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#1F2D28]">
      <header className="border-b border-gray-200">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/landing" className="text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]">
            ToothPeak
          </Link>

          <nav className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <Link href="/landing" className="relative text-[15px] font-medium text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1F4A3D]">
              Home
            </Link>
            <Link href="/services" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              Services
            </Link>
            <a href="/aboutus" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              About Us
            </a>
            <a href="appointments" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              Book Appointment
            </a>
          </nav>

          <div className="hidden md:block md:w-[130px]" />
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-8 py-20 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight text-[#1F4A3D] md:text-6xl">
            Precision Care,
            <br />
            Natural Smiles.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-600">
            Experience dental care reimagined. ToothPeak bridges the gap between advanced clinical precision and calming organic warmth, providing a stress-free environment where your oral health is restored to its natural peak.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/appointments" className="rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Book Appointment
            </Link>
            <Link href="/services" className="rounded-md border border-[#1F4A3D] px-6 py-3 font-semibold text-[#1F4A3D] transition-all duration-200 hover:bg-[#1F4A3D] hover:text-white active:translate-y-0">
              Explore Treatments
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-16">
          <Image
            src="/Logo/ToothPeakLogo.jpg"
            alt="ToothPeak Dental Clinic logo"
            width={420}
            height={420}
            className="h-auto w-full max-w-sm rounded-xl object-contain"
            priority
          />
        </div>
      </section>

      <section className="border-t border-gray-200 bg-[#F0F3F1] px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-[#1F4A3D] md:text-4xl">
            Comprehensive Clinical Services
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            Utilizing state-of-the-art technology and a minimally invasive approach to deliver predictable, high-quality outcomes across all disciplines of dentistry.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldPlus, title: "Preventative Cleanings", desc: "Thorough prophylactic treatments and deep scaling to maintain periodontal health and establish a pristine oral foundation." },
              { icon: Sparkles, title: "Modern Orthodontics", desc: "Advanced alignment solutions including clear aligner therapy and subtle traditional methods for optimal structural balance." },
              { icon: Scan, title: "3D Imaging", desc: "High-resolution CBCT scanning allowing for exact spatial diagnostics and highly predictable, digitally guided treatment planning." },
              { icon: PenTool, title: "Restorative Implants", desc: "Biocompatible titanium integrations designed to permanently replace missing structures, restoring full masticatory function." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-5 w-5 text-[#1F4A3D]" />
                </div>
                <h3 className="text-lg font-bold text-[#1F4A3D]">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-[#A9D5C0] p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1F4A3D] md:text-3xl">
              Ready to Elevate Your Dental Health?
            </h2>
            <p className="mt-3 max-w-xl text-[#2C4A3E]">
              Schedule your comprehensive consultation today. Our team is ready to design a personalized care plan tailored to your clinical needs.
            </p>
          </div>
          <Link href="/appointments" className="whitespace-nowrap rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            Book Your Appointment
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[#EDEFEE] px-8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="text-lg font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]">
            ToothPeak
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Contact Support", "Location"].map((item) => (
              <a key={item} href="#" className="text-sm text-[#1F2D28] underline decoration-transparent underline-offset-4 transition-all duration-200 hover:text-[#1F4A3D] hover:decoration-[#1F4A3D]">
                {item}
              </a>
            ))}
          </nav>

          <span className="text-sm text-gray-500">
            © 2026 ToothPeak Dental Clinic. Precision Care, Natural Smiles.
          </span>
        </div>
      </footer>
    </div>
  );
}