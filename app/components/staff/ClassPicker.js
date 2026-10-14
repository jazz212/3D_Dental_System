import Image from "next/image";
import { Check, X } from "lucide-react";
import { CLASS_OPTIONS, CONDITIONS, findClassOption, findCondition } from "@/lib/cavityClasses";
import { panelClass, rowActionButtonClass } from "./staffStyles";

// The dentist's own drawings, cut from the class sheets (one example tooth
// per class, in red and in blue).
const THUMBNAIL_FOLDER = "/models/cavity-marks/thumbnails";

// The "paint box" for the 3D chart: every class, each as the dentist's red
// (caries) and blue (restoration) drawing. Staff pick one, then click a tooth.
// inspectedTooth / toothFindings: a double-clicked tooth and the findings
// on it; those findings are highlighted. onCloseInspection stops that.
export default function ClassPicker({ selected, onSelect, inspectedTooth, toothFindings, onCloseInspection }) {
  const isOnTooth = (classOption, condition) =>
    inspectedTooth !== null &&
    toothFindings.some((finding) => finding.classId === classOption.id && finding.conditionId === condition.id);

  return (
    <section aria-label="Choose a finding" className={`${panelClass} p-5`}>
      <h2 className="font-bold text-lg">Choose a finding</h2>
      <p className="text-sm text-gray-600">
        <span className="pointer-coarse:hidden">Then click a tooth. Hold Shift to mark several; Esc clears.</span>
        <span className="hidden pointer-coarse:inline">Then tap a tooth.</span>
      </p>

      {inspectedTooth !== null && (
        <InspectedToothBar toothNumber={inspectedTooth} toothFindings={toothFindings} onClose={onCloseInspection} />
      )}

      <div className="mt-3 grid grid-cols-[1fr_auto_auto] items-center gap-x-2 text-sm">
        <span className="font-medium text-gray-500">Class</span>
        {CONDITIONS.map((condition) => (
          <span key={condition.id} className="flex w-[4.5rem] flex-col items-center font-medium leading-tight">
            <span style={{ color: condition.color }}>{condition.label}</span>
            <span className="text-xs text-gray-500">{condition.localTerm}</span>
          </span>
        ))}

        {CLASS_OPTIONS.map((classOption) => (
          <FindingRow
            key={classOption.id}
            classOption={classOption}
            selected={selected}
            onSelect={onSelect}
            isOnTooth={isOnTooth}
            inspectedTooth={inspectedTooth}
          />
        ))}
      </div>
    </section>
  );
}

// "Tooth 16: Class 1 caries, Class 5 restoration" with a close button.
// role="status" so screen readers announce it when a tooth is double-clicked.
function InspectedToothBar({ toothNumber, toothFindings, onClose }) {
  const summary =
    toothFindings.length === 0
      ? "No findings yet."
      : toothFindings
          .map((finding) => `${findClassOption(finding.classId).label} ${findCondition(finding.conditionId).label.toLowerCase()}`)
          .join(", ");
  return (
    <div role="status" className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm">
      <p className="flex-1">
        <span className="font-semibold">Tooth {toothNumber}:</span> {summary}
      </p>
      <button type="button" onClick={onClose} aria-label={`Stop showing tooth ${toothNumber}`} className={rowActionButtonClass}>
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// One class: its name, then its red and blue drawings as buttons.
function FindingRow({ classOption, selected, onSelect, isOnTooth, inspectedTooth }) {
  return (
    <>
      <span className="border-t border-gray-100 py-1">{classOption.label}</span>
      {CONDITIONS.map((condition) => (
        <span key={condition.id} className="flex justify-center border-t border-gray-100 py-1">
          <FindingButton
            classOption={classOption}
            condition={condition}
            isSelected={selected?.classId === classOption.id && selected?.conditionId === condition.id}
            isOnTooth={isOnTooth(classOption, condition)}
            inspectedTooth={inspectedTooth}
            onSelect={onSelect}
          />
        </span>
      ))}
    </>
  );
}

// The chosen drawing gets a thick dark ring. A drawing already on the
// double-clicked tooth gets a light background in its colour and a check
// badge, so "chosen" and "already on the tooth" never look the same.
function FindingButton({ classOption, condition, isSelected, isOnTooth, inspectedTooth, onSelect }) {
  const label = `${classOption.label}, ${condition.label}${isOnTooth ? `, on tooth ${inspectedTooth}` : ""}`;
  return (
    <button
      type="button"
      onClick={() => onSelect({ classId: classOption.id, conditionId: condition.id })}
      aria-label={label}
      aria-pressed={isSelected}
      style={isOnTooth ? { backgroundColor: condition.hintColor } : undefined}
      className={`relative h-14 w-[4.5rem] rounded-lg bg-white cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00685F] ${
        isSelected ? "ring-2 ring-offset-1 ring-gray-900" : "hover:bg-gray-100"
      }`}
    >
      <Image
        src={`${THUMBNAIL_FOLDER}/${classOption.id}-${condition.id}.png`}
        alt=""
        fill
        sizes="72px"
        className="object-contain p-1"
      />
      {isOnTooth && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: condition.color }}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
