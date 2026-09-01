"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import Footer from "@/app/components/Footer";

const contactDetails = [
  { icon: Phone, label: "Phone", value: "0966 990 8551" },
  { icon: Mail, label: "Email", value: "support@toothpeak.com" },
  { icon: Clock, label: "Clinic Hours", value: "Tue – Sat, 9:00 AM – 5:00 PM" },
];

export default function ContactSupport() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
  }

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
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Contact Support</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Questions about your treatment or an appointment? We&apos;re here to help.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Get in Touch */}
          <div>
            <h2 className="text-3xl font-bold text-[#1F4A3D]">Get in Touch</h2>
            <p className="mt-3 text-gray-600">
              Reach our team during clinic hours and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-6">
              {contactDetails.map(({ icon: Icon, label, value }) => (
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

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-8"
          >
            <h3 className="text-lg font-bold text-[#1F4A3D]">Send a Message</h3>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1F2D28]">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1F2D28]">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#1F2D28]">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="resize-none rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Send
            </button>

            {submitted && (
              <p className="mt-4 text-sm text-[#1F4A3D]">
                Thanks for reaching out — we&apos;ll get back to you shortly.
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}