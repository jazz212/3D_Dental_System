"use client";
import { Trash2 } from "lucide-react";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import { dangerButtonClass, secondaryButtonClass } from "./staffStyles";

// Same layout as DeleteTreatmentPopup (which is for appointments), worded
// for a treatment record. dateLabel is the record's date as shown in the table.
export default function DeleteTreatmentRecordPopup({ record, dateLabel, deleting, error, onClose, onDelete }) {
  return (
    <Dialog title={`Delete ${record.procedure}`} onClose={onClose}>
      <div className={dialogBodyClass}>
        <p className="text-gray-600">
          Are you sure you want to delete the{" "}
          <span className="font-semibold text-gray-900">{record.procedure}</span>{" "}
          entry dated{" "}
          <span className="font-semibold text-gray-900">{dateLabel}</span>?
          This action cannot be undone.
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
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className={`${dangerButtonClass} flex items-center gap-2`}
        >
          <Trash2 aria-hidden="true" className="w-4 h-4" />
          {deleting ? "Deleting..." : "Delete entry"}
        </button>
      </div>
    </Dialog>
  );
}
