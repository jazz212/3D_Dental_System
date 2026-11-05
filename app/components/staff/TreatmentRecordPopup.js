"use client";
import { useState } from "react";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import {
  fieldClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./staffStyles";
import {
  createTreatmentRecord,
  formatPeso,
  formatToothNumbers,
  isRecordMissingError,
  parsePesoAmount,
  parseToothNumbers,
  toCentavos,
  translateTreatmentError,
  updateTreatmentRecord,
} from "@/lib/treatmentRecords";
import { getLocalDateString } from "@/lib/appointmentTimes";

const NO_ERRORS = {
  date: false,
  procedure: false,
  toothNumbers: false,
  totalAmount: false,
  amountPaid: false,
};

// Adds a treatment record, or edits one when `record` is given.
export default function TreatmentRecordPopup({ patientId, record, onClose, onSaved }) {
  const isEditing = Boolean(record);
  const [formData, setFormData] = useState({
    date: record?.procedure_date || getLocalDateString(new Date()),
    procedure: record?.procedure || "",
    toothNumbers: formatToothNumbers(record?.tooth_numbers),
    dentist: record?.dentist || "",
    // numeric columns can come back as strings; show them with 2 decimals.
    totalAmount: record ? Number(record.total_amount).toFixed(2) : "",
    amountPaid: record ? Number(record.amount_paid).toFixed(2) : "",
  });
  const [fieldErrors, setFieldErrors] = useState(NO_ERRORS);
  const [toothError, setToothError] = useState(null);
  const [amountError, setAmountError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Shown live, never typed: what's left once this payment is counted.
  const total = parsePesoAmount(formData.totalAmount);
  const paid = parsePesoAmount(formData.amountPaid);
  const balancePreview =
    total === null || paid === null ? null : (toCentavos(total) - toCentavos(paid)) / 100;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: false }));
    if (name === "toothNumbers") setToothError(null);
    if (name === "totalAmount" || name === "amountPaid") setAmountError(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { invalid } = parseToothNumbers(formData.toothNumbers);
    // The database refuses this too; checked here to point at the field.
    const overpaid = balancePreview !== null && balancePreview < 0;
    const nextErrors = {
      date: !formData.date,
      procedure: !formData.procedure.trim(),
      toothNumbers: invalid.length > 0,
      totalAmount: total === null,
      amountPaid: paid === null || overpaid,
    };
    setAmountError(
      total === null || paid === null
        ? "Enter amounts in pesos, 0 or more, with up to 2 decimals."
        : overpaid
          ? "Amount paid can't be more than the total amount."
          : null,
    );
    setFieldErrors(nextErrors);
    setToothError(
      invalid.length > 0
        ? `${invalid.join(", ")} ${invalid.length === 1 ? "isn't a" : "aren't"} valid FDI tooth ${invalid.length === 1 ? "number" : "numbers"}. Use 11–18, 21–28, 31–38 or 41–48.`
        : null,
    );
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateTreatmentRecord(record.id, formData);
      } else {
        await createTreatmentRecord(patientId, formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      // Refresh the list behind the form so the deleted record disappears.
      if (isRecordMissingError(err)) onSaved();
      setError(translateTreatmentError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog title={isEditing ? "Edit treatment record" : "New treatment record"} onClose={onClose} wide>
      <form onSubmit={handleSubmit} noValidate>
        <div className={dialogBodyClass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="treatment-date" className={labelClass}>
                Date
              </label>
              <input
                id="treatment-date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={fieldClass(fieldErrors.date)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="treatment-teeth" className={labelClass}>
                Tooth # (optional)
              </label>
              <input
                id="treatment-teeth"
                name="toothNumbers"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 11, 12"
                value={formData.toothNumbers}
                onChange={handleChange}
                aria-invalid={fieldErrors.toothNumbers}
                aria-describedby="treatment-teeth-help"
                className={fieldClass(fieldErrors.toothNumbers)}
              />
              <p
                id="treatment-teeth-help"
                className={`text-sm ${toothError ? "text-red-600" : "text-gray-600"}`}
              >
                {toothError || "FDI numbers, as on the 3D chart. Leave blank for e.g. cleaning."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="treatment-procedure" className={labelClass}>
              Procedure done
            </label>
            <input
              id="treatment-procedure"
              name="procedure"
              type="text"
              placeholder="e.g. Tooth filling"
              value={formData.procedure}
              onChange={handleChange}
              aria-invalid={fieldErrors.procedure}
              className={fieldClass(fieldErrors.procedure)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="treatment-dentist" className={labelClass}>
              Dentist
            </label>
            <input
              id="treatment-dentist"
              name="dentist"
              type="text"
              placeholder="e.g. Dr. Santos"
              value={formData.dentist}
              onChange={handleChange}
              className={fieldClass(false)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="treatment-total" className={labelClass}>
                Total amount (₱)
              </label>
              <input
                id="treatment-total"
                name="totalAmount"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={handleChange}
                aria-invalid={fieldErrors.totalAmount}
                className={`${fieldClass(fieldErrors.totalAmount)} tabular-nums`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="treatment-paid" className={labelClass}>
                Amount paid (₱)
              </label>
              <input
                id="treatment-paid"
                name="amountPaid"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.amountPaid}
                onChange={handleChange}
                aria-invalid={fieldErrors.amountPaid}
                className={`${fieldClass(fieldErrors.amountPaid)} tabular-nums`}
              />
            </div>
          </div>
          {amountError && <p className="text-sm text-red-600">{amountError}</p>}

          <p className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
            <span className="text-gray-600">Balance</span>
            <span className="font-medium text-gray-900 tabular-nums">
              {balancePreview === null ? "—" : formatPeso(balancePreview)}
            </span>
          </p>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </p>
          )}
        </div>

        <div className={dialogFooterClass}>
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className={primaryButtonClass}>
            {submitting ? "Saving..." : isEditing ? "Save changes" : "Add record"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
