"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

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
  const [openService, setOpenService] = useState(null);

  const toggleService = (title) =>
    setOpenService((current) => (current === title ? null : title));

  return (
    <div>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <h1 className="text-4xl font-extrabold text-[#1F4A3D] sm:text-5xl md:text-6xl">Our Services</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Comprehensive dental care tailored to your needs. From routine cleanings to advanced diagnostic imaging, our team is dedicated to your oral health and comfort.
        </p>
        <Link href="/appointments" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          Book an Appointment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <h2 className="mb-8 text-2xl font-bold text-[#1F4A3D] md:text-3xl">Clinical Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinicalServices.map(({ title, sub, desc }) => (
            <ServiceCard
              key={title}
              title={title}
              sub={sub}
              desc={desc}
              isOpen={openService === title}
              onToggle={() => toggleService(title)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <h2 className="mb-8 text-2xl font-bold text-[#1F4A3D] md:text-3xl">Diagnostic Imaging</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-10">
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
                <ServiceCard
                  key={title}
                  title={title}
                  sub={sub}
                  desc={desc}
                  isOpen={openService === title}
                  onToggle={() => toggleService(title)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// A service that opens to show its description. It is a real button so it
// can be reached with the keyboard and screen readers hear "collapsed" or
// "expanded"; the arrow shows on touch screens (no hover there) that it opens.
function ServiceCard({ title, sub, desc, isOpen, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={`w-full rounded-xl border bg-white p-5 text-left transition-all duration-200 hover:border-[#1F4A3D]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4A3D] sm:p-6 ${
        isOpen ? "border-[#1F4A3D]" : "border-gray-200"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-lg font-bold text-[#1F4A3D]">{title}</span>
          {sub && <span className="mt-1 block text-sm text-gray-600">{sub}</span>}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`mt-1 h-5 w-5 shrink-0 text-[#1F4A3D] transition-transform duration-300 motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </span>
      <span
        className={`grid transition-all duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <span className="block min-h-0 overflow-hidden">
          <span className="block pt-3 text-base text-gray-700">{desc}</span>
        </span>
      </span>
    </button>
  );
}
