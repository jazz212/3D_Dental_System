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
import { formatTime, getLocalDateString } from "@/lib/appointmentTimes";
import AddAppointmentPopup from "./AddAppointmentPopup";
import DeleteTreatmentPopup from "./DeleteTreatmentPopup";
import AppointmentDetailsPopup from "./AppointmentDetailsPopup";
import EditAppointmentPopup from "./EditAppointmentPopup";
import UpcomingVisits from "./UpcomingVisits";

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
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const upcomingVisitsLimit = 30;
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
        const result = await fetchAppointmentsPage(currentPage, appointmentsPerPage);
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
  }, [currentPage, refreshKey]);

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

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Overview</h1>
          <p className="text-gray-500">Today is {today}</p>
        </div>

        <div className="flex gap-4">
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

      <div className="flex gap-4 mt-4">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-8">
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              TODAY&apos;S EXPECTED VISITS
            </div>
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              PENDING APPOINTMENTS
            </div>
          </div>

          <CalendarView />
        </div>

        <UpcomingVisits
          visits={upcomingVisits}
          loading={upcomingLoading}
          onSelectVisit={handleViewAppointment}
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <h2 className="font-bold text-lg">All Appointments</h2>

        <select className="border border-gray-300 rounded-lg px-3 py-2 bg-[#00685F] text-white">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
        <table className="w-full border-collapse rounded-lg">
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
                  No appointments yet.
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
                  <td className="p-3 border-b border-gray-200">Requested</td>
                  <td className="p-3 border-b border-gray-200 flex gap-2">
                    <Pencil
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]"
                      onClick={() => handleEditAppointment(appt)}
                    />
                    <Eye
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]"
                      onClick={() => handleViewAppointment(appt)}
                    />
                    <Trash2
                      className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500"
                      onClick={() => handleDeleteAppointment(appt)}
                    />
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
