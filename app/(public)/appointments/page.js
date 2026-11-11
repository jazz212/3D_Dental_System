import BookAppointment from "@/app/components/public/BookAppointment";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Request a visit to ToothPeak Dental Clinic in Tagaytay City online. Pick a preferred date and we'll email you to confirm.",
};

export default function BookAppointmentPage() {
  return <BookAppointment />;
}
