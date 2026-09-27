"use client";

import { useState } from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { CLINIC_PHONE, CLINIC_PHONE_LINK } from "@/lib/clinicContact";

const contactDetails = [
  { icon: Phone, label: "Phone", value: CLINIC_PHONE, href: CLINIC_PHONE_LINK },
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
    <div>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <h1 className="text-4xl font-extrabold sm:text-5xl text-[#1F4A3D] md:text-6xl">Contact Support</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Questions about your treatment or an appointment? We&apos;re here to help.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Get in Touch */}
          <div>
            <h2 className="text-3xl font-bold text-[#1F4A3D]">Get in Touch</h2>
            <p className="mt-3 text-gray-600">
              Reach our team during clinic hours and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="mt-8 space-y-6">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-3">
                  <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-[#1F4A3D]" />
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm text-gray-600">
                      {href ? (
                        <a href={href} className="inline-flex min-h-11 items-center font-medium text-[#1F4A3D] underline underline-offset-4">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8"
          >
            <h3 className="text-lg font-bold text-[#1F4A3D]">Send a Message</h3>

            <div className="mt-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-name" className="text-sm font-semibold text-[#1F2D28]">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className="rounded-lg border border-[#D8DAD2] bg-white px-3.5 py-2.5 text-base outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-email" className="text-sm font-semibold text-[#1F2D28]">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-lg border border-[#D8DAD2] bg-white px-3.5 py-2.5 text-base outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="contact-message" className="text-sm font-semibold text-[#1F2D28]">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="resize-none rounded-lg border border-[#D8DAD2] bg-white px-3.5 py-2.5 text-base outline-none focus:border-[#1F4A3D] focus:ring-1 focus:ring-[#1F4A3D]"
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
              <p role="status" className="mt-4 text-sm text-[#1F4A3D]">
                Thanks for reaching out — we&apos;ll get back to you shortly.
              </p>
            )}
          </form>
        </div>
      </section>

    </div>
  );
}
