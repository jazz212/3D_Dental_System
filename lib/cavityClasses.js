// The findings staff can mark on the 3D chart, taken from the class sheets
// the clinic's dentist sent (G.V. Black cavity classes). Every class comes
// in two colours: red for caries, blue for a restoration.

// color: the 3D presets' own red and blue (presets.json "colors").
// hintColor: the light tint on teeth that can take this finding while it is
// chosen. Picked by rendering candidates on a tooth under the viewer's
// lights: a light red with a touch of warmth (plain light reds look pink in
// 3D) and Tailwind blue-300 (indigo tints looked violet).
export const CONDITIONS = [
  { id: "caries", label: "Caries", localTerm: "Bulok / Sira", color: "#EE3B36", hintColor: "#F99B93" },
  { id: "restoration", label: "Restoration", localTerm: "Pasta", color: "#24109F", hintColor: "#93C5FD" },
];

// appliesTo: which teeth the class exists for on the dentist's sheets.
// "back" = premolars and molars, "front" = incisors and canines,
// "allButLowerFront" = every tooth but the lower incisors and canines
// (front teeth only have a Class 1 pit on the upper arch).
// thumbnail: the picker drawing, when it isn't named after the id.
export const CLASS_OPTIONS = [
  { id: "class-1", label: "Class 1", appliesTo: "allButLowerFront" },
  { id: "class-2-mesial", label: "Class 2 Mesial", appliesTo: "back" },
  { id: "class-2-distal", label: "Class 2 Distal", appliesTo: "back" },
  { id: "class-2-mesial-distal", label: "Class 2 Mesial and Distal", appliesTo: "back" },
  { id: "class-3-mesial", label: "Class 3 Mesial", appliesTo: "front" },
  { id: "class-3-distal", label: "Class 3 Distal", appliesTo: "front" },
  { id: "class-3-mesial-distal", label: "Class 3 Mesial and Distal", appliesTo: "front" },
  { id: "class-4-mesial", label: "Class 4 Mesial", appliesTo: "front" },
  { id: "class-4-distal", label: "Class 4 Distal", appliesTo: "front" },
  { id: "class-4-mesial-distal", label: "Class 4 Mesial and Distal", appliesTo: "front" },
  { id: "class-5-facial", label: "Class 5 Facial", appliesTo: "all", thumbnail: "class-5" },
  { id: "class-5-lingual", label: "Class 5 Lingual", appliesTo: "all", thumbnail: "class-5" },
];

export const APPLIES_TO_TEXT = {
  back: "premolars and molars",
  front: "front teeth (incisors and canines)",
  allButLowerFront: "premolars, molars and upper front teeth",
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
  if (classOption.appliesTo === "allButLowerFront") return !(isFrontTooth && isLowerTooth(toothNumber));
  return true;
}

// The 3D presets (public/models/bodyparts3d/presets.json) that show a class
// on a tooth: "class-2-mesial-distal" -> ["class2_mesial_distal"]. Class 1
// is the fissures on back teeth and the lingual pit on upper front teeth.
// Returns [] where the class doesn't exist (see classAppliesToTooth).
export function presetNamesFor(classId, toothNumber) {
  const classOption = findClassOption(classId);
  if (!classOption || !classAppliesToTooth(classOption, toothNumber)) return [];
  if (classId === "class-1") {
    return [toothTypeOf(toothNumber) === "anterior" ? "class1_lingual_pit" : "class1"];
  }
  const [, classNumber, ...sideWords] = classId.split("-");
  return [`class${classNumber}_${sideWords.join("_")}`];
}
