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
    progress(energizedTiles, coords, direction);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    maxEnergizedTiles = Math.max(maxEnergizedTiles, removeDuplicateCoords(energizedTiles).size);

    energizedTiles.clear();
    coords = [map.length - 1, y];
    direction = [ -1, 0 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    maxEnergizedTiles = Math.max(maxEnergizedTiles, removeDuplicateCoords(energizedTiles).size);
}

// En partant du haut et du bas
for (let x = 0; x < map[0].length; x++) {
    let energizedTiles = new Set();
    let coords = [x, 0];
    let direction = [ 0, 1 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    let nbEnergizedTiles = removeDuplicateCoords(energizedTiles).size;
    maxEnergizedTiles = Math.max(maxEnergizedTiles, nbEnergizedTiles);

    energizedTiles.clear();
    coords = [x, map.length - 1];
    direction = [ 0, -1 ];
    energizedTiles.add([coords, direction].join('#'));
    progress(energizedTiles, coords, direction);
    allEnergizedTilesKnown.push(new Set(energizedTiles));
    nbEnergizedTiles = removeDuplicateCoords(energizedTiles).size;
    maxEnergizedTiles = Math.max(maxEnergizedTiles, nbEnergizedTiles);
}

answer = maxEnergizedTiles;

console.log(`Answer is '${answer}'`);

function progress(energizedTiles, coords, currentDirection) {
    let directions = getDirectionsFromTile(map[coords[Y]][coords[X]], currentDirection);

    directions.forEach(direction => {
        let newCoords = [coords[X] + direction[X], coords[Y] + direction[Y]];
       
        if (!isInMap(newCoords)) return;

        for (let i = 0; i < allEnergizedTilesKnown.length; i++) {
            if (allEnergizedTilesKnown[i].has([newCoords, direction].join('#'))) {
                let copy = [...allEnergizedTilesKnown[i]];
                console.log(copy);
                let indexOfTile = copy.findIndex(elem => elem === [newCoords, direction].join('#'));
                for (let j = indexOfTile; j < copy.length; j++) {
                    energizedTiles.add(copy[j]);
                }

                console.log(`Known ! ${energizedTiles.size}`);

                return;
            }
        }

        if (!energizedTiles.has([newCoords, direction].join('#'))) {
            console.log([newCoords, direction].join('#'));
            energizedTiles.add([newCoords, direction].join('#'));
            progress(energizedTiles, newCoords, direction);
        }
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