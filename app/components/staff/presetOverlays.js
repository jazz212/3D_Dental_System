import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// The 3D class presets as smooth overlay meshes. Each tooth's GLB
// (public/models/bodyparts3d/glb) holds the tooth plus one hidden child mesh
// per preset, named after the preset (userData.preset), in the same
// coordinates as the tooth's STL. Only the overlays are used: the viewer
// keeps drawing its own STL tooth and hangs the overlays under it, so they
// move, turn and hide with it.
const GLB_FOLDER = "/models/bodyparts3d/glb";

// The preset files are cached as immutable (next.config.mjs), so bump this
// whenever the GLBs or presets.json are replaced, or browsers keep the old ones.
export const PRESETS_VERSION = 2;

export const overlayUrlFor = (toothNumber, fmaFile) =>
  `${GLB_FOLDER}/tooth_${toothNumber}_${fmaFile}.glb?v=${PRESETS_VERSION}`;

// url -> promise of Map(presetName -> BufferGeometry). Each file is fetched
// once per page load; the wisdom teeth reuse their second molar's file.
const overlayCache = new Map();

export function loadPresetOverlays(url) {
  if (!overlayCache.has(url)) {
    const loading = new GLTFLoader().loadAsync(url).then((gltf) => overlayGeometriesOf(gltf.scene));
    // A failed load isn't kept, so the next visit tries again.
    loading.catch(() => overlayCache.delete(url));
    overlayCache.set(url, loading);
  }
  return overlayCache.get(url);
}

// presetName -> geometry of each overlay in a loaded GLB scene. The GLB's
// own tooth mesh (the one without userData.preset) is left out. Node
// transforms are baked in, so the geometry is in the tooth's STL coordinates
// even if a file ever comes with them.
export function overlayGeometriesOf(scene) {
  scene.updateMatrixWorld(true);
  const geometries = new Map();
  scene.traverse((object) => {
    const presetName = object.userData?.preset;
    if (!object.isMesh || !presetName) return;
    const geometry = object.geometry.clone();
    if (!object.matrixWorld.equals(IDENTITY)) geometry.applyMatrix4(object.matrixWorld);
    geometries.set(presetName, geometry);
  });
  return geometries;
}

const IDENTITY = new THREE.Matrix4();

// One hidden mesh per preset, ready to be added under the tooth mesh.
// placement: the matrix the viewer applied to the tooth's own geometry (a
// wisdom tooth made from the second molar), or null if it used the file
// as is. The overlays get exactly the same change so they stay on the surface.
// Returns Map(presetName -> Mesh).
export function makeOverlayMeshes(geometries, placement) {
  const meshes = new Map();
  geometries.forEach((geometry, presetName) => {
    const mesh = new THREE.Mesh(placement ? geometry.clone().applyMatrix4(placement) : geometry, overlayMaterial(null));
    mesh.name = `preset-${presetName}`;
    mesh.userData.preset = presetName;
    mesh.userData.ownsGeometry = Boolean(placement);
    mesh.visible = false;
    // Drawn after the tooth, so the polygon offset wins over its surface.
    mesh.renderOrder = 1;
    // Clicks go to the tooth underneath, never to an overlay.
    mesh.raycast = () => {};
    meshes.set(presetName, mesh);
  });
  return meshes;
}

// One material per colour, shared by every overlay of that colour. The
// polygon offset pulls the overlay towards the camera so it never z-fights
// with the tooth it lies on (it sits only ~0.035 mm above it).
const overlayMaterials = new Map();

export function overlayMaterial(hex) {
  const key = hex ?? "#FFFFFF";
  if (!overlayMaterials.has(key)) {
    overlayMaterials.set(
      key,
      new THREE.MeshStandardMaterial({
        color: key,
        roughness: 0.35,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
        depthWrite: true,
      })
    );
  }
  return overlayMaterials.get(key);
}
