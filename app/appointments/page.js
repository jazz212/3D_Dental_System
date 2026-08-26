"use client";

import Link from "next/link";
import AppointmentForm from "../components/AppointmentForm";
import ClinicInfoCard from "../components/ClinicInfoCard";
import EmergencyBanner from "../components/EmergencyBanner";
import TestimonialCard from "../components/TestimonialCard";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-[#F7F8F6]">
      <header className="border-b border-gray-200">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link
            href="/landing"
            className="text-xl font-bold text-[#1F4A3D] transition-colors duration-200 hover:text-[#163a2f]"
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
              className="relative text-[15px] font-medium text-[#1F2D28] transition-colors duration-200 hover:text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[#1F4A3D] after:transition-all after:duration-300 hover:after:w-full"
            >
              About Us
            </Link>
            <Link
              href="/appointments"
              className="relative text-[15px] font-medium text-[#1F4A3D] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#1F4A3D]"
            >
              Book Appointment
            </Link>
          </nav>
          <div className="hidden md:block md:w-[130px]" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-10 pt-16 text-center sm:pt-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1F4B3F] sm:text-5xl">
          Request an Appointment
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#5B5F55]">
          Take the first step towards a healthier, brighter smile. Fill out the form below and
          our team will contact you to confirm your booking.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-20 lg:grid-cols-[1fr_360px]">
        <AppointmentForm />

        <div className="flex flex-col gap-6">
          <ClinicInfoCard />
          <EmergencyBanner />
          <TestimonialCard />
        </div>
      </div>
    </div>
  );
}