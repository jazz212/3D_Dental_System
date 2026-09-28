"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import { fetchPatientRecord, getCurrentAge } from "@/lib/patients";
import { fetchPatientAppointments } from "@/lib/appointments";
import { formatTime, getLocalDateString } from "@/lib/appointmentTimes";
import { fetchPatientImages } from "@/lib/patientImages";
import { buildPatientTimeline } from "@/lib/patientTimeline";
import AddAppointmentPopup from "./AddAppointmentPopup";
import AppointmentDetailsPopup from "./AppointmentDetailsPopup";
import EditAppointmentPopup from "./EditAppointmentPopup";
import PatientImagingGallery, { ImageLightbox, ImageThumbnail } from "./PatientImagingGallery";
import {
  panelClass,
  primaryButtonClass,
  rowActionButtonClass,
  secondaryButtonClass,
} from "./staffStyles";
import PhoneLink from "./PhoneLink";

// Started from Zyrel's MedicalRecords design (part-ni-zyrel branch), filled
// from the database. Organised as a visit timeline: each day on it carries
// that day's visits, exam and images, so staff don't match them up by date.

// "coral_pink" -> "Coral pink", for the fixed choices saved by the intake form.
function toReadable(value) {
  if (!value) return null;
  const words = value.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Intake yes/no questions are saved as true, false or null (skipped).
function toYesNo(answer) {
  if (answer === true) return "Yes";
  if (answer === false) return "No";
  return null;
}

function formatDate(dateOrTimestamp) {
  if (!dateOrTimestamp) return null;
  // A bare "YYYY-MM-DD" is parsed as UTC; "T00:00" keeps it on the right day.
  const value = dateOrTimestamp.length === 10 ? `${dateOrTimestamp}T00:00` : dateOrTimestamp;
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// "Juan Dela Cruz" -> "JD"
function getInitials(fullName) {
  return fullName
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function MedicalRecords({ patientId }) {
  const [record, setRecord] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | not-found | error
  // Bumped by "Try again" to re-run the load effect.
  const [loadAttempt, setLoadAttempt] = useState(0);

  // `ignore` drops a response that arrives after the page was left.
  useEffect(() => {
    let ignore = false;

    const loadRecord = async () => {
      try {
        const result = await fetchPatientRecord(patientId);
        if (ignore) return;
        setRecord(result);
        setLoadState(result ? "ready" : "not-found");
      } catch {
        if (!ignore) setLoadState("error");
      }
    };

    loadRecord();
    return () => {
      ignore = true;
    };
  }, [patientId, loadAttempt]);

  const retryLoad = () => {
    setLoadState("loading");
    setLoadAttempt((previous) => previous + 1);
  };

  return (
    <div className="bg-white w-full p-4 pt-2 pb-8">
      <Link
        href="/dashboard/patient-records"
        className="inline-flex items-center gap-1 pointer-coarse:min-h-11 rounded text-sm text-gray-600 hover:text-[#00685F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Patient Records
      </Link>

      {loadState === "loading" && (
        <p role="status" className="mt-6 text-gray-600">
          Loading patient record...
        </p>
      )}

      {loadState === "not-found" && (
        <div className="mt-6">
          <h1 className="text-3xl font-bold">Patient not found</h1>
          <p className="mt-2 text-gray-600">
            This link doesn&apos;t match any patient. Go back to Patient Records
            and search for them by name.
          </p>
        </div>
      )}

      {loadState === "error" && (
        <div
          role="alert"
          className="mt-6 flex flex-col items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800"
        >
          <p>
            This patient record couldn&apos;t be loaded. Check your internet
            connection, then try again.
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className={primaryButtonClass}
          >
            Try again
          </button>
        </div>
      )}

      {loadState === "ready" && <PatientRecordView record={record} />}
    </div>
  );
}

/* ---------- The loaded record ---------- */
function PatientRecordView({ record }) {
  const { patient, medicalHistory, examinations } = record;
  const [appointments, setAppointments] = useState([]);
  const [appointmentsState, setAppointmentsState] = useState("loading"); // loading | ready | error
  // Bumped after booking or editing to reload the visits.
  const [visitsRefreshKey, setVisitsRefreshKey] = useState(0);
  // Images are loaded here, not in the gallery, because the timeline also
  // shows them under the day they were taken.
  const [images, setImages] = useState([]);
  const [imagesState, setImagesState] = useState("loading"); // loading | ready | error
  const [imagesRefreshKey, setImagesRefreshKey] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  useEffect(() => {
    let ignore = false;
    const loadAppointments = async () => {
      try {
        const found = await fetchPatientAppointments(patient.id);
        if (ignore) return;
        setAppointments(found);
        setAppointmentsState("ready");
      } catch {
        if (!ignore) setAppointmentsState("error");
      }
    };
    loadAppointments();
    return () => {
      ignore = true;
    };
  }, [patient.id, visitsRefreshKey]);

  useEffect(() => {
    let ignore = false;
    const loadImages = async () => {
      try {
        const found = await fetchPatientImages(patient.id);
        if (ignore) return;
        setImages(found);
        setImagesState("ready");
      } catch {
        if (!ignore) setImagesState("error");
      }
    };
    loadImages();
    return () => {
      ignore = true;
    };
  }, [patient.id, imagesRefreshKey]);

  const refreshVisits = () => setVisitsRefreshKey((previous) => previous + 1);
  const refreshImages = () => setImagesRefreshKey((previous) => previous + 1);
  const timeline = buildPatientTimeline(
    appointments,
    examinations,
    images,
    getLocalDateString(new Date()),
  );

  // Reading order follows what the dentist needs first: who this is, what
  // could make treatment unsafe, then the visits with each day's exam and
  // images. Contact details, the intake answers and the image library are
  // look-ups, so they sit in the side column.
  return (
    <>
      <PatientHeader patient={patient} onBook={() => setIsBooking(true)} />

      <div className="mt-6 flex flex-col gap-4">
        <MedicalStatus medicalHistory={medicalHistory} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VisitTimeline
              timeline={timeline}
              appointmentsState={appointmentsState}
              imagesState={imagesState}
              onRetryVisits={refreshVisits}
              onView={setAppointmentToView}
              onEdit={setAppointmentToEdit}
              onImagesChanged={refreshImages}
            />
          </div>

          <div className="flex flex-col gap-4">
            <PersonalDetails patient={patient} />
            <DentalHistory medicalHistory={medicalHistory} />
            <PatientImagingGallery
              patientId={patient.id}
              images={images}
              loadState={imagesState}
              onReload={refreshImages}
            />
          </div>
        </div>
      </div>

      {isBooking && (
        <AddAppointmentPopup
          onClose={() => setIsBooking(false)}
          onAppointmentAdded={refreshVisits}
          initialPatient={patient}
        />
      )}
      {appointmentToView && (
        <AppointmentDetailsPopup
          appointment={appointmentToView}
          onClose={() => setAppointmentToView(null)}
        />
      )}
      {appointmentToEdit && (
        <EditAppointmentPopup
          appointment={appointmentToEdit}
          onClose={() => setAppointmentToEdit(null)}
          onSave={refreshVisits}
        />
      )}
    </>
  );
}

/* ---------- Page header ---------- */
// A page header rather than a card, like the other staff pages: identity on
// the left, the page's one main action on the right. Kept compact so the
// allergy notice below is still on the first screen of a phone.
function PatientHeader({ patient, onBook }) {
  const factsLine = [
    `ID ${patient.patient_id}`,
    toReadable(patient.sex),
    describeAge(patient),
    patient.contact_number,
    `Registered ${formatDate(patient.created_at)}`,
  ].filter(Boolean);

  return (
    // Side by side only from lg: with the sidebar open, a tablet is too narrow
    // for a long name and the button on one row.
    <header className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0FDFA] text-base font-bold text-[#004D45] sm:h-14 sm:w-14 sm:text-lg"
        >
          {getInitials(patient.full_name)}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold text-gray-900 break-words sm:text-3xl">
              {patient.full_name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${
                patient.archived_at ? "bg-gray-100 text-gray-700" : "bg-[#F0FDFA] text-[#004D45]"
              }`}
            >
              {patient.archived_at ? "Archived" : "Active"}
            </span>
          </div>
          {/* Each fact stays on one line, so a phone number never splits in two. */}
          <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-gray-600 tabular-nums">
            {factsLine.map((fact, index) => (
              <span key={fact} className="whitespace-nowrap">
                {index > 0 && <span aria-hidden="true">· </span>}
                {fact}
              </span>
            ))}
          </p>
        </div>
      </div>
      {/* The booking forms' patient list leaves archived patients out, so
          this page doesn't offer booking for them either. */}
      {patient.archived_at ? (
        <p className="max-w-xs text-sm text-gray-600 lg:text-right">
          Archived patients can&apos;t be booked. Restore them in Patient Records
          to book a visit.
        </p>
      ) : (
        <button
          type="button"
          onClick={onBook}
          className={`${primaryButtonClass} flex shrink-0 items-center justify-center gap-2 self-start lg:self-center`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Appointment
        </button>
      )}
    </header>
  );
}

// "47 years old", or nothing when neither a birth date nor an age was given.
// The birth date itself is listed under Personal and Contact.
function describeAge(patient) {
  const age = getCurrentAge(patient);
  if (age === null || age === undefined) return null;
  return `${age} years old`;
}

/* ---------- Medical status ---------- */
// Allergies lead because the dentist must see them before treating, not
// scroll to find them.
function MedicalStatus({ medicalHistory }) {
  const rows = medicalHistory
    ? [
        ["Medication", medicalHistory.takes_medication ? medicalHistory.medication_details || "Yes (not specified)" : "None reported"],
        ["Conditions", medicalHistory.conditions.length > 0 ? medicalHistory.conditions.join(", ") : "None reported"],
        ["Smoking", describeSmoking(medicalHistory)],
      ]
    : [];

  return (
    // A full-width strip: the allergy notice beside the other safety facts,
    // so it stays short enough to leave the timeline on the first screen.
    <Panel title="Medical Status">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start">
        <AllergyNotice medicalHistory={medicalHistory} />
        {rows.length > 0 && <DetailGrid rows={rows} />}
      </div>
    </Panel>
  );
}

function describeSmoking(medicalHistory) {
  if (!medicalHistory.smokes) return "No";
  const sticks = medicalHistory.sticks_per_day;
  return sticks ? `Yes, ${sticks} sticks a day` : "Yes";
}

function AllergyNotice({ medicalHistory }) {
  if (!medicalHistory) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-sm">
          <span className="font-semibold">No medical history on file.</span> Ask
          about allergies and medication before treatment.
        </p>
      </div>
    );
  }
  if (medicalHistory.has_allergies) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" aria-hidden="true" />
        <div>
          <p className="font-semibold">Allergies</p>
          <p className="font-medium">{medicalHistory.allergy_details || "Yes (not specified)"}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 text-gray-800">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#00685F]" aria-hidden="true" />
      <p className="text-sm">
        <span className="font-semibold">No allergies</span> reported at intake.
      </p>
    </div>
  );
}

/* ---------- Visit timeline ---------- */
// Older days wait behind a button so years of visits don't bury the page.
const DAYS_SHOWN_AT_FIRST = 6;

// "1 exam", "2 images"
function countLabel(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function VisitTimeline({
  timeline,
  appointmentsState,
  imagesState,
  onRetryVisits,
  onView,
  onEdit,
  onImagesChanged,
}) {
  const [showAllDays, setShowAllDays] = useState(false);
  const { upcoming, days } = timeline;
  const visibleDays = showAllDays ? days : days.slice(0, DAYS_SHOWN_AT_FIRST);
  const hiddenDayCount = days.length - visibleDays.length;

  const visitCount = upcoming.length + days.reduce((total, day) => total + day.visits.length, 0);
  const examCount = days.reduce((total, day) => total + day.exams.length, 0);
  const imageCount = days.reduce((total, day) => total + day.images.length, 0);
  // Only count what actually loaded: "0 visits" after a failed load would
  // wrongly say the patient has none.
  const summaryParts = [];
  if (appointmentsState === "loading") summaryParts.push("Loading visits...");
  if (appointmentsState === "ready") summaryParts.push(countLabel(visitCount, "visit", "visits"));
  summaryParts.push(countLabel(examCount, "exam", "exams"));
  if (imagesState === "ready") summaryParts.push(countLabel(imageCount, "image", "images"));
  const summary = summaryParts.join(" · ");
  const isEmpty = appointmentsState === "ready" && upcoming.length === 0 && days.length === 0;

  return (
    <Panel title="Visit Timeline" subtitle={summary} isContainer>
      {appointmentsState === "error" && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          Visits couldn&apos;t be loaded, so only{" "}
          {imagesState === "ready" ? "exams and images are" : "exams are"} shown.{" "}
          <button
            type="button"
            onClick={onRetryVisits}
            className="font-medium underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-[#00685F]"
          >
            Try again
          </button>
        </p>
      )}

      {upcoming.length > 0 && <UpcomingVisits visits={upcoming} onView={onView} onEdit={onEdit} />}

      {isEmpty && (
        <p className="text-sm text-gray-600">
          Nothing here yet. Visits booked for this patient, their exams and
          their images will line up here by day.
        </p>
      )}

      {visibleDays.length > 0 && (
        <ol aria-label="Past and other visits, newest first">
          {visibleDays.map((day, index) => (
            <TimelineDay
              key={day.date}
              day={day}
              isLast={index === visibleDays.length - 1}
              onView={onView}
              onEdit={onEdit}
              onImagesChanged={onImagesChanged}
            />
          ))}
        </ol>
      )}

      {days.length > DAYS_SHOWN_AT_FIRST && (
        <button
          type="button"
          onClick={() => setShowAllDays((previous) => !previous)}
          aria-expanded={showAllDays}
          className={`${secondaryButtonClass} mt-5 w-full text-sm`}
        >
          {showAllDays ? "Show fewer days" : `Show ${hiddenDayCount} earlier days`}
        </button>
      )}
    </Panel>
  );
}

// Pinned above the timeline: what's coming is what staff act on next.
function UpcomingVisits({ visits, onView, onEdit }) {
  return (
    <section aria-labelledby="upcoming-visits-heading" className="mb-6 rounded-lg bg-[#F0FDFA] px-4 py-3">
      <h3 id="upcoming-visits-heading" className="text-sm font-medium text-[#004D45]">
        Upcoming
      </h3>
      <ul className="divide-y divide-[#00685F]/15">
        {visits.map((appointment) => (
          <VisitRow
            key={appointment.id}
            appointment={appointment}
            showDate
            onTint
            onView={() => onView(appointment)}
            onEdit={() => onEdit(appointment)}
          />
        ))}
      </ul>
    </section>
  );
}

// One day on the spine: its visits, then that day's exam and images behind
// a button, so the timeline stays calm until staff ask for the detail.
function TimelineDay({ day, isLast, onView, onEdit, onImagesChanged }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const detailsId = `day-${day.date}-details`;
  const hasDetails = day.exams.length > 0 || day.images.length > 0;

  return (
    <li className="relative pb-6 pl-8 last:pb-0">
      {/* The spine: a 1px rule from this day's dot down to the next day. */}
      {!isLast && (
        <span aria-hidden="true" className="absolute top-4 bottom-0 left-[7px] w-px bg-gray-200" />
      )}
      <span
        aria-hidden="true"
        className="absolute top-1.5 left-0 h-[15px] w-[15px] rounded-full border-2 border-white bg-gray-300 ring-1 ring-gray-300"
      />

      <h3 className="font-semibold text-gray-900 tabular-nums">{formatDate(day.date)}</h3>

      {day.visits.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {day.visits.map((appointment) => (
            <VisitRow
              key={appointment.id}
              appointment={appointment}
              onView={() => onView(appointment)}
              onEdit={() => onEdit(appointment)}
            />
          ))}
        </ul>
      )}
      {day.visits.length === 0 && (
        <p className="mt-1 text-sm text-gray-600">{describeRecordsOnly(day)}</p>
      )}

      {hasDetails && (
        <>
          <DisclosureButton
            isOpen={isOpen}
            onToggle={() => setIsOpen((previous) => !previous)}
            controls={detailsId}
          >
            {isOpen ? "Hide" : "Show"} {describeAttachments(day)}
          </DisclosureButton>

          {isOpen && (
            <div
              id={detailsId}
              className="mt-4 flex flex-col gap-5 transition-opacity duration-200 ease-smooth starting:opacity-0 motion-reduce:transition-none"
            >
              {day.exams.map((exam) => (
                <ExamDetails key={exam.id} exam={exam} />
              ))}
              {day.images.length > 0 && (
                <section>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">Images</h4>
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                    {day.images.map((image, index) => (
                      <li key={image.id}>
                        <ImageThumbnail image={image} onOpen={() => setLightboxIndex(index)} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {lightboxIndex !== null && day.images[lightboxIndex] && (
        <ImageLightbox
          images={day.images}
          index={lightboxIndex}
          onChangeIndex={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onDeleted={() => {
            setLightboxIndex(null);
            onImagesChanged();
          }}
        />
      )}
    </li>
  );
}

// "exam and 2 images", "exam", "2 images"
function describeAttachments(day) {
  const parts = [];
  if (day.exams.length > 0) parts.push(day.exams.length === 1 ? "exam" : `${day.exams.length} exams`);
  if (day.images.length > 0) parts.push(countLabel(day.images.length, "image", "images"));
  return parts.join(" and ");
}

// For a day with records but no booked visit, e.g. an exam done at intake.
function describeRecordsOnly(day) {
  if (day.exams.length > 0 && day.images.length > 0) return "Exam and images recorded";
  if (day.exams.length > 0) return "Exam recorded";
  return "Images uploaded";
}

function VisitRow({ appointment, showDate = false, onTint = false, onView, onEdit }) {
  const description = `${appointment.service} on ${formatDate(appointment.appointment_date)}`;
  const when = showDate
    ? `${formatDate(appointment.appointment_date)} · ${formatTime(appointment.start_time)}`
    : formatTime(appointment.start_time);

  return (
    // Goes side by side only when the timeline panel itself is wide enough
    // (@xl, a container query), not when the screen is: with the sidebar
    // open, a tablet's panel is too narrow and the service name got crushed.
    <li className="flex flex-col gap-2 py-3 @xl:flex-row @xl:items-center @xl:gap-4">
      <p className={`text-sm text-gray-600 tabular-nums @xl:shrink-0 ${showDate ? "@xl:w-44" : "@xl:w-20"}`}>
        {when}
      </p>
      <div className="min-w-0 flex-1 @xl:min-w-40">
        <p className="font-medium text-gray-900 break-words">{appointment.service}</p>
        {appointment.notes && (
          <p className="text-sm text-gray-600 break-words">{appointment.notes}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 @xl:justify-end">
        <StatusPill status={appointment.status} onTint={onTint} />
        <div className="flex items-center">
          <button
            type="button"
            onClick={onView}
            aria-label={`View ${description}`}
            className={`${rowActionButtonClass} p-2`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${description}`}
            className={`${rowActionButtonClass} p-2`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

// Same labels and colours as the Dashboard's appointment table, so a status
// reads the same everywhere. The word is always shown, so colour is never
// the only cue.
const STATUS_LABELS = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

const STATUS_PILL_STYLES = {
  requested: "bg-amber-50 text-amber-800",
  confirmed: "bg-[#F0FDFA] text-[#004D45]",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-50 text-red-700",
  no_show: "bg-orange-50 text-orange-800",
};

// onTint: the pill sits on the mint Upcoming block, where the mint
// "Confirmed" pill would vanish and read as link text, so it gets a white fill.
function StatusPill({ status, onTint = false }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${
        STATUS_PILL_STYLES[status] || "bg-gray-100 text-gray-700"
      } ${onTint ? "bg-white!" : ""}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

/* ---------- Dental history (intake form) ---------- */
// Short by default so the side column stays calm: the reason for the visit
// is what staff check most, the rest of the intake answers open on demand.
function DentalHistory({ medicalHistory }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!medicalHistory) {
    return (
      <Panel title="Dental History">
        <p className="text-sm text-gray-600">No intake form has been completed yet.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Dental History" subtitle={`Intake form, ${formatDate(medicalHistory.created_at)}`}>
      <DetailGrid singleColumn rows={[["Reason for visit", medicalHistory.chief_complaint]]} />
      {isOpen && (
        <div
          id="intake-form-details"
          className="mt-4 transition-opacity duration-200 ease-smooth starting:opacity-0 motion-reduce:transition-none"
        >
          <DetailGrid
            singleColumn
            rows={[
              ["Present illness", medicalHistory.present_illness],
              ["Gums bleed", toYesNo(medicalHistory.gums_bleed)],
              [
                "Previous cleaning",
                withWhen(toYesNo(medicalHistory.had_prophylaxis), medicalHistory.prophylaxis_when),
              ],
              [
                "Previous extraction",
                withWhen(toYesNo(medicalHistory.had_extraction), medicalHistory.extraction_when),
              ],
              ["Denture", toReadable(medicalHistory.denture_type)],
            ]}
          />
        </div>
      )}
      <DisclosureButton
        isOpen={isOpen}
        onToggle={() => setIsOpen((previous) => !previous)}
        controls="intake-form-details"
      >
        {isOpen ? "Hide full intake form" : "Show full intake form"}
      </DisclosureButton>
    </Panel>
  );
}

// The small green "Show ... / Hide ..." toggle used by timeline days and
// the intake form.
function DisclosureButton({ isOpen, onToggle, controls, children }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={controls}
      className="mt-2 inline-flex items-center gap-1 pointer-coarse:min-h-11 rounded text-sm font-medium text-[#00685F] hover:text-[#004D45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
    >
      <ChevronDown
        aria-hidden="true"
        className={`h-4 w-4 transition-transform duration-200 ease-smooth motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
      />
      {children}
    </button>
  );
}

// "Yes" + "last year" -> "Yes, last year"
function withWhen(answer, when) {
  if (answer === "Yes" && when) return `Yes, ${when}`;
  return answer;
}

/* ---------- Examinations ---------- */
const EXAM_AREAS = [
  { label: "Head", key: "head" },
  { label: "Eyes", key: "eyes" },
  { label: "TMJ", key: "tmj" },
  { label: "Lips", key: "lips" },
  { label: "Palate", key: "palate" },
  { label: "Tongue", key: "tongue" },
  { label: "Floor of mouth", key: "mouth_floor" },
];

// The form saves an unticked "Normal" box as false, which could mean
// "abnormal" or "not checked", so the page says exactly what was saved.
function describeExamArea(exam, areaKey) {
  const notes = exam[`${areaKey}_notes`];
  if (exam[`${areaKey}_normal`]) return notes ? `Normal. ${notes}` : "Normal";
  return notes || "Not marked normal";
}

// One exam's details, shown when its day on the timeline is opened.
function ExamDetails({ exam }) {
  const hygiene = [toReadable(exam.oral_hygiene), toReadable(exam.hygiene_severity)]
    .filter(Boolean)
    .join(", ");

  return (
    <article aria-label="Examination" className="flex flex-col gap-5">
      <ExamGroup title="Vital signs">
        <DetailGrid
          rows={[
            ["Blood pressure", exam.blood_pressure ? `${exam.blood_pressure} mmHg` : null],
            ["Pulse rate", exam.pulse_rate ? `${exam.pulse_rate} per minute` : null],
            ["Respiratory rate", exam.respiratory_rate ? `${exam.respiratory_rate} per minute` : null],
            ["Temperature", exam.temperature ? `${exam.temperature} °C` : null],
          ]}
        />
      </ExamGroup>

      <ExamGroup title="Extraoral and intraoral">
        <DetailGrid rows={EXAM_AREAS.map((area) => [area.label, describeExamArea(exam, area.key)])} />
      </ExamGroup>

      <ExamGroup title="Occlusion and gums">
        <DetailGrid
          rows={[
            ["Molar relationship", exam.molar_relationship],
            ["Canine relationship", exam.canine_relationship],
            ["Classification", exam.occlusion_classification],
            ["Gingiva", toReadable(exam.gingiva)],
            ["Gum colour", toReadable(exam.gingiva_color)],
            ["Gum consistency", toReadable(exam.gingiva_consistency)],
            ["Oral hygiene", hygiene || null],
            ["Soft deposits", toReadable(exam.soft_deposits)],
            ["Hard deposits", toReadable(exam.hard_deposits)],
          ]}
        />
      </ExamGroup>
    </article>
  );
}

function ExamGroup({ title, children }) {
  return (
    <section>
      <h4 className="mb-3 text-sm font-medium text-gray-700">{title}</h4>
      {children}
    </section>
  );
}

/* ---------- Personal details ---------- */
// In the narrow side column an email may not fit on one line. <wbr> offers a
// line break just before the "@", so it splits as "maria.santos / @example.com"
// instead of mid-word.
function formatEmailForWrapping(email) {
  if (!email || !email.includes("@")) return email;
  const atIndex = email.indexOf("@");
  return (
    <>
      {email.slice(0, atIndex)}
      <wbr />
      {email.slice(atIndex)}
    </>
  );
}

function PersonalDetails({ patient }) {
  return (
    <Panel title="Personal and Contact">
      <DetailGrid
        singleColumn
        rows={[
          ["Mobile / phone", <PhoneLink key="phone" number={patient.contact_number} />],
          ["Email", formatEmailForWrapping(patient.email)],
          ["Address", patient.address],
          ["Birth date", formatDate(patient.date_of_birth)],
          ["Civil status", toReadable(patient.civil_status)],
          ["Occupation", patient.occupation],
          ["Nationality", patient.nationality],
          ["Religion", patient.religion],
        ]}
      />
    </Panel>
  );
}

/* ---------- Shared building blocks ---------- */
// A flat staff panel (DESIGN.md: 1px border, 8px corners, 20px padding, no
// shadow). Headings carry no icon: the words are enough, and an icon on every
// heading is decoration. isContainer lets children size to the panel (@xl).
function Panel({ title, subtitle, isContainer = false, children }) {
  return (
    <section className={`${panelClass} p-5 ${isContainer ? "@container" : ""}`}>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// rows: [[label, value], ...] shown as label-above-value pairs. On wider
// screens they flow into 2-3 columns so short answers don't leave most of
// the panel empty. An empty value shows a dash so a blank answer is visibly
// blank rather than a missing line.
function DetailGrid({ rows, singleColumn = false }) {
  // Two columns even on phones: most answers are a word or two ("Normal",
  // "Class I"), and one column made the exam a very long scroll.
  const columns = singleColumn ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3";
  return (
    <dl className={`grid ${columns} gap-x-6 gap-y-4`}>
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-sm text-gray-600">{label}</dt>
          <dd className="mt-0.5 whitespace-pre-line text-gray-900 [overflow-wrap:anywhere]">
            {value === null || value === undefined || value === "" ? "—" : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
