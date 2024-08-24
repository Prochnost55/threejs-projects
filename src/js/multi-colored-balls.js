import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
})
const timeStep = 1/60;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 10 , 10);
orbitControls.update();

const ambietLight =  new THREE.AmbientLight(0x333333);
scene.add(ambietLight);

const directionLight =  new THREE.DirectionalLight(0xffffff);
scene.add(directionLight);
directionLight.position.set(0, 30, 0);
directionLight.castShadow = true;
directionLight.shadow.mapSize.width = 1024;
directionLight.shadow.mapSize.height = 1024;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// ground
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    // wireframe: true
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);
groundMesh.receiveShadow = true;
const groundBodyMaterial = new CANNON.Material()
const groundBody = new CANNON.Body({
    // mass: 5,
    shape: new CANNON.Box(new CANNON.Vec3(5,5,0.001)),
    type: CANNON.Body.STATIC,
    material: groundBodyMaterial
})
world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);




const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

const sphereBodies = [];
const sphereMeshes = [];

window.addEventListener('click', function(e){
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: Math.random() * 0xFFFFFF,
        metalness: 0,
        roughness: 0
    })
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.castShadow = true;
    sphereMeshes.push(sphereMesh);
    const sphereMaterial = new CANNON.Material({restitution: 0.2});
    const sphereBody = new CANNON.Body({
        mass: 0.5,
        shape: new CANNON.Sphere(0.125),
        material: sphereMaterial,
        position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
    });
    sphereBodies.push(sphereBody);
    world.addBody(sphereBody);
    sphereBody.linearDamping = 0.1;


    
    const planeSphereContactMaterial = new CANNON.ContactMaterial(groundBodyMaterial, sphereMaterial, {restitution: 0.2})
})


function animate(){
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

    for(let i = 0; i < sphereBodies.length; i++){
        sphereMeshes[i].position.copy(sphereBodies[i].position);
        sphereMeshes[i].quaternion.copy(sphereBodies[i].quaternion);
    }
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
