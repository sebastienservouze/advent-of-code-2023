import { readInput } from "../inputReader.js";

let input = readInput(16);
let answer = 0;

let map = input.split('\r\n');

let direction = [ 1, 0 ];
let coords = [0, 0];
let energizedTiles = new Set();
energizedTiles.add(JSON.stringify([coords, direction]));

const X = 0;
const Y = 1

let iterations = 0;
progress(coords, direction, iterations);
let energizedTilesNoDup = removeDuplicateCoords(energizedTiles);

answer = energizedTilesNoDup.size;

console.log(`Answer is '${answer}'`);

function progress(coords, currentDirection) {
    let directions = getDirectionsFromTile(map[coords[Y]][coords[X]], currentDirection);

    directions.forEach(direction => {
        let newCoords = [coords[X] + direction[X], coords[Y] + direction[Y]];
        //console.log(`[${map[coords[Y]][coords[X]]}] ${coords} > ${newCoords}`);

        if (isInMap(newCoords) && !energizedTiles.has(JSON.stringify([newCoords, direction]))) {
            energizedTiles.add(JSON.stringify([newCoords, direction]));
            progress(newCoords, direction, iterations);
        }
    })

    if (iterations % 100 === 0) {
        console.log(iterations);
    }

    iterations++;
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
    energizedTilesWithDir = [...energizedTiles];
    for (let i = 0; i < energizedTilesWithDir.length; i++) {
        if (!energizedTilesNoDup.has(JSON.stringify(JSON.parse(energizedTilesWithDir[i])[0]))) {
            energizedTilesNoDup.add(JSON.stringify(JSON.parse(energizedTilesWithDir[i])[0]));
        }
    }

    return energizedTilesNoDup;
}

function isInMap(coords) {
    return coords[X] >= 0 && coords[X] < map[0].length && coords[Y] >= 0 && coords[Y] < map.length;
}