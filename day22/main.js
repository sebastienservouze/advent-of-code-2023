import * as THREE from 'three';
import input from './input.txt?raw';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let answer = 0;
let lines = input.split('\r\n');

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const clock = new THREE.Clock(true);
sceneSetup();

// Cosntantes
const FALL_SPEED = 2;

// Ajoute un sol
let ground = getGround();
scene.add(ground);

// Créer les briques
let bricks = lines.map(getBoxFromLine);
bricks.sort((a, b) => a.position.z - b.position.z);

// Les ajoute à la scene
bricks.forEach(b => scene.add(b));

console.log(`Answer is '${answer}'`);

// Boucle d'affichage
render();


function update() {
    let deltaTime = clock.getDelta();

    bricks.forEach(brick => {
        brick.updateMatrix();
        brick.updateMatrixWorld();
    })

    bricks.forEach((a, i) => {
        bricks.forEach((b, j) => {
            let aa = new THREE.Box3().setFromObject(a);
            let bb = new THREE.Box3().setFromObject(b);

            if (i === j) return;
            
            if (aa.intersectsBox(ground.geometry.boundingBox)) {
                return;
            } 
            
            if (aa.intersectsBox(bb)) {
                console.error(`${a.name} x ${b.name} > ${JSON.stringify(aa.min)} | ${JSON.stringify(bb.min)}`);
            } else {
                console.info(`${a.name} x ${b.name} > ${JSON.stringify(aa.min)} | ${JSON.stringify(bb.min)}`);
                a.translateZ(-FALL_SPEED * deltaTime);
            }
        })
    })
}

/*
 * Three.js 
 */

function getBoxFromLine(line, i) {
    let split = line.split('~');
    let start = split[0].split(',').map(v => +v);
    let end = split[1].split(',').map(v => +v);

    const geometry = new THREE.BoxGeometry(end[0] - start[0] + 1, end[1] - start[1] + 1, end[2] - start[2] + 1);
    const material = new THREE.MeshPhongMaterial( { color: 0xFF9B50 } );
    const cube = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    cube.castShadow = true;
    cube.position.set(start[0], start[1], start[2]);
    cube.name = 'Brique' + i;
    return cube;
}

function getGround() {
    const geometry = new THREE.BoxGeometry(10, 10, .05);
    const material = new THREE.MeshPhongMaterial( { color: 0x888888 } );
    const cube = new THREE.Mesh(geometry, material)
    geometry.computeBoundingBox();
    cube.receiveShadow = true;
    return cube;
}

function render() {
    update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

function sceneSetup() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0);

    const directionalLight = new THREE.DirectionalLight(0xffffff, Math.PI);
    directionalLight.translateY(-5)
    directionalLight.translateX(5)
    directionalLight.translateZ(5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, Math.PI / 2);
    directionalLight2.translateY(5)
    directionalLight2.translateZ(-5);
    scene.add(directionalLight2);
    
    const axes = new THREE.AxesHelper(500);
    axes.position.set(-5, -5, 0);
    scene.add(axes);

    camera.position.z = 5;
    camera.position.y = -10;
    camera.lookAt(0,0,0);

    new OrbitControls(camera, renderer.domElement);
}