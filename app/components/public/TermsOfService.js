
const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing this website or booking an appointment with ToothPeak Dental Clinic, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.",
    ],
  },
  {
    title: "Appointment Booking Policy",
    body: [
      "Appointments may be requested through our website, by phone, or in person. A requested appointment is not confirmed until you receive confirmation from our staff. Please arrive on time; late arrivals may result in a shortened appointment or rescheduling.",
    ],
  },
  {
    title: "Cancellation Policy",
    body: [
      "We kindly request at least 24 hours' notice if you need to cancel or reschedule an appointment. This allows us to offer the time to other patients. Repeated missed appointments or late cancellations may affect your ability to book future appointments.",
    ],
  },
  {
    title: "Account Responsibility",
    body: [
      "If you create an account or submit information through our website, you are responsible for maintaining the accuracy and confidentiality of that information. Please notify us promptly of any unauthorized use or changes to your details.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "Information provided on this website is for general guidance only and does not constitute professional dental advice. All clinical decisions remain with your dentist. To the fullest extent permitted by law, ToothPeak Dental Clinic is not liable for decisions made based on website content without a consultation.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may update these Terms of Service from time to time. Any changes will be posted on this page, and continued use of our services after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div>

      <section className="mx-auto max-w-4xl px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-[#1F4A3D] md:text-6xl">Terms of Service</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          The terms governing your use of ToothPeak Dental Clinic&apos;s website and services.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-8 pb-20">
        <div className="space-y-10">
          {sections.map(({ title, body }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-[#1F4A3D]">{title}</h2>
              {body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-gray-600">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
