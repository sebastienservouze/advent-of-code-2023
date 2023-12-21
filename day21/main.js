import { readInput } from "../inputReader.js";
import { hashCode, measure, replaceAt } from "../utils.js";

let input = readInput(21);
let answer = 0;

let map = input.split('\r\n');

const X = 0;
const Y = 1
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
const MAX_STEPS = 6;
let step = 0;
measure('Chemins parcourus en', () => {
    while (step < MAX_STEPS) {
        step++;
        availaibleCells = getAvailaibleCells(availaibleCells);
        console.log(availaibleCells.size);
        visualize(availaibleCells);
    }
})

answer = availaibleCells.size;
console.log(`Answer is '${answer}'`);

function getAvailaibleCells(startCells) {
    let availaibleCells = new Map();

    // Pour chaque cellule de départ, récupère les cellules adjacentes
    startCells.forEach((cell, key) => {
        DIRECTIONS.forEach(dir => {
            let coords = getCoordsPlusDirection(cell, dir);
            if (isInMap(coords) && '.S'.includes(map[coords[Y]][coords[X]])) {
                availaibleCells.set(hashCode(coords.join(',')), coords);
            }
        })
    });

    return availaibleCells;
}

function getCoordsPlusDirection(coords, direction) {
    return [coords[X] + direction[X], coords[Y] + direction[Y]];
}

function isInMap(coords) {
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}

function visualize(availaibleCells) {
    let mapCopy = map.map(row => row);
    availaibleCells.forEach((cell, key) => {
        mapCopy[cell[Y]] = replaceAt(mapCopy[cell[Y]], cell[X], 'O');
    });

    console.log(mapCopy.join('\n'));
}