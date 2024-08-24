import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

const fileUrl = new URL('../assets/Donkey.gltf', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

renderer.setClearColor(0xA3A3A3);

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20 , 30);
orbitControls.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const ambietLight =  new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambietLight);

const directionLight =  new THREE.DirectionalLight(0xffffff);
scene.add(directionLight);
directionLight.position.set(0, 30, 0);


const gui = new dat.GUI();

const assetLoader = new GLTFLoader();
assetLoader.load(fileUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});


// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);



function animate(time){
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})