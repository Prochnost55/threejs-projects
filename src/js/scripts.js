import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

const fileUrl = new URL('../assets/Stag.gltf', import.meta.url);

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

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30), 
    new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, visible: false})
);
plane.rotateX(-Math.PI/2)
scene.add(plane);
plane.name = 'ground';
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper)


const unitSquare = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1), 
    new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, transparent: true})
);
unitSquare.rotateX(-Math.PI/2)
scene.add(unitSquare);
unitSquare.position.set(0.5, 0, 0.5);


const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();
let intersects;

document.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mousePosition, camera);
    intersects = rayCaster.intersectObjects(scene.children);
    intersects.forEach((intersect) => {
        if(intersect.object.name === 'ground'){
            const highlightedPosition = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            unitSquare.position.set(highlightedPosition.x, 0, highlightedPosition.z);

            const objectExists = objects.find((obj) => {
                const {x, z} = obj.position;
                const {x: x1, z: z1} = unitSquare.position;
        
                return x === x1 && z === z1;
            })

            if (!objectExists){ 
                unitSquare.material.color.setHex(0xffffff);
            } else {
                unitSquare.material.color.setHex(0xff0000);
            }

        }
    })
})

let stag;
let clips;
const assetLoader = new GLTFLoader();
assetLoader.load(fileUrl.href, function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    stag = model;
    clips = gltf.animations;
    
}, undefined, function(error) {
    console.error(error);
});

const objects = [];
const mixers = [];

window.addEventListener('mousedown', (e) => {
    const objectExists = objects.find((obj) => {
        const {x, z} = obj.position;
        const {x: x1, z: z1} = unitSquare.position;

        return x === x1 && z === z1;
    })

    if (!objectExists){
        intersects.forEach((intersect) => {
            if(intersect.object.name === 'ground'){
                const stagClone = SkeletonUtils.clone(stag);
                stagClone.position.set(unitSquare.position.x, 0, unitSquare.position.z)
                scene.add(stagClone);
                objects.push(stagClone)

                unitSquare.material.color.setHex(0xff0000);
                
                const mixer = new THREE.AnimationMixer(stagClone);
                const clip = THREE.AnimationClip.findByName(clips, 'Idle_2');
                const action = mixer.clipAction(clip);
                action.play();
                mixers.push(mixer)
            }
        })
    }

    console.log(scene.children.length)

   
})

const clock = new THREE.Clock();
function animate(time){
    unitSquare.material.opacity = 1 + Math.sin(time/120);
    const delta = clock.getDelta();
    mixers.forEach(function (mixer) {
        mixer.update(delta)
    })
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})