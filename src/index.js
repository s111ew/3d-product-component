import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import modelPath from "./assets/model/Nike720.glb";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

// Camera
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(5, 2, 5); // Set a position to view the scene

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
const main = document.querySelector("main");
const productInfo = document.querySelector(".product-information");
main.insertBefore(renderer.domElement, productInfo);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Load Model
let model;
const loader = new GLTFLoader();
loader.load(
  modelPath,
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  if (model) {
    model.rotation.y += 0.01; // Optional: add rotation to the model for effect
  }
  controls.update(); // Required for damping to work
  renderer.render(scene, camera);
}
