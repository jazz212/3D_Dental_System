"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { APPLIES_TO_TEXT, classAppliesToTooth, findClassOption, findCondition } from "@/lib/cavityClasses";
import { placeOnTooth } from "@/lib/toothFindings";
import { panelClass, secondaryButtonClass } from "./staffStyles";
import useFullscreen from "./useFullscreen";
import ToothModelViewer from "./ToothModelViewer";
import ClassPicker from "./ClassPicker";
import FindingsList from "./FindingsList";

// A patient's 3D dental chart: pick a finding (class + caries/restoration),
// then click a tooth. The dentist's drawing for that class appears on it.
// Findings live only on this page for now; they are not saved yet.
export default function DentalChart3D({ patientId }) {
  const [arch, setArch] = useState("upper"); // which arch the model shows
  const [selectedFinding, setSelectedFinding] = useState(null); // { classId, conditionId }
  const [findings, setFindings] = useState([]);
  // A note about the last click, or null. tone "warning": it didn't add a
  // mark (class 2 on a front tooth, already marked). tone "info": it changed
  // what the tooth has (merged or replaced).
  const [notice, setNotice] = useState(null);
  // The workspace (switch, model, picker) is what goes full screen, so the
  // picker stays in reach there.
  const workspaceRef = useRef(null);
  const { canFullscreen, isFullscreen, toggleFullscreen } = useFullscreen(workspaceRef);
  // Counts presses of Reset view; with the full-screen state it forms the
  // viewer's resetKey, so both put the camera back to the starting view.
  const [viewResets, setViewResets] = useState(0);
  // The double-clicked tooth whose findings the picker highlights, or null.
  const [inspectedTooth, setInspectedTooth] = useState(null);
  // Worked out from `findings` each time, so it follows adds and removals.
  const inspectedToothFindings = findings.filter((finding) => finding.toothNumber === inspectedTooth);

  // Clears the chosen finding (and its tint), the tooth bar and the note.
  // Only uses state setters, which never change, so it is made once.
  const clearSelection = useCallback(() => {
    setSelectedFinding(null);
    setInspectedTooth(null);
    setNotice(null);
  }, []);

  // Pressing anywhere outside the 3D window, or Esc, clears the selection.
  // The picker and the Upper / Lower / Both switch are marked
  // data-keeps-selection, because choosing a finding or switching arches
  // before clicking a tooth must keep working.
  useEffect(() => {
    const clearIfOutside = (event) => {
      if (!event.target.closest("[data-keeps-selection]")) clearSelection();
    };
    const clearOnEscape = (event) => {
      if (event.key === "Escape") clearSelection();
    };
    document.addEventListener("pointerdown", clearIfOutside);
    document.addEventListener("keydown", clearOnEscape);
    return () => {
      document.removeEventListener("pointerdown", clearIfOutside);
      document.removeEventListener("keydown", clearOnEscape);
    };
  }, [clearSelection]);

  // A click on a tooth places the chosen finding, then un-chooses it so the
  // tint goes away. Shift-click keeps it chosen, to mark several teeth in a
  // row. A tooth that can't take the class keeps the choice, so a right
  // tooth can be clicked next.
  const addFindingOn = (toothNumber, { keepChoice = false } = {}) => {
    if (!selectedFinding) return;
    const classOption = findClassOption(selectedFinding.classId);
    if (!classAppliesToTooth(classOption, toothNumber)) {
      setNotice({
        tone: "warning",
        text: `${classOption.label} is only for ${APPLIES_TO_TEXT[classOption.appliesTo]}. Tooth ${toothNumber} wasn't marked.`,
      });
      return;
    }
    setNotice(placeFinding(toothNumber));
    if (!keepChoice) setSelectedFinding(null);
  };

  // Marks don't stack (see lib/toothFindings.js): findings on the same part
  // of a tooth combine or replace each other. The tooth's findings are
  // swapped in place in the list; findings that didn't change keep their id.
  // Returns a note to show, or null when the finding was simply added.
  const placeFinding = (toothNumber) => {
    const toothFindings = findings.filter((finding) => finding.toothNumber === toothNumber);
    const { findings: nextToothFindings, change } = placeOnTooth(toothFindings, toothNumber, selectedFinding);
    if (change === "unchanged") {
      return { tone: "warning", text: `Tooth ${toothNumber} already has ${describeFindings(nextToothFindings)}.` };
    }

    const withIds = nextToothFindings.map((finding) => {
      const kept = toothFindings.find(
        (old) => old.classId === finding.classId && old.conditionId === finding.conditionId
      );
      return { id: kept ? kept.id : crypto.randomUUID(), toothNumber, ...finding };
    });
    setFindings((previous) => replaceToothFindings(previous, toothNumber, withIds));
    return change === "combined"
      ? { tone: "info", text: `Tooth ${toothNumber} now has ${describeFindings(nextToothFindings)}.` }
      : null;
  };

  // Pressing the chosen drawing again un-chooses it (and clears the tint).
  const chooseFinding = (choice) => {
    setSelectedFinding((previous) =>
      previous?.classId === choice.classId && previous?.conditionId === choice.conditionId ? null : choice
    );
  };

  const removeFinding = (findingId) => {
    setFindings((previous) => previous.filter((finding) => finding.id !== findingId));
  };

  return (
    <div className="bg-white w-full p-4 pt-2 pb-8">
      <Link
        href={`/dashboard/patient-records/${patientId}`}
        className="inline-flex items-center gap-1 pointer-coarse:min-h-11 rounded text-sm text-gray-600 hover:text-[#00685F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to patient record
      </Link>

      <div className="mt-4">
        <h1 className="text-3xl sm:text-4xl font-bold">3D Chart</h1>
        <p className="text-gray-500">Mark caries and restorations on each tooth.</p>
      </div>

      {/* The workspace goes full screen as a whole. Inside, the model column
          stays in view (sticky) while the picker scrolls, so a finding low
          in the list never means scrolling back up to reach the teeth. */}
      <div
        ref={workspaceRef}
        className={`mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-3 ${
          isFullscreen ? "overflow-y-auto bg-white p-4" : ""
        }`}
      >
        <div className="sticky top-0 z-10 min-w-0 bg-white pb-2 lg:col-span-2">
          <div data-keeps-selection className="flex flex-wrap items-center justify-between gap-2">
            <ArchSwitch arch={arch} onChange={setArch} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewResets((count) => count + 1)}
                className={`${toolbarButtonClass} flex items-center gap-2 text-sm`}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Reset view</span>
              </button>
              {canFullscreen && <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />}
            </div>
          </div>
          <section
            data-keeps-selection
            aria-label="3D dental chart"
            className={`${panelClass} mt-2 overflow-hidden ${
              isFullscreen ? "h-[55dvh] lg:h-[calc(100dvh-7.5rem)]" : "h-[40dvh] lg:h-[calc(100dvh-17rem)] lg:min-h-96"
            }`}
          >
            <ToothModelViewer
              arch={arch}
              findings={findings}
              selectedFinding={selectedFinding}
              resetKey={`${viewResets}-${isFullscreen}`}
              onToothClick={addFindingOn}
              onToothDoubleClick={setInspectedTooth}
            />
          </section>
          <GestureHint />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div data-keeps-selection>
            <ClassPicker
              selected={selectedFinding}
              onSelect={chooseFinding}
              inspectedTooth={inspectedTooth}
              toothFindings={inspectedToothFindings}
              onCloseInspection={() => setInspectedTooth(null)}
            />
          </div>
          {notice && <Notice tone={notice.tone} text={notice.text} />}
          <FindingsList findings={findings} onRemove={removeFinding} />
        </div>
      </div>

      {/* Required by the model's licence (CC BY-SA 2.1 JP). */}
      <p className="mt-6 text-xs text-gray-500">
        3D teeth: BodyParts3D, © The Database Center for Life Science, licensed
        under{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en"
          className="underline underline-offset-2 hover:text-[#00685F]"
          target="_blank"
          rel="noreferrer"
        >
          CC Attribution-Share Alike 2.1 Japan
        </a>
        .
      </p>
    </div>
  );
}

