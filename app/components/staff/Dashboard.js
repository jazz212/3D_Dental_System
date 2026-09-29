"use client";
import {
  Pencil,
  Eye,
  Trash2,
  Plus,
  ChevronDown,
  UserX,
  CalendarX,
  CircleCheck,
  Ellipsis,
} from "lucide-react";
import CalendarView from "./CalendarView";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  fetchAppointmentsPage,
  fetchUpcomingVisits,
  deleteAppointment,
  changeAppointmentStatus,
  STATUS_ACTION_FROM,
  STATUS_ALREADY_CHANGED_CODE,
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

const TIMEFRAME_TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

// Rough height of the row actions menu, to decide whether it fits below
// its button or has to open upwards.
const ACTION_MENU_HEIGHT = 190;

// The menu's width (w-52) plus a small margin. The menu opens to the left of
// its button; on a phone card the button is near the left edge, so the menu
// is pushed right far enough to stay on screen.
const ACTION_MENU_MIN_LEFT = 208 + 8;

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
  const totalPages = Math.max(1, Math.ceil(totalAppointments / appointmentsPerPage));
  // "all" or one of the STATUS_LABELS keys.
  const [statusFilter, setStatusFilter] = useState("all");
  // One of the TIMEFRAME_TABS values.
  const [timeframe, setTimeframe] = useState("upcoming");
  // { appointment, top, left, openUp } while a row's ⋯ menu is open.
  const [actionMenu, setActionMenu] = useState(null);
  const actionMenuRef = useRef(null);
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
  // Separate from error: the table reload clears that one, which would hide
  // an "already changed" message straight away.
  const [statusActionError, setStatusActionError] = useState(null);
  const [statusChangingId, setStatusChangingId] = useState(null);
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

  const handleTimeframeChange = (value) => {
    setLoading(true);
    setTimeframe(value);
    setCurrentPage(1);
  };

  // The table scrolls sideways, which would clip a menu inside it, so the
  // menu is placed on screen next to its button instead.
  const toggleActionMenu = (e, appointment) => {
    if (actionMenu?.appointment.id === appointment.id) {
      setActionMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const openUp = rect.bottom + ACTION_MENU_HEIGHT > window.innerHeight;
    setActionMenu({
      appointment,
      left: Math.max(rect.right, ACTION_MENU_MIN_LEFT),
      top: openUp ? rect.top : rect.bottom,
      openUp,
    });
  };

  // Close the menu on a click elsewhere, Escape, scrolling or resizing
  // (the last two would leave it floating away from its row).
  useEffect(() => {
    if (!actionMenu) return;
    const close = () => setActionMenu(null);
    const handleMouseDown = (e) => {
      if (actionMenuRef.current?.contains(e.target)) return;
      // Its own ⋯ button toggles it in the click handler instead.
      if (e.target.closest("[data-row-menu-button]")) return;
      close();
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [actionMenu]);

  // Closes the menu and runs the chosen action.
  const runMenuAction = (action) => {
    setActionMenu(null);
    action();
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
    if (!confirm(`Decline this request from ${request.requester_full_name}?`)) return;

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

  const handleChangeStatus = async (appointment, newStatus) => {
    if (
      newStatus === "cancelled" &&
      !confirm(`Cancel ${appointment.patient_name}'s appointment on ${appointment.appointment_date}?`)
    ) {
      return;
    }

    setStatusChangingId(appointment.id);
    setStatusActionError(null);
    try {
      await changeAppointmentStatus(appointment.id, newStatus);
      refreshAppointments();
    } catch (err) {
      if (err?.code === STATUS_ALREADY_CHANGED_CODE) {
        setStatusActionError(
          "Someone already changed this appointment's status. The list has been refreshed.",
        );
        refreshAppointments();
      } else {
        setStatusActionError("Status wasn't changed. Check your connection and try again.");
      }
    } finally {
      setStatusChangingId(null);
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
          timeframe,
          todayString,
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
  }, [currentPage, statusFilter, timeframe, todayString, refreshKey]);

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

  // Date and status look the same on the phone card and in the table row.
  const renderAppointmentDate = (appt) =>
    appt.appointment_date === todayString ? (
      <span className="font-semibold text-[#00685F]">Today</span>
    ) : (
      formatTableDate(appt.appointment_date, todayString)
    );

  const renderStatusPill = (appt) => (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${
        STATUS_PILL_STYLES[appt.status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUS_LABELS[appt.status] || appt.status}
    </span>
  );

  // View, Edit and More actions for one appointment: the same buttons in
  // the table row and on the phone card. Buttons (not bare icons) give a
  // finger-sized tap area and keyboard access.
  const renderRowActions = (appt) => (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => handleViewAppointment(appt)}
        aria-label={`View ${appt.patient_name}'s appointment`}
        title="View"
        className={rowActionButtonClass}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => handleEditAppointment(appt)}
        aria-label={`Edit ${appt.patient_name}'s appointment`}
        title="Edit"
        className={rowActionButtonClass}
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        data-row-menu-button
        onClick={(e) => toggleActionMenu(e, appt)}
        disabled={statusChangingId === appt.id}
        aria-label={`More actions for ${appt.patient_name}'s appointment`}
        aria-haspopup="menu"
        aria-expanded={actionMenu?.appointment.id === appt.id}
        title="More actions"
        className={`${rowActionButtonClass} aria-expanded:text-[#00685F] aria-expanded:bg-[#F0FDFA]`}
      >
        <Ellipsis className="w-4 h-4" />
      </button>
    </div>
  );

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

      {/* The code order is the phone order: the numbers, who is coming, the
          requests to act on, then the calendar. From lg a grid puts the
          calendar under the numbers and Upcoming Visits in a right column. */}
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-x-4 lg:gap-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-start-1 lg:row-start-1">
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

        <div className="flex lg:col-start-2 lg:row-start-1 lg:row-span-3">
          <UpcomingVisits
            visits={upcomingVisits}
            loading={upcomingLoading}
            onSelectVisit={handleViewAppointment}
          />
        </div>

        <div className="min-w-0 lg:col-start-1 lg:row-start-3">
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

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <CalendarView />
        </div>
      </div>

      <section className={`${panelClass} mt-6`}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h2 className="font-bold text-lg">All Appointments</h2>

          <div className="flex flex-wrap gap-2">
            {/* Same look as the Patient Records tabs: gray track, white pill */}
            <div
              role="group"
              aria-label="Show appointments by date"
              className="flex bg-gray-100 rounded-full p-1"
            >
              {TIMEFRAME_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleTimeframeChange(tab.value)}
                  aria-pressed={timeframe === tab.value}
                  className={`px-4 py-1.5 pointer-coarse:min-h-11 text-sm rounded-full cursor-pointer transition-all duration-150 ${
                    timeframe === tab.value
                      ? "bg-white shadow-sm font-medium text-[#00685F]"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* appearance-none hides the browser arrow; the chevron replaces it
                and pointer-events-none lets clicks reach the select underneath. */}
            <div className="relative bg-gray-100 rounded-full p-1">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                aria-label="Filter appointments by status"
                className="appearance-none bg-white shadow-sm rounded-full pl-4 pr-9 py-1.5 pointer-coarse:min-h-11 text-base sm:text-sm font-medium text-[#00685F] cursor-pointer outline-none transition-shadow duration-150 hover:shadow focus-visible:ring-2 focus-visible:ring-[#00685F]/30"
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
        </div>

        {error && (
          <p className="mx-4 mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}
        {statusActionError && (
          <p className="mx-4 mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">
            {statusActionError}
          </p>
        )}

        {/* Phones: one card per appointment, so status and actions are on
            screen without scrolling sideways. From sm the table is used. */}
        <ul className="divide-y divide-gray-200 border-t border-gray-200 sm:hidden">
          {loading ? (
            <li className="px-4 py-3 text-center text-gray-500">Loading appointments...</li>
          ) : appointments.length === 0 ? (
            <li className="px-4 py-3 text-center text-gray-500">
              {emptyTableMessage(timeframe, statusFilter)}
            </li>
          ) : (
            appointments.map((appt) => (
              <li key={appt.id} className="flex flex-col gap-2 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-medium break-words">{appt.patient_name}</p>
                  <div className="shrink-0">{renderStatusPill(appt)}</div>
                </div>
                <p className="text-sm text-gray-600 tabular-nums">
                  {renderAppointmentDate(appt)}
                  {" · "}
                  {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                </p>
                {/* Full service list: phones have no hover tooltip to reveal it */}
                <p className="text-sm break-words">{appt.service}</p>
                <div className="-ml-1.5">{renderRowActions(appt)}</div>
              </li>
            ))
          )}
        </ul>

        {/* Wider screens: the table, scrolling sideways in the panel if needed */}
        <div className="hidden overflow-x-auto sm:block">
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
                    {emptyTableMessage(timeframe, statusFilter)}
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className={`${tableCellClass} font-medium`}>
                      {appt.patient_name}
                    </td>
                    <td className={`${tableCellClass} tabular-nums whitespace-nowrap`}>
                      {renderAppointmentDate(appt)}
                    </td>
                    <td className={`${tableCellClass} tabular-nums whitespace-nowrap`}>
                      {formatTime(appt.start_time)} – {formatTime(appt.end_time)}
                    </td>
                    <td className={`${tableCellClass} max-w-[16rem]`}>
                      {/* Several services can make this long; hover shows all */}
                      <span className="block truncate" title={appt.service}>
                        {appt.service}
                      </span>
                    </td>
                    <td className={tableCellClass}>{renderStatusPill(appt)}</td>
                    <td className={tableCellClass}>{renderRowActions(appt)}</td>
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

      {actionMenu && (
        <div
          ref={actionMenuRef}
          role="menu"
          aria-label={`Actions for ${actionMenu.appointment.patient_name}'s appointment`}
          style={{
            top: actionMenu.top,
            left: actionMenu.left,
            transform: `translate(-100%, ${actionMenu.openUp ? "calc(-100% - 4px)" : "4px"})`,
          }}
          className="fixed z-50 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {/* Status changes only where the database allows them. Completed and
              No Show are outcomes, so only from the appointment's day onwards. */}
          {STATUS_ACTION_FROM.completed.includes(actionMenu.appointment.status) &&
            actionMenu.appointment.appointment_date <= todayString && (
              <MenuItem
                icon={<CircleCheck className="w-4 h-4" />}
                label="Mark Completed"
                onClick={() => runMenuAction(() => handleChangeStatus(actionMenu.appointment, "completed"))}
              />
            )}
          {STATUS_ACTION_FROM.no_show.includes(actionMenu.appointment.status) &&
            actionMenu.appointment.appointment_date <= todayString && (
              <MenuItem
                icon={<UserX className="w-4 h-4" />}
                label="Mark No Show"
                onClick={() => runMenuAction(() => handleChangeStatus(actionMenu.appointment, "no_show"))}
              />
            )}
          {STATUS_ACTION_FROM.cancelled.includes(actionMenu.appointment.status) && (
            <MenuItem
              icon={<CalendarX className="w-4 h-4" />}
              label="Cancel appointment"
              onClick={() => runMenuAction(() => handleChangeStatus(actionMenu.appointment, "cancelled"))}
            />
          )}
          <div className="my-1 border-t border-gray-100" />
          <MenuItem
            icon={<Trash2 className="w-4 h-4" />}
            label="Delete"
            danger
            onClick={() => runMenuAction(() => handleDeleteAppointment(actionMenu.appointment))}
          />
        </div>
      )}

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

function emptyTableMessage(timeframe, statusFilter) {
  if (timeframe === "all" && statusFilter === "all") return "No appointments yet.";
  const when = timeframe === "all" ? "" : `${timeframe} `;
  const status = statusFilter === "all" ? "" : `${STATUS_LABELS[statusFilter].toLowerCase()} `;
  return `No ${when}${status}appointments.`;
}

// "2026-09-22" -> "Tue, Sep 22"; the year is added only when it isn't this
// year. "T00:00" reads the date as local time; a bare date is parsed as UTC.
function formatTableDate(dateString, todayString) {
  const sameYear = dateString.slice(0, 4) === todayString.slice(0, 4);
  return new Date(`${dateString}T00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
}

function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm cursor-pointer ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-[#F0FDFA] hover:text-[#00685F]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
