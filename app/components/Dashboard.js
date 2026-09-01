"use client";

import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import Link from "next/link";
import AppointmentDetails from "./AppointmentDetailsPopup.js";
import EditAppointment from "./EditAppointmentPopup";
import DeleteAppointment from "./DeleteAppointmentPopup";

export default function Dashboard() {
  // ── Modal state ───────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveModal("view");
  };
  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveModal("edit");
  };
  const handleDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveModal("delete");
  };
  const handleClose = () => {
    setActiveModal(null);
    setSelectedAppointment(null);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Sample data for the "Upcoming Visits" sidebar – keep as‑is for now
  const visits = [
    { time: "2:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "3:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "4:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
    { time: "5:30 PM", patient: "Juan Dela Cruz", Appointment: "Cleaning" },
  ];

  // ── Appointments data ───────────────────────────────────────────────
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [errorAppts, setErrorAppts] = useState(null);

  useEffect(() => {
    async function fetchAppts() {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, patient_id, preferred_date, preferred_time_window, reason, status, patients!inner(full_name,patient_id)');
      if (error) {
        console.error('Error fetching appointments:', error);
        setErrorAppts(error.message);
      } else {
        setAppointments(data);
      }
      setLoadingAppts(false);
    }
    fetchAppts();
  }, []);

  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Overview</h1>
          <p className="text-gray-500">Today is {today}</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/dashboard/addpatient"
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg transition-all duration-100 active:scale-95 active:brightness-90"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Patient
            </div>
          </Link>
          <Link
            href="/dashboard/addappointment"
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Appointment
            </div>
          </Link>
        </div>
      </div>

      {/* Main panels */}
      <div className="flex gap-4 mt-4">
        {/* Left side – calendar & visits */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-8">
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              TODAY'S EXPECTED VISITS
            </div>
            <div className="flex-1 bg-white border border-gray-500 border-l-4 border-l-[#00685F] rounded-lg p-14">
              PENDING APPOINTMENTS
            </div>
          </div>
          <CalendarView />
        </div>
        {/* Right side – upcoming visits */}
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 self-stretch">
          <h2 className="font-bold text-lg mb-4">Upcoming Visits</h2>
          <div className="flex flex-col gap-4">
            {visits.map((visit) => (
              <div key={visit.time} className="flex gap-2 items-stretch">
                <div className="flex flex-col items-center">
                  <p className="text-sm">{visit.time}</p>
                  <div className="w-3 h-3 rounded-full bg-[#00685F] mt-1 shrink-0"></div>
                  <div className="w-px bg-gray-300 grow"></div>
                </div>
                <div className="bg-gray-200 rounded-lg border border-gray-500 p-4 mb-4">
                  <p>{visit.patient}</p>
                  <p>{visit.Appointment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Appointments table */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="font-bold text-lg">All Appointments</h2>
        <select className="border border-gray-300 rounded-lg px-3 py-2 bg-[#00685F] text-white">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Patient Name</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Patient ID</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Date</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Time</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Service</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Status</th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingAppts ? (
              <tr>
                <td colSpan={7} className="p-3 text-center">Loading appointments…</td>
              </tr>
            ) : errorAppts ? (
              <tr>
                <td colSpan={7} className="p-3 text-red-600">Error: {errorAppts}</td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="p-3 border-b border-gray-200">{appt.patients?.full_name || ''}</td>
                  <td className="p-3 border-b border-gray-200">{appt.patients?.patient_id || ''}</td>
                  <td className="p-3 border-b border-gray-200">{appt.preferred_date ? new Date(appt.preferred_date).toLocaleDateString() : ''}</td>
                  <td className="p-3 border-b border-gray-200">{appt.preferred_time_window}</td>
                  <td className="p-3 border-b border-gray-200">{appt.reason}</td>
                  <td className="p-3 border-b border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appt.status === 'pending' ? 'bg-orange-700 text-white' :
                      appt.status === 'confirmed' ? 'bg-green-700 text-white' :
                      'bg-red-500 text-white'
                    }`}>{appt.status}</span>
                  </td>
                  <td className="p-3 border-b border-gray-200 flex gap-2">
                    <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" onClick={() => handleEdit(appt)} />
                    <Eye className="w-4 h-4 text-gray-500 cursor-pointer hover:text-[#00685F]" onClick={() => handleView(appt)} />
                    <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" onClick={() => handleDelete(appt)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Showing {appointments.length} appointments</p>
                  {/* Pagination placeholder – keep simple */}
                  <div className="flex gap-2 items-center">
                    <button className="px-3 py-1 border border-gray-300 rounded items-center">{'<'}</button>
                    <button className="px-3 py-1 border border-gray-300 rounded items-center">{'>'}</button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal overlays */}
      {activeModal && <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />}

      {activeModal === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AppointmentDetails onClose={handleClose} />
        </div>
      )}
      {activeModal === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <EditAppointment onClose={handleClose} onSave={handleClose} />
        </div>
      )}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DeleteAppointment onClose={handleClose} onDelete={handleClose} />
        </div>
      )}
    </div>
  );
}
