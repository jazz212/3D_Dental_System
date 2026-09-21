"use client";
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
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

// appointment_details.status values -> what staff read in the table.
const STATUS_LABELS = {
  requested: "Requested",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

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
          <Link
            href="/dashboard/addpatient"
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg cursor-pointer transition-all duration-100 active:scale-95 active:brightness-90"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Patient
            </div>
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Appointment
            </div>
          </button>
        </div>
      </div>

      {/* Calendar and Upcoming Visits sit side by side only on wide screens */}
      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-6 sm:p-14">
              <p>TODAY&apos;S EXPECTED VISITS</p>
              <p className="mt-2 text-3xl font-bold text-[#00685F]">
                {upcomingLoading ? "–" : todaysExpectedVisits}
              </p>
            </div>
            <div className="bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-6 sm:p-14">
              <p>PENDING APPOINTMENTS</p>
              {/* "–" until loaded, so a slow fetch doesn't read as "0 pending" */}
              <p className="mt-2 text-3xl font-bold text-[#00685F]">
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

      <div className="flex flex-wrap gap-2 justify-between items-center mt-6">
        <h2 className="font-bold text-lg">All Appointments</h2>

        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          aria-label="Filter appointments by status"
          className="border border-gray-300 rounded-lg px-3 py-2 bg-[#00685F] text-white"
        >
          {/* No "requested": website requests live in Pending Requests until scheduled */}
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </p>
      )}

      {/* Too many columns for a phone: the table scrolls sideways in its box */}
      <div className="rounded-lg border border-gray-200 overflow-x-auto mt-4">
        <table className="w-full min-w-[720px] border-collapse rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Patient Name
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Date
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Time
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Service
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Status
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  Loading appointments...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  {statusFilter === "all"
                    ? "No appointments yet."
                    : `No ${STATUS_LABELS[statusFilter].toLowerCase()} appointments.`}
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="p-3 border-b border-gray-200">
                    {appt.patient_name}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {appt.appointment_date}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {formatTime(appt.start_time)} - {formatTime(appt.end_time)}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {appt.service}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {STATUS_LABELS[appt.status] || appt.status}
                  </td>
                  <td className="p-3 border-b border-gray-200">
                    {/* Buttons (not bare icons) give a finger-sized tap area
                        and keyboard access */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditAppointment(appt)}
                        aria-label={`Edit ${appt.patient_name}'s appointment`}
                        className="p-1.5 rounded text-gray-500 cursor-pointer hover:text-[#00685F] hover:bg-[#F0FDFA]"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewAppointment(appt)}
                        aria-label={`View ${appt.patient_name}'s appointment`}
                        className="p-1.5 rounded text-gray-500 cursor-pointer hover:text-[#00685F] hover:bg-[#F0FDFA]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appt)}
                        aria-label={`Delete ${appt.patient_name}'s appointment`}
                        className="p-1.5 rounded text-gray-500 cursor-pointer hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    {totalAppointments === 0
                      ? 0
                      : (currentPage - 1) * appointmentsPerPage + 1}{" "}
                    -{" "}
                    {Math.min(
                      currentPage * appointmentsPerPage,
                      totalAppointments,
                    )}{" "}
                    of {totalAppointments} patients
                  </p>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded items-center"
                    >
                      {"<"}
                    </button>

                    {/* Calculate total pages */}
                    {[
                      ...Array(
                        Math.max(
                          1,
                          Math.ceil(totalAppointments / appointmentsPerPage),
                        ),
                      ),
                    ].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-1 border border-gray-300 rounded items-center ${
                            currentPage === pageNumber
                              ? "bg-[#00685F] text-white"
                              : ""
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        goToPage(
                          Math.min(
                            Math.max(
                              1,
                              Math.ceil(
                                totalAppointments / appointmentsPerPage,
                              ),
                            ),
                            currentPage + 1,
                          ),
                        )
                      }
                      disabled={
                        currentPage >=
                        Math.max(
                          1,
                          Math.ceil(totalAppointments / appointmentsPerPage),
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded items-center"
                    >
                      {">"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

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
