import { toothTypeOf } from "./cavityClasses";

// Keeps findings on one tooth from stacking. A tooth is split into areas
// that don't overlap, and each class covers one or more of them:
//
//   back teeth:  "biting"  - the chewing surface: its groove, plus the mesial
//                            and/or distal edge for class 2
//   front teeth: "mesial" / "distal" - the sides, class 3 or 4 (the grade)
//                "pit"    - the tongue-side pit, class 1
//   every tooth: "gum"     - the gum line, class 5
//
// Placing a finding, area by area:
//   - empty area: the finding goes in
//   - same colour: they combine (edges add up, the higher grade wins, so
//     class 2 covers class 1 and class 4 covers class 3)
//   - other colour: the new finding replaces what was there
// The tooth's findings are then written back from its areas, so the list
// always reads the way the dentist would chart it (one "Mesial and Distal"
// instead of a mesial plus a distal, for example).

const isBackTooth = (toothNumber) => toothTypeOf(toothNumber) !== "anterior";

// The areas one finding covers: { areaName: { edges, grade } }.
// edges only matter on the biting surface (which class 2 edges it reaches).
function areasOf(classId, toothNumber) {
  const [, classNumber, ...sideWords] = classId.split("-");
  const grade = Number(classNumber);
  const side = sideWords.join("-"); // "mesial", "distal", "mesial-distal" or ""
  const sides = side === "mesial-distal" ? ["mesial", "distal"] : side ? [side] : [];

  if (grade === 5) return { gum: { edges: [], grade } };
  if (grade === 1) return isBackTooth(toothNumber) ? { biting: { edges: [], grade } } : { pit: { edges: [], grade } };
  if (grade === 2) return { biting: { edges: sides, grade } };
  // Class 3 and 4: one area per side of a front tooth.
  return Object.fromEntries(sides.map((sideName) => [sideName, { edges: [], grade }]));
}

// Area name -> { conditionId, edges, grade } for everything on the tooth.
function toothAreas(toothFindings) {
  const areas = {};
  for (const finding of toothFindings) {
    for (const [name, part] of Object.entries(areasOf(finding.classId, finding.toothNumber))) {
      areas[name] = mergeArea(areas[name], { conditionId: finding.conditionId, ...part });
    }
  }
  return areas;
}

// Same colour combines; another colour replaces.
function mergeArea(existing, incoming) {
  if (!existing || existing.conditionId !== incoming.conditionId) return incoming;
  return {
    conditionId: existing.conditionId,
    edges: [...new Set([...existing.edges, ...incoming.edges])],
    grade: Math.max(existing.grade, incoming.grade),
  };
}

// Writes the tooth's areas back as findings ({ classId, conditionId }).
function findingsFromAreas(areas) {
  const findings = [];

  if (areas.biting) {
    const { edges, conditionId } = areas.biting;
    const hasMesial = edges.includes("mesial");
    const hasDistal = edges.includes("distal");
    const classId =
      hasMesial && hasDistal ? "class-2-mesial-distal"
      : hasMesial ? "class-2-mesial"
      : hasDistal ? "class-2-distal"
      : "class-1";
    findings.push({ classId, conditionId });
  }
  if (areas.pit) findings.push({ classId: "class-1", conditionId: areas.pit.conditionId });

  // Both sides alike (same grade and colour) read as one "Mesial and Distal".
  const { mesial, distal } = areas;
  if (mesial && distal && mesial.grade === distal.grade && mesial.conditionId === distal.conditionId) {
    findings.push({ classId: `class-${mesial.grade}-mesial-distal`, conditionId: mesial.conditionId });
  } else {
    if (mesial) findings.push({ classId: `class-${mesial.grade}-mesial`, conditionId: mesial.conditionId });
    if (distal) findings.push({ classId: `class-${distal.grade}-distal`, conditionId: distal.conditionId });
  }

  if (areas.gum) findings.push({ classId: "class-5", conditionId: areas.gum.conditionId });
  return findings;
}

const sameFindings = (first, second) =>
  first.length === second.length &&
  first.every((finding) =>
    second.some((other) => other.classId === finding.classId && other.conditionId === finding.conditionId)
  );

// Places { classId, conditionId } on a tooth that already has toothFindings.
// Returns the tooth's findings afterwards (without ids) and what happened:
//   "added"     - it simply joined the tooth's findings
//   "unchanged" - the tooth already had it (or a finding that covers it)
//   "combined"  - it merged with or replaced something already there
export function placeOnTooth(toothFindings, toothNumber, newFinding) {
  const before = findingsFromAreas(toothAreas(toothFindings));
  const after = findingsFromAreas(toothAreas([...toothFindings, { ...newFinding, toothNumber }]));

  if (sameFindings(before, after)) return { findings: after, change: "unchanged" };
  const isPlainAdd = sameFindings([...before, newFinding], after);
  return { findings: after, change: isPlainAdd ? "added" : "combined" };
}
