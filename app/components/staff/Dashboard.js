"use client";
import {
  Pencil,
  Eye,
  Trash2,
  Plus,
  ChevronDown,
} from "lucide-react";
import CalendarView from "./CalendarView";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  fetchAppointmentsPage,
  fetchUpcomingVisits,
  deleteAppointment,
} from "@/lib/appointments";
import {
  ALREADY_HANDLED_CODE,
  declineAppointmentRequest,
  fetchPendingRequests,
  translateRequestError,
} from "@/lib/appointmentRequests";
import { formatTime, getLocalDateString } from "@/lib/appointmentTimes";
import AddAppointmentPopup from "./AddAppointmentPopup";
import PendingRequests from "./PendingRequests";
import ScheduleRequestPopup from "./ScheduleRequestPopup";
import DeleteTreatmentPopup from "./DeleteTreatmentPopup";
import AppointmentDetailsPopup from "./AppointmentDetailsPopup";
import EditAppointmentPopup from "./EditAppointmentPopup";
import UpcomingVisits from "./UpcomingVisits";
import Pagination from "./Pagination";
import {
  panelClass,
  primaryButtonClass,
  rowActionButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderCellClass,
} from "./staffStyles";

// appointment_details.status values -> what staff read in the table.
const STATUS_LABELS = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

// Tinted pill per status. The word is always shown, so colour is never
// the only cue.
const STATUS_PILL_STYLES = {
  requested: "bg-amber-50 text-amber-800",
  confirmed: "bg-[#F0FDFA] text-[#004D45]",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-50 text-red-700",
  no_show: "bg-orange-50 text-orange-800",
};

const APPOINTMENT_COLUMNS = ["Patient Name", "Date", "Time", "Service", "Status", "Actions"];

