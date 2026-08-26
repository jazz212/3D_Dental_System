"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const clinicalServices = [
  { title: "Oral Prophylaxis", sub: "(Cleaning)", desc: "Routine cleaning to remove plaque and tartar, essential for maintaining healthy gums and teeth." },
  { title: "Tooth Restoration", sub: "(Pasta)", desc: "Repairing damaged or decayed teeth using high-quality filling materials to restore function and appearance." },
  { title: "Tooth Extraction", sub: "(Bunot)", desc: "Safe and painless removal of severely damaged, decayed, or problematic teeth." },
  { title: "Wisdom Tooth Surgery", sub: null, desc: "Surgical extraction of impacted or problematic wisdom teeth by experienced professionals." },
  { title: "Veneers, Crowns and Bridges", sub: null, desc: "Cosmetic and restorative solutions to enhance your smile and replace missing teeth with durable prosthetics." },
  { title: "Complete & Partial Dentures", sub: "(Pustiso)", desc: "Custom-fitted removable appliances to replace missing teeth and surrounding tissues." },
  { title: "Braces", sub: "Metal, Ceramic and Clear", desc: "Orthodontic treatments to align and straighten teeth for improved function and aesthetics." },
  { title: "Root Canal Treatment", sub: "(RCT)", desc: "Endodontic therapy to save severely infected or decayed teeth by removing the damaged nerve and pulp." },
  { title: "Teeth Whitening", sub: null, desc: "Professional bleaching procedures to safely and effectively brighten your smile." },
];

const panoramicItems = ["Standard", "Child Projection", "Orthogonal Mention", "Lateral View of TMJ"];

const cephalometricItems = ["Latero-Lateral (LL)", "Antero-Posterior (AP)", "Postero-Anterior (PA)", "Submento-Vertex (SV)", "Caldwell Luc", "Waters View"];

const additionalImaging = [
  { title: "Periapical / Bitewing", desc: "Detailed views of specific teeth and surrounding bone." },
  { title: "Occlusal", sub: "(Upper / Lower)", desc: "Captures full arch views of the jaw." },
  { title: "Transcranial X-Ray", desc: "Specialized imaging for the temporomandibular joint (TMJ)." },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#1F2D28]">
      <header className="border-b border-gray-200">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/landing" className="text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]">
            ToothPeak
          </Link>
          <nav className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <Link href="/landing" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              Home
            </Link>
            <Link href="/services" className="relative text-[15px] font-medium text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1F4A3D]">
              Services
            </Link>
            <a href="/aboutus" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              About Us
            </a>
            <a href="/appointments" className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full">
              Book Appointment
            </a>
          </nav>
          <div className="hidden md:block md:w-[130px]" />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Our Services</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Comprehensive dental care tailored to your needs. From routine cleanings to advanced diagnostic imaging, our team is dedicated to your oral health and comfort.
        </p>
        <Link href="/appointments" className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          Book an Appointment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <h2 className="mb-8 text-2xl font-bold text-[#1F4A3D] md:text-3xl">Clinical Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinicalServices.map(({ title, sub, desc }) => (
            <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-lg font-bold text-[#1F4A3D]">{title}</h3>
              {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
              <p className="mt-3 text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <h2 className="mb-8 text-2xl font-bold text-[#1F4A3D] md:text-3xl">Diagnostic Imaging</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-10">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-[#1F4A3D]">Digital Panoramic X-Ray</h3>
              <ul className="mt-4 space-y-2">
                {panoramicItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1F4A3D]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-[#1F4A3D]">Digital Cephalometric X-Ray</h3>
              <ul className="mt-4 space-y-2">
                {cephalometricItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1F4A3D]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="border-b border-gray-200 pb-3 text-lg font-bold text-[#1F4A3D]">Additional Imaging Services</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {additionalImaging.map(({ title, sub, desc }) => (
                <div key={title} className="rounded-lg border border-gray-200 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <p className="font-bold text-[#1F2D28]">{title}</p>
                  {sub && <p className="text-sm text-gray-500">{sub}</p>}
                  <p className="mt-2 text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-[#EDEFEE] px-8 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/landing" className="text-lg font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]">
            ToothPeak
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {["Privacy Policy", "Terms of Service", "Contact Support", "Location"].map((item) => (
              <a key={item} href="#" className="text-sm text-[#1F2D28] underline decoration-transparent underline-offset-4 transition-all duration-200 hover:text-[#1F4A3D] hover:decoration-[#1F4A3D]">
                {item}
              </a>
            ))}
          </nav>
          <span className="text-sm text-gray-500">© 2026 ToothPeak Dental Clinic. Precision Care, Natural Smiles.</span>
        </div>
      </footer>
    </div>
  );
}