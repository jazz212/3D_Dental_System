"use client";

import { Info, MapPin, Phone } from "lucide-react";
import OperatingHoursEditor from "./OperatingHoursEditor";

// Same details the public Location page shows. Read-only here for now.
const CLINIC_DETAILS = [
  { icon: Info, label: "Clinic Name", value: "ToothPeak Dental Clinic" },
  {
    icon: MapPin,
    label: "Address",
    value:
      "FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway, cor. Airborne St., Maharlika East, Tagaytay City.",
  },
  { icon: Phone, label: "Phone", value: "0966 990 8551" },
];

export default function Settings() {
  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Clinic Settings</h1>
        <p className="text-gray-500">
          Your clinic&apos;s details and the hours your dentists are available.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-3">
        <section className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="font-bold text-lg">Clinic Details</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            {CLINIC_DETAILS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3 py-3">
                <Icon
                  aria-hidden="true"
                  className="mt-0.5 w-5 h-5 shrink-0 text-[#00685F]"
                />
                <div className="min-w-0">
                  <dt className="text-sm text-gray-500">{label}</dt>
                  <dd className="font-medium tabular-nums">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="lg:col-span-2">
          <OperatingHoursEditor />
        </div>
      </div>
    </div>
  );
}
