import { supabase } from "@/lib/supabase";
import { describeError } from "@/lib/errorLogging";

// Postgres error code raised by the table's check constraints.
const CHECK_ERROR_CODE = "23514";
// Thrown by updateTreatmentRecord when the record no longer exists (e.g.
// another staff member deleted it while the edit form was open).
const RECORD_MISSING_CODE = "treatment-record-missing";

export function isRecordMissingError(error) {
  return error?.code === RECORD_MISSING_CODE;
}

// Permanent teeth in FDI numbering, the same set the 3D chart shows:
// quadrant 1-4 (tens digit) x position 1-8 (ones digit).
export function isValidToothNumber(number) {
  const quadrant = Math.floor(number / 10);
  const position = number % 10;
  return Number.isInteger(number) && quadrant >= 1 && quadrant <= 4 && position >= 1 && position <= 8;
}

// "11, 12" -> { teeth: [11, 12], invalid: [] }. Empty text -> teeth: null
// (no specific tooth). Spaces, commas or semicolons separate the numbers;
// repeats are dropped and the rest sorted.
export function parseToothNumbers(text) {
  const parts = (text || "").split(/[\s,;]+/).filter(Boolean);
  if (parts.length === 0) return { teeth: null, invalid: [] };

  const invalid = parts.filter((part) => !/^\d{2}$/.test(part) || !isValidToothNumber(Number(part)));
  const teeth = [...new Set(parts.filter((part) => !invalid.includes(part)).map(Number))].sort(
    (first, second) => first - second,
  );
  return { teeth, invalid };
}

export function formatToothNumbers(teeth) {
  return teeth && teeth.length > 0 ? teeth.join(", ") : "";
}

// Money is typed as text; null when it isn't a number of pesos >= 0 with at
// most 2 decimals.
export function parsePesoAmount(text) {
  const trimmed = (text ?? "").toString().trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  return Number(trimmed);
}

// Whole centavos, so sums don't drift (0.1 + 0.2 != 0.3 in floats).
// numeric columns can arrive as strings, so Number() first.
export function toCentavos(value) {
  return Math.round(Number(value || 0) * 100);
}

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// 1234.5 -> "₱1,234.50"
export function formatPeso(value) {
  return pesoFormatter.format(Number(value || 0));
}

export function translateTreatmentError(error) {
  if (isRecordMissingError(error)) {
    return "This record was deleted, so your changes weren't saved. The list has been refreshed.";
  }
  if (error?.code === CHECK_ERROR_CODE) {
    return "Some values weren't accepted. Check the tooth numbers, that amounts aren't negative, and that the amount paid isn't more than the total.";
  }
  return "Treatment record wasn't saved. Check your connection and try again.";
}

// balance is computed by the database, so it's never sent.
function buildTreatmentRow(formData) {
  const dentist = formData.dentist.trim();
  return {
    procedure_date: formData.date,
    procedure: formData.procedure.trim(),
    tooth_numbers: parseToothNumbers(formData.toothNumbers).teeth,
    dentist: dentist === "" ? null : dentist,
    total_amount: parsePesoAmount(formData.totalAmount),
    amount_paid: parsePesoAmount(formData.amountPaid),
  };
}

// One patient's treatment records, latest first.
export async function fetchTreatmentRecords(patientId) {
  const { data, error } = await supabase
    .from("treatment_records")
    .select("*")
    .eq("patient_id", patientId)
    .order("procedure_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      `Could not load treatment records for patient ${patientId}. Check you're signed in and the table exists:`,
      describeError(error),
    );
    throw error;
  }
  return data;
}

export async function createTreatmentRecord(patientId, formData) {
  const { error } = await supabase
    .from("treatment_records")
    .insert({ patient_id: patientId, ...buildTreatmentRow(formData) });

  if (error) {
    console.error(`Could not save a treatment record for patient ${patientId}:`, describeError(error));
    throw error;
  }
}

export async function updateTreatmentRecord(recordId, formData) {
  // select("id") returns the updated rows: an update that matches nothing
  // isn't an error to Postgres, so an empty result is how a deleted record shows.
  const { data, error } = await supabase
    .from("treatment_records")
    .update(buildTreatmentRow(formData))
    .eq("id", recordId)
    .select("id");

  if (error) {
    console.error(`Could not update treatment record ${recordId}:`, describeError(error));
    throw error;
  }
  if (data.length === 0) {
    console.error(`Could not update treatment record ${recordId}: it no longer exists.`);
    const missing = new Error("Treatment record no longer exists");
    missing.code = RECORD_MISSING_CODE;
    throw missing;
  }
}

export async function deleteTreatmentRecord(recordId) {
  const { error } = await supabase
    .from("treatment_records")
    .delete()
    .eq("id", recordId);

  if (error) {
    console.error(
      `Could not delete treatment record ${recordId}. Check you're signed in:`,
      describeError(error),
    );
    throw error;
  }
}
