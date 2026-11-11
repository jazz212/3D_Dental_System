import { Phone } from "lucide-react";
import { CLINIC_PHONE, CLINIC_PHONE_LINK } from "@/lib/clinicContact";
import AppointmentForm from "./AppointmentForm";
import ClinicInfoCard from "./ClinicInfoCard";

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

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 pb-20 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* On phones the sidebar is below the whole form, so someone in pain
            would scroll past every field to find the number. This line puts
            the call first; from lg the clinic phone sits beside the form. */}
        <a
          href={CLINIC_PHONE_LINK}
          className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#F3D8D1] bg-[#FCEEEA] px-4 text-center text-sm font-medium text-[#B4432E] lg:hidden"
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
          Dental emergency? Call {CLINIC_PHONE}
        </a>
        <AppointmentForm />

        {/* The wrapper keeps the card at its own height instead of stretching
            to the form's height in the grid row. */}
        <div>
          <ClinicInfoCard />
        </div>
      </div>
    </div>
  );
}
