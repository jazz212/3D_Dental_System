"use client";

import AppointmentForm from "./AppointmentForm";
import ClinicInfoCard from "./ClinicInfoCard";
import EmergencyBanner from "./EmergencyBanner";
import TestimonialCard from "./TestimonialCard";

export default function BookAppointment() {
  return (
    <div>

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