// "2026-09-22" -> "Sep 22, 2026". "T00:00" reads it as local time; a bare
// date string is parsed as UTC and can show the day before.
function formatAppointmentDate(dateString) {
  return new Date(`${dateString}T00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [appointmentToView, setAppointmentToView] = useState(null);
  const [appointmentToEdit, setAppointmentToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const appointmentsPerPage = 10;
  // "all" or one of the STATUS_LABELS keys.
  const [statusFilter, setStatusFilter] = useState("all");
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const upcomingVisitsLimit = 30;
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingError, setPendingError] = useState(null);
  const [requestToSchedule, setRequestToSchedule] = useState(null);
  // Separate from pendingError: a failed decline shouldn't hide the list.
  const [declineError, setDeclineError] = useState(null);
  const [decliningId, setDecliningId] = useState(null);
  // Cancelled and no-show bookings still show in upcomingVisits, but those
  // patients aren't coming.
  const todayString = getLocalDateString(new Date());
  const todaysExpectedVisits = upcomingVisits.filter(
    (visit) =>
      visit.appointment_date === todayString &&
      visit.status !== "cancelled" &&
      visit.status !== "no_show",
  ).length;
  // Bumping this number re-runs both fetch effects below.
  const [refreshKey, setRefreshKey] = useState(0);

  // Adding, editing or deleting changes both lists.
  const refreshAppointments = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const goToPage = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  // A new filter can have fewer pages than the current one, so start at page 1.
  const handleStatusFilterChange = (e) => {
    setLoading(true);
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteOpen(true);
  };

  const handleViewAppointment = (appointment) => {
    setAppointmentToView(appointment);
    setDetailsOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setAppointmentToEdit(appointment);
    setEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      await deleteAppointment(appointmentToDelete.id);
      refreshAppointments();
    } catch {
      setError("Appointment wasn't deleted. Check your connection and try again.");
    } finally {
      setDeleteOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const handleDeclineRequest = async (request) => {
    if (!confirm(`Decline this request from ${request.patients.full_name}?`)) return;

    setDecliningId(request.id);
    setDeclineError(null);
    try {
      await declineAppointmentRequest(request.id);
      refreshAppointments();
    } catch (err) {
      if (err?.code === ALREADY_HANDLED_CODE) {
        setDeclineError(translateRequestError(err));
        refreshAppointments();
      } else {
        setDeclineError("Request wasn't declined. Check your connection and try again.");
      }
    } finally {
      setDecliningId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteOpen(false);
    setAppointmentToDelete(null);
  };

  // `ignore` drops a response that arrives after the user already moved to
  // another page, so a slow page 2 can't overwrite page 3.
  useEffect(() => {
    let ignore = false;

    const loadAppointments = async () => {
      try {
        const result = await fetchAppointmentsPage(
          currentPage,
          appointmentsPerPage,
          statusFilter === "all" ? null : statusFilter,
        );
        if (ignore) return;
        setAppointments(result.appointments);
        setTotalAppointments(result.total);
        setError(null);
      } catch {
        if (!ignore) {
          setError("Couldn't load appointments. Refresh the page to try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadAppointments();
    return () => {
      ignore = true;
    };
  }, [currentPage, statusFilter, refreshKey]);

  useEffect(() => {
    let ignore = false;

    const loadUpcomingVisits = async () => {
      try {
        const todayString = getLocalDateString(new Date());
        const visits = await fetchUpcomingVisits(todayString, upcomingVisitsLimit);
        if (!ignore) setUpcomingVisits(visits);
      } catch {
        // Already logged in lib; the panel shows its empty state.
      } finally {
        if (!ignore) setUpcomingLoading(false);
      }
    };

    loadUpcomingVisits();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    let ignore = false;

    const loadPendingRequests = async () => {
      try {
        const requests = await fetchPendingRequests();
        if (ignore) return;
        setPendingRequests(requests);
        setPendingError(null);
      } catch {
        if (!ignore) {
          setPendingError("Couldn't load pending requests. Refresh the page to try again.");
        }
      } finally {
        if (!ignore) setPendingLoading(false);
      }
    };

    loadPendingRequests();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Overview</h1>
          <p className="text-gray-500">Today is {today}</p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4">
          {/* Booking is the daily task, so it is the one primary button */}
          <Link
            href="/dashboard/add-patient"
            className={`${secondaryButtonClass} flex items-center gap-2`}
          >
            <Plus aria-hidden="true" className="w-4 h-4 text-[#00685F]" />
            Add New Patient
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`${primaryButtonClass} flex items-center gap-2`}
          >
            <Plus aria-hidden="true" className="w-4 h-4" />
            Add Appointment
          </button>
        </div>
      </div>

      {/* Calendar and Upcoming Visits sit side by side only on wide screens */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
              <p className="text-sm text-gray-500">Today&apos;s expected visits</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-[#00685F]">
                {upcomingLoading ? "–" : todaysExpectedVisits}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-5 py-4">
              <p className="text-sm text-gray-500">Pending appointments</p>
              {/* "–" until loaded, so a slow fetch doesn't read as "0 pending" */}
              <p className="mt-1 text-3xl font-bold tabular-nums text-[#00685F]">
                {pendingLoading || pendingError ? "–" : pendingRequests.length}
              </p>
            </div>
          </div>

          <CalendarView />

          <PendingRequests
            requests={pendingRequests}
            loading={pendingLoading}
            error={pendingError}
            actionError={declineError}
            decliningId={decliningId}
            onSchedule={setRequestToSchedule}
            onDecline={handleDeclineRequest}
          />
        </div>

        <UpcomingVisits
          visits={upcomingVisits}
          loading={upcomingLoading}
          onSelectVisit={handleViewAppointment}
        />
      </div>

      <section className={`${panelClass} mt-6`}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h2 className="font-bold text-lg">All Appointments</h2>

          {/* Same look as the Patient Records tabs: gray track, white pill.
              appearance-none hides the browser arrow; the chevron replaces it
              and pointer-events-none lets clicks reach the select underneath. */}
          <div className="relative bg-gray-100 rounded-full p-1">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              aria-label="Filter appointments by status"
              className="appearance-none bg-white shadow-sm rounded-full pl-4 pr-9 py-1.5 text-sm font-medium text-[#00685F] cursor-pointer outline-none transition-shadow duration-150 hover:shadow focus-visible:ring-2 focus-visible:ring-[#00685F]/30"
            >
              {/* No "requested": website requests live in Pending Requests until scheduled */}
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00685F]"
            />
          </div>
        </div>

        {error && (
          <p className="mx-4 mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}

        {/* Too many columns for a phone: the table scrolls sideways in the panel */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                {APPOINTMENT_COLUMNS.map((column) => (
                  <th key={column} className={tableHeaderCellClass}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className={`${tableCellClass} text-center text-gray-500`}>
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${tableCellClass} text-center text-gray-500`}>
                    {statusFilter === "all"
                      ? "No appointments yet."
                      : `No ${STATUS_LABELS[statusFilter].toLowerCase()} appointments.`}
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className={`${tableCellClass} font-medium`}>
                      {appt.patient_name}
                    </td>
                    <td className={`${tableCellClass} tabular-nums whitespace-nowrap`}>
                      {formatAppointmentDate(appt.appointment_date)}
                    </td>
                    <td className={`${tableCellClass} tabular-nums whitespace-nowrap`}>
                      {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                    </td>
                    <td className={tableCellClass}>{appt.service}</td>
                    <td className={tableCellClass}>
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${
                          STATUS_PILL_STYLES[appt.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[appt.status] || appt.status}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      {/* Buttons (not bare icons) give a finger-sized tap area
                          and keyboard access */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditAppointment(appt)}
                          aria-label={`Edit ${appt.patient_name}'s appointment`}
                          className={rowActionButtonClass}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewAppointment(appt)}
                          aria-label={`View ${appt.patient_name}'s appointment`}
                          className={rowActionButtonClass}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAppointment(appt)}
                          aria-label={`Delete ${appt.patient_name}'s appointment`}
                          className="p-1.5 rounded text-gray-500 cursor-pointer hover:text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-[#00685F]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={appointmentsPerPage}
          totalItems={totalAppointments}
          itemLabel="appointments"
          onPageChange={goToPage}
        />
      </section>

      {open && (
        <AddAppointmentPopup
          onClose={() => setOpen(false)}
          onAppointmentAdded={refreshAppointments}
        />
      )}
      {deleteOpen && (
        <DeleteTreatmentPopup
          onClose={handleCancelDelete}
          onDelete={handleConfirmDelete}
          appointment={appointmentToDelete}
        />
      )}
      {detailsOpen && (
        <AppointmentDetailsPopup
          onClose={() => setDetailsOpen(false)}
          appointment={appointmentToView}
        />
      )}
      {requestToSchedule && (
        <ScheduleRequestPopup
          request={requestToSchedule}
          onClose={() => setRequestToSchedule(null)}
          onRequestHandled={refreshAppointments}
        />
      )}
      {editOpen && (
        <EditAppointmentPopup
          onClose={() => setEditOpen(false)}
          onSave={refreshAppointments}
          appointment={appointmentToEdit}
        />
      )}
    </div>
  );
}
