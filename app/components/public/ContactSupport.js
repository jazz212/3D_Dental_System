import Link from "next/link";
import { Phone, Mail, Clock } from "lucide-react";
import { CLINIC_HOURS, CLINIC_PHONE, CLINIC_PHONE_LINK } from "@/lib/clinicContact";

const contactDetails = [
  { icon: Phone, label: "Phone", value: CLINIC_PHONE, href: CLINIC_PHONE_LINK },
  { icon: Mail, label: "Email", value: "support@toothpeak.com" },
  { icon: Clock, label: "Clinic Hours", value: CLINIC_HOURS },
];

export default function ContactSupport() {
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

          {/* There was a message form here, but nothing stored or sent what
              people typed. Until there's a real inbox, point them to the ways
              that do reach the clinic. */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
            <h2 className="text-lg font-bold text-[#1F4A3D]">The fastest way to reach us</h2>
            <p className="mt-3 text-gray-600">
              Call during clinic hours for questions about treatment, prices, or an
              existing appointment. To ask for a new visit, use the booking form and
              we&apos;ll email you to confirm.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={CLINIC_PHONE_LINK}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#1F4A3D] px-6 font-semibold text-white transition-colors duration-200 hover:bg-[#163a2f]"
              >
                <Phone className="h-4 w-4" />
                Call {CLINIC_PHONE}
              </a>
              <Link
                href="/appointments"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#1F4A3D] px-6 font-semibold text-[#1F4A3D] transition-colors duration-200 hover:bg-[#EDEFEE]"
              >
                Request an appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
