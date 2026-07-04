export default function PatientRecords() {
  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Patient Record</h1>
          <p className="text-gray-500">
            Manage and review all registered clinic patients.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="bg-[#00685F] px-4 py-2 text-white rounded-lg">
            Add New Patient
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-500 p-4 rounded-lg"></div>
    </div>
  );
}
