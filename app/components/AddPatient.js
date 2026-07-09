export default function AddPatient() {
  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold">Add New Patient</h1>
          <p className="text-gray-500">
            Complete the patient profiling form below to register a new clinical
            record.
          </p>
        </div>
        <div className="border w-full border-gray-300 overflow-hidden mt-2 rounded-lg">
          <div className="bg-[#E6EEFF] flex items-center justify-between border  border-gray-300 p-2 rounded-t-lg">
            <h1 className="text-[#00685F] text-2xl font-bold">
              Patient's Information Form
            </h1>
            <span className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-500">
              Rec: #New
            </span>
          </div>
          <div className="p-2 mx-2">
            <div className="font-bold">Basic Information</div>
            <hr className="border border-gray-200"></hr>
            <div className="grid grid-cols-4 mt-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Last, First, M.I."
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Birth Date</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Age</label>
                <input
                  type="text"
                  placeholder="0"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Sex</label>
                <select className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Tel/CP No.</label>
                <input
                  type="text"
                  placeholder="09XX-XXX-XXXX"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-74"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm">Complete Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, Zip"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 mt-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Last, First, M.I."
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Birth Date</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Age</label>
                <input
                  type="text"
                  placeholder="0"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm">Sex</label>
                <select className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
