import { X } from "lucide-react";
import { findClassOption, findCondition } from "@/lib/cavityClasses";
import { panelClass, rowActionButtonClass } from "./staffStyles";

// The marks placed on the 3D chart, written out, so a finding can be read
// (and removed) without hunting for it on the model.
export default function FindingsList({ findings, onRemove }) {
  return (
    <section aria-label="Marked findings" className={`${panelClass} p-5`}>
      <h2 className="font-bold text-lg">Marked findings</h2>
      {findings.length === 0 ? (
        <p className="mt-1 text-sm text-gray-600">None yet. Choose a finding, then click a tooth.</p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100">
          {findings.map((finding) => {
            const classOption = findClassOption(finding.classId);
            const condition = findCondition(finding.conditionId);
            return (
              <li key={finding.id} className="flex items-center gap-2 py-1 text-sm">
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: condition.color }}
                />
                <span className="flex-1">
                  Tooth {finding.toothNumber} · {classOption.label} · {condition.label}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(finding.id)}
                  aria-label={`Remove tooth ${finding.toothNumber} ${classOption.label} ${condition.label}`}
                  className={rowActionButtonClass}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
