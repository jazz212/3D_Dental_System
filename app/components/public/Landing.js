import Link from "next/link";
import Image from "next/image";
import { ShieldPlus, Sparkles, Scan, PenTool } from "lucide-react";

export default function Landing() {
  return (
    <div>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-20 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-extrabold sm:text-5xl leading-tight text-[#1F4A3D] md:text-6xl">
            Precision Care,
            <br />
            Natural Smiles.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-600">
            Gentle dental care for all ages in Tagaytay City. Book online and we&apos;ll email you to confirm your visit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href="/appointments" className="rounded-md bg-[#1F4A3D] px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              Book Appointment
            </Link>
            <Link href="/services" className="rounded-md border border-[#1F4A3D] px-6 py-3 text-center font-semibold text-[#1F4A3D] transition-all duration-200 hover:bg-[#1F4A3D] hover:text-white active:translate-y-0">
              See Our Services
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-2xl bg-gray-100 p-8 sm:p-16">
          <Image
            src="/Logo/ToothPeakLogo.jpg"
            alt="ToothPeak Dental Clinic logo"
            width={1024}
            height={426}
            className="h-auto w-full max-w-sm rounded-xl object-contain"
            priority
          />
        </div>
      </section>

      <section className="border-t border-gray-200 bg-[#F0F3F1] px-5 sm:px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-[#1F4A3D] md:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600">
            A few of the treatments we offer. Choose one to see the full list.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Only services listed on the Services page, in plain words. */}
            {[
              { icon: ShieldPlus, title: "Teeth Cleaning", desc: "Removes plaque and tartar to keep your teeth and gums healthy." },
              { icon: Sparkles, title: "Braces", desc: "Metal, ceramic, or clear braces to straighten your teeth." },
              { icon: Scan, title: "Dental X-Rays", desc: "Pictures of your teeth and jaw so we can plan the right treatment." },
              { icon: PenTool, title: "Crowns & Dentures", desc: "Fix or replace damaged and missing teeth so you can eat and smile with ease." },
            ].map(({ icon: Icon, title, desc }) => (
              // The hover lift makes the card look clickable, so it is: it
              // opens the Services page with the full list.
              <Link
                key={title}
                href="/services"
                className="block rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4A3D]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-5 w-5 text-[#1F4A3D]" />
                </div>
                <h3 className="text-lg font-bold text-[#1F4A3D]">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 sm:px-8 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-2xl bg-[#A9D5C0] p-6 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#1F4A3D] md:text-3xl">
              Ready for your visit?
            </h2>
            <p className="mt-3 max-w-xl text-[#2C4A3E]">
              Send a request in a few minutes. We&apos;ll email you to confirm the date and time.
            </p>
          </div>
          <Link href="/appointments" className="w-full rounded-md bg-[#1F4A3D] px-6 py-3 text-center font-semibold md:w-auto md:whitespace-nowrap text-white transition-all duration-200 hover:bg-[#163a2f] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            Book Appointment
          </Link>
        </div>
      </section>

    </div>
  );
}