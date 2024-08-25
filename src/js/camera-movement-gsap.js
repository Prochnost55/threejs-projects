import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { RGBELoader, SkeletonUtils } from 'three/examples/jsm/Addons.js';
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

// const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 0 , 20);
// orbitControls.update();

const ambietLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambietLight);

const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

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

const mixers = [];

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('./assets/phoenix_bird/scene.gltf', (gltf) => {
    const phoenix = gltf.scene;
    phoenix.scale.set(0.01, 0.01, 0.01);
    
    const phoenix2 = SkeletonUtils.clone(phoenix);
    const phoenix3 = SkeletonUtils.clone(phoenix);

    scene.add(phoenix);
    scene.add(phoenix2);
    scene.add(phoenix3);

    phoenix2.position.set(7, -4, 6);
    phoenix3.position.set(-7, 4, -2);

    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Take 001");

    [phoenix, phoenix2, phoenix3].forEach((model, i) => {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(clip);
        action.play();
        action.startAt(i * 0.15);
        action.timeScale = 0.5;
        mixers.push(mixer);
    })
    
    window.addEventListener('mousedown', cameraAnimation);
});

const tl = gsap.timeline();
const duration = 8;
const ease = 'none';
let animationIsFinished = false;

function cameraAnimation () {
    if(!animationIsFinished){
        tl.to(camera.position, {
            x: 0,
            duration,
            ease
        })
        
        .to(camera.position, {
            y: 40, 
            z: 30,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        }, 8)

        .to(camera.position, {
            x: -10,
            y: 15, 
            z: 10,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        }, 8)

        .to(camera.position, {
            x: -30,
            y: 30, 
            z: 10,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        }, 8)

        .to(camera.position, {
            x: -40,
            y: 30, 
            z: -20,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        }, 14)

        .to(camera.position, {
            x: 5,
            y: 5, 
            z: -10,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        })

        .to(camera.position, {
            x: 5,
            y: 20, 
            z: 30,
            duration,
            ease,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        }, '>-0.2')
        
        .to(camera.position, {
            x: -20,
            duration: 12,
            ease,
            delay: 2,
            onUpdate: () => {
                camera.lookAt(0,0,0);
            }
        })
    }
}


const clock = new THREE.Clock();
function animate(time){
    const delta = clock.getDelta();
    mixers.forEach(mixer => {
        mixer.update(delta);
    })
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})