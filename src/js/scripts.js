import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const hdrTextureURL = new URL('../img/MR_INT-003_Kitchen_Pierre.hdr', import.meta.url);

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

const orbitControls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20 , 30);
orbitControls.update();


renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

const loader = new RGBELoader();
loader.load(hdrTextureURL, function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture
    // scene.environment = texture
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(4, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0,
            metalness: 1
        })
    )
    sphere.position.x = 5
    scene.add(sphere);

    const sphere2 = new THREE.Mesh(
        new THREE.SphereGeometry(4, 50, 50),
        new THREE.MeshStandardMaterial({
            roughness: 0,
            metalness: 1,
            envMap: texture
        })
    )
    sphere2.position.x = -5
    scene.add(sphere2);

})
// const ambietLight =  new THREE.AmbientLight(0xededed, 0.8);
// scene.add(ambietLight);

// const directionLight =  new THREE.DirectionalLight(0xffffff);
// scene.add(directionLight);
// directionLight.position.set(0, 30, 0);

function animate(time){
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})