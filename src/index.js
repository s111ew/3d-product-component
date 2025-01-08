import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import modelPath from "/Nike720-1.glb";

let canvasWidth = 800;
let canvasHeight = 600;

const surfaceNames = [
  "primaryUpper",
  "secondaryUpper",
  "lining",
  "midsole",
  "outsole",
];

let surfaces = [];

let rotation = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

// Camera
const camera = new THREE.PerspectiveCamera(
  50,
  canvasWidth / canvasHeight,
  1,
  1000
);
camera.position.set(30, 5, 5); // Set a position to view the scene

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
const main = document.querySelector("main");
const productInfo = document.querySelector(".product-information");
renderer.domElement.style = "width: 800px; height: 600px;";
main.insertBefore(renderer.domElement, productInfo);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(1, 10, 1);
scene.add(directionalLight);

const directionalLightTwo = new THREE.DirectionalLight(0xffffff, 10);
directionalLightTwo.position.set(-1, -10, -1);
scene.add(directionalLightTwo);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Load Model
let model;
const loader = new GLTFLoader();
loader.load(
  modelPath,
  (gltf) => {
    model = gltf.scene;
    model.position.y = -5;
    model.traverse(function (obj) {
      if (surfaceNames.includes(obj.name)) {
        surfaces.push(obj);
      }
    });
    surfaces.forEach((surface) => {
      if (surface.type === "Group") {
        surface.children.forEach((child) => {
          child.material = child.material.clone();
        });
      } else {
        surface.material = surface.material.clone();
      }
    });
    modelHasLoaded();
    resetColours(surfaces);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

function populateOriginalColoursObj(surfaces) {
  for (let i = 0; i < surfaces.length; i++) {
    let originalColour;

    if (surfaces[i].type === "Group") {
      originalColour = surfaces[i].children[1].material.color.getHex();
    }

    if (surfaces[i].type === "Mesh") {
      originalColour = surfaces[i].material.color.getHex();
    }

    surfaces[i].originalColour = originalColour;
  }
}

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
});

// Animate
function animate() {
  if (model) {
    if (rotation) {
      model.rotation.y += 0.005;
    }
  }
  controls.update();
  renderer.render(scene, camera);
}

function addInputEventListener() {
  const inputs = document.querySelectorAll(".color-picker");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", () => {
      const hex = inputs[i].value.slice(1);
      const rgbString = convertHexToRGB(hex);
      const newColour = new THREE.Color(rgbString);
      let indexOfInput;
      for (let j = 0; j < surfaces.length; j++) {
        if (surfaces[j].name === inputs[i].name) {
          indexOfInput = j;
        }
      }
      changeMaterialColour(indexOfInput, newColour);
    });
  }
}

function convertHexToRGB(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function changeMaterialColour(surfaceIndex, colour) {
  if (!surfaces[surfaceIndex]) {
    console.log("Surfaces have not loaded yet");
    return;
  }

  if (surfaces[surfaceIndex].type === "Group") {
    surfaces[surfaceIndex].children.forEach((child) => {
      child.material.color.set(colour);
    });
    return;
  }
  surfaces[surfaceIndex].material.color.set(colour);
}

function resetColours() {
  for (let i = 0; i < surfaces.length; i++) {
    changeMaterialColour(i, surfaces[i].originalColour);
  }
  resetInputValues();
}

function addResetButtonListener() {
  const button = document.querySelector(".reset-button");
  button.addEventListener("click", resetColours);
}

function resetInputValues() {
  const inputs = document.querySelectorAll(".color-picker");
  const originalValues = [
    "#000000",
    "#ffffff",
    "#707073",
    "#ffffff",
    "#d1d1d1",
  ];
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = originalValues[i];
  }
}

function modelHasLoaded() {
  populateOriginalColoursObj(surfaces);
  addResetButtonListener();
  addInputEventListener();
  console.log(surfaces);
}
