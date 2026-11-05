import TreatmentRecords from "@/app/components/staff/TreatmentRecords";

// Matches /dashboard/patient-records/<id>/treatment-records, opened from the
// Treatment Records button on a patient's record. Next.js hands the id over
// as a promise, so it's awaited here.
export default async function TreatmentRecordsPage({ params }) {
  const { id } = await params;
  return <TreatmentRecords patientId={id} />;
}
