import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 30 , 30);
orbitControls.update();

const ambietLight =  new THREE.AmbientLight(0x333333);
scene.add(ambietLight);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});
const timeStep = 1/60;

// 3js object
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
}) 
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh)
// cannonjs object
const groundPhysMat = new CANNON.Material();
const groundBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)),
    // shape: new CANNON.Plane(),
    // mass: 10
    type: CANNON.Body.STATIC,
    material: groundPhysMat // material helps to define interaction between the two surfaces. This material is different than that of 3js material
})
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);




const boxGeometry = new THREE.BoxGeometry(2,2,2);
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
})
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);
const boxPhysMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)), // half of what is present in 3js. // todo: why?
    mass: 1,
    position: new CANNON.Vec3(1, 20, 0),
    material: boxPhysMat
})
world.addBody(boxBody);
boxBody.angularVelocity.set(0, 10, 0)
boxBody.angularDamping = 0.31




const sphereGeometry = new THREE.SphereGeometry(2);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
})
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);
const spherePhysMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2), // same of what is present in 3js. // todo: why?
    mass: 1,
    position: new CANNON.Vec3(0, 15, 0),
    material: spherePhysMat
})
world.addBody(sphereBody);
sphereBody.linearDamping = 0.1


const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.02}
);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.9}
);
world.addContactMaterial(groundBoxContactMat);
world.addContactMaterial(groundSphereContactMat);

function animate(){
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    sphereMesh.position.copy(sphereBody.position);
    sphereMesh.quaternion.copy(sphereBody.quaternion);

    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})