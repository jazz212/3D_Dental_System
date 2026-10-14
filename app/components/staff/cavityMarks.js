import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { isLowerTooth } from "@/lib/cavityClasses";

// Puts the dentist's drawings onto the 3D teeth. Each drawing is a red mark
// cut out of the class sheets together with its tooth's outline, so laying
// the picture over the whole 3D tooth (seen from the same side as on the
// sheet) puts the mark where the dentist drew it.
//
// The pictures are white with transparency and tinted by the material, so
// one picture serves both red (caries) and blue (restoration).

const MARKS_FOLDER = "/models/cavity-marks";

// Biting-surface drawings only cover the top of the crown, not the roots.
const OCCLUSAL_DEPTH_SHARE = 0.3;

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();
const materialCache = new Map();

// The viewer only redraws when something changes, and a picture arriving
// after its mark was placed is such a change, so it gets told.
const imageLoadedListeners = new Set();

// Calls listener() each time a mark picture finishes loading.
// Returns a function that stops the calls.
export function onMarkImageLoaded(listener) {
  imageLoadedListeners.add(listener);
  return () => imageLoadedListeners.delete(listener);
}

function textureFor(image) {
  if (!textureCache.has(image)) {
    const texture = textureLoader.load(`${MARKS_FOLDER}/${image}.png`, () => {
      imageLoadedListeners.forEach((listener) => listener());
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(image, texture);
  }
  return textureCache.get(image);
}

// polygonOffset pulls the mark slightly towards the camera so it isn't
// hidden inside the tooth surface it lies on.
function materialFor(image, color) {
  const key = `${image}|${color}`;
  if (!materialCache.has(key)) {
    materialCache.set(
      key,
      new THREE.MeshStandardMaterial({
        map: textureFor(image),
        color,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        roughness: 0.5,
      })
    );
  }
  return materialCache.get(key);
}

// One mesh per drawing (class 3 and 4 have two: front and back).
export function createMarkMeshes({ toothMesh, toothNumber, drawings, color }) {
  const directions = toothDirections(toothMesh, toothNumber);
  return drawings.map((drawing) => {
    const frame = pictureFrame(drawing, directions, toothNumber);
    const box = measureAlong(toothMesh, frame);
    const decal = new DecalGeometry(toothMesh, box.center, box.orientation, box.size);
    const geometry = keepFacing(decal, frame.facing);
    decal.dispose();
    return new THREE.Mesh(geometry, materialFor(drawing.image, color));
  });
}

// The tooth's own directions, flat (no up/down part):
// mesial = towards the front middle of the arch, buccal = out to the cheek.
function toothDirections(toothMesh, toothNumber) {
  const dentition = toothMesh.parent;
  const centerOf = (number) => {
    const mesh = dentition.getObjectByName(`tooth-${number}`) ?? toothMesh;
    return new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
  };

  // The two front teeth (x1) sit next to each other's front tooth.
  const quadrant = Math.floor(toothNumber / 10);
  const position = toothNumber % 10;
  const oppositeQuadrant = quadrant % 2 === 1 ? quadrant + 1 : quadrant - 1;
  const frontNeighbour = position === 1 ? oppositeQuadrant * 10 + 1 : toothNumber - 1;
  const backNeighbour = toothNumber + 1;
  const mesial = centerOf(frontNeighbour).sub(centerOf(backNeighbour)).setY(0).normalize();

  // Perpendicular to the arch; flipped if it points into the mouth.
  const up = new THREE.Vector3(0, 1, 0);
  const buccal = new THREE.Vector3().crossVectors(mesial, up).normalize();
  const archCenter = new THREE.Box3().setFromObject(dentition).getCenter(new THREE.Vector3());
  const outwards = centerOf(toothNumber).sub(archCenter).setY(0);
  if (buccal.dot(outwards) < 0) buccal.negate();

  return { mesial, buccal, up };
}

// How the picture lies over the tooth, following how the sheets are drawn:
// - facial: seen from outside, mesial on the picture's right, root side up
//   on upper teeth (lower teeth are drawn root down, which is also +Y).
// - lingual: seen from the tongue, so mesial is on the picture's left.
// - occlusal: seen from the biting side, mesial on the right, cheek up.
// facing: the side the drawing is seen from; the rest is removed.
function pictureFrame(drawing, { mesial, buccal, up }, toothNumber) {
  const pictureUp = drawing.flipVertical ? up.clone().negate() : up.clone();
  if (drawing.view === "facial") {
    return { right: mesial.clone(), up: pictureUp, facing: buccal.clone(), view: "facial" };
  }
  if (drawing.view === "lingual") {
    return { right: mesial.clone().negate(), up: pictureUp, facing: buccal.clone().negate(), view: "lingual" };
  }
  const bitingSide = new THREE.Vector3(0, isLowerTooth(toothNumber) ? 1 : -1, 0);
  return { right: mesial.clone(), up: buccal.clone(), facing: bitingSide, view: "occlusal" };
}

// The projection box: the tooth's outline seen from the picture's side, so
// the picture (cropped to the tooth outline on the sheet) stretches over it.
function measureAlong(toothMesh, frame) {
  const positions = toothMesh.geometry.getAttribute("position");
  const vertex = new THREE.Vector3();
  const range = {
    right: [Infinity, -Infinity],
    up: [Infinity, -Infinity],
    facing: [Infinity, -Infinity],
  };
  for (let index = 0; index < positions.count; index++) {
    vertex.fromBufferAttribute(positions, index).applyMatrix4(toothMesh.matrixWorld);
    for (const axis of ["right", "up", "facing"]) {
      const distance = vertex.dot(frame[axis]);
      range[axis][0] = Math.min(range[axis][0], distance);
      range[axis][1] = Math.max(range[axis][1], distance);
    }
  }

  const width = range.right[1] - range.right[0];
  const height = range.up[1] - range.up[0];
  const toothDepth = range.facing[1] - range.facing[0];
  // Side views go through the whole tooth; the far side is removed later.
  // The biting-surface view only reaches the top of the crown.
  const depth = frame.view === "occlusal" ? toothDepth * OCCLUSAL_DEPTH_SHARE : toothDepth;
  const facingMiddle = frame.view === "occlusal" ? range.facing[1] - depth / 2 : (range.facing[0] + range.facing[1]) / 2;

  const center = new THREE.Vector3()
    .addScaledVector(frame.right, (range.right[0] + range.right[1]) / 2)
    .addScaledVector(frame.up, (range.up[0] + range.up[1]) / 2)
    .addScaledVector(frame.facing, facingMiddle);

  const outOfPicture = new THREE.Vector3().crossVectors(frame.right, frame.up);
  const orientation = new THREE.Euler().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(frame.right, frame.up, outOfPicture)
  );
  return { center, orientation, size: new THREE.Vector3(width, height, depth) };
}

// Keeps only the triangles of the mark that face the side it is seen from,
// so a mark on the front of a tooth doesn't also appear on its back.
function keepFacing(decal, facing) {
  const positions = decal.getAttribute("position");
  const normals = decal.getAttribute("normal");
  const uvs = decal.getAttribute("uv");
  const kept = { position: [], normal: [], uv: [] };
  const triangleNormal = new THREE.Vector3();

  for (let vertex = 0; vertex < positions.count; vertex += 3) {
    triangleNormal.set(0, 0, 0);
    for (let corner = 0; corner < 3; corner++) {
      triangleNormal.x += normals.getX(vertex + corner);
      triangleNormal.y += normals.getY(vertex + corner);
      triangleNormal.z += normals.getZ(vertex + corner);
    }
    if (triangleNormal.dot(facing) <= 0) continue;

    for (let corner = 0; corner < 3; corner++) {
      const index = vertex + corner;
      kept.position.push(positions.getX(index), positions.getY(index), positions.getZ(index));
      kept.normal.push(normals.getX(index), normals.getY(index), normals.getZ(index));
      kept.uv.push(uvs.getX(index), uvs.getY(index));
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(kept.position, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(kept.normal, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(kept.uv, 2));
  return geometry;
}