// How to move the model, for mouse or for touch (whichever this screen has).
function GestureHint() {
  return (
    <p className="mt-2 text-sm text-gray-600">
      <span className="pointer-coarse:hidden">
        Drag to turn · Space + drag to move · Scroll to zoom · Double-click a tooth to see what it has
      </span>
      <span className="hidden pointer-coarse:inline">
        Drag to turn · Pinch to zoom · Two fingers to move · Double-tap a tooth to see what it has
      </span>
    </p>
  );
}

// Amber when a click didn't add a mark; mint when it changed what the tooth
// has. role="status" so screen readers read it out.
const NOTICE_TONES = {
  warning: "bg-amber-50 text-amber-800",
  info: "bg-[#F0FDFA] text-[#004D45]",
};

function Notice({ tone, text }) {
  return (
    <p role="status" className={`rounded-lg p-3 text-sm ${NOTICE_TONES[tone]}`}>
      {text}
    </p>
  );
}

// Toolbar buttons are icon-only below sm, so the switch and both buttons fit
// on one line on a phone (the label stays for screen readers); square
// padding keeps the icon-only button a 44px touch target.
const toolbarButtonClass = `${secondaryButtonClass} px-3 sm:px-4 pointer-coarse:min-w-11 justify-center`;

function FullscreenButton({ isFullscreen, onToggle }) {
  const Icon = isFullscreen ? Minimize2 : Maximize2;
  return (
    <button type="button" onClick={onToggle} className={`${toolbarButtonClass} flex items-center gap-2 text-sm`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">{isFullscreen ? "Exit full screen" : "Full screen"}</span>
    </button>
  );
}

// "Class 2 Mesial caries, Class 5 restoration"
function describeFindings(findingsToDescribe) {
  return findingsToDescribe
    .map((finding) => `${findClassOption(finding.classId).label} ${findCondition(finding.conditionId).label.toLowerCase()}`)
    .join(", ");
}

// The list with one tooth's findings swapped for new ones, placed where that
// tooth's first finding was (or at the end if it had none), so the list
// doesn't jump around.
function replaceToothFindings(allFindings, toothNumber, newToothFindings) {
  const firstIndex = allFindings.findIndex((finding) => finding.toothNumber === toothNumber);
  const others = allFindings.filter((finding) => finding.toothNumber !== toothNumber);
  const insertAt = firstIndex === -1 ? others.length : firstIndex;
  return [...others.slice(0, insertAt), ...newToothFindings, ...others.slice(insertAt)];
}

const ARCHES = [
  { id: "upper", label: "Upper" },
  { id: "lower", label: "Lower" },
  { id: "both", label: "Both" },
];

// Upper / Lower / Both switch for the model, in the staff pill-toggle style
// (grey track, white pill for the chosen one), same as the Dashboard filter.
function ArchSwitch({ arch, onChange }) {
  return (
    <div role="group" aria-label="Arch shown" className="flex rounded-full bg-gray-100 p-1">
      {ARCHES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={arch === id}
          className={`px-4 py-1.5 pointer-coarse:min-h-11 text-sm rounded-full cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] ${
            arch === id ? "bg-white shadow-sm font-medium text-[#00685F]" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
