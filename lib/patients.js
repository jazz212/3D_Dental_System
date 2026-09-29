import { supabase } from "@/lib/supabase";

// Form inputs hand back strings; the database wants real nulls, booleans
// and numbers so its check constraints and queries work.
function emptyToNull(text) {
  const trimmed = (text || "").trim();
  return trimmed === "" ? null : trimmed;
}

function yesNoToBoolean(answer) {
  if (answer === "yes") return true;
  if (answer === "no") return false;
  return null;
}

function toNumberOrNull(text) {
  const trimmed = (text || "").trim();
  return trimmed === "" ? null : Number(trimmed);
}

// Age from the birth date, so it stays right after birthdays. Falls back
// to the age typed at intake when no birth date was given.
export function getCurrentAge(patient) {
  if (!patient.date_of_birth) return patient.age;
  const today = new Date();
  // "T00:00" reads the date as local time; a bare date is parsed as UTC.
  const birthDate = new Date(`${patient.date_of_birth}T00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayNotYetThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (birthdayNotYetThisYear) age -= 1;
  return age;
}

function buildPatientRow(patientId, profile) {
  // Lowercase so "Ana@Mail.com" and "ana@mail.com" count as the same patient
  const email = emptyToNull(profile.email);
  return {
    id: patientId,
    full_name: profile.fullName.trim(),
    email: email ? email.toLowerCase() : null,
    date_of_birth: profile.birthDate || null,
    age: toNumberOrNull(profile.age),
    sex: profile.sex || null,
    contact_number: emptyToNull(profile.contactNumber),
    address: emptyToNull(profile.address),
    occupation: emptyToNull(profile.occupation),
    civil_status: profile.civilStatus || null,
    nationality: emptyToNull(profile.nationality),
    religion: emptyToNull(profile.religion),
  };
}

function buildHistoryRow(patientId, history) {
  return {
    patient_id: patientId,
    chief_complaint: emptyToNull(history.chiefComplaint),
    present_illness: emptyToNull(history.presentIllness),
    conditions: history.conditions,
    takes_medication: yesNoToBoolean(history.takesMedication),
    medication_details: emptyToNull(history.medicationDetails),
    gums_bleed: yesNoToBoolean(history.gumsBleed),
    smokes: yesNoToBoolean(history.smokes),
    sticks_per_day: toNumberOrNull(history.sticksPerDay),
    has_allergies: yesNoToBoolean(history.hasAllergies),
    allergy_details: emptyToNull(history.allergyDetails),
    had_prophylaxis: yesNoToBoolean(history.hadProphylaxis),
    prophylaxis_when: emptyToNull(history.prophylaxisWhen),
    had_extraction: yesNoToBoolean(history.hadExtraction),
    extraction_when: emptyToNull(history.extractionWhen),
    denture_type: history.dentureType || null,
  };
}

function buildExaminationRow(patientId, exam) {
  return {
    patient_id: patientId,
    blood_pressure: emptyToNull(exam.bloodPressure),
    respiratory_rate: toNumberOrNull(exam.respiratoryRate),
    pulse_rate: toNumberOrNull(exam.pulseRate),
    temperature: toNumberOrNull(exam.temperature),
    head_normal: exam.headNormal,
    head_notes: emptyToNull(exam.headNotes),
    eyes_normal: exam.eyesNormal,
    eyes_notes: emptyToNull(exam.eyesNotes),
    tmj_normal: exam.tmjNormal,
    tmj_notes: emptyToNull(exam.tmjNotes),
    lips_normal: exam.lipsNormal,
    lips_notes: emptyToNull(exam.lipsNotes),
    palate_normal: exam.palateNormal,
    palate_notes: emptyToNull(exam.palateNotes),
    tongue_normal: exam.tongueNormal,
    tongue_notes: emptyToNull(exam.tongueNotes),
    mouth_floor_normal: exam.mouthFloorNormal,
    mouth_floor_notes: emptyToNull(exam.mouthFloorNotes),
    molar_relationship: emptyToNull(exam.molarRelationship),
    canine_relationship: emptyToNull(exam.canineRelationship),
    occlusion_classification: emptyToNull(exam.occlusionClassification),
    gingiva: exam.gingiva || null,
    gingiva_color: exam.gingivaColor || null,
    gingiva_consistency: exam.gingivaConsistency || null,
    oral_hygiene: exam.oralHygiene || null,
    hygiene_severity: exam.hygieneSeverity || null,
    soft_deposits: exam.softDeposits || null,
    hard_deposits: exam.hardDeposits || null,
  };
}

export const AGE_GROUPS = [
  { value: "child", label: "Child (0-12)", minAge: 0, maxAge: 12 },
  { value: "teen", label: "Teen (13-17)", minAge: 13, maxAge: 17 },
  { value: "adult", label: "Adult (18-59)", minAge: 18, maxAge: 59 },
  { value: "senior", label: "Senior (60+)", minAge: 60, maxAge: 120 },
];

// % and _ are wildcards in ilike; escape them so a typed "%" is literal.
export function escapeLikePattern(text) {
  return text.replace(/[\\%_]/g, (character) => `\\${character}`);
}

// Top-bar search. Names never contain digits and Patient IDs ("0003-2026")
// are mostly digits, so a term with a digit searches the ID instead.
export async function searchPatients(term, limit) {
  const column = /\d/.test(term) ? "patient_id" : "full_name";
  const { data, error } = await supabase
    .from("patients")
    .select("id, patient_id, full_name, archived_at")
    .ilike(column, `%${escapeLikePattern(term)}%`)
    .order("full_name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(`Could not search patients for "${term}". Check you're signed in:`, error);
    throw error;
  }
  return data;
}

