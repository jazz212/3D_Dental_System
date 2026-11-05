"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { fetchPatientRecord } from "@/lib/patients";
import {
  deleteTreatmentRecord,
  fetchTreatmentRecords,
  formatPeso,
  formatToothNumbers,
  toCentavos,
} from "@/lib/treatmentRecords";
import TreatmentRecordPopup from "./TreatmentRecordPopup";
import DeleteTreatmentRecordPopup from "./DeleteTreatmentRecordPopup";
import {
  panelClass,
  primaryButtonClass,
  rowActionButtonClass,
  tableCellClass,
  tableHeaderCellClass,
} from "./staffStyles";

// "2026-09-22" -> "Sep 22, 2026", like the patient record page.
function formatDate(dateString) {
  if (!dateString) return null;
  // A bare "YYYY-MM-DD" is parsed as UTC; "T00:00" keeps it on the right day.
  return new Date(`${dateString}T00:00`).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Opened from the Treatment Records button on a patient's record: every
// procedure done for them, what it cost and what's still owed.
export default function TreatmentRecords({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | not-found | error
  // Bumped by "Try again" and after every change to re-run the load.
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // `ignore` drops a response that arrives after the page was left.
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const record = await fetchPatientRecord(patientId);
        if (ignore) return;
        if (!record) {
          setLoadState("not-found");
          return;
        }
        const found = await fetchTreatmentRecords(patientId);
        if (ignore) return;
        setPatient(record.patient);
        setRecords(found);
        setLoadState("ready");
      } catch {
        if (!ignore) setLoadState("error");
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [patientId, loadAttempt]);

  const reload = () => setLoadAttempt((previous) => previous + 1);
  const retryLoad = () => {
    setLoadState("loading");
    reload();
  };

  const closeDelete = () => {
    setRecordToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTreatmentRecord(recordToDelete.id);
      closeDelete();
      reload();
    } catch {
      setDeleteError("The record wasn't deleted. Check your connection and try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white w-full p-4 pt-2 pb-8">
      <Link
        href={`/dashboard/patient-records/${patientId}`}
        className="inline-flex items-center gap-1 pointer-coarse:min-h-11 rounded text-sm text-gray-600 hover:text-[#00685F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Patient record
      </Link>

      {loadState === "loading" && (
        <p role="status" className="mt-6 text-gray-600">
          Loading treatment records...
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
            Treatment records couldn&apos;t be loaded. Check your internet
            connection, then try again.
          </p>
          <button type="button" onClick={retryLoad} className={primaryButtonClass}>
            Try again
          </button>
        </div>
      )}

      {loadState === "ready" && (
        <>
          <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 break-words sm:text-3xl">
                Treatment Records
              </h1>
              <p className="mt-1 text-sm text-gray-600 tabular-nums">
                {patient.full_name} · ID {patient.patient_id}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className={`${primaryButtonClass} flex shrink-0 items-center justify-center gap-2`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add record
            </button>
          </header>

          <section className={`${panelClass} mt-6 overflow-hidden`}>
            {records.length === 0 ? (
              <p className="p-5 text-sm text-gray-600">
                No treatment records yet. Add one after each procedure to keep
                track of what was done and what&apos;s still owed.
              </p>
            ) : (
              <TreatmentTable
                records={records}
                onEdit={setRecordToEdit}
                onDelete={setRecordToDelete}
              />
            )}
          </section>
        </>
      )}

      {isAdding && (
        <TreatmentRecordPopup
          patientId={patientId}
          onClose={() => setIsAdding(false)}
          onSaved={reload}
        />
      )}
      {recordToEdit && (
        <TreatmentRecordPopup
          patientId={patientId}
          record={recordToEdit}
          onClose={() => setRecordToEdit(null)}
          onSaved={reload}
        />
      )}
      {recordToDelete && (
        <DeleteTreatmentRecordPopup
          record={recordToDelete}
          dateLabel={formatDate(recordToDelete.procedure_date)}
          deleting={deleting}
          error={deleteError}
          onClose={closeDelete}
          onDelete={confirmDelete}
        />
      )}
    </div>
  );
}

const moneyCellClass = `${tableCellClass} text-right tabular-nums whitespace-nowrap`;
const moneyHeaderClass = `${tableHeaderCellClass} text-right!`;

function TreatmentTable({ records, onEdit, onDelete }) {
  // Summed in centavos so the totals don't pick up float rounding errors.
  const totalCentavos = records.reduce((sum, record) => sum + toCentavos(record.total_amount), 0);
  const paidCentavos = records.reduce((sum, record) => sum + toCentavos(record.amount_paid), 0);
  const balanceCentavos = totalCentavos - paidCentavos;

  return (
    // Scrolls sideways inside the panel on narrow screens (DESIGN.md: Tables).
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr>
            <th scope="col" className={tableHeaderCellClass}>Date</th>
            <th scope="col" className={tableHeaderCellClass}>Procedure Done</th>
            <th scope="col" className={tableHeaderCellClass}>Tooth #</th>
            <th scope="col" className={tableHeaderCellClass}>Dentist</th>
            <th scope="col" className={moneyHeaderClass}>Total Amount</th>
            <th scope="col" className={moneyHeaderClass}>Amount Paid</th>
            <th scope="col" className={moneyHeaderClass}>Balance</th>
            <th scope="col" className={tableHeaderCellClass}>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((record) => {
            const description = `${record.procedure} on ${formatDate(record.procedure_date)}`;
            return (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className={`${tableCellClass} whitespace-nowrap tabular-nums`}>
                  {formatDate(record.procedure_date)}
                </td>
                <td className={`${tableCellClass} font-medium text-gray-900 break-words`}>
                  {record.procedure}
                </td>
                <td className={`${tableCellClass} tabular-nums`}>
                  {formatToothNumbers(record.tooth_numbers) || "—"}
                </td>
                <td className={tableCellClass}>{record.dentist || "—"}</td>
                <td className={moneyCellClass}>{formatPeso(record.total_amount)}</td>
                <td className={moneyCellClass}>{formatPeso(record.amount_paid)}</td>
                <td className={`${moneyCellClass} font-medium text-gray-900`}>
                  {formatPeso(record.balance)}
                </td>
                <td className={`${tableCellClass} whitespace-nowrap text-right`}>
                  <button
                    type="button"
                    onClick={() => onEdit(record)}
                    aria-label={`Edit ${description}`}
                    className={rowActionButtonClass}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(record)}
                    aria-label={`Delete ${description}`}
                    className={`${rowActionButtonClass} hover:text-red-600! hover:bg-red-50!`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50 font-medium text-gray-900">
            <th scope="row" colSpan={4} className={`${tableCellClass} text-left`}>
              Total ({records.length} {records.length === 1 ? "record" : "records"})
            </th>
            <td className={moneyCellClass}>{formatPeso(totalCentavos / 100)}</td>
            <td className={moneyCellClass}>{formatPeso(paidCentavos / 100)}</td>
            <td className={moneyCellClass}>
              <span className="sr-only">Outstanding balance: </span>
              {formatPeso(balanceCentavos / 100)}
            </td>
            <td className={tableCellClass} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
