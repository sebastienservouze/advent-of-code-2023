import * as THREE from 'three';
import input from './input.txt?raw';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

THREE.Mesh.prototype.overlap = function(mesh) {
    let bbA = this.geometry.boundingBox;
    let bbB = mesh.geometry.boundingBox;

    let x1A = this.position.x + bbA.min.x;
    let x2A = this.position.x + bbA.max.x;
    let y1A = this.position.y + bbA.min.y;
    let y2A = this.position.y + bbA.max.y;
    let z1A = this.position.z + bbA.min.z;
    let z2A = this.position.z + bbA.max.z;

    let x1B = mesh.position.x + bbB.min.x;
    let x2B = mesh.position.x + bbB.max.x;
    let y1B = mesh.position.y + bbB.min.y;
    let y2B = mesh.position.y + bbB.max.y;
    let z1B = mesh.position.z + bbB.min.z;
    let z2B = mesh.position.z + bbB.max.z;

    x1A = +x1A.toFixed(2);
    y1A = +y1A.toFixed(2);
    z1A = +z1A.toFixed(2);

    x2A = +x2A.toFixed(2);
    y2A = +y2A.toFixed(2);
    z2A = +z2A.toFixed(2);

    x1B = +x1B.toFixed(2);
    y1B = +y1B.toFixed(2);
    z1B = +z1B.toFixed(2);

    x2B = +x2B.toFixed(2);
    y2B = +y2B.toFixed(2);
    z2B = +z2B.toFixed(2);

    let overlapX = x1A < x2B && x2A > x1B;
    let overlapY = y1A < y2B && y2A > y1B;
    let overlapZ = z1A < z2B && z2A > z1B;

    return overlapX && overlapY && overlapZ;
}

let answer = 0;
let lines = input.split('\r\n');

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true});
const bricks = lines.map(getBoxFromLine);
bricks.forEach(b => scene.add(b));
const ground = getGround();
scene.add(ground);
sceneSetup();

// Constantes
const FALL_SPEED = 10;

console.log(`Answer is '${answer}'`);

// Boucle d'affichage
render();

/*
 * Fonctions
 */

function update() {
    let collisions = new Set();
    let deltaTime = 1/50

    // Check des collisions
    bricks.forEach((a, i) => {
        if (a.overlap(ground)) {
            collisions.add(i);
        }

        bricks.forEach((b, j) => {
            if (i === j) return;
    
            if (collisions.has(i)) return;

            if (a.overlap(b)) {
                collisions.add(i);
                collisions.add(j);
            }
        })
    })

    bricks.forEach((brick, i) => {
        if (!collisions.has(i)) {
            brick.translateZ(-FALL_SPEED * deltaTime);
        }
    });
}

/*
 * Three.js 
 */

function getBoxFromLine(line, i) {
    let split = line.split('~');
    let start = split[0].split(',').map(v => +v);
    let end = split[1].split(',').map(v => +v);
    let w = end[0] - start[0] + 1;
    let h = end[1] - start[1] + 1;
    let d = end[2] - start[2] + 1;

    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshPhongMaterial( { color: Math.random() * 0xFFFFFF } );
    const cube = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    cube.castShadow = true;
    cube.position.set(start[0] + w / 2, start[1] + h / 2, start[2] + d / 2);
    cube.name = 'Brique' + i;

    console.log(cube.geometry.boundingBox);
    return cube;
}

function getGround() {
    const geometry = new THREE.BoxGeometry(20, 20, .1);
    const material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
    const cube = new THREE.Mesh(geometry, material);
    geometry.computeBoundingBox();
    cube.castShadow = true;
    cube.name = 'Sol';

    return cube;
}

function render() {
	requestAnimationFrame(render);
    update();
	renderer.render(scene, camera);
}

function sceneSetup() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0xFFFFFF);

    const directionalLight = new THREE.DirectionalLight(0xffffff, Math.PI * 2);
    directionalLight.translateY(-5)
    directionalLight.translateX(5)
    directionalLight.translateZ(5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, Math.PI);
    directionalLight2.translateY(5)
    directionalLight2.translateX(-5);
    scene.add(directionalLight2);
    
    const axes = new THREE.AxesHelper(500);
    //axes.position.set(-5, -5, 0);
    scene.add(axes);

    camera.position.z = 10;
    camera.position.y = -5;
    camera.position.x = 0;
    let middle = getMiddleXY(bricks);
    camera.lookAt(middle[0], middle[1], 0);
    //camera.rotateZ(Math.PI)

    new OrbitControls(camera, renderer.domElement);
}

function getMiddleXY(bricks) {
    let minX = bricks[0].position.x;
    let maxX = bricks[0].position.x;
    let minY = bricks[0].position.y;
    let maxY = bricks[0].position.y;
    bricks.forEach(brick => {
        minX = Math.min(brick.position.x, minX);
        maxX = Math.min(brick.position.x, minX);
        minY = Math.min(brick.position.y, minY);
        maxY = Math.min(brick.position.y, maxY);
    })

    return [maxX - minX / 2, maxY - minY / 2];
}
