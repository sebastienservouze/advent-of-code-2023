import { readInput } from "../inputReader.js";
import canvas from 'canvas';
import fs from 'fs';

let input = readInput(18);
let answer = 0;

let lines = input.split('\r\n');

// Parse
let instructions = lines.map(line => {
    let split = line.split(' ');

    // Remap les instructions
    let hex = split[2].replace('(', '').replace(')', '');
    let length = parseInt(hex.substring(1, 6), 16);
    let dir = hex.substring(6, 7);

    return {
        dir: getDirFromNumber(dir),
        length
    }
})

const X = 0;
const Y = 1;

/*
 * ON S'AMUSE AUJOURD'HUI !!!! Triangulation au lieu d'utiliser les lacets, parce que j'avais envie, le reste c'est normal
 */

// Récupère tous les points
let points = [];
let bounds = 0;
instructions.forEach(instruction => {
    points.push(getPoint(points[points.length - 1], instruction.dir, instruction.length));
    bounds += instruction.length;
});

// Créer tous les triangles à partir des points
let triangles = earClippingTriangulation(points);

// Calcule l'aire de chaque triangle
let area = 0;
triangles.forEach(tri => area += getTriangleArea(tri[0], tri[1], tri[2], false));
area /= 2; // On ne veut pas de l'aire en due au padding

// Avec le théorème de pick, on trouve inbounds à partir de l'aire du polygon et du périmètre de celui ci
let inbounds = area - bounds / 2 + 1;

// Enfin, on ajoute les inbounds aux bounds pour récupérer la vraie aire
answer = inbounds + bounds;

// Visualisation
//visualize(points, triangles);

console.log(`Answer is '${Math.round(answer)}'`);


/**
 * Triangule le polygone. 
 * Tant qu'on a des points disponibles
 * 1. Prend trois points consécutif
 * 2. Calcul l'angle entre ces trois points
 * 3. Si il est < 180° et aucun autre point du polygone n'est contenu dans ce triangle, crée un triangle et retire les points du tableau de points
 * 4. Si il est >= 180° ou qu'un autre point du polygone est contenu dans ce triangle, retour à 1
 */
function earClippingTriangulation(points) {
    let unusedPoints = [...points];
    let triangles = [];
    let currentIndex = 0;

    // Tant qu'il reste + de trois points
    while (unusedPoints.length > 3) {

        // Prend trois points consécutifs
        let a = unusedPoints[currentIndex % unusedPoints.length];
        let b = unusedPoints[(currentIndex + 1) % unusedPoints.length];
        let c = unusedPoints[(currentIndex + 2) % unusedPoints.length];

        // Si l'angle est reflex, on incrémente currentIndex et on continue
        if (isReflexAngle(a, b, c)) {
            currentIndex++;
            continue;
        }

        // Est-ce qu'un autre point du polygone existe dans le triangle ?
        if (unusedPoints.some(p => isPointInsideTriangle(p, a, b, c))) {
            currentIndex++;
            continue;
        }

        // Ajout du triangle à la liste des triangles !
        triangles.push([a, b, c]);
        unusedPoints.splice((currentIndex + 1) % unusedPoints.length, 1);
        currentIndex = 0;
    }

    // Les trois derniers points forment forcément un triangle valide
    triangles.push([unusedPoints[0], unusedPoints[1], unusedPoints[2]]);

    return triangles;
}

/**
 * Check si un angle est reflex (> 180°) en calculant l'aire signée du triangle
 * Si celle ci est positive, c'est un angle reflex
 */
function isReflexAngle(a, b, c) { 
    return getTriangleArea(a, b, c, true) > 0;
}

/**
 * Calcul de l'air signée (ou non) d'un triangle
 */
function getTriangleArea(a, b, c, signed) {
    if (signed) return (b[Y] - a[Y]) * (c[X] - b[X]) - (b[X] - a[X]) * (c[Y] - b[Y]);
    return Math.abs((b[Y] - a[Y]) * (c[X] - b[X]) - (b[X] - a[X]) * (c[Y] - b[Y]));
}

/**
 * Barycentre
 */
function isPointInsideTriangle(p, a, b, c) {
    // Ne check pas les points du triangles eux même
    if (p[X] === a[X] && p[Y] === a[Y]) return false;
    if (p[X] === b[X] && p[Y] === b[Y]) return false;
    if (p[X] === c[X] && p[Y] === c[Y]) return false;

    let s = (a[X] - c[X]) * (p[Y] - c[Y]) - (a[Y] - c[Y]) * (p[X] - c[X]);
    let t = (b[X] - a[X]) * (p[Y] - a[Y]) - (b[Y] - a[Y]) * (p[X] - a[X]);

    if ((s < 0) != (t < 0) && s != 0 && t != 0) return false;

    let d = (c[X] - b[X]) * (p[Y] - b[Y]) - (c[Y] - b[Y]) * (p[X] - b[X]);
    let result = d == 0 || (d < 0) == (s + t <= 0);

    return result;
}

function getPoint(point, dir, length) {
    if (!point) point = [0, 0];

    let result = [point[X], point[Y]];
    result[X] += dir[X] * length;
    result[Y] += dir[Y] * length;

    return result;
}

function getDirFromNumber(number) {
    if (number === '0') return [1, 0];
    if (number === '2') return [-1, 0];
    if (number === '1') return [0, 1];
    if (number === '3') return [0, -1];
}

function visualize(path, triangles) {
    let copy = [...path];
    // Flemme de sort en même temps.. 
    copy.sort((a, b) => a[X] - b[X]);
    let minX = copy[0][X];
    let maxX = copy[path.length - 1][X] - minX;
    copy.sort((a, b) => a[Y] - b[Y]);
    let minY = copy[0][Y];
    let maxY = copy[path.length - 1][Y] - minY;

    const TARGET_WIDTH = 1600;
    const MULTIPLIER = TARGET_WIDTH / Math.max(maxX - minX, maxY - minY);

    const cv = canvas.createCanvas(maxX * MULTIPLIER + 1, maxY * MULTIPLIER + 1);
    const ctx = cv.getContext('2d');

    ctx.strokeStyle = '#FFF';
    ctx.fillStyle = '#FFF';
    ctx.font = '24px consolas'
    
    // Path
    ctx.beginPath();
    ctx.moveTo((path[0][X] - minX) * MULTIPLIER, (path[0][Y] - minY) * MULTIPLIER);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo((path[i][X] - minX) * MULTIPLIER, (path[i][Y] - minY) * MULTIPLIER);
    }
    ctx.closePath();
    ctx.stroke();

    // Triangles
    let colors = [
        '#FCC',
        '#FAA',
        '#F99',
        '#F77',
        '#F55',
        '#F33',
        '#CFC',
        '#AFA',
        '#9F9',
        '#7F7',
        '#5F5',
        '#3F3',
        '#CCF',
        '#AAF',
        '#99F',
        '#77F',
        '#55F',
        '#33F',
    ]
    triangles.forEach((tri, i) => {
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo((tri[0][X] - minX) * MULTIPLIER, (tri[0][Y] - minY) * MULTIPLIER);
        ctx.lineTo((tri[1][X] - minX) * MULTIPLIER, (tri[1][Y] - minY) * MULTIPLIER);
        ctx.lineTo((tri[2][X] - minX) * MULTIPLIER, (tri[2][Y] - minY) * MULTIPLIER);
        ctx.lineTo((tri[0][X] - minX) * MULTIPLIER, (tri[0][Y] - minY) * MULTIPLIER);
        ctx.closePath();
        ctx.stroke();
    })

    fs.writeFileSync('./visualisation.png', cv.toBuffer("image/png"));
}