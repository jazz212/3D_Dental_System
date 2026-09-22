"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, CircleHelp, Menu } from "lucide-react";
import { searchPatients } from "@/lib/patients";
import { searchAppointments } from "@/lib/appointments";
import { formatTime } from "@/lib/appointmentTimes";
import AppointmentDetailsPopup from "./AppointmentDetailsPopup";

// Per group, so the dropdown stays short.
const RESULTS_PER_GROUP = 5;

export default function Navbar({ onOpenMenu }) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  // Which term the results belong to, so results for an older term are
  // never shown next to a newer one.
  const [results, setResults] = useState({ term: "", patients: [], appointments: [] });
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const containerRef = useRef(null);

  const trimmed = term.trim();
  const canSearch = trimmed.length >= 2;
  const loading = canSearch && results.term !== trimmed && !error;

  // Wait until typing pauses for 300ms so "Maria" is one search, not five.
  useEffect(() => {
    if (!canSearch) return;
    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        const [patients, appointments] = await Promise.all([
          searchPatients(trimmed, RESULTS_PER_GROUP),
          searchAppointments(trimmed, RESULTS_PER_GROUP),
        ]);
        if (!ignore) setResults({ term: trimmed, patients, appointments });
      } catch {
        // Already logged in lib.
        if (!ignore) setError("Search failed. Check your connection and try again.");
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [trimmed, canSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTermChange = (e) => {
    setTerm(e.target.value);
    setError(null);
    setOpen(true);
  };

  const closeSearch = () => {
    setOpen(false);
    setTerm("");
  };

  // Patient Records reads ?search= and fills its own search box with it.
  const openPatient = (patient) => {
    closeSearch();
    router.push(`/dashboard/patient-records?search=${encodeURIComponent(patient.full_name)}`);
  };

  const openAppointment = (appointment) => {
    closeSearch();
    setAppointmentToView(appointment);
  };

  const showResults = results.term === trimmed;
  const nothingFound =
    showResults && results.patients.length === 0 && results.appointments.length === 0;

  return (
    <div className="bg-white h-16 w-full flex items-center text-black gap-2 px-4 justify-between border-b border-gray-100 shadow-sm">
      {/* Phone only: the sidebar is hidden, this opens it as a drawer */}
      <button
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="md:hidden w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* flex-1 + max-w-80: fills small screens, stops at 320px on large ones */}
      <div ref={containerRef} className="relative flex-1 min-w-0 max-w-80">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={term}
          onChange={handleTermChange}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          aria-label="Search patients and appointments"
          className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-[#00685F]/10 focus:border-[#00685F]"
          placeholder="Search patient name or appointments"
        />

        {open && trimmed !== "" && (
          <div className="absolute left-0 right-0 sm:right-auto sm:w-96 mt-2 z-40 max-h-[70dvh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {!canSearch ? (
              <p className="p-3 text-sm text-gray-500">Type at least 2 characters.</p>
            ) : error ? (
              <p className="p-3 text-sm text-red-600">{error}</p>
            ) : loading ? (
              <p className="p-3 text-sm text-gray-500">Searching...</p>
            ) : nothingFound ? (
              <p className="p-3 text-sm text-gray-500">
                No patients or appointments match &ldquo;{trimmed}&rdquo;.
              </p>
            ) : (
              <>
                {results.patients.length > 0 && (
                  <ResultGroup title="Patients">
                    {results.patients.map((patient) => (
                      <li key={patient.id}>
                        <button
                          onClick={() => openPatient(patient)}
                          className="w-full text-left px-3 py-2 hover:bg-[#F0FDFA] cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {patient.full_name}
                            {patient.archived_at && (
                              <span className="ml-2 text-xs font-normal text-gray-500">Archived</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 tabular-nums">{patient.patient_id}</p>
                        </button>
                      </li>
                    ))}
                  </ResultGroup>
                )}
                {results.appointments.length > 0 && (
                  <ResultGroup title="Appointments">
                    {results.appointments.map((appointment) => (
                      <li key={appointment.id}>
                        <button
                          onClick={() => openAppointment(appointment)}
                          className="w-full text-left px-3 py-2 hover:bg-[#F0FDFA] cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.patient_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {appointment.appointment_date} · {formatTime(appointment.start_time)} -{" "}
                            {formatTime(appointment.end_time)} · {appointment.service}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ResultGroup>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center shrink-0">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-gray-500 hover:bg-[#F0FDFA] hover:text-[#00685F] transition-colors">
          <CircleHelp className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>

      {appointmentToView && (
        <AppointmentDetailsPopup
          onClose={() => setAppointmentToView(null)}
          appointment={appointmentToView}
        />
      )}
    </div>
  );
}

function ResultGroup({ title, children }) {
  return (
    <div className="py-1 border-b border-gray-100 last:border-b-0">
      <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-gray-400">
        {title.toUpperCase()}
      </p>
      <ul>{children}</ul>
    </div>
  );
}
