import * as THREE from "three";

// BodyParts3D has no wisdom teeth (18, 28, 38, 48): the one person it was
// scanned from had none. Each is made here from a copy of the second molar
// in front of it, adjusted so it doesn't look like an exact twin:
// - a little smaller, as wisdom teeth usually are,
// - tilted the way wisdom teeth usually sit (upper: crown back and out,
//   lower: crown forward and in),
// - turned slightly, so its grooves don't line up with its neighbour's,
// - placed right behind the second molar, touching it.
//
// Works in the dataset's own coordinates: millimetres, Z up.

const SIZE = 0.88;
const FRONT_BACK_TILT = THREE.MathUtils.degToRad(8);
const CHEEK_TONGUE_TILT = THREE.MathUtils.degToRad(5);
const TURN = THREE.MathUtils.degToRad(12);
const UP = new THREE.Vector3(0, 0, 1);

// The top share of a tooth, measured from its biting end, counts as crown.
const CROWN_SHARE = 0.35;

const centerOf = (geometry) => {
  geometry.computeBoundingBox();
  return geometry.boundingBox.getCenter(new THREE.Vector3());
};

// The crown's points: the part of the tooth nearest its biting end. Teeth
// touch at the crown, and roots often lean, so placing by the whole tooth
// would leave a gap.
function crownPoints(geometry, crownDirection) {
  const positions = geometry.getAttribute("position");
  const points = [];
  for (let index = 0; index < positions.count; index++) {
    points.push(new THREE.Vector3().fromBufferAttribute(positions, index));
  }
  const heights = points.map((point) => point.dot(crownDirection));
  const { min: bottom, max: top } = rangeOf(heights);
  const crownStart = top - (top - bottom) * CROWN_SHARE;
  return points.filter((point, index) => heights[index] >= crownStart);
}

// Smallest and largest number in a long list (a loop, because spreading tens
// of thousands of numbers into Math.max can overflow the call stack).
function rangeOf(numbers) {
  let min = Infinity;
  let max = -Infinity;
  for (const number of numbers) {
    min = Math.min(min, number);
    max = Math.max(max, number);
  }
  return { min, max };
}

// Middle of a set of points and how far they reach along a direction.
function measure(points, direction) {
  const box = new THREE.Box3().setFromPoints(points);
  const { min, max } = rangeOf(points.map((point) => point.dot(direction)));
  return { center: box.getCenter(new THREE.Vector3()), length: max - min };
}

// secondMolar / firstMolar: geometries of teeth x7 and x6.
// archCenter: middle of that arch. isUpper: upper or lower arch.
export function makeWisdomTooth({ secondMolar, firstMolar, archCenter, isUpper }) {
  const secondCenter = centerOf(secondMolar);

  // Flat directions at the back of the arch: backwards along it, and out
  // towards the cheek.
  const backwards = secondCenter.clone().sub(centerOf(firstMolar)).setZ(0).normalize();
  const towardsCheek = new THREE.Vector3().crossVectors(UP, backwards).normalize();
  if (towardsCheek.dot(secondCenter.clone().sub(archCenter).setZ(0)) < 0) towardsCheek.negate();

  // Upper crowns point down, lower crowns point up. Turning about
  // (crown direction x target) leans the crown towards the target.
  const crownDirection = isUpper ? UP.clone().negate() : UP.clone();
  const frontBackLean = isUpper ? backwards : backwards.clone().negate();
  const cheekTongueLean = isUpper ? towardsCheek : towardsCheek.clone().negate();
  const leanFrontBack = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3().crossVectors(crownDirection, frontBackLean).normalize(),
    FRONT_BACK_TILT
  );
  const leanCheekTongue = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3().crossVectors(crownDirection, cheekTongueLean).normalize(),
    CHEEK_TONGUE_TILT
  );
  const turn = new THREE.Quaternion().setFromAxisAngle(UP, TURN);
  const rotation = turn.multiply(leanCheekTongue).multiply(leanFrontBack);

  // Crowns touching: the new crown's middle sits behind the second molar's
  // crown by half of each crown's front-to-back length, at the same height.
  const secondCrown = measure(crownPoints(secondMolar, crownDirection), backwards);
  const newCrownCenter = secondCrown.center
    .clone()
    .addScaledVector(backwards, (secondCrown.length * (1 + SIZE)) / 2);

  // Shrink, tilt and turn about the crown's middle, then move it into place.
  const wisdomTooth = secondMolar.clone();
  wisdomTooth.translate(-secondCrown.center.x, -secondCrown.center.y, -secondCrown.center.z);
  wisdomTooth.applyMatrix4(
    new THREE.Matrix4().compose(newCrownCenter, rotation, new THREE.Vector3(SIZE, SIZE, SIZE))
  );
  wisdomTooth.computeVertexNormals();
  return wisdomTooth;
}
