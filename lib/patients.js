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

// patients.patient_id isn't filled in yet, so staff see a short form of the
// database id: "0db209eb-..." -> "0DB209EB".
export function formatPatientId(id) {
  return id.slice(0, 8).toUpperCase();
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
function escapeLikePattern(text) {
  return text.replace(/[\\%_]/g, (character) => `\\${character}`);
}

// filters: { status: "all" | "active" | "archived", nameSearch, sex, ageGroup }
// Filtering runs in the database so it covers every page, not just this one.
export async function fetchPatientsPage(pageNumber, pageSize, filters) {
  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("patients")
    .select("id, full_name, age, sex, contact_number, created_at, archived_at", {
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

// Saves the patient and their intake history together. The id is created
// up front (in the page) so the form can show it before saving.
export async function createPatientWithHistory(patientId, profile, history) {
  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert(buildPatientRow(patientId, profile))
    .select("id")
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

  return patient.id;
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
