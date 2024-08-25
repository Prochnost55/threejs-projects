import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { FirstPersonControls, RGBELoader, SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// const hdrTextureURL = new URL('./assets/MR_INT-005_WhiteNeons_NAD.hdr', import.meta.url);

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
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 10);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper)


// use first person controls to find out the camera positions of the desired targets.

// const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
// firstPersonControls.movementSpeed = 8;
// firstPersonControls.lookSpeed = 0.08;

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart =  function(url, loaded, total){
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'flex';
}

loadingManager.onProgress = function(url, loaded, total){
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(loaded / total) * 400}px`;
}

loadingManager.onLoad = function(url, loaded, total){
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

const gltfLoader = new GLTFLoader(loadingManager);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

let position = 0;
gltfLoader.load('./assets/the_king_s_hall/scene.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // window.addEventListener('keydown', (e) => {
    //     console.log(e.key)
    //     if(e.key === 'Enter'){
    //         console.log(camera.position)
    //     }
    // })

    window.addEventListener('mouseup', function() {
        switch(position) {
            case 0:
                moveCamera(-1.8, 1.6, 5);
                rotateCamera(0, 0.1, 0);
                position = 1;
                break;
            case 1:
                moveCamera(2.8, 0, 3.6);
                rotateCamera(0, -2, 0);
                position = 2;
                break;
            case 2:
                moveCamera(2.5, -0.9, 12.2);
                rotateCamera(0.9, 0.6, -0.6);
                position = 3;
                break;
            case 3:
                moveCamera(-2.7, 0.6, 3.7);
                rotateCamera(0.6, 1.9, -0.6);
                position = 4;
                break;
            case 4:
                moveCamera(-1.7, 0, 8.7);
                rotateCamera(0, 4.7, 0);
                position = 5;
                break;
            case 5:
                moveCamera(0.5, 0.8, 10);
                rotateCamera(0.3, 1.65, -0.3);
                position = 0;
        }
        
    });
});


function moveCamera(x, y, z) {
    gsap.to(camera.position, {
        x,
        y,
        z,
        duration: 3
    });
}

function rotateCamera(x, y, z) {
    gsap.to(camera.rotation, {
        x,
        y,
        z,
        duration: 3.2
    });
}



const clock = new THREE.Clock();
function animate(time){
    const delta = clock.getDelta();
    // firstPersonControls && firstPersonControls.update(delta);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})