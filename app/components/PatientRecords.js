"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import {
  fetchPatientsPage,
  setPatientArchived,
  AGE_GROUPS,
  formatPatientId,
} from "@/lib/patients";

const STATUS_TABS = [
  { value: "all", label: "All Patients" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

// Where the sliding pill sits for each tab, by tab position (0, 1, 2).
const TAB_PILL_POSITIONS = ["translate-x-0", "translate-x-full", "translate-x-[200%]"];

const EMPTY_FILTERS = {
  status: "all",
  nameSearch: "",
  sex: "",
  ageGroup: "",
};

function formatRegisteredDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  // What's in the search box right now; filters.nameSearch updates after a pause.
  const [searchInput, setSearchInput] = useState("");
  const searchTimerRef = useRef(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Bumping this number re-runs the fetch effect (after archive/restore).
  const [refreshKey, setRefreshKey] = useState(0);
  const [archivingId, setArchivingId] = useState(null);
  const patientsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalPatients / patientsPerPage));

  const activeTabIndex = STATUS_TABS.findIndex(
    (tab) => tab.value === filters.status,
  );
  const panelFilterCount = (filters.sex ? 1 : 0) + (filters.ageGroup ? 1 : 0);
  const hasAnyFilter =
    filters.status !== "all" ||
    filters.nameSearch.trim() !== "" ||
    panelFilterCount > 0;

  const goToPage = (pageNumber) => {
    setLoading(true);
    setCurrentPage(pageNumber);
  };

  // A new filter can shrink the list, so always jump back to page 1.
  const updateFilter = (name, value) => {
    setLoading(true);
    setCurrentPage(1);
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  // Wait until typing pauses for 300ms so "Maria" is one query, not five.
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      updateFilter("nameSearch", value);
    }, 300);
  };

  const clearPanelFilters = () => {
    setLoading(true);
    setCurrentPage(1);
    setFilters((previous) => ({ ...previous, sex: "", ageGroup: "" }));
  };

  const handleArchiveToggle = async (patient) => {
    const shouldArchive = patient.archived_at === null;
    setArchivingId(patient.id);
    try {
      await setPatientArchived(patient.id, shouldArchive);
      setRefreshKey((previous) => previous + 1);
    } catch {
      setError(
        `${patient.full_name} wasn't ${shouldArchive ? "archived" : "restored"}. Check your connection and try again.`,
      );
    } finally {
      setArchivingId(null);
    }
  };

  // `ignore` drops a response that arrives after the user already changed
  // page or filters, so an old result can't overwrite a newer one.
  useEffect(() => {
    let ignore = false;

    const loadPatients = async () => {
      try {
        const result = await fetchPatientsPage(
          currentPage,
          patientsPerPage,
          filters,
        );
        if (ignore) return;
        setPatients(result.patients);
        setTotalPatients(result.total);
        setError(null);
      } catch {
        if (!ignore) {
          setError("Couldn't load patients. Refresh the page to try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadPatients();
    return () => {
      ignore = true;
    };
  }, [currentPage, filters, refreshKey]);

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
            className="bg-[#00685F] px-4 py-2 text-white rounded-lg transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95"
          >
            <div className="flex items-center gap-2 w-full cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Patient
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 mt-2 rounded-lg">
        <div className="flex p-2 w-full justify-between items-center gap-4">
          <div className="relative grid grid-cols-3 bg-gray-100 rounded-full p-1">
            {/* One white pill slides under the active tab instead of each
                tab snapping its own background on and off. */}
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-smooth motion-reduce:transition-none ${TAB_PILL_POSITIONS[activeTabIndex]}`}
            />
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => updateFilter("status", tab.value)}
                aria-pressed={filters.status === tab.value}
                className={`relative px-4 py-2 rounded-full whitespace-nowrap cursor-pointer transition-all duration-150 ease-smooth active:scale-[0.97] ${
                  filters.status === tab.value
                    ? "text-[#00685F] font-medium"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search by name"
                aria-label="Search patients by name"
                className="bg-[#F0FDFA] border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-56 outline-none focus:border-[#00685F]"
              />
            </div>
            <button
              onClick={() => setShowFilterPanel((previous) => !previous)}
              aria-expanded={showFilterPanel}
              className={`flex items-center gap-2 bg-white border rounded-lg px-3 py-2 cursor-pointer transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95 ${
                panelFilterCount > 0
                  ? "border-[#00685F] text-[#00685F]"
                  : "border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {panelFilterCount > 0 ? `Filter (${panelFilterCount})` : "Filter"}
            </button>
            <button className="bg-white border w-22 border-gray-300 rounded-lg p-2 transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95">
              Export
            </button>
          </div>
        </div>

        {/* height:auto can't animate, but a grid row going 0fr -> 1fr can,
            so the panel glides open AND closed. `inert` keeps the hidden
            dropdowns out of the Tab order while it's closed. */}
        <div
          inert={!showFilterPanel}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-smooth motion-reduce:transition-none ${
            showFilterPanel
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-end gap-4 border-t border-gray-200 p-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="filter-sex" className="text-sm font-medium">
                  Sex
                </label>
                <select
                  id="filter-sex"
                  value={filters.sex}
                  onChange={(e) => updateFilter("sex", e.target.value)}
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-40 outline-none focus:border-[#00685F]"
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="filter-age" className="text-sm font-medium">
                  Age group
                </label>
                <select
                  id="filter-age"
                  value={filters.ageGroup}
                  onChange={(e) => updateFilter("ageGroup", e.target.value)}
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-44 outline-none focus:border-[#00685F]"
                >
                  <option value="">Any</option>
                  {AGE_GROUPS.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
              {panelFilterCount > 0 && (
                <button
                  onClick={clearPanelFilters}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-all duration-300 ease-smooth active:scale-[0.97] starting:opacity-0 motion-reduce:transition-none"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded transition duration-300 ease-smooth starting:opacity-0 starting:-translate-y-1 motion-reduce:transition-none">
          {error}
        </p>
      )}

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
                Registered
              </th>
              <th className="text-left p-3 bg-gray-100 border-b border-gray-300">
                Action
              </th>
            </tr>
          </thead>
          {/* While a new filter/page loads, keep the current rows and dim them
              instead of swapping to "Loading..." (that swap is the flicker). */}
          <tbody
            aria-busy={loading}
            className={`transition-opacity duration-300 ease-smooth motion-reduce:transition-none ${
              loading && patients.length > 0 ? "opacity-50" : "opacity-100"
            }`}
          >
            {loading && patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  Loading patients...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  {hasAnyFilter
                    ? "No patients match these filters."
                    : "No patients yet. Add one with Add New Patient."}
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const isArchived = patient.archived_at !== null;
                return (
                  // New rows fade in after a filter/page change; archiving
                  // fades the row's text to grey instead of snapping.
                  <tr
                    key={patient.id}
                    className={`transition duration-300 ease-smooth starting:opacity-0 motion-reduce:transition-none ${
                      isArchived ? "text-gray-400" : ""
                    }`}
                  >
                    <td className="p-3 border-b border-gray-200 tabular-nums">
                      {formatPatientId(patient.id)}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {patient.full_name}
                      {isArchived && (
                        <span className="ml-2 text-xs text-gray-500">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {patient.age === null ? "—" : patient.age}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {patient.contact_number || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {formatRegisteredDate(patient.created_at)}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <button
                        onClick={() => handleArchiveToggle(patient)}
                        disabled={archivingId === patient.id}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#00685F] cursor-pointer disabled:opacity-50 transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95"
                      >
                        {isArchived ? (
                          <ArchiveRestore className="w-4 h-4" />
                        ) : (
                          <Archive className="w-4 h-4" />
                        )}
                        {isArchived ? "Restore" : "Archive"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    {totalPatients === 0
                      ? 0
                      : (currentPage - 1) * patientsPerPage + 1}
                    -{Math.min(currentPage * patientsPerPage, totalPatients)} of{" "}
                    {totalPatients} patients
                  </p>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded items-center transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95 disabled:opacity-50"
                    >
                      {"<"}
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-1 border border-gray-300 rounded items-center transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95 ${
                            currentPage === pageNumber
                              ? "bg-[#00685F] text-white"
                              : ""
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 border border-gray-300 rounded items-center transition-all duration-150 ease-smooth active:scale-[0.97] active:brightness-95 disabled:opacity-50"
                    >
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
