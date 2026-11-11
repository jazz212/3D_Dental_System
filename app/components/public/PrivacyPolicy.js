
const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect personal information you provide when scheduling appointments, including your name, contact details, date of birth, and medical or dental history. When you request an appointment online we collect the patient's name, email address, date of birth, the reason for the visit, and any notes you add. Treatment records are created by our staff during your visits.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "Your information is used to schedule and manage appointments, deliver and coordinate dental care, and communicate with you about your treatment. We may also use anonymized data to improve our services and patient experience.",
    ],
  },
  {
    title: "Data Storage & Security",
    body: [
      "Patient records are stored securely and access is limited to authorized clinical and administrative staff. We apply appropriate technical and organizational safeguards to protect your information against unauthorized access, alteration, disclosure, or destruction.",
    ],
  },
  {
    title: "Sharing of Information",
    body: [
      "We do not sell your personal information. We may share information with third-party providers who assist in operating our practice — such as dental laboratories, specialist referrals, or the service that sends our appointment emails — only as necessary to provide care, and always under confidentiality obligations.",
    ],
  },
  {
    title: "Data Privacy Act of 2012",
    body: [
      "We process personal and health information in line with the Data Privacy Act of 2012 (Republic Act No. 10173) and the rules of the National Privacy Commission. Health information is sensitive personal information, so we only collect what we need to arrange and provide your care, and we ask for your consent before you send an appointment request. If you believe your data has been mishandled, you may also file a complaint with the National Privacy Commission.",
    ],
  },
  {
    title: "Patient Rights",
    body: [
      "You may request access to, correction of, or a copy of your personal and health records at any time. You may also withdraw consent for non-essential communications. To exercise these rights, contact our clinic using the details below.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions about this Privacy Policy or how your information is handled, or to use any of your rights above, call ToothPeak Dental Clinic during clinic hours or visit us at the clinic. Details are on our Contact Support page.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <h1 className="text-4xl font-extrabold sm:text-5xl text-[#1F4A3D] md:text-6xl">Privacy Policy</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          How ToothPeak Dental Clinic collects, uses, and protects your personal and health information.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 sm:px-8 pb-20">
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
