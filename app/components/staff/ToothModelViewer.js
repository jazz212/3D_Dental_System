"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  classAppliesToTooth,
  findClassOption,
  findCondition,
  isLowerTooth,
  markDrawingsFor,
} from "@/lib/cavityClasses";
import { createMarkMeshes, onMarkImageLoaded } from "./cavityMarks";
import { makeWisdomTooth } from "./wisdomTeeth";

// BodyParts3D 3.0 teeth, from Kevin Moerman's copy of the dataset
// (github.com/Kevin-Mattheus-Moerman/BodyParts3D). Each file is one tooth,
// named by its Foundational Model of Anatomy (FMA) id. The dataset has no
// wisdom teeth; 18, 28, 38 and 48 are made from the second molars instead.
const TEETH_FOLDER = "/models/bodyparts3d/teeth";

// FDI tooth number -> FMA file name.
const TOOTH_FILES = {
  11: "FMA55681", 12: "FMA55680", 13: "FMA55798", 14: "FMA55689",
  15: "FMA55688", 16: "FMA55698", 17: "FMA55697",
  21: "FMA55682", 22: "FMA55683", 23: "FMA55799", 24: "FMA55690",
  25: "FMA55691", 26: "FMA55699", 27: "FMA55700",
  31: "FMA57143", 32: "FMA57141", 33: "FMA55687", 34: "FMA55693",
  35: "FMA55692", 36: "FMA55704", 37: "FMA55703",
  41: "FMA57142", 42: "FMA57140", 43: "FMA55686", 44: "FMA55694",
  45: "FMA55695", 46: "FMA55705", 47: "FMA55706",
};

// A press that moves further than this (in pixels) is a drag to rotate,
// not a click on a tooth.
const CLICK_MOVE_LIMIT = 5;

const toothMaterial = new THREE.MeshStandardMaterial({ color: "#F4EFE3", roughness: 0.35 });

// Tinted enamel for teeth that can take the chosen finding (one per colour).
const hintMaterials = new Map();

function hintMaterialFor(hintColor) {
  if (!hintMaterials.has(hintColor)) {
    hintMaterials.set(hintColor, new THREE.MeshStandardMaterial({ color: hintColor, roughness: 0.35 }));
  }
  return hintMaterials.get(hintColor);
}

// Renders the teeth in a WebGL canvas that fills its parent, starting from
// the biting surfaces (occlusal view). Drag to rotate, scroll or pinch to zoom.
// arch: "upper", "lower" or "both". findings: marks to draw.
// selectedFinding: the chosen { classId, conditionId }, or null. While one
// is chosen, clicks place it and the teeth it can go on are tinted its colour.
// resetKey: change it to put the camera back to the starting view.
// Holding Space over the model makes drag move it instead of turning it.
// onToothClick(toothNumber, { keepChoice }) / onToothDoubleClick(toothNumber):
// a tooth was clicked / double-clicked. keepChoice is true for Shift-click.
export default function ToothModelViewer({
  arch = "upper",
  findings = [],
  selectedFinding = null,
  resetKey = "",
  onToothClick,
  onToothDoubleClick,
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  // The click handlers are set up once, so they read the latest callbacks here.
  const onToothClickRef = useRef(onToothClick);
  const onToothDoubleClickRef = useRef(onToothDoubleClick);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  // Space held while the pointer is over the model: drag moves it (grab).
  const [isGrabbing, setIsGrabbing] = useState(false);
  const isPointerOverRef = useRef(false);
  const isGrabbingRef = useRef(false);

  useEffect(() => {
    onToothClickRef.current = onToothClick;
    onToothDoubleClickRef.current = onToothDoubleClick;
  }, [onToothClick, onToothDoubleClick]);

  // Space only grabs while the pointer is over the model, so elsewhere it
  // still scrolls the page and presses buttons as usual. Over the model the
  // key is swallowed (page doesn't scroll, a focused picker button isn't
  // pressed). Leaving the window lets go, so grab mode can't get stuck.
  useEffect(() => {
    const isSpace = (event) => event.code === "Space";
    const setGrab = (isOn) => {
      isGrabbingRef.current = isOn;
      setIsGrabbing(isOn);
    };
    const handleKeyDown = (event) => {
      if (!isSpace(event) || !isPointerOverRef.current) return;
      event.preventDefault();
      if (!isGrabbingRef.current) setGrab(true);
    };
    const handleKeyUp = (event) => {
      if (!isSpace(event) || !isGrabbingRef.current) return;
      event.preventDefault();
      setGrab(false);
    };
    const letGo = () => setGrab(false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", letGo);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", letGo);
    };
  }, []);

  useEffect(() => {
    viewerRef.current?.setGrabMode(isGrabbing);
  }, [isGrabbing]);

  useEffect(() => {
    let ignore = false;
    const viewer = createViewer(containerRef.current, {
      onClick: (toothNumber, options) => onToothClickRef.current?.(toothNumber, options),
      onDoubleClick: (toothNumber) => onToothDoubleClickRef.current?.(toothNumber),
    });
    viewerRef.current = viewer;

    loadDentition()
      .then((arches) => {
        if (ignore) return;
        viewer.showModel(arches);
        setLoadState("ready");
      })
      .catch(() => {
        if (!ignore) setLoadState("error");
      });

    return () => {
      ignore = true;
      viewer.dispose();
    };
  }, []);

  useEffect(() => {
    if (loadState === "ready") viewerRef.current.showFindings(findings);
  }, [findings, loadState]);

  // A new resetKey (Reset view, or entering / leaving full screen) puts the
  // camera back to the starting view of the shown arch.
  useEffect(() => {
    if (loadState === "ready") viewerRef.current.showArch(arch);
  }, [arch, loadState, resetKey]);

  useEffect(() => {
    if (loadState === "ready") viewerRef.current.showHint(selectedFinding);
  }, [selectedFinding, loadState]);

  const cursorClass = isGrabbing
    ? "cursor-grab active:cursor-grabbing"
    : selectedFinding !== null
      ? "cursor-crosshair"
      : "";

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => (isPointerOverRef.current = true)}
      onPointerLeave={() => (isPointerOverRef.current = false)}
      className={`relative h-full w-full touch-none ${cursorClass}`}
    >
      {loadState === "loading" && (
        <p role="status" className="absolute inset-0 grid place-items-center text-gray-600">
          Loading 3D teeth...
        </p>
      )}
      {loadState === "error" && (
        <p role="alert" className="absolute inset-0 grid place-items-center p-6 text-center text-red-700">
          The 3D teeth couldn&apos;t be loaded. Check your internet connection, then reload the page.
        </p>
      )}
    </div>
  );
}

