import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// const hdrTextureURL = new URL('./assets/MR_INT-005_WhiteNeons_NAD.hdr', import.meta.url);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xA3A3A3);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 5 , 10);
orbitControls.update();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = function(url, loaded, total){
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(loaded / total) * 400}px`;
}

loadingManager.onLoad = function(url, loaded, total){
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

let carModel;
const gltfLoader = new GLTFLoader(loadingManager);

const rgbeLoader = new RGBELoader(loadingManager);
rgbeLoader.load('./assets/MR_INT-005_WhiteNeons_NAD.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // scene.background = texture
    gltfLoader.load('./assets/porsche_911_carrera_4s/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        carModel = model;
    })

}) 


function animate(time){
    if(carModel){
        carModel.rotation.y += 0.002;
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})