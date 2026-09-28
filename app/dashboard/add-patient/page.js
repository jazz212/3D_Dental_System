import { connection } from "next/server";
import AddPatient from "@/app/components/staff/AddPatient";

export default async function AddPatientPage() {
  // Render on every visit; otherwise the page is built once and every
  // new patient would be handed the same id.
  await connection();
  // Created here (server) rather than in the form so the id shown in the
  // browser matches the one rendered on the server.
  const newPatientId = crypto.randomUUID();
  return <AddPatient patientId={newPatientId} />;
}
