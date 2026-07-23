import MedicalRecords from "@/app/components/MedicalRecords";

const samplePatient = {
  name: "Cathy B. Lathco",
  patientId: "TP-8842-A",
  status: "Active Patient",
  avatarInitials: "CB",
  dob: "14 May 1967",
  age: 31,
  bloodType: "O Positive",
  allergies: "Penicillin, Latex (Mild)",
  lastVisit: "06-7-2026",
  nextAppt: "Today, 10:30",
  primaryDoctor: "Dr. A. Chen",
};

const sampleImages = [
  { id: 1, label: "PANORAMIC", title: "Full Jaw Assessment", meta: "IMG_8842_PAN_01.DCM • 14:32" },
  { id: 2, label: "PERIAPICAL", title: "Tooth 36 Detail", meta: "IMG_8842_BW_02.DCM" },
];

const sampleTreatments = [
  { date: "01/21/26", service: "Dental Cleaning", notes: "Routine Prophylaxis" },
  { date: "01/15/26", service: "Tooth Filling", notes: "Full Mouth Series" },
  { date: "01/12/26", service: "Consultation", notes: "Upper Left Molar" },
];

export default function MedicalRecordsPage() {
  return (
    <MedicalRecords
      patient={samplePatient}
      images={sampleImages}
      treatments={sampleTreatments}
    />
  );
}