// For the booking forms' patient picker: active patients whose name or
// contact number contains what was typed. Separate from searchPatients
// (top bar), which searches by Patient ID and includes archived patients.
// Commas and brackets are removed because they have special meaning
// inside Supabase's or() filter.
export async function searchPatientsForBooking(searchText, limit) {
  const cleaned = escapeLikePattern(searchText.trim().replace(/[,()]/g, " "));
  if (cleaned === "") return [];

  const { data, error } = await supabase
    .from("patients")
    .select("id, full_name, contact_number, date_of_birth, age")
    .is("archived_at", null)
    .or(`full_name.ilike.%${cleaned}%,contact_number.ilike.%${cleaned}%`)
    .order("full_name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error(`Could not search patients for "${searchText}":`, error);
    throw error;
  }
  return data;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// One patient's full record for the detail page: profile, their most recent
// medical history (intake can be repeated) and every examination, newest first.
// Returns null when no patient has this id.
export async function fetchPatientRecord(patientId) {
  // A mistyped link isn't a valid uuid; the database would reject it with an
  // error, but to staff it simply means "no such patient".
  if (!UUID_PATTERN.test(patientId)) return null;

  const [patientResult, historyResult, examsResult] = await Promise.all([
    supabase.from("patients").select("*").eq("id", patientId).maybeSingle(),
    supabase
      .from("patient_medical_history")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("intraoral_examinations")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false }),
  ]);

  const error = patientResult.error || historyResult.error || examsResult.error;
  if (error) {
    console.error(
      `Could not load the record for patient ${patientId}. Check you're signed in:`,
      error,
    );
    throw error;
  }
  if (!patientResult.data) return null;

  return {
    patient: patientResult.data,
    medicalHistory: historyResult.data[0] || null,
    examinations: examsResult.data,
  };
}

// filters: { status: "all" | "active" | "archived", nameSearch, sex, ageGroup }
// Filtering runs in the database so it covers every page, not just this one.
export async function fetchPatientsPage(pageNumber, pageSize, filters) {
  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("patients")
    .select("id, patient_id, full_name, age, sex, contact_number, created_at, archived_at", {
      count: "exact",
    });

  if (filters.status === "active") {
    query = query.is("archived_at", null);
  }
  if (filters.status === "archived") {
    query = query.not("archived_at", "is", null);
  }

  const nameSearch = filters.nameSearch.trim();
  if (nameSearch) {
    query = query.ilike("full_name", `%${escapeLikePattern(nameSearch)}%`);
  }

  if (filters.sex) {
    query = query.eq("sex", filters.sex);
  }

  const ageGroup = AGE_GROUPS.find((group) => group.value === filters.ageGroup);
  if (ageGroup) {
    query = query.gte("age", ageGroup.minAge).lte("age", ageGroup.maxAge);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error(
      `Could not load patients page ${pageNumber}. Check you're signed in:`,
      error,
    );
    throw error;
  }
  return { patients: data, total: count || 0 };
}

// Archive sets the date; restore clears it back to null (active).
// The date comes from the staff's computer; fine for an "archived on" note.
export async function setPatientArchived(patientId, shouldArchive) {
  const { error } = await supabase
    .from("patients")
    .update({ archived_at: shouldArchive ? new Date().toISOString() : null })
    .eq("id", patientId);

  if (error) {
    console.error(
      `Could not ${shouldArchive ? "archive" : "restore"} patient ${patientId}. Check you're signed in:`,
      error,
    );
    throw error;
  }
}

// Saves the patient and their intake history together. The uuid is created
// up front (in the page); the staff-facing patient_id ("0001-2026") is
// assigned by the database on insert, so it's returned here.
export async function createPatientWithHistory(patientId, profile, history) {
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert(buildPatientRow(patientId, profile))
    .select("id, patient_id")
    .single();

  if (patientError) {
    console.error(
      "Could not create patient. Check that the email isn't already used and that you are signed in:",
      patientError,
    );
    throw patientError;
  }

  const { error: historyError } = await supabase
    .from("patient_medical_history")
    .insert(buildHistoryRow(patient.id, history));

  if (historyError) {
    console.error(
      "Could not save medical history; removing the half-saved patient so the form can be resubmitted:",
      historyError,
    );
    // Without this, a retry would create a second copy of the same patient.
    const { error: cleanupError } = await supabase
      .from("patients")
      .delete()
      .eq("id", patient.id);
    if (cleanupError) {
      console.error(
        `Cleanup failed. Delete patient ${patient.id} manually in Supabase:`,
        cleanupError,
      );
    }
    throw historyError;
  }

  return patient;
}

export async function createExamination(patientId, exam) {
  const { error } = await supabase
    .from("intraoral_examinations")
    .insert(buildExaminationRow(patientId, exam));

  if (error) {
    console.error(
      `Could not save examination for patient ${patientId}. Check the vital sign values are numbers:`,
      error,
    );
    throw error;
  }
}
