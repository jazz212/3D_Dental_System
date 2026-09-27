import MedicalRecords from "@/app/components/staff/MedicalRecords";

// [id] in the folder name makes this page match /dashboard/patient-records/<any id>.
// Next.js hands the id over as a promise, so it's awaited here.
export default async function MedicalRecordsPage({ params }) {
  const { id } = await params;
  return <MedicalRecords patientId={id} />;
}
