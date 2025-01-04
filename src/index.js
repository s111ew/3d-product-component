import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import modelPath from "/Nike720.glb";

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
    scene.add(model);
    model.traverse(function (obj) {
      if (surfaceNames.includes(obj.name)) {
        surfaces.push(obj);
      }
    });
    surfaces[1].material = surfaces[1].material.clone();
    console.log(surfaces); // <--------------------------SURFACES CONSOLE LOG
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

setTimeout(() => {
  changeMaterialColour(0, 0xff0000); // Change the color of a surface
  changeMaterialColour(4, 0xff0000); // Change the color of a surface
  changeMaterialColour(2, 0x0000f0);
  changeMaterialColour(1, 0x0000f0);
  changeMaterialColour(3, 0x0000f0);
}, 1500);

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
  controls.update(); // Required for damping to work
  renderer.render(scene, camera);
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
