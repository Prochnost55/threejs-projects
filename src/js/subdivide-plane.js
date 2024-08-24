import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

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

camera.position.set(0, 20 , 30);
orbitControls.update();

const ambietLight =  new THREE.AmbientLight(0x333333);
scene.add(ambietLight);

const directionLight =  new THREE.DirectionalLight(0xffffff);
scene.add(directionLight);
directionLight.position.set(0, 30, 0);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20), 
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


const sphereMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 4, 2),
    new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xffea00
    })
);

const objects = [];

window.addEventListener('mousedown', (e) => {
    const objectExists = objects.find((obj) => {
        const {x, z} = obj.position;
        const {x: x1, z: z1} = unitSquare.position;

        return x === x1 && z === z1;
    })

    if (!objectExists){
        intersects.forEach((intersect) => {
            if(intersect.object.name === 'ground'){
                const sphereClone = sphereMesh.clone();
                sphereClone.position.set(unitSquare.position.x, 1, unitSquare.position.z)
                scene.add(sphereClone);
                objects.push(sphereClone)

                unitSquare.material.color.setHex(0xff0000);
            }
        })
    }

    console.log(scene.children.length)

   
})

function animate(time){
    unitSquare.material.opacity = 1 + Math.sin(time/120);
    objects.forEach(object => {
        object.rotation.x += 0.02;
        object.rotation.y += 0.02;
        object.rotation.z += 0.02;
        
        object.position.y = 0.5 + 1 * Math.abs(Math.sin(time/1000));
    })
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})