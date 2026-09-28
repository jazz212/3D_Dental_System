import PatientRecords from "@/app/components/staff/PatientRecords";
export default async function PatientRecordsPage({ searchParams }) {
  // ?search= comes from the top-bar search. The key remounts the list when
  // it changes, so picking another patient while already here still works.
  const { search } = await searchParams;
  const initialSearch = typeof search === "string" ? search : "";
  return <PatientRecords key={initialSearch} initialSearch={initialSearch} />;
}
