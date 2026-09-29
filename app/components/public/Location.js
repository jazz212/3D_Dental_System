import { ArrowRight, MapPin, Phone, Clock } from "lucide-react";
import {
  CLINIC_ADDRESS,
  CLINIC_DIRECTIONS_URL,
  CLINIC_PHONE,
  CLINIC_PHONE_LINK,
} from "@/lib/clinicContact";

// href makes a detail tappable: the number dials, the address opens the map.
const locationDetails = [
  { icon: MapPin, label: "Address", value: CLINIC_ADDRESS, href: CLINIC_DIRECTIONS_URL },
  { icon: Phone, label: "Phone", value: CLINIC_PHONE, href: CLINIC_PHONE_LINK },
  { icon: Clock, label: "Clinic Hours", value: "Tue – Sat, 9:00 AM – 5:00 PM" },
];

export default function Location() {
  return (
    <div>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <h1 className="text-4xl font-extrabold sm:text-5xl text-[#1F4A3D] md:text-6xl">Location</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Find us in the heart of Tagaytay — convenient access with ample parking for a seamless visit.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#1F4A3D]">ToothPeak Dental Clinic</h2>

            <div className="mt-8 space-y-6">
              {locationDetails.map(({ icon: Icon, label, value, href }) => (
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

            <a
              href={CLINIC_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1F4A3D] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#163a2f]"
            >
              Get Directions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

    </div>
  );
}
