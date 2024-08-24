import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import nebula from '../img/nebula.jpg';
// Three js allocates a space where webgl can animate / perform 3d ops
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: true,
    speed: 0.01
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
const orbitControls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// scene.fog = new THREE.Fog(0xfffFFF, 0, 200)
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);


// renderer.setClearColor('white');
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(nebula);

const ambietLight = new THREE.AmbientLight(0x333333);
scene.add(ambietLight)

const directionLight = new THREE.DirectionalLight('white', 2);
scene.add(directionLight);
directionLight.position.set(-30, 50, 0)
directionLight.castShadow = true;
directionLight.shadow.camera.top = 15
directionLight.shadow.camera.bottom = -15
directionLight.shadow.camera.left = -15
directionLight.shadow.camera.right = 15



const dLightHelper = new THREE.DirectionalLightHelper(directionLight, 5);
scene.add(dLightHelper)

const dLightShadowHelper = new THREE.CameraHelper(directionLight.shadow.camera);
scene.add(dLightShadowHelper)

camera.position.set(10, 15 , 30);
orbitControls.update();

const boxGeometry = new THREE.BoxGeometry(2,2,2);
const boxMaterial = new THREE.MeshBasicMaterial({color: 'green'})
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);


const sphereGeometry = new THREE.SphereGeometry(3);
const sphereMaterial = new THREE.MeshStandardMaterial({
    // color: '#ffea00', 
    wireframe: false,
    map: textureLoader.load(nebula)
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(10, 10, 0);
sphere.castShadow = true;
gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange(e => {sphere.material.wireframe = e})
gui.add(options, 'speed', 0, 0.1);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 'white', side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);


let step = 0;

function animate(){
    box.rotation.x += 0.02;
    box.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate);