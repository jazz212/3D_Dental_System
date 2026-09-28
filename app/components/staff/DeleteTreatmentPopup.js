"use client";
import { Trash2 } from "lucide-react";
import Dialog, { dialogBodyClass, dialogFooterClass } from "./Dialog";
import { dangerButtonClass, secondaryButtonClass } from "./staffStyles";

export default function DeleteTreatment({ onClose, onDelete, appointment }) {
  return (
    <Dialog title={`Delete ${appointment.service || "appointment"}`} onClose={onClose}>
      <div className={dialogBodyClass}>
        <p className="text-gray-600">
          Are you sure you want to delete the{" "}
          <span className="font-semibold text-gray-900">{appointment.service || "entry"}</span>{" "}
          entry dated{" "}
          <span className="font-semibold text-gray-900">{appointment.appointment_date}</span>?
          This action cannot be undone.
        </p>
      </div>

      <div className={dialogFooterClass}>
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={`${dangerButtonClass} flex items-center gap-2`}
        >
          <Trash2 aria-hidden="true" className="w-4 h-4" />
          Delete entry
        </button>
      </div>
    </Dialog>
  );
}
