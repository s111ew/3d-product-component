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
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const directionalLightTwo = new THREE.DirectionalLight(0xffffff, 10);
directionalLightTwo.position.set(-5, -10, -5);
scene.add(directionalLightTwo);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
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
    console.log(surfaces); // <--------------------------SURFACES CONSOLE LOG
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasWidth, canvasHeight);
});

// Animate
function animate() {
  if (model) {
    model.rotation.y += 0.005; // Optional: add rotation to the model for effect
  }
  controls.update(); // Required for damping to work
  renderer.render(scene, camera);
}