// Loads every tooth at once, one group per arch: { upper, lower }. Each mesh
// is named "tooth-<FDI number>" so a tooth can be found by its chart number.
async function loadDentition() {
  const loader = new STLLoader();
  const entries = Object.entries(TOOTH_FILES);
  const loaded = await Promise.all(
    entries.map(([, fileName]) => loader.loadAsync(`${TEETH_FOLDER}/${fileName}.stl`))
  );
  const geometryByNumber = new Map(entries.map(([number], index) => [Number(number), loaded[index]]));
  addWisdomTeeth(geometryByNumber);

  // BodyParts3D is Z-up with the face towards -Y; three.js is Y-up. Turning
  // -90 degrees about X stands the teeth upright, facing +Z (the camera).
  const arches = { upper: new THREE.Group(), lower: new THREE.Group() };
  Object.values(arches).forEach((arch) => (arch.rotation.x = -Math.PI / 2));

  geometryByNumber.forEach((geometry, toothNumber) => {
    geometry.computeVertexNormals();
    const tooth = new THREE.Mesh(geometry, toothMaterial);
    tooth.name = `tooth-${toothNumber}`;
    arches[isLowerTooth(toothNumber) ? "lower" : "upper"].add(tooth);
  });
  return arches;
}

// Adds 18, 28, 38 and 48, made from the second molars (see wisdomTeeth.js).
function addWisdomTeeth(geometryByNumber) {
  // Arch centres from the real teeth only, measured before any are added.
  const archBoxes = { upper: new THREE.Box3(), lower: new THREE.Box3() };
  geometryByNumber.forEach((geometry, toothNumber) => {
    geometry.computeBoundingBox();
    archBoxes[isLowerTooth(toothNumber) ? "lower" : "upper"].union(geometry.boundingBox);
  });

  for (const quadrant of [1, 2, 3, 4]) {
    const isUpper = quadrant <= 2;
    geometryByNumber.set(
      quadrant * 10 + 8,
      makeWisdomTooth({
        secondMolar: geometryByNumber.get(quadrant * 10 + 7),
        firstMolar: geometryByNumber.get(quadrant * 10 + 6),
        archCenter: archBoxes[isUpper ? "upper" : "lower"].getCenter(new THREE.Vector3()),
        isUpper,
      })
    );
  }
}

