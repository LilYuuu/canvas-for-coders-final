import "./style.css";
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper";

// app
const app = document.querySelector("#app");

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// move
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe9f1ff);
scene.fog = new THREE.FogExp2(0xe9f1ff, 0.000358);

// raycast
let mouse = new THREE.Vector2(0, 0);
const raycaster = new THREE.Raycaster();
document.addEventListener(
  "mousemove",
  (ev) => {
    // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
    mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(sphereArray);

    // console.log(intersects);

    if (intersects.length > 0 && controls.isLocked == true) {
      console.log(intersects[0].object);
      let found = sphereArray.find((sphere) => {
        return sphere === intersects[0].object;
      });
      // info.style.color = "black";
      // TODO: change to corresponding info
      // info.innerHTML = infoArray[0];
      // info.style.display = "block";
    } else {
      // info.innerHTML = "";
      // info.style.display = "none";
    }
  },
  false
);

// camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  5000
);
camera.position.set(0, 600, -600);

// axis helper -> X: red, Y: green, Z: blue
// const axesHelper = new THREE.AxesHelper(50);
// axesHelper.position.y = 0.01; // above the ground slightly
// scene.add(axesHelper);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// directional light
const dirLight = new THREE.DirectionalLight("#5500ff", 0.1);
dirLight.position.set(-100, 100, 0);
scene.add(dirLight);
// const dirLighthelper = new THREE.DirectionalLightHelper(dirLight, 10);
// scene.add(dirLighthelper);

// point light
let pointLightIntensity = 0.5;
const pointLight = new THREE.PointLight(0xffffff, pointLightIntensity, 300);
pointLight.position.set(0, 100, 0);
scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
// scene.add(pointLightHelper);

let pointLightIntensity2 = 0.5;
const pointLight2 = new THREE.PointLight(0xffffff, pointLightIntensity2, 300);
pointLight2.position.set(1500, 100, 0);
scene.add(pointLight2);

// hemisphere light
const hemiLight = new THREE.HemisphereLight(0x000000, 0x00ffff, 1);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

// control
const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());
let blocker = document.getElementById("blocker");
let instructions = document.getElementById("instructions");
let info = document.getElementById("info");

initHTMLlayer();
initControlMove();

// sphereArray
let sphereArray = [];
const infoArray = [
  "<h3>A Mei (阿妹)</h3> <br> This song narrates a lost love story with tinges of nostalgia, and to bring out the authenticity of these sentiments, the song is therefore sung in the dialect of Wenzhou district. Many of us have been down the same road, we may have encountered someone at some point, should they be our first love or someone special with whom we’d made a commitment, but after a period of closeness, we drifted apart due to reality’s vagaries.",
  '<h3>Bu Ci Ka (站起来)</h3> <br> Disappointment is inevitable in life, but we must straighten our backs. Without too much foreshadowing and rhetoric, "Bu Ci Ka (Wenzhou dialect, means stand up)" is a very passionate work, a self-encouraging battle song. The pronunciation of the lyrics uses the author Jin Chengzhi\'s native Wenzhou dialect again - in this "Devil\'s Language", "stand up" is pronounced "bu ci ka", which is a bit funny at first, but as the work progresses, its power will be gradually released in the music.',
];

/*
////////////////////////////////////////////////////////////////////////////////
*/

// positional audio
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio(listener);
const sound2 = new THREE.PositionalAudio(listener);

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("/public/AMei.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setVolume(1);
  sound.setRefDistance(500); // the distance at which the volume reduction starts taking effect
  sound.setRolloffFactor(10); // value describing how quickly the volume is reduced as the source moves away from the listener
  sound.setLoop(true);
  // console.log(sound);
});
audioLoader.load("/public/BuCiKa.mp3", function (buffer) {
  sound2.setBuffer(buffer);
  sound2.setVolume(0.2);
  sound2.setRefDistance(500);
  sound2.setRolloffFactor(10);
  sound2.setLoop(true);
});

// start playing on user interaction - https://developer.chrome.com/blog/autoplay/#webaudio
const play = () => {
  if (sound.buffer && !sound.isPlaying) sound.play();
  if (sound2.buffer && !sound2.isPlaying) sound2.play();
};
window.addEventListener("click", play);

// spheres
const sphereGeometry = new THREE.SphereGeometry(5, 128, 128);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0xffffff,
});
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(0, 100, 0);
sphereMesh.scale.setScalar(5);
sphereMesh.add(sound);
scene.add(sphereMesh);
sphereArray.push(sphereMesh);

const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh2.position.set(1500, 100, 0);
sphereMesh2.scale.setScalar(5);
sphereMesh2.add(sound2);
scene.add(sphereMesh2);
sphereArray.push(sphereMesh2);

// console.log(sphereArray);
// console.log(infoArray);

// ground
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0.2,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI * 0.5;
scene.add(groundMesh);

////////////////////////////////////////////////////////////////////////////////

// resize
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.left = window.innerWidth / -2;
  // camera.right = window.innerWidth / 2;
  // camera.top = window.innerHeight / 2;
  // camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener("resize", onResize);

// animate
const animate = () => {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    console.log("contorls locked");
    const delta = (time - prevTime) / 100;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 1000.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 1000.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;
  }

  let dist = camera.position.distanceTo(sphereMesh.position);
  // console.log(dist);
  if (dist > 700) {
    pointLightIntensity = 0.5;
    // console.log("off");
    info.innerHTML = "";
    info.style.display = "none";
  } else {
    pointLightIntensity = 3;
    // TODO: change to corresponding info
    info.innerHTML = infoArray[0];
    info.style.display = "block";
    // console.log("on");
    // console.log("info: ", info);
  }
  pointLight.intensity = pointLightIntensity;

  let dist2 = camera.position.distanceTo(sphereMesh2.position);
  if (dist2 > 700) {
    pointLightIntensity2 = 0.5;
    // console.log("off");
    info2.innerHTML = "";
    info2.style.display = "none";
  } else {
    pointLightIntensity2 = 3;
    // console.log("on");
    info2.innerHTML = infoArray[1];
    info2.style.display = "block";
    // console.log("on");
    // console.log("info2: ", info2);
  }
  pointLight2.intensity = pointLightIntensity2;

  prevTime = time;

  renderer.render(scene, camera);
};

animate();

function initControlMove() {
  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
    }
  };
  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

function initHTMLlayer() {
  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    console.log("view control lock to mouse");
    instructions.style.display = "none";
    blocker.style.display = "none";
    // guider.style.display="block";
    // info.style.display='block';
    controls.pointerSpeed = 0.8;
  });

  controls.addEventListener("unlock", function () {
    console.log("view control unlock");
    instructions.style.display = "";
    blocker.style.display = "block";
    // guider.style.display="none";
    // info.style.display='none';
    controls.pointerSpeed = 0;
  });
}
