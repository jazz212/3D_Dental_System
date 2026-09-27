"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/lib/patients";
import Pagination from "./Pagination";
import {
  fieldClass,
  labelClass,
  panelClass,
  primaryButtonClass,
  rowActionButtonClass,
  secondaryButtonClass,
  tableCellClass,
  tableHeaderCellClass,
} from "./staffStyles";

const STATUS_TABS = [
  { value: "all", label: "All Patients" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

// Where the sliding pill sits for each tab, by tab position (0, 1, 2).
const TAB_PILL_POSITIONS = ["translate-x-0", "translate-x-full", "translate-x-[200%]"];

const PATIENT_COLUMNS = ["Patient ID", "Patient Name", "Age", "Contact", "Registered", "Action"];

const EMPTY_FILTERS = {
  status: "all",
  nameSearch: "",
  sex: "",
  ageGroup: "",
};

function formatRegisteredDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PatientRecords({ initialSearch = "" }) {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, nameSearch: initialSearch });
  // What's in the search box right now; filters.nameSearch updates after a pause.
  const [searchInput, setSearchInput] = useState(initialSearch);
  const searchTimerRef = useRef(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Bumping this number re-runs the fetch effect (after archive/restore).
  const [refreshKey, setRefreshKey] = useState(0);
  const [archivingId, setArchivingId] = useState(null);
  const patientsPerPage = 10;

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
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Patient Records</h1>
          <p className="text-gray-500">
            Manage and review all registered clinic patients.
          </p>
        </div>
        <Link
          href="/dashboard/add-patient"
          className={`${primaryButtonClass} flex items-center gap-2 self-start sm:self-auto`}
        >
          <Plus aria-hidden="true" className="w-4 h-4" />
          Add New Patient
        </Link>
      </div>

      {/* Toolbar, filters, table and paging share one panel */}
      <section className={`${panelClass} mt-4`}>
        {/* Tabs and search share a row on wide screens, stack below lg */}
        <div className="flex flex-col lg:flex-row px-4 py-3 w-full lg:justify-between lg:items-center gap-3 lg:gap-4">
          <div className="relative grid grid-cols-3 bg-gray-100 rounded-full p-1 w-full lg:w-auto">
            {/* One white pill slides under the active tab instead of each
                tab snapping its own background on and off. */}
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-smooth motion-reduce:transition-none ${TAB_PILL_POSITIONS[activeTabIndex]}`}
            />
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => updateFilter("status", tab.value)}
                aria-pressed={filters.status === tab.value}
                className={`relative px-2 sm:px-4 py-1.5 text-sm rounded-full whitespace-nowrap cursor-pointer transition-all duration-150 ease-smooth active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-[#00685F] ${
                  filters.status === tab.value
                    ? "text-[#00685F] font-medium"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative flex-1 min-w-0 lg:flex-none">
              <Search
                aria-hidden="true"
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                type="search"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search by name"
                aria-label="Search patients by name"
                className={`${fieldClass()} pl-9 lg:w-56`}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilterPanel((previous) => !previous)}
              aria-expanded={showFilterPanel}
              className={`${secondaryButtonClass} flex items-center gap-2 ${
                panelFilterCount > 0 ? "border-[#00685F] text-[#00685F]" : ""
              }`}
            >
              <SlidersHorizontal aria-hidden="true" className="w-4 h-4" />
              {panelFilterCount > 0 ? `Filter (${panelFilterCount})` : "Filter"}
            </button>
            <button type="button" className={secondaryButtonClass}>
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
            <div className="flex flex-wrap items-end gap-4 border-t border-gray-200 px-4 py-3">
              <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                <label htmlFor="filter-sex" className={labelClass}>
                  Sex
                </label>
                <select
                  id="filter-sex"
                  value={filters.sex}
                  onChange={(e) => updateFilter("sex", e.target.value)}
                  className={`${fieldClass()} sm:w-40`}
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="flex flex-col gap-1 flex-1 sm:flex-none">
                <label htmlFor="filter-age" className={labelClass}>
                  Age group
                </label>
                <select
                  id="filter-age"
                  value={filters.ageGroup}
                  onChange={(e) => updateFilter("ageGroup", e.target.value)}
                  className={`${fieldClass()} sm:w-44`}
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
                  type="button"
                  onClick={clearPanelFilters}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition-all duration-300 ease-smooth active:scale-[0.97] starting:opacity-0 motion-reduce:transition-none"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="mx-4 mb-3 text-sm text-red-600 bg-red-50 p-3 rounded transition duration-300 ease-smooth starting:opacity-0 starting:-translate-y-1 motion-reduce:transition-none">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                {PATIENT_COLUMNS.map((column) => (
                  <th key={column} className={tableHeaderCellClass}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            {/* While a new filter/page loads, keep the current rows and dim them
                instead of swapping to "Loading..." (that swap is the flicker). */}
            <tbody
              aria-busy={loading}
              className={`divide-y divide-gray-200 transition-opacity duration-300 ease-smooth motion-reduce:transition-none ${
                loading && patients.length > 0 ? "opacity-50" : "opacity-100"
              }`}
            >
              {loading && patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${tableCellClass} text-center text-gray-500`}>
                    Loading patients...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`${tableCellClass} text-center text-gray-500`}>
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
                    // The whole row opens the patient for mouse users; the name
                    // link below is the same action for keyboard and screen readers.
                    <tr
                      key={patient.id}
                      onClick={() => router.push(`/dashboard/patient-records/${patient.id}`)}
                      className={`cursor-pointer hover:bg-gray-50 transition duration-300 ease-smooth starting:opacity-0 motion-reduce:transition-none ${
                        isArchived ? "text-gray-400" : ""
                      }`}
                    >
                      <td className={`${tableCellClass} tabular-nums text-gray-500`}>
                        {patient.patient_id}
                      </td>
                      <td className={`${tableCellClass} font-medium`}>
                        <Link
                          href={`/dashboard/patient-records/${patient.id}`}
                          // The link already navigates; stop the row from doing it again.
                          onClick={(event) => event.stopPropagation()}
                          className="rounded hover:text-[#00685F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
                        >
                          {patient.full_name}
                        </Link>
                        {isArchived && (
                          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className={`${tableCellClass} tabular-nums`}>
                        {patient.age === null ? "—" : patient.age}
                      </td>
                      <td className={`${tableCellClass} tabular-nums`}>
                        {patient.contact_number || "—"}
                      </td>
                      <td className={`${tableCellClass} tabular-nums whitespace-nowrap`}>
                        {formatRegisteredDate(patient.created_at)}
                      </td>
                      <td className={tableCellClass}>
                        <button
                          type="button"
                          onClick={(event) => {
                            // Without this the click also reaches the row and opens the patient.
                            event.stopPropagation();
                            handleArchiveToggle(patient);
                          }}
                          disabled={archivingId === patient.id}
                          className={`${rowActionButtonClass} flex items-center gap-1 text-sm`}
                        >
                          {isArchived ? (
                            <ArchiveRestore aria-hidden="true" className="w-4 h-4" />
                          ) : (
                            <Archive aria-hidden="true" className="w-4 h-4" />
                          )}
                          {isArchived ? "Restore" : "Archive"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          pageSize={patientsPerPage}
          totalItems={totalPatients}
          itemLabel="patients"
          onPageChange={goToPage}
        />
      </section>
    </div>
  );
}
