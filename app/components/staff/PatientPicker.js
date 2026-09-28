"use client";
import { useEffect, useRef, useState } from "react";
import { UserCheck } from "lucide-react";
import { searchPatientsForBooking } from "@/lib/patients";

const RESULT_LIMIT = 6;
const SEARCH_DELAY_MS = 250;

// The patient name box in the booking forms. Typing searches registered
// patients; choosing one links the booking to them (so it shows on their
// patient page). Staff can still just type a name for a walk-in who isn't
// registered yet; that booking is saved unlinked.
export default function PatientPicker({
  id,
  patientName,
  linkedPatientId,
  onTypeName,
  onSelectPatient,
  inputClassName,
}) {
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchFailed, setSearchFailed] = useState(false);
  const searchTimerRef = useRef(null);
  // Numbers each search so a slow, older answer can't overwrite the results
  // for what is typed now.
  const latestSearchIdRef = useRef(0);
  const listboxId = `${id}-results`;

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

  const runSearch = (text) => {
    clearTimeout(searchTimerRef.current);
    latestSearchIdRef.current += 1;
    const searchId = latestSearchIdRef.current;
    if (text.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    // Wait for a pause in typing so "Maria" is one search, not five.
    searchTimerRef.current = setTimeout(async () => {
      try {
        const found = await searchPatientsForBooking(text, RESULT_LIMIT);
        if (searchId !== latestSearchIdRef.current) return;
        setResults(found);
        setSearchFailed(false);
      } catch {
        if (searchId !== latestSearchIdRef.current) return;
        setResults([]);
        setSearchFailed(true);
      }
      setHighlightedIndex(-1);
      setIsOpen(true);
    }, SEARCH_DELAY_MS);
  };

  const handleChange = (event) => {
    // Editing the name after choosing someone unlinks them: the text no
    // longer names that patient.
    onTypeName(event.target.value);
    runSearch(event.target.value);
  };

  const choosePatient = (patient) => {
    // Cancel any search still pending so it can't reopen the list afterwards.
    clearTimeout(searchTimerRef.current);
    latestSearchIdRef.current += 1;
    onSelectPatient(patient);
    setIsOpen(false);
    setResults([]);
  };

  // Leaving the field cancels a search still waiting to run, otherwise its
  // answer would reopen the list over the next fields. The close is delayed
  // so a click on a result lands before the list closes.
  const handleBlur = () => {
    clearTimeout(searchTimerRef.current);
    latestSearchIdRef.current += 1;
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleKeyDown = (event) => {
    if (!isOpen || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      // Stop Enter from also submitting the booking form.
      event.preventDefault();
      choosePatient(results[highlightedIndex]);
    } else if (event.key === "Escape") {
      // Marked as handled so the pop-up around the picker stays open.
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlightedIndex >= 0 ? `${listboxId}-${highlightedIndex}` : undefined
        }
        autoComplete="off"
        placeholder="Search or type full name"
        value={patientName}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={inputClassName}
      />

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          // Shorter on touch screens (about four results) so the list still
          // fits above the phone keyboard, which covers the lower half.
          className="absolute z-10 mt-1 max-h-64 pointer-coarse:max-h-52 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white py-1 shadow-lg"
        >
          {searchFailed && (
            <li className="px-4 py-2 text-sm text-red-700">
              Couldn&apos;t search patients. You can still type the name.
            </li>
          )}
          {!searchFailed && results.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-600">
              No registered patient matches. The booking will be saved with
              this name only.
            </li>
          )}
          {results.map((patient, index) => (
            <li
              key={patient.id}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              // mousedown, not click: it fires before the input's blur.
              onMouseDown={(event) => {
                event.preventDefault();
                choosePatient(patient);
              }}
              className={`cursor-pointer px-4 py-2 ${
                index === highlightedIndex ? "bg-[#F0FDFA]" : "hover:bg-gray-50"
              }`}
            >
              <span className="block text-sm font-medium text-gray-900">
                {patient.full_name}
              </span>
              <span className="block text-xs text-gray-600">
                {patient.contact_number || "No contact number"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1 text-xs text-gray-600" aria-live="polite">
        {linkedPatientId ? (
          <span className="inline-flex items-center gap-1 font-medium text-[#00685F]">
            <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Linked to a registered patient
          </span>
        ) : (
          "Not linked: pick from the list to add it to their record."
        )}
      </p>
    </div>
  );
}
