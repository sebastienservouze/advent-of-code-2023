import { readInput } from "../inputReader.js";
import { hashCode, measure, replaceAt } from "../utils.js";

let input = readInput(21);
let answer = 0;

let map = input.split('\r\n');
const W = map[0].length;
const X = 0;
const Y = 1;

// Etend la map une fois pour pouvoir trouver le troisième terme 
for (let i = 0; i < 1; i++) {
    map = expandMap();
}

const START_Y = map.findIndex(rows => rows.includes('S'));
const START_X = map[START_Y].indexOf('S');
const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

let availaibleCells = new Map();
availaibleCells.set(hashCode(START_X + ',' + START_Y), [START_X, START_Y]);

let step = 0;
const TOTAL_STEPS = 26501365; 
const REPETITION_STEP = TOTAL_STEPS % W;
let terms = [];
measure('Chemins parcourus en', () => {
    // Fais trois itérations pour trouver les trois premiers termes de l'équation
    while (terms.length < 3) {
        step++;
        availaibleCells = getAvailaibleCells(availaibleCells);

        // Si le nombre d'étape est une répétition, ajoute le nombre des cellules actuelles à notre tableau
        if (step % W === REPETITION_STEP) {
            //visualize(availaibleCells);
            terms.push(availaibleCells.size);
        }
    }
})


// Résoud l'équation quadratique
let m = terms[1] - terms[0];
let n = terms[2] - terms[1];
let a = Math.floor((n - m) / 2);
let b = m - 3 * a;
let c = terms[0] - b - a;
let nbRepetitions = Math.ceil(TOTAL_STEPS / W);
answer = a * Math.pow(nbRepetitions, 2) + b * nbRepetitions + c;

console.log(terms);
console.log(nbRepetitions);
console.log(`Answer is '${answer}'`);



function getAvailaibleCells(startCells) {
    let availaibleCells = new Map();

    // Pour chaque cellule de départ, récupère les cellules adjacentes
    startCells.forEach((cell, key) => {
        DIRECTIONS.forEach(dir => {
            let coords = getCoordsPlusDirection(cell, dir);
            if ('.S'.includes(map[coords[Y]][coords[X]])) {
                availaibleCells.set(hashCode(coords.join(',')), coords);
            }
        })
    });

    return availaibleCells;
}

function isEdgeOfMap(cells) {
    let cellsAsArray = [...cells.values()];
    for (let i = 0; i < cellsAsArray.length; i++) {
        if (cellsAsArray[i][X] === 1 || cellsAsArray[i][Y] === 1 || cellsAsArray[i][X] === map[0].length - 1 || cellsAsArray[i][Y] === map.length - 1) {
            return true;
        }
    }

    return false;
}

function getCoordsPlusDirection(coords, direction) {
    let newX = coords[X] + direction[X];
    let newY = coords[Y] + direction[Y];

    // Revient de l'autre côté de la map
    if (newX < 0) newX = map[0].length - 1;
    else if (newX >= map[0].length) newX = 0;
    if (newY < 0) newY = map.length - 1;
    else if (newY >= map.length) newY = 0;

    return [newX, newY];
}

function visualize(availaibleCells) {
    let mapCopy = map.map(row => row);
    availaibleCells.forEach((cell, key) => {
        mapCopy[cell[Y]] = replaceAt(mapCopy[cell[Y]], cell[X], 'O');
    });

    console.log();
    console.log('Step', step);
    console.log('Disponibles', availaibleCells.size);
    console.log(mapCopy.join('\n'))
}

function expandMap() {
    const START_Y = map.findIndex(rows => rows.includes('S'));
    const START_X = map[START_Y].indexOf('S');
    let startCoords = [START_X + 2 * parseInt(map[0].length / 2) + map[0].length % 2, START_Y + 2 * parseInt(map.length / 2) + map.length % 2];
    let newMap = [];
    for (let y = 0; y < map.length * (2 + 1); y++) {
        newMap.push(map[y % map.length].repeat(2 + 1));
    }

    newMap = newMap.map(row => row.replaceAll('S', '.'));
    newMap[startCoords[Y]] = replaceAt(newMap[startCoords[Y]], startCoords[X], 'S');

    return newMap;
}