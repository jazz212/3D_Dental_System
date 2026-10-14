import DentalChart3D from "@/app/components/staff/DentalChart3D";

// Matches /dashboard/patient-records/<id>/3d-chart, opened from the
// 3D Chart button on a patient's record. Next.js hands the id over as a
// promise, so it's awaited here.
export default async function DentalChart3DPage({ params }) {
  const { id } = await params;
  return <DentalChart3D patientId={id} />;
}
