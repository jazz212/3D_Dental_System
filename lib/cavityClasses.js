// The findings staff can mark on the 3D chart, taken from the class sheets
// the clinic's dentist sent (G.V. Black cavity classes). Every class comes
// in two colours: red for caries, blue for a restoration.

// hintColor: the light tint on teeth that can take this finding while it is
// chosen. Picked by rendering candidates on a tooth under the viewer's
// lights: a light red with a touch of warmth (plain light reds look pink in
// 3D) and Tailwind blue-300 (indigo tints looked violet).
export const CONDITIONS = [
  { id: "caries", label: "Caries", localTerm: "Bulok / Sira", color: "#E53935", hintColor: "#F99B93" },
  { id: "restoration", label: "Restoration", localTerm: "Pasta", color: "#2B1BA8", hintColor: "#93C5FD" },
];

// appliesTo: which teeth the class exists for on the dentist's sheets.
// "back" = premolars and molars, "front" = incisors and canines.
export const CLASS_OPTIONS = [
  { id: "class-1", label: "Class 1", appliesTo: "all" },
  { id: "class-2-mesial", label: "Class 2 Mesial", appliesTo: "back" },
  { id: "class-2-distal", label: "Class 2 Distal", appliesTo: "back" },
  { id: "class-2-mesial-distal", label: "Class 2 Mesial and Distal", appliesTo: "back" },
  { id: "class-3-mesial", label: "Class 3 Mesial", appliesTo: "front" },
  { id: "class-3-distal", label: "Class 3 Distal", appliesTo: "front" },
  { id: "class-3-mesial-distal", label: "Class 3 Mesial and Distal", appliesTo: "front" },
  { id: "class-4-mesial", label: "Class 4 Mesial", appliesTo: "front" },
  { id: "class-4-distal", label: "Class 4 Distal", appliesTo: "front" },
  { id: "class-4-mesial-distal", label: "Class 4 Mesial and Distal", appliesTo: "front" },
  { id: "class-5", label: "Class 5", appliesTo: "all" },
];

export const APPLIES_TO_TEXT = {
  back: "premolars and molars",
  front: "front teeth (incisors and canines)",
};

export function findCondition(conditionId) {
  return CONDITIONS.find((condition) => condition.id === conditionId);
}

export function findClassOption(classId) {
  return CLASS_OPTIONS.find((option) => option.id === classId);
}

// FDI numbers: the tens digit is the quadrant (1-2 upper, 3-4 lower), the
// ones digit the position from the middle (1-3 front teeth, 4-5 premolars,
// 6-8 molars).
export function toothTypeOf(toothNumber) {
  const position = toothNumber % 10;
  if (position <= 3) return "anterior";
  if (position <= 5) return "premolar";
  return "molar";
}

export const isLowerTooth = (toothNumber) => Math.floor(toothNumber / 10) >= 3;

export function classAppliesToTooth(classOption, toothNumber) {
  const isFrontTooth = toothTypeOf(toothNumber) === "anterior";
  if (classOption.appliesTo === "back") return !isFrontTooth;
  if (classOption.appliesTo === "front") return isFrontTooth;
  return true;
}

// Which of the dentist's drawings show a class on a tooth, and from where:
// "occlusal" (from the biting side), "facial" (from the lips / cheek) or
// "lingual" (from the tongue). The images are the red marks cut out of the
// sheets, in public/models/cavity-marks.
//
// The sheets only draw upper front teeth, so lower front teeth reuse those
// drawings upside down (flipVertical). The sheets show class 3 and 4 from
// the front and the back at once, so both are drawn.
export function markDrawingsFor(classId, toothNumber) {
  const type = toothTypeOf(toothNumber);
  const arch = isLowerTooth(toothNumber) ? "lower" : "upper";
  const isFront = type === "anterior";
  const flipVertical = isFront && arch === "lower";

  if (classId === "class-1") {
    return isFront
      ? [{ image: "class-1-anterior-lingual", view: "lingual", flipVertical }]
      : [{ image: `class-1-${type}-${arch}-occlusal`, view: "occlusal" }];
  }
  if (classId.startsWith("class-2-")) {
    return isFront ? [] : [{ image: `${classId}-${type}-${arch}-occlusal`, view: "occlusal" }];
  }
  if (classId.startsWith("class-3-") || classId.startsWith("class-4-")) {
    if (!isFront) return [];
    return [
      { image: `${classId}-anterior-facial`, view: "facial", flipVertical },
      { image: `${classId}-anterior-lingual`, view: "lingual", flipVertical },
    ];
  }
  if (classId === "class-5") {
    const image = isFront ? "class-5-anterior-upper-facial" : `class-5-${type}-${arch}-facial`;
    return [{ image, view: "facial", flipVertical }];
  }
  return [];
}
