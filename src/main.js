import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

let scene, camera, renderer, controls, fpsControls;
let clock = new THREE.Clock();
let isFirstPerson = false;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9f9);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(1, 2, 3);

  const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 5);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const loader = new GLTFLoader();
  loader.load('/model/dress.glb', (gltf) => {
    const veste = gltf.scene;
    scene.add(veste);
    veste.position.set(0, 0, 0);
    veste.scale.set(1, 1, 1);
  });

  window.addEventListener('resize', onWindowResize);
  window.switchToFPS = switchToFPS; // rendre accessible à l’HTML
}

function switchToFPS() {
  controls.enabled = false;
  fpsControls = new FirstPersonControls(camera, renderer.domElement);
  fpsControls.lookSpeed = 0.1;
  fpsControls.movementSpeed = 0.5;
  fpsControls.lookVertical = true;
  isFirstPerson = true;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (isFirstPerson && fpsControls) {
    fpsControls.update(clock.getDelta());
  } else {
    controls.update();
  }
  renderer.render(scene, camera);
}