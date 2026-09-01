import Link from "next/link";
import { Pencil, Eye, Delete, Plus } from "lucide-react";
export default function PatientRecords() {
  const pages = [1, 2, 3];
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
          <Link
            href="/dashboard/addpatient"
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg transition-all duration-100 active:scale-95 active:brightness-90"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Patient
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 flex p-2 w-full justify-between items-center rounded-lg mt-2">
        <div className="flex bg-gray-100 rounded-full p-1">
          <button className="px-4 py-2 rounded-full bg-white text-[#00685F] font-medium">
            All Patients
          </button>
          <button className="px-4 py-2 rounded-full text-gray-500">
            Active
          </button>
          <button className="px-4 py-2 rounded-full text-gray-500">
            Archived
          </button>
        </div>
        <div>
          <div className="flex gap-4 ">
            <button className="bg-white border w-22 border-gray-300 rounded-lg p-2">
              Filter
            </button>
            <button className="bg-white border w-22 border-gray-300 rounded-lg p-2">
              Export
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
        <table className="w-full border-collapse rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Patient ID
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Patient Name
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Age
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Contact
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Last Visit
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Status
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b border-gray-200">ID1</td>
              <td className="p-3 border-b border-gray-200">Juan Dela Cruz</td>
              <td className="p-3 border-b border-gray-200">11</td>
              <td className="p-3 border-b border-gray-200">09111111111</td>
              <td className="p-3 border-b border-gray-200">January 2, 2026</td>
              <td className="p-3 border-b border-gray-200">Pending</td>
              <td className="p-3 border-b border-gray-200">actions</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">ID2</td>
              <td className="p-3 border-b border-gray-200">Maria Santos</td>
              <td className="p-3 border-b border-gray-200">14</td>
              <td className="p-3 border-b border-gray-200">09222222222</td>
              <td className="p-3 border-b border-gray-200">January 2, 2026</td>
              <td className="p-3 border-b border-gray-200">Confirmed</td>
              <td className="p-3 border-b border-gray-200">actions</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">ID3</td>
              <td className="p-3 border-b border-gray-200">Pedro Reyes</td>
              <td className="p-3 border-b border-gray-200">18</td>
              <td className="p-3 border-b border-gray-200">09333333333</td>
              <td className="p-3 border-b border-gray-200">January 2, 2026</td>
              <td className="p-3 border-b border-gray-200">Cancelled</td>
              <td className="p-3 border-b border-gray-200">actions</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-gray-200">ID4</td>
              <td className="p-3 border-b border-gray-200">Ana Garcia</td>
              <td className="p-3 border-b border-gray-200">22</td>
              <td className="p-3 border-b border-gray-200">09444444444</td>
              <td className="p-3 border-b border-gray-200">January 2, 2026</td>
              <td className="p-3 border-b border-gray-200">Pending</td>
              <td className="p-3 border-b border-gray-200">actions</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing 1-4 of 4 patients
                  </p>

                  <div className="flex gap-2 items-center">
                    <button className="px-3 py-1 border border-gray-300 rounded items-center">
                      {"<"}
                    </button>

                    {pages.map((page) => (
                      <button
                        key={page}
                        className="px-3 py-1 border border-gray-300 rounded items-center"
                      >
                        {page}
                      </button>
                    ))}

                    <button className="px-3 py-1 border border-gray-300 rounded items-center">
                      {">"}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
