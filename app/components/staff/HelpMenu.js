"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, CircleHelp, Mail } from "lucide-react";

// Who staff contact for help. Change the email here when the real support
// address is ready.
const SUPPORT_CONTACT = {
  email: "support@example.com",
  teamName: "ToothPeak DenTrack Development Team",
  subject: "ToothPeak DenTrack Support",
};

// The Quick Guide. Add or edit a topic here; no other changes needed.
// Button and menu names match what staff see on screen.
const GUIDE_TOPICS = [
  {
    title: "How to add a new patient",
    steps: [
      "Click Add Patient in the menu on the left, or Add New Patient on the Overview page.",
      "Fill in Basic Information, Chief Complaint, Medical History and Dental History, then click Submit.",
      "When the dentist is ready, click Begin Vital Signs & Intraoral Examination, fill it in and click Save.",
      "Go through Diagnostic Tests, then Patient Consent, where the patient signs.",
    ],
  },
  {
    title: "How to book an appointment",
    steps: [
      "On the Overview page, click Add Appointment. You can also open a patient's record and click Add Appointment there.",
      "Type the patient's name and pick them from the list.",
      "Choose the date, start time and end time. Times that are already booked can't be picked.",
      "Tick the services, then click Save appointment.",
    ],
  },
  {
    title: "How to confirm or cancel an online booking request",
    steps: [
      "On the Overview page, find the request under Pending Requests.",
      "To accept it, click Schedule, choose the date, start time and end time, then click Confirm appointment. The patient gets a confirmation email.",
      "To turn it down, click Decline.",
      "To cancel a visit that is already booked, find it under All Appointments, click the … button, then Cancel appointment.",
    ],
  },
  {
    title: "How to find a patient record",
    steps: [
      "Type the patient's name in the search box at the top of any page, then pick them from the results.",
      "Or click Patient Records in the menu on the left and search by name. Use the filters to narrow by sex or age group.",
      "Click the patient's name to open their record.",
      "Archived patients are hidden from the active list. Use the tabs above the list to see them.",
    ],
  },
  {
    title: "How online bookings show up",
    steps: [
      "When someone books on the clinic website, a red number appears on the bell at the top of the page.",
      "Click the bell to see the new booking. Clicking it takes you to Pending Requests.",
      "The Pending appointments box on the Overview page shows how many requests are waiting.",
      "The bell also reminds you about requests waiting more than a day and visits booked for tomorrow.",
    ],
  },
];

const supportMailto = `mailto:${SUPPORT_CONTACT.email}?subject=${encodeURIComponent(SUPPORT_CONTACT.subject)}`;

// open / onOpenChange come from the Navbar, so only one header panel is
// open at a time.
export default function HelpMenu({ open, onOpenChange }) {
  // Which guide topic is expanded; one at a time.
  const [openTopic, setOpenTopic] = useState(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const idPrefix = useId();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) onOpenChange(false);
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onOpenChange(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label="Help"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors"
      >
        <CircleHelp className="w-5 h-5" aria-hidden="true" />
      </button>

      {open && (
        // Same placement as the notifications panel: full width under the
        // top bar on phones, a dropdown under the button from sm.
        <div
          role="dialog"
          aria-label="Help"
          className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:w-96 mt-2 z-40 max-h-[70dvh] sm:max-h-[32rem] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
        >
          <section className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Quick Guide</h2>
            <ul className="mt-2 divide-y divide-gray-100">
              {GUIDE_TOPICS.map((topic, index) => {
                const isOpen = openTopic === index;
                const panelId = `${idPrefix}-topic-${index}`;
                return (
                  <li key={topic.title}>
                    <button
                      type="button"
                      onClick={() => setOpenTopic(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full flex items-center justify-between gap-2 py-2.5 pointer-coarse:min-h-11 text-left text-sm font-medium text-gray-800 hover:text-[#00685F] cursor-pointer"
                    >
                      {topic.title}
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <ol
                        id={panelId}
                        className="mb-3 ml-5 list-decimal space-y-1.5 text-sm text-gray-600 marker:text-[#00685F]"
                      >
                        {topic.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="px-4 py-3">
            <h2 className="font-semibold text-gray-900">Need help?</h2>
            <p className="mt-1 text-sm text-gray-600">
              Send us the page you were on and what happened, and we&apos;ll get back to you.
            </p>
            <a
              href={supportMailto}
              className="mt-3 inline-flex items-center gap-2 min-h-11 text-sm font-medium text-[#00685F] underline underline-offset-4"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              {SUPPORT_CONTACT.email}
            </a>
            <p className="text-xs text-gray-500">{SUPPORT_CONTACT.teamName}</p>
          </section>
        </div>
      )}
    </div>
  );
}
