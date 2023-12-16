import { readInput } from "../inputReader.js";

let input = readInput(16);
let answer = 0;

let map = input.split('\r\n');

const X = 0;
const Y = 1
let maxEnergizedTiles = 0;

let allEnergizedTilesKnown = [];

// En partant de la gauche et de la droite
for (let y = 0; y < map.length; y++) {
    let energizedTiles = new Set();
    let coords = [0, y];
    let direction = [ 1, 0 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction, 0, 0, y);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    maxEnergizedTiles = Math.max(maxEnergizedTiles, removeDuplicateCoords(energizedTiles).size);

    energizedTiles.clear();
    coords = [map.length - 1, y];
    direction = [ -1, 0 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction, 0, 0, y);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    maxEnergizedTiles = Math.max(maxEnergizedTiles, removeDuplicateCoords(energizedTiles).size);

    console.log(`0:${y} = ${maxEnergizedTiles}`);
}

// En partant du haut et du bas
for (let x = 0; x < map[0].length; x++) {
    let energizedTiles = new Set();
    let coords = [x, 0];
    let direction = [ 0, 1 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction, 0, x, 0);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    let nbEnergizedTiles = removeDuplicateCoords(energizedTiles).size;
    maxEnergizedTiles = Math.max(maxEnergizedTiles, nbEnergizedTiles);

    energizedTiles.clear();
    coords = [x, map.length - 1];
    direction = [ 0, -1 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction, 0, x, 0);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    nbEnergizedTiles = removeDuplicateCoords(energizedTiles).size;
    maxEnergizedTiles = Math.max(maxEnergizedTiles, nbEnergizedTiles);

    console.log(`${x}:0 = ${maxEnergizedTiles}`);
}

answer = maxEnergizedTiles;

console.log(`Answer is '${answer}'`);

function progress(energizedTiles, coords, currentDirection, iterations, x, y) {
    let directions = getDirectionsFromTile(map[coords[Y]][coords[X]], currentDirection);

    directions.forEach(direction => {
        let newCoords = [coords[X] + direction[X], coords[Y] + direction[Y]];
       
        if (!isInMap(newCoords)) return;

        let pair = [newCoords, direction].join('#')
        if (!energizedTiles.has(pair)) {
            energizedTiles.add(pair);
            progress(energizedTiles, newCoords, direction, iterations, x, y);
        }

        iterations++;
    })
}

function getDirectionsFromTile(tile, currentDirection) {
    let nextDirections = [];
    switch (tile) {
        case '.':
            nextDirections.push([...currentDirection]);
            break;

        case '/':
            nextDirections.push([-currentDirection[Y], -currentDirection[X]]);
            break;

        case '\\':
            nextDirections.push([currentDirection[Y], currentDirection[X]]);
            break;
        
        case '-':
            if (currentDirection[X]) {
                nextDirections.push([...currentDirection])
            } else {
                nextDirections.push([-1, 0], [1, 0]);
            }
            break;

        case '|':
            if (currentDirection[Y]) {
                nextDirections.push([...currentDirection])
            } else {
                nextDirections.push([0, -1], [0, 1]);
            }
            break;
    }

    return nextDirections;
}

function removeDuplicateCoords(energizedTilesWithDir) {
    let energizedTilesNoDup = new Set();
    energizedTilesWithDir = [...energizedTilesWithDir];
    for (let i = 0; i < energizedTilesWithDir.length; i++) {
        if (!energizedTilesNoDup.has(energizedTilesWithDir[i].split('#')[0])) {
            energizedTilesNoDup.add(energizedTilesWithDir[i].split('#')[0]);
        }
    }

    return energizedTilesNoDup;
}

function isInMap(coords) {
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}