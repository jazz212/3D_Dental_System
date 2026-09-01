"use client";

import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import Footer from "./Footer";

const specialists = [
  { name: "Dr. Maria Makiling", role: "Lead Prosthodontist" },
  { name: "Dr. Lebron James", role: "Oral Surgeon" },
  { name: "Dr. Lesley Mabuhay", role: "Orthodontist" },
  { name: "Lin Ling", role: "Lead Hygienist" },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] text-[#1F2D28]">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link
            href="/landing"
            className="flex items-center gap-2 text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
          >
            
            ToothPeak
          </Link>

          <nav className="hidden items-center gap-10 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            <Link
              href="/landing"
              className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full"
            >
              Services
            </Link>
            <Link
              href="/aboutus"
              className="relative text-[15px] font-medium text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1F4A3D]"
            >
              About Us
            </Link>
            <a
              href="/appointments"
              className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full"
            >
              Book Appointment
            </a>
          </nav>

          <div className="hidden md:block md:w-[130px]" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-8 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">
          Elevating Dental Care.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          At ToothPeak, we combine clinical precision with organic warmth to
          provide an unparalleled patient experience. Our modern facility and
          expert team are dedicated to ensuring your dental health is managed
          with the utmost care and transparency.
        </p>
      </section>

      {/* Facility + Mission */}
      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl md:col-span-2">
            <div className="flex h-72 items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent bg-[#4A7C6F] p-8 md:h-full">
              <div className="text-white">
                <h3 className="text-xl font-bold">State-of-the-Art Facility</h3>
                <p className="mt-2 max-w-md text-sm text-white/90">
                  Designed to reduce cognitive load and anxiety, our spaces
                  utilize natural lighting and premium aesthetics to create a
                  calming clinical environment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3EE]">
                <BadgeCheck className="h-5 w-5 text-[#1F4A3D]" />
              </div>
              <h3 className="text-lg font-bold text-[#1F4A3D]">Our Mission</h3>
              <p className="mt-2 text-sm text-gray-600">
                To provide trustworthy, restorative, and highly efficient
                dental care that bridges the gap between complex procedures
                and patient comfort.
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-[#A9D5C0] p-6 text-center">
              <p className="text-4xl font-extrabold text-[#1F4A3D]">15+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#1F4A3D]">
                Years of Excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="border-t border-gray-200 bg-[#F0F3F1] px-8 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-[#1F4A3D] md:text-4xl">
            Meet Our Specialists
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Expert care delivered by professionals committed to continuing
            education and compassionate treatment.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialists.map(({ name, role }) => (
              <div
                key={name}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-56 items-center justify-center bg-gray-200 text-sm text-gray-400">
                  Photo
                </div>
                <div className="p-4 text-left">
                  <p className="font-bold text-[#1F4A3D]">{name}</p>
                  <p className="text-sm text-gray-600">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#1F4A3D]">Visit Our Clinic</h2>
            <p className="mt-3 text-gray-600">
              Conveniently located with ample parking, providing a seamless
              arrival experience for your appointments.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#1F4A3D]" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-sm text-gray-600">
                    FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway,
                    cor. Airborne St., Maharlika East, Tagaytay City.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-[#1F4A3D]" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-sm text-gray-600">0966 990 8551</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-[#1F4A3D]" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-gray-600">
                    Sun & Mon: CLosed
                    <br />
                    Tue - Sat: 9AM-5PM
                    <br />
                  
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=ToothPeak%20Dental%20Clinic%2C%20FGC%20Building%2C%20Tagaytay-Nasugbu%20Road%2C%20Tagaytay%20City"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Directions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="min-h-[320px] overflow-hidden rounded-2xl">
            <iframe
              title="ToothPeak Dental Clinic location"
              src="https://maps.google.com/maps?q=ToothPeak%20Dental%20Clinic%2C%20FGC%20Building%2C%20Tagaytay-Nasugbu%20Road%2C%20Tagaytay%20City&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}