// Scene, camera, lights, controls, tooth clicks and the render loop.
// toothHandlers: { onClick(toothNumber, { keepChoice }), onDoubleClick(toothNumber) }.
function createViewer(container, toothHandlers) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Light grey (Tailwind gray-100) so the cream teeth stand off the background.
  renderer.setClearColor("#F3F4F6");
  // The canvas fills its box through CSS. A width in pixels would hold the
  // page layout open at whatever size it first had (too wide on phones).
  Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight("#FFFFFF", "#B0B0B0", 1.6));
  const keyLight = new THREE.DirectionalLight("#FFFFFF", 1.8);
  keyLight.position.set(40, 60, 100);
  scene.add(keyLight);

  // Units are millimetres, so near/far are set for a ~100 mm model.
  const camera = new THREE.PerspectiveCamera(35, 1, 1, 2000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Each arch hangs from a pivot at its own centre, so each can be turned to
  // show its biting side and moved into place on its own. Marks are attached
  // to their tooth, so they turn and hide with it.
  const pivots = { upper: new THREE.Group(), lower: new THREE.Group() };
  Object.values(pivots).forEach((pivot) => scene.add(pivot));
  let teeth = [];
  let teethByArch = null; // { upper: [...meshes], lower: [...meshes] }
  let archCenters = null; // each arch's centre while standing upright
  let archDepths = null; // each arch's front-to-back size
  let currentArch = "upper";
  let markMeshes = [];

  // Drawing a still picture 60 times a second wastes battery, so a frame is
  // only drawn when something on screen has changed. Camera moves are picked
  // up by the render loop; every other change asks for a frame here.
  let needsRender = true;
  const requestRender = () => (needsRender = true);

  const resize = () => {
    const { clientWidth, clientHeight } = container;
    // false: set the drawing size only, leave the CSS size at 100%.
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // Grab mode (Space held): left-drag moves the model instead of turning
  // it, and clicks don't place marks.
  let isGrabMode = false;

  const shownTeeth = () => teeth.filter((tooth) => tooth.visible);
  const stopClickTracking = trackToothClicks(
    renderer.domElement,
    camera,
    shownTeeth,
    toothHandlers,
    () => isGrabMode
  );

  const stopImageListening = onMarkImageLoaded(requestRender);

  // "change" fires on every camera move. Listening for it, rather than
  // checking what the loop's own controls.update() returns, matters for zoom:
  // the wheel and pinch handlers apply the whole zoom in their own update()
  // call, so the loop's call afterwards sees nothing left to move.
  controls.addEventListener("change", requestRender);

  // update() is still called every frame to play out the glide (damping)
  // after the user lets go; each step of it fires "change".
  renderer.setAnimationLoop(() => {
    controls.update();
    if (needsRender) {
      renderer.render(scene, camera);
      needsRender = false;
    }
  });

  // Both arches back to their natural, upright place (as loaded).
  const standUpright = () => {
    for (const arch of ["upper", "lower"]) {
      pivots[arch].rotation.x = 0;
      pivots[arch].position.copy(archCenters[arch]);
      pivots[arch].updateMatrixWorld(true);
    }
  };

  // Shows "upper", "lower" or "both" from the biting side, front teeth
  // pointing away from the other arch (upper: front teeth at the top, lower:
  // at the bottom) and the patient's right on the left, like a dental chart.
  // With both, the upper arch sits above the lower one. Doesn't move the
  // camera, so adding a mark keeps the view the user turned to.
  const layOut = (archChoice) => {
    const gap = 6; // millimetres between the two arches
    for (const arch of ["upper", "lower"]) {
      const isShown = archChoice === "both" || archChoice === arch;
      teethByArch[arch].forEach((tooth) => (tooth.visible = isShown));
      // Lower teeth bite upwards, upper teeth downwards: a quarter turn about
      // the left-right axis points either biting side at the camera.
      pivots[arch].rotation.x = arch === "lower" ? Math.PI / 2 : -Math.PI / 2;
      const offset = archChoice === "both" ? archDepths[arch] / 2 + gap / 2 : 0;
      pivots[arch].position.set(0, arch === "upper" ? offset : -offset, 0);
      pivots[arch].updateMatrixWorld(true);
    }
  };

  return {
    showModel(arches) {
      teethByArch = { upper: [...arches.upper.children], lower: [...arches.lower.children] };
      teeth = [...teethByArch.upper, ...teethByArch.lower];
      archCenters = {};
      archDepths = {};
      for (const arch of ["upper", "lower"]) {
        // pivot -> centring group -> arch: the centring group moves the
        // arch's centre onto the pivot, so turning the pivot turns the arch
        // about its own middle.
        arches[arch].updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(arches[arch]);
        archCenters[arch] = box.getCenter(new THREE.Vector3());
        archDepths[arch] = box.getSize(new THREE.Vector3()).z;
        const centring = new THREE.Group();
        centring.position.copy(archCenters[arch]).negate();
        centring.add(arches[arch]);
        pivots[arch].add(centring);
      }
      requestRender();
    },
    // Tints the teeth the chosen finding can go on (the same rule the page
    // uses to accept a click), so staff can see where it may be placed.
    // null puts every tooth back to plain enamel.
    showHint(selectedFinding) {
      const classOption = selectedFinding && findClassOption(selectedFinding.classId);
      const hintMaterial = selectedFinding && hintMaterialFor(findCondition(selectedFinding.conditionId).hintColor);
      teeth.forEach((tooth) => {
        const isMarkable = classOption && classAppliesToTooth(classOption, toothNumberOf(tooth));
        tooth.material = isMarkable ? hintMaterial : toothMaterial;
      });
      requestRender();
    },
    setGrabMode(isOn) {
      isGrabMode = isOn;
      controls.mouseButtons.LEFT = isOn ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    },
    // Switching arches also re-frames the camera on what is now shown.
    showArch(archChoice) {
      // Measure first: after entering full screen the canvas may have grown
      // before the resize observer has run, and framing needs the new shape.
      resize();
      currentArch = archChoice;
      layOut(archChoice);
      frameTeeth(shownTeeth(), camera, controls);
      requestRender();
    },
    // Rebuilds every mark from the findings list, so the model always
    // matches the list exactly (adding and removing work the same way).
    // The mark code expects upright teeth, so the arches stand upright
    // while the marks are built, then go back to the current layout.
    showFindings(findings) {
      clearMarks(markMeshes);
      standUpright();

      markMeshes = findings.flatMap((finding) => {
        const toothMesh = teeth.find((tooth) => toothNumberOf(tooth) === finding.toothNumber);
        if (!toothMesh) return [];
        const meshes = createMarkMeshes({
          toothMesh,
          toothNumber: finding.toothNumber,
          drawings: markDrawingsFor(finding.classId, finding.toothNumber),
          color: findCondition(finding.conditionId).color,
        });
        // Marks are built in world space; attaching them to the tooth keeps
        // them in the same place while it moves.
        const worldToTooth = toothMesh.matrixWorld.clone().invert();
        meshes.forEach((mesh) => {
          mesh.applyMatrix4(worldToTooth);
          toothMesh.add(mesh);
        });
        return meshes;
      });

      layOut(currentArch);
      requestRender();
    },
    dispose() {
      renderer.setAnimationLoop(null);
      stopClickTracking();
      stopImageListening();
      resizeObserver.disconnect();
      clearMarks(markMeshes);
      // Each visit loads its own copy of the teeth, so free this one's
      // graphics memory rather than letting copies pile up.
      teeth.forEach((tooth) => tooth.geometry.dispose());
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

// Marks share cached materials, so only their geometry is disposed.
function clearMarks(markMeshes) {
  markMeshes.forEach((mark) => {
    mark.removeFromParent();
    mark.geometry.dispose();
  });
}

const toothNumberOf = (toothMesh) => Number(toothMesh.name.replace("tooth-", ""));

// Reports the FDI number of a clicked or double-clicked tooth. getShownTeeth
// leaves out the hidden arch, so its teeth can't catch clicks.
// isPaused: true while clicks should do nothing (Space held to move the model).
function trackToothClicks(canvas, camera, getShownTeeth, { onClick, onDoubleClick }, isPaused) {
  const raycaster = new THREE.Raycaster();
  let pressStart = null;

  // FDI number of the shown tooth under the pointer, or null.
  const toothAt = (event) => {
    const bounds = canvas.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const [hit] = raycaster.intersectObjects(getShownTeeth(), false);
    return hit ? toothNumberOf(hit.object) : null;
  };

  const handlePointerDown = (event) => {
    pressStart = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event) => {
    if (!pressStart || isPaused()) return;
    const moved = Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y);
    pressStart = null;
    if (moved > CLICK_MOVE_LIMIT) return;
    const toothNumber = toothAt(event);
    // Shift-click: place the finding but keep it chosen for the next tooth.
    if (toothNumber !== null) onClick(toothNumber, { keepChoice: event.shiftKey });
  };

  const handleDoubleClick = (event) => {
    if (isPaused()) return;
    const toothNumber = toothAt(event);
    if (toothNumber !== null) onDoubleClick(toothNumber);
  };

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("dblclick", handleDoubleClick);
  return () => {
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointerup", handlePointerUp);
    canvas.removeEventListener("dblclick", handleDoubleClick);
  };
}

// Puts the camera straight in front of the given teeth, just far enough back
// for them to fit the canvas in both width and height (phones are narrow).
function frameTeeth(teethToShow, camera, controls) {
  const box = new THREE.Box3();
  teethToShow.forEach((tooth) => box.expandByObject(tooth));
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const halfViewHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const distanceForHeight = size.y / 2 / halfViewHeight;
  const distanceForWidth = size.x / 2 / (halfViewHeight * camera.aspect);
  const distance = Math.max(distanceForHeight, distanceForWidth) * 1.15 + size.z / 2;

  camera.position.set(center.x, center.y, center.z + distance);
  camera.lookAt(center);
  controls.target.copy(center);
  controls.minDistance = distance * 0.3;
  controls.maxDistance = distance * 3;
  controls.update();
}
