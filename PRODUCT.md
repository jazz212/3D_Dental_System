# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Clinic staff (primary for the dashboard):** dentists and assistants at ToothPeak Dental Clinic. They use the staff dashboard mostly on a clinic desktop, and sometimes on a phone or tablet, to review appointment requests, confirm and manage bookings, keep patient records, and set clinic hours.
- **Patients (primary for the public site):** people in and around Tagaytay looking for dental care. They browse services, check location and hours, and send an appointment request. Many are older adults.

## Product Purpose

A web system for a real clinic, ToothPeak Dental Clinic in Tagaytay City, Philippines, built as a school capstone/thesis project. It has two halves:

- a public website where patients learn about the clinic and request appointments;
- a signed-in staff dashboard where the clinic turns those requests into confirmed appointments and keeps patient records.

Success: patients can request a visit without calling, and staff can handle requests, bookings and records in one place instead of on paper.

## Positioning

The planned differentiator is an interactive **3D dental chart** in the patient record, where staff record findings per tooth and surface. It is not in the current `main` branch; earlier uncommitted work on it was discarded. Treat it as the intended key feature, not a shipped one.

## Operating Context

- A small clinic with two listed dentists. Staff work at a desktop during clinic hours and check things on phones between patients.
- Patients submit a request on the public site. It lands as `requested`, and staff confirm it into a booking. The patient is emailed on confirmation through a Supabase Edge Function using Resend, which is still on Resend's test sender.
- The project is defended as a thesis, so the code must stay readable and explainable by its authors.

## Capabilities and Constraints

- Stack: Next.js (App Router), React, Tailwind CSS v4, Supabase (Postgres, Auth, Row Level Security, Edge Functions), FullCalendar, lucide-react icons.
- Staff: dashboard overview, appointment calendar, pending requests, add and edit appointments, patient records, add patient intake form, clinic settings (read-only clinic details plus editable operating hours saved to `clinic_settings`).
- Public: landing, services, about us, location, book appointment, contact support, privacy policy, terms of service.
- Language: English, with familiar Filipino terms beside the clinical names (for example "Tooth Restoration (Pasta)", "Tooth Extraction (Bunot)", "Dentures (Pustiso)").
- Undecided: whether booking should enforce the operating hours; one source of truth for the hours shown on the public site (it currently disagrees with itself).

## Brand Commitments

- Name: **ToothPeak Dental Clinic**. The old "Tooth Peaked" spelling is wrong.
- Logo: `public/Logo/ToothPeakLogo.jpg`.
- Voice on the public site: calm, reassuring and professional. The About page describes "clinical precision with organic warmth" and spaces designed "to reduce cognitive load and anxiety".

## Evidence on Hand

- Real: clinic address (FGC Building, Tagaytay-Nasugbu Road, Aguinaldo Highway, cor. Airborne St., Maharlika East, Tagaytay City), phone 0966 990 8551, dentists Dr. Feliza Joy C. Taroy, DMD and Dr. Justin Louis F. Valerio, DMD, and the services and imaging list in `app/components/public/Services.js`.
- Not real: the testimonial in `app/components/public/TestimonialCard.js` is placeholder text (it names a "Dr. Smith" who does not work there). Do not add testimonials, ratings, patient counts or awards without real sources.
- Unknown: clinic email, registration number, tagline, and the confirmed official opening hours.

## Product Principles

1. **Explainable over clever.** The authors must be able to explain every screen and line of code in a thesis defense.
2. **Calm for patients.** Plain steps, reassuring tone, nothing that adds anxiety to booking a dental visit.
3. **Fast for staff.** The next request or appointment to act on should be obvious at a glance.
4. **Truthful content.** Only real clinic facts; mark placeholders clearly until they are replaced.

## Accessibility & Inclusion

- Older patients: readable text sizes, strong contrast, large tap targets, and simple one-thing-per-step flows on the public site.
- Filipino and English speakers: keep the familiar Filipino terms next to clinical names.
